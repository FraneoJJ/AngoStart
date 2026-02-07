import { useState } from "react";
import './App.css'

const navigationConfig = {
 empreendedor: [
    { section: 'Principal', items: [
      { id: 'dashboard', label: 'Dashboard', icon: 'home' },
      { id: 'submeter-ideia', label: 'Submeter Ideia', icon: 'lightbulb' },
      { id: 'minhas-ideias', label: 'Minhas Ideias', icon: 'folder', badge: 3 },
    ]},
    { section: 'Crescimento', items: [
      { id: 'mentoria', label: 'Mentoria', icon: 'users' },
      { id: 'investidores', label: 'Investidores', icon: 'trending-up' },
      { id: 'plano-negocio', label: 'Plano de Negócio', icon: 'file-text' },
    ]},
    { section: 'Configurações', items: [
      { id: 'perfil', label: 'Perfil', icon: 'user' },
      { id: 'assinatura', label: 'Assinatura', icon: 'credit-card' },
      { id: 'configuracoes', label: 'Configurações', icon: 'settings' },
    ]},
  ],
  investidor: [
    { section: 'Principal', items: [
      { id: 'dashboard', label: 'Dashboard', icon: 'home' , route: "/investidor" },
      { id: 'marketplace', label: 'Marketplace', icon: 'shopping-bag', badge: 12 ,route: "/investidor/marketplace"},
      { id: 'meus-investimentos', label: 'Investimentos', icon: 'trending-up' },
    ]},
    { section: 'Análise', items: [
      { id: 'propostas', label: 'Propostas', icon: 'inbox', badge: 5 },
      { id: 'analytics', label: 'Analytics', icon: 'bar-chart' },
    ]},
    { section: 'Configurações', items: [
      { id: 'perfil', label: 'Perfil', icon: 'user' },
      { id: 'configuracoes', label: 'Configurações', icon: 'settings' },
    ]},
  ],
  mentor: [
    { section: 'Principal', items: [
      { id: 'dashboard', label: 'Dashboard', icon: 'home' },
      { id: 'sessoes', label: 'Sessões', icon: 'calendar', badge: 4 },
      { id: 'mentorados', label: 'Mentorados', icon: 'users' },
    ]},
    { section: 'Conteúdo', items: [
      { id: 'recursos', label: 'Recursos', icon: 'book' },
      { id: 'disponibilidade', label: 'Disponibilidade', icon: 'clock' },
    ]},
    { section: 'Configurações', items: [
      { id: 'perfil', label: 'Perfil', icon: 'user' },
      { id: 'especialidades', label: 'Especialidades', icon: 'award' },
    ]},
  ],
  admin: [
    { section: 'Administração', items: [
      { id: 'dashboard', label: 'Dashboard', icon: 'home' },
      { id: 'usuarios', label: 'Usuários', icon: 'users' },
      { id: 'ideias', label: 'Ideias', icon: 'lightbulb', badge: 8 },
      
    ]},
    { section: 'Analytics', items: [
      { id: 'relatorios', label: 'Relatórios', icon: 'bar-chart' },
    ]},
    { section: 'Sistema', items: [
      { id: 'configuracoes', label: 'Configurações', icon: 'settings' },
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
  settings: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6m0-18c-5.5 0-10 4.5-10 10s4.5 10 10 10 10-4.5 10-10-4.5-10-10-10z"/></svg>,
};


export default function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState("dashboard");


  const users = [
    {
      email: "investidor@gmail.com",
      password: "123456",
      name: "Pedro Silva",
      role: "investidor",
    },
    {
      email: "empreendedor@gmail.com",
      password: "123456",
      name: "SPARCK",
      role: "empreendedor",
    },
    {
      email: "mentor@gmail.com",
      password: "123456",
      name: "Ana Tavares",
      role: "mentor",
    },
    {
      email: "admin@gmail.com",
      password: "123456",
      name: "Nzamba Nkunku",
      role: "admin",
    },
  ];

  function handleLogin() {
    const found = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!found) {
      setError("Email ou senha inválidos");
      return;
    }

    setUser(found);
    setError("");
  }

  function logout() {
    setUser(null);
    setEmail("");
    setPassword("");
  }

function RenderInvestidorPage() {
  switch(currentPage) {
    case 'dashboard': return <Investidor />;
    case 'marketplace': return <Marketplace />;
    case 'propostas': return <Propostas />;
    case 'analytics': return <Analytics />;
    case 'perfil': return <InvestidorPerfil />;
    case 'configuracoes': return <Configuracoes />;
    default: return <Investidor />;
  }
}
function RenderEmpreendedorPage() {
  switch(currentPage) {
    case 'dashboard': return <Investidor />;
    case 'submeter-ideia': return <Marketplace />;
    case 'minhas-ideias': return <Propostas />;
    case 'mentoria': return <Analytics />;
    case 'investidores': return <InvestidorPerfil />;
    case 'plano-negocio': return <Configuracoes />;
    case 'perfil': return <Configuracoes />;
    case 'assinatura': return <Configuracoes />;
     case 'configuracoes': return <Configuracoes />;
    default: return <Investidor />;
  }
}
function RenderMentorPage() {
  switch(currentPage) {
    case 'dashboard': return <Investidor />;
    case 'sessoes': return <Marketplace />;
    case 'mentorados': return <Propostas />;
    case 'recursos': return <Analytics />;
    case 'disponibilidade': return <InvestidorPerfil />;
    case 'perfil': return <Configuracoes />;
    case 'especialidades': return <Configuracoes />;
    case 'configuracoes': return <Configuracoes />;
    default: return <Investidor />;
  }
}
function RenderAdminPage() {
  switch(currentPage) {
    case 'dashboard': return <Investidor />;
    case 'usuarios': return <Usuarios />;
    case 'ideias': return <Ideias />;
    case 'relatorios': return <Relatorio />;
    case 'configuracoes': return <Configuracoes />;
    default: return <Investidor />;
  }
}

  // =========================
  // ÁREAS (FUNCTIONS)
  // =========================
  function Investidor() {
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
            <div className="stat-value">$485K</div>
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
            <td>$50K - $100K</td>
            <td><button className="btn btn-primary" style={{padding:'0.5rem 1rem', fontSize: '0.875rem'}}>Ver Detalhes</button></td>
          </tr>
          <tr>
            <td>AgriConnect</td>
            <td>AgriTech</td>
            <td><span className="badge badge-success">88</span></td>
            <td>$30K - $75K</td>
            <td><button className="btn btn-primary" style={{padding:'0.5rem 1rem', fontSize: '0.875rem'}}>Ver Detalhes</button></td>
          </tr>
          <tr>
            <td>HealthPlus</td>
            <td>HealthTech</td>
            <td><span className="badge badge-success">85</span></td>
            <td>$75K - $150K</td>
            <td><button className="btn btn-primary" style={{padding:'0.5rem 1rem', fontSize: '0.875rem'}}>Ver Detalhes</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  
  </>);
  }

  function Empreendedor() {
    return(
      <>
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-card-content">
          <div className="stat-info">
            <div className="stat-label">Ideias Submetidas</div>
            <div className="stat-value">3</div>
            <div className="stat-change">+1 este mês</div>
          </div>
          <div className="stat-icon-wrapper stat-icon-primary">
            {icons.lightbulb}
          </div>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-card-content">
          <div className="stat-info">
            <div className="stat-label">Score Médio IA</div>
            <div className="stat-value">89.5</div>
            <div className="stat-change">+5.2 pontos</div>
          </div>
          <div className="stat-icon-wrapper stat-icon-success">
            {icons['trending-up']}
          </div>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-card-content">
          <div className="stat-info">
            <div className="stat-label">Interesses Recebidos</div>
            <div className="stat-value">35</div>
            <div className="stat-change">+12 esta semana</div>
          </div>
          <div className="stat-icon-wrapper stat-icon-secondary">
            {icons.users}
          </div>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-card-content">
          <div className="stat-info">
            <div className="stat-label">Sessões de Mentoria</div>
            <div className="stat-value">8</div>
            <div className="stat-change">2 agendadas</div>
          </div>
          <div className="stat-icon-wrapper stat-icon-info">
            ${icons.clock}
          </div>
        </div>
      </div>
    </div>
    
    <div className="dashboard-card">
      <div className="dashboard-card-header">
        <h3 className="dashboard-card-title">Minhas Ideias</h3>
        <p className="dashboard-card-description">Acompanhe o status das suas ideias submetidas</p>
      </div>
      
      <table className="data-table">
        <thead>
          <tr>
            <th>Ideia</th>
            <th>Status</th>
            <th>Score IA</th>
            <th>Interesses</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>App de Delivery para Mercados Locais</td>
            <td><span className="badge badge-success">Aprovada</span></td>
            <td>87</td>
            <td>12</td>
            <td>15/12/2024</td>
          </tr>
          <tr>
            <td>Plataforma de Educação Online</td>
            <td><span className="badge badge-warning">Em Análise</span></td>
            <td>-</td>
            <td>0</td>
            <td>20/12/2024</td>
          </tr>
          <tr>
            <td>Sistema de Gestão para PMEs</td>
            <td><span className="badge badge-primary">Publicada</span></td>
            <td>92</td>
            <td>23</td>
            <td>10/12/2024</td>
          </tr>
        </tbody>
      </table>
    </div>
  </>);

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
    return( <>
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-card-content">
          <div className="stat-info">
            <div className="stat-label">Usuários Totais</div>
            <div className="stat-value">1,247</div>
            <div className="stat-change">+87 este mês</div>
          </div>
          <div className="stat-icon-wrapper stat-icon-primary">
            {icons.users}
          </div>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-card-content">
          <div className="stat-info">
            <div className="stat-label">Ideias Submetidas</div>
            <div className="stat-value">543</div>
            <div className="stat-change">+42 esta semana</div>
          </div>
          <div className="stat-icon-wrapper stat-icon-success">
            {icons.lightbulb}
          </div>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-card-content">
          <div className="stat-info">
            <div className="stat-label">Aprovações Pendentes</div>
            <div className="stat-value">8</div>
            <div className="stat-change">Requerem atenção</div>
          </div>
          <div className="stat-icon-wrapper stat-icon-secondary">
            {icons['check-circle']}
          </div>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-card-content">
          <div className="stat-info">
            <div className="stat-label">Receita Mensal</div>
            <div className="stat-value">$28.5K</div>
            <div className="stat-change">+12% vs mês anterior</div>
          </div>
          <div className="stat-icon-wrapper stat-icon-info">
            {icons['dollar-sign']}
          </div>
        </div>
      </div>
    </div>
    
    <div className="dashboard-card">
      <div className="dashboard-card-header">
        <h3 className="dashboard-card-title">Ideias Pendentes de Aprovação</h3>
        <p className="dashboard-card-description">Ideias aguardando revisão</p>
      </div>
      
      <table className="data-table">
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
          <tr>
            <td>App de Delivery Local</td>
            <td>João Silva</td>
            <td><span className="badge badge-success">87</span></td>
            <td>20/01/2026</td>
            <td><button className="btn btn-primary" style={{padding:'0.5rem 1rem', fontSize: '0.875rem'}}>Revisar</button></td>
          </tr>
          <tr>
            <td>Plataforma de Freelancers</td>
            <td>Ana Mendes</td>
            <td><span className="badge badge-success">92</span></td>
            <td>21/01/2026</td>
            <td><button className="btn btn-primary" style={{padding:'0.5rem 1rem', fontSize: '0.875rem'}}>Revisar</button></td>
          </tr>
          <tr>
            <td>E-commerce de Produtos Locais</td>
            <td>Carlos Dias</td>
            <td><span className="badge badge-warning">75</span></td>
            <td>22/01/2026</td>
            <td><button className="btn btn-primary" style={{padding:'0.5rem 1rem', fontSize: '0.875rem'}}>Revisar</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  </>);
  }

  function RenderArea() {
    if (user.role === "investidor") return <RenderInvestidorPage />;
    if (user.role === "empreendedor") return <Empreendedor />;
    if (user.role === "mentor") return <Mentor />;
    return <RenderAdminPage/>;
  }

  // =========================
  // LOGIN PAGE
  // =========================
  if (!user) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-header">
            <h1 className="auth-title">Bem-vindo de volta!</h1>
            <p className="auth-subtitle">Entre para continuar sua jornada empreendedora</p>
          </div>

          <div className="auth-card">
            <div className="card-content">
              <div className="auth-form">
                <input
                  className="form-input"
                  type="email"
                  placeholder="Gmail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <input
                  className="form-input"
                  type="password"
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                {error && (
                  <div className="alert alert-error">{error}</div>
                )}

                <button className="btn btn-primary btn-block" onClick={handleLogin}>
                  Entrar
                </button>

                <div className="demo-box">
                  <div className="demo-title">Usuários de teste</div>
                  <div className="demo-list">
                    investidor@gmail.com / 123456<br />
                    empreendedor@gmail.com / 123456<br />
                    mentor@gmail.com / 123456<br />
                    admin@gmail.com / 123456
                  </div>
                </div>
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
  
return (<>
<div className="dashboard-page"> 
  <header className="sidebar-header">
    <h2>AngoStart</h2>
  </header>
  <aside className="sidebar">
  <div className="sidebar-nav">
    {navigationConfig[user.role]?.map((group) => (
      <div key={group.section} className="nav-section">
        <div className="nav-section-title">
          {group.section}
        </div>

        {group.items.map((item) => (
      
            <div key={item.id}className={`nav-item ${currentPage === item.id ? "active" : ""}`}
             onClick={() => setCurrentPage(item.id)}>
            <span className="nav-icon">
              {icons[item.icon]}
            </span>

            <span className="nav-label">
              {item.label}
            </span>

            {item.badge && (
              <span className="nav-badge">
                {item.badge}
              </span>
            )}
          </div>
        ))}
      </div>
    ))}
  </div>

  <div className="sidebar-footer">
    <div className="user-profile">
      <div className="user-avatar">
        {user.name.charAt(0)}
      </div>
      <div className="user-info">
        <div className="user-name">{user.name}</div>
        <div className="user-role">{user.role}</div>
      </div>
    </div>

    <button className="btn-logout" onClick={logout}>
      Sair
    </button>
  </div>
</aside>
      <main className="main-content">
        <div className="page-content">
          <RenderArea />
        </div>
      </main>
    </div>
  </>);
}

function Marketplace() {
  const startups = [
    { id: 1, name: "Kwanza Pay", sector: "Fintech", score: 94, ask: "25k - 50k", desc: "Solução de pagamentos móveis para mercados informais em Luanda.", location: "Luanda" },
    { id: 2, name: "AgroFácil", sector: "AgriTech", score: 88, ask: "10k - 30k", desc: "Monitoramento de colheitas via satélite para pequenos produtores.", location: "Huambo" },
    { id: 3, name: "EduAngo", sector: "EdTech", score: 82, ask: "15k - 20k", desc: "Plataforma de cursos técnicos offline para zonas remotas.", location: "Benguela" },
    { id: 4, name: "Saúde Já", sector: "HealthTech", score: 91, ask: "50k+", desc: "Telemedicina conectando especialistas a postos de saúde provinciais.", location: "Cabinda" }
  ];
  return (
    <div className="marketplace-wrapper">
      <div className="dashboard-card" style={{ marginBottom: '25px', padding: '20px' }}>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {startups.map(s => (
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
                <div style={{ width: 50, height: 50, background: '#eee', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#2563eb' }}>
                  {s.name.charAt(0)}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="badge badge-success" style={{ fontSize: '0.8rem' }}>
                    Score IA: {s.score}
                  </span>
                  <div style={{ fontSize: '0.75rem', color: '#666', marginTop: 5 }}>
                    {s.location}, Angola
                  </div>
                </div>
              </div>

              <h3 style={{ margin: '0 0 10px 0' }}>{s.name}</h3>
              <span style={{ display: 'inline-block', padding: '2px 8px', background: '#eef2ff', color: '#4338ca', borderRadius: 4, fontSize: '0.75rem', fontWeight: 600 }}>
                {s.sector}
              </span>
              <p style={{ fontSize: '0.9rem', color: '#666', lineHeight: 1.5, marginTop: 10 }}>
                {s.desc}
              </p>
            </div>

            <div style={{ borderTop: '1px solid #eee', paddingTop: 15, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ display: 'block', fontSize: '0.7rem', color: '#999', textTransform: 'uppercase' }}>
                  Ticket de Investimento
                </span>
                <strong style={{ color: '#10b981' }}>{s.ask}</strong>
              </div>
              <button
                className="btn btn-primary"
                style={{ padding: '8px 15px', fontSize: '0.85rem' }}
                onClick={() => alert(`Abrindo detalhes de ${s.name}...`)}
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
    { id: 1, startup: "Kwanza Pay", equity: "5%", invested: "$25,000", currentVal: "$45,000", status: "Em Crescimento", roi: "+80%" },
    { id: 2, startup: "AgroFácil", equity: "10%", invested: "$15,000", currentVal: "$18,500", status: "Estável", roi: "+23%" },
    { id: 3, startup: "TechEdu Angola", equity: "2%", invested: "$10,000", currentVal: "$9,000", status: "Risco", roi: "-10%" }
  ];

  return (<>
    <div className="portfolio-container">
      <div className="stats-grid" style={{ marginBottom: '25px' }}>
        <div className="stat-card">
          <div className="stat-card-content" >
            <div className="stat-info">
              <div className="stat-label">Total Alocado</div>
              <div className="stat-value">$50,000</div>
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
              <div className="stat-value">$72,500</div>
              <div className="stat-change" style={{ color: '#10b981' }}>
                ↑ $22,500 (45%)
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
              background: '#f4f7fe',
              color: '#2563eb',
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
                      style={{ padding: '5px 10px', fontSize: '0.75rem', background: '#eee' }}
                      onClick={() => alert(`Abrindo relatórios da ${item.startup}`)}
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
          <p style={{margin:' 5px 0 0 0', color:' #666', fontSize: '0.85rem'}}>Dados baseados em tendências reais do ecossistema AngoStart.</p>
        </div>
        <select className="input-field" style={{padding: '8px 15px' , borderRadius: '8px', border:' 1px solid #ddd'}}>
          <option>Últimos 12 meses</option>
          <option>Últimos 6 meses</option>
          <option>Este Ano (2026)</option>
        </select>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '25px'}}>
        
        <div className="dashboard-card">
          <h4 className="dashboard-card-title">Crescimento Médio do Portfólio</h4>
          <p className="dashboard-card-description">Evolução do valuation das suas startups investidas.</p>
          
          <div style={{height: '200px', marginTop: '30px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding:' 0 10px', borderBottom:' 2px solid #eee', borderLeft: '2px solid #eee'}}>
            <div style={{width: '10%', background: '#e0e7ff', height:' 30%', borderRadius:' 4px 4px 0 0'}} title="Jan"></div>
            <div style={{width: '10%', background: '#e0e7ff', height:' 30%', borderRadius:' 4px 4px 0 0'}} title="Fev"></div>
            <div style={{width: '10%', background: '#e0e7ff', height:' 30%', borderRadius:' 4px 4px 0 0'}} title="Mar"></div>
            <div style={{width: '10%', background: '#e0e7ff', height:' 30%', borderRadius:' 4px 4px 0 0'}} title="Abr"></div>
            <div style={{width: '10%', background: '#e0e7ff', height:' 30%', borderRadius:' 4px 4px 0 0'}} title="Maio"></div>
            <div style={{width: '10%', background: '#e0e7ff', height:' 30%', borderRadius:' 4px 4px 0 0'}} title="Jun"></div>

          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '0.75rem', color: '#999'}}>
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
              <div style={{width: '100%', background: '#eee', height: '8px', borderRadius: '4px'}}>
                <div style={{width: '90%', background:' #10b981', height: '100%', borderRadius: '4px'}}></div>
              </div>
            </div>
            <div style={{marginBottom: '15px'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '5px'}}>
                <span>AgriTech</span>
                <span style={{color: '#10b981', fontWeight: 'bold'}}>+28%</span>
              </div>
              <div style={{width: '100%', background: '#eee', height: '8px', borderRadius: '4px'}}>
                <div style={{width:' 65%', background: '#2563eb', height: '100%', borderRadius: '4px'}}></div>
              </div>
            </div>
            <div style={{marginBottom: '15px'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '5px'}}>
                <span>EdTech</span>
                <span style={{color: '#f59e0b', fontWeight: 'bold'}}>+12%</span>
              </div>
              <div style={{width: '100%', background: '#eee', height:' 8px', borderRadius: '4px'}}>
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
  return (
    <div
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
        <div style={{ padding: '20px', borderBottom: '1px solid #eee' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Solicitações Recebidas</h3>
          <p style={{ margin: '5px 0 0 0', fontSize: '0.8rem', color: '#666' }}>
            Você tem 2 propostas pendentes
          </p>
        </div>

        <div style={{ overflowY: 'auto', flex: 1 }}>
          <div
            className="proposta-item active"
            style={{
              padding: '15px',
              borderBottom: '1px solid #eee',
              cursor: 'pointer',
              background: '#f8faff',
              borderLeft: '4px solid #2563eb'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <strong style={{ fontSize: '0.9rem' }}>SolarPay Angola</strong>
              <span style={{ fontSize: '0.7rem', color: '#999' }}>Hoje</span>
            </div>
            <p
              style={{
                margin: 0,
                fontSize: '0.85rem',
                color: '#444',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              Proposta de Equity: 5% por $25k
            </p>
            <span className="badge badge-warning" style={{ fontSize: '0.65rem', marginTop: '5px' }}>
              Pendente
            </span>
          </div>

          <div
            className="proposta-item"
            style={{ padding: '15px', borderBottom: '1px solid #eee', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <strong style={{ fontSize: '0.9rem' }}>AgroFácil</strong>
              <span style={{ fontSize: '0.7rem', color: '#999' }}>Ontem</span>
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#444' }}>
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
            borderBottom: '1px solid #eee',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#fff'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: 40,
                height: 40,
                background: '#2563eb',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
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
                background: '#fee2e2',
                color: '#ef4444',
                border: 'none',
                padding: '8px 15px',
                borderRadius: '6px',
                fontWeight: 600
              }}
              onClick={() => alert('Proposta Recusada')}
            >
              Recusar
            </button>

            <button
              className="btn btn-primary"
              style={{ padding: '8px 15px', borderRadius: '6px' }}
              onClick={() => alert('Proposta Aceite! Iniciando Due Diligence...')}
            >
              Aceitar Proposta
            </button>
          </div>
        </div>

        <div
          style={{
            flex: 1,
            padding: '20px',
            background: '#f9fafb',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px'
          }}
        >
          <div
            style={{
              alignSelf: 'flex-start',
              background: '#fff',
              padding: '12px',
              borderRadius: '12px',
              borderBottomLeftRadius: '2px',
              maxWidth: '70%',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}
          >
            <p style={{ margin: 0, fontSize: '0.9rem' }}>
              Olá, Maria Investidora! Enviamos nosso pitch deck atualizado. Estamos buscando
              25.000 USD para expansão em Benguela em troca de 5% de equity.
            </p>
            <span style={{ fontSize: '0.7rem', color: '#999', marginTop: '5px', display: 'block' }}>
              10:30 AM
            </span>
          </div>

          <div
            style={{
              alignSelf: 'flex-end',
              background: '#2563eb',
              color: '#fff',
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
            borderTop: '1px solid #eee',
            background: '#fff',
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
              border: '1px solid #ddd',
              borderRadius: '8px',
              outline: 'none'
            }}
          />
          <button className="btn btn-primary" style={{ padding: '0 20px' }}>
            Enviar
          </button>
        </div>
      </div>

      {/* ESTILOS LOCAIS */}
      <style>
        {`
          .proposta-item:hover { background: #f4f7fe; }
          .badge-warning { background: #fef3c7; color: #92400e; }
          .badge-success { background: #dcfce7; color: #166534; }
        `}
      </style>
    </div>
  );
}
function InvestidorPerfil() {

  const investidor = {
    nome: 'Maria Investidora',
    titulo: 'Investidora Anjo',
    local: 'Luanda, Angola',
    verificado: true,
    tese: [
      'Foco em Fintech e EdTech',
      'Tickets de 10k a 50k',
      'Busca por impacto social',
      'Zonas: Luanda e Huambo'
    ],
    bio: `
      Especialista em finanças com mais de 15 anos de experiência no setor bancário angolano.
      Atualmente focada em apoiar empreendedores locais que resolvem problemas de inclusão
      financeira e digitalização de processos tradicionais.
    `,
    contato: {
      email: 'maria.invest@exemplo.ao',
      telefone: '+244 9XX XXX XXX',
      linkedin: 'https://linkedin.com/in/maria-inv',
      website: 'www.meufundo.ao'
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      
      {/* HEADER PERFIL */}
      <div className="dashboard-card" style={{ padding: 0, overflow: 'hidden', marginBottom: '25px' }}>
        <div style={{ height: '120px', background: 'linear-gradient(90deg, #2563eb, #4f46e5)' }} />
        
        <div style={{ padding: '0 30px 30px', marginTop: '-50px', display: 'flex', alignItems: 'flex-end', gap: '20px' }}>
          <div style={{ width: 120, height: 120, borderRadius: '50%', border: '5px solid #fff', background: '#eee' }} />

          <div style={{ flex: 1 }}>
            <h2 style={{ margin: 0 }}>{investidor.nome}</h2>
            <p style={{ margin: '5px 0 0', color: '#666' }}>
              {investidor.titulo} • {investidor.local}
            </p>
          </div>

          <button
            className="btn btn-primary"
            onClick={() => alert('Funcionalidade de edição aberta!')}
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
            {investidor.verificado ? (
              <div style={{ color: '#10b981', fontWeight: 600 }}>✔ Conta Verificada</div>
            ) : (
              <div style={{ color: '#ef4444', fontWeight: 600 }}>Não verificada</div>
            )}
            <p style={{ fontSize: '0.8rem', color: '#999' }}>
              Identidade e fundos validados pela AngoStart.
            </p>
          </div>

          <div className="dashboard-card">
            <h4>Tese de Investimento</h4>
            <ul style={{ paddingLeft: '20px', fontSize: '0.9rem', lineHeight: '1.6' }}>
              {investidor.tese.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* COLUNA DIREITA */}
        <div className="dashboard-card">
          <h3 className="dashboard-card-title">Biografia Profissional</h3>
          <p style={{ lineHeight: '1.6', color: '#444' }}>
            {investidor.bio}
          </p>

          <hr style={{ borderTop: '1px solid #eee', margin: '25px 0' }} />

          <h3 className="dashboard-card-title">Informações de Contato</h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <Info label="E-mail" value={investidor.contato.email} />
            <Info label="Telefone" value={investidor.contato.telefone} />
            <Info
              label="LinkedIn"
              value={<a href={investidor.contato.linkedin} style={{ color: '#2563eb' }}>Ver perfil</a>}
            />
            <Info label="Website" value={investidor.contato.website} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Configuracoes() {
  
  const isDarkMode = document.body.classList.contains('dark-theme');

  return(
    <div className="dashboard-card" style={{maxWidth: '700px', margin:' 0 auto'}}>
      <div className="dashboard-card-header">
        <h3 className="dashboard-card-title">Configurações do Sistema</h3>
        <p className="dashboard-card-description">Personalize sua experiência na plataforma AngoStart.</p>
      </div>

      <div style={{padding: '20px'}}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 0', borderBottom:'1px solid #eee'}}>
          <div>
            <h4 style={{margin: '0'}}>Modo Escuro</h4>
            <p style={{margin: '0', fontSize: '0.85rem', color: '#666'}}>Altera a aparência do site para cores escuras.</p>
          </div>
          <label className="switch">
            <input type="checkbox" checked={isDarkMode} />
            <span className="slider round"></span>
          </label>
        </div>

        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 0', borderBottom: '1px solid #eee'}}>
          <div>
            <h4 style={{margin: '0'}}>Idioma do Sistema</h4>
            <p style={{margin: '0', fontSize: '0.85rem', color: '#666'}}>Escolha o idioma das interfaces.</p>
          </div>
          <select id="languageSelect" className="input-field" style={{padding: '8px', borderRadius: '6px', border:' 1px solid #ddd'}}>
            <option value="pt">Português (AO)</option>
            <option value="en">English (US)</option>
            <option value="fr">Français</option>
          </select>
        </div>

        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 0', borderBottom:' 1px solid #eee'}}>
          <div>
            <h4 style={{margin: '0'}}>Notificações por Email</h4>
            <p style={{margin: '0', fontSize: '0.85rem', color:' #666'}}>Receba alertas de novos Projectos e mensagens.</p>
          </div>
          <label className="switch">
            <input type="checkbox" checked/>
            <span className="slider round"></span>
          </label>
        </div>

        <div style={{marginTop: '30px'}}>
          <button className="btn btn-primary"   onClick={() => alert('Configurações salvas com sucesso!')}>Salvar Alterações</button>
        </div>
      </div>
    </div>

  );
}
function Info({ label, value }) {
  return (
    <div>
      <label style={{ fontSize: '0.8rem', color: '#999', display: 'block' }}>{label}</label>
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
  return ( <>
    <div className="dashboard-card">
      <div className="dashboard-card-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div>
          <h3 className="dashboard-card-title">Gerenciamento de Usuários</h3>
          <p className="dashboard-card-description">Visualize e gerencie todos os usuários cadastrados na plataforma.</p>
        </div>
        <button className="btn btn-primary"  onClick={() => alert('Abrir modal de novo usuário')} > + Novo Usuário</button>
      </div>
      
      <div style={{marginTop: '20px'}}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Função</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {generateUserTableRows()}
          </tbody>
        </table>
      </div>
    </div>
  </>);
}
function generateUserTableRows() {
  const mockUsers = [
    {
      name: "João Empreendedor",
      email: "empreendedor@angostart.com",
      role: "Empreendedor",
      status: "Ativo",
    },
    {
      name: "Maria Investidora",
      email: "investidor@angostart.com",
      role: "Investidor",
      status: "Ativo",
    },
    {
      name: "Carlos Mentor",
      email: "mentor@angostart.com",
      role: "Mentor",
      status: "Pendente",
    },
  ];

  return (
    <>
      {mockUsers.map((u) => (
        <tr key={u.email}>
          <td>
            <strong>{u.name}</strong>
          </td>
          <td>{u.email}</td>
          <td>
            <span className="badge badge-primary">
              {u.role}
            </span>
          </td>
          <td>
            <span
              className={`badge ${
                u.status === "Ativo"
                  ? "badge-success"
                  : "badge-warning"
              }`}
            >
              {u.status}
            </span>
          </td>
          <td style={{ display: "flex", gap: "0.5rem" }}>
            <button className="btn btn-outline">
              Editar
            </button>
            <button className="btn btn-outline" style={{ color: "red" }}>
              Bloquear
            </button>
          </td>
        </tr>
      ))}
    </>
  );
}
function Ideias() {
  return (<>
    <div className="dashboard-card">
      <div className="dashboard-card-header">
        <h3 className="dashboard-card-title">Ideias Pendentes de Aprovação</h3>
        <p className="dashboard-card-description">Ideias aguardando revisão</p>
      </div>
      
      <table className="data-table">
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
          <tr>
            <td>App de Delivery Local</td>
            <td>João Silva</td>
            <td><span className="badge badge-success">87</span></td>
            <td>20/01/2026</td>
            <td><button className="btn btn-primary" style={{padding: '0.5rem 1rem', fontSize: '0.875rem'}}>Revisar</button></td>
          </tr>
          <tr>
            <td>Plataforma de Freelancers</td>
            <td>Ana Mendes</td>
            <td><span className="badge badge-success">92</span></td>
            <td>21/01/2026</td>
            <td><button className="btn btn-primary" style={{padding: '0.5rem 1rem', fontSize: '0.875rem'}}>Revisar</button></td>
          </tr>
          <tr>
            <td>E-commerce de Produtos Locais</td>
            <td>Carlos Dias</td>
            <td><span className="badge badge-warning">75</span></td>
            <td>22/01/2026</td>
            <td><button className="btn btn-primary" style={{padding: '0.5rem 1rem', fontSize: '0.875rem'}}>Revisar</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  </>);
}
function Relatorio() {
  return (<>
    <div className="reports-container">
      <div className="dashboard-card" style={{marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '15px', flexWrap: 'wrap'}}>
        <div>
          <h3 style={{margin: '0'}}>Análise de Performance</h3>
          <p style={{margin: '0', color: '#666', fontSize: '0.9rem'}}>Relatórios detalhados da plataforma</p>
        </div>
        <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
          <label>Mês de Referência:</label>
          <select id="monthFilter" className="input-field" style={{padding: '5px 10px ', borderRadius: '5px', border: '1px solid #ddd'}}>
            <option value="janeiro-2026">Janeiro 2026</option>
            <option value="dezembro-2025">Dezembro 2025</option>
            <option value="novembro-2025">Novembro 2025</option>
          </select>
          <button className="btn btn-primary"  onClick={() =>alert('Relatório exportado em PDF!') } style={{padding: '5px 15px'}}>Exportar PDF</button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-content">
            <div className="stat-info">
              <div className="stat-label">Ideias no Mês</div>
              <div className="stat-value" id="totalIdeas">142</div>
              <div className="stat-change" style={{color: '#10b981'}}>↑ 12% vs mês passado</div>
            </div>
            <div className="stat-icon-wrapper stat-icon-primary">
              ${icons.lightbulb}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-content">
            <div className="stat-info">
              <div className="stat-label">Novos Cadastros</div>
              <div className="stat-value">87</div>
              <div className="stat-change">Total este mês</div>
            </div>
            <div className="stat-icon-wrapper stat-icon-info">
              ${icons.user}
            </div>
          </div>
        </div>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px'}}>
        <div className="dashboard-card">
          <h3 className="dashboard-card-title">Distribuição de Usuários</h3>
          <p className="dashboard-card-description">Divisão por tipo de perfil</p>
          
          <div style={{marginTop: '20px'}}>
            <div style={{marginBottom: '15px'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '5px'}}>
                <span>Empreendedores</span>
                <strong>650</strong>
              </div>
              <div style={{width: '100%', background: '#eee', height: '10px', borderRadius: '5px'}}>
                <div style={{width: '65%', background: 'var(--primary-color, #2563eb)', height: '100%', borderRadius: '5px'}}></div>
              </div>
            </div>

            <div style={{marginBottom: '15px'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '5px'}}>
                <span>Investidores</span>
                <strong>120</strong>
              </div>
              <div style={{width: '100%', background: '#eee', height: '10px', borderRadius: '5px'}}>
                <div style={{width: '25%', background: '#10b981', height: '100%', borderRadius: '5px'}}></div>
              </div>
            </div>

            <div style={{marginBottom: '15px'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '5px'}}>
                <span>Mentores</span>
                <strong>45</strong>
              </div>
              <div style={{width: '100%', background: '#eee', height: '10px', borderRadius: '5px'}}>
                <div style={{width: '15%', background: '#f59e0b', height: '100%', borderRadius: '5px'}}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <h3 className="dashboard-card-title">Atividade Recente</h3>
          <div style={{marginTop: '15px'}}>
            <ul style={{listStyle: 'none', padding: '0'}}>
              <li style={{padding: '10px 0', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between'}}>
                <span>Sessões de Mentoria</span>
                <strong>28</strong>
              </li>
              <li style={{padding:' 10px 0', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between'}}>
                <span>Investimentos Feitos</span>
                <strong>14</strong>
              </li>
              <li style={{padding: '10px 0', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between'}}>
                <span>Taxa de Aprovação</span>
                <strong>78%</strong>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </>);
}