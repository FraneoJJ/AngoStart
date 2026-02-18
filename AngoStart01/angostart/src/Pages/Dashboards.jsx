import { useState , useEffect } from "react";
import { Link } from "react-router-dom";
import '../App.css';

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


export default function Dashboard() {
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
    case 'meus-investimentos': return <Investimentos />;
    case 'propostas': return <Propostas />;
    case 'analytics': return <Analytics />;
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
  // Estado para controlar o Modo Escuro
  const [dark, setDark] = useState(document.body.classList.contains('dark-theme'));
  const [notificacoes, setNotificacoes] = useState(true);
  const [idioma, setIdioma] = useState('pt');

  // Efeito para aplicar/remover a classe no body
  useEffect(() => {
    if (dark) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [dark]);

  return (
    <div className="dashboard-card" style={{ maxWidth: '700px', margin: '0 auto', padding: 0, overflow: 'hidden' }}>
      <div className="dashboard-card-header" style={{ padding: '25px', borderBottom: '1px solid var(--neutral-200)' }}>
        <h3 className="dashboard-card-title" style={{ fontSize: '1.25rem' }}>Configurações do Sistema</h3>
        <p className="dashboard-card-description">Personalize sua experiência na plataforma AngoStart.</p>
      </div>

      <div style={{ padding: '10px 25px 25px 25px' }}>
        
        {/* MODO ESCURO */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 0', borderBottom: '1px solid var(--neutral-100)' }}>
          <div>
            <h4 style={{ margin: '0', color: 'var(--neutral-900)' }}>Modo Escuro</h4>
            <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--neutral-500)' }}>Altera a aparência para cores mais confortáveis à noite.</p>
          </div>
          <label className="switch">
            <input 
              type="checkbox" 
              checked={dark} 
              onChange={() => setDark(!dark)} 
            />
            <span className="slider round"></span>
          </label>
        </div>

        {/* IDIOMA */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 0', borderBottom: '1px solid var(--neutral-100)' }}>
          <div>
            <h4 style={{ margin: '0', color: 'var(--neutral-900)' }}>Idioma do Sistema</h4>
            <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--neutral-500)' }}>Escolha o idioma preferencial das interfaces.</p>
          </div>
          <select 
            className="form-input" 
            value={idioma}
            onChange={(e) => setIdioma(e.target.value)}
            style={{ width: 'auto', minWidth: '160px', padding: '8px' }}
          >
            <option value="pt">Português (AO)</option>
            <option value="en">English (US)</option>
            <option value="fr">Français</option>
          </select>
        </div>

        {/* NOTIFICAÇÕES */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 0' }}>
          <div>
            <h4 style={{ margin: '0', color: 'var(--neutral-900)' }}>Notificações por Email</h4>
            <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--neutral-500)' }}>Receba alertas de novos projetos e mensagens diretas.</p>
          </div>
          <label className="switch">
            <input 
              type="checkbox" 
              checked={notificacoes} 
              onChange={() => setNotificacoes(!notificacoes)}
            />
            <span className="slider round"></span>
          </label>
        </div>

        {/* BOTÕES DE AÇÃO */}
        <div style={{ marginTop: '30px', display: 'flex', gap: '15px' }}>
          <button 
            className="btn btn-primary" 
            style={{ padding: '12px 30px', width: 'auto' }}
            onClick={() => alert('Configurações salvas com sucesso!')}
          >
            Salvar Alterações
          </button>
          <button 
            className="btn-logout" 
            style={{ padding: '12px 30px', width: 'auto' }}
            onClick={() => {
              setDark(false);
              setNotificacoes(true);
              setIdioma('pt');
            }}
          >
            Restaurar Padrão
          </button>
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
function Sessoes() {
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
                onClick={() => alert(`Iniciando mentoria com ${emp.nome}`)}
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
            onClick={() => alert(`Abrindo chat com ${chat.nome}`)}
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

      <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '25px', alignItems: 'start' }}>
        
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
            <div style={{ width: 40, height: 40, background: 'var(--primary-600)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' }}>
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
          <div style={{ alignSelf: 'flex-start', background: '#fff', padding: '12px', borderRadius: '12px', borderBottomLeftRadius: '2px', maxWidth: '70%', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', border: '1px solid var(--neutral-200)' }}>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--neutral-800)' }}>
              Olá, Mentor! Enviamos nosso pitch deck atualizado. Estamos buscando expansão em Benguela.
            </p>
            <span style={{ fontSize: '0.7rem', color: 'var(--neutral-400)', marginTop: '5px', display: 'block' }}>10:30 AM</span>
          </div>

          {/* MENSAGEM ENVIADA */}
          <div style={{ alignSelf: 'flex-end', background: 'var(--primary-600)', color: '#fff', padding: '12px', borderRadius: '12px', borderBottomRightRadius: '2px', maxWidth: '70%' }}>
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
  const [etapa, setEtapa] = useState(1);
  const [analisando, setAnalisando] = useState(false);
  const [resultadoIA, setResultadoIA] = useState(null);
  
  const [dados, setDados] = useState({
    nome: '', descricao: '', setor: '',
    cidade: '', localizacao: '',
    capital: '',
    problema: '', diferencial: '', publico: '',
    arquivos: null
  });

  const proximaEtapa = () => setEtapa(etapa + 1);
  const etapaAnterior = () => setEtapa(etapa - 1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDados({ ...dados, [name]: value });
  };

  const simularAnaliseIA = () => {
    setAnalisando(true);
    // Simulando o tempo de processamento da IA
    setTimeout(() => {
      setResultadoIA({
        viabilidade: "Alta",
        pontosFortes: ["Setor em crescimento", "Solução escalável", "Capital inicial sólido"],
        pontosFracos: ["Concorrência estabelecida", "Dependência de logística"],
        melhorias: "Focar na validação do MVP com usuários reais antes da expansão em larga escala.",
        score: 85
      });
      setAnalisando(false);
      setEtapa(7); // Vai para a tela de resultado
    }, 3000);
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
        <label className="form-label">Ponto de Localização (Mapa)</label>
        <div style={{ height: '200px', background: '#e5e7eb', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
          [Simulação de Mapa Interativo]
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
      <h3 className="dashboard-card-title">Fase 4: Modelo de Negócio</h3>
      <div className="form-group">
        <label className="form-label">Qual problema específico o seu produto resolve?</label>
        <textarea className="form-input" name="problema" value={dados.problema} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label className="form-label">Como sua solução é diferente das existentes?</label>
        <textarea className="form-input" name="diferencial" value={dados.diferencial} onChange={handleChange} />
      </div>
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
        <p><strong>Investimento:</strong> Kz{dados.capital}</p>
        <p><strong>Problema:</strong> {dados.problema.substring(0, 50)}...</p>
      </div>
      <p style={{fontSize: '0.8rem', color: 'var(--neutral-500)'}}>Ao clicar em submeter, nossa IA analisará a viabilidade do seu negócio.</p>
    </div>
  );

  const renderResultado = () => (
    <div className="dashboard-card" style={{ textAlign: 'center', animation: 'fadeIn 0.5s' }}>
      <div style={{ fontSize: '3rem' }}>{resultadoIA.score >= 70 ? '🚀' : '💡'}</div>
      <h2 className="dashboard-card-title">Análise de Viabilidade: {resultadoIA.viabilidade}</h2>
      <div style={{ margin: '20px 0', padding: '15px', background: 'var(--primary-50)', borderRadius: '12px' }}>
        <p><strong>Score Geral: {resultadoIA.score}/100</strong></p>
      </div>
      
      <div style={{ textAlign: 'left', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div className="badge-success" style={{ padding: '15px', borderRadius: '8px' }}>
          <strong>Pontos Fortes:</strong>
          <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
            {resultadoIA.pontosFortes.map(p => <li key={p}>{p}</li>)}
          </ul>
        </div>
        <div className="badge-warning" style={{ padding: '15px', borderRadius: '8px', color: '#92400e' }}>
          <strong>A melhorar:</strong>
          <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
            {resultadoIA.pontosFracos.map(p => <li key={p}>{p}</li>)}
          </ul>
        </div>
      </div>
      
      <div className="dashboard-card" style={{ marginTop: '20px', border: '1px solid var(--primary-200)' }}>
        <h4 style={{ color: 'var(--primary-600)' }}>Conselho da IA:</h4>
        <p>{resultadoIA.melhorias}</p>
      </div>

      <button className="btn btn-primary" onClick={() => setEtapa(1)} style={{ marginTop: '20px' }}>Nova Submissão</button>
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
                  <button className="btn btn-primary" onClick={simularAnaliseIA} style={{ width: 'auto', padding: '10px 40px', background: 'var(--success-500)' }}>
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
  const [abaAtiva, setAbaAtiva] = useState('todas');

  const ideias = [
    {
      id: 1,
      nome: 'SolarPay Angola',
      score: 92,
      setor: 'Fintech',
      status: 'Em Execução',
      progresso: 65,
      faseAtual: 'Desenvolvimento do MVP',
      proximoPasso: 'Testes Beta com 50 usuários'
    },
    {
      id: 2,
      nome: 'AgroFácil',
      score: 78,
      setor: 'AgriTech',
      status: 'Em Análise',
      progresso: 0,
    },
    {
      id: 3,
      nome: 'EducaTech',
      score: 85,
      setor: 'Educação',
      status: 'Em Execução',
      progresso: 30,
      faseAtual: 'Pesquisa de Mercado',
      proximoPasso: 'Finalizar protótipo UI/UX'
    }
  ];

  const ideiasExecucao = ideias.filter(i => i.status === 'Em Execução');

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
          <table className="data-table">
            <thead>
              <tr>
                <th>Projeto</th>
                <th>Setor</th>
                <th>Score IA</th>
                <th>Status</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {ideias.map(ideia => (
                <tr key={ideia.id}>
                  <td><strong>{ideia.nome}</strong></td>
                  <td><span className="badge badge-info">{ideia.setor}</span></td>
                  <td>
                    <span style={{ fontWeight: '700', color: ideia.score > 80 ? 'var(--success-500)' : 'var(--primary-600)' }}>
                      {ideia.score}/100
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${ideia.status === 'Em Execução' ? 'badge-success' : 'badge-warning'}`}>
                      {ideia.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn-logout" style={{ padding: '5px 10px', fontSize: '0.75rem', width: 'auto' }}>
                      Ver Detalhes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* CONTEÚDO: EM EXECUÇÃO (TRACKING DE DESENVOLVIMENTO) */}
      {abaAtiva === 'execucao' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
          {ideiasExecucao.map(ideia => (
            <div key={ideia.id} className="dashboard-card" style={{ borderLeft: '6px solid var(--success-500)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{ideia.nome}</h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--neutral-500)' }}>{ideia.setor}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--neutral-500)' }}>Progresso Geral</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--primary-600)' }}>{ideia.progresso}%</div>
                </div>
              </div>

              {/* BARRA DE PROGRESSO */}
              <div style={{ width: '100%', height: '10px', background: 'var(--neutral-100)', borderRadius: '5px', marginBottom: '25px', overflow: 'hidden' }}>
                <div style={{ width: `${ideia.progresso}%`, height: '100%', background: 'var(--success-500)', transition: 'width 1s ease-in-out' }}></div>
              </div>

              {/* DETALHES DO DESENVOLVIMENTO */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ padding: '15px', background: 'var(--neutral-50)', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--neutral-500)', marginBottom: '5px' }}>FASE ATUAL</div>
                  <div style={{ fontWeight: '600', color: 'var(--neutral-900)' }}>{ideia.faseAtual}</div>
                </div>
                <div style={{ padding: '15px', background: 'var(--primary-50)', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--primary-600)', marginBottom: '5px' }}>PRÓXIMO PASSO</div>
                  <div style={{ fontWeight: '600', color: 'var(--primary-600)' }}>{ideia.proximoPasso}</div>
                </div>
              </div>

              <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button className="btn-logout" style={{ width: 'auto', padding: '8px 20px' }}>Relatório Completo</button>
                <button className="btn btn-primary" style={{ width: 'auto', padding: '8px 20px' }}>Atualizar Status</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
function Investidores() {
  const [busca, setBusca] = useState('');

  const investidores = [
    {
      id: 1,
      nome: 'Ricardo Santos',
      tipo: 'Investidor Anjo',
      areas: ['Fintech', 'Educação'],
      imagem: 'https://i.pravatar.cc/150?u=ricardo',
      descricao: 'Focado em startups de tecnologia com impacto social em Angola.'
    },
    {
      id: 2,
      nome: 'Beatriz Costa',
      tipo: 'Venture Capital',
      areas: ['AgriTech', 'Saúde'],
      imagem: '',
      descricao: 'Busco projetos escaláveis no setor do agronegócio e saúde digital.'
    },
    {
      id: 3,
      nome: 'Mário Varela',
      tipo: 'Investidor Privado',
      areas: ['Energia', 'Logística'],
      imagem: '',
      descricao: 'Interesse em infraestrutura e soluções logísticas para o mercado africano.'
    },
    {
      id: 4,
      nome: 'Helena Matos',
      tipo: 'Aceleradora',
      areas: ['Todas as áreas'],
      imagem: '',
      descricao: 'Apoio no desenvolvimento de MVPs e entrada no mercado.'
    }
  ];

  const filtrados = investidores.filter(inv => 
    inv.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div style={{ padding: '10px' }}>
      {/* HEADER E BUSCA */}
      <div className="dashboard-card" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 className="dashboard-card-title">Investidores Disponíveis</h2>
          <p className="dashboard-card-description">Conecte-se com parceiros que podem impulsionar sua ideia.</p>
        </div>
        <div style={{ width: '300px' }}>
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
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
        gap: '25px' 
      }}>
        {filtrados.map(inv => (
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
              <img src={inv.imagem} alt={inv.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
              onClick={() => alert(`Abrindo perfil detalhado de ${inv.nome}`)}
            >
              Saber Mais
            </button>
          </div>
        ))}
      </div>

      {/* CASO NÃO ENCONTRE NADA */}
      {filtrados.length === 0 && (
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
            Você tem 2 mensagens pendentes
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
              <strong style={{ fontSize: '0.9rem' }}>Teresa Ana </strong>
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
              Proposta de Equity: 5% por $25k...
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
              <strong style={{ fontSize: '0.9rem' }}>João Paulo</strong>
              <span style={{ fontSize: '0.7rem', color: '#999' }}>Ontem</span>
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#444' }}>
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
function Perfilmentor() {

  const investidor = {
    nome: 'Alenxandre Dala',
    titulo: 'Mentor ',
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
      email: 'alexandre.dala.mentor@exemplo.ao',
      telefone: '+244 9XX XXX XXX',
      linkedin: 'https://linkedin.com/in/alexandre-inv',
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