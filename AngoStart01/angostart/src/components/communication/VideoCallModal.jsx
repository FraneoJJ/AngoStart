import React, { useEffect, useRef, useState } from "react";
import { agoraService } from "../../services/agoraService";

export default function VideoCallModal({ open, session, onClose }) {
  const localRef = useRef(null);
  const remoteRef = useRef(null);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fallbackVoice, setFallbackVoice] = useState(false);

  useEffect(() => {
    if (!open || !session) return;
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError("");
      try {
        await agoraService.setupListeners({
          onRemoteVideo: (user) => {
            if (!remoteRef.current) return;
            remoteRef.current.innerHTML = "";
            agoraService.playRemoteVideo(user, remoteRef.current);
          },
          onUserLeft: () => {
            if (remoteRef.current) remoteRef.current.innerHTML = "";
          },
          onError: (err) => setError(err?.message || "Erro na chamada."),
        });

        const result = await agoraService.join({
          appId: session.appId,
          channelName: session.channelName,
          token: session.token,
          uid: session.uid,
          withVideo: session.callType !== "voice",
        });
        setFallbackVoice(!!result?.fallbackToVoice);

        if (!cancelled && localRef.current && session.callType !== "voice") {
          localRef.current.innerHTML = "";
          agoraService.playLocalVideo(localRef.current);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err?.message || "Não foi possível iniciar a chamada.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      agoraService.leave();
    };
  }, [open, session]);

  if (!open || !session) return null;

  return (
    <div
      className="modal-overlay"
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.72)", zIndex: 10030, display: "flex", justifyContent: "center", alignItems: "center", padding: "10px" }}
      onClick={onClose}
    >
      <div
        className="modal-box"
        onClick={(e) => e.stopPropagation()}
        style={{ width: "min(980px, 98vw)", maxHeight: "calc(100vh - 20px)", overflowY: "auto", background: "#0f172a", color: "#e2e8f0", borderRadius: "12px", padding: "12px", border: "1px solid rgba(255,255,255,0.14)" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "10px" }}>
          <strong>{session.callType === "voice" ? "Chamada de Voz" : "Videochamada"} com {session.peerName || "utilizador"}</strong>
          <span style={{ fontSize: "0.8rem", opacity: 0.85 }}>Canal: {session.channelName}</span>
        </div>

        {error ? <div style={{ color: "#fca5a5", marginBottom: "8px" }}>{error}</div> : null}
        {fallbackVoice ? <div style={{ color: "#fde68a", marginBottom: "8px" }}>Câmara indisponível. Chamada mudou automaticamente para voz.</div> : null}
        {loading ? <div style={{ marginBottom: "8px" }}>A iniciar chamada...</div> : null}

        <div style={{ display: "grid", gridTemplateColumns: session.callType === "voice" ? "1fr" : "1fr 1fr", gap: "10px" }}>
          {session.callType !== "voice" && (
            <div style={{ background: "#1e293b", borderRadius: "8px", minHeight: "220px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: "8px", left: "8px", fontSize: "0.75rem", background: "rgba(0,0,0,0.3)", padding: "2px 6px", borderRadius: "8px" }}>Você</div>
              <div ref={localRef} style={{ width: "100%", height: "300px" }} />
            </div>
          )}
          <div style={{ background: "#1e293b", borderRadius: "8px", minHeight: "220px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: "8px", left: "8px", fontSize: "0.75rem", background: "rgba(0,0,0,0.3)", padding: "2px 6px", borderRadius: "8px" }}>
              {session.peerName || "Outro utilizador"}
            </div>
            <div ref={remoteRef} style={{ width: "100%", height: "300px" }} />
          </div>
        </div>

        <div style={{ marginTop: "12px", display: "flex", justifyContent: "center", gap: "8px", flexWrap: "wrap" }}>
          <button
            className="btn btn-outline"
            style={{ width: "auto", background: micOn ? "transparent" : "#7f1d1d", color: "#fff", borderColor: "#334155" }}
            onClick={async () => setMicOn(await agoraService.toggleMicrophone())}
          >
            {micOn ? "Desligar microfone" : "Ligar microfone"}
          </button>
          <button
            className="btn btn-outline"
            style={{ width: "auto", background: camOn ? "transparent" : "#7f1d1d", color: "#fff", borderColor: "#334155" }}
            onClick={async () => setCamOn(await agoraService.toggleCamera())}
            disabled={session.callType === "voice"}
          >
            {camOn ? "Desligar câmara" : "Ligar câmara"}
          </button>
          <button className="btn btn-primary" style={{ width: "auto", background: "#dc2626", borderColor: "#dc2626" }} onClick={onClose}>
            Desligar chamada
          </button>
        </div>
      </div>
    </div>
  );
}
