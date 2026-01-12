/* =================================
   AngoStart - Dashboard Main Script
   Gerencia navegação e conteúdo
   ================================= */

// Check authentication
const user = JSON.parse(localStorage.getItem('angostart_user') || 'null');
if (!user || !user.isAuthenticated) {
  window.location.href = 'login.html';
}

// DOM Elements
const sidebarNav = document.getElementById('sidebarNav');
const pageContent = document.getElementById('pageContent');
const pageTitle = document.getElementById('pageTitle');
const userName = document.getElementById('userName');
const userRole = document.getElementById('userRole');
const logoutBtn = document.getElementById('logoutBtn');
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebarClose = document.getElementById('sidebarClose');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');

// Current page
let currentPage = 'dashboard';

// Navigation configuration by role
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
    ]},
  ],
  investidor: [
    { section: 'Principal', items: [
      { id: 'dashboard', label: 'Dashboard', icon: 'home' },
      { id: 'marketplace', label: 'Marketplace', icon: 'shopping-bag', badge: 12 },
      { id: 'meus-investimentos', label: 'Meus Investimentos', icon: 'trending-up' },
    ]},
    { section: 'Análise', items: [
      { id: 'propostas', label: 'Propostas', icon: 'inbox', badge: 5 },
      { id: 'favoritos', label: 'Favoritos', icon: 'heart' },
      { id: 'analytics', label: 'Analytics', icon: 'bar-chart' },
    ]},
    { section: 'Configurações', items: [
      { id: 'perfil', label: 'Perfil', icon: 'user' },
      { id: 'portfolio', label: 'Portfólio', icon: 'briefcase' },
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
      { id: 'aprovacoes', label: 'Aprovações', icon: 'check-circle', badge: 3 },
    ]},
    { section: 'Analytics', items: [
      { id: 'relatorios', label: 'Relatórios', icon: 'bar-chart' },
      { id: 'financeiro', label: 'Financeiro', icon: 'dollar-sign' },
    ]},
    { section: 'Sistema', items: [
      { id: 'configuracoes', label: 'Configurações', icon: 'settings' },
    ]},
  ],
};

// Icon SVGs
const icons = {
  home: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
  lightbulb: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/><line x1="12" y1="23" x2="12" y2="19"/></svg>',
  folder: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>',
  users: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  'trending-up': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>',
  'file-text': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
  user: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  'credit-card': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>',
  'shopping-bag': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>',
  inbox: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>',
  heart: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
  'bar-chart': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>',
  briefcase: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
  calendar: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
  book: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
  clock: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  award: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>',
  'check-circle': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
  'dollar-sign': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
  settings: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6m0-18c-5.5 0-10 4.5-10 10s4.5 10 10 10 10-4.5 10-10-4.5-10-10-10z"/></svg>',
  kwanza: `
    <svg class="kwanza-icon" viewBox="0 0 24 24" width="24" height="24">
      <text x="12" y="18" text-anchor="middle" font-family="Arial" font-size="16" font-weight="bold">Kz</text>
    </svg>
  `,
};

// Initialize
function init() {
  // Set user info
  userName.textContent = user.name;
  userRole.textContent = getRoleLabel(user.role);
  
  // Build navigation
  buildNavigation();
  
  // Load initial page
  loadPage('dashboard');
  
  // Event listeners
  logoutBtn.addEventListener('click', handleLogout);
  sidebarToggle.addEventListener('click', toggleSidebar);
  sidebarClose.addEventListener('click', toggleSidebar);
  sidebarOverlay.addEventListener('click', toggleSidebar);
}

function getRoleLabel(role) {
  const labels = {
    empreendedor: 'Empreendedor',
    investidor: 'Investidor',
    mentor: 'Mentor',
    admin: 'Administrador'
  };
  return labels[role] || role;
}

function buildNavigation() {
  const nav = navigationConfig[user.role] || navigationConfig.empreendedor;
  let html = '';
  
  nav.forEach(section => {
    html += `
      <div class="nav-section">
        <div class="nav-section-title">${section.section}</div>
        ${section.items.map(item => `
          <a href="#" class="nav-item${item.id === currentPage ? ' active' : ''}" data-page="${item.id}">
            <span class="nav-icon">${icons[item.icon] || icons.home}</span>
            <span class="nav-label">${item.label}</span>
            ${item.badge ? `<span class="nav-badge">${item.badge}</span>` : ''}
          </a>
        `).join('')}
      </div>
    `;
  });
  
  sidebarNav.innerHTML = html;
  
  // Add click listeners
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      const page = this.getAttribute('data-page');
      loadPage(page);
      
      // Close mobile sidebar
      if (window.innerWidth < 1024) {
        toggleSidebar();
      }
    });
  });
}

function loadPage(page) {
  currentPage = page;
  
  // Update active nav item
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('data-page') === page) {
      item.classList.add('active');
    }
  });
  
  // Update page title
  pageTitle.textContent = getPageTitle(page);
  
  // Load content based on role and page
  loadPageContent(page);
}

function getPageTitle(page) {
  const titles = {
    dashboard: 'Dashboard',
    'submeter-ideia': 'Submeter Nova Ideia',
    'minhas-ideias': 'Minhas Ideias',
    mentoria: 'Mentoria',
    investidores: 'Investidores',
    'plano-negocio': 'Plano de Negócio',
    perfil: 'Meu Perfil',
    assinatura: 'Assinatura',
    marketplace: 'Marketplace',
    'meus-investimentos': 'Meus Investimentos',
    propostas: 'Propostas Recebidas',
    favoritos: 'Favoritos',
    analytics: 'Analytics',
    portfolio: 'Meu Portfólio',
    sessoes: 'Sessões de Mentoria',
    mentorados: 'Meus Mentorados',
    recursos: 'Recursos',
    disponibilidade: 'Disponibilidade',
    especialidades: 'Especialidades',
    usuarios: 'Gerenciar Usuários',
    ideias: 'Gerenciar Ideias',
    aprovacoes: 'Aprovações Pendentes',
    relatorios: 'Relatórios',
    financeiro: 'Financeiro',
    configuracoes: 'Configurações do Sistema',
  };
  return titles[page] || 'Dashboard';
}

function loadPageContent(page) {
  // Show loading
  pageContent.innerHTML = '<div class="loading"><div class="spinner"></div></div>';
  
  // Simulate loading delay
  setTimeout(() => {
    let content = '';
    
    // Load content based on user role and page
    if (page === 'dashboard') {
      content = getDashboardContent();
    } else {
      content = getGenericPageContent(page);
    }
    
    pageContent.innerHTML = content;
  }, 300);
}

function getDashboardContent() {
  // Role-specific dashboard content
  const dashboards = {
    empreendedor: getEntrepreneurDashboard(),
    investidor: getInvestorDashboard(),
    mentor: getMentorDashboard(),
    admin: getAdminDashboard(),
  };
  
  return dashboards[user.role] || dashboards.empreendedor;
}

function getEntrepreneurDashboard() {
  return `
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-card-content">
          <div class="stat-info">
            <div class="stat-label">Ideias Submetidas</div>
            <div class="stat-value">3</div>
            <div class="stat-change">+1 este mês</div>
          </div>
          <div class="stat-icon-wrapper stat-icon-primary">
            ${icons.lightbulb}
          </div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-card-content">
          <div class="stat-info">
            <div class="stat-label">Score Médio IA</div>
            <div class="stat-value">89.5</div>
            <div class="stat-change">+5.2 pontos</div>
          </div>
          <div class="stat-icon-wrapper stat-icon-success">
            ${icons['trending-up']}
          </div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-card-content">
          <div class="stat-info">
            <div class="stat-label">Interesses Recebidos</div>
            <div class="stat-value">35</div>
            <div class="stat-change">+12 esta semana</div>
          </div>
          <div class="stat-icon-wrapper stat-icon-secondary">
            ${icons.users}
          </div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-card-content">
          <div class="stat-info">
            <div class="stat-label">Sessões de Mentoria</div>
            <div class="stat-value">8</div>
            <div class="stat-change">2 agendadas</div>
          </div>
          <div class="stat-icon-wrapper stat-icon-info">
            ${icons.clock}
          </div>
        </div>
      </div>
    </div>
    
    <div class="dashboard-card">
      <div class="dashboard-card-header">
        <h3 class="dashboard-card-title">Minhas Ideias</h3>
        <p class="dashboard-card-description">Acompanhe o status das suas ideias submetidas</p>
      </div>
      
      <table class="data-table">
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
            <td><span class="badge badge-success">Aprovada</span></td>
            <td>87</td>
            <td>12</td>
            <td>15/12/2024</td>
          </tr>
          <tr>
            <td>Plataforma de Educação Online</td>
            <td><span class="badge badge-warning">Em Análise</span></td>
            <td>-</td>
            <td>0</td>
            <td>20/12/2024</td>
          </tr>
          <tr>
            <td>Sistema de Gestão para PMEs</td>
            <td><span class="badge badge-primary">Publicada</span></td>
            <td>92</td>
            <td>23</td>
            <td>10/12/2024</td>
          </tr>
        </tbody>
      </table>
    </div>
  `;
}

function getInvestorDashboard() {
  return `
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-card-content">
          <div class="stat-info">
            <div class="stat-label">Investimentos Ativos</div>
            <div class="stat-value">8</div>
            <div class="stat-change">+2 este trimestre</div>
          </div>
          <div class="stat-icon-wrapper stat-icon-primary">
            ${icons.briefcase}
          </div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-card-content">
          <div class="stat-info">
            <div class="stat-label">Valor Total Investido</div>
            <div class="stat-value">$485K</div>
            <div class="stat-change">Portfolio total</div>
          </div>
          <div class="stat-icon-wrapper stat-icon-success">
            ${icons['dollar-sign']}
          </div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-card-content">
          <div class="stat-info">
            <div class="stat-label">Propostas Pendentes</div>
            <div class="stat-value">12</div>
            <div class="stat-change">+5 esta semana</div>
          </div>
          <div class="stat-icon-wrapper stat-icon-secondary">
            ${icons.inbox}
          </div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-card-content">
          <div class="stat-info">
            <div class="stat-label">ROI Médio</div>
            <div class="stat-value">18.5%</div>
            <div class="stat-change">+2.3% este ano</div>
          </div>
          <div class="stat-icon-wrapper stat-icon-info">
            ${icons['trending-up']}
          </div>
        </div>
      </div>
    </div>
    
    <div class="dashboard-card">
      <div class="dashboard-card-header">
        <h3 class="dashboard-card-title">Oportunidades em Destaque</h3>
        <p class="dashboard-card-description">Ideias com maior pontuação IA</p>
      </div>
      
      <table class="data-table">
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
            <td><span class="badge badge-success">92</span></td>
            <td>$50K - $100K</td>
            <td><button class="btn btn-primary" style="padding: 0.5rem 1rem; font-size: 0.875rem;">Ver Detalhes</button></td>
          </tr>
          <tr>
            <td>AgriConnect</td>
            <td>AgriTech</td>
            <td><span class="badge badge-success">88</span></td>
            <td>$30K - $75K</td>
            <td><button class="btn btn-primary" style="padding: 0.5rem 1rem; font-size: 0.875rem;">Ver Detalhes</button></td>
          </tr>
          <tr>
            <td>HealthPlus</td>
            <td>HealthTech</td>
            <td><span class="badge badge-success">85</span></td>
            <td>$75K - $150K</td>
            <td><button class="btn btn-primary" style="padding: 0.5rem 1rem; font-size: 0.875rem;">Ver Detalhes</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  `;
}

function getMentorDashboard() {
  return `
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-card-content">
          <div class="stat-info">
            <div class="stat-label">Mentorados Ativos</div>
            <div class="stat-value">12</div>
            <div class="stat-change">+3 este mês</div>
          </div>
          <div class="stat-icon-wrapper stat-icon-primary">
            ${icons.users}
          </div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-card-content">
          <div class="stat-info">
            <div class="stat-label">Sessões este Mês</div>
            <div class="stat-value">24</div>
            <div class="stat-change">4 agendadas</div>
          </div>
          <div class="stat-icon-wrapper stat-icon-success">
            ${icons.calendar}
          </div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-card-content">
          <div class="stat-info">
            <div class="stat-label">Horas de Mentoria</div>
            <div class="stat-value">86</div>
            <div class="stat-change">Total acumulado</div>
          </div>
          <div class="stat-icon-wrapper stat-icon-secondary">
            ${icons.clock}
          </div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-card-content">
          <div class="stat-info">
            <div class="stat-label">Avaliação Média</div>
            <div class="stat-value">4.9</div>
            <div class="stat-change">De 5.0 estrelas</div>
          </div>
          <div class="stat-icon-wrapper stat-icon-info">
            ${icons.award}
          </div>
        </div>
      </div>
    </div>
    
    <div class="dashboard-card">
      <div class="dashboard-card-header">
        <h3 class="dashboard-card-title">Próximas Sessões</h3>
        <p class="dashboard-card-description">Suas sessões de mentoria agendadas</p>
      </div>
      
      <table class="data-table">
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
            <td><span class="badge badge-success">Confirmada</span></td>
          </tr>
          <tr>
            <td>Carlos Mendes</td>
            <td>Modelo de Negócio</td>
            <td>26/01/2026 10:00</td>
            <td>1h30</td>
            <td><span class="badge badge-success">Confirmada</span></td>
          </tr>
          <tr>
            <td>Maria Costa</td>
            <td>Pitch para Investidores</td>
            <td>27/01/2026 16:00</td>
            <td>1h</td>
            <td><span class="badge badge-warning">Pendente</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  `;
}


function getAdminDashboard() {
  return `
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-card-content">
          <div class="stat-info">
            <div class="stat-label">Usuários Totais</div>
            <div class="stat-value">1,247</div>
            <div class="stat-change">+87 este mês</div>
          </div>
          <div class="stat-icon-wrapper stat-icon-primary">
            ${icons.users}
          </div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-card-content">
          <div class="stat-info">
            <div class="stat-label">Ideias Submetidas</div>
            <div class="stat-value">543</div>
            <div class="stat-change">+42 esta semana</div>
          </div>
          <div class="stat-icon-wrapper stat-icon-success">
            ${icons.lightbulb}
          </div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-card-content">
          <div class="stat-info">
            <div class="stat-label">Aprovações Pendentes</div>
            <div class="stat-value">8</div>
            <div class="stat-change">Requerem atenção</div>
          </div>
          <div class="stat-icon-wrapper stat-icon-secondary">
            ${icons['check-circle']}
          </div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-card-content">
          <div class="stat-info">
            <div class="stat-label">Receita Mensal</div>
            <div class="stat-value">28.500kz</div>
            <div class="stat-change">+12% vs mês anterior</div>
          </div>
          <div class="stat-icon-wrapper stat-icon-info">
            ${icons['kwanza']}
          </div>
        </div>
      </div>
    </div>
    
    <div class="dashboard-card">
      <div class="dashboard-card-header">
        <h3 class="dashboard-card-title">Ideias Pendentes de Aprovação</h3>
        <p class="dashboard-card-description">Ideias aguardando revisão</p>
      </div>
      
      <table class="data-table">
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
            <td><span class="badge badge-success">87</span></td>
            <td>20/01/2026</td>
            <td><button class="btn btn-primary" style="padding: 0.5rem 1rem; font-size: 0.875rem;">Revisar</button></td>
          </tr>
          <tr>
            <td>Plataforma de Freelancers</td>
            <td>Ana Mendes</td>
            <td><span class="badge badge-success">92</span></td>
            <td>21/01/2026</td>
            <td><button class="btn btn-primary" style="padding: 0.5rem 1rem; font-size: 0.875rem;">Revisar</button></td>
          </tr>
          <tr>
            <td>E-commerce de Produtos Locais</td>
            <td>Carlos Dias</td>
            <td><span class="badge badge-warning">75</span></td>
            <td>22/01/2026</td>
            <td><button class="btn btn-primary" style="padding: 0.5rem 1rem; font-size: 0.875rem;">Revisar</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  `;
}

function getGenericPageContent(page) {
  return `
    <div class="empty-state">
      <div class="empty-state-icon">
        ${icons[page] || icons.home}
      </div>
      <h3 class="empty-state-title">${getPageTitle(page)}</h3>
      <p class="empty-state-description">
        Esta página está em desenvolvimento. O conteúdo será adicionado em breve.
      </p>
      <button class="btn btn-primary" onclick="loadPage('dashboard')">
        Voltar ao Dashboard
      </button>
    </div>
  `;
}

function toggleSidebar() {
  sidebar.classList.toggle('active');
  sidebarOverlay.classList.toggle('active');
}

function handleLogout() {
  if (confirm('Tem certeza que deseja sair?')) {
    localStorage.removeItem('angostart_user');
    window.location.href = 'index.html';
  }
}

// Initialize app
init();
