import React from 'react'
import { Link } from 'react-router-dom'

const Investimentos = () => {

  return (
      <section id="investimento" className="section section-dark">
    <div className="container">
      <div className="section-header">
        <p className='mentor-subtitle'>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-chart-no-axes-combined-icon lucide-chart-no-axes-combined"><path d="M12 16v5"/><path d="M16 14v7"/><path d="M20 10v11"/><path d="m22 3-8.646 8.646a.5.5 0 0 1-.708 0L9.354 8.354a.5.5 0 0 0-.707 0L2 15"/><path d="M4 18v3"/><path d="M8 14v7"/></svg>
          INVESTIMENTO
        </p>
        <h2 className="section-title text-white">Oportunidades de Investimento</h2>
        <p className="section-description text-white-muted">
          Descubra negócios promissores validados pela nossa IA
        </p>
      </div>

      <div className="investments-grid">
        <div className="investment-card">
          <h3 className="investment-title">Projeto de Monitoramento de Safras</h3>
          <div className="investment-badge">Agricultura de Precisão</div>

          <div className="investment-details">
            <div className="detail-item">
              <span className="detail-label text-white-muted">Analise de viablidade</span>
              <span className="detail-value score-high">87/100</span>
            </div>
            <progress value={87} max={100}></progress>
          </div>

          <div className="detail-item">
              <span className="detail-label text-white-muted">Investimento</span>
              <span className="detail-value">50.000Kz - 100.000Kz</span>
          </div>

          <Link to={'/login'} className='btn-detalhe'>Ver Detalhes</Link>
        </div>

        <div className="investment-card">
          <h3 className="investment-title">Plataforma de Comércio Eletrônico de Produtos Agrícolas</h3>
          <div className="investment-badge">Comércio Eletrônico e Marketing Digital</div>

          <div className="investment-details">
            <div className="detail-item">
              <span className="detail-label text-white-muted">Analise de viablidade</span>
              <span className="detail-value score-high">90/100</span>
            </div>
            <progress value={90} max={100}></progress>
          </div>

          <div className="detail-item">
              <span className="detail-label text-white-muted">Investimento</span>
              <span className="detail-value">100.000Kz - 200.000Kz</span>
          </div>

          <Link to={'/login'} className='btn-detalhe'>Ver Detalhes</Link>
        </div>

        <div className="investment-card">
          <h3 className="investment-title">Sistema de Gestão de Recursos Hídricos</h3>
          <div className="investment-badge">Gestão de Recursos Hídricos e Irrigação</div>

          <div className="investment-details">
            <div className="detail-item">
              <span className="detail-label text-white-muted">Analise de viablidade</span>
              <span className="detail-value score-high">70/100</span>
            </div>
            <progress value={70} max={100}></progress>
          </div>

          <div className="detail-item">
              <span className="detail-label text-white-muted">Investimento</span>
              <span className="detail-value">20.000Kz - 40.000Kz</span>
          </div>

          <Link to={'/login'} className='btn-detalhe'>Ver Detalhes</Link>
        </div>

      </div>

      <div className="text-center mt-8">
        <Link to={'/criar-conta'} className="btn btn-secondary btn-lg">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" className="mr-2">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
          </svg>
        Investir em startups
        </Link>
      </div>
    </div>
  </section>
  )
}

export default Investimentos