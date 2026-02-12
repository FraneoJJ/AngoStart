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
    <svg className="kwanza-icon" viewBox="0 0 24 24" width="24" height="24">
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
      <div className="nav-section">
        <div className="nav-section-title">${section.section}</div>
        ${section.items.map(item => `
          <a href="#" className="nav-item${item.id === currentPage ? ' active' : ''}" data-page="${item.id}">
            <span className="nav-icon">${icons[item.icon] || icons.home}</span>
            <span className="nav-label">${item.label}</span>
            ${item.badge ? `<span className="nav-badge">${item.badge}</span>` : ''}
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
    item.classNameList.remove('active');
    if (item.getAttribute('data-page') === page) {
      item.classNameList.add('active');
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
  pageContent.innerHTML = '<div className="loading"><div className="spinner"></div></div>';
  
  // Simulate loading delay
  setTimeout(() => {
    let content = '';
    
    // Load content based on user role and page
    if (page === 'dashboard') {
      content = getDashboardContent();
    } 
    else if (page === 'usuarios' && user.role === 'admin') {
      content = getUsersManagementContent();
    }
    
    else if (page === 'ideias' && user.role === 'admin') {
    content = getSubmitIdeaForm();
    }
    else if (page === 'relatorios' && user.role === 'admin') {
    content = getReportsContent();
    }
    else if (page === 'configuracoes' && user.role === 'admin') {
    content = getConfiguracoesContent() ;
    }
    else if (page === 'marketplace' && user.role === 'investidor') {
    content = getMarketplaceContent();
    }
    else if (page === 'meus-investimentos' && user.role === 'investidor') {
    content = getMyInvestmentsContent();
    }
    else if (page === 'propostas' && user.role === 'investidor') {
    content = getPropostasContent();
    }
    else if (page === 'analytics' && user.role === 'investidor') {
    content = getAnalyticsContent();
    }
    else if (page === 'perfil' && user.role === 'investidor') {
    content = getInvestidorPerfilContent();
    }
    else if (page === 'configuracoes' && user.role === 'investidor') {
    content = getConfiguracoesContent() ;
    }
    else {
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
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-card-content">
          <div className="stat-info">
            <div className="stat-label">Ideias Submetidas</div>
            <div className="stat-value">3</div>
            <div className="stat-change">+1 este mês</div>
          </div>
          <div className="stat-icon-wrapper stat-icon-primary">
            ${icons.lightbulb}
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
            ${icons['trending-up']}
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
            ${icons.users}
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
  `;
}

function getInvestorDashboard() {
  return `
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-card-content">
          <div className="stat-info">
            <div className="stat-label">Investimentos Ativos</div>
            <div className="stat-value">8</div>
            <div className="stat-change">+2 este trimestre</div>
          </div>
          <div className="stat-icon-wrapper stat-icon-primary">
            ${icons.briefcase}
          </div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-card-content">
          <div class="stat-info">
            <div class="stat-label">Valor Total Investido</div>
            <div class="stat-value">485K</div>
            <div class="stat-change">Portfolio total</div>
          </div>
          <div className="stat-icon-wrapper stat-icon-success">
            ${icons['dollar-sign']}
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
            ${icons.inbox}
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
            ${icons['trending-up']}
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
            <td><span class="badge badge-success">92</span></td>
            <td>50K - 100K</td>
            <td><button class="btn btn-primary" style="padding: 0.5rem 1rem; font-size: 0.875rem;">Ver Detalhes</button></td>
          </tr>
          <tr>
            <td>AgriConnect</td>
            <td>AgriTech</td>
            <td><span class="badge badge-success">88</span></td>
            <td>30K - 75K</td>
            <td><button class="btn btn-primary" style="padding: 0.5rem 1rem; font-size: 0.875rem;">Ver Detalhes</button></td>
          </tr>
          <tr>
            <td>HealthPlus</td>
            <td>HealthTech</td>
            <td><span class="badge badge-success">85</span></td>
            <td>75K - 150K</td>
            <td><button class="btn btn-primary" style="padding: 0.5rem 1rem; font-size: 0.875rem;">Ver Detalhes</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  `;
}

function getMentorDashboard() {
  return `
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-card-content">
          <div className="stat-info">
            <div className="stat-label">Mentorados Ativos</div>
            <div className="stat-value">12</div>
            <div className="stat-change">+3 este mês</div>
          </div>
          <div className="stat-icon-wrapper stat-icon-primary">
            ${icons.users}
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
            ${icons.calendar}
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
            ${icons.clock}
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
            ${icons.award}
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
  `;
}


function getAdminDashboard() {
  return `
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-card-content">
          <div className="stat-info">
            <div className="stat-label">Usuários Totais</div>
            <div className="stat-value">1,247</div>
            <div className="stat-change">+87 este mês</div>
          </div>
          <div className="stat-icon-wrapper stat-icon-primary">
            ${icons.users}
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
            ${icons.lightbulb}
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
            ${icons['check-circle']}
          </div>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-card-content">
          <div className="stat-info">
            <div className="stat-label">Receita Mensal</div>
            <div className="stat-value">28.500kz</div>
            <div className="stat-change">+12% vs mês anterior</div>
          </div>
          <div className="stat-icon-wrapper stat-icon-info">
            ${icons['kwanza']}
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
            <td><button className="btn btn-primary" style="padding: 0.5rem 1rem; font-size: 0.875rem;">Revisar</button></td>
          </tr>
          <tr>
            <td>Plataforma de Freelancers</td>
            <td>Ana Mendes</td>
            <td><span className="badge badge-success">92</span></td>
            <td>21/01/2026</td>
            <td><button className="btn btn-primary" style="padding: 0.5rem 1rem; font-size: 0.875rem;">Revisar</button></td>
          </tr>
          <tr>
            <td>E-commerce de Produtos Locais</td>
            <td>Carlos Dias</td>
            <td><span className="badge badge-warning">75</span></td>
            <td>22/01/2026</td>
            <td><button className="btn btn-primary" style="padding: 0.5rem 1rem; font-size: 0.875rem;">Revisar</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  `;
}

function getUsersManagementContent() {
  return `
    <div class="dashboard-card">
      <div class="dashboard-card-header" style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h3 class="dashboard-card-title">Gerenciamento de Usuários</h3>
          <p class="dashboard-card-description">Visualize e gerencie todos os usuários cadastrados na plataforma.</p>
        </div>
        <button class="btn btn-primary" onclick="alert('Abrir modal de novo usuário')"> + Novo Usuário</button>
      </div>
      
      <div style="margin-top: 20px;">
        <table class="data-table">
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
            ${generateUserTableRows()}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// Função auxiliar para não poluir o HTML principal
function generateUserTableRows() {
  const mockUsers = [
    { name: 'João Empreendedor', email: 'empreendedor@angostart.com', role: 'Empreendedor', status: 'Ativo' },
    { name: 'Maria Investidora', email: 'investidor@angostart.com', role: 'Investidor', status: 'Ativo' },
    { name: 'Carlos Mentor', email: 'mentor@angostart.com', role: 'Mentor', status: 'Pendente' }
  ];

  return mockUsers.map(u => `
    <tr>
      <td><strong>${u.name}</strong></td>
      <td>${u.email}</td>
      <td><span class="badge badge-primary">${u.role}</span></td>
      <td><span class="badge ${u.status === 'Ativo' ? 'badge-success' : 'badge-warning'}">${u.status}</span></td>
      <td>
        <button class="btn" style="padding: 2px 8px; background: #eee;">Editar</button>
        <button class="btn" style="padding: 2px 8px; background: #ffebee; color: red;">Bloquear</button>
      </td>
    </tr>
  `).join('');
}
function getSubmitIdeaForm() {
  return `
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
function getReportsContent() {
  return `
    <div class="reports-container">
      <div class="dashboard-card" style="margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between; gap: 15px; flex-wrap: wrap;">
        <div>
          <h3 style="margin: 0;">Análise de Performance</h3>
          <p style="margin: 0; color: #666; font-size: 0.9rem;">Relatórios detalhados da plataforma</p>
        </div>
        <div style="display: flex; gap: 10px; align-items: center;">
          <label>Mês de Referência:</label>
          <select id="monthFilter" class="input-field" style="padding: 5px 10px; border-radius: 5px; border: 1px solid #ddd;">
            <option value="janeiro-2026">Janeiro 2026</option>
            <option value="dezembro-2025">Dezembro 2025</option>
            <option value="novembro-2025">Novembro 2025</option>
          </select>
          <button class="btn btn-primary" onclick="alert('Relatório exportado em PDF!')" style="padding: 5px 15px;">Exportar PDF</button>
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-card-content">
            <div class="stat-info">
              <div class="stat-label">Ideias no Mês</div>
              <div class="stat-value" id="totalIdeas">142</div>
              <div class="stat-change" style="color: #10b981;">↑ 12% vs mês passado</div>
            </div>
            <div class="stat-icon-wrapper stat-icon-primary">
              ${icons.lightbulb}
            </div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-card-content">
            <div class="stat-info">
              <div class="stat-label">Novos Cadastros</div>
              <div class="stat-value">87</div>
              <div class="stat-change">Total este mês</div>
            </div>
            <div class="stat-icon-wrapper stat-icon-info">
              ${icons.user}
            </div>
          </div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 20px;">
        <div class="dashboard-card">
          <h3 class="dashboard-card-title">Distribuição de Usuários</h3>
          <p class="dashboard-card-description">Divisão por tipo de perfil</p>
          
          <div style="margin-top: 20px;">
            <div style="margin-bottom: 15px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span>Empreendedores</span>
                <strong>650</strong>
              </div>
              <div style="width: 100%; background: #eee; height: 10px; border-radius: 5px;">
                <div style="width: 65%; background: var(--primary-color, #2563eb); height: 100%; border-radius: 5px;"></div>
              </div>
            </div>

            <div style="margin-bottom: 15px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span>Investidores</span>
                <strong>120</strong>
              </div>
              <div style="width: 100%; background: #eee; height: 10px; border-radius: 5px;">
                <div style="width: 25%; background: #10b981; height: 100%; border-radius: 5px;"></div>
              </div>
            </div>

            <div style="margin-bottom: 15px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span>Mentores</span>
                <strong>45</strong>
              </div>
              <div style="width: 100%; background: #eee; height: 10px; border-radius: 5px;">
                <div style="width: 15%; background: #f59e0b; height: 100%; border-radius: 5px;"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="dashboard-card">
          <h3 class="dashboard-card-title">Atividade Recente</h3>
          <div style="margin-top: 15px;">
            <ul style="list-style: none; padding: 0;">
              <li style="padding: 10px 0; border-bottom: 1px solid #eee; display: flex; justify-content: space-between;">
                <span>Sessões de Mentoria</span>
                <strong>28</strong>
              </li>
              <li style="padding: 10px 0; border-bottom: 1px solid #eee; display: flex; justify-content: space-between;">
                <span>Investimentos Feitos</span>
                <strong>14</strong>
              </li>
              <li style="padding: 10px 0; border-bottom: 1px solid #eee; display: flex; justify-content: space-between;">
                <span>Taxa de Aprovação</span>
                <strong>78%</strong>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `;
}
function getConfiguracoesContent() {
  
  const isDarkMode = document.body.classList.contains('dark-theme');

  return `
    <div class="dashboard-card" style="max-width: 700px; margin: 0 auto;">
      <div class="dashboard-card-header">
        <h3 class="dashboard-card-title">Configurações do Sistema</h3>
        <p class="dashboard-card-description">Personalize sua experiência na plataforma AngoStart.</p>
      </div>

      <div style="padding: 20px;">
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 15px 0; border-bottom: 1px solid #eee;">
          <div>
            <h4 style="margin: 0;">Modo Escuro</h4>
            <p style="margin: 0; font-size: 0.85rem; color: #666;">Altera a aparência do site para cores escuras.</p>
          </div>
          <label class="switch">
            <input type="checkbox" id="darkModeToggle" ${isDarkMode ? 'checked' : ''}>
            <span class="slider round"></span>
          </label>
        </div>

        <div style="display: flex; align-items: center; justify-content: space-between; padding: 15px 0; border-bottom: 1px solid #eee;">
          <div>
            <h4 style="margin: 0;">Idioma do Sistema</h4>
            <p style="margin: 0; font-size: 0.85rem; color: #666;">Escolha o idioma das interfaces.</p>
          </div>
          <select id="languageSelect" class="input-field" style="padding: 8px; border-radius: 6px; border: 1px solid #ddd;">
            <option value="pt">Português (AO)</option>
            <option value="en">English (US)</option>
            <option value="fr">Français</option>
          </select>
        </div>

        <div style="display: flex; align-items: center; justify-content: space-between; padding: 15px 0; border-bottom: 1px solid #eee;">
          <div>
            <h4 style="margin: 0;">Notificações por Email</h4>
            <p style="margin: 0; font-size: 0.85rem; color: #666;">Receba alertas de novos investidores e mensagens.</p>
          </div>
          <label class="switch">
            <input type="checkbox" checked>
            <span class="slider round"></span>
          </label>
        </div>

        <div style="margin-top: 30px;">
          <button class="btn btn-primary" onclick="alert('Configurações salvas com sucesso!')">Salvar Alterações</button>
        </div>
      </div>
    </div>

    
  `;
}

function getMarketplaceContent() {
  const startups = [
    { id: 1, name: "Kwanza Pay", sector: "Fintech", score: 94, ask: "25k - 50k", desc: "Solução de pagamentos móveis para mercados informais em Luanda.", location: "Luanda" },
    { id: 2, name: "AgroFácil", sector: "AgriTech", score: 88, ask: "10k - 30k", desc: "Monitoramento de colheitas via satélite para pequenos produtores.", location: "Huambo" },
    { id: 3, name: "EduAngo", sector: "EdTech", score: 82, ask: "15k - 20k", desc: "Plataforma de cursos técnicos offline para zonas remotas.", location: "Benguela" },
    { id: 4, name: "Saúde Já", sector: "HealthTech", score: 91, ask: "50k+", desc: "Telemedicina conectando especialistas a postos de saúde provinciais.", location: "Cabinda" }
  ];

  return `
    <div class="marketplace-wrapper">
      <div class="dashboard-card" style="margin-bottom: 25px; padding: 20px;">
        <div style="display: flex; gap: 15px; flex-wrap: wrap; align-items: flex-end;">
          <div style="flex: 2; min-width: 250px;">
            <label style="display:block; margin-bottom:5px; font-weight:600;">Pesquisar Startup</label>
            <input type="text" placeholder="Ex: Fintech ou nome da empresa..." style="width:100%; padding:10px; border-radius:8px; border:1px solid #ddd;">
          </div>
          <div style="flex: 1; min-width: 150px;">
            <label style="display:block; margin-bottom:5px; font-weight:600;">Setor</label>
            <select style="width:100%; padding:10px; border-radius:8px; border:1px solid #ddd;">
              <option>Todos os Setores</option>
              <option>Fintech</option>
              <option>AgriTech</option>
              <option>EdTech</option>
            </select>
          </div>
          <div style="flex: 1; min-width: 150px;">
            <label style="display:block; margin-bottom:5px; font-weight:600;">Score IA Mínimo</label>
            <select style="width:100%; padding:10px; border-radius:8px; border:1px solid #ddd;">
              <option>Qualquer um</option>
              <option>80+</option>
              <option>90+</option>
            </select>
          </div>
          <button class="btn btn-primary" style="height: 42px;">Filtrar</button>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px;">
        ${startups.map(s => `
          <div class="dashboard-card" style="display: flex; flex-direction: column; justify-content: space-between; transition: transform 0.2s; cursor: pointer;" onmouseover="this.style.transform='translateY(-5px)'" onmouseout="this.style.transform='translateY(0)'">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px;">
                <div style="width: 50px; height: 50px; background: #eee; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #2563eb;">${s.name.charAt(0)}</div>
                <div style="text-align: right;">
                  <span class="badge badge-success" style="font-size: 0.8rem;">Score IA: ${s.score}</span>
                  <div style="font-size: 0.75rem; color: #666; margin-top: 5px;">${s.location}, Angola</div>
                </div>
              </div>
              
              <h3 style="margin: 0 0 10px 0;">${s.name}</h3>
              <span style="display: inline-block; padding: 2px 8px; background: #eef2ff; color: #4338ca; border-radius: 4px; font-size: 0.75rem; font-weight: 600; margin-bottom: 15px;">${s.sector}</span>
              <p style="font-size: 0.9rem; color: #666; line-height: 1.5; margin-bottom: 20px;">${s.desc}</p>
            </div>

            <div style="border-top: 1px solid #eee; padding-top: 15px; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <span style="display: block; font-size: 0.7rem; color: #999; text-transform: uppercase;">Ticket de Investimento</span>
                <strong style="color: #10b981;">${s.ask}</strong>
              </div>
              <button class="btn btn-primary" style="padding: 8px 15px; font-size: 0.85rem;" onclick="alert('Abrindo detalhes de ${s.name}...')">Ver mais</button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}
function getMyInvestmentsContent() {
  const myPortfolio = [
    { id: 1, startup: "Kwanza Pay", equity: "5%", invested: "$25,000", currentVal: "$45,000", status: "Em Crescimento", roi: "+80%" },
    { id: 2, startup: "AgroFácil", equity: "10%", invested: "$15,000", currentVal: "$18,500", status: "Estável", roi: "+23%" },
    { id: 3, startup: "TechEdu Angola", equity: "2%", invested: "$10,000", currentVal: "$9,000", status: "Risco", roi: "-10%" }
  ];

  return `
    <div class="portfolio-container">
      <div class="stats-grid" style="margin-bottom: 25px;">
        <div class="stat-card">
          <div class="stat-card-content">
            <div class="stat-info">
              <div class="stat-label">Total Alocado</div>
              <div class="stat-value">$50,000</div>
              <div class="stat-change">3 Startups ativas</div>
            </div>
            <div class="stat-icon-wrapper stat-icon-success">
              ${icons['dollar-sign']}
            </div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-card-content">
            <div class="stat-info">
              <div class="stat-label">Valorização Total</div>
              <div class="stat-value">$72,500</div>
              <div class="stat-change" style="color: #10b981;">↑ $22,500 (45%)</div>
            </div>
            <div class="stat-icon-wrapper stat-icon-primary">
              ${icons['trending-up']}
            </div>
          </div>
        </div>
      </div>

      <div class="dashboard-card">
        <div class="dashboard-card-header" style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h3 class="dashboard-card-title">Detalhamento do Portfólio</h3>
            <p class="dashboard-card-description">Acompanhamento de participação e ROI por startup.</p>
          </div>
          <button class="btn" style="background: #f4f7fe; color: #2563eb; font-weight: 600; border: none; padding: 10px 15px; border-radius: 8px;">
            Baixar Extrato
          </button>
        </div>

        <div style="overflow-x: auto; margin-top: 20px;">
          <table class="data-table">
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
              ${myPortfolio.map(item => `
                <tr>
                  <td><strong>${item.startup}</strong></td>
                  <td>${item.equity}</td>
                  <td>${item.invested}</td>
                  <td>${item.currentVal}</td>
                  <td style="color: ${item.roi.startsWith('+') ? '#10b981' : '#ef4444'}; font-weight: 600;">
                    ${item.roi}
                  </td>
                  <td>
                    <span class="badge ${item.status === 'Risco' ? 'badge-warning' : 'badge-success'}">
                      ${item.status}
                    </span>
                  </td>
                  <td>
                    <button class="btn" style="padding: 5px 10px; font-size: 0.75rem; background: #eee;" onclick="alert('Abrindo relatórios da ${item.startup}')">
                      Relatórios
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}
function getPropostasContent() {
  return `
    <div style="display: grid; grid-template-columns: 350px 1fr; gap: 20px; height: calc(100vh - 180px); min-height: 500px;">
      
      <div class="dashboard-card" style="display: flex; flex-direction: column; padding: 0; overflow: hidden;">
        <div style="padding: 20px; border-bottom: 1px solid #eee;">
          <h3 style="margin: 0; font-size: 1.1rem;">Solicitações Recebidas</h3>
          <p style="margin: 5px 0 0 0; font-size: 0.8rem; color: #666;">Você tem 2 propostas pendentes</p>
        </div>
        
        <div style="overflow-y: auto; flex: 1;">
          <div class="proposta-item active" style="padding: 15px; border-bottom: 1px solid #eee; cursor: pointer; background: #f8faff; border-left: 4px solid #2563eb;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
              <strong style="font-size: 0.9rem;">SolarPay Angola</strong>
              <span style="font-size: 0.7rem; color: #999;">Hoje</span>
            </div>
            <p style="margin: 0; font-size: 0.85rem; color: #444; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Proposta de Equity: 5% por $25k</p>
            <span class="badge badge-warning" style="font-size: 0.65rem; margin-top: 5px;">Pendente</span>
          </div>

          <div class="proposta-item" style="padding: 15px; border-bottom: 1px solid #eee; cursor: pointer;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
              <strong style="font-size: 0.9rem;">AgroFácil</strong>
              <span style="font-size: 0.7rem; color: #999;">Ontem</span>
            </div>
            <p style="margin: 0; font-size: 0.85rem; color: #444;">Solicitação de Mentoria e Aporte</p>
            <span class="badge badge-success" style="font-size: 0.65rem; margin-top: 5px;">Em conversa</span>
          </div>
        </div>
      </div>

      <div class="dashboard-card" style="display: flex; flex-direction: column; padding: 0; overflow: hidden;">
        
        <div style="padding: 15px 20px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; background: #fff;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 40px; height: 40px; background: #2563eb; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">S</div>
            <div>
              <h4 style="margin: 0;">SolarPay Angola</h4>
              <span style="font-size: 0.75rem; color: #10b981;">Score IA: 92/100</span>
            </div>
          </div>
          <div style="display: flex; gap: 10px;">
            <button class="btn" style="background: #fee2e2; color: #ef4444; border: none; padding: 8px 15px; border-radius: 6px; font-weight: 600;" onclick="alert('Proposta Recusada')">Recusar</button>
            <button class="btn btn-primary" style="padding: 8px 15px; border-radius: 6px;" onclick="alert('Proposta Aceite! Iniciando Due Diligence...')">Aceitar Proposta</button>
          </div>
        </div>

        <div style="flex: 1; padding: 20px; background: #f9fafb; overflow-y: auto; display: flex; flex-direction: column; gap: 15px;">
          <div style="align-self: flex-start; background: white; padding: 12px; border-radius: 12px; border-bottom-left-radius: 2px; max-width: 70%; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
            <p style="margin: 0; font-size: 0.9rem;">Olá, Maria Investidora! Enviamos nosso pitch deck atualizado. Estamos buscando 25.000 USD para expansão em Benguela em troca de 5% de equity.</p>
            <span style="font-size: 0.7rem; color: #999; margin-top: 5px; display: block;">10:30 AM</span>
          </div>

          <div style="align-self: flex-end; background: #2563eb; color: white; padding: 12px; border-radius: 12px; border-bottom-right-radius: 2px; max-width: 70%;">
            <p style="margin: 0; font-size: 0.9rem;">Obrigada pelo envio! Analisando o Score IA de vocês, parece promissor. Podemos agendar uma call amanhã?</p>
            <span style="font-size: 0.7rem; color: #e0e7ff; margin-top: 5px; display: block;">10:45 AM</span>
          </div>
        </div>

        <div style="padding: 15px; border-top: 1px solid #eee; background: white; display: flex; gap: 10px;">
          <input type="text" placeholder="Escreva sua mensagem ou contraproposta..." style="flex: 1; padding: 10px; border: 1px solid #ddd; border-radius: 8px; outline: none;">
          <button class="btn btn-primary" style="padding: 0 20px;">Enviar</button>
        </div>
      </div>
    </div>

    <style>
      .proposta-item:hover { background: #f4f7fe; }
      .badge-warning { background: #fef3c7; color: #92400e; }
      .badge-success { background: #dcfce7; color: #166534; }
    </style>
  `;
}
function getAnalyticsContent() {
  return `
    <div class="analytics-container">
      <div class="dashboard-card" style="margin-bottom: 25px; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h3 style="margin: 0;">Análise de Mercado & Performance</h3>
          <p style="margin: 5px 0 0 0; color: #666; font-size: 0.85rem;">Dados baseados em tendências reais do ecossistema AngoStart.</p>
        </div>
        <select class="input-field" style="padding: 8px 15px; border-radius: 8px; border: 1px solid #ddd;">
          <option>Últimos 12 meses</option>
          <option>Últimos 6 meses</option>
          <option>Este Ano (2026)</option>
        </select>
      </div>

      <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 20px; margin-bottom: 25px;">
        
        <div class="dashboard-card">
          <h4 class="dashboard-card-title">Crescimento Médio do Portfólio</h4>
          <p class="dashboard-card-description">Evolução do valuation das suas startups investidas.</p>
          
          <div style="height: 200px; margin-top: 30px; display: flex; align-items: flex-end; justify-content: space-between; padding: 0 10px; border-bottom: 2px solid #eee; border-left: 2px solid #eee;">
            <div style="width: 10%; background: #e0e7ff; height: 30%; border-radius: 4px 4px 0 0;" title="Jan"></div>
            <div style="width: 10%; background: #e0e7ff; height: 45%; border-radius: 4px 4px 0 0;" title="Fev"></div>
            <div style="width: 10%; background: #e0e7ff; height: 40%; border-radius: 4px 4px 0 0;" title="Mar"></div>
            <div style="width: 10%; background: #2563eb; height: 65%; border-radius: 4px 4px 0 0;" title="Abr"></div>
            <div style="width: 10%; background: #2563eb; height: 85%; border-radius: 4px 4px 0 0;" title="Mai"></div>
            <div style="width: 10%; background: #10b981; height: 95%; border-radius: 4px 4px 0 0;" title="Jun"></div>
          </div>
          <div style="display: flex; justify-content: space-between; margin-top: 10px; font-size: 0.75rem; color: #999;">
            <span>Jan</span><span>Fev</span><span>Mar</span><span>Abr</span><span>Mai</span><span>Jun</span>
          </div>
        </div>

        <div class="dashboard-card">
          <h4 class="dashboard-card-title">Setores em Alta (Angola)</h4>
          <div style="margin-top: 15px;">
            <div style="margin-bottom: 15px;">
              <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 5px;">
                <span>Fintech</span>
                <span style="color: #10b981; font-weight: bold;">+42%</span>
              </div>
              <div style="width: 100%; background: #eee; height: 8px; border-radius: 4px;">
                <div style="width: 90%; background: #10b981; height: 100%; border-radius: 4px;"></div>
              </div>
            </div>
            <div style="margin-bottom: 15px;">
              <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 5px;">
                <span>AgriTech</span>
                <span style="color: #10b981; font-weight: bold;">+28%</span>
              </div>
              <div style="width: 100%; background: #eee; height: 8px; border-radius: 4px;">
                <div style="width: 65%; background: #2563eb; height: 100%; border-radius: 4px;"></div>
              </div>
            </div>
            <div style="margin-bottom: 15px;">
              <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 5px;">
                <span>EdTech</span>
                <span style="color: #f59e0b; font-weight: bold;">+12%</span>
              </div>
              <div style="width: 100%; background: #eee; height: 8px; border-radius: 4px;">
                <div style="width: 40%; background: #f59e0b; height: 100%; border-radius: 4px;"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="dashboard-card">
        <h3 class="dashboard-card-title">Análise Comparativa de Risco (Score IA)</h3>
        <div style="overflow-x: auto; margin-top: 20px;">
          <table class="data-table">
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
                <td><span style="color: #10b981;">↑ 15%</span></td>
                <td><span class="badge badge-success">92</span></td>
                <td>95.5</td>
                <td style="color: #10b981;">Baixo</td>
              </tr>
              <tr>
                <td><strong>Kwanza Pay</strong></td>
                <td>Fintech</td>
                <td><span style="color: #10b981;">↑ 8%</span></td>
                <td><span class="badge badge-success">88</span></td>
                <td>91.2</td>
                <td style="color: #10b981;">Baixo</td>
              </tr>
              <tr>
                <td><strong>AgroFácil</strong></td>
                <td>AgriTech</td>
                <td><span style="color: #ef4444;">↓ 2%</span></td>
                <td><span class="badge badge-warning">75</span></td>
                <td>78.0</td>
                <td style="color: #f59e0b;">Médio</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function getInvestidorPerfilContent() {
  return `
    <div style="max-width: 900px; margin: 0 auto;">
      <div class="dashboard-card" style="padding: 0; overflow: hidden; margin-bottom: 25px;">
        <div style="height: 120px; background: linear-gradient;"></div>
        <div style="padding: 0 30px 30px 30px; margin-top: -50px; display: flex; align-items: flex-end; gap: 20px;">
          <div style="width: 120px; height: 120px; border-radius: 50%; border: 5px solid #fff; background: #eee; overflow: hidden;">
            <img src="../img/Jovem empresário africano feliz _ Foto Grátis.jpg" alt="Foto de Perfil">
          </div>
          <div style="flex: 1; padding-bottom: 10px;">
            <h2 style="margin: 0; color: var(--text-main);">Maria Investidora</h2>
            <p style="margin: 5px 0 0 0; color: #666;">Investidora Anjo • Luanda, Angola</p>
          </div>
          <div style="padding-bottom: 10px;">
            <button class="btn btn-primary" onclick="alert('Funcionalidade de edição aberta!')">Editar Perfil</button>
          </div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 25px;">
        
        <div style="display: flex; flex-direction: column; gap: 25px;">
          <div class="dashboard-card">
            <h4 style="margin-top: 0;">Status de Verificação</h4>
            <div style="display: flex; align-items: center; gap: 10px; color: #10b981; font-weight: 600;">
              <span style="font-size: 1.2rem;">✔</span> Conta Verificada
            </div>
            <p style="font-size: 0.8rem; color: #999; margin-top: 10px;">Identidade e fundos validados pela AngoStart.</p>
          </div>

          <div class="dashboard-card">
            <h4 style="margin-top: 0;">Tese de Investimento</h4>
            <ul style="padding-left: 20px; font-size: 0.9rem; color: #444; line-height: 1.6;">
              <li>Foco em Fintech e EdTech</li>
              <li>Tickets de 10k a 50k</li>
              <li>Busca por impacto social</li>
              <li>Zonas: Luanda e Huambo</li>
            </ul>
          </div>
        </div>

        <div class="dashboard-card">
          <h3 class="dashboard-card-title">Biografia Profissional</h3>
          <p style="line-height: 1.6; color: #444;">
            Especialista em finanças com mais de 15 anos de experiência no setor bancário angolano. 
            Atualmente focada em apoiar empreendedores locais que resolvem problemas de inclusão financeira 
            e digitalização de processos tradicionais.
          </p>

          <hr style="border: 0; border-top: 1px solid #eee; margin: 25px 0;">

          <h3 class="dashboard-card-title">Informações de Contato</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 15px;">
            <div>
              <label style="font-size: 0.8rem; color: #999; display: block;">E-mail</label>
              <strong>maria.invest@exemplo.ao</strong>
            </div>
            <div>
              <label style="font-size: 0.8rem; color: #999; display: block;">Telefone</label>
              <strong>+244 9XX XXX XXX</strong>
            </div>
            <div>
              <label style="font-size: 0.8rem; color: #999; display: block;">LinkedIn</label>
              <a href="#" style="color: #2563eb; text-decoration: none;">linkedin.com/in/maria-inv</a>
            </div>
            <div>
              <label style="font-size: 0.8rem; color: #999; display: block;">Website</label>
              <strong>www.meufundo.ao</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function getUsersManagementContent() {
  return `
    <div class="dashboard-card">
      <div class="dashboard-card-header" style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h3 class="dashboard-card-title">Gerenciamento de Usuários</h3>
          <p class="dashboard-card-description">Visualize e gerencie todos os usuários cadastrados na plataforma.</p>
        </div>
        <button class="btn btn-primary" onclick="alert('Abrir modal de novo usuário')"> + Novo Usuário</button>
      </div>
      
      <div style="margin-top: 20px;">
        <table class="data-table">
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
            ${generateUserTableRows()}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// Função auxiliar para não poluir o HTML principal
function generateUserTableRows() {
  const mockUsers = [
    { name: 'João Empreendedor', email: 'empreendedor@angostart.com', role: 'Empreendedor', status: 'Ativo' },
    { name: 'Maria Investidora', email: 'investidor@angostart.com', role: 'Investidor', status: 'Ativo' },
    { name: 'Carlos Mentor', email: 'mentor@angostart.com', role: 'Mentor', status: 'Pendente' }
  ];

  return mockUsers.map(u => `
    <tr>
      <td><strong>${u.name}</strong></td>
      <td>${u.email}</td>
      <td><span class="badge badge-primary">${u.role}</span></td>
      <td><span class="badge ${u.status === 'Ativo' ? 'badge-success' : 'badge-warning'}">${u.status}</span></td>
      <td>
        <button class="btn" style="padding: 2px 8px; background: #eee;">Editar</button>
        <button class="btn" style="padding: 2px 8px; background: #ffebee; color: red;">Bloquear</button>
      </td>
    </tr>
  `).join('');
}
function getSubmitIdeaForm() {
  return `
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
function getReportsContent() {
  return `
    <div class="reports-container">
      <div class="dashboard-card" style="margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between; gap: 15px; flex-wrap: wrap;">
        <div>
          <h3 style="margin: 0;">Análise de Performance</h3>
          <p style="margin: 0; color: #666; font-size: 0.9rem;">Relatórios detalhados da plataforma</p>
        </div>
        <div style="display: flex; gap: 10px; align-items: center;">
          <label>Mês de Referência:</label>
          <select id="monthFilter" class="input-field" style="padding: 5px 10px; border-radius: 5px; border: 1px solid #ddd;">
            <option value="janeiro-2026">Janeiro 2026</option>
            <option value="dezembro-2025">Dezembro 2025</option>
            <option value="novembro-2025">Novembro 2025</option>
          </select>
          <button class="btn btn-primary" onclick="alert('Relatório exportado em PDF!')" style="padding: 5px 15px;">Exportar PDF</button>
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-card-content">
            <div class="stat-info">
              <div class="stat-label">Ideias no Mês</div>
              <div class="stat-value" id="totalIdeas">142</div>
              <div class="stat-change" style="color: #10b981;">↑ 12% vs mês passado</div>
            </div>
            <div class="stat-icon-wrapper stat-icon-primary">
              ${icons.lightbulb}
            </div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-card-content">
            <div class="stat-info">
              <div class="stat-label">Novos Cadastros</div>
              <div class="stat-value">87</div>
              <div class="stat-change">Total este mês</div>
            </div>
            <div class="stat-icon-wrapper stat-icon-info">
              ${icons.user}
            </div>
          </div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 20px;">
        <div class="dashboard-card">
          <h3 class="dashboard-card-title">Distribuição de Usuários</h3>
          <p class="dashboard-card-description">Divisão por tipo de perfil</p>
          
          <div style="margin-top: 20px;">
            <div style="margin-bottom: 15px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span>Empreendedores</span>
                <strong>650</strong>
              </div>
              <div style="width: 100%; background: #eee; height: 10px; border-radius: 5px;">
                <div style="width: 65%; background: var(--primary-color, #2563eb); height: 100%; border-radius: 5px;"></div>
              </div>
            </div>

            <div style="margin-bottom: 15px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span>Investidores</span>
                <strong>120</strong>
              </div>
              <div style="width: 100%; background: #eee; height: 10px; border-radius: 5px;">
                <div style="width: 25%; background: #10b981; height: 100%; border-radius: 5px;"></div>
              </div>
            </div>

            <div style="margin-bottom: 15px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span>Mentores</span>
                <strong>45</strong>
              </div>
              <div style="width: 100%; background: #eee; height: 10px; border-radius: 5px;">
                <div style="width: 15%; background: #f59e0b; height: 100%; border-radius: 5px;"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="dashboard-card">
          <h3 class="dashboard-card-title">Atividade Recente</h3>
          <div style="margin-top: 15px;">
            <ul style="list-style: none; padding: 0;">
              <li style="padding: 10px 0; border-bottom: 1px solid #eee; display: flex; justify-content: space-between;">
                <span>Sessões de Mentoria</span>
                <strong>28</strong>
              </li>
              <li style="padding: 10px 0; border-bottom: 1px solid #eee; display: flex; justify-content: space-between;">
                <span>Investimentos Feitos</span>
                <strong>14</strong>
              </li>
              <li style="padding: 10px 0; border-bottom: 1px solid #eee; display: flex; justify-content: space-between;">
                <span>Taxa de Aprovação</span>
                <strong>78%</strong>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `;
}
function getConfiguracoesContent() {
  
  const isDarkMode = document.body.classList.contains('dark-theme');

  return `
    <div class="dashboard-card" style="max-width: 700px; margin: 0 auto;">
      <div class="dashboard-card-header">
        <h3 class="dashboard-card-title">Configurações do Sistema</h3>
        <p class="dashboard-card-description">Personalize sua experiência na plataforma AngoStart.</p>
      </div>

      <div style="padding: 20px;">
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 15px 0; border-bottom: 1px solid #eee;">
          <div>
            <h4 style="margin: 0;">Modo Escuro</h4>
            <p style="margin: 0; font-size: 0.85rem; color: #666;">Altera a aparência do site para cores escuras.</p>
          </div>
          <label class="switch">
            <input type="checkbox" id="darkModeToggle" ${isDarkMode ? 'checked' : ''}>
            <span class="slider round"></span>
          </label>
        </div>

        <div style="display: flex; align-items: center; justify-content: space-between; padding: 15px 0; border-bottom: 1px solid #eee;">
          <div>
            <h4 style="margin: 0;">Idioma do Sistema</h4>
            <p style="margin: 0; font-size: 0.85rem; color: #666;">Escolha o idioma das interfaces.</p>
          </div>
          <select id="languageSelect" class="input-field" style="padding: 8px; border-radius: 6px; border: 1px solid #ddd;">
            <option value="pt">Português (AO)</option>
            <option value="en">English (US)</option>
            <option value="fr">Français</option>
          </select>
        </div>

        <div style="display: flex; align-items: center; justify-content: space-between; padding: 15px 0; border-bottom: 1px solid #eee;">
          <div>
            <h4 style="margin: 0;">Notificações por Email</h4>
            <p style="margin: 0; font-size: 0.85rem; color: #666;">Receba alertas de novos investidores e mensagens.</p>
          </div>
          <label class="switch">
            <input type="checkbox" checked>
            <span class="slider round"></span>
          </label>
        </div>

        <div style="margin-top: 30px;">
          <button class="btn btn-primary" onclick="alert('Configurações salvas com sucesso!')">Salvar Alterações</button>
        </div>
      </div>
    </div>

    
  `;
}

function getMarketplaceContent() {
  const startups = [
    { id: 1, name: "Kwanza Pay", sector: "Fintech", score: 94, ask: "25k - 50k", desc: "Solução de pagamentos móveis para mercados informais em Luanda.", location: "Luanda" },
    { id: 2, name: "AgroFácil", sector: "AgriTech", score: 88, ask: "10k - 30k", desc: "Monitoramento de colheitas via satélite para pequenos produtores.", location: "Huambo" },
    { id: 3, name: "EduAngo", sector: "EdTech", score: 82, ask: "15k - 20k", desc: "Plataforma de cursos técnicos offline para zonas remotas.", location: "Benguela" },
    { id: 4, name: "Saúde Já", sector: "HealthTech", score: 91, ask: "50k+", desc: "Telemedicina conectando especialistas a postos de saúde provinciais.", location: "Cabinda" }
  ];

  return `
    <div class="marketplace-wrapper">
      <div class="dashboard-card" style="margin-bottom: 25px; padding: 20px;">
        <div style="display: flex; gap: 15px; flex-wrap: wrap; align-items: flex-end;">
          <div style="flex: 2; min-width: 250px;">
            <label style="display:block; margin-bottom:5px; font-weight:600;">Pesquisar Startup</label>
            <input type="text" placeholder="Ex: Fintech ou nome da empresa..." style="width:100%; padding:10px; border-radius:8px; border:1px solid #ddd;">
          </div>
          <div style="flex: 1; min-width: 150px;">
            <label style="display:block; margin-bottom:5px; font-weight:600;">Setor</label>
            <select style="width:100%; padding:10px; border-radius:8px; border:1px solid #ddd;">
              <option>Todos os Setores</option>
              <option>Fintech</option>
              <option>AgriTech</option>
              <option>EdTech</option>
            </select>
          </div>
          <div style="flex: 1; min-width: 150px;">
            <label style="display:block; margin-bottom:5px; font-weight:600;">Score IA Mínimo</label>
            <select style="width:100%; padding:10px; border-radius:8px; border:1px solid #ddd;">
              <option>Qualquer um</option>
              <option>80+</option>
              <option>90+</option>
            </select>
          </div>
          <button class="btn btn-primary" style="height: 42px;">Filtrar</button>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px;">
        ${startups.map(s => `
          <div class="dashboard-card" style="display: flex; flex-direction: column; justify-content: space-between; transition: transform 0.2s; cursor: pointer;" onmouseover="this.style.transform='translateY(-5px)'" onmouseout="this.style.transform='translateY(0)'">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px;">
                <div style="width: 50px; height: 50px; background: #eee; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #2563eb;">${s.name.charAt(0)}</div>
                <div style="text-align: right;">
                  <span class="badge badge-success" style="font-size: 0.8rem;">Score IA: ${s.score}</span>
                  <div style="font-size: 0.75rem; color: #666; margin-top: 5px;">${s.location}, Angola</div>
                </div>
              </div>
              
              <h3 style="margin: 0 0 10px 0;">${s.name}</h3>
              <span style="display: inline-block; padding: 2px 8px; background: #eef2ff; color: #4338ca; border-radius: 4px; font-size: 0.75rem; font-weight: 600; margin-bottom: 15px;">${s.sector}</span>
              <p style="font-size: 0.9rem; color: #666; line-height: 1.5; margin-bottom: 20px;">${s.desc}</p>
            </div>

            <div style="border-top: 1px solid #eee; padding-top: 15px; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <span style="display: block; font-size: 0.7rem; color: #999; text-transform: uppercase;">Ticket de Investimento</span>
                <strong style="color: #10b981;">${s.ask}</strong>
              </div>
              <button class="btn btn-primary" style="padding: 8px 15px; font-size: 0.85rem;" onclick="alert('Abrindo detalhes de ${s.name}...')">Ver mais</button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}
function getMyInvestmentsContent() {
  const myPortfolio = [
    { id: 1, startup: "Kwanza Pay", equity: "5%", invested: "$25,000", currentVal: "$45,000", status: "Em Crescimento", roi: "+80%" },
    { id: 2, startup: "AgroFácil", equity: "10%", invested: "$15,000", currentVal: "$18,500", status: "Estável", roi: "+23%" },
    { id: 3, startup: "TechEdu Angola", equity: "2%", invested: "$10,000", currentVal: "$9,000", status: "Risco", roi: "-10%" }
  ];

  return `
    <div class="portfolio-container">
      <div class="stats-grid" style="margin-bottom: 25px;">
        <div class="stat-card">
          <div class="stat-card-content">
            <div class="stat-info">
              <div class="stat-label">Total Alocado</div>
              <div class="stat-value">$50,000</div>
              <div class="stat-change">3 Startups ativas</div>
            </div>
            <div class="stat-icon-wrapper stat-icon-success">
              ${icons['dollar-sign']}
            </div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-card-content">
            <div class="stat-info">
              <div class="stat-label">Valorização Total</div>
              <div class="stat-value">$72,500</div>
              <div class="stat-change" style="color: #10b981;">↑ $22,500 (45%)</div>
            </div>
            <div class="stat-icon-wrapper stat-icon-primary">
              ${icons['trending-up']}
            </div>
          </div>
        </div>
      </div>

      <div class="dashboard-card">
        <div class="dashboard-card-header" style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h3 class="dashboard-card-title">Detalhamento do Portfólio</h3>
            <p class="dashboard-card-description">Acompanhamento de participação e ROI por startup.</p>
          </div>
          <button class="btn" style="background: #f4f7fe; color: #2563eb; font-weight: 600; border: none; padding: 10px 15px; border-radius: 8px;">
            Baixar Extrato
          </button>
        </div>

        <div style="overflow-x: auto; margin-top: 20px;">
          <table class="data-table">
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
              ${myPortfolio.map(item => `
                <tr>
                  <td><strong>${item.startup}</strong></td>
                  <td>${item.equity}</td>
                  <td>${item.invested}</td>
                  <td>${item.currentVal}</td>
                  <td style="color: ${item.roi.startsWith('+') ? '#10b981' : '#ef4444'}; font-weight: 600;">
                    ${item.roi}
                  </td>
                  <td>
                    <span class="badge ${item.status === 'Risco' ? 'badge-warning' : 'badge-success'}">
                      ${item.status}
                    </span>
                  </td>
                  <td>
                    <button class="btn" style="padding: 5px 10px; font-size: 0.75rem; background: #eee;" onclick="alert('Abrindo relatórios da ${item.startup}')">
                      Relatórios
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}
function getPropostasContent() {
  return `
    <div style="display: grid; grid-template-columns: 350px 1fr; gap: 20px; height: calc(100vh - 180px); min-height: 500px;">
      
      <div class="dashboard-card" style="display: flex; flex-direction: column; padding: 0; overflow: hidden;">
        <div style="padding: 20px; border-bottom: 1px solid #eee;">
          <h3 style="margin: 0; font-size: 1.1rem;">Solicitações Recebidas</h3>
          <p style="margin: 5px 0 0 0; font-size: 0.8rem; color: #666;">Você tem 2 propostas pendentes</p>
        </div>
        
        <div style="overflow-y: auto; flex: 1;">
          <div class="proposta-item active" style="padding: 15px; border-bottom: 1px solid #eee; cursor: pointer; background: #f8faff; border-left: 4px solid #2563eb;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
              <strong style="font-size: 0.9rem;">SolarPay Angola</strong>
              <span style="font-size: 0.7rem; color: #999;">Hoje</span>
            </div>
            <p style="margin: 0; font-size: 0.85rem; color: #444; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Proposta de Equity: 5% por $25k</p>
            <span class="badge badge-warning" style="font-size: 0.65rem; margin-top: 5px;">Pendente</span>
          </div>

          <div class="proposta-item" style="padding: 15px; border-bottom: 1px solid #eee; cursor: pointer;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
              <strong style="font-size: 0.9rem;">AgroFácil</strong>
              <span style="font-size: 0.7rem; color: #999;">Ontem</span>
            </div>
            <p style="margin: 0; font-size: 0.85rem; color: #444;">Solicitação de Mentoria e Aporte</p>
            <span class="badge badge-success" style="font-size: 0.65rem; margin-top: 5px;">Em conversa</span>
          </div>
        </div>
      </div>

      <div class="dashboard-card" style="display: flex; flex-direction: column; padding: 0; overflow: hidden;">
        
        <div style="padding: 15px 20px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; background: #fff;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 40px; height: 40px; background: #2563eb; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">S</div>
            <div>
              <h4 style="margin: 0;">SolarPay Angola</h4>
              <span style="font-size: 0.75rem; color: #10b981;">Score IA: 92/100</span>
            </div>
          </div>
          <div style="display: flex; gap: 10px;">
            <button class="btn" style="background: #fee2e2; color: #ef4444; border: none; padding: 8px 15px; border-radius: 6px; font-weight: 600;" onclick="alert('Proposta Recusada')">Recusar</button>
            <button class="btn btn-primary" style="padding: 8px 15px; border-radius: 6px;" onclick="alert('Proposta Aceite! Iniciando Due Diligence...')">Aceitar Proposta</button>
          </div>
        </div>

        <div style="flex: 1; padding: 20px; background: #f9fafb; overflow-y: auto; display: flex; flex-direction: column; gap: 15px;">
          <div style="align-self: flex-start; background: white; padding: 12px; border-radius: 12px; border-bottom-left-radius: 2px; max-width: 70%; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
            <p style="margin: 0; font-size: 0.9rem;">Olá, Maria Investidora! Enviamos nosso pitch deck atualizado. Estamos buscando 25.000 USD para expansão em Benguela em troca de 5% de equity.</p>
            <span style="font-size: 0.7rem; color: #999; margin-top: 5px; display: block;">10:30 AM</span>
          </div>

          <div style="align-self: flex-end; background: #2563eb; color: white; padding: 12px; border-radius: 12px; border-bottom-right-radius: 2px; max-width: 70%;">
            <p style="margin: 0; font-size: 0.9rem;">Obrigada pelo envio! Analisando o Score IA de vocês, parece promissor. Podemos agendar uma call amanhã?</p>
            <span style="font-size: 0.7rem; color: #e0e7ff; margin-top: 5px; display: block;">10:45 AM</span>
          </div>
        </div>

        <div style="padding: 15px; border-top: 1px solid #eee; background: white; display: flex; gap: 10px;">
          <input type="text" placeholder="Escreva sua mensagem ou contraproposta..." style="flex: 1; padding: 10px; border: 1px solid #ddd; border-radius: 8px; outline: none;">
          <button class="btn btn-primary" style="padding: 0 20px;">Enviar</button>
        </div>
      </div>
    </div>

    <style>
      .proposta-item:hover { background: #f4f7fe; }
      .badge-warning { background: #fef3c7; color: #92400e; }
      .badge-success { background: #dcfce7; color: #166534; }
    </style>
  `;
}
function getAnalyticsContent() {
  return `
    <div class="analytics-container">
      <div class="dashboard-card" style="margin-bottom: 25px; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h3 style="margin: 0;">Análise de Mercado & Performance</h3>
          <p style="margin: 5px 0 0 0; color: #666; font-size: 0.85rem;">Dados baseados em tendências reais do ecossistema AngoStart.</p>
        </div>
        <select class="input-field" style="padding: 8px 15px; border-radius: 8px; border: 1px solid #ddd;">
          <option>Últimos 12 meses</option>
          <option>Últimos 6 meses</option>
          <option>Este Ano (2026)</option>
        </select>
      </div>

      <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 20px; margin-bottom: 25px;">
        
        <div class="dashboard-card">
          <h4 class="dashboard-card-title">Crescimento Médio do Portfólio</h4>
          <p class="dashboard-card-description">Evolução do valuation das suas startups investidas.</p>
          
          <div style="height: 200px; margin-top: 30px; display: flex; align-items: flex-end; justify-content: space-between; padding: 0 10px; border-bottom: 2px solid #eee; border-left: 2px solid #eee;">
            <div style="width: 10%; background: #e0e7ff; height: 30%; border-radius: 4px 4px 0 0;" title="Jan"></div>
            <div style="width: 10%; background: #e0e7ff; height: 45%; border-radius: 4px 4px 0 0;" title="Fev"></div>
            <div style="width: 10%; background: #e0e7ff; height: 40%; border-radius: 4px 4px 0 0;" title="Mar"></div>
            <div style="width: 10%; background: #2563eb; height: 65%; border-radius: 4px 4px 0 0;" title="Abr"></div>
            <div style="width: 10%; background: #2563eb; height: 85%; border-radius: 4px 4px 0 0;" title="Mai"></div>
            <div style="width: 10%; background: #10b981; height: 95%; border-radius: 4px 4px 0 0;" title="Jun"></div>
          </div>
          <div style="display: flex; justify-content: space-between; margin-top: 10px; font-size: 0.75rem; color: #999;">
            <span>Jan</span><span>Fev</span><span>Mar</span><span>Abr</span><span>Mai</span><span>Jun</span>
          </div>
        </div>

        <div class="dashboard-card">
          <h4 class="dashboard-card-title">Setores em Alta (Angola)</h4>
          <div style="margin-top: 15px;">
            <div style="margin-bottom: 15px;">
              <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 5px;">
                <span>Fintech</span>
                <span style="color: #10b981; font-weight: bold;">+42%</span>
              </div>
              <div style="width: 100%; background: #eee; height: 8px; border-radius: 4px;">
                <div style="width: 90%; background: #10b981; height: 100%; border-radius: 4px;"></div>
              </div>
            </div>
            <div style="margin-bottom: 15px;">
              <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 5px;">
                <span>AgriTech</span>
                <span style="color: #10b981; font-weight: bold;">+28%</span>
              </div>
              <div style="width: 100%; background: #eee; height: 8px; border-radius: 4px;">
                <div style="width: 65%; background: #2563eb; height: 100%; border-radius: 4px;"></div>
              </div>
            </div>
            <div style="margin-bottom: 15px;">
              <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 5px;">
                <span>EdTech</span>
                <span style="color: #f59e0b; font-weight: bold;">+12%</span>
              </div>
              <div style="width: 100%; background: #eee; height: 8px; border-radius: 4px;">
                <div style="width: 40%; background: #f59e0b; height: 100%; border-radius: 4px;"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="dashboard-card">
        <h3 class="dashboard-card-title">Análise Comparativa de Risco (Score IA)</h3>
        <div style="overflow-x: auto; margin-top: 20px;">
          <table class="data-table">
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
                <td><span style="color: #10b981;">↑ 15%</span></td>
                <td><span class="badge badge-success">92</span></td>
                <td>95.5</td>
                <td style="color: #10b981;">Baixo</td>
              </tr>
              <tr>
                <td><strong>Kwanza Pay</strong></td>
                <td>Fintech</td>
                <td><span style="color: #10b981;">↑ 8%</span></td>
                <td><span class="badge badge-success">88</span></td>
                <td>91.2</td>
                <td style="color: #10b981;">Baixo</td>
              </tr>
              <tr>
                <td><strong>AgroFácil</strong></td>
                <td>AgriTech</td>
                <td><span style="color: #ef4444;">↓ 2%</span></td>
                <td><span class="badge badge-warning">75</span></td>
                <td>78.0</td>
                <td style="color: #f59e0b;">Médio</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function getInvestidorPerfilContent() {
  return `
    <div style="max-width: 900px; margin: 0 auto;">
      <div class="dashboard-card" style="padding: 0; overflow: hidden; margin-bottom: 25px;">
        <div style="height: 120px; background: linear-gradient;"></div>
        <div style="padding: 0 30px 30px 30px; margin-top: -50px; display: flex; align-items: flex-end; gap: 20px;">
          <div style="width: 120px; height: 120px; border-radius: 50%; border: 5px solid #fff; background: #eee; overflow: hidden;">
            <img src="../img/Jovem empresário africano feliz _ Foto Grátis.jpg" alt="Foto de Perfil">
          </div>
          <div style="flex: 1; padding-bottom: 10px;">
            <h2 style="margin: 0; color: var(--text-main);">Maria Investidora</h2>
            <p style="margin: 5px 0 0 0; color: #666;">Investidora Anjo • Luanda, Angola</p>
          </div>
          <div style="padding-bottom: 10px;">
            <button class="btn btn-primary" onclick="alert('Funcionalidade de edição aberta!')">Editar Perfil</button>
          </div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 25px;">
        
        <div style="display: flex; flex-direction: column; gap: 25px;">
          <div class="dashboard-card">
            <h4 style="margin-top: 0;">Status de Verificação</h4>
            <div style="display: flex; align-items: center; gap: 10px; color: #10b981; font-weight: 600;">
              <span style="font-size: 1.2rem;">✔</span> Conta Verificada
            </div>
            <p style="font-size: 0.8rem; color: #999; margin-top: 10px;">Identidade e fundos validados pela AngoStart.</p>
          </div>

          <div class="dashboard-card">
            <h4 style="margin-top: 0;">Tese de Investimento</h4>
            <ul style="padding-left: 20px; font-size: 0.9rem; color: #444; line-height: 1.6;">
              <li>Foco em Fintech e EdTech</li>
              <li>Tickets de 10k a 50k</li>
              <li>Busca por impacto social</li>
              <li>Zonas: Luanda e Huambo</li>
            </ul>
          </div>
        </div>

        <div class="dashboard-card">
          <h3 class="dashboard-card-title">Biografia Profissional</h3>
          <p style="line-height: 1.6; color: #444;">
            Especialista em finanças com mais de 15 anos de experiência no setor bancário angolano. 
            Atualmente focada em apoiar empreendedores locais que resolvem problemas de inclusão financeira 
            e digitalização de processos tradicionais.
          </p>

          <hr style="border: 0; border-top: 1px solid #eee; margin: 25px 0;">

          <h3 class="dashboard-card-title">Informações de Contato</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 15px;">
            <div>
              <label style="font-size: 0.8rem; color: #999; display: block;">E-mail</label>
              <strong>maria.invest@exemplo.ao</strong>
            </div>
            <div>
              <label style="font-size: 0.8rem; color: #999; display: block;">Telefone</label>
              <strong>+244 9XX XXX XXX</strong>
            </div>
            <div>
              <label style="font-size: 0.8rem; color: #999; display: block;">LinkedIn</label>
              <a href="#" style="color: #2563eb; text-decoration: none;">linkedin.com/in/maria-inv</a>
            </div>
            <div>
              <label style="font-size: 0.8rem; color: #999; display: block;">Website</label>
              <strong>www.meufundo.ao</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function getGenericPageContent(page) {
  return `
    <div className="empty-state">
      <div className="empty-state-icon">
        ${icons[page] || icons.home}
      </div>
      <h3 className="empty-state-title">${getPageTitle(page)}</h3>
      <p className="empty-state-description">
        Esta página está em desenvolvimento. O conteúdo será adicionado em breve.
      </p>
      <button className="btn btn-primary" onclick="loadPage('dashboard')">
        Voltar ao Dashboard
      </button>
    </div>
  `;
}

function toggleSidebar() {
  sidebar.classNameList.toggle('active');
  sidebarOverlay.classNameList.toggle('active');
}

function handleLogout() {
  if (confirm('Tem certeza que deseja sair?')) {
    localStorage.removeItem('angostart_user');
    window.location.href = 'index.html';
  }
}

// Initialize app
init();
