import React from 'react'

const Funcionalidades = () => {
  return (
      <section id="funcionalidades" className="section section-dark">
    <div className="container">
      <div className="section-header">
        <h2 className="section-title text-white">Funcionalidades Principais</h2>
        <p className="section-description text-white-muted">Tudo que você precisa para transformar sua ideia em realidade</p>
      </div>

      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon feature-icon-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-file-terminal-icon lucide-file-terminal"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/><path d="M14 2v5a1 1 0 0 0 1 1h5"/><path d="m8 16 2-2-2-2"/><path d="M12 18h4"/></svg>
          </div>
          <h4 className="feature-title">Análise por IA</h4>
          <p className="feature-description">Validação automática usando algoritmos avançados de machine learning</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon feature-icon-secondary">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
          </div>
          <h4 className="feature-title">Plano de Negócio</h4>
          <p className="feature-description">Gere planos de negócio profissionais em PDF automaticamente</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon feature-icon-success">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <h4 className="feature-title">Rede de Mentores</h4>
          <p className="feature-description">Acesso a mentores experientes em diversos setores de mercado</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon feature-icon-warning">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="1" x2="12" y2="23"/>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </div>
          <h4 className="feature-title">Marketplace de Investimentos</h4>
          <p className="feature-description">Conecte-se diretamente com investidores interessados no seu setor</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon feature-icon-info">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="22" y1="12" x2="2" y2="12"/>
              <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>
              <line x1="6" y1="16" x2="6.01" y2="16"/>
              <line x1="10" y1="16" x2="10.01" y2="16"/>
            </svg>
          </div>
          <h4 className="feature-title">Dashboard Completo</h4>
          <p className="feature-description">Acompanhe métricas, progresso e oportunidades em tempo real</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon feature-icon-primary">
           <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-message-square-text-icon lucide-message-square-text"><path d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z"/><path d="M7 11h10"/><path d="M7 15h6"/><path d="M7 7h8"/></svg>
          </div>
          <h4 className="feature-title">Chat Integrado</h4>
          <p className="feature-description">Comunique-se facilmente com mentores e investidores na plataforma</p>
        </div>
      </div>
    </div>
  </section>
  )
}

export default Funcionalidades