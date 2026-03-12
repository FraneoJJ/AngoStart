import React, { useState, useEffect, createContext, useContext, useMemo, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import '../style/auth.css';
import { createIdea, getIdeaById, getMarketplaceIdeas, getMyIdeas, updateIdeaStatus } from "../services/ideasApi";
import { generateQuestionnaire, saveQuestionnaireAnswers } from "../services/questionnaireApi";
import { analyzeViability } from "../services/viabilityApi";
import { getLegalFlow, getLegalProgress, updateLegalProgress, generateCompanyGuide, getLatestCompanyGuide } from "../services/legalApi";
import { getStrategicChecklist, getStrategicProgress, updateStrategicProgress } from "../services/strategyApi";
import { getSubscriptionPlans, getCurrentSubscription, changeSubscriptionPlan } from "../services/subscriptionApi";
import { getAdminUsers, updateAdminUserVerification } from "../services/adminApi";
import { getAvailableInvestors, getInvestorById } from "../services/investorApi";
import { updateMyProfile } from "../services/authApi";
import { getPerformanceReport } from "../services/reportApi";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import Planos from "../components/SecoesApp/Planos";

const STORAGE_KEY = 'angostart_settings';

function parseJsonSafe(raw, fallback) {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

const translations = {
  pt: {
    nav: {
      section: { principal: 'Principal', crescimento: 'Crescimento', analise: 'Análise', conteudo: 'Conteúdo', administracao: 'Administração', analytics: 'Analytics', sistema: 'Sistema', configuracoes: 'Configurações' },
      item: { 'dashboard': 'Dashboard', 'submeter-ideia': 'Submeter Ideia', 'minhas-ideias': 'Minhas Ideias', 'mentoria': 'Mentoria', 'investidores': 'Investidores', 'checklist-estrategico': 'Plano de Ação', 'legalizacao': 'Legalização', 'assinatura': 'Assinatura', 'perfil': 'Perfil', 'configuracoes': 'Configurações', 'marketplace': 'Marketplace', 'meus-investimentos': 'Investimentos', 'propostas': 'Propostas', 'analytics': 'Analytics', 'sessoes': 'Sessões', 'mentorados': 'Mentorados', 'agenda': 'Agenda', 'mensagens': 'Mensagens', 'usuarios': 'Usuários', 'ideias': 'Ideias', 'relatorios': 'Relatórios' },
    },
    common: { save: 'Salvar', cancel: 'Cancelar', close: 'Fechar', logout: 'Sair', restore: 'Restaurar Padrão' },
    config: {
      title: 'Configurações do Sistema',
      subtitle: 'Personalize a sua experiência na plataforma AngoStart.',
      darkMode: 'Modo Escuro',
      darkModeDesc: 'Altera a aparência para cores mais confortáveis à noite.',
      language: 'Idioma do Sistema',
      languageDesc: 'Escolha o idioma preferencial das interfaces.',
      notifications: 'Notificações por Email',
      notificationsDesc: 'Receba alertas de novos projetos e mensagens diretas.',
      saveChanges: 'Salvar Alterações',
      settingsSaved: 'Configurações guardadas com sucesso.',
      defaultsRestored: 'Predefinições restauradas.',
      openNewUser: 'Abrir modal de novo utilizador',
      reportExported: 'Relatório exportado em PDF!',
      proposalRejected: 'Proposta Recusada',
      proposalAccepted: 'Proposta Aceite! A iniciar Due Diligence...',
      editOpened: 'Funcionalidade de edição aberta!',
      openingDetails: 'Abrir detalhes de',
      openingReports: 'Abrir relatórios da',
      startingMentoring: 'Iniciar mentoria com',
      openingChat: 'Abrir chat com',
      openingProfile: 'Abrir perfil detalhado de',
    },
  },
  en: {
    nav: {
      section: { principal: 'Main', crescimento: 'Growth', analise: 'Analysis', conteudo: 'Content', administracao: 'Administration', analytics: 'Analytics', sistema: 'System', configuracoes: 'Settings' },
      item: { 'dashboard': 'Dashboard', 'submeter-ideia': 'Submit Idea', 'minhas-ideias': 'My Ideas', 'mentoria': 'Mentoring', 'investidores': 'Investors', 'checklist-estrategico': 'Action Plan', 'legalizacao': 'Legal Setup', 'assinatura': 'Subscription', 'perfil': 'Profile', 'configuracoes': 'Settings', 'marketplace': 'Marketplace', 'meus-investimentos': 'Investments', 'propostas': 'Proposals', 'analytics': 'Analytics', 'sessoes': 'Sessions', 'mentorados': 'Mentees', 'agenda': 'Agenda', 'mensagens': 'Messages', 'usuarios': 'Users', 'ideias': 'Ideas', 'relatorios': 'Reports' },
    },
    common: { save: 'Save', cancel: 'Cancel', close: 'Close', logout: 'Logout', restore: 'Restore Default' },
    config: {
      title: 'System Settings',
      subtitle: 'Customise your experience on the AngoStart platform.',
      darkMode: 'Dark Mode',
      darkModeDesc: 'Switch to a more comfortable appearance at night.',
      language: 'System Language',
      languageDesc: 'Choose your preferred interface language.',
      notifications: 'Email Notifications',
      notificationsDesc: 'Receive alerts for new projects and direct messages.',
      saveChanges: 'Save Changes',
      settingsSaved: 'Settings saved successfully.',
      defaultsRestored: 'Defaults restored.',
      openNewUser: 'Open new user modal',
      reportExported: 'Report exported as PDF!',
      proposalRejected: 'Proposal Rejected',
      proposalAccepted: 'Proposal Accepted! Starting Due Diligence...',
      editOpened: 'Edit feature opened!',
      openingDetails: 'Open details for',
      openingReports: 'Open reports for',
      startingMentoring: 'Start mentoring with',
      openingChat: 'Open chat with',
      openingProfile: 'Open detailed profile for',
    },
  },
};

const AppContext = createContext(null);

const navigationConfig = {
  empreendedor: [
    { sectionKey: 'principal', items: [
      { id: 'dashboard', icon: 'home' },
      { id: 'submeter-ideia', icon: 'lightbulb', badge: 3 },
      { id: 'minhas-ideias', icon: 'folder', badge: 3 },
    ]},
    { sectionKey: 'crescimento', items: [
      { id: 'mentoria', icon: 'users' },
      { id: 'investidores', icon: 'trending-up' },
      { id: 'checklist-estrategico', icon: 'check-circle' },
      { id: 'legalizacao', icon: 'briefcase' },
    ]},
    { sectionKey: 'configuracoes', items: [
      { id: 'assinatura', icon: 'credit-card' },
      { id: 'perfil', icon: 'user' },
      { id: 'configuracoes', icon: 'settings' },
    ]},
  ],
  investidor: [
    { sectionKey: 'principal', items: [
      { id: 'dashboard', icon: 'home' },
      { id: 'marketplace', icon: 'shopping-bag', badge: 12 },
      { id: 'meus-investimentos', icon: 'trending-up' },
    ]},
    { sectionKey: 'analise', items: [
      { id: 'propostas', icon: 'inbox', badge: 5 },
      { id: 'analytics', icon: 'bar-chart' },
    ]},
    { sectionKey: 'configuracoes', items: [
      { id: 'assinatura', icon: 'credit-card' },
      { id: 'perfil', icon: 'user' },
      { id: 'configuracoes', icon: 'settings' },
    ]},
  ],
  mentor: [
    { sectionKey: 'principal', items: [
      { id: 'dashboard', icon: 'home' },
      { id: 'sessoes', icon: 'calendar', badge: 4 },
      { id: 'mentorados', icon: 'users' },
    ]},
    { sectionKey: 'conteudo', items: [
      { id: 'agenda', icon: 'clock' },
      { id: 'mensagens', icon: 'user' },
    ]},
    { sectionKey: 'configuracoes', items: [
      { id: 'assinatura', icon: 'credit-card' },
      { id: 'perfil', icon: 'user' },
      { id: 'configuracoes', icon: 'settings' },
    ]},
  ],
  admin: [
    { sectionKey: 'administracao', items: [
      { id: 'dashboard', icon: 'home' },
      { id: 'usuarios', icon: 'users' },
      { id: 'ideias', icon: 'lightbulb', badge: 8 },
    ]},
    { sectionKey: 'analytics', items: [
      { id: 'relatorios', icon: 'bar-chart' },
    ]},
    { sectionKey: 'sistema', items: [
      { id: 'configuracoes', icon: 'settings' },
    ]},
  ],
};

const icons = {
  home: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  lightbulb: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/><line x1="12" y1="23" x2="12" y2="19"/></svg>,
  folder: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
  users: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  'trending-up': <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  'file-text': <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  user: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  'credit-card': <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  'shopping-bag': <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>,
  inbox: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>,
  heart: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  'bar-chart': <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>,
  briefcase: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
  calendar: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  book: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  clock: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  award: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>,
  'check-circle': <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  'dollar-sign': <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  settings: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 10.27 7 3.34"/><path d="m11 13.73-4 6.93"/><path d="M12 22v-2"/><path d="M12 2v2"/><path d="M14 12h8"/><path d="m17 20.66-1-1.73"/><path d="m17 3.34-1 1.73"/><path d="M2 12h2"/><path d="m20.66 17-1.73-1"/><path d="m20.66 7-1.73 1"/><path d="m3.34 17 1.73-1"/><path d="m3.34 7 1.73 1"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="12" r="8"/></svg>,
};


function ConfirmModal() {
  const ctx = useContext(AppContext);
  if (!ctx || !ctx.modal.open) return null;
  const { modal, setModal, t } = ctx;
  const close = () => {
    if (typeof modal.onClose === "function") {
      modal.onClose();
    }
    setModal({ ...modal, open: false, onClose: undefined });
  };
  return (
    <div className="modal-overlay" onClick={close} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '10px 0' }}>
      <div className="modal-box" onClick={e => e.stopPropagation()} style={{ background: 'var(--dm-surface)', borderRadius: 'var(--radius-lg)', padding: '24px', maxWidth: '400px', width: '90%', boxShadow: 'var(--shadow-xl)', border: '1px solid var(--dm-border)', margin: '10px 0', maxHeight: 'calc(100vh - 20px)', overflowY: 'auto' }}>
        {modal.title && <h3 style={{ margin: '0 0 12px', fontSize: '1.1rem', color: 'var(--neutral-900)' }}>{modal.title}</h3>}
        {modal.message && <p style={{ margin: modal.content ? '0 0 12px 0' : 0, color: 'var(--dm-text)', fontSize: '0.95rem' }}>{modal.message}</p>}
        {modal.content ? <div>{modal.content}</div> : null}
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
          <button type="button" className="btn btn-primary" onClick={close}>{t ? t('common.close') : 'Fechar'}</button>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [navBadges, setNavBadges] = useState({});
  const [dismissedVerificationNotice, setDismissedVerificationNotice] = useState(false);
  const profileRefreshRef = useRef("");
  const [selectedRoleForSwitch, setSelectedRoleForSwitch] = useState("");
  const [switchingRole, setSwitchingRole] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [idioma, setIdioma] = useState(() => {
    const s = parseJsonSafe(localStorage.getItem(STORAGE_KEY), null);
    return s?.idioma || 'pt';
  });
  const [modal, setModal] = useState({ open: false, title: '', message: '', onClose: undefined });
  const t = (key) => {
    const parts = key.split('.');
    let v = translations[idioma] || translations.pt;
    for (const p of parts) v = v?.[p];
    return v != null ? v : key;
  };

  const mapAuthenticatedUser = (apiUser) => ({
    id: apiUser.id,
    name: apiUser.name,
    email: apiUser.email,
    role: apiUser.role,
    primaryRole: apiUser.primaryRole || apiUser.role,
    availableRoles: apiUser.availableRoles || [apiUser.role],
    verificationStatus: apiUser.verificationStatus || "approved",
    verificationId: apiUser.verificationId || null,
    profileData: apiUser.profileData || {},
  });
  const refreshCurrentUser = useCallback(async () => {
    const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1";
    const token = localStorage.getItem("angostart_token");
    if (!token) return null;
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const contentType = res.headers.get("content-type") || "";
      const data = contentType.includes("application/json") ? await res.json() : null;
      if (res.ok && data?.success && data?.user) {
        const mapped = mapAuthenticatedUser(data.user);
        setUser(mapped);
        return mapped;
      }
      return null;
    } catch {
      return null;
    }
  }, []);
  const refreshNavBadges = useCallback(async (targetUser = user) => {
    const role = targetUser?.role;
    if (!role) return;

    try {
      if (role === "empreendedor") {
        const ideas = await getMyIdeas();
        const pendingSubmission = ideas.filter((i) => i.status === "submitted" || i.status === "analyzing").length;
        setNavBadges({
          "submeter-ideia": pendingSubmission,
          "minhas-ideias": ideas.length,
        });
        return;
      }

      if (role === "investidor") {
        const marketplaceIdeas = await getMarketplaceIdeas();
        const pendingProposals = marketplaceIdeas.filter((i) => i.status === "submitted" || i.status === "analyzing").length;
        setNavBadges({
          marketplace: marketplaceIdeas.length,
          propostas: pendingProposals,
        });
        return;
      }

      if (role === "mentor") {
        const marketplaceIdeas = await getMarketplaceIdeas();
        const mentoringRequests = marketplaceIdeas.filter((i) => i.status === "submitted" || i.status === "analyzing").length;
        setNavBadges({
          sessoes: mentoringRequests,
        });
        return;
      }

      if (role === "admin") {
        const marketplaceIdeas = await getMarketplaceIdeas();
        const pendingReview = marketplaceIdeas.filter((i) => i.status === "submitted" || i.status === "analyzing").length;
        setNavBadges({
          ideias: pendingReview,
        });
        return;
      }

      setNavBadges({});
    } catch {
      // Não interrompe o dashboard se alguma contagem falhar.
      setNavBadges({});
    }
  }, [user]);

  const ctxValue = useMemo(() => ({ idioma, setIdioma, t, modal, setModal, refreshNavBadges, refreshCurrentUser, currentUser: user }), [idioma, modal, refreshNavBadges, refreshCurrentUser, user]);

  useEffect(() => {
    const s = loadSettings();
    if (s.dark) document.body.classList.add('dark-theme');
    else document.body.classList.remove('dark-theme');
  }, []);

  useEffect(() => {
    if (user) return;
    (async () => {
      const mapped = await refreshCurrentUser();
      if (mapped?.role) setSelectedRoleForSwitch(mapped.role);
    })();
  }, [user, refreshCurrentUser]);

  useEffect(() => {
    if (!user?.role) return;
    refreshNavBadges(user);
  }, [user?.id, user?.role, refreshNavBadges]);

  useEffect(() => {
    if (currentPage !== "perfil") {
      profileRefreshRef.current = "";
      return;
    }
    if (!user?.id || !user?.role) return;
    const refreshKey = `${user.id}:${user.role}:perfil`;
    if (profileRefreshRef.current === refreshKey) return;
    profileRefreshRef.current = refreshKey;
    refreshCurrentUser();
  }, [currentPage, user?.id, user?.role, refreshCurrentUser]);

  const closeSidebarOnMobile = () => {
    if (window.matchMedia("(max-width: 1024px)").matches) {
      setIsSidebarOpen(false);
    }
  };

  async function handleLogin(e) {
    e?.preventDefault();
    const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1";

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const contentType = res.headers.get("content-type") || "";
      const data = contentType.includes("application/json") ? await res.json() : null;

      if (res.ok && data?.success && data?.token) {
        localStorage.setItem("angostart_token", data.token);
        setUser(mapAuthenticatedUser(data.user));
        setSelectedRoleForSwitch(data.user.role);
        setError("");
        return;
      }
      setError(data?.message || "Falha ao autenticar. Verifique seus dados.");
      return;
    } catch {
      setError("Não foi possível conectar à API de autenticação.");
      return;
    }
  }

  function logout() {
    setUser(null);
    setSelectedRoleForSwitch("");
    setEmail("");
    setPassword("");
    localStorage.removeItem("angostart_token");
  }

  async function handleSwitchRole() {
    if (!user || !selectedRoleForSwitch || selectedRoleForSwitch === user.role) return;
    const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1";
    const token = localStorage.getItem("angostart_token");
    if (!token) return;
    setSwitchingRole(true);
    try {
      const res = await fetch(`${API_BASE}/auth/switch-role`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: selectedRoleForSwitch }),
      });
      const contentType = res.headers.get("content-type") || "";
      const data = contentType.includes("application/json") ? await res.json() : null;
      if (!res.ok || !data?.success || !data?.token || !data?.user) {
        throw new Error(data?.message || "Falha ao trocar de papel.");
      }
      localStorage.setItem("angostart_token", data.token);
      setUser(mapAuthenticatedUser(data.user));
      setCurrentPage("dashboard");
    } catch (err) {
      setModal({ open: true, title: "Troca de papel", message: err.message || "Falha ao trocar de papel." });
    } finally {
      setSwitchingRole(false);
    }
  }

  const canShowVerificationNotice = user?.role === "mentor" || user?.role === "investidor";
  const verificationMeta = {
    pending: {
      title: "Conta pendente de verificação",
      text: "A sua conta já está ativa no dashboard, mas o perfil ainda está em análise da equipa.",
      border: "#f59e0b",
      bg: "#fffbeb",
      titleColor: "#92400e",
      textColor: "#78350f",
    },
    approved: {
      title: "Conta verificada e aprovada",
      text: "A sua conta foi aprovada pela equipa. Todas as funcionalidades do seu perfil estão liberadas.",
      border: "#10b981",
      bg: "#ecfdf5",
      titleColor: "#065f46",
      textColor: "#065f46",
    },
    rejected: {
      title: "Conta rejeitada na verificação",
      text: "A verificação foi rejeitada. Atualize os dados/documentos e contacte o suporte para nova análise.",
      border: "#ef4444",
      bg: "#fef2f2",
      titleColor: "#991b1b",
      textColor: "#7f1d1d",
    },
  };
  const currentVerificationStatus = user?.verificationStatus || "pending";
  const currentVerificationMeta = verificationMeta[currentVerificationStatus] || verificationMeta.pending;
  const verificationNoticeDismissKey = user ? `angostart_verif_notice_${user.id}_${user.role}_${currentVerificationStatus}` : "";

  useEffect(() => {
    if (!verificationNoticeDismissKey) {
      setDismissedVerificationNotice(false);
      return;
    }
    const dismissed = localStorage.getItem(verificationNoticeDismissKey) === "1";
    setDismissedVerificationNotice(dismissed);
  }, [verificationNoticeDismissKey]);

  const dismissVerificationNotice = () => {
    if (verificationNoticeDismissKey) {
      localStorage.setItem(verificationNoticeDismissKey, "1");
    }
    setDismissedVerificationNotice(true);
  };

function RenderInvestidorPage() {
  switch(currentPage) {
    case 'dashboard': return <Investidor />;
    case 'marketplace': return <Marketplace />;
    case 'meus-investimentos': return <Investimentos />;
    case 'propostas': return <Propostas />;
    case 'analytics': return <Analytics />;
    case 'assinatura': return <AssinaturaPlano />;
    case 'perfil': return <InvestidorPerfil />;
    case 'configuracoes': return <Configuracoes />;
    default: return <Investidor />;
  }
}
function RenderEmpreendedorPage() {
  switch(currentPage) {
    case 'dashboard': return <Empreendedor />;
    case 'submeter-ideia': return <SubmeterIdeia/>;
    case 'minhas-ideias': return <MinhasIdeias />;
    case 'mentoria': return <Mentoria />;
    case 'investidores': return <Investidores />;
    case 'checklist-estrategico': return <ChecklistEstrategico />;
    case 'legalizacao': return <LegalizacaoEmpresa />;
    case 'assinatura': return <AssinaturaPlano />;
    case 'perfil': return <Perfilmentor />;
    case 'configuracoes': return <Configuracoes />;
    default: return <Empreendedor />;
  }
}
function RenderMentorPage() {
  switch(currentPage) {
    case 'dashboard': return <Mentor />;
    case 'sessoes': return <Sessoes/>;
    case 'mentorados': return <Mentorados/>;
    case 'agenda': return <Agenda/>;
    case 'mensagens': return < Mensagens/>;
    case 'assinatura': return <AssinaturaPlano />;
    case 'perfil': return <Perfilmentor />;
    case 'configuracoes': return <Configuracoes />;
    default: return <Mentor />;
  }
}
function RenderAdminPage() {
  switch(currentPage) {
    case 'dashboard': return <Admin />;
    case 'usuarios': return <Usuarios />;
    case 'ideias': return <Ideias />;
    case 'relatorios': return <Relatorio />;
    case 'configuracoes': return <Configuracoes />;
    default: return <Admin />;
  }
}

  // =========================
  // ÁREAS (FUNCTIONS)
  // =========================
  function Investidor() {
    const ctx = useContext(AppContext);
    const t = ctx?.t ?? (k => k);
    return(
      <>
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-card-content">
          <div className="stat-info">
            <div className="stat-label">Investimentos Ativos</div>
            <div className="stat-value">8</div>
            <div className="stat-change">+2 este trimestre</div>
          </div>
          <div className="stat-icon-wrapper stat-icon-primary">
           {icons.briefcase}
          </div>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-card-content">
          <div className="stat-info">
            <div className="stat-label">Valor Total Investido</div>
            <div className="stat-value">Kz 485.000</div>
            <div className="stat-change">Portfolio total</div>
          </div>
          <div className="stat-icon-wrapper stat-icon-success">
            {icons['dollar-sign']}
          </div>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-card-content">
          <div className="stat-info">
            <div className="stat-label">Propostas Pendentes</div>
            <div className="stat-value">12</div>
            <div className="stat-change">+5 esta semana</div>
          </div>
          <div className="stat-icon-wrapper stat-icon-secondary">
            {icons.inbox}
          </div>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-card-content">
          <div className="stat-info">
            <div className="stat-label">ROI Médio</div>
            <div className="stat-value">18.5%</div>
            <div className="stat-change">+2.3% este ano</div>
          </div>
          <div className="stat-icon-wrapper stat-icon-info">
            {icons['trending-up']}
          </div>
        </div>
      </div>
    </div>
    
    <div className="dashboard-card">
      <div className="dashboard-card-header">
        <h3 className="dashboard-card-title">Oportunidades em Destaque</h3>
        <p className="dashboard-card-description">Ideias com maior pontuação IA</p>
      </div>
      
      <table className="data-table">
        <thead>
          <tr>
            <th>Startup</th>
            <th>Setor</th>
            <th>Score IA</th>
            <th>Investimento</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>TechEdu Angola</td>
            <td>EdTech</td>
            <td><span className="badge badge-success">92</span></td>
            <td>Kz 50.000 - Kz 100.000</td>
            <td><button className="btn btn-primary" style={{padding:'0.5rem 1rem', fontSize: '0.875rem'}}>Ver Detalhes</button></td>
          </tr>
          <tr>
            <td>AgriConnect</td>
            <td>AgriTech</td>
            <td><span className="badge badge-success">88</span></td>
            <td>Kz 30.000 - Kz 75.000</td>
            <td><button className="btn btn-primary" style={{padding:'0.5rem 1rem', fontSize: '0.875rem'}}>Ver Detalhes</button></td>
          </tr>
          <tr>
            <td>HealthPlus</td>
            <td>HealthTech</td>
            <td><span className="badge badge-success">85</span></td>
            <td>Kz 75.000 - Kz 150.000</td>
            <td><button className="btn btn-primary" style={{padding:'0.5rem 1rem', fontSize: '0.875rem'}}>Ver Detalhes</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  
  </>);
  }

  function Empreendedor() {
    const ctx = useContext(AppContext);
    const [loading, setLoading] = useState(true);
    const [ideias, setIdeias] = useState([]);

    useEffect(() => {
      (async () => {
        setLoading(true);
        try {
          const data = await getMyIdeas();
          setIdeias(data || []);
        } catch (err) {
          ctx?.setModal?.({ open: true, message: `Falha ao carregar ideias submetidas: ${err.message}` });
          setIdeias([]);
        } finally {
          setLoading(false);
        }
      })();
    }, []);

    const total = ideias.length;
    const publicadas = ideias.filter((i) => i.status === "active").length;
    const emAnalise = ideias.filter((i) => i.status === "submitted" || i.status === "analyzing").length;
    const arquivadas = ideias.filter((i) => i.status === "archived").length;

    const statusLabel = (status) => {
      if (status === "active") return "Publicada";
      if (status === "submitted") return "Submetida";
      if (status === "analyzing") return "Em Análise";
      if (status === "archived") return "Arquivada";
      return status || "-";
    };

    const statusBadge = (status) => {
      if (status === "active") return "badge-success";
      if (status === "submitted" || status === "analyzing") return "badge-warning";
      return "badge-info";
    };

    const formatDate = (iso) => {
      if (!iso) return "-";
      const d = new Date(iso);
      return Number.isNaN(d.getTime()) ? "-" : d.toLocaleDateString("pt-PT");
    };

    return (
      <>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-card-content">
              <div className="stat-info">
                <div className="stat-label">Ideias Submetidas</div>
                <div className="stat-value">{total}</div>
                <div className="stat-change">Total no banco de dados</div>
              </div>
              <div className="stat-icon-wrapper stat-icon-primary">{icons.lightbulb}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-content">
              <div className="stat-info">
                <div className="stat-label">Publicadas</div>
                <div className="stat-value">{publicadas}</div>
                <div className="stat-change">No marketplace</div>
              </div>
              <div className="stat-icon-wrapper stat-icon-success">{icons["trending-up"]}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-content">
              <div className="stat-info">
                <div className="stat-label">Em Análise</div>
                <div className="stat-value">{emAnalise}</div>
                <div className="stat-change">Submetidas para revisão</div>
              </div>
              <div className="stat-icon-wrapper stat-icon-secondary">{icons.users}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-content">
              <div className="stat-info">
                <div className="stat-label">Arquivadas</div>
                <div className="stat-value">{arquivadas}</div>
                <div className="stat-change">Fora do marketplace</div>
              </div>
              <div className="stat-icon-wrapper stat-icon-info">{icons.clock}</div>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3 className="dashboard-card-title">Minhas Ideias (Banco de Dados)</h3>
            <p className="dashboard-card-description">Ideias submetidas carregadas diretamente da API.</p>
          </div>

          {loading ? (
            <p>A carregar ideias...</p>
          ) : ideias.length === 0 ? (
            <p>Sem ideias submetidas no banco para este utilizador.</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Ideia</th>
                  <th>Setor</th>
                  <th>Status</th>
                  <th>Cidade</th>
                  <th>Data</th>
                </tr>
              </thead>
              <tbody>
                {ideias.map((ideia) => (
                  <tr key={ideia.id}>
                    <td>{ideia.title}</td>
                    <td>{ideia.sector || "-"}</td>
                    <td><span className={`badge ${statusBadge(ideia.status)}`}>{statusLabel(ideia.status)}</span></td>
                    <td>{ideia.city || "-"}</td>
                    <td>{formatDate(ideia.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </>
    );
  }

  function Mentor() {
    return (<>
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-card-content">
          <div className="stat-info">
            <div className="stat-label">Mentorados Ativos</div>
            <div className="stat-value">12</div>
            <div className="stat-change">+3 este mês</div>
          </div>
          <div className="stat-icon-wrapper stat-icon-primary">
            {icons.users}
          </div>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-card-content">
          <div className="stat-info">
            <div className="stat-label">Sessões este Mês</div>
            <div className="stat-value">24</div>
            <div className="stat-change">4 agendadas</div>
          </div>
          <div className="stat-icon-wrapper stat-icon-success">
            {icons.calendar}
          </div>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-card-content">
          <div className="stat-info">
            <div className="stat-label">Horas de Mentoria</div>
            <div className="stat-value">86</div>
            <div className="stat-change">Total acumulado</div>
          </div>
          <div className="stat-icon-wrapper stat-icon-secondary">
            {icons.clock}
          </div>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-card-content">
          <div className="stat-info">
            <div className="stat-label">Avaliação Média</div>
            <div className="stat-value">4.9</div>
            <div className="stat-change">De 5.0 estrelas</div>
          </div>
          <div className="stat-icon-wrapper stat-icon-info">
            {icons.award}
          </div>
        </div>
      </div>
    </div>
    
    <div className="dashboard-card">
      <div className="dashboard-card-header">
        <h3 className="dashboard-card-title">Próximas Sessões</h3>
        <p className="dashboard-card-description">Suas sessões de mentoria agendadas</p>
      </div>
      
      <table className="data-table">
        <thead>
          <tr>
            <th>Mentorado</th>
            <th>Tópico</th>
            <th>Data & Hora</th>
            <th>Duração</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Ana Silva</td>
            <td>Estratégia de Go-to-Market</td>
            <td>25/01/2026 14:00</td>
            <td>1h</td>
            <td><span className="badge badge-success">Confirmada</span></td>
          </tr>
          <tr>
            <td>Carlos Mendes</td>
            <td>Modelo de Negócio</td>
            <td>26/01/2026 10:00</td>
            <td>1h30</td>
            <td><span className="badge badge-success">Confirmada</span></td>
          </tr>
          <tr>
            <td>Maria Costa</td>
            <td>Pitch para Investidores</td>
            <td>27/01/2026 16:00</td>
            <td>1h</td>
            <td><span className="badge badge-warning">Pendente</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </>);

  }

  function Admin() {
    const ctx = useContext(AppContext);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      (async () => {
        setLoading(true);
        try {
          const data = await getAdminUsers();
          setUsers(data);
        } catch (err) {
          ctx?.setModal?.({ open: true, message: `Falha ao carregar usuários: ${err.message}` });
          setUsers([]);
        } finally {
          setLoading(false);
        }
      })();
    }, []);

    const totalUsers = users.length;
    const totalEmpreendedores = users.filter((u) => u.role === "empreendedor").length;
    const pendingApprovals = users.filter(
      (u) => (u.role === "mentor" || u.role === "investidor") && u.verificationStatus === "pending"
    ).length;
    const approvedProfiles = users.filter(
      (u) => (u.role === "mentor" || u.role === "investidor") && u.verificationStatus === "approved"
    ).length;
    const pendingList = users.filter(
      (u) => (u.role === "mentor" || u.role === "investidor") && u.verificationStatus === "pending"
    );

    return (
      <>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-card-content">
              <div className="stat-info">
                <div className="stat-label">Usuários Totais</div>
                <div className="stat-value">{totalUsers}</div>
                <div className="stat-change">Dados em tempo real</div>
              </div>
              <div className="stat-icon-wrapper stat-icon-primary">{icons.users}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-content">
              <div className="stat-info">
                <div className="stat-label">Empreendedores</div>
                <div className="stat-value">{totalEmpreendedores}</div>
                <div className="stat-change">Cadastros ativos</div>
              </div>
              <div className="stat-icon-wrapper stat-icon-success">{icons.lightbulb}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-content">
              <div className="stat-info">
                <div className="stat-label">Aprovações Pendentes</div>
                <div className="stat-value">{pendingApprovals}</div>
                <div className="stat-change">Mentores e investidores</div>
              </div>
              <div className="stat-icon-wrapper stat-icon-secondary">{icons["check-circle"]}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-content">
              <div className="stat-info">
                <div className="stat-label">Perfis Aprovados</div>
                <div className="stat-value">{approvedProfiles}</div>
                <div className="stat-change">Validação concluída</div>
              </div>
              <div className="stat-icon-wrapper stat-icon-info">{icons.award}</div>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3 className="dashboard-card-title">Contas pendentes de aprovação</h3>
            <p className="dashboard-card-description">Revisão de mentores e investidores.</p>
          </div>
          {loading ? (
            <p>A carregar usuários...</p>
          ) : pendingList.length === 0 ? (
            <p>Sem pendências neste momento.</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Função</th>
                  <th>Verificação</th>
                  <th>Ver</th>
                </tr>
              </thead>
              <tbody>
                {pendingList.map((u) => (
                  <tr key={u.id}>
                    <td><strong>{u.name}</strong></td>
                    <td>{u.email}</td>
                    <td><span className="badge badge-primary">{u.role}</span></td>
                    <td><span className="badge badge-warning">Pendente</span></td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-outline"
                        style={{ width: "auto", padding: "6px 12px" }}
                        onClick={() => setCurrentPage("usuarios")}
                      >
                        Ver
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </>
    );
  }

  function RenderArea() {
    if (user.role === "investidor") return <RenderInvestidorPage />;
    if (user.role === "empreendedor") return <RenderEmpreendedorPage/>;
    if (user.role === "mentor") return <RenderMentorPage />;
    return <RenderAdminPage/>;
  }

  // =========================
  // LOGIN PAGE
  // =========================
 if (!user) {
  return (
    <div className="auth-page">
        <div className="auth-container">
    <div className="auth-content">
      {/* <!-- Header --> */}
      <div className="auth-header">
        <div className="auth-logo">
          <img src="..//logo.png" alt="AngoStart"/>
        </div>
        <h1 className="auth-title">Bem-vindo de volta!</h1>
        <p className="auth-subtitle">Entre para continuar sua jornada empreendedora</p>
      </div>

      {/* <!-- Card --> */}
      <div className="auth-card">
        <div className="card-header">
          <h2>Entrar na sua conta</h2>
          <p className="card-description">Digite suas credenciais para acessar a plataforma</p>
        </div>

        <div className="card-content">
          <form id="loginForm" className="auth-form" onSubmit={handleLogin}>
            {error && (
                  <div className="alert alert-error">{error}</div>
                )}

            {/* <!-- Email Field --> */}
            <div className="form-group">
              <label for="email" className="form-label">Email</label>
              <div className="input-wrapper">
                <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <input 
                  type="email" 
                  id="email" 
                  className="form-input" 
                  placeholder="seu@email.com"
                  required
                  value={email}
                onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* <!-- Password Field --> */}
            <div className="form-group">
              <label for="password" className="form-label">Senha</label>
              <div className="input-wrapper">
                <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input 
                  type="password" 
                  id="password" 
                  className="form-input" 
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

              </div>
            </div>

            {/* <!-- Forgot Password --> */}
            <div className="form-actions">
              <Link to={'/recuperar-senha'} className="link-primary">Esqueceu a senha?</Link>
            </div>

            {/* <!-- Submit Button --> */}
            <button type="submit" className="btn btn-primary btn-block">
              Entrar
            </button>

            {/* <!-- Register Link --> */}
            <div className="auth-footer-link">
              <p>
                Não tem uma conta? 
                <Link to={'/criar-conta'} className="link-primary">Criar conta</Link>
              </p>
            </div>

            {/* <!-- Demo Credentials --> */}
            <div className="demo-box">
              <p className="demo-title">Usuários de teste</p>
              <div className="demo-list">
                <p>• empreendedor@gmail.com / 123456</p>
                <p>• investidor@gmail.com / 123456</p>
                <p>• mentor@gmail.com / 123456</p>
                <p>• admin@gmail.com / 123456</p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
    </div>
  );
  }

  // =========================
  // DASHBOARD
  // =========================
  
return (
    <AppContext.Provider value={ctxValue}>
      <ConfirmModal />
      <div className="dashboard-page">
        <header className="dashboard-mobile-header">
          <button
            type="button"
            className="sidebar-toggle"
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            aria-label={isSidebarOpen ? "Fechar menu lateral" : "Abrir menu lateral"}
            aria-expanded={isSidebarOpen}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {isSidebarOpen ? (
                <path d="M18 6 6 18M6 6l12 12" />
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
          <img src="/logo.png" alt="AngoStart" className="sidebar-logo" />
        </header>
        <aside className={`sidebar ${isSidebarOpen ? "active" : ""}`}>
          <div className="sidebar-header">
            <img src="/logo.png" alt="AngoStart" className="sidebar-logo" />
            <button
              type="button"
              className="sidebar-close"
              onClick={() => setIsSidebarOpen(false)}
              aria-label="Fechar menu lateral"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="sidebar-nav">
            {navigationConfig[user.role]?.map((group) => (
              <div key={group.sectionKey} className="nav-section">
                <div className="nav-section-title">
                  {t('nav.section.' + group.sectionKey)}
                </div>
                {group.items.map((item) => (
                  (() => {
                    const badgeValue = Object.prototype.hasOwnProperty.call(navBadges, item.id)
                      ? navBadges[item.id]
                      : null;
                    return (
                  <div
                    key={item.id}
                    className={`nav-item ${currentPage === item.id ? "active" : ""}`}
                    onClick={() => {
                      setCurrentPage(item.id);
                      closeSidebarOnMobile();
                    }}
                  >
                    <span className="nav-icon">{icons[item.icon]}</span>
                    <span className="nav-label">{t('nav.item.' + item.id)}</span>
                    {badgeValue != null && <span className="nav-badge">{badgeValue}</span>}
                  </div>
                    );
                  })()
                ))}
              </div>
            ))}
          </div>
          <div className="sidebar-footer">
            <div className="user-profile">
              <div className="user-avatar">{user.name.charAt(0)}</div>
              <div className="user-info">
                <div className="user-name">{user.name}</div>
                <div className="user-role">{user.role}</div>
              </div>
            </div>
            {Array.isArray(user?.availableRoles) && user.availableRoles.length > 1 && (
              <div style={{ marginBottom: "12px", display: "grid", gap: "8px" }}>
                <select
                  className="form-input"
                  value={selectedRoleForSwitch || user.role}
                  onChange={(e) => setSelectedRoleForSwitch(e.target.value)}
                  style={{ padding: "8px 10px", borderRadius: "8px" }}
                >
                  {user.availableRoles.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={handleSwitchRole}
                  disabled={switchingRole || !selectedRoleForSwitch || selectedRoleForSwitch === user.role}
                  style={{ width: "100%" }}
                >
                  {switchingRole ? "A trocar..." : "Trocar perfil"}
                </button>
              </div>
            )}
            <button className="btn-logout" onClick={logout}>{t('common.logout')}</button>
          </div>
        </aside>
        <div
          className={`sidebar-overlay ${isSidebarOpen ? "active" : ""}`}
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
        <main className="main-content">
          <div className="page-content">
            {canShowVerificationNotice && !dismissedVerificationNotice && (
              <div
                className="dashboard-card"
                style={{
                  marginBottom: "16px",
                  border: `1px solid ${currentVerificationMeta.border}`,
                  background: currentVerificationMeta.bg,
                }}
              >
                <div style={{ color: currentVerificationMeta.titleColor, fontWeight: 600, marginBottom: "6px" }}>
                  {currentVerificationMeta.title}
                </div>
                <div style={{ color: currentVerificationMeta.textColor, fontSize: "0.9rem" }}>
                  {currentVerificationMeta.text}
                </div>
                <div style={{ marginTop: "10px", display: "flex", justifyContent: "flex-end" }}>
                  <button type="button" className="btn btn-primary" style={{ width: "auto", padding: "6px 16px" }} onClick={dismissVerificationNotice}>
                    OK
                  </button>
                </div>
              </div>
            )}
            <RenderArea />
          </div>
        </main>
      </div>
    </AppContext.Provider>
  );
}

function Marketplace() {
  const ctx = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [ideas, setIdeas] = useState([]);
  const [sectorFilter, setSectorFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await getMarketplaceIdeas();
        setIdeas(data);
      } catch (err) {
        ctx?.setModal?.({ open: true, message: `Falha ao carregar marketplace: ${err.message}` });
        setIdeas([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const ideiasFiltradas = ideas.filter((idea) => {
    const bySector = !sectorFilter || String(idea.sector || "").toLowerCase().includes(sectorFilter.toLowerCase());
    const byCity = !cityFilter || String(idea.city || "").toLowerCase().includes(cityFilter.toLowerCase());
    return bySector && byCity;
  });

  const formatCapital = (v) => Number(v || 0).toLocaleString("pt-PT");

  return (
    <div className="marketplace-wrapper">
      <div className="dashboard-card" style={{ marginBottom: '25px', padding: '20px' }}>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: 1, minWidth: '220px' }}>
            <label className="form-label">Filtrar por setor</label>
            <input
              className="form-input"
              value={sectorFilter}
              onChange={(e) => setSectorFilter(e.target.value)}
              placeholder="Ex: Fintech"
            />
          </div>
          <div style={{ flex: 1, minWidth: '220px' }}>
            <label className="form-label">Filtrar por cidade</label>
            <input
              className="form-input"
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              placeholder="Ex: Luanda"
            />
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {loading ? (
          <div className="dashboard-card"><p>A carregar ideias do marketplace...</p></div>
        ) : ideiasFiltradas.length === 0 ? (
          <div className="dashboard-card"><p>Sem ideias publicadas para os filtros atuais.</p></div>
        ) : ideiasFiltradas.map((s) => (
          <div
            key={s.id}
            className="dashboard-card"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'transform 0.2s',
              cursor: 'pointer'
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-5px)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                <div style={{ width: 50, height: 50, background: 'var(--dm-bg)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--primary-600)' }}>
                  {(s.title || "I").charAt(0)}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="badge badge-success" style={{ fontSize: '0.8rem' }}>
                    Score IA: {Number(s.viability_score || 0)}
                  </span>
                  <div style={{ fontSize: '0.75rem', color: 'var(--dm-text-muted)', marginTop: 5 }}>
                    {s.city || "-"}{s.region ? `, ${s.region}` : ""}
                  </div>
                </div>
              </div>

              <h3 style={{ margin: '0 0 10px 0' }}>{s.title}</h3>
              <span style={{ display: 'inline-block', padding: '2px 8px', background: 'var(--primary-100)', color: 'var(--primary-600)', borderRadius: 4, fontSize: '0.75rem', fontWeight: 600 }}>
                {s.sector || "Geral"}
              </span>
              <p style={{ fontSize: '0.9rem', color: 'var(--dm-text-muted)', lineHeight: 1.5, marginTop: 10 }}>
                {s.description || "Sem descrição."}
              </p>
            </div>

            <div style={{ borderTop: '1px solid var(--dm-border)', paddingTop: 15, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--dm-text-muted)', textTransform: 'uppercase' }}>
                  Capital inicial
                </span>
                <strong style={{ color: '#10b981' }}>{formatCapital(s.initial_capital)} AOA</strong>
              </div>
              <button
                className="btn btn-primary"
                style={{ padding: '8px 15px', fontSize: '0.85rem' }}
                onClick={() => ctx?.setModal?.({
                  open: true,
                  title: s.title,
                  message: `Setor: ${s.sector || "-"} | Cidade: ${s.city || "-"} | Empreendedor: ${s.owner_name || "-"} | Status: ${s.status}`,
                })}
              >
                Ver mais
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
function Investimentos() {
 
  const myPortfolio = [
    { id: 1, startup: "Kwanza Pay", equity: "5%", invested: "Kz 25.000", currentVal: "Kz 45.000", status: "Em Crescimento", roi: "+80%" },
    { id: 2, startup: "AgroFácil", equity: "10%", invested: "Kz 15.000", currentVal: "Kz 18.500", status: "Estável", roi: "+23%" },
    { id: 3, startup: "TechEdu Angola", equity: "2%", invested: "Kz 10.000", currentVal: "Kz 9.000", status: "Risco", roi: "-10%" }
  ];

  return (<>
    <div className="portfolio-container">
      <div className="stats-grid" style={{ marginBottom: '25px' }}>
        <div className="stat-card">
          <div className="stat-card-content" >
            <div className="stat-info">
              <div className="stat-label">Total Alocado</div>
              <div className="stat-value">Kz 50.000</div>
              <div className="stat-change">3 Startups ativas</div>
            </div>
            <div className="stat-icon-wrapper stat-icon-success">
              {icons['dollar-sign']}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-content">
            <div className="stat-info">
              <div className="stat-label">Valorização Total</div>
              <div className="stat-value">Kz 72.500</div>
              <div className="stat-change" style={{ color: '#10b981' }}>
                ↑ Kz 22.500 (45%)
              </div>
            </div>
            <div className="stat-icon-wrapper stat-icon-primary">
              {icons['trending-up']}
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-card">
        <div className="dashboard-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 className="dashboard-card-title">Detalhamento do Portfólio</h3>
            <p className="dashboard-card-description">Acompanhamento de participação e ROI por startup.</p>
          </div>
          <button
            className="btn"
            style={{
              background: 'var(--primary-100)',
              color: 'var(--primary-600)',
              fontWeight: 600,
              border: 'none',
              padding: '10px 15px',
              borderRadius: '8px'
            }}
          >
            Baixar Extrato
          </button>
        </div>

        <div style={{ overflowX: 'auto', marginTop: '20px' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Startup</th>
                <th>Equity (%)</th>
                <th>Valor Investido</th>
                <th>Valuation Atual</th>
                <th>ROI</th>
                <th>Status</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {myPortfolio.map(item => (
                <tr key={item.id}>
                  <td><strong>{item.startup}</strong></td>
                  <td>{item.equity}</td>
                  <td>{item.invested}</td>
                  <td>{item.currentVal}</td>
                  <td
                    style={{
                      color: item.roi.startsWith('+') ? '#10b981' : '#ef4444',
                      fontWeight: 600
                    }}
                  >
                    {item.roi}
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        item.status === 'Risco' ? 'badge-warning' : 'badge-success'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn"
                      style={{ padding: '5px 10px', fontSize: '0.75rem', background: 'var(--dm-bg)' }}
                      onClick={() => ctx?.setModal?.({ open: true, message: t('config.openingReports') + ' ' + item.startup })}
                    >
                      Relatórios
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </>);
}
function Analytics() {
  return( <>
    <div className="analytics-container">
      <div className="dashboard-card" style={{marginBottom: '25px', display: 'flex', justifyContent:' space-between', alignItems: 'center'}}>
        <div>
          <h3 style={{margin: '0'}}>Análise de Mercado & Performance</h3>
          <p style={{margin:' 5px 0 0 0', color:' var(--dm-text-muted)', fontSize: '0.85rem'}}>Dados baseados em tendências reais do ecossistema AngoStart.</p>
        </div>
        <select className="input-field form-input" style={{padding: '8px 15px' , borderRadius: '8px', border:' 1px solid var(--dm-border)'}}>
          <option>Últimos 12 meses</option>
          <option>Últimos 6 meses</option>
          <option>Este Ano (2026)</option>
        </select>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '25px'}}>
        
        <div className="dashboard-card">
          <h4 className="dashboard-card-title">Crescimento Médio do Portfólio</h4>
          <p className="dashboard-card-description">Evolução do valuation das suas startups investidas.</p>
          
          <div style={{height: '200px', marginTop: '30px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding:' 0 10px', borderBottom:' 2px solid var(--dm-border)', borderLeft: '2px solid var(--dm-border)'}}>
            <div style={{width: '10%', background: '#e0e7ff', height:' 30%', borderRadius:' 4px 4px 0 0'}} title="Jan"></div>
            <div style={{width: '10%', background: '#e0e7ff', height:' 30%', borderRadius:' 4px 4px 0 0'}} title="Fev"></div>
            <div style={{width: '10%', background: '#e0e7ff', height:' 30%', borderRadius:' 4px 4px 0 0'}} title="Mar"></div>
            <div style={{width: '10%', background: '#e0e7ff', height:' 30%', borderRadius:' 4px 4px 0 0'}} title="Abr"></div>
            <div style={{width: '10%', background: '#e0e7ff', height:' 30%', borderRadius:' 4px 4px 0 0'}} title="Maio"></div>
            <div style={{width: '10%', background: '#e0e7ff', height:' 30%', borderRadius:' 4px 4px 0 0'}} title="Jun"></div>

          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '0.75rem', color: 'var(--dm-text-muted)'}}>
            <span>Jan</span><span>Fev</span><span>Mar</span><span>Abr</span><span>Mai</span><span>Jun</span>
          </div>
        </div>

        <div className="dashboard-card">
          <h4 className="dashboard-card-title">Setores em Alta (Angola)</h4>
          <div style={{marginTop:' 15px'}}>
            <div style={{marginBottom: '15px'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '5px'}}>
                <span>Fintech</span>
                <span style={{color: '#10b981', fontWeight: 'bold'}}>+42%</span>
              </div>
              <div style={{width: '100%', background: 'var(--dm-bg)', height: '8px', borderRadius: '4px'}}>
                <div style={{width: '90%', background:' #10b981', height: '100%', borderRadius: '4px'}}></div>
              </div>
            </div>
            <div style={{marginBottom: '15px'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '5px'}}>
                <span>AgriTech</span>
                <span style={{color: '#10b981', fontWeight: 'bold'}}>+28%</span>
              </div>
              <div style={{width: '100%', background: 'var(--dm-bg)', height: '8px', borderRadius: '4px'}}>
                <div style={{width:' 65%', background: 'var(--primary-600)', height: '100%', borderRadius: '4px'}}></div>
              </div>
            </div>
            <div style={{marginBottom: '15px'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '5px'}}>
                <span>EdTech</span>
                <span style={{color: '#f59e0b', fontWeight: 'bold'}}>+12%</span>
              </div>
              <div style={{width: '100%', background: 'var(--dm-bg)', height:' 8px', borderRadius: '4px'}}>
                <div style={{width: '40%', background: '#f59e0b', height: '100%', borderRadius: '4px'}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-card">
        <h3 className="dashboard-card-title">Análise Comparativa de Risco (Score IA)</h3>
        <div style={{overflowX: 'auto', marginTop: '20px'}}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Startup</th>
                <th>Setor</th>
                <th>Tração Mensal</th>
                <th>Score IA Atual</th>
                <th>Projeção 6m</th>
                <th>Nível de Risco</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>SolarPay</strong></td>
                <td>Energia</td>
                <td><span style={{color: '#10b981'}}>↑ 15%</span></td>
                <td><span className="badge badge-success">92</span></td>
                <td>95.5</td>
                <td style={{color: '#10b981'}}>Baixo</td>
              </tr>
              <tr>
                <td><strong>Kwanza Pay</strong></td>
                <td>Fintech</td>
                <td><span style={{color: '#10b981'}}>↑ 8%</span></td>
                <td><span className="badge badge-success">88</span></td>
                <td>91.2</td>
                <td style={{color: '#10b981'}}>Baixo</td>
              </tr>
              <tr>
                <td><strong>AgroFácil</strong></td>
                <td>AgriTech</td>
                <td><span style={{color: '#ef4444'}}>↓ 2%</span></td>
                <td><span className="badge badge-warning">75</span></td>
                <td>78.0</td>
                <td style={{color: '#f59e0b'}}>Médio</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </>);
}
function Propostas() {
  const ctx = useContext(AppContext);
  const t = ctx?.t ?? (k => k);
  return (
    <div
      className="responsive-split-layout"
      style={{
        display: 'grid',
        gridTemplateColumns: '350px 1fr',
        gap: '20px',
        height: 'calc(100vh - 180px)',
        minHeight: '500px'
      }}
    >
      {/* LISTA DE PROPOSTAS */}
      <div
        className="dashboard-card"
        style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}
      >
        <div style={{ padding: '20px', borderBottom: '1px solid var(--dm-border)' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Solicitações Recebidas</h3>
          <p style={{ margin: '5px 0 0 0', fontSize: '0.8rem', color: 'var(--dm-text-muted)' }}>
            Você tem 2 propostas pendentes
          </p>
        </div>

        <div style={{ overflowY: 'auto', flex: 1 }}>
          <div
            className="proposta-item active"
            style={{
              padding: '15px',
              borderBottom: '1px solid var(--dm-border)',
              cursor: 'pointer',
              background: 'var(--primary-100)',
              borderLeft: '4px solid var(--primary-600)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <strong style={{ fontSize: '0.9rem' }}>SolarPay Angola</strong>
              <span style={{ fontSize: '0.7rem', color: 'var(--dm-text-muted)' }}>Hoje</span>
            </div>
            <p
              style={{
                margin: 0,
                fontSize: '0.85rem',
                color: 'var(--dm-text)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              Proposta de Equity: 5% por Kz 25.000
            </p>
            <span className="badge badge-warning" style={{ fontSize: '0.65rem', marginTop: '5px' }}>
              Pendente
            </span>
          </div>

          <div
            className="proposta-item"
            style={{ padding: '15px', borderBottom: '1px solid var(--dm-border)', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <strong style={{ fontSize: '0.9rem' }}>AgroFácil</strong>
              <span style={{ fontSize: '0.7rem', color: 'var(--dm-text-muted)' }}>Ontem</span>
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--dm-text)' }}>
              Solicitação de Mentoria e Aporte
            </p>
            <span className="badge badge-success" style={{ fontSize: '0.65rem', marginTop: '5px' }}>
              Em conversa
            </span>
          </div>
        </div>
      </div>

      {/* CHAT / DETALHE */}
      <div
        className="dashboard-card"
        style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}
      >
        <div
          style={{
            padding: '15px 20px',
            borderBottom: '1px solid var(--dm-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'var(--dm-surface)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: 40,
                height: 40,
                background: 'var(--primary-600)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--on-primary)',
                fontWeight: 'bold'
              }}
            >
              S
            </div>
            <div>
              <h4 style={{ margin: 0 }}>SolarPay Angola</h4>
              <span style={{ fontSize: '0.75rem', color: '#10b981' }}>
                Score IA: 92/100
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              className="btn"
              style={{
                background: 'var(--error-100)',
                color: 'var(--error-500)',
                border: 'none',
                padding: '8px 15px',
                borderRadius: '6px',
                fontWeight: 600
              }}
              onClick={() => ctx?.setModal?.({ open: true, message: t('config.proposalRejected') })}
            >
              Recusar
            </button>

            <button
              className="btn btn-primary"
              style={{ padding: '8px 15px', borderRadius: '6px' }}
              onClick={() => ctx?.setModal?.({ open: true, message: t('config.proposalAccepted') })}
            >
              Aceitar Proposta
            </button>
          </div>
        </div>

        <div
          style={{
            flex: 1,
            padding: '20px',
            background: 'var(--neutral-50)',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px'
          }}
        >
          <div
            style={{
              alignSelf: 'flex-start',
              background: 'var(--dm-surface)',
              padding: '12px',
              borderRadius: '12px',
              borderBottomLeftRadius: '2px',
              maxWidth: '70%',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}
          >
            <p style={{ margin: 0, fontSize: '0.9rem' }}>
              Olá, Maria Investidora! Enviamos nosso pitch deck atualizado. Estamos buscando
              25.000 Kz para expansão em Benguela em troca de 5% de equity.
            </p>
            <span style={{ fontSize: '0.7rem', color: 'var(--dm-text-muted)', marginTop: '5px', display: 'block' }}>
              10:30 AM
            </span>
          </div>

          <div
            style={{
              alignSelf: 'flex-end',
              background: 'var(--primary-600)',
              color: 'var(--on-primary)',
              padding: '12px',
              borderRadius: '12px',
              borderBottomRightRadius: '2px',
              maxWidth: '70%'
            }}
          >
            <p style={{ margin: 0, fontSize: '0.9rem' }}>
              Obrigada pelo envio! Analisando o Score IA de vocês, parece promissor. Podemos
              agendar uma call amanhã?
            </p>
            <span
              style={{
                fontSize: '0.7rem',
                color: '#e0e7ff',
                marginTop: '5px',
                display: 'block'
              }}
            >
              10:45 AM
            </span>
          </div>
        </div>

        <div
          style={{
            padding: '15px',
            borderTop: '1px solid var(--dm-border)',
            background: 'var(--dm-surface)',
            display: 'flex',
            gap: '10px'
          }}
        >
          <input
            type="text"
            placeholder="Escreva sua mensagem ou contraproposta..."
            style={{
              flex: 1,
              padding: '10px',
              border: '1px solid var(--dm-border)',
              borderRadius: '8px',
              outline: 'none'
            }}
          />
          <button className="btn btn-primary" style={{ padding: '0 20px' }}>
            Enviar
          </button>
        </div>
      </div>
      <style>
        {`
          .proposta-item:hover { background: var(--primary-100); }
          .badge-warning { background: var(--warning-100); color: var(--warning-500); }
          .badge-success { background: var(--success-100); color: var(--success-500); }
        `}
      </style>
    </div>
  );
}
function InvestidorPerfil() {
  const ctx = useContext(AppContext);
  const t = ctx?.t ?? (k => k);
  const user = ctx?.currentUser || null;
  const p = user?.profileData || {};
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);
  const [editForm, setEditForm] = useState({
    phone: "",
    province: "",
    investorType: "individual",
    profession: "",
    incomeSource: "",
    investmentRange: "",
    companyName: "",
    companyNif: "",
    companyRole: "",
    hasInvestmentExperience: "",
    investmentExperienceArea: "",
    linkedinOrWebsite: "",
  });
  useEffect(() => {
    setEditForm({
      phone: p.phone || "",
      province: p.province || "",
      investorType: p.investor_type || p.investorType || "individual",
      profession: p.profession || "",
      incomeSource: p.income_source || p.incomeSource || "",
      investmentRange: p.investment_range || p.investmentRange || "",
      companyName: p.company_name || p.companyName || "",
      companyNif: p.company_nif || p.companyNif || "",
      companyRole: p.company_role || p.companyRole || "",
      hasInvestmentExperience: p.has_investment_experience || p.hasInvestmentExperience || "",
      investmentExperienceArea: p.investment_experience_area || p.investmentExperienceArea || "",
      linkedinOrWebsite: p.linkedin_or_website || p.linkedinOrWebsite || "",
    });
  }, [user?.id, user?.role, user?.verificationStatus, p.phone, p.province, p.investor_type, p.investorType, p.profession, p.income_source, p.incomeSource, p.investment_range, p.investmentRange, p.company_name, p.companyName, p.company_nif, p.companyNif, p.company_role, p.companyRole, p.has_investment_experience, p.hasInvestmentExperience, p.investment_experience_area, p.investmentExperienceArea, p.linkedin_or_website, p.linkedinOrWebsite]);
  const investorType = p.investor_type || p.investorType || "";
  const status = user?.verificationStatus || "pending";
  const verificationLabel = status === "approved" ? "✔ Conta Verificada" : status === "rejected" ? "Conta rejeitada" : "Conta em verificação";
  const verificationColor = status === "approved" ? "#10b981" : status === "rejected" ? "#ef4444" : "#f59e0b";
  const verificationText = status === "approved"
    ? "Identidade validada pela AngoStart."
    : status === "rejected"
      ? "A verificação foi rejeitada. Atualize os documentos para nova análise."
      : "Conta em análise pela equipe de validação.";
  const headerTitle = investorType === "empresa" ? "Investidor Empresa" : "Investidor Individual";
  const profileHighlights = [
    p.investment_range || p.investmentRange ? `Faixa de investimento: ${p.investment_range || p.investmentRange}` : null,
    p.investment_experience_area || p.investmentExperienceArea ? `Área de experiência: ${p.investment_experience_area || p.investmentExperienceArea}` : null,
    p.income_source || p.incomeSource ? `Fonte de renda: ${p.income_source || p.incomeSource}` : null,
    p.has_investment_experience || p.hasInvestmentExperience ? `Experiência com investimento: ${p.has_investment_experience || p.hasInvestmentExperience}` : null,
  ].filter(Boolean);

  const profileBio = [
    p.profession ? `Profissão: ${p.profession}.` : null,
    p.company_name || p.companyName ? `Empresa: ${p.company_name || p.companyName}.` : null,
    p.company_role || p.companyRole ? `Função: ${p.company_role || p.companyRole}.` : null,
  ].filter(Boolean).join(" ");

  const handleEditChange = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const submitProfileEdit = async () => {
    setSavingEdit(true);
    try {
      await updateMyProfile({ profileData: editForm });
      await ctx?.refreshCurrentUser?.();
      setIsEditOpen(false);
      ctx?.setModal?.({
        open: true,
        title: "Perfil atualizado",
        message: "Os seus dados foram atualizados. A sua conta será verificada novamente pela nossa equipa.",
      });
    } catch (err) {
      ctx?.setModal?.({
        open: true,
        title: "Falha ao editar perfil",
        message: err.message || "Não foi possível atualizar os dados do perfil.",
      });
    } finally {
      setSavingEdit(false);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      
      {/* HEADER PERFIL */}
      <div className="dashboard-card" style={{ padding: 0, overflow: 'hidden', marginBottom: '25px' }}>
        <div style={{ height: '88px', background: 'var(--primary-800)' }} />
        
        <div style={{ padding: '0 30px 30px', marginTop: '-50px', display: 'flex', alignItems: 'flex-end', gap: '20px' }}>
          <div style={{ width: 120, height: 120, borderRadius: '50%', border: '5px solid var(--dm-surface)', background: 'var(--primary-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 700, color: 'var(--primary-700)' }}>
            {String(user?.name || "I").charAt(0)}
          </div>

          <div style={{ flex: 1 }}>
            <h2 style={{ margin: 0 }}>{user?.name || "Investidor"}</h2>
            <p style={{ margin: '5px 0 0', color: 'var(--dm-text-muted)' }}>
              {headerTitle} • {p.province || "Angola"}
            </p>
          </div>

          <button
            className="btn btn-primary"
            onClick={() => setIsEditOpen(true)}
          >
            Editar Perfil
          </button>
        </div>
      </div>

      {/* CONTEÚDO */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '25px' }}>
        
        {/* COLUNA ESQUERDA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          
          <div className="dashboard-card">
            <h4>Status de Verificação</h4>
            <div style={{ color: verificationColor, fontWeight: 600 }}>{verificationLabel}</div>
            <p style={{ fontSize: '0.8rem', color: 'var(--dm-text-muted)' }}>
              {verificationText}
            </p>
          </div>

          <div className="dashboard-card">
            <h4>Preferências de Investimento</h4>
            <ul style={{ paddingLeft: '20px', fontSize: '0.9rem', lineHeight: '1.6' }}>
              {(profileHighlights.length ? profileHighlights : ["Sem preferências registradas no perfil."]).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* COLUNA DIREITA */}
        <div className="dashboard-card">
          <h3 className="dashboard-card-title">Biografia Profissional</h3>
          <p style={{ lineHeight: '1.6', color: 'var(--dm-text)' }}>
            {profileBio || "Sem biografia registrada. Complete o perfil para melhorar sua apresentação."}
          </p>

          <hr style={{ borderTop: '1px solid var(--dm-border)', margin: '25px 0' }} />

          <h3 className="dashboard-card-title">Informações de Contato</h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <Info label="E-mail" value={user?.email || "-"} />
            <Info label="Telefone" value={p.phone || "-"} />
            <Info
              label="LinkedIn"
              value={p.linkedin_or_website || p.linkedinOrWebsite ? <a href={p.linkedin_or_website || p.linkedinOrWebsite} style={{ color: '#2563eb' }}>Ver perfil</a> : "-"}
            />
            <Info label="NIF da empresa" value={p.company_nif || p.companyNif || "-"} />
          </div>
        </div>
      </div>

      {isEditOpen && (
        <div className="modal-overlay" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 9999, display: "flex", justifyContent: "center", alignItems: "center", padding: "12px" }} onClick={() => setIsEditOpen(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()} style={{ width: "min(820px, 96vw)", maxHeight: "calc(100vh - 24px)", overflowY: "auto", background: "var(--dm-surface)", border: "1px solid var(--dm-border)", borderRadius: "12px", padding: "20px" }}>
            <h3 style={{ marginTop: 0 }}>Editar dados do perfil</h3>
            <p style={{ marginTop: 0, color: "var(--dm-text-muted)", fontSize: "0.9rem" }}>
              Atualize as informações abaixo e clique em <strong>Confirmar e Editar</strong>.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: "12px" }}>
              <div><label className="form-label">Telefone</label><input className="form-input" value={editForm.phone} onChange={(e) => handleEditChange("phone", e.target.value)} /></div>
              <div><label className="form-label">Província</label><input className="form-input" value={editForm.province} onChange={(e) => handleEditChange("province", e.target.value)} /></div>
              <div>
                <label className="form-label">Tipo de investidor</label>
                <select className="form-input" value={editForm.investorType} onChange={(e) => handleEditChange("investorType", e.target.value)}>
                  <option value="individual">Individual</option>
                  <option value="empresa">Empresa</option>
                </select>
              </div>
              <div><label className="form-label">Profissão</label><input className="form-input" value={editForm.profession} onChange={(e) => handleEditChange("profession", e.target.value)} /></div>
              <div><label className="form-label">Fonte de renda</label><input className="form-input" value={editForm.incomeSource} onChange={(e) => handleEditChange("incomeSource", e.target.value)} /></div>
              <div><label className="form-label">Faixa de investimento</label><input className="form-input" value={editForm.investmentRange} onChange={(e) => handleEditChange("investmentRange", e.target.value)} /></div>
              <div><label className="form-label">Empresa</label><input className="form-input" value={editForm.companyName} onChange={(e) => handleEditChange("companyName", e.target.value)} /></div>
              <div><label className="form-label">NIF</label><input className="form-input" value={editForm.companyNif} onChange={(e) => handleEditChange("companyNif", e.target.value)} /></div>
              <div><label className="form-label">Cargo</label><input className="form-input" value={editForm.companyRole} onChange={(e) => handleEditChange("companyRole", e.target.value)} /></div>
              <div>
                <label className="form-label">Experiência com investimento</label>
                <select className="form-input" value={editForm.hasInvestmentExperience} onChange={(e) => handleEditChange("hasInvestmentExperience", e.target.value)}>
                  <option value="">Selecione</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
              </div>
              <div><label className="form-label">Área de experiência</label><input className="form-input" value={editForm.investmentExperienceArea} onChange={(e) => handleEditChange("investmentExperienceArea", e.target.value)} /></div>
              <div><label className="form-label">LinkedIn / Website</label><input className="form-input" value={editForm.linkedinOrWebsite} onChange={(e) => handleEditChange("linkedinOrWebsite", e.target.value)} /></div>
            </div>

            <div style={{ marginTop: "16px", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button className="btn btn-outline" style={{ width: "auto" }} onClick={() => setIsEditOpen(false)} disabled={savingEdit}>Cancelar</button>
              <button className="btn btn-primary" style={{ width: "auto" }} onClick={submitProfileEdit} disabled={savingEdit}>
                {savingEdit ? "A guardar..." : "Confirmar e Editar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function loadSettings() {
  const raw = parseJsonSafe(localStorage.getItem(STORAGE_KEY), null);
  if (!raw) {
    return { dark: false, notificacoes: true, idioma: 'pt' };
  }
  return {
    dark: !!raw.dark,
    notificacoes: raw.notificacoes !== false,
    idioma: raw.idioma === 'en' ? 'en' : 'pt',
  };
}

function saveSettings(dark, notificacoes, idioma) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ dark, notificacoes, idioma }));
}

function Configuracoes() {
  const ctx = useContext(AppContext);
  const globalIdioma = ctx?.idioma ?? 'pt';
  const setGlobalIdioma = ctx?.setIdioma;
  const setModal = ctx?.setModal;
  const t = ctx?.t ?? (k => k);

  const [dark, setDark] = useState(() => loadSettings().dark);
  const [notificacoes, setNotificacoes] = useState(() => loadSettings().notificacoes);
  const [idiomaLocal, setIdiomaLocal] = useState(() => ctx?.idioma ?? loadSettings().idioma);

  useEffect(() => {
    if (dark) document.body.classList.add('dark-theme');
    else document.body.classList.remove('dark-theme');
  }, [dark]);

  useEffect(() => {
    if (globalIdioma !== idiomaLocal) setIdiomaLocal(globalIdioma);
  }, [globalIdioma]);

  const handleIdiomaChange = (newVal) => {
    setIdiomaLocal(newVal);
    setGlobalIdioma?.(newVal);
  };

  const handleSave = () => {
    saveSettings(dark, notificacoes, idiomaLocal);
    setGlobalIdioma?.(idiomaLocal);
    if (dark) document.body.classList.add('dark-theme');
    else document.body.classList.remove('dark-theme');
    setModal?.({ open: true, title: '', message: t('config.settingsSaved') });
  };

  const handleRestore = () => {
    const def = { dark: false, notificacoes: true, idioma: 'pt' };
    setDark(def.dark);
    setNotificacoes(def.notificacoes);
    setIdiomaLocal(def.idioma);
    setGlobalIdioma?.(def.idioma);
    saveSettings(def.dark, def.notificacoes, def.idioma);
    document.body.classList.remove('dark-theme');
    setModal?.({ open: true, title: '', message: t('config.defaultsRestored') });
  };

  return (
    <div className="dashboard-card" style={{ maxWidth: '700px', margin: '0 auto', padding: 0, overflow: 'hidden' }}>
      <div className="dashboard-card-header" style={{ padding: '25px', borderBottom: '1px solid var(--neutral-200)' }}>
        <h3 className="dashboard-card-title" style={{ fontSize: '1.25rem' }}>{t('config.title')}</h3>
        <p className="dashboard-card-description">{t('config.subtitle')}</p>
      </div>
      <div style={{ padding: '10px 25px 25px 25px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 0', borderBottom: '1px solid var(--neutral-100)' }}>
          <div>
            <h4 style={{ margin: '0', color: 'var(--neutral-900)' }}>{t('config.darkMode')}</h4>
            <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--neutral-500)' }}>{t('config.darkModeDesc')}</p>
          </div>
          <label className="switch">
            <input type="checkbox" checked={dark} onChange={() => setDark(!dark)} />
            <span className="slider round"></span>
          </label>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 0', borderBottom: '1px solid var(--neutral-100)' }}>
          <div>
            <h4 style={{ margin: '0', color: 'var(--neutral-900)' }}>{t('config.language')}</h4>
            <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--neutral-500)' }}>{t('config.languageDesc')}</p>
          </div>
          <select
            className="form-input"
            value={idiomaLocal}
            onChange={(e) => handleIdiomaChange(e.target.value)}
            style={{ width: 'auto', minWidth: '180px', padding: '8px' }}
          >
            <option value="pt">Português (Portugal)</option>
            <option value="en">English</option>
          </select>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 0' }}>
          <div>
            <h4 style={{ margin: '0', color: 'var(--neutral-900)' }}>{t('config.notifications')}</h4>
            <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--neutral-500)' }}>{t('config.notificationsDesc')}</p>
          </div>
          <label className="switch">
            <input type="checkbox" checked={notificacoes} onChange={() => setNotificacoes(!notificacoes)} />
            <span className="slider round"></span>
          </label>
        </div>
        <div style={{ marginTop: '30px', display: 'flex', gap: '15px' }}>
          <button className="btn btn-primary" style={{ padding: '12px 30px', width: 'auto' }} onClick={handleSave}>
            {t('config.saveChanges')}
          </button>
          <button className="btn-logout" style={{ padding: '12px 30px', width: 'auto' }} onClick={handleRestore}>
            {t('common.restore')}
          </button>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <label style={{ fontSize: '0.8rem', color: 'var(--dm-text-muted)', display: 'block' }}>{label}</label>
      <strong>{value}</strong>
    </div>
  );
}

function StatCard({ label, value, icon, color }) {
  return (
    <div className={`stat-card ${color}`}>
      <div className="stat-info">
        <span className="stat-label">{label}</span>
        <span className="stat-value">{value}</span>
      </div>
      <div className="stat-icon">{icons[icon]}</div>
    </div>
  );
}     
function Usuarios() {
  const ctx = useContext(AppContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingUserId, setSavingUserId] = useState(null);
  const [aboutUser, setAboutUser] = useState(null);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await getAdminUsers();
      setUsers(data);
    } catch (err) {
      ctx?.setModal?.({ open: true, message: `Falha ao carregar usuários: ${err.message}` });
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleVerification = async (targetUserId, status) => {
    setSavingUserId(targetUserId);
    try {
      const updated = await updateAdminUserVerification(targetUserId, status);
      setUsers((prev) => prev.map((u) => (Number(u.id) === Number(targetUserId) ? updated : u)));
      ctx?.setModal?.({
        open: true,
        message: status === "approved"
          ? "Conta aprovada com sucesso."
          : "Conta rejeitada com sucesso.",
      });
    } catch (err) {
      ctx?.setModal?.({ open: true, message: `Falha ao atualizar verificação: ${err.message}` });
    } finally {
      setSavingUserId(null);
    }
  };

  const roleLabel = (role) => {
    if (role === "empreendedor") return "Empreendedor";
    if (role === "investidor") return "Investidor";
    if (role === "mentor") return "Mentor";
    if (role === "admin") return "Admin";
    return role;
  };

  const statusBadgeClass = (status) => {
    if (status === "approved") return "badge-success";
    if (status === "rejected") return "badge-warning";
    return "badge-info";
  };

  const statusLabel = (status, role) => {
    if (role === "admin" || role === "empreendedor") return "Ativo";
    if (status === "approved") return "Aprovado";
    if (status === "rejected") return "Rejeitado";
    return "Pendente";
  };

  const canModerate = (role) => role === "mentor" || role === "investidor";

  const profileFieldLabel = (key) => {
    const labels = {
      phone: "Telefone",
      businessName: "Nome do negócio",
      business_name: "Nome do negócio",
      businessSector: "Setor do negócio",
      business_sector: "Setor do negócio",
      businessStage: "Fase do negócio",
      business_stage: "Fase do negócio",
      businessLocation: "Local do negócio",
      business_location: "Local do negócio",
      identityNumber: "Número de identificação",
      identity_number: "Número de identificação",
      birthDate: "Data de nascimento",
      birth_date: "Data de nascimento",
      province: "Província",
      expertiseArea: "Área de especialidade",
      expertise_area: "Área de especialidade",
      experienceYears: "Anos de experiência",
      experience_years: "Anos de experiência",
      company: "Empresa",
      currentRole: "Função atual",
      current_role: "Função atual",
      investorType: "Tipo de investidor",
      investor_type: "Tipo de investidor",
      profession: "Profissão",
      incomeSource: "Fonte de renda",
      income_source: "Fonte de renda",
      investmentRange: "Faixa de investimento",
      investment_range: "Faixa de investimento",
      companyName: "Nome da empresa",
      company_name: "Nome da empresa",
      companyNif: "NIF da empresa",
      company_nif: "NIF da empresa",
      companyRole: "Cargo na empresa",
      company_role: "Cargo na empresa",
      hasInvestmentExperience: "Tem experiência com investimento",
      has_investment_experience: "Tem experiência com investimento",
      investmentExperienceArea: "Área da experiência em investimento",
      investment_experience_area: "Área da experiência em investimento",
      linkedin: "LinkedIn",
      linkedinOrWebsite: "LinkedIn ou website",
      linkedin_or_website: "LinkedIn ou website",
      verificationStatus: "Status de verificação",
      verification_status: "Status de verificação",
    };
    return labels[key] || key;
  };

  const openAbout = (u) => {
    setAboutUser(u);
  };

  return (
    <>
    <div className="dashboard-card admin-users-card" style={{ maxWidth: "100%", overflow: "hidden" }}>
      <div className="dashboard-card-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: "12px", flexWrap: "wrap"}}>
        <div>
          <h3 className="dashboard-card-title">Gerenciamento de Usuários</h3>
          <p className="dashboard-card-description">Visualize e gerencie todos os usuários cadastrados na plataforma.</p>
        </div>
        <button className="btn btn-primary admin-users-btn admin-users-refresh" onClick={loadUsers} disabled={loading}>Atualizar</button>
      </div>
      
      <div className="admin-users-content">
        {loading ? (
          <p>A carregar usuários...</p>
        ) : (
          <div className="admin-users-table-wrapper" style={{ width: "100%", overflowX: "auto" }}>
          <table className="data-table admin-users-table" style={{ minWidth: "620px" }}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Função</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td><strong>{u.name}</strong></td>
                  <td>
                    <span className="badge badge-primary">{roleLabel(u.role)}</span>
                  </td>
                  <td>
                    <span className={`badge ${statusBadgeClass(u.verificationStatus)}`}>
                      {statusLabel(u.verificationStatus, u.role)}
                    </span>
                  </td>
                  <td className="admin-users-actions">
                    <button
                      className="btn btn-outline admin-users-btn"
                      type="button"
                      onClick={() => openAbout(u)}
                    >
                      Sobre
                    </button>
                    {canModerate(u.role) ? (
                      <>
                        <button
                          className="btn btn-primary admin-users-btn"
                          type="button"
                          disabled={savingUserId === u.id || u.verificationStatus === "approved"}
                          onClick={() => handleVerification(u.id, "approved")}
                        >
                          Aprovar
                        </button>
                        <button
                          className="btn btn-outline admin-users-btn"
                          type="button"
                          style={{ color: "red" }}
                          disabled={savingUserId === u.id || u.verificationStatus === "rejected"}
                          onClick={() => handleVerification(u.id, "rejected")}
                        >
                          Rejeitar
                        </button>
                      </>
                    ) : (
                      <span style={{ color: "var(--neutral-500)" }}>Sem ação</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>
    </div>

    {aboutUser && (
      <div className="modal-overlay" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 9999, display: "flex", justifyContent: "center", alignItems: "center", padding: "12px" }} onClick={() => setAboutUser(null)}>
        <div className="modal-box" onClick={(e) => e.stopPropagation()} style={{ width: "min(860px, 96vw)", maxHeight: "calc(100vh - 24px)", overflowY: "auto", background: "var(--dm-surface)", border: "1px solid var(--dm-border)", borderRadius: "12px", padding: "20px" }}>
          <h3 style={{ marginTop: 0 }}>Dados do utilizador</h3>
          <div style={{ display: "grid", gap: "10px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "10px" }}>
              <div className="dashboard-card"><strong>Nome</strong><div>{aboutUser.name || "-"}</div></div>
              <div className="dashboard-card"><strong>Email</strong><div>{aboutUser.email || "-"}</div></div>
              <div className="dashboard-card"><strong>Função</strong><div>{roleLabel(aboutUser.role)}</div></div>
              <div className="dashboard-card"><strong>Status</strong><div>{statusLabel(aboutUser.verificationStatus, aboutUser.role)}</div></div>
              <div className="dashboard-card">
                <strong>Password</strong>
                <div style={{ marginTop: "6px", letterSpacing: "2px" }}>•••••••• (protegida)</div>
              </div>
            </div>
            <div className="dashboard-card">
              <strong>Dados de perfil</strong>
              <div style={{ marginTop: "8px", display: "grid", gap: "6px", fontSize: "0.92rem" }}>
                {Object.entries(aboutUser.profile || {}).length === 0 ? (
                  <span>Sem dados de perfil disponíveis.</span>
                ) : (
                  Object.entries(aboutUser.profile || {}).map(([k, v]) => (
                    <div key={k}><strong>{profileFieldLabel(k)}:</strong> {v == null || v === "" ? "-" : String(v)}</div>
                  ))
                )}
              </div>
            </div>
          </div>
          <div style={{ marginTop: "14px", display: "flex", justifyContent: "flex-end" }}>
            <button className="btn btn-primary" style={{ width: "auto" }} onClick={() => setAboutUser(null)}>Fechar</button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
function Ideias() {
  const ctx = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [ideas, setIdeas] = useState([]);
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const all = await getMarketplaceIdeas();
        const pending = (all || []).filter((i) => i.status === "submitted" || i.status === "analyzing");
        setIdeas(pending);
      } catch (err) {
        ctx?.setModal?.({ open: true, message: `Falha ao carregar ideias pendentes: ${err.message}` });
        setIdeas([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const formatDate = (iso) => {
    if (!iso) return "-";
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? "-" : d.toLocaleDateString("pt-PT");
  };

  const openIdeaReview = async (ideaId) => {
    setLoadingDetails(true);
    try {
      const idea = await getIdeaById(ideaId);
      setSelectedIdea(idea);
    } catch (err) {
      ctx?.setModal?.({ open: true, message: `Falha ao carregar detalhes da ideia: ${err.message}` });
    } finally {
      setLoadingDetails(false);
    }
  };

  return (<>
    <div className="dashboard-card">
      <div className="dashboard-card-header">
        <h3 className="dashboard-card-title">Ideias Pendentes de Aprovação</h3>
        <p className="dashboard-card-description">Ideias aguardando revisão</p>
      </div>
      {loading ? (
        <p>A carregar ideias...</p>
      ) : ideas.length === 0 ? (
        <p>Não há ideias pendentes no momento.</p>
      ) : (
      <div style={{ width: "100%", overflowX: "auto" }}>
      <table className="data-table" style={{ minWidth: "760px" }}>
        <thead>
          <tr>
            <th>Ideia</th>
            <th>Empreendedor</th>
            <th>Score IA</th>
            <th>Data Submissão</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {ideas.map((idea) => (
            <tr key={idea.id}>
              <td>{idea.title}</td>
              <td>{idea.owner_name || "-"}</td>
              <td><span className={`badge ${Number(idea.viability_score || 0) >= 80 ? "badge-success" : "badge-warning"}`}>{idea.viability_score ?? "-"}</span></td>
              <td>{formatDate(idea.created_at)}</td>
              <td>
                <button
                  className="btn btn-primary"
                  style={{padding: '0.5rem 1rem', fontSize: '0.875rem', width: 'auto'}}
                  onClick={() => openIdeaReview(idea.id)}
                  disabled={loadingDetails}
                >
                  {loadingDetails ? "A carregar..." : "Revisar"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      )}
    </div>

    {selectedIdea && (
      <div className="modal-overlay" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 9999, display: "flex", justifyContent: "center", alignItems: "center", padding: "12px" }} onClick={() => setSelectedIdea(null)}>
        <div className="modal-box" onClick={(e) => e.stopPropagation()} style={{ width: "min(860px, 96vw)", maxHeight: "calc(100vh - 24px)", overflowY: "auto", background: "var(--dm-surface)", border: "1px solid var(--dm-border)", borderRadius: "12px", padding: "20px" }}>
          <h3 style={{ marginTop: 0 }}>Análise da ideia</h3>
          <div style={{ display: "grid", gap: "10px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "10px" }}>
              <div className="dashboard-card"><strong>Título</strong><div>{selectedIdea.title || "-"}</div></div>
              <div className="dashboard-card"><strong>Empreendedor</strong><div>{selectedIdea.owner_name || "-"}</div></div>
              <div className="dashboard-card"><strong>Email</strong><div>{selectedIdea.owner_email || "-"}</div></div>
              <div className="dashboard-card"><strong>Status</strong><div>{selectedIdea.status || "-"}</div></div>
              <div className="dashboard-card"><strong>Score IA</strong><div>{selectedIdea.viability_score ?? "-"}</div></div>
              <div className="dashboard-card"><strong>Data</strong><div>{formatDate(selectedIdea.created_at)}</div></div>
            </div>
            <div className="dashboard-card">
              <strong>Detalhes da ideia</strong>
              <div style={{ marginTop: "8px", display: "grid", gap: "6px", fontSize: "0.92rem" }}>
                <div><strong>Setor:</strong> {selectedIdea.sector || "-"}</div>
                <div><strong>Cidade:</strong> {selectedIdea.city || "-"}</div>
                <div><strong>Região:</strong> {selectedIdea.region || "-"}</div>
                <div><strong>Capital inicial:</strong> {Number(selectedIdea.initial_capital || 0).toLocaleString("pt-PT")} AOA</div>
                <div><strong>Descrição:</strong> {selectedIdea.description || "-"}</div>
                <div><strong>Problema:</strong> {selectedIdea.problem || "-"}</div>
                <div><strong>Diferencial:</strong> {selectedIdea.differential_text || "-"}</div>
                <div><strong>Público-alvo:</strong> {selectedIdea.target_audience || "-"}</div>
              </div>
            </div>
          </div>
          <div style={{ marginTop: "14px", display: "flex", justifyContent: "flex-end" }}>
            <button className="btn btn-primary" style={{ width: "auto" }} onClick={() => setSelectedIdea(null)}>Fechar</button>
          </div>
        </div>
      </div>
    )}
  </>);
}
function Relatorio() {
  const ctx = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [report, setReport] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("");

  const loadReport = useCallback(async (monthValue = "") => {
    setLoading(true);
    try {
      const data = await getPerformanceReport(monthValue);
      setReport(data);
      if (!monthValue && data?.referenceMonth) {
        setSelectedMonth(data.referenceMonth);
      }
    } catch (err) {
      ctx?.setModal?.({ open: true, message: `Falha ao carregar relatório: ${err.message}` });
    } finally {
      setLoading(false);
    }
  }, [ctx]);

  useEffect(() => {
    loadReport("");
  }, [loadReport]);

  const handleMonthChange = async (e) => {
    const month = e.target.value;
    setSelectedMonth(month);
    await loadReport(month);
  };

  const exportReportPdf = async () => {
    if (!report) return;
    setExporting(true);
    try {
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text("Relatório de Performance - AngoStart", 14, 18);
      doc.setFontSize(11);
      doc.text(`Mês de referência: ${report.referenceLabel || "-"}`, 14, 27);
      doc.text(`Coleta: ${new Date(report.collectedAt || Date.now()).toLocaleString("pt-PT")}`, 14, 34);

      autoTable(doc, {
        startY: 42,
        head: [["Métrica", "Valor"]],
        body: [
          ["Ideias no mês", String(report.summary?.ideasInMonth ?? 0)],
          ["Novos cadastros", String(report.summary?.newSignups ?? 0)],
          ["Empreendedores", String(report.distribution?.empreendedores ?? 0)],
          ["Investidores", String(report.distribution?.investidores ?? 0)],
          ["Mentores", String(report.distribution?.mentores ?? 0)],
          ["Sessões de mentoria", String(report.activity?.mentoringSessions ?? 0)],
          ["Investimentos feitos", String(report.activity?.investmentsDone ?? 0)],
          ["Taxa de aprovação", `${report.activity?.approvalRate ?? 0}%`],
        ],
      });

      const safeMonth = (report.referenceMonth || "mes").replace("-", "_");
      doc.save(`relatorio_performance_${safeMonth}.pdf`);
      ctx?.setModal?.({ open: true, message: "Relatório exportado em PDF com sucesso." });
    } catch (err) {
      ctx?.setModal?.({ open: true, message: `Falha ao exportar PDF: ${err.message}` });
    } finally {
      setExporting(false);
    }
  };

  const totalDistribution =
    Number(report?.distribution?.empreendedores || 0) +
    Number(report?.distribution?.investidores || 0) +
    Number(report?.distribution?.mentores || 0);
  const pct = (value) => (totalDistribution > 0 ? Math.max(6, Math.round((Number(value || 0) / totalDistribution) * 100)) : 0);

  return (<>
    <div className="reports-container">
      <div className="dashboard-card" style={{marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '15px', flexWrap: 'wrap'}}>
        <div>
          <h3 style={{margin: '0'}}>Análise de Performance</h3>
          <p style={{margin: '0', color: 'var(--dm-text-muted)', fontSize: '0.9rem'}}>Relatórios detalhados da plataforma</p>
          <p style={{margin: '6px 0 0', color: 'var(--neutral-500)', fontSize: '0.8rem'}}>
            Mês de referência dos dados: {report?.referenceLabel || "-"}
          </p>
        </div>
        <div style={{display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap'}}>
          <label>Mês de Referência:</label>
          <select
            id="monthFilter"
            className="input-field"
            value={selectedMonth}
            onChange={handleMonthChange}
            style={{padding: '5px 10px', borderRadius: '5px', border: '1px solid var(--dm-border)', minWidth: '170px'}}
          >
            {(report?.availableMonths || []).map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
          <button className="btn btn-primary" onClick={exportReportPdf} disabled={exporting || loading} style={{padding: '5px 15px', width: 'auto'}}>
            {exporting ? "A exportar..." : "Exportar PDF"}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="dashboard-card"><p>A carregar relatório...</p></div>
      ) : (
      <>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-content">
            <div className="stat-info">
              <div className="stat-label">Ideias no Mês</div>
              <div className="stat-value">{report?.summary?.ideasInMonth ?? 0}</div>
              <div className="stat-change">Coletado no mês selecionado</div>
            </div>
            <div className="stat-icon-wrapper stat-icon-primary">
              {icons.lightbulb}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-content">
            <div className="stat-info">
              <div className="stat-label">Novos Cadastros</div>
              <div className="stat-value">{report?.summary?.newSignups ?? 0}</div>
              <div className="stat-change">Total no mês selecionado</div>
            </div>
            <div className="stat-icon-wrapper stat-icon-info">
              {icons.user}
            </div>
          </div>
        </div>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px'}}>
        <div className="dashboard-card">
          <h3 className="dashboard-card-title">Distribuição de Usuários</h3>
          <p className="dashboard-card-description">Divisão por tipo de perfil no mês selecionado</p>
          
          <div style={{marginTop: '20px'}}>
            <div style={{marginBottom: '15px'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '5px'}}>
                <span>Empreendedores</span>
                <strong>{report?.distribution?.empreendedores ?? 0}</strong>
              </div>
              <div style={{width: '100%', background: 'var(--dm-bg)', height: '10px', borderRadius: '5px'}}>
                <div style={{width: `${pct(report?.distribution?.empreendedores)}%`, background: 'var(--primary-color, #2563eb)', height: '100%', borderRadius: '5px'}}></div>
              </div>
            </div>

            <div style={{marginBottom: '15px'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '5px'}}>
                <span>Investidores</span>
                <strong>{report?.distribution?.investidores ?? 0}</strong>
              </div>
              <div style={{width: '100%', background: 'var(--dm-bg)', height: '10px', borderRadius: '5px'}}>
                <div style={{width: `${pct(report?.distribution?.investidores)}%`, background: '#10b981', height: '100%', borderRadius: '5px'}}></div>
              </div>
            </div>

            <div style={{marginBottom: '15px'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '5px'}}>
                <span>Mentores</span>
                <strong>{report?.distribution?.mentores ?? 0}</strong>
              </div>
              <div style={{width: '100%', background: 'var(--dm-bg)', height: '10px', borderRadius: '5px'}}>
                <div style={{width: `${pct(report?.distribution?.mentores)}%`, background: '#f59e0b', height: '100%', borderRadius: '5px'}}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <h3 className="dashboard-card-title">Atividade Recente</h3>
          <div style={{marginTop: '15px'}}>
            <ul style={{listStyle: 'none', padding: '0'}}>
              <li style={{padding: '10px 0', borderBottom: '1px solid var(--dm-border)', display: 'flex', justifyContent: 'space-between'}}>
                <span>Sessões de Mentoria</span>
                <strong>{report?.activity?.mentoringSessions ?? 0}</strong>
              </li>
              <li style={{padding:' 10px 0', borderBottom: '1px solid var(--dm-border)', display: 'flex', justifyContent: 'space-between'}}>
                <span>Investimentos Feitos</span>
                <strong>{report?.activity?.investmentsDone ?? 0}</strong>
              </li>
              <li style={{padding: '10px 0', borderBottom: '1px solid var(--dm-border)', display: 'flex', justifyContent: 'space-between'}}>
                <span>Taxa de Aprovação</span>
                <strong>{report?.activity?.approvalRate ?? 0}%</strong>
              </li>
            </ul>
          </div>
        </div>
      </div>
      </>
      )}
    </div>
  </>);
}
function Sessoes() {
  const ctx = useContext(AppContext);
  const t = ctx?.t ?? (k => k);
  const [filtroArea, setFiltroArea] = useState('Todos');

  const empreendedores = [
    { id: 1, nome: 'Ana Silva', projecto: 'EducaTech', area: 'Educação', data: 'Há 2 horas', cor: '#4f46e5' },
    { id: 2, nome: 'Carlos Mendes', projecto: 'Kwanza Pay', area: 'Fintech', data: 'Há 5 horas', cor: '#10b981' },
    { id: 3, nome: 'João Pedro', projecto: 'AgroSmart', area: 'AgriTech', data: 'Ontem', cor: '#f59e0b' },
    { id: 4, nome: 'Maria Lopes', projecto: 'Health Connect', area: 'Saúde', data: 'Há 2 dias', cor: '#ef4444' },
  ];

  const areas = ['Todos', 'Educação', 'Fintech', 'AgriTech', 'Saúde'];

  const listaFiltrada = filtroArea === 'Todos'
    ? empreendedores
    : empreendedores.filter(e => e.area === filtroArea);

  return (
    <div style={{ padding: '10px' }}>
      {/* HEADER */}
      <div className="dashboard-card" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 className="dashboard-card-title">Solicitações de Mentoria</h2>
          <p className="dashboard-card-description">Acompanhe os novos projetos que aguardam sua análise.</p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
           <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--neutral-500)' }}>FILTRAR:</span>
           <select
            className="form-input"
            style={{ width: 'auto', minWidth: '150px' }}
            value={filtroArea}
            onChange={e => setFiltroArea(e.target.value)}
          >
            {areas.map(area => (
              <option key={area} value={area}>{area}</option>
            ))}
          </select>
        </div>
      </div>

      {/* LISTA DE CARDS ESPAÇADOS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}> {/* Gap aumentado aqui */}
        {listaFiltrada.map(emp => (
          <div 
            key={emp.id} 
            className="dashboard-card" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              padding: '20px 25px',
              margin: 0,
              borderLeft: `6px solid ${emp.cor}`, // Detalhe de cor lateral
              transition: 'transform 0.2s',
              cursor: 'default'
            }}
          >
            {/* INFORMAÇÃO PRINCIPAL */}
            <div style={{ flex: 1.5 }}>
              <div style={{ fontWeight: '700', fontSize: '1.1rem', color: 'var(--neutral-900)' }}>{emp.nome}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--neutral-500)' }}>Solicitado {emp.data}</div>
            </div>

            {/* PROJETO */}
            <div style={{ flex: 2 }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--neutral-400)', display: 'block', fontWeight: 'bold' }}>PROJETO</span>
              <div style={{ fontWeight: '600', color: 'var(--primary-600)' }}>{emp.projecto}</div>
            </div>

            {/* ÁREA COM TAG COLORIDA */}
            <div style={{ flex: 1 }}>
              <span style={{ 
                padding: '5px 12px', 
                borderRadius: '6px', 
                fontSize: '0.75rem', 
                fontWeight: '600',
                backgroundColor: emp.cor + '15', // Cor de fundo suave
                color: emp.cor 
              }}>
                {emp.area}
              </span>
            </div>

            {/* STATUS E AÇÃO */}
            <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--success-500)' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--success-500)' }}></div>
                Ativo
              </div>
              
              <button 
                className="btn btn-primary" 
                style={{ padding: '10px 20px', fontSize: '0.85rem' }}
                onClick={() => ctx?.setModal?.({ open: true, message: t('config.startingMentoring') + ' ' + emp.nome })}
              >
                Analisar
              </button>
            </div>
          </div>
        ))}

        {listaFiltrada.length === 0 && (
          <div className="dashboard-card" style={{ textAlign: 'center', padding: '3rem' }}>
            <p className="dashboard-card-description">Nenhuma solicitação encontrada para esta categoria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
function Mentorados() {
  const ctx = useContext(AppContext);
  const t = ctx?.t ?? (k => k);
  const [busca, setBusca] = useState("");

  const conversas = [
    {
      id: 1,
      nome: 'Ana Silva',
      projeto: 'EducaTech',
      ultimaMensagem: 'Professor, acabei de enviar o novo Business Plan.',
      horario: '10:45',
      naoLidas: 2,
      online: true,
      avatar: 'AS'
    },
    {
      id: 2,
      nome: 'Carlos Mendes',
      projeto: 'Kwanza Pay',
      ultimaMensagem: 'Obrigado pelas dicas no pitch de ontem!',
      horario: 'Ontem',
      naoLidas: 0,
      online: false,
      avatar: 'CM'
    },
    {
      id: 3,
      nome: 'João Pedro',
      projeto: 'AgroSmart',
      ultimaMensagem: 'Podemos adiar a sessão para as 16h?',
      horario: 'Segunda',
      naoLidas: 0,
      online: true,
      avatar: 'JP'
    }
  ];

  const conversasFiltradas = conversas.filter(c => 
    c.nome.toLowerCase().includes(busca.toLowerCase()) || 
    c.projeto.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div style={{ padding: '10px' }}>
      {/* HEADER E BUSCA */}
      <div className="dashboard-card" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 className="dashboard-card-title">Minhas Conversas</h2>
          <p className="dashboard-card-description">Mantenha contato direto com seus mentorados ativos.</p>
        </div>
        
        <div style={{ position: 'relative', width: '300px' }}>
          <input 
            type="text" 
            className="form-input" 
            placeholder="Buscar mentorado ou projeto..." 
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            style={{ paddingLeft: '15px' }}
          />
        </div>
      </div>

      {/* LISTA DE CONVERSAS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {conversasFiltradas.map(chat => (
          <div 
            key={chat.id} 
            className="dashboard-card" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              padding: '15px 20px',
              margin: 0,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              border: chat.naoLidas > 0 ? '1px solid var(--primary-300)' : '1px solid var(--neutral-200)',
              backgroundColor: chat.naoLidas > 0 ? 'var(--primary-50)' : 'var(--neutral-white)'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateX(5px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateX(0)'}
            onClick={() => ctx?.setModal?.({ open: true, message: t('config.openingChat') + ' ' + chat.nome })}
          >
            {/* AVATAR COM STATUS ONLINE */}
            <div style={{ position: 'relative', marginRight: '20px' }}>
              <div style={{ 
                width: '55px', height: '55px', borderRadius: '50%', 
                backgroundColor: 'var(--primary-100)', color: 'var(--primary-600)',
                display: 'flex', alignItems: 'center', justifySelf: 'center',
                justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem'
              }}>
                {chat.avatar}
              </div>
              {chat.online && (
                <div style={{ 
                  position: 'absolute', bottom: '2px', right: '2px', 
                  width: '12px', height: '12px', borderRadius: '50%', 
                  backgroundColor: 'var(--success-500)', border: '2px solid white' 
                }}></div>
              )}
            </div>

            {/* CONTEÚDO DA MENSAGEM */}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--neutral-900)' }}>
                  {chat.nome} <span style={{ fontWeight: '400', color: 'var(--neutral-400)', fontSize: '0.85rem' }}>• {chat.projeto}</span>
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--neutral-500)' }}>{chat.horario}</span>
              </div>
              <div style={{ 
                fontSize: '0.9rem', 
                color: chat.naoLidas > 0 ? 'var(--neutral-900)' : 'var(--neutral-500)',
                fontWeight: chat.naoLidas > 0 ? '500' : '400',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '500px'
              }}>
                {chat.ultimaMensagem}
              </div>
            </div>

            {/* INDICADOR DE NÃO LIDAS */}
            {chat.naoLidas > 0 && (
              <div style={{ 
                marginLeft: '20px', backgroundColor: 'var(--primary-600)', 
                color: 'white', borderRadius: '50%', width: '24px', height: '24px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.75rem', fontWeight: 'bold'
              }}>
                {chat.naoLidas}
              </div>
            )}
            
            <div style={{ marginLeft: '20px', color: 'var(--neutral-300)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
function Agenda() {
  const [dataSelecionada, setDataSelecionada] = useState("11 de Fevereiro, 2026");

  const mentoriasAgendadas = [
    { id: 1, hora: "09:00", mentorado: "Ana Silva", projeto: "EducaTech", status: "Confirmado" },
    { id: 2, hora: "11:30", mentorado: "Carlos Mendes", projeto: "Kwanza Pay", status: "Confirmado" },
    { id: 3, hora: "14:00", mentorado: "João Pedro", projeto: "AgroSmart", status: "Pendente" },
    { id: 4, hora: "16:30", mentorado: "Maria Lopes", projeto: "Health Connect", status: "Confirmado" },
  ];

  return (
    <div style={{ padding: '10px' }}>
      {/* HEADER */}
      <div className="dashboard-card" style={{ marginBottom: '2rem' }}>
        <h2 className="dashboard-card-title">Minha Agenda</h2>
        <p className="dashboard-card-description">Gerencie seus horários e sessões de mentoria.</p>
      </div>

      <div className="responsive-split-layout" style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '25px', alignItems: 'start' }}>
        
        {/* LADO ESQUERDO: TIMELINE DE HORÁRIOS */}
        <div className="dashboard-card" style={{ padding: '20px' }}>
          <div style={{ marginBottom: '20px', borderBottom: '1px solid var(--neutral-200)', paddingBottom: '10px' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--neutral-900)' }}>{dataSelecionada}</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {mentoriasAgendadas.map((item) => (
              <div key={item.id} style={{ 
                display: 'flex', 
                gap: '15px', 
                padding: '12px', 
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--neutral-50)',
                borderLeft: `4px solid ${item.status === 'Confirmado' ? 'var(--primary-600)' : 'var(--warning-500)'}`
              }}>
                <div style={{ fontWeight: '700', color: 'var(--primary-600)', minWidth: '50px' }}>
                  {item.hora}
                </div>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--neutral-900)' }}>{item.mentorado}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--neutral-500)' }}>{item.projeto}</div>
                </div>
              </div>
            ))}
          </div>
          
          <button className="btn-logout" style={{ marginTop: '20px', width: '100%', borderColor: 'var(--primary-600)', color: 'var(--primary-600)' }}>
            + Adicionar Horário
          </button>
        </div>

        {/* LADO DIREITO: CALENDÁRIO VISUAL */}
        <div className="dashboard-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Fevereiro 2026</h3>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="icon-btn" style={{ border: '1px solid var(--neutral-200)' }}>&lt;</button>
              <button className="icon-btn" style={{ border: '1px solid var(--neutral-200)' }}>&gt;</button>
            </div>
          </div>

          {/* DIAS DA SEMANA */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(7, 1fr)', 
            textAlign: 'center', 
            fontWeight: '600', 
            fontSize: '0.8rem', 
            color: 'var(--neutral-400)',
            marginBottom: '10px'
          }}>
            <div>DOM</div><div>SEG</div><div>TER</div><div>QUA</div><div>QUI</div><div>SEX</div><div>SÁB</div>
          </div>

          {/* GRADE DE DIAS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '5px' }}>
            {/* Espaços vazios para o início do mês se necessário */}
            {[...Array(31)].map((_, i) => {
              const dia = i + 1;
              const isToday = dia === 11;
              const hasMeeting = [11, 15, 20].includes(dia);

              return (
                <div 
                  key={i} 
                  style={{ 
                    height: '80px', 
                    border: '1px solid var(--neutral-100)', 
                    borderRadius: '8px',
                    padding: '5px',
                    backgroundColor: isToday ? 'var(--primary-50)' : 'white',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                >
                  <span style={{ 
                    fontSize: '0.85rem', 
                    fontWeight: isToday ? '700' : '400',
                    color: isToday ? 'var(--primary-600)' : 'var(--neutral-700)'
                  }}>{dia}</span>
                  
                  {hasMeeting && (
                    <div style={{ 
                      marginTop: '5px', 
                      backgroundColor: 'var(--primary-600)', 
                      height: '4px', 
                      borderRadius: '2px' 
                    }}></div>
                  )}
                  {hasMeeting && (
                    <div style={{ fontSize: '0.65rem', color: 'var(--primary-700)', marginTop: '2px' }}>
                      {dia === 11 ? '4 sessões' : '1 sessão'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
function Mensagens() {
  return (
    <div
      className="responsive-split-layout"
      style={{
        display: 'grid',
        gridTemplateColumns: '320px 1fr',
        gap: '20px',
        height: 'calc(100vh - 200px)', // Ajuste para caber sob a top-bar
        minHeight: '550px'
      }}
    >
      {/* LISTA DE CONVERSAS / PROPOSTAS */}
      <div
        className="dashboard-card"
        style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}
      >
        <div style={{ padding: '20px', borderBottom: '1px solid var(--neutral-200)' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--neutral-900)' }}>Solicitações</h3>
          <p style={{ margin: '5px 0 0 0', fontSize: '0.8rem', color: 'var(--neutral-500)' }}>
            2 propostas aguardando retorno
          </p>
        </div>

        <div style={{ overflowY: 'auto', flex: 1 }}>
          {/* ITEM ATIVO */}
          <div
            style={{
              padding: '15px',
              borderBottom: '1px solid var(--neutral-100)',
              cursor: 'pointer',
              background: 'var(--primary-50)',
              borderLeft: '4px solid var(--primary-600)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <strong style={{ fontSize: '0.9rem', color: 'var(--neutral-900)' }}>SolarPay Angola</strong>
              <span style={{ fontSize: '0.7rem', color: 'var(--neutral-400)' }}>10:30</span>
            </div>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--neutral-600)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
               Olá, Mentor! Enviamos nosso pitch deck atualizado...
            </p>
            <span className="badge badge-warning" style={{ fontSize: '0.6rem', marginTop: '8px' }}>Pendente</span>
          </div>

          {/* ITEM INATIVO */}
          <div
            style={{ padding: '15px', borderBottom: '1px solid var(--neutral-100)', cursor: 'pointer' }}
            onMouseOver={(e) => e.currentTarget.style.background = 'var(--neutral-50)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <strong style={{ fontSize: '0.9rem', color: 'var(--neutral-900)' }}>AgroFácil</strong>
              <span style={{ fontSize: '0.7rem', color: 'var(--neutral-400)' }}>Ontem</span>
            </div>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--neutral-600)' }}>Solicitação de Mentoria...</p>
            <span className="badge badge-success" style={{ fontSize: '0.6rem', marginTop: '8px' }}>Em conversa</span>
          </div>
        </div>
      </div>

      {/* ÁREA DO CHAT */}
      <div
        className="dashboard-card"
        style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}
      >
        {/* HEADER DO CHAT */}
        <div
          style={{
            padding: '15px 20px',
            borderBottom: '1px solid var(--neutral-200)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'var(--neutral-white)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: 40, height: 40, background: 'var(--primary-600)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--on-primary)', fontWeight: 'bold' }}>
              S
            </div>
            <div>
              <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--neutral-900)' }}>SolarPay Angola</h4>
              <span style={{ fontSize: '0.75rem', color: 'var(--success-500)', fontWeight: '600' }}>Score IA: 92/100</span>
            </div>
          </div>
        </div>

        {/* CORPO DAS MENSAGENS */}
        <div
          style={{
            flex: 1,
            padding: '20px',
            background: 'var(--neutral-50)',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px'
          }}
        >
          {/* MENSAGEM RECEBIDA */}
          <div style={{ alignSelf: 'flex-start', background: 'var(--dm-surface)', padding: '12px', borderRadius: '12px', borderBottomLeftRadius: '2px', maxWidth: '70%', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', border: '1px solid var(--neutral-200)' }}>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--neutral-800)' }}>
              Olá, Mentor! Enviamos nosso pitch deck atualizado. Estamos buscando expansão em Benguela.
            </p>
            <span style={{ fontSize: '0.7rem', color: 'var(--neutral-400)', marginTop: '5px', display: 'block' }}>10:30 AM</span>
          </div>

          {/* MENSAGEM ENVIADA */}
          <div style={{ alignSelf: 'flex-end', background: 'var(--primary-600)', color: 'var(--on-primary)', padding: '12px', borderRadius: '12px', borderBottomRightRadius: '2px', maxWidth: '70%' }}>
            <p style={{ margin: 0, fontSize: '0.9rem' }}>
              Obrigada pelo envio! Analisando o Score IA de vocês, parece promissor. Podemos agendar uma call?
            </p>
            <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)', marginTop: '5px', display: 'block' }}>10:45 AM</span>
          </div>
        </div>

        {/* INPUT DE MENSAGEM */}
        <div style={{ padding: '15px', borderTop: '1px solid var(--neutral-200)', background: 'var(--neutral-white)', display: 'flex', gap: '10px' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Escreva sua mensagem..."
            style={{ flex: 1, paddingLeft: '15px' }}
          />
          <button className="btn btn-primary" style={{ padding: '0 20px' }}>Enviar</button>
        </div>
      </div>
    </div>
  );
}

function SubmeterIdeia() {
  const ctx = useContext(AppContext);
  const initialDados = {
    nome: "", descricao: "", setor: "",
    cidade: "", localizacao: "",
    regiao: "",
    lat: "",
    lng: "",
    capital: "",
    problema: "", diferencial: "", publico: "",
    arquivos: null,
  };
  const [etapa, setEtapa] = useState(1);
  const [analisando, setAnalisando] = useState(false);
  const [resultadoIA, setResultadoIA] = useState(null);
  const [mensagemFluxo, setMensagemFluxo] = useState("");
  const [ultimaIdeiaId, setUltimaIdeiaId] = useState(null);
  const [publicandoMarketplace, setPublicandoMarketplace] = useState(false);
  const [questionarioSessionId, setQuestionarioSessionId] = useState(null);
  const [questionarioPerguntas, setQuestionarioPerguntas] = useState([]);
  const [questionarioRespostas, setQuestionarioRespostas] = useState({});
  const [gerandoQuestionario, setGerandoQuestionario] = useState(false);

  const [dados, setDados] = useState(initialDados);

  const proximaEtapa = () => setEtapa(etapa + 1);
  const etapaAnterior = () => setEtapa(etapa - 1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDados({ ...dados, [name]: value });
  };

  const mapQuery = `${dados.localizacao || ''} ${dados.cidade || ''} ${dados.regiao || ''}`.trim() || "Luanda Angola";
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`;

  const usarMinhaLocalizacao = () => {
    if (!navigator.geolocation) {
      ctx?.setModal?.({ open: true, message: "Geolocalização não suportada neste navegador." });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = Number(position.coords.latitude).toFixed(6);
        const lng = Number(position.coords.longitude).toFixed(6);
        setDados((prev) => ({
          ...prev,
          lat,
          lng,
          localizacao: `${lat}, ${lng}`,
        }));
      },
      () => {
        ctx?.setModal?.({ open: true, message: "Não foi possível obter sua localização atual." });
      }
    );
  };

  const salvarRascunhoLocal = () => {
    const drafts = parseJsonSafe(localStorage.getItem("angostart_ideas_local"), []);
    drafts.unshift({
      ...dados,
      id: Date.now(),
      savedAt: new Date().toISOString(),
      status: "draft",
    });
    localStorage.setItem("angostart_ideas_local", JSON.stringify(drafts));
  };

  const isPlanFeatureBlocked = (error) =>
    String(error?.message || "").toLowerCase().includes("não inclui este recurso");

  const reiniciarSubmissao = () => {
    setDados(initialDados);
    setResultadoIA(null);
    setMensagemFluxo("");
    setUltimaIdeiaId(null);
    setQuestionarioSessionId(null);
    setQuestionarioPerguntas([]);
    setQuestionarioRespostas({});
    setEtapa(1);
  };

  const gerarPlanoNegocioPdf = () => {
    if (!resultadoIA) return;
    const doc = new jsPDF();
    let y = 20;
    const lineHeight = 8;

    const writeSection = (title, content) => {
      doc.setFont("helvetica", "bold");
      doc.text(title, 14, y);
      y += 7;
      doc.setFont("helvetica", "normal");
      const lines = Array.isArray(content)
        ? content.map((item) => `- ${item}`).join("\n")
        : String(content || "");
      const wrapped = doc.splitTextToSize(lines || "-", 182);
      doc.text(wrapped, 14, y);
      y += wrapped.length * lineHeight + 4;
      if (y > 265) {
        doc.addPage();
        y = 20;
      }
    };

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Plano de Negocio - AngoStart IA", 14, y);
    y += 10;
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`Projeto: ${dados.nome || "-"}`, 14, y);
    y += 6;
    doc.text(`Setor: ${dados.setor || "-"}`, 14, y);
    y += 6;
    doc.text(`Localizacao: ${dados.cidade || "-"} / ${dados.regiao || "-"}`, 14, y);
    y += 10;

    writeSection("Score Geral", `${resultadoIA.score}/100`);
    writeSection("Pontos Fortes", resultadoIA.pontosFortes);
    writeSection("Riscos Identificados", resultadoIA.riscosIdentificados);
    writeSection("Analise Financeira", resultadoIA.analiseFinanceira);
    writeSection("Projecao Financeira", resultadoIA.projecaoFinanceira);
    writeSection("Acoes Recomendadas", resultadoIA.acoesRecomendadas);
    writeSection("Proximo Passo Recomendado", resultadoIA.proximoPassoRecomendado);

    const nomeArquivo = `plano-negocio-${(dados.nome || "angostart").replace(/\s+/g, "-").toLowerCase()}.pdf`;
    doc.save(nomeArquivo);
  };

  const publicarNoMarketplace = async () => {
    if (!ultimaIdeiaId) {
      ctx?.setModal?.({ open: true, message: "Nenhuma ideia disponível para publicar." });
      return;
    }
    setPublicandoMarketplace(true);
    try {
      await updateIdeaStatus(ultimaIdeiaId, "active");
      ctx?.setModal?.({ open: true, message: "Ideia publicada no marketplace com sucesso." });
    } catch (err) {
      ctx?.setModal?.({ open: true, message: err.message || "Falha ao publicar no marketplace." });
    } finally {
      setPublicandoMarketplace(false);
    }
  };

  const enviarParaAnalise = async () => {
    if (!dados.nome || !dados.descricao || !dados.setor || !dados.cidade || !dados.regiao) {
      ctx?.setModal?.({ open: true, message: "Preencha os campos obrigatórios das fases anteriores antes de submeter." });
      return;
    }

    const lat = Number(dados.lat || 0);
    const lng = Number(dados.lng || 0);
    const payload = {
      title: dados.nome,
      description: dados.descricao,
      sector: dados.setor || "Geral",
      city: dados.cidade,
      address: dados.localizacao,
      region: dados.regiao,
      latitude: lat,
      longitude: lng,
      initialCapital: Number(dados.capital || 0),
      problem: dados.problema,
      differentialText: dados.diferencial,
      targetAudience: dados.publico,
      status: "submitted",
    };

    setAnalisando(true);
    try {
      const createdIdea = await createIdea(payload);
      setUltimaIdeiaId(Number(createdIdea?.id) || null);
      let activeSessionId = questionarioSessionId;
      let questionarioIndisponivel = false;
      let analiseIndisponivel = false;

      if (!activeSessionId) {
        try {
          const generatedSession = await generateQuestionnaire({
            ideaId: Number(createdIdea?.id) || undefined,
            context: {
              sector: dados.setor,
              city: dados.cidade,
              region: dados.regiao,
              initialCapital: Number(dados.capital || 0),
              problem: dados.problema,
              differentialText: dados.diferencial,
              targetAudience: dados.publico,
            },
          });
          activeSessionId = generatedSession?.id || null;
          setQuestionarioSessionId(activeSessionId);
          setQuestionarioPerguntas(generatedSession?.questions || []);
        } catch (err) {
          if (isPlanFeatureBlocked(err)) {
            questionarioIndisponivel = true;
          } else {
            throw err;
          }
        }
      }

      if (activeSessionId && Object.keys(questionarioRespostas).length > 0) {
        await saveQuestionnaireAnswers(activeSessionId, questionarioRespostas);
      }

      try {
        await executarAnaliseViabilidade(Number(createdIdea?.id) || undefined, activeSessionId || undefined);
      } catch (err) {
        if (isPlanFeatureBlocked(err)) {
          analiseIndisponivel = true;
          setEtapa(1);
        } else {
          throw err;
        }
      }

      if (!analiseIndisponivel) {
        setEtapa(7);
      }
      if (analiseIndisponivel) {
        ctx?.setModal?.({
          open: true,
          message:
            "Ideia submetida com sucesso. A análise de viabilidade por IA não está disponível no seu plano atual.",
        });
      } else if (questionarioIndisponivel) {
        setMensagemFluxo("Ideia enviada e analisada com sucesso. O questionário dinâmico não está disponível no seu plano atual.");
      } else {
        setMensagemFluxo("Ideia enviada e analisada com sucesso.");
      }
    } catch (err) {
      salvarRascunhoLocal();
      ctx?.setModal?.({
        open: true,
        message: `Não foi possível completar o fluxo na API (${err.message}). O rascunho foi salvo localmente.`,
      });
    } finally {
      setAnalisando(false);
    }
  };

  const gerarQuestionarioIA = async () => {
    setGerandoQuestionario(true);
    try {
      const session = await generateQuestionnaire({
        context: {
          sector: dados.setor,
          city: dados.cidade,
          region: dados.regiao,
          initialCapital: Number(dados.capital || 0),
          problem: dados.problema,
          differentialText: dados.diferencial,
          targetAudience: dados.publico,
        },
      });
      setQuestionarioSessionId(session.id);
      setQuestionarioPerguntas(session.questions || []);
      const baseAnswers = {};
      (session.questions || []).forEach((q) => {
        baseAnswers[q.key] = questionarioRespostas[q.key] || "";
      });
      setQuestionarioRespostas(baseAnswers);
      ctx?.setModal?.({ open: true, message: "Questionário dinâmico gerado com sucesso." });
    } catch (err) {
      ctx?.setModal?.({ open: true, message: `Falha ao gerar questionário: ${err.message}` });
    } finally {
      setGerandoQuestionario(false);
    }
  };

  const salvarQuestionarioIA = async () => {
    if (!questionarioSessionId) return;
    try {
      await saveQuestionnaireAnswers(questionarioSessionId, questionarioRespostas);
      ctx?.setModal?.({ open: true, message: "Respostas do questionário guardadas." });
    } catch (err) {
      ctx?.setModal?.({ open: true, message: `Falha ao guardar respostas: ${err.message}` });
    }
  };

  const executarAnaliseViabilidade = async (ideaId, sessionId) => {
    const report = await analyzeViability({
      ideaId: ideaId || undefined,
      questionnaireSessionId: sessionId || questionarioSessionId || undefined,
      idea: {
        title: dados.nome,
        description: dados.descricao,
        sector: dados.setor || "Geral",
        city: dados.cidade,
        region: dados.regiao,
        initialCapital: Number(dados.capital || 0),
        problem: dados.problema,
        differentialText: dados.diferencial,
        targetAudience: dados.publico,
      },
      questionnaireAnswers: questionarioRespostas,
    });

    setResultadoIA({
      viabilidade: report.viabilityStatus === "viavel" ? "Viável" : "Inviável",
      origemAnalise:
        report.analysisSource === "google_ai_studio"
          ? "Google AI Studio (Gemini)"
          : "Análise Local (Fallback)",
      notaAnalise: report.analysisNote || "",
      pontosFortes: report.strengths?.length ? report.strengths : ["Estrutura inicial adequada."],
      riscosIdentificados: report.identifiedRisks?.length
        ? report.identifiedRisks
        : (report.weaknesses?.length ? report.weaknesses : ["Sem riscos críticos identificados."]),
      analiseFinanceira: report.financialAnalysis || "Dados insuficientes para análise financeira detalhada.",
      projecaoFinanceira: report.financialProjection || "Preencher ticket médio e custos para projeção mais precisa.",
      acoesRecomendadas: report.recommendedActions?.length
        ? report.recommendedActions
        : (report.adjustments?.length ? report.adjustments : ["Executar validação com 10 clientes reais."]),
      proximoPassoRecomendado:
        report.nextRecommendedStep ||
        report.summary ||
        "Definir plano de validação com metas semanais.",
      pontuacaoFatores: report.factorScores || {},
      score: Number(report.score || 0),
    });
  };

  // --- RENDERS DAS FASES ---

  const renderFase1 = () => (
    <div className="auth-form">
      <h3 className="dashboard-card-title">Fase 1: Identificação</h3>
      <div className="form-group">
        <label className="form-label">Nome do Projecto</label>
        <input className="form-input" name="nome" value={dados.nome} onChange={handleChange} placeholder="Ex: SolarPay" />
      </div>
      <div className="form-group">
        <label className="form-label">Setor de Atuação</label>
        <select className="form-input" name="setor" value={dados.setor} onChange={handleChange}>
          <option value="">Selecione...</option>
          <option value="Fintech">Fintech</option>
          <option value="Agrotech">Agrotech</option>
          <option value="Educação">Educação</option>
          <option value="Saúde">Saúde</option>
          <option value="Comércio e Retalho">Comércio e Retalho</option>
          <option value="Logística e Transportes">Logística e Transportes</option>
          <option value="Energia e Águas">Energia e Águas</option>
          <option value="Construção e Imobiliário">Construção e Imobiliário</option>
          <option value="Pescas e Aquicultura">Pescas e Aquicultura</option>
          <option value="Indústria e Transformação">Indústria e Transformação</option>
          <option value="Petróleo e Gás">Petróleo e Gás</option>
          <option value="Mineração">Mineração</option>
          <option value="Turismo e Hotelaria">Turismo e Hotelaria</option>
          <option value="Tecnologia e Software">Tecnologia e Software</option>
          <option value="Telecomunicações">Telecomunicações</option>
          <option value="Serviços Profissionais">Serviços Profissionais</option>
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">Descrição Curta</label>
        <textarea className="form-input" name="descricao" value={dados.descricao} onChange={handleChange} style={{height: '100px'}} />
      </div>
    </div>
  );

  const renderFase2 = () => (
    <div className="auth-form">
      <h3 className="dashboard-card-title">Fase 2: Localização</h3>
      <div className="form-group">
        <label className="form-label">Cidade</label>
        <input className="form-input" name="cidade" value={dados.cidade} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label className="form-label">Região/Província</label>
        <input className="form-input" name="regiao" value={dados.regiao} onChange={handleChange} placeholder="Ex: Luanda" />
      </div>
      <div className="form-group">
        <label className="form-label">Endereço / Referência</label>
        <input className="form-input" name="localizacao" value={dados.localizacao} onChange={handleChange} placeholder="Rua, bairro ou coordenadas" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <div className="form-group">
          <label className="form-label">Latitude</label>
          <input className="form-input" name="lat" value={dados.lat} onChange={handleChange} placeholder="-8.8383" />
        </div>
        <div className="form-group">
          <label className="form-label">Longitude</label>
          <input className="form-input" name="lng" value={dados.lng} onChange={handleChange} placeholder="13.2344" />
        </div>
      </div>
      <button className="btn btn-outline" type="button" onClick={usarMinhaLocalizacao} style={{ width: 'fit-content' }}>
        Usar minha localização atual
      </button>
      <div className="form-group">
        <label className="form-label">Pré-visualização no mapa (Google Maps)</label>
        <div style={{ height: '240px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--dm-border)' }}>
          <iframe
            title="Mapa da localizacao da ideia"
            src={mapSrc}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );

  const renderFase3 = () => (
    <div className="auth-form">
      <h3 className="dashboard-card-title">Fase 3: Finanças</h3>
      <div className="form-group">
        <label className="form-label">Quanto você tem para investir inicialmente? (Kz)</label>
        <input className="form-input" type="number" name="capital" value={dados.capital} onChange={handleChange} placeholder="Ex: 5000" />
      </div>
    </div>
  );

  const renderFase4 = () => (
    <div className="auth-form">
      <h3 className="dashboard-card-title">Fase 4: Questionário Dinâmico (IA)</h3>
      <div className="form-group">
        <label className="form-label">Qual problema específico o seu produto resolve?</label>
        <textarea className="form-input" name="problema" value={dados.problema} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label className="form-label">Como sua solução é diferente das existentes?</label>
        <textarea className="form-input" name="diferencial" value={dados.diferencial} onChange={handleChange} />
      </div>
      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        <button type="button" className="btn btn-primary" onClick={gerarQuestionarioIA} disabled={gerandoQuestionario}>
          {gerandoQuestionario ? "Gerando..." : "Gerar Questionário IA"}
        </button>
        <button type="button" className="btn btn-outline" onClick={salvarQuestionarioIA} disabled={!questionarioSessionId}>
          Guardar Respostas
        </button>
      </div>

      {questionarioPerguntas.length > 0 && (
        <div className="dashboard-card" style={{ marginTop: "16px", background: "var(--neutral-50)" }}>
          <h4 style={{ marginBottom: "12px" }}>Perguntas Dinâmicas</h4>
          {questionarioPerguntas.map((q) => (
            <div key={q.key} className="form-group" style={{ marginBottom: "10px" }}>
              <label className="form-label">{q.label}</label>
              {q.type === "select" ? (
                <select
                  className="form-input"
                  value={questionarioRespostas[q.key] || ""}
                  onChange={(e) =>
                    setQuestionarioRespostas((prev) => ({ ...prev, [q.key]: e.target.value }))
                  }
                >
                  <option value="">Selecione...</option>
                  {(q.options || []).map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : q.type === "number" ? (
                <input
                  type="number"
                  className="form-input"
                  value={questionarioRespostas[q.key] || ""}
                  onChange={(e) =>
                    setQuestionarioRespostas((prev) => ({ ...prev, [q.key]: e.target.value }))
                  }
                />
              ) : (
                <textarea
                  className="form-input"
                  style={{ minHeight: "80px" }}
                  value={questionarioRespostas[q.key] || ""}
                  onChange={(e) =>
                    setQuestionarioRespostas((prev) => ({ ...prev, [q.key]: e.target.value }))
                  }
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderFase5 = () => (
    <div className="auth-form">
      <h3 className="dashboard-card-title">Fase 5: Uploads</h3>
      <div style={{ border: '2px dashed var(--neutral-300)', padding: '40px', textAlign: 'center', borderRadius: '12px' }}>
        <p>Arraste imagens ou vídeos do produto/protótipo</p>
        <button className="btn-logout" style={{marginTop: '10px', width: 'auto', display: 'inline-block'}}>Selecionar Arquivos</button>
      </div>
    </div>
  );

  const renderFase6 = () => (
    <div className="auth-form">
      <h3 className="dashboard-card-title">Fase 6: Revisão</h3>
      <div className="dashboard-card" style={{ background: 'var(--neutral-50)', fontSize: '0.9rem' }}>
        <p><strong>Projeto:</strong> {dados.nome}</p>
        <p><strong>Setor:</strong> {dados.setor}</p>
        <p><strong>Localização:</strong> {dados.cidade} - {dados.regiao} ({dados.localizacao || "Sem referência"})</p>
        <p><strong>Investimento:</strong> Kz{dados.capital}</p>
        <p><strong>Problema:</strong> {(dados.problema || "").substring(0, 50)}...</p>
      </div>
      <p style={{fontSize: '0.8rem', color: 'var(--neutral-500)'}}>Ao clicar em submeter, nossa IA analisará a viabilidade do seu negócio.</p>
    </div>
  );

  const renderResultado = () => (
    <div className="dashboard-card" style={{ textAlign: 'center', animation: 'fadeIn 0.5s' }}>
      {mensagemFluxo && (
        <p style={{ marginBottom: '12px', color: 'var(--success-500)', fontWeight: 600 }}>{mensagemFluxo}</p>
      )}
      <div style={{ fontSize: '3rem' }}>{resultadoIA.score >= 70 ? '🚀' : '💡'}</div>
      <h2 className="dashboard-card-title">Análise de Viabilidade: {resultadoIA.viabilidade}</h2>
      <div style={{ margin: '20px 0', padding: '15px', background: 'var(--primary-50)', borderRadius: '12px' }}>
        <p><strong>Score Geral: {resultadoIA.score}/100</strong></p>
        <p style={{ marginTop: '8px' }}><strong>Fonte:</strong> {resultadoIA.origemAnalise}</p>
        {resultadoIA.notaAnalise ? (
          <p style={{ marginTop: '6px', fontSize: '0.85rem', color: 'var(--neutral-600)' }}>{resultadoIA.notaAnalise}</p>
        ) : null}
      </div>

      <div style={{ textAlign: 'left', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div className="badge-success" style={{ padding: '15px', borderRadius: '8px' }}>
          <strong>Pontos Fortes:</strong>
          <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
            {resultadoIA.pontosFortes.map(p => <li key={p}>{p}</li>)}
          </ul>
        </div>
        <div className="badge-warning" style={{ padding: '15px', borderRadius: '8px', color: 'var(--warning-500)' }}>
          <strong>Riscos Identificados:</strong>
          <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
            {resultadoIA.riscosIdentificados.map(p => <li key={p}>{p}</li>)}
          </ul>
        </div>
      </div>

      <div className="dashboard-card" style={{ marginTop: '20px', border: '1px solid var(--primary-200)', textAlign: 'left' }}>
        <h4 style={{ color: 'var(--primary-600)' }}>Análise Financeira</h4>
        <p>{resultadoIA.analiseFinanceira}</p>
        <h4 style={{ color: 'var(--primary-600)', marginTop: '16px' }}>Projeção Financeira</h4>
        <p>{resultadoIA.projecaoFinanceira}</p>
      </div>

      <div className="dashboard-card" style={{ marginTop: '20px', border: '1px solid var(--primary-200)', textAlign: 'left' }}>
        <h4 style={{ color: 'var(--primary-600)' }}>Ações Recomendadas</h4>
        <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
          {resultadoIA.acoesRecomendadas.map((acao) => <li key={acao}>{acao}</li>)}
        </ul>
        <h4 style={{ color: 'var(--primary-600)', marginTop: '16px' }}>Próximo Passo Recomendado</h4>
        <p>{resultadoIA.proximoPassoRecomendado}</p>
      </div>

      <div className="dashboard-card" style={{ marginTop: '20px', border: '1px solid var(--primary-200)', textAlign: 'left' }}>
        <h4 style={{ color: 'var(--primary-600)' }}>Score por Fator</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(180px, 1fr))', gap: '10px' }}>
          <div><strong>Problema/Mercado:</strong> {Number(resultadoIA.pontuacaoFatores?.problemaMercado || 0)}/100</div>
          <div><strong>Diferencial:</strong> {Number(resultadoIA.pontuacaoFatores?.diferencial || 0)}/100</div>
          <div><strong>Público-Alvo:</strong> {Number(resultadoIA.pontuacaoFatores?.publicoAlvo || 0)}/100</div>
          <div><strong>Execução:</strong> {Number(resultadoIA.pontuacaoFatores?.execucao || 0)}/100</div>
          <div><strong>Financeiro:</strong> {Number(resultadoIA.pontuacaoFatores?.financeiro || 0)}/100</div>
        </div>
      </div>

      <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button className="btn btn-primary" onClick={reiniciarSubmissao} style={{ width: 'auto' }}>
          Nova Submissão
        </button>
        <button className="btn btn-outline" onClick={gerarPlanoNegocioPdf} style={{ width: 'auto' }}>
          Gerar Plano de Negócio (PDF)
        </button>
        <button
          className="btn btn-primary"
          onClick={publicarNoMarketplace}
          disabled={!ultimaIdeiaId || publicandoMarketplace}
          style={{ width: 'auto', opacity: !ultimaIdeiaId || publicandoMarketplace ? 0.6 : 1 }}
        >
          {publicandoMarketplace ? "A publicar..." : "Publicar no Marketplace"}
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      
      {/* INDICADOR DE ETAPAS */}
      {etapa < 7 && (
        <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} style={{ 
              flex: 1, height: '8px', borderRadius: '4px',
              background: i <= etapa ? 'var(--primary-600)' : 'var(--neutral-200)',
              transition: '0.3s'
            }} />
          ))}
        </div>
      )}

      {/* CONTEÚDO DINÂMICO */}
      <div className="dashboard-card" style={{ padding: '30px' }}>
        {analisando ? (
          <div className="loading">
            <div className="spinner"></div>
            <p style={{ marginTop: '20px' }}>A Inteligência Artificial está analisando seu projeto...</p>
          </div>
        ) : (
          <>
            {etapa === 1 && renderFase1()}
            {etapa === 2 && renderFase2()}
            {etapa === 3 && renderFase3()}
            {etapa === 4 && renderFase4()}
            {etapa === 5 && renderFase5()}
            {etapa === 6 && renderFase6()}
            {etapa === 7 && renderResultado()}

            {/* BOTÕES DE NAVEGAÇÃO */}
            {etapa < 7 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px', paddingTop: '20px', borderTop: '1px solid var(--neutral-100)' }}>
                <button 
                  className="btn-logout" 
                  onClick={etapaAnterior} 
                  disabled={etapa === 1}
                  style={{ width: 'auto', padding: '10px 30px', opacity: etapa === 1 ? 0.3 : 1 }}
                >
                  Voltar
                </button>
                
                {etapa < 6 ? (
                  <button className="btn btn-primary" onClick={proximaEtapa} style={{ width: 'auto', padding: '10px 40px' }}>
                    Próxima Fase
                  </button>
                ) : (
                  <button className="btn btn-primary" onClick={enviarParaAnalise} style={{ width: 'auto', padding: '10px 40px', background: 'var(--success-500)' }}>
                    Enviar para Análise IA
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
function MinhasIdeias() {
  const ctx = useContext(AppContext);
  const [abaAtiva, setAbaAtiva] = useState('todas');
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(0);
  const [ideias, setIdeias] = useState([]);

  const reloadIdeas = async () => {
    setLoading(true);
    try {
      const data = await getMyIdeas();
      setIdeias(data || []);
    } catch (err) {
      ctx?.setModal?.({ open: true, message: `Falha ao carregar suas ideias: ${err.message}` });
      setIdeias([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reloadIdeas();
  }, []);

  const handleToggleMarketplace = async (idea) => {
    const nextStatus = idea.status === "active" ? "archived" : "active";
    setSavingId(Number(idea.id));
    try {
      const updated = await updateIdeaStatus(idea.id, nextStatus);
      setIdeias((prev) => prev.map((i) => (Number(i.id) === Number(idea.id) ? { ...i, ...updated } : i)));
      await ctx?.refreshNavBadges?.();
      ctx?.setModal?.({
        open: true,
        message: nextStatus === "active"
          ? "Ideia publicada no marketplace com sucesso."
          : "Ideia removida do marketplace.",
      });
    } catch (err) {
      ctx?.setModal?.({ open: true, message: err.message || "Falha ao atualizar status da ideia." });
    } finally {
      setSavingId(0);
    }
  };

  const statusLabel = (status) => {
    if (status === "active") return "Publicado";
    if (status === "submitted") return "Submetido";
    if (status === "analyzing") return "Em análise";
    if (status === "archived") return "Arquivado";
    return status || "-";
  };

  const badgeClass = (status) => {
    if (status === "active") return "badge-success";
    if (status === "submitted" || status === "analyzing") return "badge-warning";
    return "badge-info";
  };

  const ideiasExecucao = ideias.filter((i) => i.status === 'active');
  const formatCapital = (v) => Number(v || 0).toLocaleString("pt-PT");

  return (
    <div style={{ padding: '10px' }}>
      {/* HEADER */}
      <div className="dashboard-card" style={{ marginBottom: '2rem' }}>
        <h2 className="dashboard-card-title">Minhas Ideias</h2>
        <p className="dashboard-card-description">Gerencie suas submissões e acompanhe o desenvolvimento dos projetos ativos.</p>
        
        {/* SWITCH DE ABAS INTERNAS */}
        <div style={{ display: 'flex', gap: '20px', marginTop: '20px', borderTop: '1px solid var(--neutral-100)', paddingTop: '20px' }}>
          <button 
            onClick={() => setAbaAtiva('todas')}
            style={{ 
              background: 'none', border: 'none', padding: '10px 0', cursor: 'pointer',
              color: abaAtiva === 'todas' ? 'var(--primary-600)' : 'var(--neutral-500)',
              fontWeight: '600', borderBottom: abaAtiva === 'todas' ? '2px solid var(--primary-600)' : 'none'
            }}
          >
            Todas Submissões
          </button>
          <button 
            onClick={() => setAbaAtiva('execucao')}
            style={{ 
              background: 'none', border: 'none', padding: '10px 0', cursor: 'pointer',
              color: abaAtiva === 'execucao' ? 'var(--primary-600)' : 'var(--neutral-500)',
              fontWeight: '600', borderBottom: abaAtiva === 'execucao' ? '2px solid var(--primary-600)' : 'none'
            }}
          >
            Em Execução ({ideiasExecucao.length})
          </button>
        </div>
      </div>

      {/* CONTEÚDO: TODAS AS SUBMISSÕES */}
      {abaAtiva === 'todas' && (
        <div className="dashboard-card" style={{ padding: 0, overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: "20px" }}><p>A carregar suas ideias...</p></div>
          ) : ideias.length === 0 ? (
            <div style={{ padding: "20px" }}><p>Você ainda não submeteu ideias na API.</p></div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Projeto</th>
                  <th>Setor</th>
                  <th>Capital inicial</th>
                  <th>Status</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {ideias.map((ideia) => (
                  <tr key={ideia.id}>
                    <td><strong>{ideia.title}</strong></td>
                    <td><span className="badge badge-info">{ideia.sector || "-"}</span></td>
                    <td>{formatCapital(ideia.initial_capital)} AOA</td>
                    <td>
                      <span className={`badge ${badgeClass(ideia.status)}`}>
                        {statusLabel(ideia.status)}
                      </span>
                    </td>
                    <td>
                      <button
                        className={ideia.status === "active" ? "btn-logout" : "btn btn-primary"}
                        style={{ padding: '5px 10px', fontSize: '0.75rem', width: 'auto', opacity: savingId === Number(ideia.id) ? 0.6 : 1 }}
                        onClick={() => handleToggleMarketplace(ideia)}
                        disabled={savingId === Number(ideia.id)}
                      >
                        {ideia.status === "active" ? "Remover do marketplace" : "Publicar no marketplace"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* CONTEÚDO: EM EXECUÇÃO (TRACKING DE DESENVOLVIMENTO) */}
      {abaAtiva === 'execucao' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
          {ideiasExecucao.map(ideia => (
            <div key={ideia.id} className="dashboard-card" style={{ borderLeft: '6px solid var(--success-500)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{ideia.title}</h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--neutral-500)' }}>{ideia.sector || "Geral"}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--neutral-500)' }}>Status</div>
                  <div style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--primary-600)' }}>{statusLabel(ideia.status)}</div>
                </div>
              </div>

              {/* BARRA DE PROGRESSO */}
              <div style={{ width: '100%', height: '10px', background: 'var(--neutral-100)', borderRadius: '5px', marginBottom: '25px', overflow: 'hidden' }}>
                <div style={{ width: `100%`, height: '100%', background: 'var(--success-500)', transition: 'width 1s ease-in-out' }}></div>
              </div>

              {/* DETALHES DO DESENVOLVIMENTO */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ padding: '15px', background: 'var(--neutral-50)', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--neutral-500)', marginBottom: '5px' }}>CIDADE</div>
                  <div style={{ fontWeight: '600', color: 'var(--neutral-900)' }}>{ideia.city || "-"}</div>
                </div>
                <div style={{ padding: '15px', background: 'var(--primary-50)', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--primary-600)', marginBottom: '5px' }}>CAPITAL INICIAL</div>
                  <div style={{ fontWeight: '600', color: 'var(--primary-600)' }}>{formatCapital(ideia.initial_capital)} AOA</div>
                </div>
              </div>

              <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  className="btn-logout"
                  style={{ width: 'auto', padding: '8px 20px', opacity: savingId === Number(ideia.id) ? 0.6 : 1 }}
                  onClick={() => handleToggleMarketplace(ideia)}
                  disabled={savingId === Number(ideia.id)}
                >
                  Remover do marketplace
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AssinaturaPlano() {
  const ctx = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [savingPlan, setSavingPlan] = useState("");
  const [current, setCurrent] = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [, currentSub] = await Promise.all([
          getSubscriptionPlans(),
          getCurrentSubscription(),
        ]);
        setCurrent(currentSub || null);
      } catch (err) {
        ctx?.setModal?.({ open: true, message: `Falha ao carregar assinatura: ${err.message}` });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleChangePlan = async (planCode) => {
    setSavingPlan(planCode);
    try {
      const updated = await changeSubscriptionPlan({ planCode, billingCycle: "monthly" });
      setCurrent(updated);
      ctx?.setModal?.({ open: true, message: `Plano atualizado para ${updated.plan?.name || planCode}.` });
    } catch (err) {
      ctx?.setModal?.({ open: true, message: err.message || "Falha ao atualizar plano." });
    } finally {
      setSavingPlan("");
    }
  };

  return (
    <div style={{ padding: "10px" }}>
      <div className="dashboard-card" style={{ marginBottom: "20px" }}>
        <h2 className="dashboard-card-title">Assinatura e Plano</h2>
        <p className="dashboard-card-description">
          Controle de acesso por plano para funcionalidades avançadas da plataforma.
        </p>
        {current && (
          <div style={{ marginTop: "10px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <span className="badge badge-primary">Plano atual: {(current.plan?.name || current.planCode || "Free").toUpperCase()}</span>
            <span className="badge badge-info">Ciclo: {(current.billingCycle || "monthly").toUpperCase()}</span>
            <span className="badge badge-success">Status: {(current.status || "active").toUpperCase()}</span>
          </div>
        )}
      </div>
      {loading ? (
        <div className="dashboard-card"><p>A carregar planos...</p></div>
      ) : (
        <Planos
          onSelectPlan={handleChangePlan}
          currentPlanCode={current?.planCode || ""}
          loadingPlanCode={savingPlan}
        />
      )}
    </div>
  );
}

function ChecklistEstrategico() {
  const ctx = useContext(AppContext);
  const [track, setTrack] = useState("validacao");
  const [steps, setSteps] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState("");
  const [loadError, setLoadError] = useState("");

  const loadStrategicData = async (selectedTrack = track) => {
    setLoading(true);
    setLoadError("");
    try {
      const localIdeas = parseJsonSafe(localStorage.getItem("angostart_ideas_local"), []);
      const latestIdea = Array.isArray(localIdeas) && localIdeas.length ? localIdeas[0] : {};
      const context = {
        sector: latestIdea?.setor || latestIdea?.sector || "",
        city: latestIdea?.cidade || latestIdea?.city || "",
        initialCapital: Number(latestIdea?.capitalInicial || latestIdea?.initialCapital || 0),
        viabilityScore: Number(latestIdea?.resultadoIA?.pontuacao || 0),
        hasMvp: Boolean((latestIdea?.diferencial || latestIdea?.differentialText || "").trim()),
      };

      const [flow, progress] = await Promise.all([
        getStrategicChecklist(selectedTrack, context),
        getStrategicProgress().catch(() => []),
      ]);

      setSteps(flow || []);
      const map = {};
      (progress || []).forEach((p) => {
        map[p.stepKey] = p;
      });
      setProgressMap(map);
    } catch (err) {
      setLoadError(err.message || "Falha ao carregar plano de ação.");
      setSteps([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStrategicData(track);
  }, [track]);

  const toggleStep = async (stepKey, currentCompleted) => {
    setSavingKey(stepKey);
    try {
      await updateStrategicProgress({
        stepKey,
        completed: !currentCompleted,
        notes: progressMap[stepKey]?.notes || "",
      });
      setProgressMap((prev) => ({
        ...prev,
        [stepKey]: {
          ...(prev[stepKey] || {}),
          stepKey,
          completed: !currentCompleted,
          notes: prev[stepKey]?.notes || "",
        },
      }));
    } catch (err) {
      ctx?.setModal?.({ open: true, message: err.message || "Falha ao atualizar plano de ação." });
    } finally {
      setSavingKey("");
    }
  };

  const progressCount = steps.filter((s) => progressMap[s.key]?.completed).length;
  const progressPct = steps.length ? Math.round((progressCount / steps.length) * 100) : 0;

  return (
    <div style={{ padding: "10px" }}>
      <div className="dashboard-card" style={{ marginBottom: "20px" }}>
        <h2 className="dashboard-card-title">Plano de Ação do Negócio</h2>
        <p className="dashboard-card-description">
          Siga estas tarefas por ordem para organizar, lançar e fazer crescer o seu negócio.
        </p>
        <div style={{ display: "flex", gap: "10px", marginTop: "16px", flexWrap: "wrap" }}>
          <button className={`btn ${track === "validacao" ? "btn-primary" : "btn-outline"}`} onClick={() => setTrack("validacao")} style={{ width: "auto" }}>
            Validação
          </button>
          <button className={`btn ${track === "operacao" ? "btn-primary" : "btn-outline"}`} onClick={() => setTrack("operacao")} style={{ width: "auto" }}>
            Operação
          </button>
          <button className={`btn ${track === "crescimento" ? "btn-primary" : "btn-outline"}`} onClick={() => setTrack("crescimento")} style={{ width: "auto" }}>
            Crescimento
          </button>
        </div>
      </div>

      {loadError && (
        <div className="dashboard-card" style={{ marginBottom: "20px", border: "1px solid #f59e0b", background: "#fffbeb" }}>
          <div style={{ color: "#92400e", fontWeight: 700, marginBottom: "6px" }}>
            Não foi possível carregar o plano de ação
          </div>
          <div style={{ color: "#78350f", fontSize: "0.9rem", marginBottom: "10px" }}>
            {loadError}
          </div>
          {String(loadError).toLowerCase().includes("plano atual não inclui este recurso") && (
            <button
              type="button"
              className="btn btn-primary"
              style={{ width: "auto" }}
              onClick={() => setCurrentPage("assinatura")}
            >
              Atualizar plano
            </button>
          )}
        </div>
      )}

      <div className="dashboard-card" style={{ marginBottom: "20px", opacity: loadError ? 0.65 : 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
          <strong>Progresso do plano</strong>
          <span style={{ color: "var(--primary-600)", fontWeight: 700 }}>{progressPct}%</span>
        </div>
        <div style={{ width: "100%", height: "10px", borderRadius: "6px", background: "var(--neutral-100)", overflow: "hidden" }}>
          <div style={{ width: `${progressPct}%`, height: "100%", background: "var(--success-500)" }} />
        </div>
        <p style={{ marginTop: "8px", fontSize: "0.85rem", color: "var(--neutral-500)" }}>
          {progressCount} de {steps.length} etapas concluídas.
        </p>
      </div>

      <div style={{ display: "grid", gap: "12px" }}>
        {loading ? (
          <div className="dashboard-card"><p>A carregar plano de ação...</p></div>
        ) : loadError ? (
          <div className="dashboard-card"><p>Plano de ação indisponível para o plano atual.</p></div>
        ) : (
          steps.map((step, idx) => {
            const completed = !!progressMap[step.key]?.completed;
            const priorityColor =
              step.priority === "alta" ? "var(--error-500)" : step.priority === "media" ? "var(--warning-500)" : "var(--info-500)";
            return (
              <div key={step.key} className="dashboard-card" style={{ borderLeft: `5px solid ${completed ? "var(--success-500)" : priorityColor}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontSize: "0.78rem", color: "var(--neutral-500)", marginBottom: "4px" }}>
                      PASSO {idx + 1} - Prioridade {String(step.priority || "media").toUpperCase()}
                    </div>
                    <h4 style={{ margin: "0 0 6px 0" }}>{step.title}</h4>
                    <p style={{ margin: "0 0 8px 0", color: "var(--neutral-600)" }}>{step.description}</p>
                    <p style={{ margin: 0, color: "var(--primary-600)", fontSize: "0.9rem" }}>
                      <strong>Por que fazer agora:</strong> {step.whyNow}
                    </p>
                  </div>
                  <button
                    className={completed ? "btn-logout" : "btn btn-primary"}
                    style={{ width: "auto", minWidth: "130px", opacity: savingKey === step.key ? 0.6 : 1 }}
                    onClick={() => toggleStep(step.key, completed)}
                    disabled={savingKey === step.key}
                  >
                    {completed ? "Concluída" : "Marcar feita"}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function LegalizacaoEmpresa() {
  const ctx = useContext(AppContext);
  const [track, setTrack] = useState("empresa_angola");
  const [steps, setSteps] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState("");
  const [generatingGuide, setGeneratingGuide] = useState(false);
  const [companyGuide, setCompanyGuide] = useState(null);
  const [guideForm, setGuideForm] = useState({
    businessSector: "",
    partnerCount: 1,
    estimatedMonthlyRevenue: 0,
    hasForeignPartner: false,
    notes: "",
  });

  const loadLegalData = async (selectedTrack = track) => {
    setLoading(true);
    try {
      const [flow, progress] = await Promise.all([
        getLegalFlow(selectedTrack),
        getLegalProgress().catch(() => []),
      ]);
      setSteps(flow || []);
      const map = {};
      (progress || []).forEach((p) => {
        map[p.stepKey] = p;
      });
      setProgressMap(map);
    } catch (err) {
      ctx?.setModal?.({ open: true, message: `Falha ao carregar módulo legal: ${err.message}` });
      setSteps([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLegalData(track);
  }, [track]);

  useEffect(() => {
    (async () => {
      try {
        const latest = await getLatestCompanyGuide();
        if (latest) setCompanyGuide(latest);
      } catch {
        // Sem bloqueio de UX para histórico.
      }
    })();
  }, []);

  const toggleStep = async (stepKey, currentCompleted) => {
    setSavingKey(stepKey);
    try {
      await updateLegalProgress({
        stepKey,
        completed: !currentCompleted,
        notes: progressMap[stepKey]?.notes || "",
      });
      setProgressMap((prev) => ({
        ...prev,
        [stepKey]: {
          ...(prev[stepKey] || {}),
          stepKey,
          completed: !currentCompleted,
          notes: prev[stepKey]?.notes || "",
        },
      }));
    } catch (err) {
      ctx?.setModal?.({ open: true, message: err.message || "Falha ao atualizar checklist legal." });
    } finally {
      setSavingKey("");
    }
  };

  const progressCount = steps.filter((s) => progressMap[s.key]?.completed).length;
  const progressPct = steps.length ? Math.round((progressCount / steps.length) * 100) : 0;

  const handleGenerateCompanyGuide = async () => {
    setGeneratingGuide(true);
    try {
      const guide = await generateCompanyGuide({
        businessSector: guideForm.businessSector,
        partnerCount: Number(guideForm.partnerCount || 1),
        estimatedMonthlyRevenue: Number(guideForm.estimatedMonthlyRevenue || 0),
        hasForeignPartner: !!guideForm.hasForeignPartner,
        notes: guideForm.notes,
      });
      setCompanyGuide(guide);
      ctx?.setModal?.({ open: true, message: "Orientação legal da abertura de empresa gerada com sucesso." });
    } catch (err) {
      ctx?.setModal?.({ open: true, message: err.message || "Falha ao gerar orientação legal." });
    } finally {
      setGeneratingGuide(false);
    }
  };

  return (
    <div style={{ padding: "10px" }}>
      <div className="dashboard-card" style={{ marginBottom: "20px" }}>
        <h2 className="dashboard-card-title">Orientação Legal em Angola</h2>
        <p className="dashboard-card-description">
          Checklist estratégico para constituição, regularização na AGT e proteção de propriedade intelectual.
        </p>
        <div style={{ display: "flex", gap: "10px", marginTop: "16px", flexWrap: "wrap" }}>
          <button className={`btn ${track === "empresa_angola" ? "btn-primary" : "btn-outline"}`} onClick={() => setTrack("empresa_angola")} style={{ width: "auto" }}>
            Constituição de Empresa
          </button>
          <button className={`btn ${track === "agt_regularizacao" ? "btn-primary" : "btn-outline"}`} onClick={() => setTrack("agt_regularizacao")} style={{ width: "auto" }}>
            Fluxo AGT
          </button>
          <button className={`btn ${track === "propriedade_intelectual" ? "btn-primary" : "btn-outline"}`} onClick={() => setTrack("propriedade_intelectual")} style={{ width: "auto" }}>
            Propriedade Intelectual
          </button>
        </div>
      </div>

      <div className="dashboard-card" style={{ marginBottom: "20px" }}>
        <h3 className="dashboard-card-title" style={{ fontSize: "1.1rem" }}>Módulo 8 - Abertura de Empresa (Angola)</h3>
        <p className="dashboard-card-description" style={{ marginBottom: "12px" }}>
          Informe dados do negócio para receber recomendação de tipo societário, documentação e próximos passos legais.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "10px" }}>
          <div>
            <label className="form-label" style={{ marginBottom: "4px" }}>Setor do negócio</label>
            <input
              className="form-input"
              style={{ paddingLeft: "8px" }}
              placeholder="Ex: Comércio, Tecnologia, Saúde, Educação"
              value={guideForm.businessSector}
              onChange={(e) => setGuideForm((prev) => ({ ...prev, businessSector: e.target.value }))}
            />
            <small style={{ color: "var(--neutral-500)" }}>Informe a atividade principal da empresa para recomendar melhor o enquadramento legal.</small>
          </div>
          <div>
            <label className="form-label" style={{ marginBottom: "4px" }}>Número total de sócios</label>
            <input
              className="form-input"
              style={{ paddingLeft: "8px" }}
              type="number"
              min="1"
              max="50"
              step="1"
              placeholder="Ex: 2"
              value={guideForm.partnerCount}
              onChange={(e) => setGuideForm((prev) => ({ ...prev, partnerCount: e.target.value }))}
            />
            <small style={{ color: "var(--neutral-500)" }}>Inclui você e todos os cofundadores/sócios.</small>
          </div>
          <div>
            <label className="form-label" style={{ marginBottom: "4px" }}>Receita mensal estimada (AOA/Kz)</label>
            <input
              className="form-input"
              style={{ paddingLeft: "8px" }}
              type="number"
              min="0"
              step="1000"
              placeholder="Ex: 500000"
              value={guideForm.estimatedMonthlyRevenue}
              onChange={(e) => setGuideForm((prev) => ({ ...prev, estimatedMonthlyRevenue: e.target.value }))}
            />
            <small style={{ color: "var(--neutral-500)" }}>Valor esperado de faturação por mês em kwanzas.</small>
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 2px" }}>
            <input
              type="checkbox"
              checked={guideForm.hasForeignPartner}
              onChange={(e) => setGuideForm((prev) => ({ ...prev, hasForeignPartner: e.target.checked }))}
            />
            Sócio estrangeiro
          </label>
        </div>

        <textarea
          className="form-input"
          style={{ marginTop: "10px", paddingLeft: "8px" }}
          rows={3}
          placeholder="Notas adicionais (opcional)"
          value={guideForm.notes}
          onChange={(e) => setGuideForm((prev) => ({ ...prev, notes: e.target.value }))}
        />

        <div style={{ marginTop: "12px", display: "flex", justifyContent: "flex-end" }}>
          <button
            className="btn btn-primary"
            style={{ width: "auto", opacity: generatingGuide ? 0.7 : 1 }}
            onClick={handleGenerateCompanyGuide}
            disabled={generatingGuide}
          >
            {generatingGuide ? "A gerar..." : "Gerar orientação de abertura"}
          </button>
        </div>

        {companyGuide && (
          <div style={{ marginTop: "16px", borderTop: "1px solid var(--neutral-200)", paddingTop: "14px" }}>
            <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", marginBottom: "10px" }}>
              <div className="badge badge-primary">Tipo recomendado: {companyGuide.recommendedType}</div>
              <div className="badge badge-info">Prazo estimado: {companyGuide.estimatedOpeningDays} dias</div>
              <div className="badge badge-warning">Custo estimado: {Number(companyGuide.estimatedCostAoa || 0).toLocaleString()} AOA</div>
            </div>
            <p style={{ margin: "0 0 8px 0", color: "var(--neutral-600)" }}>
              <strong>Justificativas:</strong> {(companyGuide.reasons || []).join(" ")}
            </p>
            <p style={{ margin: "0 0 6px 0", fontWeight: 600 }}>Documentos principais</p>
            <ul style={{ margin: "0 0 10px 18px", color: "var(--neutral-600)" }}>
              {(companyGuide.requiredDocuments || []).map((doc) => (
                <li key={doc}>{doc}</li>
              ))}
            </ul>
            <p style={{ margin: "0 0 6px 0", fontWeight: 600 }}>Próximos passos</p>
            <ul style={{ margin: "0 0 8px 18px", color: "var(--neutral-600)" }}>
              {(companyGuide.nextActions || []).map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
            <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--neutral-500)" }}>
              {companyGuide.disclaimer}
            </p>
          </div>
        )}
      </div>

      <div className="dashboard-card" style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
          <strong>Progresso do checklist</strong>
          <span style={{ color: "var(--primary-600)", fontWeight: 700 }}>{progressPct}%</span>
        </div>
        <div style={{ width: "100%", height: "10px", borderRadius: "6px", background: "var(--neutral-100)", overflow: "hidden" }}>
          <div style={{ width: `${progressPct}%`, height: "100%", background: "var(--success-500)" }} />
        </div>
        <p style={{ marginTop: "8px", fontSize: "0.85rem", color: "var(--neutral-500)" }}>
          {progressCount} de {steps.length} etapas concluídas.
        </p>
      </div>

      <div style={{ display: "grid", gap: "12px" }}>
        {loading ? (
          <div className="dashboard-card"><p>A carregar fluxo legal...</p></div>
        ) : (
          steps.map((step, idx) => {
            const completed = !!progressMap[step.key]?.completed;
            return (
              <div key={step.key} className="dashboard-card" style={{ borderLeft: `5px solid ${completed ? "var(--success-500)" : "var(--warning-500)"}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontSize: "0.78rem", color: "var(--neutral-500)", marginBottom: "4px" }}>ETAPA {idx + 1} - {step.agency}</div>
                    <h4 style={{ margin: "0 0 6px 0" }}>{step.title}</h4>
                    <p style={{ margin: 0, color: "var(--neutral-600)" }}>{step.description}</p>
                  </div>
                  <button
                    className={completed ? "btn-logout" : "btn btn-primary"}
                    style={{ width: "auto", minWidth: "130px", opacity: savingKey === step.key ? 0.6 : 1 }}
                    onClick={() => toggleStep(step.key, completed)}
                    disabled={savingKey === step.key}
                  >
                    {completed ? "Concluída" : "Marcar feita"}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function Investidores() {
  const ctx = useContext(AppContext);
  const t = ctx?.t ?? (k => k);
  const [busca, setBusca] = useState('');
  const [loading, setLoading] = useState(true);
  const [investidores, setInvestidores] = useState([]);
  const [loadingDetailsId, setLoadingDetailsId] = useState(0);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await getAvailableInvestors();
        setInvestidores(
          (data || []).map((inv) => ({
            id: Number(inv.id),
            nome: inv.name || "-",
            tipo: inv.profile?.investorType === "empresa" ? "Investidor Empresa" : "Investidor Individual",
            areas: inv.profile?.investmentExperienceArea
              ? [String(inv.profile.investmentExperienceArea)]
              : ["Sem área definida"],
            imagem: "",
            descricao: inv.profile?.profession
              ? `Profissão: ${inv.profile.profession}`
              : "Investidor cadastrado na plataforma.",
            verificationStatus: inv.verificationStatus || "pending",
          }))
        );
      } catch (err) {
        ctx?.setModal?.({ open: true, message: `Falha ao carregar investidores: ${err.message}` });
        setInvestidores([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtrados = investidores.filter((inv) =>
    String(inv.nome || "").toLowerCase().includes(busca.toLowerCase())
  );

  const getVerificationLabel = (status) => {
    if (status === "approved") return "Aprovado";
    if (status === "rejected") return "Rejeitado";
    return "Pendente";
  };

  const formatDate = (iso) => {
    if (!iso) return "-";
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? "-" : d.toLocaleDateString("pt-PT");
  };

  const handleOpenInvestorDetails = async (investorId) => {
    setLoadingDetailsId(Number(investorId));
    try {
      const inv = await getInvestorById(investorId);
      if (!inv) throw new Error("Investidor não encontrado.");
      const p = inv.profile || {};
      ctx?.setModal?.({
        open: true,
        title: `Perfil de ${inv.name || "investidor"}`,
        content: (
          <div style={{ display: "grid", gap: "10px" }}>
            <div style={{ display: "grid", gap: "8px", background: "var(--neutral-50)", border: "1px solid var(--neutral-200)", borderRadius: "10px", padding: "12px", boxShadow: "0 8px 18px rgba(15, 23, 42, 0.08)" }}>
              <div style={{ fontWeight: 700, color: "var(--primary-600)" }}>Dados principais</div>
              <div style={{ display: "grid", gap: "6px", color: "var(--neutral-700)", fontSize: "0.9rem" }}>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>{icons.user}<span><strong>Nome:</strong> {inv.name || "-"}</span></div>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>{icons.inbox}<span><strong>Email:</strong> {inv.email || "-"}</span></div>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>{icons["dollar-sign"]}<span><strong>Tipo:</strong> {p.investorType || "-"}</span></div>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>{icons.calendar}<span><strong>Cadastro:</strong> {formatDate(inv.createdAt)}</span></div>
              </div>
            </div>

            <div style={{ display: "grid", gap: "8px", background: "var(--neutral-50)", border: "1px solid var(--neutral-200)", borderRadius: "10px", padding: "12px", boxShadow: "0 8px 18px rgba(15, 23, 42, 0.08)" }}>
              <div style={{ fontWeight: 700, color: "var(--primary-600)" }}>Perfil profissional</div>
              <div style={{ display: "grid", gap: "6px", color: "var(--neutral-700)", fontSize: "0.9rem" }}>
                <div><strong>Telefone:</strong> {p.phone || "-"}</div>
                <div><strong>Província:</strong> {p.province || "-"}</div>
                <div><strong>Profissão:</strong> {p.profession || "-"}</div>
                <div><strong>Fonte de renda:</strong> {p.incomeSource || "-"}</div>
                <div><strong>Faixa de investimento:</strong> {p.investmentRange || "-"}</div>
                <div><strong>Área de experiência:</strong> {p.investmentExperienceArea || "-"}</div>
                <div><strong>LinkedIn/Site:</strong> {p.linkedinOrWebsite || "-"}</div>
              </div>
            </div>

            <div style={{ display: "grid", gap: "8px", background: "var(--neutral-50)", border: "1px solid var(--neutral-200)", borderRadius: "10px", padding: "12px", boxShadow: "0 8px 18px rgba(15, 23, 42, 0.08)" }}>
              <div style={{ fontWeight: 700, color: "var(--primary-600)" }}>Dados de empresa e validação</div>
              <div style={{ display: "grid", gap: "6px", color: "var(--neutral-700)", fontSize: "0.9rem" }}>
                <div><strong>Empresa:</strong> {p.companyName || "-"}</div>
                <div><strong>Cargo:</strong> {p.companyRole || "-"}</div>
                <div><strong>NIF:</strong> {p.companyNif || "-"}</div>
                <div><strong>Experiência com investimento:</strong> {p.hasInvestmentExperience || "-"}</div>
                <div><strong>Status de verificação:</strong> {getVerificationLabel(inv.verificationStatus)}</div>
              </div>
            </div>
          </div>
        ),
      });
    } catch (err) {
      ctx?.setModal?.({ open: true, message: `Falha ao carregar dados do investidor: ${err.message}` });
    } finally {
      setLoadingDetailsId(0);
    }
  };

  return (
    <div style={{ padding: '10px' }}>
      {/* HEADER E BUSCA */}
      <div className="dashboard-card investors-header" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 className="dashboard-card-title">Investidores Disponíveis</h2>
          <p className="dashboard-card-description">Conecte-se com parceiros que podem impulsionar sua ideia.</p>
        </div>
        <div className="investors-search">
          <input 
            type="text" 
            className="form-input" 
            placeholder="Buscar por nome..." 
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
      </div>

      {/* GRID DE INVESTIDORES */}
      {loading ? (
        <div className="dashboard-card">
          <p>A carregar investidores cadastrados...</p>
        </div>
      ) : (
      <div className="investors-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '25px'
      }}>
        {filtrados.map((inv) => (
          <div key={inv.id} className="dashboard-card" style={{ 
            textAlign: 'center', 
            padding: '30px 20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            transition: 'transform 0.3s ease',
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            {/* IMAGEM DO INVESTIDOR */}
            <div style={{ 
              width: '100px', 
              height: '100px', 
              borderRadius: '50%', 
              overflow: 'hidden',
              marginBottom: '15px',
              border: '4px solid var(--primary-50)'
            }}>
              {inv.imagem ? (
                <img src={inv.imagem} alt={inv.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--primary-600)', background: 'var(--primary-100)' }}>
                  {String(inv.nome || "I").charAt(0)}
                </div>
              )}
            </div>

            {/* NOME E TIPO */}
            <h3 style={{ margin: '0 0 5px 0', fontSize: '1.1rem', color: 'var(--neutral-900)' }}>{inv.nome}</h3>
            <span style={{ 
              fontSize: '0.8rem', 
              color: 'var(--primary-600)', 
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              display: 'block',
              marginBottom: '15px'
            }}>
              {inv.tipo}
            </span>

            {/* ÁREAS DE INTERESSE */}
            <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '20px' }}>
              {inv.areas.map(area => (
                <span key={area} className="badge badge-info" style={{ fontSize: '0.65rem' }}>{area}</span>
              ))}
            </div>

            {/* DESCRIÇÃO CURTA */}
            <p style={{ 
              fontSize: '0.85rem', 
              color: 'var(--neutral-500)', 
              lineHeight: '1.5',
              marginBottom: '25px',
              minHeight: '40px'
            }}>
              "{inv.descricao}"
            </p>

            {/* BOTÃO SABER MAIS */}
            <button 
              className="btn btn-primary" 
              style={{ width: '100%', marginTop: 'auto' }}
              onClick={() => handleOpenInvestorDetails(inv.id)}
              disabled={loadingDetailsId === Number(inv.id)}
            >
              {loadingDetailsId === Number(inv.id) ? "A carregar..." : "Saber Mais"}
            </button>
          </div>
        ))}
      </div>
      )}

      {/* CASO NÃO ENCONTRE NADA */}
      {!loading && filtrados.length === 0 && (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <p style={{ color: 'var(--neutral-500)' }}>Nenhum investidor encontrado com esse nome.</p>
        </div>
      )}
    </div>
  );
}
function Mentoria() {
  return (
    <div
      className="responsive-split-layout"
      style={{
        display: 'grid',
        gridTemplateColumns: '350px 1fr',
        gap: '20px',
        height: 'calc(100vh - 180px)',
        minHeight: '500px'
      }}
    >
      {/* LISTA DE PROPOSTAS */}
      <div
        className="dashboard-card"
        style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}
      >
        <div style={{ padding: '20px', borderBottom: '1px solid var(--dm-border)' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Solicitações Recebidas</h3>
          <p style={{ margin: '5px 0 0 0', fontSize: '0.8rem', color: 'var(--dm-text-muted)' }}>
            Você tem 2 mensagens pendentes
          </p>
        </div>

        <div style={{ overflowY: 'auto', flex: 1 }}>
          <div
            className="proposta-item active"
            style={{
              padding: '15px',
              borderBottom: '1px solid var(--dm-border)',
              cursor: 'pointer',
              background: 'var(--primary-100)',
              borderLeft: '4px solid var(--primary-600)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <strong style={{ fontSize: '0.9rem' }}>Teresa Ana </strong>
              <span style={{ fontSize: '0.7rem', color: 'var(--dm-text-muted)' }}>Hoje</span>
            </div>
            <p
              style={{
                margin: 0,
                fontSize: '0.85rem',
                color: 'var(--dm-text)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              Proposta de Equity: 5% por Kz 25.000...
            </p>
            <span className="badge badge-warning" style={{ fontSize: '0.65rem', marginTop: '5px' }}>
              Pendente
            </span>
          </div>

          <div
            className="proposta-item"
            style={{ padding: '15px', borderBottom: '1px solid var(--dm-border)', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <strong style={{ fontSize: '0.9rem' }}>João Paulo</strong>
              <span style={{ fontSize: '0.7rem', color: 'var(--dm-text-muted)' }}>Ontem</span>
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--dm-text)' }}>
              Precisas verificar a...
            </p>
            <span className="badge badge-success" style={{ fontSize: '0.65rem', marginTop: '5px' }}>
              Em conversa
            </span>
          </div>
        </div>
      </div>

      {/* CHAT / DETALHE */}
      <div
        className="dashboard-card"
        style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}
      >
        <div
          style={{
            padding: '15px 20px',
            borderBottom: '1px solid var(--dm-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'var(--dm-surface)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: 40,
                height: 40,
                background: 'var(--primary-600)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--on-primary)',
                fontWeight: 'bold'
              }}
            >
              F
            </div>
            <div>
              <h4 style={{ margin: 0 }}>Franeo josé</h4>
            </div>
          </div>
        </div>

        <div
          style={{
            flex: 1,
            padding: '20px',
            background: 'var(--neutral-50)',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px'
          }}
        >
          <div
            style={{
              alignSelf: 'flex-start',
              background: 'var(--dm-surface)',
              padding: '12px',
              borderRadius: '12px',
              borderBottomLeftRadius: '2px',
              maxWidth: '70%',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}
          >
            <p style={{ margin: 0, fontSize: '0.9rem' }}>
              Olá, Maria Investidora! Enviamos nosso pitch deck atualizado. Estamos buscando
              25.000 Kz para expansão em Benguela em troca de 5% de equity.
            </p>
            <span style={{ fontSize: '0.7rem', color: 'var(--dm-text-muted)', marginTop: '5px', display: 'block' }}>
              10:30 AM
            </span>
          </div>

          <div
            style={{
              alignSelf: 'flex-end',
              background: 'var(--primary-600)',
              color: 'var(--on-primary)',
              padding: '12px',
              borderRadius: '12px',
              borderBottomRightRadius: '2px',
              maxWidth: '70%'
            }}
          >
            <p style={{ margin: 0, fontSize: '0.9rem' }}>
              Obrigada pelo envio! Analisando o Score IA de vocês, parece promissor. Podemos
              agendar uma call amanhã?
            </p>
            <span
              style={{
                fontSize: '0.7rem',
                color: '#e0e7ff',
                marginTop: '5px',
                display: 'block'
              }}
            >
              10:45 AM
            </span>
          </div>
        </div>

        <div
          style={{
            padding: '15px',
            borderTop: '1px solid var(--dm-border)',
            background: 'var(--dm-surface)',
            display: 'flex',
            gap: '10px'
          }}
        >
          <input
            type="text"
            placeholder="Escreva sua mensagem ou contraproposta..."
            style={{
              flex: 1,
              padding: '10px',
              border: '1px solid var(--dm-border)',
              borderRadius: '8px',
              outline: 'none'
            }}
          />
          <button className="btn btn-primary" style={{ padding: '0 20px' }}>
            Enviar
          </button>
        </div>
      </div>
      <style>
        {`
          .proposta-item:hover { background: var(--primary-100); }
          .badge-warning { background: var(--warning-100); color: var(--warning-500); }
          .badge-success { background: var(--success-100); color: var(--success-500); }
        `}
      </style>
    </div>
  );
}
function Perfilmentor() {
  const ctx = useContext(AppContext);
  const t = ctx?.t ?? (k => k);
  const user = ctx?.currentUser || null;
  const p = user?.profileData || {};
  const isMentor = user?.role === "mentor";
  const isEmpreendedor = user?.role === "empreendedor";
  const status = user?.verificationStatus || "approved";
  const verificationLabel = status === "approved" ? "✔ Conta Verificada" : status === "rejected" ? "Conta rejeitada" : "Conta em verificação";
  const verificationColor = status === "approved" ? "#10b981" : status === "rejected" ? "#ef4444" : "#f59e0b";
  const verificationText = status === "approved"
    ? (isMentor ? "Validação de identidade e documentos profissionais." : "Conta ativa para gestão de ideias e crescimento.")
    : status === "rejected"
      ? "A verificação foi rejeitada. Atualize os documentos para nova análise."
      : "Conta em análise pela equipe de validação.";

  const roleTitle = isMentor ? "Mentor" : "Empreendedor";
  const location = p.province || p.business_location || p.businessLocation || "Angola";
  const profileHighlights = isMentor
    ? [
        p.expertise_area || p.expertiseArea ? `Especialidade: ${p.expertise_area || p.expertiseArea}` : null,
        p.experience_years || p.experienceYears ? `Anos de experiência: ${p.experience_years || p.experienceYears}` : null,
        p.company ? `Empresa: ${p.company}` : null,
        p.current_role || p.currentRole ? `Função atual: ${p.current_role || p.currentRole}` : null,
      ].filter(Boolean)
    : [
        p.business_name || p.businessName ? `Nome do negócio: ${p.business_name || p.businessName}` : null,
        p.business_sector || p.businessSector ? `Setor: ${p.business_sector || p.businessSector}` : null,
        p.business_stage || p.businessStage ? `Fase: ${p.business_stage || p.businessStage}` : null,
        p.business_location || p.businessLocation ? `Local: ${p.business_location || p.businessLocation}` : null,
      ].filter(Boolean);

  const profileBio = isMentor
    ? `Mentor com foco em ${p.expertise_area || p.expertiseArea || "desenvolvimento de negócios"}.`
    : `Empreendedor a desenvolver o negócio ${p.business_name || p.businessName || "em fase inicial"}.`;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      
      {/* HEADER PERFIL */}
      <div className="dashboard-card" style={{ padding: 0, overflow: 'hidden', marginBottom: '25px' }}>
        <div style={{ height: '88px', background: 'var(--primary-800)' }} />
        
        <div style={{ padding: '0 30px 30px', marginTop: '-50px', display: 'flex', alignItems: 'flex-end', gap: '20px' }}>
          <div style={{ width: 120, height: 120, borderRadius: '50%', border: '5px solid var(--dm-surface)', background: 'var(--primary-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 700, color: 'var(--primary-700)' }}>
            {String(user?.name || "U").charAt(0)}
          </div>

          <div style={{ flex: 1 }}>
            <h2 style={{ margin: 0 }}>{user?.name || "Utilizador"}</h2>
            <p style={{ margin: '5px 0 0', color: 'var(--dm-text-muted)' }}>
              {roleTitle} • {location}
            </p>
          </div>

          <button
            className="btn btn-primary"
            onClick={() => ctx?.setModal?.({ open: true, message: t('config.editOpened') })}
          >
            Editar Perfil
          </button>
        </div>
      </div>

      {/* CONTEÚDO */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '25px' }}>
        
        {/* COLUNA ESQUERDA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          
          <div className="dashboard-card">
            <h4>Status de Verificação</h4>
            <div style={{ color: verificationColor, fontWeight: 600 }}>{verificationLabel}</div>
            <p style={{ fontSize: '0.8rem', color: 'var(--dm-text-muted)' }}>
              {verificationText}
            </p>
          </div>

          <div className="dashboard-card">
            <h4>{isMentor ? "Resumo Profissional" : "Resumo do Negócio"}</h4>
            <ul style={{ paddingLeft: '20px', fontSize: '0.9rem', lineHeight: '1.6' }}>
              {(profileHighlights.length ? profileHighlights : ["Sem dados suficientes no perfil."]).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* COLUNA DIREITA */}
        <div className="dashboard-card">
          <h3 className="dashboard-card-title">{isMentor ? "Biografia Profissional" : "Descrição do Perfil"}</h3>
          <p style={{ lineHeight: '1.6', color: 'var(--dm-text)' }}>
            {profileBio}
          </p>

          <hr style={{ borderTop: '1px solid var(--dm-border)', margin: '25px 0' }} />

          <h3 className="dashboard-card-title">Informações de Contato</h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <Info label="E-mail" value={user?.email || "-"} />
            <Info label="Telefone" value={p.phone || "-"} />
            <Info
              label="LinkedIn"
              value={p.linkedin ? <a href={p.linkedin} style={{ color: '#2563eb' }}>Ver perfil</a> : "-"}
            />
            <Info label={isEmpreendedor ? "Setor" : "Empresa"} value={isEmpreendedor ? (p.business_sector || p.businessSector || "-") : (p.company || "-")} />
          </div>
        </div>
      </div>
    </div>
  );
}