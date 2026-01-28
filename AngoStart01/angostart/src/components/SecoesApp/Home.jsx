import React from 'react'

const home = () => {
  return (
        <section id="hero" className="hero-section">
    {/* <!-- Animated Background Elements --> */}
    <div className="hero-bg">
      <div className="bg-blob bg-blob-1"></div>
      <div className="bg-blob bg-blob-2"></div>
      <div className="grid-pattern"></div>
    </div>

    {/* <!-- Content --> */}
    <div className="container hero-container">
      <div className="hero-content">
        {/* <!-- Badge --> */}
        <div className="hero-badge fade-in">
          <svg className="badge-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 3l1.912 5.813a1 1 0 00.95.69h6.11l-4.944 3.594a1 1 0 00-.364 1.118L17.576 20l-4.944-3.594a1 1 0 00-1.176 0L6.512 20l1.912-5.813a1 1 0 00-.364-1.118L3.116 9.503h6.11a1 1 0 00.95-.69L12 3z"/>
          </svg>
          <span>Plataforma para empreendedores angolanos</span>
        </div>

        {/* <!-- Headline --> */}
        <h1 className="hero-headline fade-in-delay-1">
          Transforme ideias em <span className="gradient-text">negócios reais</span>
        </h1>

        {/* <!-- Subheadline --> */}
        <p className="hero-subheadline fade-in-delay-2">
          A plataforma que ajuda empreendedores angolanos a validar ideias, encontrar mentores e conectar-se a investidores.
        </p>

        {/* <!-- CTAs --> */}
        <div className="hero-ctas fade-in-delay-3">
          <button className="btn btn-cta-primary" onclick="showRegister()">
            Criar Conta
            <svg className="btn-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
          <button className="btn btn-cta-secondary">
            Explorar Ideias
          </button>
        </div>

        {/* <!-- Stats --> */}
        <div className="hero-stats fade-in-delay-4">
          <div className="stat-item">
            <div className="stat-value">500+</div>
            <div className="stat-label">Ideias Validadas</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">150+</div>
            <div className="stat-label">Mentores Ativos</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">$2M+</div>
            <div className="stat-label">Investimento Conectado</div>
          </div>
        </div>

        {/* <!-- Scroll Indicator --> */}
        <div className="scroll-indicator fade-in-delay-5">
          <div className="scroll-mouse">
            <div className="scroll-wheel"></div>
          </div>
        </div>
      </div>
    </div>

    {/* <!-- Decorative Elements --> */}
    <div className="decorative-square"></div>
    <div className="decorative-circle"></div>
  </section>
  )
}

export default home