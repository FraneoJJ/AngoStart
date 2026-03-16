import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import UserOnlineIndicator from "./UserOnlineIndicator";
import VideoCallModal from "./VideoCallModal";
import {
  connectChatSocket,
  disconnectChatSocket,
  getAgoraToken,
  getCallHistory,
  getChatConversations,
  getChatMessages,
  getChatSocket,
  getOnlineUsers,
  sendChatMessageHttp,
} from "../../services/chatService";

function formatDateTime(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("pt-PT", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function toFriendlyChatError(raw) {
  const msg = String(raw || "").trim();
  if (!msg) return "Falha de comunicação. Tente novamente.";
  const lower = msg.toLowerCase();
  if (
    lower.includes("mysqld_stmt_execute")
    || lower.includes("sql")
    || lower.includes("er_")
    || lower.includes("incorrect arguments")
  ) {
    return "Não foi possível carregar a conversa agora. Atualize a página e tente novamente.";
  }
  return msg;
}

export default function ChatWindow({
  title = "Mensagens",
  contacts = [],
  currentUserId = 0,
  allowedUserIds = [],
  emptyText = "Sem conversas disponíveis.",
}) {
  const [localContacts, setLocalContacts] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState("");
  const [onlineSet, setOnlineSet] = useState(new Set());
  const [incomingCall, setIncomingCall] = useState(null);
  const [activeCall, setActiveCall] = useState(null);
  const [callBanner, setCallBanner] = useState("");
  const [callHistory, setCallHistory] = useState([]);
  const bottomRef = useRef(null);
  const ringtoneIntervalRef = useRef(null);

  const contactMap = useMemo(() => {
    const map = new Map();
    for (const c of contacts || []) {
      const id = Number(c.userId || c.id || 0);
      if (!id) continue;
      map.set(id, {
        userId: id,
        name: c.name || "Utilizador",
        role: c.role || "",
        subtitle: c.subtitle || "",
        avatarUrl: c.avatarUrl || null,
      });
    }
    for (const c of localContacts) {
      map.set(c.userId, c);
    }
    return map;
  }, [contacts, localContacts]);

  const mergedContacts = useMemo(() => {
    const list = Array.from(contactMap.values());
    if (!Array.isArray(allowedUserIds) || allowedUserIds.length === 0) return list;
    const allowed = new Set(allowedUserIds.map((n) => Number(n)).filter(Boolean));
    return list.filter((c) => allowed.has(Number(c.userId)));
  }, [contactMap, allowedUserIds]);
  const selectedContact = mergedContacts.find((c) => Number(c.userId) === Number(selectedUserId)) || null;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoadingContacts(true);
      setError("");
      try {
        const [serverConversations, onlineUsers] = await Promise.all([
          getChatConversations().catch(() => []),
          getOnlineUsers().catch(() => []),
        ]);
        if (!mounted) return;
        setLocalContacts((serverConversations || []).map((c) => ({
          userId: Number(c.userId),
          name: c.name || "Utilizador",
          role: c.role || "",
          subtitle: c.lastMessage || "",
          lastMessageAt: c.lastMessageAt || null,
        })));
        setOnlineSet(new Set((onlineUsers || []).map((n) => Number(n))));
      } catch (err) {
        if (!mounted) return;
        setError(toFriendlyChatError(err?.message || "Falha ao carregar conversas."));
      } finally {
        if (mounted) setLoadingContacts(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedUserId && mergedContacts.length > 0) {
      setSelectedUserId(mergedContacts[0].userId);
    }
  }, [mergedContacts, selectedUserId]);

  useEffect(() => {
    if (!selectedUserId) {
      setMessages([]);
      setCallHistory([]);
      return;
    }
    let mounted = true;
    (async () => {
      setLoadingMessages(true);
      try {
        const [data, calls] = await Promise.all([
          getChatMessages(selectedUserId),
          getCallHistory(selectedUserId).catch(() => []),
        ]);
        if (mounted) {
          setMessages(data || []);
          setCallHistory(calls || []);
        }
      } catch (err) {
        if (mounted) setError(toFriendlyChatError(err?.message || "Falha ao carregar mensagens."));
      } finally {
        if (mounted) setLoadingMessages(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [selectedUserId]);

  useEffect(() => {
    const socket = connectChatSocket();

    const onPresence = (payload) => {
      const ids = (payload?.onlineUserIds || []).map((n) => Number(n));
      setOnlineSet(new Set(ids));
    };

    const onChat = (msg) => {
      const senderId = Number(msg?.senderId || 0);
      const receiverId = Number(msg?.receiverId || 0);
      const target = Number(selectedUserId || 0);
      if (target && (senderId === target || receiverId === target)) {
        setMessages((prev) => [...prev, msg]);
      }
      setLocalContacts((prev) => {
        const idx = prev.findIndex((c) => Number(c.userId) === senderId || Number(c.userId) === receiverId);
        if (idx >= 0) {
          const copy = [...prev];
          copy[idx] = { ...copy[idx], subtitle: msg.message || "", lastMessageAt: msg.timestamp || null };
          return copy;
        }
        return prev;
      });
    };

    const onCallIncoming = (payload) => {
      setIncomingCall(payload || null);
    };
    const onCallAccepted = (payload) => {
      setCallBanner(`Chamada aceite por ${payload?.byUserId || "utilizador"}.`);
      setTimeout(() => setCallBanner(""), 3000);
    };
    const onCallRejected = () => {
      setCallBanner("A chamada foi rejeitada.");
      setTimeout(() => setCallBanner(""), 3000);
    };
    const onCallEnded = () => {
      setCallBanner("A chamada foi terminada pelo outro utilizador.");
      setTimeout(() => setCallBanner(""), 3000);
      setActiveCall(null);
    };

    socket.on("presence:snapshot", onPresence);
    socket.on("chat:new", onChat);
    socket.on("call:incoming", onCallIncoming);
    socket.on("call:accepted", onCallAccepted);
    socket.on("call:rejected", onCallRejected);
    socket.on("call:ended", onCallEnded);

    return () => {
      socket.off("presence:snapshot", onPresence);
      socket.off("chat:new", onChat);
      socket.off("call:incoming", onCallIncoming);
      socket.off("call:accepted", onCallAccepted);
      socket.off("call:rejected", onCallRejected);
      socket.off("call:ended", onCallEnded);
    };
  }, [selectedUserId]);

  useEffect(() => {
    return () => {
      disconnectChatSocket();
    };
  }, []);

  const playIncomingBeep = useCallback(() => {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      const ctx = new Ctx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = 840;
      gain.gain.value = 0.05;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      setTimeout(() => {
        osc.stop();
        ctx.close();
      }, 220);
    } catch {
      // silencioso
    }
  }, []);

  useEffect(() => {
    if (!incomingCall) {
      if (ringtoneIntervalRef.current) {
        clearInterval(ringtoneIntervalRef.current);
        ringtoneIntervalRef.current = null;
      }
      return;
    }
    playIncomingBeep();
    ringtoneIntervalRef.current = setInterval(playIncomingBeep, 1200);
    return () => {
      if (ringtoneIntervalRef.current) {
        clearInterval(ringtoneIntervalRef.current);
        ringtoneIntervalRef.current = null;
      }
    };
  }, [incomingCall, playIncomingBeep]);

  const sendMessage = async () => {
    if (!selectedContact || !text.trim()) return;
    const message = text.trim();
    setText("");
    const socket = getChatSocket();
    if (socket?.connected) {
      socket.emit("chat:send", { receiverId: selectedContact.userId, message }, (ack) => {
        if (!ack?.ok) setError(toFriendlyChatError(ack?.error || "Falha ao enviar mensagem."));
      });
      return;
    }
    try {
      const saved = await sendChatMessageHttp(selectedContact.userId, message);
      if (saved) setMessages((prev) => [...prev, saved]);
    } catch (err) {
      setError(toFriendlyChatError(err?.message || "Falha ao enviar mensagem."));
    }
  };

  const startCall = async (callType) => {
    if (!selectedContact) return;
    const min = Math.min(Number(selectedContact.userId), Date.now());
    const channelName = `angostart-${min}-${Date.now()}`;
    try {
      const session = await getAgoraToken(channelName, callType);
      const socket = getChatSocket();
      socket?.emit("call:invite", {
        toUserId: selectedContact.userId,
        channelName: session.channelName,
        callType,
      });
      setActiveCall({
        ...session,
        callType,
        peerUserId: selectedContact.userId,
        peerName: selectedContact.name,
      });
    } catch (err) {
      setError(toFriendlyChatError(err?.message || "Falha ao iniciar chamada."));
    }
  };

  const acceptIncomingCall = async () => {
    if (!incomingCall) return;
    try {
      const session = await getAgoraToken(incomingCall.channelName, incomingCall.callType || "video");
      const socket = getChatSocket();
      socket?.emit("call:accept", {
        toUserId: incomingCall.fromUserId,
        channelName: incomingCall.channelName,
        callType: incomingCall.callType || "video",
      });
      setActiveCall({
        ...session,
        callType: incomingCall.callType || "video",
        peerUserId: incomingCall.fromUserId,
        peerName: incomingCall.fromUserName || "Utilizador",
      });
      setIncomingCall(null);
    } catch (err) {
      setError(toFriendlyChatError(err?.message || "Falha ao aceitar chamada."));
    }
  };

  const rejectIncomingCall = () => {
    if (!incomingCall) return;
    const socket = getChatSocket();
    socket?.emit("call:reject", {
      toUserId: incomingCall.fromUserId,
      channelName: incomingCall.channelName,
    });
    setIncomingCall(null);
  };

  const closeCall = () => {
    if (activeCall?.peerUserId) {
      const socket = getChatSocket();
      socket?.emit("call:end", {
        toUserId: activeCall.peerUserId,
        channelName: activeCall.channelName,
      });
    }
    setActiveCall(null);
  };

  return (
    <>
      <div className="responsive-split-layout" style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "16px", minHeight: "500px" }}>
        <div className="dashboard-card" style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "14px", borderBottom: "1px solid var(--dm-border)" }}>
            <h3 style={{ margin: 0 }}>{title}</h3>
            <p style={{ margin: "4px 0 0", color: "var(--neutral-500)", fontSize: "0.82rem" }}>Chat em tempo real e chamadas por Agora</p>
          </div>
          <div style={{ overflowY: "auto", flex: 1 }}>
            {loadingContacts ? (
              <div style={{ padding: "12px" }}>A carregar contactos...</div>
            ) : mergedContacts.length === 0 ? (
              <div style={{ padding: "12px", color: "var(--neutral-500)" }}>{emptyText}</div>
            ) : (
              mergedContacts.map((c) => {
                const active = Number(selectedUserId) === Number(c.userId);
                return (
                  <div
                    key={c.userId}
                    onClick={() => setSelectedUserId(c.userId)}
                    style={{
                      padding: "12px",
                      borderBottom: "1px solid var(--neutral-100)",
                      cursor: "pointer",
                      background: active ? "var(--primary-50)" : "transparent",
                      borderLeft: active ? "3px solid var(--primary-600)" : "3px solid transparent",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "8px", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div style={{ width: "28px", height: "28px", borderRadius: "50%", overflow: "hidden", background: "var(--primary-100)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700, color: "var(--primary-700)" }}>
                          {c.avatarUrl ? (
                            <img src={c.avatarUrl} alt={c.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          ) : (
                            String(c.name || "U").charAt(0).toUpperCase()
                          )}
                        </div>
                        <strong style={{ fontSize: "0.9rem" }}>{c.name}</strong>
                      </div>
                      <UserOnlineIndicator online={onlineSet.has(Number(c.userId))} />
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "var(--neutral-500)" }}>{c.subtitle || c.role || "-"}</div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="dashboard-card" style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "12px 14px", borderBottom: "1px solid var(--dm-border)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <div>
              <strong>{selectedContact?.name || "Selecione uma conversa"}</strong>
              {selectedContact ? <div style={{ fontSize: "0.78rem", color: "var(--neutral-500)" }}>{selectedContact.role || "Utilizador"}</div> : null}
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button className="btn btn-outline" style={{ width: "auto", padding: "6px 10px" }} onClick={() => startCall("voice")} disabled={!selectedContact}>Chamada de voz</button>
              <button className="btn btn-primary" style={{ width: "auto", padding: "6px 10px" }} onClick={() => startCall("video")} disabled={!selectedContact}>Videochamada</button>
            </div>
          </div>

          {callBanner ? <div style={{ padding: "8px 14px", background: "var(--primary-50)", color: "var(--primary-700)", borderBottom: "1px solid var(--primary-200)" }}>{callBanner}</div> : null}
          {error ? <div style={{ padding: "8px 14px", color: "var(--error-500)" }}>{error}</div> : null}

          <div style={{ flex: 1, overflowY: "auto", padding: "12px", display: "flex", flexDirection: "column", gap: "8px", background: "var(--neutral-50)" }}>
            {loadingMessages ? (
              <div>A carregar mensagens...</div>
            ) : messages.length === 0 ? (
              <div style={{ color: "var(--neutral-500)" }}>Sem mensagens nesta conversa.</div>
            ) : (
              messages.map((m) => {
                const mine = Number(m.senderId) === Number(currentUserId);
                return (
                  <div key={m.id} style={{ alignSelf: mine ? "flex-end" : "flex-start", maxWidth: "78%" }}>
                    <div style={{ padding: "10px 12px", borderRadius: "10px", background: mine ? "var(--primary-600)" : "var(--dm-surface)", color: mine ? "var(--on-primary)" : "var(--dm-text)", border: mine ? "none" : "1px solid var(--dm-border)" }}>
                      {m.message}
                    </div>
                    <div style={{ fontSize: "0.7rem", color: "var(--neutral-500)", marginTop: "2px", textAlign: mine ? "right" : "left" }}>{formatDateTime(m.timestamp)}</div>
                  </div>
                );
              })
            )}
            <div ref={bottomRef} />
          </div>

          {!!selectedContact && callHistory.length > 0 && (
            <div style={{ borderTop: "1px solid var(--dm-border)", padding: "8px 10px", background: "var(--dm-surface)" }}>
              <div style={{ fontSize: "0.78rem", color: "var(--neutral-500)", marginBottom: "4px" }}>Histórico recente de chamadas</div>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {callHistory.slice(0, 4).map((c) => (
                  <span key={c.id} className={`badge ${c.status === "accepted" ? "badge-success" : c.status === "rejected" ? "badge-warning" : "badge-primary"}`}>
                    {c.callType === "voice" ? "Voz" : "Vídeo"} • {c.status}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div style={{ borderTop: "1px solid var(--dm-border)", padding: "10px", display: "flex", gap: "8px" }}>
            <input
              className="form-input"
              placeholder={selectedContact ? "Escreva uma mensagem..." : "Selecione um contacto"}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
              disabled={!selectedContact}
              style={{ flex: 1 }}
            />
            <button className="btn btn-primary" style={{ width: "auto" }} onClick={sendMessage} disabled={!selectedContact || !text.trim()}>
              Enviar
            </button>
          </div>
        </div>
      </div>

      {incomingCall && (
        <div className="modal-overlay" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 10020, display: "flex", justifyContent: "center", alignItems: "center", padding: "12px" }}>
          <div className="modal-box" style={{ background: "var(--dm-surface)", borderRadius: "10px", border: "1px solid var(--dm-border)", padding: "16px", width: "min(420px, 95vw)" }}>
            <h3 style={{ marginTop: 0 }}>Chamada recebida</h3>
            <p style={{ marginBottom: "14px" }}>
              {incomingCall.fromUserName || "Utilizador"} está a iniciar uma {incomingCall.callType === "voice" ? "chamada de voz" : "videochamada"}.
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
              <button className="btn btn-outline" style={{ width: "auto" }} onClick={rejectIncomingCall}>Recusar</button>
              <button className="btn btn-primary" style={{ width: "auto" }} onClick={acceptIncomingCall}>Aceitar</button>
            </div>
          </div>
        </div>
      )}

      <VideoCallModal open={!!activeCall} session={activeCall} onClose={closeCall} />
    </>
  );
}
