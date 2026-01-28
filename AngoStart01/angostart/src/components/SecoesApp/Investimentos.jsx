import React from 'react'

const Investimentos = () => {
  return (
      <section id="investimento" className="section section-dark">
    <div className="container">
      <div className="section-header">
        <h2 className="section-title text-white">OPORTUNIDADES DE INVESTIMENTO</h2>
        <p className="section-description text-white-muted">
          Descubra negócios promissores validados pela nossa IA
        </p>
      </div>

      <div className="investments-grid">
        <div className="investment-card">
          <div className="investment-badge">Agricultura</div>
          <h3 className="investment-title">AgriTech Solutions</h3>
          <div className="investment-details">
            <div className="detail-item">
              <span className="detail-label text-white-muted">Score IA</span>
              <span className="detail-value score-high">87/100</span>
            </div>
            <div className="detail-item">
              <span className="detail-label text-white-muted">Investimento</span>
              <span className="detail-value">50Kz - 100Kz</span>
            </div>
          </div>
          <p className="investment-description text-white-muted">
            Tecnologia para otimização da produção agrícola com IA.
          </p>
          <button className="btn btn-outline btn-block mt-4">
            Ver Detalhes
          </button>
        </div>

        <div className="investment-card featured">
          <div className="investment-badge">Educação</div>
          <h3 className="investment-title text-white">EduConnect</h3>
          <div className="investment-details">
            <div className="detail-item">
              <span className="detail-label text-white">Score IA</span>
              <span className="detail-value score-high">92/100</span>
            </div>
            <div className="detail-item">
              <span className="detail-label text-white">Investimento</span>
              <span className="detail-value text-white">3000Kz - 7500Kz</span>
            </div>
          </div>
          <p className="investment-description text-white">
            Plataforma de educação online para escolas em Angola.
          </p>
          <button className="btn btn-primary btn-block mt-4">
            Ver Detalhes
          </button>
        </div>

        <div className="investment-card">
          <div className="investment-badge">Saúde</div>
          <h3 className="investment-title">HealthPlus</h3>
          <div className="investment-details">
            <div className="detail-item">
              <span className="detail-label text-white-muted">Score IA</span>
              <span className="detail-value score-high">85/100</span>
            </div>
            <div className="detail-item">
              <span className="detail-label text-white-muted">Investimento</span>
              <span className="detail-value">1000Kz - 2000Kz</span>
            </div>
          </div>
          <p className="investment-description text-white-muted">
            Telemedicina e gestão de clínicas para o mercado angolano.
          </p>
          <button className="btn btn-outline btn-block mt-4">
            Ver Detalhes
          </button>
        </div>
      </div>

      <div className="text-center mt-8">
        <button className="btn btn-secondary btn-lg">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" className="mr-2">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
          </svg>
          Investir em startups
        </button>
      </div>
    </div>
  </section>
  )
}

export default Investimentos