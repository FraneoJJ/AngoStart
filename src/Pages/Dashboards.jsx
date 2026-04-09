import React, { useState, useEffect, createContext, useContext, useMemo, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import '../style/auth.css';
import { createIdea, getIdeaById, getMarketplaceIdeas, getMyIdeas, updateIdeaApproval, updateIdeaStatus } from "../services/ideasApi";
import { generateQuestionnaire, saveQuestionnaireAnswers } from "../services/questionnaireApi";
import { analyzeViability, getLatestViabilityReport } from "../services/viabilityApi";
import { getLegalFlow, getLegalProgress, updateLegalProgress, generateCompanyGuide, getLatestCompanyGuide } from "../services/legalApi";
import { getStrategicChecklist, getStrategicProgress, updateStrategicProgress } from "../services/strategyApi";
import { getSubscriptionPlans, getCurrentSubscription, changeSubscriptionPlan } from "../services/subscriptionApi";
import { createAdmin, getAdminIdeas, getAdminUsers, removeSecondaryAdmin, updateAdminUserVerification } from "../services/adminApi";
import { getAvailableInvestors, getInvestorById } from "../services/investorApi";
import { getAvailableMentors, getMentorById } from "../services/mentorApi";
import { createMentorshipRequest, getMentorMentorshipRequests, getMyMentorshipRequests, updateMentorMentorshipRequest } from "../services/mentorshipApi";
import { getChatConversations } from "../services/chatService";
import { updateMyProfile } from "../services/authApi";
import { getPerformanceReport } from "../services/reportApi";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import Planos from "../components/SecoesApp/Planos";
import ChatWindow from "../components/communication/ChatWindow";

const STORAGE_KEY = 'angostart_settings';
const logoUrl = `${import.meta.env.BASE_URL}logo.png`;

function parseJsonSafe(raw, fallback) {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

async function compressImageToDataUrl(file, options = {}) {
  const maxWidth = Number(options.maxWidth || 700);
  const maxHeight = Number(options.maxHeight || 700);
  const quality = Number(options.quality || 0.8);

  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Falha ao ler ficheiro de imagem."));
    reader.readAsDataURL(file);
  });

  const img = await new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Falha ao processar imagem."));
    image.src = dataUrl;
  });

  let targetW = img.width;
  let targetH = img.height;
  const scale = Math.min(maxWidth / targetW, maxHeight / targetH, 1);
  targetW = Math.max(1, Math.round(targetW * scale));
  targetH = Math.max(1, Math.round(targetH * scale));

  const canvas = document.createElement("canvas");
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Não foi possível preparar compressão da imagem.");
  ctx.drawImage(img, 0, 0, targetW, targetH);
  return canvas.toDataURL("image/jpeg", quality);
}

const translations = {
  pt: {
    nav: {
      section: { principal: 'Principal', crescimento: 'Crescimento', analise: 'Análise', conteudo: 'Conteúdo', administracao: 'Administração', analytics: 'Analytics', sistema: 'Sistema', configuracoes: 'Configurações' },
      item: { 'dashboard': 'Dashboard', 'submeter-ideia': 'Submeter Ideia', 'minhas-ideias': 'Minhas Ideias', 'mentoria': 'Mentoria', 'investidores': 'Investidores', 'checklist-estrategico': 'Plano de Ação', 'legalizacao': 'Legalização', 'assinatura': 'Assinatura', 'perfil': 'Perfil', 'configuracoes': 'Configurações', 'marketplace': 'Marketplace', 'meus-investimentos': 'Investimentos', 'propostas': 'Propostas', 'analytics': 'Analytics', 'sessoes': 'Sessões', 'mentorados': 'Mentorados', 'agenda': 'Agenda', 'mensagens': 'Mensagens', 'usuarios': 'Usuários', 'administradores': 'Administradores', 'admin-mensagens': 'Mensagens de Admins', 'ideias': 'Ideias', 'relatorios': 'Relatórios' },
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
      item: { 'dashboard': 'Dashboard', 'submeter-ideia': 'Submit Idea', 'minhas-ideias': 'My Ideas', 'mentoria': 'Mentoring', 'investidores': 'Investors', 'checklist-estrategico': 'Action Plan', 'legalizacao': 'Legal Setup', 'assinatura': 'Subscription', 'perfil': 'Profile', 'configuracoes': 'Settings', 'marketplace': 'Marketplace', 'meus-investimentos': 'Investments', 'propostas': 'Proposals', 'analytics': 'Analytics', 'sessoes': 'Sessions', 'mentorados': 'Mentees', 'agenda': 'Agenda', 'mensagens': 'Messages', 'usuarios': 'Users', 'administradores': 'Administrators', 'admin-mensagens': 'Admin Messages', 'ideias': 'Ideas', 'relatorios': 'Reports' },
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
      { id: 'submeter-ideia', icon: 'lightbulb' },
      { id: 'minhas-ideias', icon: 'folder', badge: 3 },
    ]},
    { sectionKey: 'crescimento', items: [
      { id: 'mensagens', icon: 'message-square-text' },
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
      { id: 'mensagens', icon: 'message-square-text' },
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
      { id: 'administradores', icon: 'users' },
      { id: 'admin-mensagens', icon: 'message-square-text' },
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
  'message-square-text': <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z"/><path d="M7 11h10"/><path d="M7 15h6"/><path d="M7 7h8"/></svg>,
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
  const modalText = `${modal?.title || ""} ${modal?.message || ""}`.toLowerCase();
  const modalTone = modalText.includes("erro") || modalText.includes("falha") || modalText.includes("rejeitada")
    ? "danger"
    : modalText.includes("sucesso") || modalText.includes("aprovad")
      ? "success"
      : "info";
  const toneStyles = {
    danger: { accent: "#ef4444", soft: "rgba(239, 68, 68, 0.12)" },
    success: { accent: "#10b981", soft: "rgba(16, 185, 129, 0.12)" },
    info: { accent: "#3b82f6", soft: "rgba(59, 130, 246, 0.12)" },
  };
  const { accent, soft } = toneStyles[modalTone];
  const detailEntries = typeof modal?.message === "string"
    ? modal.message
        .split("|")
        .map((part) => part.trim())
        .filter(Boolean)
        .map((part) => {
          const idx = part.indexOf(":");
          if (idx === -1) return null;
          const label = part.slice(0, idx).trim();
          const value = part.slice(idx + 1).trim();
          if (!label || !value) return null;
          return { label, value };
        })
        .filter(Boolean)
    : [];
  const hasStructuredDetails = detailEntries.length >= 2;
  const renderDetailIcon = (label) => {
    const key = String(label || "").toLowerCase();
    if (key.includes("setor")) {
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 21h18" />
          <path d="M5 21V7l8-4v18" />
          <path d="M19 21V11l-6-4" />
        </svg>
      );
    }
    if (key.includes("cidade")) {
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 10c0 7-9 12-9 12S3 17 3 10a9 9 0 1 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      );
    }
    if (key.includes("empreendedor")) {
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      );
    }
    if (key.includes("status")) {
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    }
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    );
  };
  const close = () => {
    if (typeof modal.onClose === "function") {
      modal.onClose();
    }
    setModal({ ...modal, open: false, onClose: undefined });
  };
  return (
    <div className="modal-overlay" onClick={close} style={{ position: 'fixed', inset: 0, background: 'rgba(11, 18, 32, 0.30)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '16px 0' }}>
      <div className="modal-box" onClick={e => e.stopPropagation()} style={{ background: 'var(--dm-surface)', borderRadius: '18px', padding: '22px', maxWidth: '440px', width: '92%', boxShadow: '0 18px 48px rgba(15, 23, 42, 0.24)', border: '1px solid var(--dm-border)', margin: '10px 0', maxHeight: 'calc(100vh - 24px)', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: modal.title || modal.message ? '14px' : 0 }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '999px', background: soft, color: accent, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {modalTone === "danger" && (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            )}
            {modalTone === "success" && (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            )}
            {modalTone === "info" && (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
            )}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            {modal.title && <h3 style={{ margin: '0 0 6px', fontSize: '1.05rem', fontWeight: 700, color: 'var(--neutral-900)', lineHeight: 1.35 }}>{modal.title}</h3>}
            {modal.message && !hasStructuredDetails && <p style={{ margin: 0, color: 'var(--dm-text)', fontSize: '0.95rem', lineHeight: 1.5 }}>{modal.message}</p>}
            {hasStructuredDetails && (
              <div style={{ display: "grid", gap: "8px" }}>
                {detailEntries.map((entry) => (
                  <div key={entry.label} style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--dm-text)", fontSize: "0.92rem", lineHeight: 1.4 }}>
                    <span style={{ width: "20px", height: "20px", borderRadius: "999px", background: soft, color: accent, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {renderDetailIcon(entry.label)}
                    </span>
                    <span style={{ fontWeight: 600, color: "var(--neutral-900)" }}>{entry.label}:</span>
                    <span>{entry.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        {modal.content ? <div>{modal.content}</div> : null}
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
          <button type="button" className="btn btn-primary" onClick={close} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', paddingInline: '14px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
            {t ? t('common.close') : 'Fechar'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [navBadges, setNavBadges] = useState({});
  const [pendingChatTarget, setPendingChatTarget] = useState(null);
  const [dismissedVerificationNotice, setDismissedVerificationNotice] = useState(false);
  const profileRefreshRef = useRef("");
  const [selectedRoleForSwitch, setSelectedRoleForSwitch] = useState("");
  const [switchingRole, setSwitchingRole] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [idioma, setIdioma] = useState(() => {
    const s = parseJsonSafe(localStorage.getItem(STORAGE_KEY), null);
    return s?.idioma || 'pt';
  });
  const [modal, setModal] = useState({ open: false, title: '', message: '', onClose: undefined });
  const setNavBadgesSafe = useCallback((next) => {
    setNavBadges((prev) => {
      const a = prev || {};
      const b = next || {};
      const aKeys = Object.keys(a);
      const bKeys = Object.keys(b);
      if (aKeys.length === bKeys.length && aKeys.every((k) => a[k] === b[k])) {
        return prev;
      }
      return b;
    });
  }, []);
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
    adminCategory: apiUser.adminCategory || apiUser.admin_category || null,
    availableRoles: apiUser.availableRoles || [apiUser.role],
    verificationStatus: apiUser.verificationStatus || (apiUser.role === "admin" ? "approved" : "pending"),
    verificationId: apiUser.verificationId || null,
    avatarUrl: apiUser.avatarUrl || null,
    profileData: apiUser.profileData || {},
  });
  const applyAuthenticatedUser = useCallback((apiUser) => {
    if (!apiUser) return null;
    const mapped = mapAuthenticatedUser(apiUser);
    setUser(mapped);
    return mapped;
  }, []);
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
      if (res.ok && data?.success && data?.user) return applyAuthenticatedUser(data.user);
      return null;
    } catch {
      return null;
    }
  }, [applyAuthenticatedUser]);
  const refreshNavBadges = useCallback(async (targetUser = user) => {
    const role = targetUser?.role;
    if (!role) return;

    try {
      if (role === "empreendedor") {
        const [ideas, mentorshipRequests, conversations] = await Promise.all([
          getMyIdeas(),
          getMyMentorshipRequests(),
          getChatConversations().catch(() => []),
        ]);
        const mentoriasAgendadas = mentorshipRequests.filter((r) => r.status === "accepted").length;
        setNavBadgesSafe({
          "minhas-ideias": ideas.length,
          mensagens: conversations.length,
          mentoria: mentoriasAgendadas,
        });
        return;
      }

      if (role === "investidor") {
        const [marketplaceIdeas, conversations] = await Promise.all([
          getMarketplaceIdeas(),
          getChatConversations().catch(() => []),
        ]);
        setNavBadgesSafe({
          marketplace: marketplaceIdeas.length,
          propostas: conversations.length,
        });
        return;
      }

      if (role === "mentor") {
        const [requests, conversations] = await Promise.all([
          getMentorMentorshipRequests(),
          getChatConversations().catch(() => []),
        ]);
        const mentoringRequests = requests.filter((r) => r.status === "accepted").length;
        setNavBadgesSafe({
          sessoes: mentoringRequests,
          mensagens: conversations.length,
        });
        return;
      }

      if (role === "admin") {
        const adminIdeas = await getAdminIdeas();
        setNavBadgesSafe({
          ideias: adminIdeas.length,
        });
        return;
      }

      setNavBadgesSafe({});
    } catch {
      // Não interrompe o dashboard se alguma contagem falhar.
      setNavBadgesSafe({});
    }
  }, [user, setNavBadgesSafe]);

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
    if (!user?.role) return;
    const timer = setInterval(() => {
      refreshNavBadges(user);
    }, 20000);
    return () => clearInterval(timer);
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

  const openChatConversation = useCallback((targetUser, options = {}) => {
    const targetId = Number(targetUser?.userId || targetUser?.id || 0);
    if (!targetId) return;
    setPendingChatTarget({
      userId: targetId,
      name: targetUser?.name || "Utilizador",
      role: targetUser?.role || "",
      subtitle: targetUser?.subtitle || "",
      avatarUrl: targetUser?.avatarUrl || null,
    });
    const defaultPage = user?.role === "investidor" ? "propostas" : "mensagens";
    setCurrentPage(options?.pageId || defaultPage);
    closeSidebarOnMobile();
  }, [user?.role]);

  const clearPendingChatTarget = useCallback(() => {
    setPendingChatTarget(null);
  }, []);

  const goToPage = useCallback((pageId) => {
    if (!pageId) return;
    setCurrentPage(pageId);
    closeSidebarOnMobile();
  }, []);

  const ctxValue = useMemo(() => ({
    idioma,
    setIdioma,
    t,
    modal,
    setModal,
    refreshNavBadges,
    refreshCurrentUser,
    applyAuthenticatedUser,
    currentUser: user,
    openChatConversation,
    pendingChatTarget,
    clearPendingChatTarget,
    goToPage,
  }), [idioma, modal, refreshNavBadges, refreshCurrentUser, applyAuthenticatedUser, user, openChatConversation, pendingChatTarget, clearPendingChatTarget, goToPage]);

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
        applyAuthenticatedUser(data.user);
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
      applyAuthenticatedUser(data.user);
      setCurrentPage("dashboard");
    } catch (err) {
      setModal({ open: true, title: "Troca de papel", message: err.message || "Falha ao trocar de papel." });
    } finally {
      setSwitchingRole(false);
    }
  }

  const canShowVerificationNotice = user?.role === "mentor" || user?.role === "investidor" || user?.role === "empreendedor";
  const verificationMeta = {
    pending: {
      title: "Conta pendente de verificação",
      text: "A conta está em análise. Enquanto isso, apenas Dashboard, Perfil e Configurações ficam disponíveis.",
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
      text: "A verificação foi rejeitada. Apenas o Perfil permanece ativo para atualizar os seus dados/documentos antes de nova análise.",
      border: "#ef4444",
      bg: "#fef2f2",
      titleColor: "#991b1b",
      textColor: "#7f1d1d",
    },
  };
  const currentVerificationStatus = user?.verificationStatus || "pending";
  const currentVerificationMeta = verificationMeta[currentVerificationStatus] || verificationMeta.pending;
  const verificationNoticeDismissKey = user ? `angostart_verif_notice_${user.id}_${user.role}_${currentVerificationStatus}` : "";
  const isRejectedRestricted = user?.role !== "admin" && currentVerificationStatus === "rejected";
  const isPendingRestricted = user?.role !== "admin" && currentVerificationStatus === "pending";
  const isVerificationRestricted = isRejectedRestricted || isPendingRestricted;
  const isPageAllowedByVerification = (page) => {
    if (isRejectedRestricted) return page === "perfil";
    if (isPendingRestricted) return page === "dashboard" || page === "perfil" || page === "configuracoes";
    return true;
  };
  const restrictedFallbackPage = isRejectedRestricted ? "perfil" : "dashboard";

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

  useEffect(() => {
    if (!isVerificationRestricted) return;
    if (!isPageAllowedByVerification(currentPage)) {
      setCurrentPage(restrictedFallbackPage);
    }
  }, [isVerificationRestricted, currentPage, restrictedFallbackPage]);

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
    case 'mensagens': return <MensagensEmpreendedorLegacy />;
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
    case 'dashboard': return <MentorDashboardDynamic />;
    case 'sessoes': return <MentorSessoesDynamic />;
    case 'mentorados': return <MentoradosDynamic />;
    case 'agenda': return <AgendaMentorDynamic />;
    case 'mensagens': return <MensagensMentorDynamic />;
    case 'assinatura': return <AssinaturaPlano />;
    case 'perfil': return <Perfilmentor />;
    case 'configuracoes': return <Configuracoes />;
    default: return <MentorDashboardDynamic />;
  }
}
function RenderAdminPage() {
  switch(currentPage) {
    case 'dashboard': return <Admin />;
    case 'usuarios': return <Usuarios />;
    case 'administradores': return <Administradores />;
    case 'admin-mensagens': return <MensagensAdmins />;
    case 'ideias': return <Ideias />;
    case 'relatorios': return <Relatorio />;
    case 'configuracoes': return <Configuracoes />;
    default: return <Admin />;
  }
}

function MensagensAdmins() {
  const ctx = useContext(AppContext);
  const currentUserId = Number(ctx?.currentUser?.id || 0);
  const currentUserRole = String(ctx?.currentUser?.role || "");
  const currentUserAdminCategory = String(ctx?.currentUser?.adminCategory || "primary");
  const isPrimaryAdmin = currentUserRole === "admin" && currentUserAdminCategory === "primary";
  const [loading, setLoading] = useState(true);
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const data = await getAdminUsers();
        const onlyAdmins = (data || []).filter((u) => u.role === "admin");
        if (!mounted) return;
        setAdmins(onlyAdmins);
      } catch {
        if (!mounted) return;
        setAdmins([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const contacts = useMemo(() => {
    const base = (admins || []).map((a) => {
      const cat = a.adminCategory || "primary";
      return {
        userId: Number(a.id),
        name: a.name || "Admin",
        role: "admin",
        subtitle: cat === "secondary" ? "Administrador Secundário" : "Administrador Principal",
        avatarUrl: a.avatarUrl || null,
      };
    }).filter((c) => Number(c.userId) !== Number(currentUserId));

    if (isPrimaryAdmin) {
      base.unshift({
        userId: -1,
        name: "AngoStart (Comunicado Geral)",
        role: "admin",
        subtitle: "Enviar mensagem para todos os utilizadores",
        avatarUrl: null,
      });
    }
    return base;
  }, [admins, currentUserId, isPrimaryAdmin]);

  const allowedUserIds = useMemo(() => contacts.map((c) => Number(c.userId)).filter(Boolean), [contacts]);

  if (loading) {
    return (
      <div style={{ padding: "10px" }}>
        <div className="dashboard-card">
          <p>A carregar chat de admins...</p>
        </div>
      </div>
    );
  }

  return (
    <ChatWindow
      title="Chat de Admins"
      contacts={contacts}
      currentUserId={currentUserId}
      allowedUserIds={allowedUserIds}
      initialContact={ctx?.pendingChatTarget}
      onInitialContactConsumed={ctx?.clearPendingChatTarget}
      emptyText="Sem admins disponíveis para conversas."
      currentUserRole={currentUserRole}
      currentUserAdminCategory={currentUserAdminCategory}
    />
  );
}

  // =========================
  // ÁREAS (FUNCTIONS)
  // =========================
  function Investidor() {
    const ctx = useContext(AppContext);
    const [loading, setLoading] = useState(true);
    const [ideas, setIdeas] = useState([]);
    const [conversations, setConversations] = useState([]);

    useEffect(() => {
      let mounted = true;
      (async () => {
        setLoading(true);
        try {
          const [marketplaceIdeas, chatConversations] = await Promise.all([
            getMarketplaceIdeas(),
            getChatConversations().catch(() => []),
          ]);
          if (!mounted) return;
          setIdeas(marketplaceIdeas || []);
          setConversations(chatConversations || []);
        } catch (err) {
          if (!mounted) return;
          setIdeas([]);
          setConversations([]);
          ctx?.setModal?.({ open: true, message: `Falha ao carregar dashboard do investidor: ${err.message}` });
        } finally {
          if (mounted) setLoading(false);
        }
      })();
      return () => {
        mounted = false;
      };
    }, []);

    const scoredIdeas = (ideas || []).filter((i) => Number.isFinite(Number(i?.viability_score)));
    const featuredIdeas = [...(ideas || [])]
      .sort((a, b) => Number(b?.viability_score || 0) - Number(a?.viability_score || 0))
      .slice(0, 8);
    const totalOportunidades = ideas.length;
    const propostasAtivas = conversations.length;
    const scoreMedio = scoredIdeas.length
      ? Math.round(scoredIdeas.reduce((sum, i) => sum + Number(i?.viability_score || 0), 0) / scoredIdeas.length)
      : 0;
    const capitalTotalSolicitado = ideas.reduce((sum, i) => sum + Number(i?.initial_capital || 0), 0);
    const pendentes = ideas.filter((i) => i.status === "submitted" || i.status === "analyzing").length;
    const formatKz = (v) => `${Number(v || 0).toLocaleString("pt-PT")} Kz`;

    return (
      <>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-card-content">
              <div className="stat-info">
                <div className="stat-label">Oportunidades Ativas</div>
                <div className="stat-value">{loading ? "..." : totalOportunidades}</div>
                <div className="stat-change">Projetos no marketplace</div>
              </div>
              <div className="stat-icon-wrapper stat-icon-primary">{icons.briefcase}</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card-content">
              <div className="stat-info">
                <div className="stat-label">Capital Solicitado</div>
                <div className="stat-value">{loading ? "..." : formatKz(capitalTotalSolicitado)}</div>
                <div className="stat-change">Soma de ideias publicadas</div>
              </div>
              <div className="stat-icon-wrapper stat-icon-success">{icons["dollar-sign"]}</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card-content">
              <div className="stat-info">
                <div className="stat-label">Propostas Pendentes</div>
                <div className="stat-value">{loading ? "..." : pendentes}</div>
                <div className="stat-change">Ideias em submissão/análise</div>
              </div>
              <div className="stat-icon-wrapper stat-icon-secondary">{icons.inbox}</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card-content">
              <div className="stat-info">
                <div className="stat-label">Conversas / Score IA</div>
                <div className="stat-value">{loading ? "..." : `${propostasAtivas} / ${scoreMedio}`}</div>
                <div className="stat-change">Dados atualizados da base</div>
              </div>
              <div className="stat-icon-wrapper stat-icon-info">{icons["trending-up"]}</div>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <div>
              <h3 className="dashboard-card-title">Oportunidades em Destaque</h3>
              <p className="dashboard-card-description">Ideias com maior score de viabilidade na base de dados.</p>
            </div>
            <button className="btn btn-outline" style={{ width: "auto" }} onClick={() => setCurrentPage("marketplace")}>
              Abrir Marketplace
            </button>
          </div>

          {loading ? (
            <p>A carregar oportunidades...</p>
          ) : featuredIdeas.length === 0 ? (
            <p>Sem oportunidades disponíveis no momento.</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Startup</th>
                  <th>Setor</th>
                  <th>Score IA</th>
                  <th>Capital</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {featuredIdeas.map((idea) => {
                  const score = Number(idea?.viability_score || 0);
                  return (
                    <tr key={idea.id}>
                      <td>{idea.title || "-"}</td>
                      <td>{idea.sector || "-"}</td>
                      <td>
                        <span className={`badge ${score >= 80 ? "badge-success" : score >= 60 ? "badge-warning" : "badge-info"}`}>
                          {score || "-"}
                        </span>
                      </td>
                      <td>{formatKz(idea.initial_capital)}</td>
                      <td>
                        <span className={`badge ${idea.status === "active" ? "badge-success" : "badge-warning"}`}>
                          {idea.status || "-"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </>
    );
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
      (u) => u.role !== "admin" && u.verificationStatus === "pending"
    ).length;
    const approvedProfiles = users.filter(
      (u) => u.role !== "admin" && u.verificationStatus === "approved"
    ).length;
    const pendingList = users.filter(
      (u) => u.role !== "admin" && u.verificationStatus === "pending"
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
            <p className="dashboard-card-description">Revisão de todas as contas pendentes (exceto admin).</p>
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
    if (isRejectedRestricted) {
      if (user.role === "investidor") return <InvestidorPerfil />;
      if (user.role === "mentor" || user.role === "empreendedor") return <Perfilmentor />;
    }
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
          <img src={logoUrl} alt="AngoStart"/>
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
                  type={showLoginPassword ? "text" : "password"} 
                  id="password" 
                  className="form-input password-input-with-toggle" 
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="input-toggle-btn"
                  onClick={() => setShowLoginPassword((prev) => !prev)}
                  aria-label={showLoginPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showLoginPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C7 20 2.73 16.11 1 12c.73-1.73 1.81-3.24 3.16-4.44" />
                      <path d="M10.58 10.58A2 2 0 0 0 12 14a2 2 0 0 0 1.42-.58" />
                      <path d="M1 1l22 22" />
                      <path d="M9.88 4.24A10.94 10.94 0 0 1 12 4c5 0 9.27 3.89 11 8a11.8 11.8 0 0 1-1.67 2.79" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>

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
            {/* 
            <div className="demo-box">
              <p className="demo-title">Usuários de teste</p>
              <div className="demo-list">
                <p>• empreendedor@gmail.com / 123456</p>
                <p>• investidor@gmail.com / 123456</p>
                <p>• mentor@gmail.com / 123456</p>
                <p>• admin@gmail.com / 123456</p>
              </div>
            </div>
            */}
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
          <img src={logoUrl} alt="AngoStart" className="sidebar-logo" />
        </header>
        <aside className={`sidebar ${isSidebarOpen ? "active" : ""}`}>
          <div className="sidebar-header">
            <img src={logoUrl} alt="AngoStart" className="sidebar-logo" />
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
                    const rawBadge = Object.prototype.hasOwnProperty.call(navBadges, item.id)
                      ? navBadges[item.id]
                      : null;
                    const badgeNum = Number(rawBadge);
                    const showNavBadge = rawBadge != null && Number.isFinite(badgeNum) && badgeNum > 0;
                    return (
                  <div
                    key={item.id}
                    className={`nav-item ${currentPage === item.id ? "active" : ""}`}
                    onClick={() => {
                      if (isVerificationRestricted && !isPageAllowedByVerification(item.id)) {
                        setModal({
                          open: true,
                          title: isRejectedRestricted ? "Conta rejeitada" : "Conta em verificação",
                          message: isRejectedRestricted
                            ? "Enquanto a conta estiver rejeitada, apenas o perfil fica disponível para atualizar os seus dados."
                            : "Enquanto a conta estiver em verificação, apenas Dashboard, Perfil e Configurações ficam disponíveis.",
                        });
                        return;
                      }
                      setCurrentPage(item.id);
                      closeSidebarOnMobile();
                    }}
                    style={isVerificationRestricted && !isPageAllowedByVerification(item.id) ? { opacity: 0.45, cursor: "not-allowed" } : undefined}
                  >
                    <span className="nav-icon">{icons[item.icon]}</span>
                    <span className="nav-label">{t('nav.item.' + item.id)}</span>
                    {showNavBadge ? <span className="nav-badge">{badgeNum}</span> : null}
                  </div>
                    );
                  })()
                ))}
              </div>
            ))}
          </div>
          <div className="sidebar-footer">
            <div className="user-profile">
              <div className="user-avatar" style={{ overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  user.name.charAt(0)
                )}
              </div>
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
            {RenderArea()}
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

            <div style={{ borderTop: '1px solid var(--dm-border)', paddingTop: 15, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
              <div>
                <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--dm-text-muted)', textTransform: 'uppercase' }}>
                  Capital inicial
                </span>
                <strong style={{ color: '#10b981' }}>{formatCapital(s.initial_capital)} AOA</strong>
              </div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "flex-end" }}>
                <button
                  className="btn btn-outline"
                  style={{ width: "auto", padding: "8px 12px", fontSize: "0.82rem" }}
                  onClick={() => ctx?.openChatConversation?.({
                    userId: Number(s.owner_user_id || 0),
                    name: s.owner_name || "Empreendedor",
                    avatarUrl: s.owner_avatar_url || null,
                    role: "empreendedor",
                    subtitle: `${s.title || "Projeto"} • ${s.sector || "Setor"}`,
                  }, { pageId: "propostas" })}
                  disabled={!Number(s.owner_user_id || 0)}
                >
                  Contactar
                </button>
                <button
                  className="btn btn-primary"
                  style={{ width: "auto", padding: '8px 15px', fontSize: '0.85rem' }}
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
          </div>
        ))}
      </div>
    </div>
  );
}
function Investimentos() {
  const ctx = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const [ideas, conversations] = await Promise.all([
          getMarketplaceIdeas(),
          getChatConversations().catch(() => []),
        ]);
        if (!mounted) return;
        const conversationUserIds = new Set(
          (conversations || [])
            .filter((c) => String(c?.role || "").toLowerCase() === "empreendedor")
            .map((c) => Number(c.userId))
            .filter(Boolean)
        );
        const normalized = (ideas || [])
          .filter((i) => {
            const ownerUserId = Number(i.owner_user_id || i.ownerUserId || i.owner_id || 0);
            return ownerUserId > 0 && conversationUserIds.has(ownerUserId);
          })
          .map((i) => ({
            id: Number(i.id),
            ownerUserId: Number(i.owner_user_id || i.ownerUserId || i.owner_id || 0),
            startup: i.title || "Projeto",
            sector: i.sector || "-",
            requested: Number(i.initial_capital || 0),
            score: Number(i.viability_score || 0),
            status: i.status || "-",
            owner: i.owner_name || "Empreendedor",
            ownerAvatarUrl: i.owner_avatar_url || null,
          }))
          .sort((a, b) => b.score - a.score);
        setRows(normalized);
      } catch (err) {
        if (!mounted) return;
        setRows([]);
        ctx?.setModal?.({ open: true, message: `Falha ao carregar carteira de investimentos: ${err.message}` });
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const formatKz = (v) => `${Number(v || 0).toLocaleString("pt-PT")} Kz`;
  const totalAlocado = rows.reduce((sum, r) => sum + Number(r.requested || 0), 0);
  const avgScore = rows.length ? Math.round(rows.reduce((sum, r) => sum + Number(r.score || 0), 0) / rows.length) : 0;

  return (<>
    <div className="portfolio-container">
      <div className="stats-grid" style={{ marginBottom: '25px' }}>
        <div className="stat-card">
          <div className="stat-card-content" >
            <div className="stat-info">
              <div className="stat-label">Total Alocado</div>
              <div className="stat-value">{loading ? "..." : formatKz(totalAlocado)}</div>
              <div className="stat-change">{loading ? "A carregar..." : `${rows.length} startups em conversa`}</div>
            </div>
            <div className="stat-icon-wrapper stat-icon-success">
              {icons['dollar-sign']}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-content">
            <div className="stat-info">
              <div className="stat-label">Score Médio IA</div>
              <div className="stat-value">{loading ? "..." : avgScore}</div>
              <div className="stat-change" style={{ color: '#10b981' }}>
                Qualidade média das oportunidades
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
            <p className="dashboard-card-description">Projetos do marketplace com quem já existe conversa/proposta.</p>
          </div>
          <button
            className="btn btn-outline"
            style={{ width: "auto" }}
            onClick={() => ctx?.goToPage?.("propostas")}
          >
            Abrir Propostas
          </button>
        </div>

        <div style={{ overflowX: 'auto', marginTop: '20px' }}>
          {loading ? (
            <p>A carregar carteira...</p>
          ) : rows.length === 0 ? (
            <p>Sem oportunidades com conversa ativa no momento.</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Startup</th>
                  <th>Setor</th>
                  <th>Capital Solicitado</th>
                  <th>Score IA</th>
                  <th>Status</th>
                  <th>Empreendedor</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((item) => (
                  <tr key={item.id}>
                    <td><strong>{item.startup}</strong></td>
                    <td>{item.sector}</td>
                    <td>{formatKz(item.requested)}</td>
                    <td>
                      <span className={`badge ${item.score >= 80 ? "badge-success" : item.score >= 60 ? "badge-warning" : "badge-info"}`}>
                        {item.score || "-"}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${item.status === "active" ? "badge-success" : "badge-warning"}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>{item.owner}</td>
                    <td>
                      <button
                        className="btn btn-outline"
                        style={{ width: "auto", padding: "6px 10px" }}
                        onClick={() => ctx?.openChatConversation?.({
                          userId: Number(item.ownerUserId || 0),
                          name: item.owner || "Empreendedor",
                          role: "empreendedor",
                          avatarUrl: item.ownerAvatarUrl || null,
                          subtitle: `${item.startup || "Projeto"} • ${item.sector || "Setor"}`,
                        }, { pageId: "propostas" })}
                        disabled={!Number(item.ownerUserId || 0)}
                      >
                        Contactar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  </>);
}
function Analytics() {
  const ctx = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("12m");
  const [ideas, setIdeas] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const data = await getMarketplaceIdeas();
        if (!mounted) return;
        setIdeas(data || []);
      } catch (err) {
        if (!mounted) return;
        setIdeas([]);
        ctx?.setModal?.({ open: true, message: `Falha ao carregar analytics: ${err.message}` });
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const now = new Date();
  const monthsToShow = period === "6m" ? 6 : period === "year" ? 12 : 12;
  const monthBuckets = [];
  for (let i = monthsToShow - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    monthBuckets.push({ key, label: d.toLocaleDateString("pt-PT", { month: "short" }), count: 0 });
  }
  const monthMap = new Map(monthBuckets.map((m) => [m.key, m]));
  for (const idea of ideas || []) {
    const dt = new Date(idea?.created_at || "");
    if (Number.isNaN(dt.getTime())) continue;
    const key = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`;
    const row = monthMap.get(key);
    if (row) row.count += 1;
  }
  const maxMonthCount = Math.max(1, ...monthBuckets.map((m) => m.count));

  const sectorMap = new Map();
  for (const idea of ideas || []) {
    const s = String(idea?.sector || "outros").trim() || "outros";
    sectorMap.set(s, (sectorMap.get(s) || 0) + 1);
  }
  const topSectors = Array.from(sectorMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);
  const maxSector = Math.max(1, ...(topSectors.map(([, count]) => count)));
  const sectorPalette = [
    "var(--primary-600)",
    "var(--primary-500)",
    "var(--primary-400)",
    "var(--primary-300)",
  ];

  const scoredIdeas = [...(ideas || [])]
    .filter((i) => Number.isFinite(Number(i?.viability_score)))
    .sort((a, b) => Number(b?.viability_score || 0) - Number(a?.viability_score || 0))
    .slice(0, 8);

  const toRisk = (score) => {
    const n = Number(score || 0);
    if (n >= 80) return { label: "Baixo", color: "#10b981", badge: "badge-success" };
    if (n >= 60) return { label: "Médio", color: "#f59e0b", badge: "badge-warning" };
    return { label: "Alto", color: "#ef4444", badge: "badge-info" };
  };
  const toTraction = (idea) => {
    const status = String(idea?.status || "");
    if (status === "active") return { text: "↑ 8%", color: "#10b981" };
    if (status === "submitted") return { text: "↑ 3%", color: "#10b981" };
    if (status === "analyzing") return { text: "↓ 1%", color: "#ef4444" };
    return { text: "0%", color: "var(--dm-text-muted)" };
  };

  return (
    <>
      <div className="analytics-container">
        <div className="dashboard-card" style={{ marginBottom: '25px', display: 'flex', justifyContent: ' space-between', alignItems: 'center', gap: "10px", flexWrap: "wrap" }}>
          <div>
            <h3 style={{ margin: '0' }}>Análise de Mercado & Performance</h3>
            <p style={{ margin: ' 5px 0 0 0', color: ' var(--dm-text-muted)', fontSize: '0.85rem' }}>Dados do marketplace.</p>
          </div>
          <select
            className="input-field form-input"
            style={{ padding: '8px 15px', borderRadius: '8px', border: ' 1px solid var(--dm-border)' }}
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            <option value="12m">Últimos 12 meses</option>
            <option value="6m">Últimos 6 meses</option>
            <option value="year">Este Ano</option>
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '25px' }}>
          <div className="dashboard-card">
            <h4 className="dashboard-card-title">Crescimento Médio do Portfólio</h4>
            <p className="dashboard-card-description">Evolução de oportunidades publicadas no período selecionado.</p>
            {loading ? (
              <p style={{ marginTop: "18px" }}>A carregar gráfico...</p>
            ) : (
              <>
                <div style={{ height: '200px', marginTop: '30px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 10px', borderBottom: '2px solid var(--dm-border)', borderLeft: '2px solid var(--dm-border)', background: 'linear-gradient(180deg, var(--primary-50) 0%, transparent 70%)', borderRadius: '8px 8px 0 0' }}>
                  {monthBuckets.map((m) => {
                    const barHeight = Math.max(8, Math.round((m.count / maxMonthCount) * 100));
                    return (
                      <div
                        key={m.key}
                        style={{
                          width: `${Math.max(5, Math.floor(90 / monthsToShow))}%`,
                          height: `${barHeight}%`,
                          position: 'relative',
                          transform: 'perspective(500px) rotateX(0deg)',
                          transformStyle: 'preserve-3d',
                        }}
                        title={`${m.label}: ${m.count}`}
                      >
                        <div
                          style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'linear-gradient(180deg, var(--primary-500) 0%, var(--primary-700) 100%)',
                            border: '1px solid var(--primary-600)',
                            borderRadius: '4px 4px 0 0',
                            boxShadow: '0 4px 10px rgba(15, 23, 42, 0.12)',
                          }}
                        />
                        <div
                          style={{
                            position: 'absolute',
                            top: '-6px',
                            left: '0',
                            width: '100%',
                            height: '6px',
                            background: 'linear-gradient(180deg, var(--primary-200) 0%, var(--primary-400) 100%)',
                            borderTopLeftRadius: '4px',
                            borderTopRightRadius: '4px',
                            transform: 'skewX(-35deg)',
                            transformOrigin: 'left bottom',
                            opacity: 0.95,
                          }}
                        />
                        <div
                          style={{
                            position: 'absolute',
                            top: '0',
                            right: '-6px',
                            width: '6px',
                            height: '100%',
                            background: 'linear-gradient(180deg, var(--primary-700) 0%, var(--primary-900) 100%)',
                            transform: 'skewY(-35deg)',
                            transformOrigin: 'left top',
                            opacity: 0.9,
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '0.75rem', color: 'var(--dm-text-muted)' }}>
                  {monthBuckets.map((m) => <span key={`${m.key}-lb`}>{m.label}</span>)}
                </div>
              </>
            )}
          </div>

          <div className="dashboard-card">
            <h4 className="dashboard-card-title">Setores em Alta (Angola)</h4>
            <div style={{ marginTop: '15px' }}>
              {loading ? (
                <p>A carregar setores...</p>
              ) : topSectors.length === 0 ? (
                <p>Sem dados suficientes.</p>
              ) : (
                topSectors.map(([sector, count], idx) => (
                  <div key={sector} style={{ marginBottom: '15px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '5px' }}>
                      <span>{sector}</span>
                      <span style={{ color: sectorPalette[idx % sectorPalette.length], fontWeight: 'bold' }}>
                        {count} {count === 1 ? "ideia" : "ideias"}
                      </span>
                    </div>
                    <div style={{ width: '100%', background: 'var(--dm-bg)', height: '8px', borderRadius: '4px' }}>
                      <div
                        style={{
                          width: `${Math.max(8, Math.round((count / maxSector) * 100))}%`,
                          background: sectorPalette[idx % sectorPalette.length],
                          height: '100%',
                          borderRadius: '4px',
                        }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <h3 className="dashboard-card-title">Análise Comparativa de Risco (Score IA)</h3>
          <div style={{ overflowX: 'auto', marginTop: '20px' }}>
            {loading ? (
              <p>A carregar análise de risco...</p>
            ) : scoredIdeas.length === 0 ? (
              <p>Sem ideias com score IA disponível.</p>
            ) : (
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
                  {scoredIdeas.map((idea) => {
                    const score = Number(idea?.viability_score || 0);
                    const projection = Math.min(100, Math.max(0, score + (score >= 80 ? 3 : score >= 60 ? 2 : 1)));
                    const risk = toRisk(score);
                    const traction = toTraction(idea);
                    return (
                      <tr key={idea.id}>
                        <td><strong>{idea.title || "-"}</strong></td>
                        <td>{idea.sector || "-"}</td>
                        <td><span style={{ color: traction.color }}>{traction.text}</span></td>
                        <td><span className={`badge ${risk.badge}`}>{score || "-"}</span></td>
                        <td>{projection.toFixed(1)}</td>
                        <td style={{ color: risk.color }}>{risk.label}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
function Propostas() {
  const ctx = useContext(AppContext);
  const currentUserId = Number(ctx?.currentUser?.id || 0);
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const ideas = await getMarketplaceIdeas();
        if (!mounted) return;
        const unique = new Map();
        for (const idea of ideas || []) {
          const uid = Number(idea.owner_user_id || 0);
          if (!uid || uid === currentUserId) continue;
          if (!unique.has(uid)) {
            unique.set(uid, {
              userId: uid,
              name: idea.owner_name || "Empreendedor",
              avatarUrl: idea.owner_avatar_url || null,
              role: "empreendedor",
              subtitle: `${idea.title || "Projeto"} • ${idea.sector || "Setor"}`,
            });
          }
        }
        setContacts(Array.from(unique.values()));
      } catch {
        if (!mounted) return;
        setContacts([]);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [currentUserId]);

  return (
    <ChatWindow
      title="Propostas"
      contacts={contacts}
      currentUserId={currentUserId}
      initialContact={ctx?.pendingChatTarget}
      onInitialContactConsumed={ctx?.clearPendingChatTarget}
      emptyText="Sem propostas disponíveis para conversa no momento."
    />
  );
}
function InvestidorPerfil() {
  const ctx = useContext(AppContext);
  const t = ctx?.t ?? (k => k);
  const user = ctx?.currentUser || null;
  const p = user?.profileData || {};
  const avatarInputRef = useRef(null);
  const [avatarHover, setAvatarHover] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
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

  const handleAvatarPickClick = () => {
    avatarInputRef.current?.click?.();
  };

  const handleAvatarFileChange = async (event) => {
    const file = event?.target?.files?.[0];
    if (!file) return;
    try {
      if (!/^image\/(jpeg|jpg|png|webp)$/i.test(file.type || "")) {
        throw new Error("Formato inválido. Use JPG, PNG ou WEBP.");
      }
      setUploadingAvatar(true);
      const avatarDataUrl = await compressImageToDataUrl(file, { maxWidth: 700, maxHeight: 700, quality: 0.8 });
      const resp = await updateMyProfile({ avatarDataUrl });
      if (resp?.user) {
        ctx?.applyAuthenticatedUser?.(resp.user);
      } else {
        ctx?.applyAuthenticatedUser?.({
          ...(user || {}),
          avatarUrl: avatarDataUrl,
        });
      }
      await ctx?.refreshCurrentUser?.();
      ctx?.setModal?.({
        open: true,
        title: "Foto atualizada",
        message: "A foto de perfil foi atualizada com sucesso.",
      });
    } catch (err) {
      ctx?.setModal?.({
        open: true,
        title: "Falha no upload",
        message: err?.message || "Não foi possível atualizar a foto de perfil.",
      });
    } finally {
      event.target.value = "";
      setUploadingAvatar(false);
    }
  };

  const submitProfileEdit = async () => {
    setSavingEdit(true);
    try {
      const resp = await updateMyProfile({ profileData: editForm });
      if (resp?.user) {
        ctx?.applyAuthenticatedUser?.(resp.user);
      } else {
        ctx?.applyAuthenticatedUser?.({
          ...(user || {}),
          verificationStatus: "pending",
          profileData: {
            ...(user?.profileData || {}),
            ...editForm,
          },
        });
      }
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
        
        <div className="profile-header-content">
          <div
            onMouseEnter={() => setAvatarHover(true)}
            onMouseLeave={() => setAvatarHover(false)}
            onClick={handleAvatarPickClick}
            className="profile-avatar-shell"
            title="Alterar foto de perfil"
          >
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt={user?.name || "Perfil"} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              String(user?.name || "I").charAt(0)
            )}
            <div style={{ position: "absolute", inset: 0, background: avatarHover ? "rgba(0,0,0,0.4)" : "transparent", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", fontWeight: 700, transition: "0.2s" }}>
              {avatarHover ? "+" : ""}
            </div>
            {uploadingAvatar ? (
              <div style={{ position: "absolute", bottom: 6, left: "50%", transform: "translateX(-50%)", fontSize: "0.72rem", background: "rgba(0,0,0,0.6)", color: "#fff", padding: "2px 6px", borderRadius: "6px" }}>
                A carregar...
              </div>
            ) : null}
          </div>
          <input ref={avatarInputRef} type="file" accept="image/png,image/jpeg,image/jpg,image/webp" onChange={handleAvatarFileChange} style={{ display: "none" }} />

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
      <div className="profile-main-grid">
        
        {/* COLUNA ESQUERDA */}
        <div className="profile-left-column">
          
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

          <div className="profile-contact-grid">
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
  const [expandedDocs, setExpandedDocs] = useState({});
  const apiBase = import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1";
  const apiOrigin = String(apiBase).replace(/\/api\/v1\/?$/i, "");
  const isPrimaryAdmin = ctx?.currentUser?.role === "admin" && (ctx?.currentUser?.adminCategory || "primary") === "primary";

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

  const handleVerification = async (targetUserId, targetRole, status) => {
    const saveKey = `${targetUserId}:${targetRole}`;
    setSavingUserId(saveKey);
    try {
      const updated = await updateAdminUserVerification(targetUserId, status, targetRole);
      setUsers((prev) => prev.map((u) => (
        Number(u.id) === Number(targetUserId) && u.role === targetRole ? updated : u
      )));
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
    if (role === "admin") return "Ativo";
    if (status === "approved") return "Aprovado";
    if (status === "rejected") return "Rejeitado";
    return "Pendente";
  };

  const canModerate = (u) => !!u?.profileExists && (u.role === "mentor" || u.role === "investidor" || u.role === "empreendedor");

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
      biFrontDoc: "Documento BI (frente)",
      bi_front_doc: "Documento BI (frente)",
      cvDoc: "Currículo (CV)",
      cv_doc: "Currículo (CV)",
      certificateDoc: "Certificado",
      certificate_doc: "Certificado",
      companyCertificateDoc: "Certidão da empresa",
      company_certificate_doc: "Certidão da empresa",
    };
    return labels[key] || key;
  };

  const isDocumentField = (key) => {
    const docFields = new Set([
      "biFrontDoc",
      "bi_front_doc",
      "cvDoc",
      "cv_doc",
      "certificateDoc",
      "certificate_doc",
      "companyCertificateDoc",
      "company_certificate_doc",
    ]);
    return docFields.has(key);
  };

  const resolveDocumentUrl = (value) => {
    const raw = String(value || "").trim();
    if (!raw) return "";
    if (/^(https?:\/\/|data:|blob:)/i.test(raw)) return raw;
    if (raw.startsWith("/")) return `${apiOrigin}${raw}`;
    return `${apiOrigin}/uploads/${encodeURIComponent(raw)}`;
  };

  const isRenderableDocumentUrl = (url) => /^(https?:\/\/|data:|blob:)/i.test(String(url || ""));

  const closeAbout = () => {
    setAboutUser(null);
    setExpandedDocs({});
  };

  const openAbout = (u) => {
    setAboutUser(u);
    setExpandedDocs({});
  };

  const handleContactUser = (u) => {
    if (!u?.id) return;
    ctx?.openChatConversation?.({
      userId: Number(u.id),
      name: u.name || "Utilizador",
      role: u.role || "utilizador",
      subtitle: u.email || "Sem e-mail",
    }, { pageId: "admin-mensagens" });
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
                <tr key={u.rowKey || `${u.id}:${u.role}`}>
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
                    {isPrimaryAdmin && u.role !== "admin" ? (
                      <button
                        className="btn btn-outline admin-users-btn"
                        type="button"
                        onClick={() => handleContactUser(u)}
                      >
                        Contactar
                      </button>
                    ) : null}
                    {canModerate(u) ? (
                      <>
                        <button
                          className="btn btn-primary admin-users-btn"
                          type="button"
                          disabled={savingUserId === `${u.id}:${u.role}` || u.verificationStatus === "approved"}
                          onClick={() => handleVerification(u.id, u.role, "approved")}
                        >
                          Aprovar
                        </button>
                        <button
                          className="btn btn-outline admin-users-btn"
                          type="button"
                          style={{ color: "red" }}
                          disabled={savingUserId === `${u.id}:${u.role}` || u.verificationStatus === "rejected"}
                          onClick={() => handleVerification(u.id, u.role, "rejected")}
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
      <div className="modal-overlay" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 9999, display: "flex", justifyContent: "center", alignItems: "center", padding: "12px" }} onClick={closeAbout}>
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
                  Object.entries(aboutUser.profile || {}).map(([k, v]) => {
                    const hasValue = !(v == null || v === "");
                    if (!isDocumentField(k)) {
                      return <div key={k}><strong>{profileFieldLabel(k)}:</strong> {hasValue ? String(v) : "-"}</div>;
                    }
                    if (!hasValue) {
                      return <div key={k}><strong>{profileFieldLabel(k)}:</strong> -</div>;
                    }

                    const docKey = `${aboutUser.id}:${aboutUser.role}:${k}`;
                    const isExpanded = !!expandedDocs[docKey];
                    const rawValue = String(v);
                    const docUrl = resolveDocumentUrl(rawValue);
                    const canRenderInline = isRenderableDocumentUrl(docUrl);
                    const clean = docUrl.toLowerCase().split("?")[0].split("#")[0];
                    const isImage = /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(clean);
                    const isPdf = /\.pdf$/i.test(clean);

                    return (
                      <div key={k} style={{ border: "1px solid var(--dm-border)", borderRadius: "10px", padding: "10px" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", flexWrap: "wrap" }}>
                          <div><strong>{profileFieldLabel(k)}:</strong> <span style={{ color: "var(--neutral-500)" }}>{rawValue.split("/").pop() || "Documento"}</span></div>
                          <button
                            className="btn btn-outline"
                            type="button"
                            style={{ width: "auto", padding: "6px 10px" }}
                            onClick={() => setExpandedDocs((prev) => ({ ...prev, [docKey]: !isExpanded }))}
                          >
                            {isExpanded ? "Fechar" : "Expandir"}
                          </button>
                        </div>

                        {isExpanded && (
                          <div style={{ marginTop: "10px", border: "1px solid var(--dm-border)", borderRadius: "8px", background: "var(--dm-bg)", padding: "8px" }}>
                            {!canRenderInline ? (
                              <div style={{ padding: "10px", fontSize: "0.9rem" }}>
                                Não foi possível gerar pré-visualização automática para este documento.
                                <div style={{ marginTop: "6px", color: "var(--neutral-500)" }}>
                                  Valor recebido: <code>{rawValue}</code>
                                </div>
                              </div>
                            ) : isImage ? (
                              <img
                                src={docUrl}
                                alt={profileFieldLabel(k)}
                                style={{ width: "100%", maxHeight: "420px", objectFit: "contain", borderRadius: "6px", display: "block" }}
                              />
                            ) : isPdf ? (
                              <iframe
                                src={docUrl}
                                title={profileFieldLabel(k)}
                                style={{ width: "100%", height: "420px", border: "none", borderRadius: "6px", background: "#fff" }}
                              />
                            ) : (
                              <>
                                <iframe
                                  src={docUrl}
                                  title={profileFieldLabel(k)}
                                  style={{ width: "100%", height: "420px", border: "none", borderRadius: "6px", background: "#fff" }}
                                />
                                <div style={{ marginTop: "8px", fontSize: "0.85rem", color: "var(--neutral-500)" }}>
                                  Se não visualizar corretamente, use o link direto abaixo.
                                </div>
                              </>
                            )}
                            <a href={docUrl} target="_blank" rel="noreferrer" style={{ display: "inline-block", marginTop: "8px" }}>
                              Abrir em nova aba
                            </a>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
          <div style={{ marginTop: "14px", display: "flex", justifyContent: "flex-end" }}>
            <button className="btn btn-primary" style={{ width: "auto" }} onClick={closeAbout}>Fechar</button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}

function Administradores() {
  const ctx = useContext(AppContext);
// Se a coluna admin_category ainda não existir na BD, adminCategory pode vir null.
// Nesse caso, por segurança assumimos que qualquer admin logado é "primary".
const currentAdminCategory = ctx?.currentUser?.adminCategory || "primary";
  const isPrimary = currentAdminCategory === "primary";

  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("adicionar");

  const [form, setForm] = useState({ name: "", email: "", password: "", adminCategory: "secondary" });
  const [saving, setSaving] = useState(false);
  const [removingId, setRemovingId] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const loadAdmins = async () => {
    setLoading(true);
    try {
      const data = await getAdminUsers();
      const onlyAdmins = (data || []).filter((u) => u.role === "admin");
      setAdmins(onlyAdmins);
    } catch (err) {
      ctx?.setModal?.({ open: true, message: `Falha ao carregar administradores: ${err.message}` });
      setAdmins([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdmins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const categoryLabel = (cat) => {
    if (cat === "primary") return "Administrador Principal";
    if (cat === "secondary") return "Administrador Secundário";
    return "Categoria desconhecida";
  };

  const categoryBadgeClass = (cat) => (cat === "primary" ? "badge-primary" : cat === "secondary" ? "badge-info" : "badge-warning");

  const handleAddAdmin = async () => {
    if (!isPrimary) return;
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      ctx?.setModal?.({ open: true, message: "Preencha Nome, Email e Senha do novo admin." });
      return;
    }
    setSaving(true);
    try {
      const res = await createAdmin(form);
      setForm({ name: "", email: "", password: "", adminCategory: "secondary" });
      setActiveTab("ver");
      await loadAdmins();
      if (res?.adminCategorySet === false) {
        ctx?.setModal?.({
          open: true,
          message: "Admin criado, mas não foi possível guardar o tipo (a coluna admin_category ainda pode não existir na BD).",
        });
      } else {
        ctx?.setModal?.({ open: true, message: "Admin criado com sucesso." });
      }
    } catch (err) {
      ctx?.setModal?.({ open: true, message: err?.message || "Falha ao criar administrador." });
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveAdmin = async (adminId) => {
    if (!isPrimary) return;
    setRemovingId(Number(adminId));
    try {
      await removeSecondaryAdmin(adminId);
      await loadAdmins();
      ctx?.setModal?.({ open: true, message: "Administrador secundário removido com sucesso." });
    } catch (err) {
      ctx?.setModal?.({ open: true, message: err?.message || "Falha ao remover administrador." });
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div style={{ padding: "10px" }}>
      <div className="dashboard-card" style={{ marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
        <div>
          <h2 className="dashboard-card-title">Administradores</h2>
          <p className="dashboard-card-description">Gerencie administradores principais e secundários.</p>
        </div>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
          <span className={`badge ${categoryBadgeClass(currentAdminCategory)}`}>{categoryLabel(currentAdminCategory)}</span>
          <button className={activeTab === "adicionar" ? "btn btn-primary" : "btn btn-outline"} style={{ width: "auto" }} onClick={() => setActiveTab("adicionar")}>Adicionar</button>
          <button className={activeTab === "ver" ? "btn btn-primary" : "btn btn-outline"} style={{ width: "auto" }} onClick={() => setActiveTab("ver")}>Ver admins</button>
        </div>
      </div>

      {activeTab === "adicionar" && (
        <div className="dashboard-card" style={{ marginBottom: "16px" }}>
          <h3 className="dashboard-card-title" style={{ fontSize: "1.1rem" }}>Adicionar administrador</h3>
          <p className="dashboard-card-description">Escolhe o tipo de admin. Apenas o Administrador Principal pode adicionar.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px", marginTop: "14px" }}>
            <div>
              <label className="form-label">Nome</label>
              <input className="form-input" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="Ex: Nome Completo" />
            </div>
            <div>
              <label className="form-label">Email</label>
              <input className="form-input" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} placeholder="ex: nomecompleto@gmail.com" />
            </div>
            <div>
              <label className="form-label">Tipo de admin</label>
              <select
                className="form-input"
                value={form.adminCategory}
                onChange={(e) => setForm((p) => ({ ...p, adminCategory: e.target.value }))}
              >
                <option value="primary">Administrador Principal</option>
                <option value="secondary">Administrador Secundário</option>
              </select>
            </div>
            <div>
              <label className="form-label">Senha</label>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <input
                  className="form-input"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                  placeholder="••••••••"
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  className="btn btn-outline"
                  style={{ width: "auto", padding: "6px 10px" }}
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? "Ocultar" : "Mostrar"}
                </button>
              </div>
            </div>
          </div>
          <div style={{ marginTop: "16px", display: "flex", justifyContent: "flex-end" }}>
            <button className="btn btn-primary" onClick={handleAddAdmin} disabled={!isPrimary || saving}>
              {saving ? "A criar..." : "Criar admin secundário"}
            </button>
          </div>
          {!isPrimary && (
            <div style={{ marginTop: "12px", color: "var(--neutral-500)", fontSize: "0.9rem" }}>
              O teu perfil é secundário. Não podes adicionar administradores.
            </div>
          )}
        </div>
      )}

      <div className="dashboard-card">
        <h3 className="dashboard-card-title" style={{ fontSize: "1.1rem" }}>Lista de administradores</h3>
        {loading ? (
          <p>A carregar administradores...</p>
        ) : admins.length === 0 ? (
          <p>Sem administradores encontrados.</p>
        ) : (
          <div style={{ overflowX: "auto", marginTop: "12px" }}>
            <table className="data-table" style={{ minWidth: "680px" }}>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Categoria</th>
                  <th>Email</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((a) => {
                  const isSecondary = (a.adminCategory || "secondary") === "secondary";
                  return (
                    <tr key={a.id}>
                      <td><strong>{a.name}</strong></td>
                      <td><span className={`badge ${categoryBadgeClass(a.adminCategory || "secondary")}`}>{categoryLabel(a.adminCategory || "secondary")}</span></td>
                      <td>{a.email}</td>
                      <td>
                        {isSecondary && isPrimary && (
                          <button
                            className="btn btn-outline"
                            style={{ width: "auto", padding: "6px 10px" }}
                            disabled={removingId === Number(a.id)}
                            onClick={() => handleRemoveAdmin(a.id)}
                          >
                            {removingId === Number(a.id) ? "A remover..." : "Remover"}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function Ideias() {
  const ctx = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [ideas, setIdeas] = useState([]);
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [savingIdeaDecisionId, setSavingIdeaDecisionId] = useState(0);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const allIdeas = await getAdminIdeas();
        setIdeas(allIdeas || []);
      } catch (err) {
        ctx?.setModal?.({ open: true, message: `Falha ao carregar ideias do sistema: ${err.message}` });
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

  const scoreBand = (score) => {
    const n = Number(score || 0);
    if (n >= 80) return "high";
    if (n >= 50) return "mid";
    return "low";
  };

  const handleIdeaDecision = async (idea, decision) => {
    const approvalStatus = decision === "approve" ? "approved" : "rejected";
    setSavingIdeaDecisionId(Number(idea.id));
    try {
      const updated = await updateIdeaApproval(idea.id, approvalStatus);
      setIdeas((prev) => prev.map((i) => (Number(i.id) === Number(idea.id) ? { ...i, ...updated } : i)));
      if (selectedIdea && Number(selectedIdea.id) === Number(idea.id)) {
        setSelectedIdea((prev) => ({ ...prev, ...updated }));
      }
      ctx?.setModal?.({
        open: true,
        message: decision === "approve"
          ? "Ideia aprovada pela AngoStart. O empreendedor já pode publicar no marketplace."
          : "Ideia rejeitada pela AngoStart.",
      });
    } catch (err) {
      ctx?.setModal?.({ open: true, message: err.message || "Falha ao atualizar status da ideia." });
    } finally {
      setSavingIdeaDecisionId(0);
    }
  };

  return (<>
    <div className="dashboard-card">
      <div className="dashboard-card-header">
        <h3 className="dashboard-card-title">Ideias dos Utilizadores</h3>
        <p className="dashboard-card-description">Todas as ideias registadas na plataforma</p>
      </div>
      {loading ? (
        <p>A carregar ideias...</p>
      ) : ideas.length === 0 ? (
        <p>Não há ideias registadas no momento.</p>
      ) : (
      <div style={{ width: "100%", overflowX: "auto" }}>
      <table className="data-table" style={{ minWidth: "760px" }}>
        <thead>
          <tr>
            <th>Ideia</th>
            <th>Empreendedor</th>
            <th>Score IA</th>
            <th>Status</th>
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
              <td><span className="badge badge-info">{idea.status || "-"}</span></td>
              <td>{formatDate(idea.created_at)}</td>
              <td>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  <button
                    className="btn btn-primary"
                    style={{padding: '0.5rem 1rem', fontSize: '0.875rem', width: 'auto'}}
                    onClick={() => openIdeaReview(idea.id)}
                    disabled={loadingDetails}
                  >
                    {loadingDetails ? "A carregar..." : "Revisar"}
                  </button>
                  {(String(idea.approval_status || "pending") !== "approved") ? (
                    <button
                      className="btn btn-outline"
                      style={{ padding: "0.5rem 1rem", fontSize: "0.875rem", width: "auto", opacity: savingIdeaDecisionId === Number(idea.id) ? 0.6 : 1 }}
                      onClick={() => handleIdeaDecision(idea, "approve")}
                      disabled={savingIdeaDecisionId === Number(idea.id)}
                    >
                      Aprovar
                    </button>
                  ) : null}
                  {(String(idea.approval_status || "pending") !== "rejected") ? (
                    <button
                      className="btn-logout"
                      style={{ padding: "0.5rem 1rem", fontSize: "0.875rem", width: "auto", opacity: savingIdeaDecisionId === Number(idea.id) ? 0.6 : 1 }}
                      onClick={() => handleIdeaDecision(idea, "reject")}
                      disabled={savingIdeaDecisionId === Number(idea.id)}
                    >
                      Rejeitar
                    </button>
                  ) : null}
                </div>
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
              <div className="dashboard-card"><strong>Aprovação AngoStart</strong><div>{selectedIdea.approval_status || "pending"}</div></div>
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

function formatDateTime(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString("pt-PT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function mentorStatusLabel(status) {
  if (status === "accepted") return "Aceite";
  if (status === "rejected") return "Rejeitada";
  if (status === "completed") return "Concluída";
  return "Pendente";
}

function mentorStatusBadgeClass(status) {
  if (status === "accepted") return "badge-success";
  if (status === "rejected") return "badge-warning";
  if (status === "completed") return "badge-primary";
  return "badge-info";
}

function useMentorRequestsData() {
  const ctx = useContext(AppContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState(null);

  const loadRequests = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getMentorMentorshipRequests();
      setRequests(data || []);
      await ctx?.refreshNavBadges?.();
    } catch (err) {
      setRequests([]);
      setError(err.message || "Falha ao carregar solicitações.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const updateRequest = useCallback(async (requestId, payload) => {
    setSavingId(Number(requestId));
    try {
      const updated = await updateMentorMentorshipRequest(requestId, payload);
      setRequests((prev) => prev.map((r) => (Number(r.id) === Number(requestId) ? updated : r)));
      await ctx?.refreshNavBadges?.();
      ctx?.setModal?.({
        open: true,
        title: "Solicitação atualizada",
        message: `Status alterado para ${mentorStatusLabel(updated?.status)}.`,
      });
    } catch (err) {
      ctx?.setModal?.({
        open: true,
        title: "Falha ao atualizar",
        message: err.message || "Não foi possível atualizar a solicitação.",
      });
    } finally {
      setSavingId(null);
    }
  }, [ctx]);

  return { requests, loading, error, loadRequests, updateRequest, savingId };
}

function MentorDashboardDynamic() {
  const { requests, loading, error, loadRequests } = useMentorRequestsData();
  const pending = requests.filter((r) => r.status === "pending");
  const accepted = requests.filter((r) => r.status === "accepted");
  const completed = requests.filter((r) => r.status === "completed");
  const rejected = requests.filter((r) => r.status === "rejected");
  const mentoradosAtivos = new Set(
    accepted.concat(completed).map((r) => r.entrepreneurUserId).filter(Boolean)
  ).size;
  const horasMentoria = Math.round(
    completed.reduce((sum, r) => sum + Number(r.durationMinutes || 0), 0) / 60
  );
  const proximas = [...accepted]
    .sort((a, b) => new Date(a.scheduledFor || a.preferredDatetime) - new Date(b.scheduledFor || b.preferredDatetime))
    .slice(0, 8);

  return (
    <>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-content">
            <div className="stat-info">
              <div className="stat-label">Mentorados Ativos</div>
              <div className="stat-value">{mentoradosAtivos}</div>
              <div className="stat-change">Empreendedores com sessões ativas</div>
            </div>
            <div className="stat-icon-wrapper stat-icon-primary">{icons.users}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-content">
            <div className="stat-info">
              <div className="stat-label">Solicitações Pendentes</div>
              <div className="stat-value">{pending.length}</div>
              <div className="stat-change">Aguardam decisão do mentor</div>
            </div>
            <div className="stat-icon-wrapper stat-icon-warning">{icons.inbox}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-content">
            <div className="stat-info">
              <div className="stat-label">Sessões Concluídas</div>
              <div className="stat-value">{completed.length}</div>
              <div className="stat-change">Total concluído pelo mentor</div>
            </div>
            <div className="stat-icon-wrapper stat-icon-success">{icons["check-circle"]}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-content">
            <div className="stat-info">
              <div className="stat-label">Horas de Mentoria</div>
              <div className="stat-value">{horasMentoria}</div>
              <div className="stat-change">Baseado em sessões concluídas</div>
            </div>
            <div className="stat-icon-wrapper stat-icon-secondary">{icons.clock}</div>
          </div>
        </div>
      </div>

      <div className="dashboard-card">
        <div className="dashboard-card-header" style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
          <div>
            <h3 className="dashboard-card-title">Próximas Sessões</h3>
            <p className="dashboard-card-description">Sessões aceites e agendadas no banco de dados.</p>
          </div>
          <button className="btn btn-outline" style={{ width: "auto" }} onClick={loadRequests} disabled={loading}>
            Atualizar
          </button>
        </div>
        {loading ? (
          <p>A carregar sessões...</p>
        ) : error ? (
          <p style={{ color: "var(--error-500)" }}>{error}</p>
        ) : proximas.length === 0 ? (
          <p>Sem sessões aceites até ao momento.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Empreendedor</th>
                <th>Tópico</th>
                <th>Data & Hora</th>
                <th>Duração</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {proximas.map((s) => (
                <tr key={s.id}>
                  <td>{s?.entrepreneur?.name || "-"}</td>
                  <td>{s.topic}</td>
                  <td>{formatDateTime(s.scheduledFor || s.preferredDatetime)}</td>
                  <td>{s.durationMinutes} min</td>
                  <td>
                    <span className={`badge ${mentorStatusBadgeClass(s.status)}`}>{mentorStatusLabel(s.status)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && (
          <div style={{ marginTop: "10px", fontSize: "0.85rem", color: "var(--neutral-500)" }}>
            Rejeitadas: {rejected.length} • Aceites: {accepted.length} • Concluídas: {completed.length}
          </div>
        )}
      </div>
    </>
  );
}

function MentorSessoesDynamic() {
  const { requests, loading, error, loadRequests, updateRequest, savingId } = useMentorRequestsData();
  const pendentes = requests.filter((r) => r.status === "pending");
  const [localState, setLocalState] = useState({});

  const updateLocal = (id, patch) => {
    setLocalState((prev) => ({ ...prev, [id]: { ...(prev[id] || {}), ...patch } }));
  };

  const sendDecision = async (req, status) => {
    const local = localState[req.id] || {};
    await updateRequest(req.id, {
      status,
      mentorNotes: local.mentorNotes || "",
      scheduledFor: status === "accepted" ? (local.scheduledFor || req.scheduledFor || req.preferredDatetime) : "",
    });
  };

  return (
    <div style={{ padding: "10px" }}>
      <div className="dashboard-card" style={{ marginBottom: "16px", display: "flex", justifyContent: "space-between", gap: "10px", flexWrap: "wrap" }}>
        <div>
          <h2 className="dashboard-card-title">Solicitações de Mentoria</h2>
          <p className="dashboard-card-description">Empreendedores aguardando aceitação/rejeição da mentoria.</p>
        </div>
        <button className="btn btn-outline" style={{ width: "auto" }} onClick={loadRequests} disabled={loading}>
          Atualizar
        </button>
      </div>
      {loading ? (
        <p>A carregar solicitações...</p>
      ) : error ? (
        <p style={{ color: "var(--error-500)" }}>{error}</p>
      ) : pendentes.length === 0 ? (
        <div className="dashboard-card">
          <p>Sem solicitações pendentes.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {pendentes.map((req) => {
            const local = localState[req.id] || {};
            return (
              <div key={req.id} className="dashboard-card">
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "10px" }}>
                  <Info label="Empreendedor" value={req?.entrepreneur?.name || "-"} />
                  <Info label="Projeto" value={req.ideaTitle || req?.entrepreneur?.businessName || "-"} />
                  <Info label="Setor" value={req?.entrepreneur?.businessSector || "-"} />
                  <Info label="Tópico" value={req.topic} />
                  <Info label="Preferência de data/hora" value={formatDateTime(req.preferredDatetime)} />
                  <Info label="Duração" value={`${req.durationMinutes} min`} />
                  <Info label="Pagamento" value={req.paymentMethod} />
                  <Info label="Valor" value={`${Number(req.priceKz || 0).toLocaleString("pt-PT")} Kz`} />
                </div>
                <div style={{ marginTop: "8px", color: "var(--neutral-600)", fontSize: "0.9rem" }}>
                  <strong>Observações do empreendedor:</strong> {req.entrepreneurNotes || "Sem observações."}
                </div>
                <div style={{ marginTop: "10px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "10px" }}>
                  <div>
                    <label className="form-label">Data/hora confirmada</label>
                    <input
                      className="form-input"
                      type="datetime-local"
                      value={local.scheduledFor || ""}
                      onChange={(e) => updateLocal(req.id, { scheduledFor: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="form-label">Notas do mentor</label>
                    <textarea
                      className="form-input"
                      rows={2}
                      value={local.mentorNotes || ""}
                      onChange={(e) => updateLocal(req.id, { mentorNotes: e.target.value })}
                    />
                  </div>
                </div>
                <div style={{ marginTop: "10px", display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                  <button
                    className="btn btn-outline"
                    style={{ width: "auto", color: "var(--error-500)" }}
                    onClick={() => sendDecision(req, "rejected")}
                    disabled={savingId === Number(req.id)}
                  >
                    Rejeitar
                  </button>
                  <button
                    className="btn btn-primary"
                    style={{ width: "auto" }}
                    onClick={() => sendDecision(req, "accepted")}
                    disabled={savingId === Number(req.id)}
                  >
                    {savingId === Number(req.id) ? "A guardar..." : "Aceitar mentoria"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function MentoradosDynamic() {
  const { requests, loading, error } = useMentorRequestsData();
  const acceptedOrCompleted = requests.filter((r) => r.status === "accepted" || r.status === "completed");
  const grouped = Array.from(
    acceptedOrCompleted.reduce((acc, item) => {
      const key = String(item.entrepreneurUserId);
      if (!acc.has(key)) acc.set(key, []);
      acc.get(key).push(item);
      return acc;
    }, new Map()).entries()
  );

  return (
    <div style={{ padding: "10px" }}>
      <div className="dashboard-card" style={{ marginBottom: "16px" }}>
        <h2 className="dashboard-card-title">Mentorados</h2>
        <p className="dashboard-card-description">Empreendedores com sessões aceites ou concluídas.</p>
      </div>
      {loading ? (
        <p>A carregar mentorados...</p>
      ) : error ? (
        <p style={{ color: "var(--error-500)" }}>{error}</p>
      ) : grouped.length === 0 ? (
        <div className="dashboard-card"><p>Sem mentorados ativos no momento.</p></div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {grouped.map(([entrepreneurId, items]) => {
            const first = items[0];
            const entrepreneur = first?.entrepreneur || {};
            return (
              <div key={entrepreneurId} className="dashboard-card">
                <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap", alignItems: "flex-start" }}>
                  <div>
                    <h4 style={{ marginTop: 0 }}>{entrepreneur?.name || "Empreendedor"}</h4>
                <div style={{ fontSize: "0.9rem", color: "var(--neutral-600)" }}>
                    {entrepreneur?.email || "-"} • Negócio: {entrepreneur?.businessName || "-"}
                </div>
                  </div>
                  <button
                    className="btn btn-outline"
                    style={{ width: "auto", padding: "8px 12px", height: "fit-content" }}
                    onClick={() =>
                      ctx?.openChatConversation?.(
                        {
                          userId: Number(entrepreneurId),
                          name: entrepreneur?.name || "Empreendedor",
                          avatarUrl: entrepreneur?.avatarUrl || null,
                          role: "empreendedor",
                          subtitle: entrepreneur?.businessName ? `Negócio: ${entrepreneur.businessName}` : "Empreendedor",
                        },
                        { pageId: "mensagens" }
                      )
                    }
                    disabled={!Number(entrepreneurId)}
                  >
                    Contactar
                  </button>
                </div>
                <div style={{ marginTop: "8px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "8px" }}>
                  <Info label="Total de sessões" value={items.length} />
                  <Info label="Concluídas" value={items.filter((x) => x.status === "completed").length} />
                  <Info label="Aceites" value={items.filter((x) => x.status === "accepted").length} />
                  <Info label="Última atualização" value={formatDateTime(items[0]?.updatedAt)} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function AgendaMentorDynamic() {
  const { requests, loading, error, updateRequest, savingId } = useMentorRequestsData();
  const upcoming = requests
    .filter((r) => r.status === "accepted")
    .sort((a, b) => new Date(a.scheduledFor || a.preferredDatetime) - new Date(b.scheduledFor || b.preferredDatetime));

  return (
    <div style={{ padding: "10px" }}>
      <div className="dashboard-card" style={{ marginBottom: "16px" }}>
        <h2 className="dashboard-card-title">Agenda de Mentoria</h2>
        <p className="dashboard-card-description">Sessões aceites com opção de marcar como concluída.</p>
      </div>
      {loading ? (
        <p>A carregar agenda...</p>
      ) : error ? (
        <p style={{ color: "var(--error-500)" }}>{error}</p>
      ) : upcoming.length === 0 ? (
        <div className="dashboard-card"><p>Sem sessões agendadas.</p></div>
      ) : (
        <div className="dashboard-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Data/Hora</th>
                <th>Empreendedor</th>
                <th>Tópico</th>
                <th>Duração</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {upcoming.map((req) => (
                <tr key={req.id}>
                  <td>{formatDateTime(req.scheduledFor || req.preferredDatetime)}</td>
                  <td>{req?.entrepreneur?.name || "-"}</td>
                  <td>{req.topic}</td>
                  <td>{req.durationMinutes} min</td>
                  <td>
                    <button
                      className="btn btn-primary"
                      style={{ width: "auto", padding: "6px 12px" }}
                      onClick={() => updateRequest(req.id, { status: "completed", mentorNotes: req.mentorNotes || "", scheduledFor: req.scheduledFor || req.preferredDatetime })}
                      disabled={savingId === Number(req.id)}
                    >
                      Concluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function MensagensMentorDynamic() {
  const ctx = useContext(AppContext);
  const { requests } = useMentorRequestsData();
  const currentUserId = Number(ctx?.currentUser?.id || 0);
  const allowedUserIds = useMemo(
    () => (requests || [])
      .filter((r) => r.status === "accepted")
      .map((r) => Number(r.entrepreneurUserId))
      .filter(Boolean),
    [requests]
  );
  const contacts = useMemo(() => {
    const map = new Map();
    for (const req of requests || []) {
      const uid = Number(req.entrepreneurUserId || 0);
      if (!uid) continue;
      if (!map.has(uid)) {
        map.set(uid, {
          userId: uid,
          name: req?.entrepreneur?.name || "Empreendedor",
          avatarUrl: req?.entrepreneur?.avatarUrl || null,
          role: "empreendedor",
          subtitle: `${mentorStatusLabel(req.status)} • ${req.topic || "Mentoria"}`,
        });
      }
    }
    return Array.from(map.values());
  }, [requests]);

  return (
    <ChatWindow
      title="Mensagens"
      contacts={contacts}
      currentUserId={currentUserId}
      allowedUserIds={allowedUserIds}
      emptyText="Sem mentorias aceites para conversar no momento."
      currentUserRole={String(ctx?.currentUser?.role || "")}
      currentUserAdminCategory={String(ctx?.currentUser?.adminCategory || "")}
    />
  );
}

function MensagensEmpreendedorLegacy() {
  const ctx = useContext(AppContext);
  const currentUserId = Number(ctx?.currentUser?.id || 0);
  const [requests, setRequests] = useState([]);
  const [investors, setInvestors] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [mentorshipData, investorData] = await Promise.all([
          getMyMentorshipRequests(),
          getAvailableInvestors().catch(() => []),
        ]);
        if (!mounted) return;
        setRequests(mentorshipData || []);
        setInvestors(investorData || []);
      } catch {
        if (!mounted) return;
        setRequests([]);
        setInvestors([]);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const contacts = useMemo(() => {
    const map = new Map();
    for (const req of requests || []) {
      const uid = Number(req.mentorUserId || 0);
      if (!uid) continue;
      if (!map.has(uid)) {
        map.set(uid, {
          userId: uid,
          name: req?.mentor?.name || "Mentor",
          avatarUrl: req?.mentor?.avatarUrl || null,
          role: "mentor",
          subtitle: `${mentorStatusLabel(req.status)} • ${req.topic || "Mentoria"}`,
        });
      }
    }
    return Array.from(map.values());
  }, [requests]);

  const investorContacts = useMemo(() => {
    const map = new Map();
    for (const inv of investors || []) {
      const uid = Number(inv?.id || 0);
      if (!uid || uid === currentUserId) continue;
      if (!map.has(uid)) {
        map.set(uid, {
          userId: uid,
          name: inv?.name || "Investidor",
          avatarUrl: inv?.avatarUrl || null,
          role: "investidor",
          subtitle: inv?.profile?.investmentExperienceArea || "Investidor da plataforma",
        });
      }
    }
    return Array.from(map.values());
  }, [investors, currentUserId]);

  const allContacts = useMemo(() => {
    const unique = new Map();
    for (const c of [...investorContacts, ...contacts]) {
      const uid = Number(c.userId || 0);
      if (!uid) continue;
      if (!unique.has(uid)) unique.set(uid, c);
    }
    return Array.from(unique.values());
  }, [investorContacts, contacts]);

  const allowedUserIds = useMemo(
    () => (requests || [])
      .filter((r) => r.status === "accepted")
      .map((r) => Number(r.mentorUserId))
      .filter(Boolean),
    [requests]
  );

  return (
    <ChatWindow
      title="Mensagens"
      contacts={allContacts}
      currentUserId={currentUserId}
      allowedUserIds={[...allowedUserIds, ...allContacts.map((c) => Number(c.userId)).filter(Boolean)]}
      initialContact={ctx?.pendingChatTarget}
      onInitialContactConsumed={ctx?.clearPendingChatTarget}
      emptyText="Sem contactos disponíveis para conversa no momento."
      currentUserRole={String(ctx?.currentUser?.role || "")}
      currentUserAdminCategory={String(ctx?.currentUser?.adminCategory || "")}
    />
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
    arquivos: [],
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
  const [avisoQuestionario, setAvisoQuestionario] = useState("");

  const [dados, setDados] = useState(initialDados);

  useEffect(() => {
    const raw = localStorage.getItem("angostart_idea_edit_draft");
    if (!raw) return;
    try {
      const draft = JSON.parse(raw);
      if (draft && typeof draft === "object") {
        setDados((prev) => ({ ...prev, ...draft }));
        setEtapa(1);
        localStorage.removeItem("angostart_idea_edit_draft");
        ctx?.setModal?.({
          open: true,
          message: "Rascunho da ideia carregado. Edite os dados e envie para nova análise da IA.",
        });
      }
    } catch {
      localStorage.removeItem("angostart_idea_edit_draft");
    }
  }, []);

  const proximaEtapa = () => {
    if (etapa === 1) {
      const nome = String(dados.nome || "").trim();
      const descricao = String(dados.descricao || "").trim();
      const setor = String(dados.setor || "").trim();
      if (!nome || nome.length < 2) {
        ctx?.setModal?.({ open: true, message: "Preencha o nome do projeto (mínimo 2 caracteres)." });
        return;
      }
      if (!setor) {
        ctx?.setModal?.({ open: true, message: "Selecione o setor de atuação." });
        return;
      }
      if (!descricao || descricao.length < 10) {
        ctx?.setModal?.({ open: true, message: "A descrição curta deve ter pelo menos 10 caracteres." });
        return;
      }
    }
    if (etapa === 2) {
      if (!String(dados.cidade || "").trim() || !String(dados.regiao || "").trim()) {
        ctx?.setModal?.({ open: true, message: "Preencha cidade e região/província para continuar." });
        return;
      }
    }
    if (etapa === 3) {
      const capital = Number(dados.capital || 0);
      if (!Number.isFinite(capital) || capital <= 0) {
        ctx?.setModal?.({ open: true, message: "Informe o capital inicial (Kz) maior que zero." });
        return;
      }
    }
    if (etapa === 4) {
      if (!String(dados.problema || "").trim() || !String(dados.diferencial || "").trim() || !String(dados.publico || "").trim()) {
        ctx?.setModal?.({ open: true, message: "Preencha problema, diferencial e público-alvo antes de avançar." });
        return;
      }
      // Perguntas adicionais são opcionais: ao avançar daqui, vai direto para uploads.
      setEtapa(6);
      return;
    }
    if (etapa === 6) {
      if (!Array.isArray(dados.arquivos) || dados.arquivos.length === 0) {
        ctx?.setModal?.({ open: true, message: "Adicione pelo menos um arquivo sobre a ideia para continuar." });
        return;
      }
    }
    setEtapa(etapa + 1);
  };
  const etapaAnterior = () => {
    if (etapa === 6 && questionarioPerguntas.length === 0) {
      setEtapa(4);
      return;
    }
    setEtapa(etapa - 1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDados({ ...dados, [name]: value });
  };

  const handleArquivosChange = (e) => {
    const files = Array.from(e.target.files || []);
    setDados((prev) => ({ ...prev, arquivos: files }));
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
    setAvisoQuestionario("");
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
    const nome = String(dados.nome || "").trim();
    const descricao = String(dados.descricao || "").trim();
    const setor = String(dados.setor || "").trim();
    const cidade = String(dados.cidade || "").trim();
    const regiao = String(dados.regiao || "").trim();

    if (!nome || !descricao || !setor || !cidade || !regiao) {
      ctx?.setModal?.({ open: true, message: "Preencha os campos obrigatórios das fases anteriores antes de submeter." });
      return;
    }
    if (nome.length < 2) {
      ctx?.setModal?.({ open: true, message: "O nome do projeto deve ter pelo menos 2 caracteres." });
      return;
    }
    if (descricao.length < 10) {
      ctx?.setModal?.({ open: true, message: "A descrição curta deve ter pelo menos 10 caracteres." });
      return;
    }

    const lat = Number(dados.lat || 0);
    const lng = Number(dados.lng || 0);
    const payload = {
      title: nome,
      description: descricao,
      sector: setor || "Geral",
      city: cidade,
      address: dados.localizacao,
      region: regiao,
      latitude: lat,
      longitude: lng,
      initialCapital: Number(dados.capital || 0),
      problem: String(dados.problema || "").trim(),
      differentialText: String(dados.diferencial || "").trim(),
      targetAudience: String(dados.publico || "").trim(),
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
        try {
          await saveQuestionnaireAnswers(activeSessionId, questionarioRespostas);
        } catch (err) {
          if (!isPlanFeatureBlocked(err)) {
            // Não bloquear fluxo principal caso a ideia já esteja no banco.
            setMensagemFluxo(`Ideia submetida. Não foi possível guardar respostas do questionário: ${err.message}`);
          }
        }
      }

      let report = null;
      try {
        report = await executarAnaliseViabilidade(Number(createdIdea?.id) || undefined, activeSessionId || undefined);
      } catch (err) {
        if (isPlanFeatureBlocked(err)) {
          analiseIndisponivel = true;
          setEtapa(1);
        } else {
          throw err;
        }
      }

      if (report && Number(createdIdea?.id)) {
        const score = Number(report.score || 0);
        if (score < 50) {
          try {
            await updateIdeaStatus(Number(createdIdea.id), "archived");
            setMensagemFluxo(
              "Ideia analisada com score baixo (0-49) e marcada como rejeitada automaticamente. Melhore os dados da ideia e submeta novamente para nova análise."
            );
          } catch (err) {
            setMensagemFluxo(`Ideia analisada, mas não foi possível atualizar status automático: ${err.message}`);
          }
        }
      }

      if (!analiseIndisponivel) {
        setEtapa(8);
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
      const msg = String(err?.message || "");
      const isValidationError =
        msg.includes("Too small") ||
        msg.includes("Invalid") ||
        msg.includes("Payload inválido");

      if (isValidationError) {
        ctx?.setModal?.({
          open: true,
          message: `Não foi possível submeter para a API: ${msg}. Corrija os campos obrigatórios e tente novamente.`,
        });
      } else {
        salvarRascunhoLocal();
        ctx?.setModal?.({
          open: true,
          message: `Não foi possível completar o fluxo na API (${msg}). O rascunho foi salvo localmente.`,
        });
      }
    } finally {
      setAnalisando(false);
    }
  };

  const gerarQuestionarioIA = async (avancarParaPerguntas = false) => {
    if (questionarioSessionId && questionarioPerguntas.length > 0) {
      if (avancarParaPerguntas) setEtapa(5);
      return;
    }
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
      setAvisoQuestionario("Questionário IA gerado com sucesso. Pode responder as perguntas adicionais.");
      if (avancarParaPerguntas) {
        setEtapa(5);
      }
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
      setAvisoQuestionario("Respostas do questionário guardadas com sucesso.");
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
        report.analysisSource === "google_generative_ai" || report.analysisSource === "google_ai_studio"
          ? "Google Generative AI (Gemini 1.5 Flash)"
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
    return report;
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
      <h3 className="dashboard-card-title">Fase 4: Contexto para IA</h3>
      <div className="form-group">
        <label className="form-label">Qual problema específico o seu produto resolve?</label>
        <textarea className="form-input" name="problema" value={dados.problema} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label className="form-label">Como sua solução é diferente das existentes?</label>
        <textarea className="form-input" name="diferencial" value={dados.diferencial} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label className="form-label">Quem é o seu público-alvo principal?</label>
        <textarea className="form-input" name="publico" value={dados.publico} onChange={handleChange} />
      </div>
      <div className="dashboard-card" style={{ background: "var(--neutral-50)", fontSize: "0.9rem" }}>
        <p style={{ margin: 0 }}>
          Com estes dados, a IA vai identificar pontos pouco claros e criar perguntas adicionais para melhorar a análise de viabilidade.
        </p>
      </div>
      {avisoQuestionario ? (
        <div className="dashboard-card" style={{ background: "var(--success-100)", border: "1px solid var(--success-500)" }}>
          <p style={{ margin: 0, color: "var(--success-500)" }}>{avisoQuestionario}</p>
        </div>
      ) : null}
      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        <button type="button" className="btn btn-primary" onClick={() => gerarQuestionarioIA(true)} disabled={gerandoQuestionario}>
          {gerandoQuestionario ? "Gerando..." : "Perguntas adicionais (opcional)"}
        </button>
        <button type="button" className="btn btn-outline" onClick={() => setEtapa(5)} disabled={!questionarioSessionId}>
          Ver perguntas geradas
        </button>
      </div>
    </div>
  );

  const renderFase5 = () => (
    <div className="auth-form">
      <h3 className="dashboard-card-title">Fase 5: Perguntas adicionais da IA (Opcional)</h3>
      <p style={{ margin: 0, color: "var(--neutral-600)", fontSize: "0.9rem" }}>
        Responda este questionário para melhorar a precisão da análise de viabilidade.
      </p>
      {avisoQuestionario ? (
        <div className="dashboard-card" style={{ background: "var(--success-100)", border: "1px solid var(--success-500)" }}>
          <p style={{ margin: 0, color: "var(--success-500)" }}>{avisoQuestionario}</p>
        </div>
      ) : null}
      {questionarioPerguntas.length > 0 ? (
        <div className="dashboard-card" style={{ marginTop: "8px", background: "var(--neutral-50)" }}>
          <h4 style={{ marginBottom: "12px" }}>Questionário Gerado</h4>
          {questionarioPerguntas.map((q, idx) => (
            <div key={q.key} className="form-group" style={{ marginBottom: "12px" }}>
              <label className="form-label">
                {idx + 1}. {q.label} {q.required ? <span style={{ color: "var(--error-500)" }}>*</span> : null}
              </label>
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
                  style={{ minHeight: "90px" }}
                  value={questionarioRespostas[q.key] || ""}
                  onChange={(e) =>
                    setQuestionarioRespostas((prev) => ({ ...prev, [q.key]: e.target.value }))
                  }
                />
              )}
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
            <button type="button" className="btn btn-outline" onClick={salvarQuestionarioIA} disabled={!questionarioSessionId}>
              Guardar Respostas
            </button>
          </div>
        </div>
      ) : (
        <div className="dashboard-card" style={{ marginTop: "8px" }}>
          <p style={{ margin: 0 }}>Ainda não há perguntas geradas. Esta etapa é opcional. Se quiser, volte à fase anterior e clique em "Perguntas adicionais (opcional)".</p>
        </div>
      )}
    </div>
  );

  const renderFase6 = () => (
    <div className="auth-form">
      <h3 className="dashboard-card-title">Fase 6: Uploads</h3>
      <div style={{ border: '2px dashed var(--neutral-300)', padding: '40px', textAlign: 'center', borderRadius: '12px' }}>
        <p>Adicione imagens, PDF ou vídeos do produto/protótipo</p>
        <input
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.webp,.mp4,.mov,.avi"
          onChange={handleArquivosChange}
          style={{ marginTop: "10px" }}
        />
        {Array.isArray(dados.arquivos) && dados.arquivos.length > 0 ? (
          <div style={{ marginTop: "12px", textAlign: "left", display: "grid", gap: "4px" }}>
            {dados.arquivos.map((f) => (
              <div key={`${f.name}-${f.size}`} style={{ fontSize: "0.85rem", color: "var(--neutral-700)" }}>
                • {f.name}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );

  const renderFase7 = () => (
    <div className="auth-form">
      <h3 className="dashboard-card-title">Fase 7: Revisão Final</h3>
      <div className="dashboard-card" style={{ background: 'var(--neutral-50)', fontSize: '0.9rem' }}>
        <p><strong>Projeto:</strong> {dados.nome}</p>
        <p><strong>Setor:</strong> {dados.setor}</p>
        <p><strong>Localização:</strong> {dados.cidade} - {dados.regiao} ({dados.localizacao || "Sem referência"})</p>
        <p><strong>Investimento:</strong> Kz{dados.capital}</p>
        <p><strong>Problema:</strong> {(dados.problema || "").substring(0, 50)}...</p>
        <p><strong>Perguntas IA respondidas:</strong> {Object.values(questionarioRespostas).filter((v) => String(v || "").trim()).length}</p>
        <p><strong>Arquivos anexados:</strong> {Array.isArray(dados.arquivos) ? dados.arquivos.length : 0}</p>
      </div>
      <p style={{fontSize: '0.8rem', color: 'var(--neutral-500)'}}>Ao clicar em submeter, nossa IA analisará a viabilidade do seu negócio.</p>
    </div>
  );

  const renderResultado = () => (
    <div className="dashboard-card" style={{ animation: 'fadeIn 0.5s' }}>
      {mensagemFluxo && (
        <p style={{ marginBottom: '12px', color: 'var(--success-500)', fontWeight: 600 }}>{mensagemFluxo}</p>
      )}
      <div
        style={{
          background: 'linear-gradient(135deg, var(--primary-800), var(--primary-700))',
          color: 'var(--on-primary)',
          borderRadius: '14px',
          padding: '18px',
          display: 'grid',
          gridTemplateColumns: 'auto 1fr auto',
          alignItems: 'center',
          gap: '14px',
        }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
        <div>
          <h2 className="dashboard-card-title" style={{ margin: 0, color: 'var(--on-primary)' }}>
            Análise de Viabilidade: {resultadoIA.viabilidade}
          </h2>
          <p style={{ margin: '6px 0 0', opacity: 0.92 }}>
            Fonte: {resultadoIA.origemAnalise}
          </p>
        </div>
        <div
          style={{
            background: 'rgba(255,255,255,0.18)',
            borderRadius: '12px',
            padding: '10px 14px',
            minWidth: '110px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '0.78rem', opacity: 0.9 }}>Score Geral</div>
          <div style={{ fontSize: '1.35rem', fontWeight: 700 }}>{resultadoIA.score}/100</div>
        </div>
      </div>

      {resultadoIA.notaAnalise ? (
        <div className="dashboard-card" style={{ marginTop: '14px', border: '1px solid var(--dm-border)' }}>
          <p style={{ margin: 0, color: 'var(--neutral-600)', fontSize: '0.9rem' }}>{resultadoIA.notaAnalise}</p>
        </div>
      ) : null}

      <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
        <div className="dashboard-card" style={{ border: '1px solid var(--success-500)' }}>
          <h4 style={{ marginTop: 0, color: 'var(--success-500)' }}>Pontos Fortes</h4>
          <ul style={{ paddingLeft: '18px', marginBottom: 0 }}>
            {resultadoIA.pontosFortes.map((p) => <li key={p}>{p}</li>)}
          </ul>
        </div>
        <div className="dashboard-card" style={{ border: '1px solid var(--warning-500)' }}>
          <h4 style={{ marginTop: 0, color: 'var(--warning-500)' }}>Riscos Identificados</h4>
          <ul style={{ paddingLeft: '18px', marginBottom: 0 }}>
            {resultadoIA.riscosIdentificados.map((p) => <li key={p}>{p}</li>)}
          </ul>
        </div>
      </div>

      <div style={{ marginTop: '14px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
        <div className="dashboard-card" style={{ border: '1px solid var(--primary-200)' }}>
          <h4 style={{ color: 'var(--primary-600)', marginTop: 0 }}>Análise Financeira</h4>
          <p>{resultadoIA.analiseFinanceira}</p>
          <h4 style={{ color: 'var(--primary-600)' }}>Projeção Financeira</h4>
          <p style={{ marginBottom: 0 }}>{resultadoIA.projecaoFinanceira}</p>
        </div>
        <div className="dashboard-card" style={{ border: '1px solid var(--primary-200)' }}>
          <h4 style={{ color: 'var(--primary-600)', marginTop: 0 }}>Ações Recomendadas</h4>
          <ul style={{ paddingLeft: '18px' }}>
            {resultadoIA.acoesRecomendadas.map((acao) => <li key={acao}>{acao}</li>)}
          </ul>
          <h4 style={{ color: 'var(--primary-600)' }}>Próximo Passo Recomendado</h4>
          <p style={{ marginBottom: 0 }}>{resultadoIA.proximoPassoRecomendado}</p>
        </div>
      </div>

      <div className="dashboard-card" style={{ marginTop: '14px', border: '1px solid var(--primary-200)' }}>
        <h4 style={{ color: 'var(--primary-600)', marginTop: 0 }}>Score por Fator</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
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
        {resultadoIA.score >= 50 ? (
          <div className="dashboard-card" style={{ width: "100%", border: "1px solid var(--warning-500)", background: "var(--warning-100)", marginBottom: "6px" }}>
            <p style={{ margin: 0, fontSize: "0.9rem" }}>
              Antes de publicar no marketplace, recomenda-se registrar e proteger legalmente a ideia para reduzir riscos de cópia, sobretudo em fase inicial.
            </p>
          </div>
        ) : null}
        <button
          className="btn btn-primary"
          onClick={publicarNoMarketplace}
          disabled={!ultimaIdeiaId || publicandoMarketplace || Number(resultadoIA.score || 0) < 80}
          style={{ width: 'auto', opacity: !ultimaIdeiaId || publicandoMarketplace || Number(resultadoIA.score || 0) < 80 ? 0.6 : 1 }}
        >
          {publicandoMarketplace
            ? "A publicar..."
            : Number(resultadoIA.score || 0) >= 80
              ? "Publicar no Marketplace"
              : Number(resultadoIA.score || 0) >= 50
                ? "Aguardando aprovação da AngoStart"
                : "Ideia rejeitada - melhore e reanalise"}
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      
      {/* INDICADOR DE ETAPAS */}
      {etapa < 8 && (
        <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
          {[1, 2, 3, 4, 5, 6, 7].map(i => (
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
            {etapa === 7 && renderFase7()}
            {etapa === 8 && renderResultado()}

            {/* BOTÕES DE NAVEGAÇÃO */}
            {etapa < 8 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px', paddingTop: '20px', borderTop: '1px solid var(--neutral-100)' }}>
                <button 
                  type="button"
                  className="btn-logout" 
                  onClick={etapaAnterior} 
                  disabled={etapa === 1}
                  style={{ width: 'auto', padding: '10px 30px', opacity: etapa === 1 ? 0.3 : 1 }}
                >
                  Voltar
                </button>
                
                {etapa < 7 ? (
                  <button type="button" className="btn btn-primary" onClick={proximaEtapa} style={{ width: 'auto', padding: '10px 40px' }}>
                    Próxima Fase
                  </button>
                ) : (
                  <button type="button" className="btn btn-primary" onClick={enviarParaAnalise} style={{ width: 'auto', padding: '10px 40px', background: 'var(--success-500)' }}>
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
  const [loadingReportId, setLoadingReportId] = useState(0);
  const [selectedReport, setSelectedReport] = useState(null);

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
    const score = Number(idea?.viability_score || 0);
    if (nextStatus === "active" && score < 80) {
      ctx?.setModal?.({
        open: true,
        message: score >= 50
          ? "Esta ideia precisa de aprovação da AngoStart para ser publicada (score entre 50 e 79)."
          : "Ideias com score abaixo de 50 devem ser melhoradas e reanalisadas antes da publicação.",
      });
      return;
    }
    if (nextStatus === "active" && score >= 80) {
      const canContinue = window.confirm(
        "Antes de publicar, recomenda-se registrar/proteger a ideia por segurança. Deseja publicar mesmo assim?"
      );
      if (!canContinue) return;
    }
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
  const scoreClass = (score) => {
    const n = Number(score || 0);
    if (n >= 80) return "badge-success";
    if (n >= 50) return "badge-warning";
    return "badge-info";
  };
  const policyText = (idea) => {
    const score = Number(idea?.viability_score || 0);
    const approval = String(idea?.approval_status || "pending");
    if (score >= 80) return "Elegível para publicação.";
    if (approval === "approved") return "Aprovada pela AngoStart. Publicação liberada.";
    if (score >= 50) return "Em revisão manual da AngoStart.";
    return "Rejeitada automaticamente. Melhore e submeta novamente.";
  };

  const openIdeaReport = async (ideaId) => {
    setLoadingReportId(Number(ideaId));
    try {
      const report = await getLatestViabilityReport(ideaId);
      setSelectedReport(report);
    } catch (err) {
      ctx?.setModal?.({ open: true, message: err.message || "Relatório não encontrado para esta ideia." });
    } finally {
      setLoadingReportId(0);
    }
  };

  const prepareIdeaForImprovement = (idea) => {
    const draft = {
      nome: idea.title || "",
      descricao: idea.description || "",
      setor: idea.sector || "",
      cidade: idea.city || "",
      localizacao: idea.address || "",
      regiao: idea.region || "",
      lat: idea.latitude != null ? String(idea.latitude) : "",
      lng: idea.longitude != null ? String(idea.longitude) : "",
      capital: idea.initial_capital != null ? String(idea.initial_capital) : "",
      problema: idea.problem || "",
      diferencial: idea.differential_text || "",
      publico: idea.target_audience || "",
    };
    localStorage.setItem("angostart_idea_edit_draft", JSON.stringify(draft));
    setCurrentPage("submeter-ideia");
  };

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
                  <th>Score IA</th>
                  <th>Status</th>
                  <th>Governança</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {ideias.map((ideia) => (
                  <tr key={ideia.id}>
                    <td><strong>{ideia.title}</strong></td>
                    <td><span className="badge badge-info">{ideia.sector || "-"}</span></td>
                    <td>{formatCapital(ideia.initial_capital)} AOA</td>
                    <td><span className={`badge ${scoreClass(ideia.viability_score)}`}>{Number(ideia.viability_score || 0)}</span></td>
                    <td>
                      <span className={`badge ${badgeClass(ideia.status)}`}>
                        {statusLabel(ideia.status)}
                      </span>
                    </td>
                    <td style={{ fontSize: "0.82rem" }}>{policyText(ideia)}</td>
                    <td>
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                        <button
                          className="btn btn-outline"
                          style={{ padding: '5px 10px', fontSize: '0.75rem', width: 'auto', opacity: loadingReportId === Number(ideia.id) ? 0.6 : 1 }}
                          onClick={() => openIdeaReport(ideia.id)}
                          disabled={loadingReportId === Number(ideia.id)}
                        >
                          {loadingReportId === Number(ideia.id) ? "Abrindo..." : "Ver relatório"}
                        </button>
                        <button
                          className={ideia.status === "active" ? "btn-logout" : "btn btn-primary"}
                          style={{ padding: '5px 10px', fontSize: '0.75rem', width: 'auto', opacity: savingId === Number(ideia.id) ? 0.6 : 1 }}
                          onClick={() => handleToggleMarketplace(ideia)}
                          disabled={
                            savingId === Number(ideia.id) ||
                            (
                              ideia.status !== "active" &&
                              Number(ideia.viability_score || 0) < 80 &&
                              String(ideia.approval_status || "pending") !== "approved"
                            )
                          }
                        >
                          {ideia.status === "active" ? "Remover do marketplace" : "Publicar no marketplace"}
                        </button>
                        {Number(ideia.viability_score || 0) < 50 ? (
                          <button
                            className="btn btn-outline"
                            style={{ padding: "5px 10px", fontSize: "0.75rem", width: "auto" }}
                            onClick={() => prepareIdeaForImprovement(ideia)}
                          >
                            Melhorar e reanalisar
                          </button>
                        ) : null}
                      </div>
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

      {selectedReport && (
        <div className="modal-overlay" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 9999, display: "flex", justifyContent: "center", alignItems: "center", padding: "12px" }} onClick={() => setSelectedReport(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()} style={{ width: "min(820px, 96vw)", maxHeight: "calc(100vh - 24px)", overflowY: "auto", background: "var(--dm-surface)", border: "1px solid var(--dm-border)", borderRadius: "12px", padding: "20px" }}>
            <h3 style={{ marginTop: 0 }}>Relatório da ideia</h3>
            <div style={{ display: "grid", gap: "10px", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
              <div className="dashboard-card"><strong>Status de viabilidade</strong><div>{selectedReport.viabilityStatus || "-"}</div></div>
              <div className="dashboard-card"><strong>Score IA</strong><div>{Number(selectedReport.score || 0)}/100</div></div>
              <div className="dashboard-card"><strong>Gerado em</strong><div>{selectedReport.createdAt ? new Date(selectedReport.createdAt).toLocaleString("pt-PT") : "-"}</div></div>
            </div>
            <div className="dashboard-card" style={{ marginTop: "10px" }}>
              <strong>Resumo</strong>
              <p style={{ marginBottom: 0 }}>{selectedReport.summary || "-"}</p>
            </div>
            <div style={{ display: "grid", gap: "10px", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", marginTop: "10px" }}>
              <div className="dashboard-card">
                <strong>Pontos fortes</strong>
                <ul style={{ marginBottom: 0, paddingLeft: "18px" }}>{(selectedReport.strengths || []).map((x) => <li key={x}>{x}</li>)}</ul>
              </div>
              <div className="dashboard-card">
                <strong>Pontos fracos</strong>
                <ul style={{ marginBottom: 0, paddingLeft: "18px" }}>{(selectedReport.weaknesses || []).map((x) => <li key={x}>{x}</li>)}</ul>
              </div>
              <div className="dashboard-card" style={{ gridColumn: "1 / -1" }}>
                <strong>Ajustes recomendados</strong>
                <ul style={{ marginBottom: 0, paddingLeft: "18px" }}>{(selectedReport.adjustments || []).map((x) => <li key={x}>{x}</li>)}</ul>
              </div>
            </div>
            <div style={{ marginTop: "14px", display: "flex", justifyContent: "flex-end" }}>
              <button className="btn btn-primary" style={{ width: "auto" }} onClick={() => setSelectedReport(null)}>Fechar</button>
            </div>
          </div>
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
          userRole={ctx?.currentUser?.role || "empreendedor"}
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
            imagem: inv.avatarUrl || "",
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

            <div style={{ width: "100%", marginTop: "auto", display: "grid", gap: "8px" }}>
              <button
                className="btn btn-outline"
                style={{ width: "100%" }}
                onClick={() => ctx?.openChatConversation?.({
                  userId: inv.id,
                  name: inv.nome,
                  avatarUrl: inv.imagem || null,
                  role: "investidor",
                  subtitle: inv.tipo || "Investidor",
                }, { pageId: "mensagens" })}
              >
                Contactar
              </button>
              <button 
                className="btn btn-primary" 
                style={{ width: '100%' }}
                onClick={() => handleOpenInvestorDetails(inv.id)}
                disabled={loadingDetailsId === Number(inv.id)}
              >
                {loadingDetailsId === Number(inv.id) ? "A carregar..." : "Saber Mais"}
              </button>
            </div>
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
  const ctx = useContext(AppContext);
  const [mentores, setMentores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [loadingDetailsId, setLoadingDetailsId] = useState(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [savingBooking, setSavingBooking] = useState(false);
  const [booking, setBooking] = useState({
    mentorId: null,
    tipoSessao: "online",
    dataHora: "",
    duracao: "60",
    pagamento: "multicaixa",
    observacoes: "",
  });

  const loadMentores = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAvailableMentors();
      setMentores((data || []).filter((m) => m?.verificationStatus === "approved"));
    } catch (err) {
      setMentores([]);
      ctx?.setModal?.({
        open: true,
        title: "Falha ao carregar mentores",
        message: err.message || "Não foi possível carregar os mentores verificados.",
      });
    } finally {
      setLoading(false);
    }
  }, [ctx]);

  useEffect(() => {
    loadMentores();
  }, [loadMentores]);

  const filtrados = mentores.filter((mentor) => {
    const target = `${mentor.name || ""} ${mentor?.profile?.expertiseArea || ""} ${mentor?.profile?.province || ""}`.toLowerCase();
    return target.includes(search.trim().toLowerCase());
  });

  const openMentorDetails = async (mentorId) => {
    setLoadingDetailsId(Number(mentorId));
    try {
      const mentor = await getMentorById(mentorId);
      setSelectedMentor(mentor);
    } catch (err) {
      ctx?.setModal?.({
        open: true,
        title: "Detalhes do mentor",
        message: err.message || "Não foi possível carregar o perfil do mentor.",
      });
    } finally {
      setLoadingDetailsId(null);
    }
  };

  const getPrecoSessao = () => {
    const duracao = Number(booking.duracao || 60);
    if (duracao <= 30) return 5000;
    if (duracao <= 60) return 10000;
    if (duracao <= 90) return 15000;
    return 20000;
  };

  const getNowDateTimeLocal = () => {
    const now = new Date();
    now.setSeconds(0, 0);
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const hh = String(now.getHours()).padStart(2, "0");
    const mi = String(now.getMinutes()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
  };

  const openBooking = (mentor) => {
    setBooking({
      mentorId: mentor?.id || null,
      tipoSessao: "online",
      dataHora: "",
      duracao: "60",
      pagamento: "multicaixa",
      observacoes: "",
    });
    setBookingOpen(true);
  };

  const confirmarMarcacao = async () => {
    if (!selectedMentor?.id) {
      ctx?.setModal?.({ open: true, message: "Selecione primeiro um mentor." });
      return;
    }
    if (!booking.dataHora) {
      ctx?.setModal?.({ open: true, message: "Selecione a data e hora da mentoria." });
      return;
    }
    const selectedDate = new Date(booking.dataHora);
    if (Number.isNaN(selectedDate.getTime())) {
      ctx?.setModal?.({ open: true, message: "A data/hora selecionada é inválida." });
      return;
    }
    if (selectedDate.getTime() < Date.now()) {
      ctx?.setModal?.({ open: true, message: "Não é possível marcar mentoria para uma data/hora que já passou." });
      return;
    }
    if (!booking.pagamento) {
      ctx?.setModal?.({ open: true, message: "Selecione a forma de pagamento." });
      return;
    }

    const preco = getPrecoSessao();
    setSavingBooking(true);
    try {
      await createMentorshipRequest({
        mentorId: Number(selectedMentor.id),
        topic: `Sessão de mentoria com foco em ${selectedMentor?.profile?.expertiseArea || "estratégia de negócio"}`,
        sessionType: booking.tipoSessao,
        preferredDatetime: booking.dataHora,
        durationMinutes: Number(booking.duracao || 60),
        paymentMethod: booking.pagamento,
        priceKz: preco,
        entrepreneurNotes: booking.observacoes || "",
      });
      await ctx?.refreshNavBadges?.();
      setBookingOpen(false);
      ctx?.setModal?.({
        open: true,
        title: "Sessão de mentoria enviada",
        message: `Solicitação enviada para ${selectedMentor.name}. Sessão ${booking.tipoSessao} de ${booking.duracao} minutos. Valor: ${preco.toLocaleString("pt-PT")} Kz. Pagamento: ${booking.pagamento}.`,
      });
    } catch (err) {
      ctx?.setModal?.({
        open: true,
        title: "Falha ao marcar sessão",
        message: err.message || "Não foi possível enviar a solicitação de mentoria.",
      });
    } finally {
      setSavingBooking(false);
    }
  };

  return (
    <div>
      <div className="dashboard-card" style={{ marginBottom: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
          <div>
            <h3 className="dashboard-card-title">Mentoria</h3>
            <p className="dashboard-card-description">
              Mentores verificados da plataforma para sessões de apoio estratégico.
            </p>
          </div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center", minWidth: "260px" }}>
            <input
              className="form-input"
              placeholder="Pesquisar mentor, área ou província..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="btn btn-outline" style={{ width: "auto" }} onClick={loadMentores} disabled={loading}>
              Atualizar
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <p>A carregar mentores verificados...</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "14px" }}>
          {filtrados.map((mentor) => (
            <div key={mentor.id} className="dashboard-card" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: "50%",
                    background: "var(--primary-100)",
                    color: "var(--primary-700)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    overflow: "hidden",
                  }}
                >
                  {mentor.avatarUrl ? (
                    <img src={mentor.avatarUrl} alt={mentor.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    String(mentor.name || "M").charAt(0).toUpperCase()
                  )}
                </div>
                <div>
                  <strong>{mentor.name}</strong>
                  <div style={{ fontSize: "0.8rem", color: "var(--dm-text-muted)" }}>
                    {mentor?.profile?.expertiseArea || "Mentoria geral"} • {mentor?.profile?.province || "Angola"}
                  </div>
                </div>
              </div>
              <div style={{ fontSize: "0.86rem", color: "var(--dm-text-muted)" }}>
                Empresa: {mentor?.profile?.company || "-"}
              </div>
              <div style={{ fontSize: "0.86rem", color: "var(--dm-text-muted)" }}>
                Experiência: {mentor?.profile?.experienceYears || "-"} anos
              </div>
              <div style={{ marginTop: "6px", display: "flex", gap: "8px" }}>
                <button
                  className="btn btn-outline"
                  style={{ width: "auto", flex: 1 }}
                  onClick={() => openMentorDetails(mentor.id)}
                  disabled={loadingDetailsId === Number(mentor.id)}
                >
                  {loadingDetailsId === Number(mentor.id) ? "A carregar..." : "Ver perfil"}
                </button>
                <button
                  className="btn btn-primary"
                  style={{ width: "auto", flex: 1 }}
                  onClick={() => {
                    setSelectedMentor(mentor);
                    openBooking(mentor);
                  }}
                >
                  Marcar sessão
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filtrados.length === 0 && (
        <div className="dashboard-card" style={{ textAlign: "center", color: "var(--neutral-500)" }}>
          Nenhum mentor verificado encontrado para esse filtro.
        </div>
      )}

      {selectedMentor && (
        <div className="dashboard-card" style={{ marginTop: "16px" }}>
          <h4 style={{ marginTop: 0 }}>Sobre o mentor</h4>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "10px" }}>
            <Info label="Nome" value={selectedMentor.name || "-"} />
            <Info label="E-mail" value={selectedMentor.email || "-"} />
            <Info label="Telefone" value={selectedMentor?.profile?.phone || "-"} />
            <Info label="Província" value={selectedMentor?.profile?.province || "-"} />
            <Info label="Área de especialidade" value={selectedMentor?.profile?.expertiseArea || "-"} />
            <Info label="Anos de experiência" value={selectedMentor?.profile?.experienceYears || "-"} />
            <Info label="Empresa" value={selectedMentor?.profile?.company || "-"} />
            <Info label="Função" value={selectedMentor?.profile?.currentRole || "-"} />
            <Info
              label="LinkedIn"
              value={
                selectedMentor?.profile?.linkedin
                  ? <a href={selectedMentor.profile.linkedin} target="_blank" rel="noreferrer" style={{ color: "#2563eb" }}>Abrir perfil</a>
                  : "-"
              }
            />
          </div>
          <div style={{ marginTop: "12px", display: "flex", justifyContent: "flex-end" }}>
            <button className="btn btn-primary" style={{ width: "auto" }} onClick={() => openBooking(selectedMentor)}>
              Marcar sessão de mentoria
            </button>
          </div>
        </div>
      )}

      {bookingOpen && (
        <div className="modal-overlay" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "12px" }} onClick={() => setBookingOpen(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()} style={{ width: "min(700px, 96vw)", maxHeight: "calc(100vh - 24px)", overflowY: "auto", background: "var(--dm-surface)", border: "1px solid var(--dm-border)", borderRadius: "12px", padding: "18px" }}>
            <h3 style={{ marginTop: 0 }}>Marcar sessão de mentoria</h3>
            <p style={{ color: "var(--dm-text-muted)", marginTop: 0 }}>
              Mentor: <strong>{selectedMentor?.name || "-"}</strong>
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "10px" }}>
              <div>
                <label className="form-label">Tipo de sessão</label>
                <select className="form-input" value={booking.tipoSessao} onChange={(e) => setBooking((p) => ({ ...p, tipoSessao: e.target.value }))}>
                  <option value="online">Online</option>
                  <option value="presencial">Presencial</option>
                </select>
              </div>
              <div>
                <label className="form-label">Duração (minutos)</label>
                <select className="form-input" value={booking.duracao} onChange={(e) => setBooking((p) => ({ ...p, duracao: e.target.value }))}>
                  <option value="30">30</option>
                  <option value="60">60</option>
                  <option value="90">90</option>
                  <option value="120">120</option>
                </select>
              </div>
              <div>
                <label className="form-label">Data e hora</label>
                <input
                  className="form-input"
                  type="datetime-local"
                  min={getNowDateTimeLocal()}
                  value={booking.dataHora}
                  onChange={(e) => setBooking((p) => ({ ...p, dataHora: e.target.value }))}
                />
              </div>
              <div>
                <label className="form-label">Forma de pagamento</label>
                <select className="form-input" value={booking.pagamento} onChange={(e) => setBooking((p) => ({ ...p, pagamento: e.target.value }))}>
                  <option value="multicaixa">Cartão Multicaixa</option>
                  <option value="transferencia">Transferência bancária</option>
                  <option value="unitel-money">Unitel Money</option>
                  <option value="afrimoney">Afrimoney</option>
                </select>
              </div>
            </div>
            <div style={{ marginTop: "10px" }}>
              <label className="form-label">Observações (opcional)</label>
              <textarea className="form-input" rows={3} value={booking.observacoes} onChange={(e) => setBooking((p) => ({ ...p, observacoes: e.target.value }))} />
            </div>
            <div style={{ marginTop: "10px", background: "var(--neutral-50)", border: "1px solid var(--dm-border)", borderRadius: "8px", padding: "10px" }}>
              Valor estimado da sessão: <strong>{getPrecoSessao().toLocaleString("pt-PT")} Kz</strong>
            </div>
            <div style={{ marginTop: "14px", display: "flex", justifyContent: "flex-end", gap: "8px" }}>
              <button className="btn btn-outline" style={{ width: "auto" }} onClick={() => setBookingOpen(false)} disabled={savingBooking}>Cancelar</button>
              <button className="btn btn-primary" style={{ width: "auto" }} onClick={confirmarMarcacao} disabled={savingBooking}>
                {savingBooking ? "A enviar..." : "Confirmar marcação"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Mensagens() {
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
  const avatarInputRef = useRef(null);
  const [avatarHover, setAvatarHover] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const isMentor = user?.role === "mentor";
  const isEmpreendedor = user?.role === "empreendedor";
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);
  const [editForm, setEditForm] = useState({
    phone: "",
    province: "",
    expertiseArea: "",
    experienceYears: "",
    company: "",
    currentRole: "",
    linkedin: "",
    businessName: "",
    businessSector: "",
    businessStage: "",
    businessLocation: "",
  });

  useEffect(() => {
    setEditForm({
      phone: p.phone || "",
      province: p.province || "",
      expertiseArea: p.expertise_area || p.expertiseArea || "",
      experienceYears: p.experience_years || p.experienceYears || "",
      company: p.company || "",
      currentRole: p.current_role || p.currentRole || "",
      linkedin: p.linkedin || "",
      businessName: p.business_name || p.businessName || "",
      businessSector: p.business_sector || p.businessSector || "",
      businessStage: p.business_stage || p.businessStage || "",
      businessLocation: p.business_location || p.businessLocation || "",
    });
  }, [
    user?.id,
    user?.role,
    user?.verificationStatus,
    p.phone,
    p.province,
    p.expertise_area,
    p.expertiseArea,
    p.experience_years,
    p.experienceYears,
    p.company,
    p.current_role,
    p.currentRole,
    p.linkedin,
    p.business_name,
    p.businessName,
    p.business_sector,
    p.businessSector,
    p.business_stage,
    p.businessStage,
    p.business_location,
    p.businessLocation,
  ]);

  const handleEditChange = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAvatarPickClick = () => {
    avatarInputRef.current?.click?.();
  };

  const handleAvatarFileChange = async (event) => {
    const file = event?.target?.files?.[0];
    if (!file) return;
    try {
      if (!/^image\/(jpeg|jpg|png|webp)$/i.test(file.type || "")) {
        throw new Error("Formato inválido. Use JPG, PNG ou WEBP.");
      }
      setUploadingAvatar(true);
      const avatarDataUrl = await compressImageToDataUrl(file, { maxWidth: 700, maxHeight: 700, quality: 0.8 });
      const resp = await updateMyProfile({ avatarDataUrl });
      if (resp?.user) {
        ctx?.applyAuthenticatedUser?.(resp.user);
      } else {
        ctx?.applyAuthenticatedUser?.({
          ...(user || {}),
          avatarUrl: avatarDataUrl,
        });
      }
      await ctx?.refreshCurrentUser?.();
      ctx?.setModal?.({
        open: true,
        title: "Foto atualizada",
        message: "A foto de perfil foi atualizada com sucesso.",
      });
    } catch (err) {
      ctx?.setModal?.({
        open: true,
        title: "Falha no upload",
        message: err?.message || "Não foi possível atualizar a foto de perfil.",
      });
    } finally {
      event.target.value = "";
      setUploadingAvatar(false);
    }
  };

  const submitProfileEdit = async () => {
    setSavingEdit(true);
    try {
      const profileData = isMentor
        ? {
            phone: editForm.phone,
            province: editForm.province,
            expertiseArea: editForm.expertiseArea,
            experienceYears: Number(editForm.experienceYears || 0),
            company: editForm.company,
            currentRole: editForm.currentRole,
            linkedin: editForm.linkedin,
          }
        : {
            phone: editForm.phone,
            businessName: editForm.businessName,
            businessSector: editForm.businessSector,
            businessStage: editForm.businessStage,
            businessLocation: editForm.businessLocation,
          };

      const resp = await updateMyProfile({ profileData });
      if (resp?.user) {
        ctx?.applyAuthenticatedUser?.(resp.user);
      } else {
        ctx?.applyAuthenticatedUser?.({
          ...(user || {}),
          verificationStatus: isMentor ? "pending" : (user?.verificationStatus || "approved"),
          profileData: {
            ...(user?.profileData || {}),
            ...profileData,
          },
        });
      }
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
  const status = user?.verificationStatus || "pending";
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
        
        <div className="profile-header-content">
          <div
            onMouseEnter={() => setAvatarHover(true)}
            onMouseLeave={() => setAvatarHover(false)}
            onClick={handleAvatarPickClick}
            className="profile-avatar-shell"
            title="Alterar foto de perfil"
          >
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt={user?.name || "Perfil"} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              String(user?.name || "U").charAt(0)
            )}
            <div style={{ position: "absolute", inset: 0, background: avatarHover ? "rgba(0,0,0,0.4)" : "transparent", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", fontWeight: 700, transition: "0.2s" }}>
              {avatarHover ? "+" : ""}
            </div>
            {uploadingAvatar ? (
              <div style={{ position: "absolute", bottom: 6, left: "50%", transform: "translateX(-50%)", fontSize: "0.72rem", background: "rgba(0,0,0,0.6)", color: "#fff", padding: "2px 6px", borderRadius: "6px" }}>
                A carregar...
              </div>
            ) : null}
          </div>
          <input ref={avatarInputRef} type="file" accept="image/png,image/jpeg,image/jpg,image/webp" onChange={handleAvatarFileChange} style={{ display: "none" }} />

          <div style={{ flex: 1 }}>
            <h2 style={{ margin: 0 }}>{user?.name || "Utilizador"}</h2>
            <p style={{ margin: '5px 0 0', color: 'var(--dm-text-muted)' }}>
              {roleTitle} • {location}
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
      <div className="profile-main-grid">
        
        {/* COLUNA ESQUERDA */}
        <div className="profile-left-column">
          
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

          <div className="profile-contact-grid">
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

      {isEditOpen && (
        <div className="modal-overlay" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 9999, display: "flex", justifyContent: "center", alignItems: "center", padding: "12px" }} onClick={() => setIsEditOpen(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()} style={{ width: "min(820px, 96vw)", maxHeight: "calc(100vh - 24px)", overflowY: "auto", background: "var(--dm-surface)", border: "1px solid var(--dm-border)", borderRadius: "12px", padding: "20px" }}>
            <h3 style={{ marginTop: 0 }}>Editar dados do perfil</h3>
            <p style={{ marginTop: 0, color: "var(--dm-text-muted)", fontSize: "0.9rem" }}>
              Atualize as informações abaixo e clique em <strong>Confirmar e Editar</strong>.
            </p>

            {isMentor ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: "12px" }}>
                <div><label className="form-label">Telefone</label><input className="form-input" value={editForm.phone} onChange={(e) => handleEditChange("phone", e.target.value)} /></div>
                <div><label className="form-label">Província</label><input className="form-input" value={editForm.province} onChange={(e) => handleEditChange("province", e.target.value)} /></div>
                <div><label className="form-label">Área de especialidade</label><input className="form-input" value={editForm.expertiseArea} onChange={(e) => handleEditChange("expertiseArea", e.target.value)} /></div>
                <div><label className="form-label">Anos de experiência</label><input className="form-input" type="number" min="0" value={editForm.experienceYears} onChange={(e) => handleEditChange("experienceYears", e.target.value)} /></div>
                <div><label className="form-label">Empresa</label><input className="form-input" value={editForm.company} onChange={(e) => handleEditChange("company", e.target.value)} /></div>
                <div><label className="form-label">Função atual</label><input className="form-input" value={editForm.currentRole} onChange={(e) => handleEditChange("currentRole", e.target.value)} /></div>
                <div><label className="form-label">LinkedIn</label><input className="form-input" value={editForm.linkedin} onChange={(e) => handleEditChange("linkedin", e.target.value)} /></div>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: "12px" }}>
                <div><label className="form-label">Telefone</label><input className="form-input" value={editForm.phone} onChange={(e) => handleEditChange("phone", e.target.value)} /></div>
                <div><label className="form-label">Nome do negócio</label><input className="form-input" value={editForm.businessName} onChange={(e) => handleEditChange("businessName", e.target.value)} /></div>
                <div><label className="form-label">Setor do negócio</label><input className="form-input" value={editForm.businessSector} onChange={(e) => handleEditChange("businessSector", e.target.value)} /></div>
                <div><label className="form-label">Fase do negócio</label><input className="form-input" value={editForm.businessStage} onChange={(e) => handleEditChange("businessStage", e.target.value)} /></div>
                <div><label className="form-label">Local do negócio</label><input className="form-input" value={editForm.businessLocation} onChange={(e) => handleEditChange("businessLocation", e.target.value)} /></div>
              </div>
            )}

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