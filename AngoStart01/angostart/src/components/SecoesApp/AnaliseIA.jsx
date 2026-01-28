import React from 'react'

const AnaliseIA = () => {
  return (
      <section id="ia" className="section section-dark">
    <div className="container">

      <div className="ia-analysis">
        <div className="ia-features">
          <div>
            <h2 className="section-title text-white">Análise de Negócios com IA</h2>
            <p className="section-description text-white-muted">
              Nossa inteligência artificial analisa mais de 50 variáveis para dar uma pontuação precisa da viabilidade do seu negócio.
            </p>
          </div>
          <div className="ia-feature">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="text-primary-400 mr-3"><path d="M19.07 4.93A10 10 0 0 0 6.99 3.34"/><path d="M4 6h.01"/><path d="M2.29 9.62A10 10 0 1 0 21.31 8.35"/><path d="M16.24 7.76A6 6 0 1 0 8.23 16.67"/><path d="M12 18h.01"/><path d="M17.99 11.66A6 6 0 0 1 15.77 16.67"/><circle cx="12" cy="12" r="2"/><path d="m13.41 10.59 5.66-5.66"/></svg>
            <span className="text-white">Análise de mercado e concorrência</span>
          </div>
          <div className="ia-feature">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" className="text-primary-400 mr-3">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
            </svg>
            <span className="text-white">Avaliação de viabilidade financeira</span>
          </div>
          <div className="ia-feature">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"className="text-primary-400 mr-3"><path d="M8 3 4 7l4 4"/><path d="M4 7h16"/><path d="m16 21 4-4-4-4"/><path d="M20 17H4"/></svg>
            <span className="text-white">Identificação de riscos e oportunidades</span>
          </div>
          <div className="ia-feature">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="text-primary-400 mr-3"><path d="M15 12h-5"/><path d="M15 8h-5"/><path d="M19 17V5a2 2 0 0 0-2-2H4"/><path d="M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3"/></svg>
            <span className="text-white">Recomendações personalizadas</span>
          </div>
          
          <button className="btn btn-secondary btn-lg mt-8">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-file-chart-line-icon lucide-file-chart-line"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/><path d="M14 2v5a1 1 0 0 0 1 1h5"/><path d="m16 13-3.5 3.5-2-2L8 17"/></svg>
            Gerar plano de negócio com IA
          </button>
        </div>

        <div className="ia-score-card">
          <div className="score-circle">
            <div className="score-value">82</div>
            <div className="score-label text-white-muted">de 100</div>
          </div>
          <div className="score-title text-white">Pontuação de Viabilidade</div>
          
          <div className="ia-details">
            <div className="detail-section">
              <h4>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="inline mr-2 text-yellow-500"><path d="m3 8 4-4 4 4"/><path d="M7 4v16"/><path d="M11 12h4"/><path d="M11 16h7"/><path d="M11 20h10"/></svg>
                Pontos Fortes
              </h4>
              <p className="text-white-muted">Mercado em crescimento, equipe qualificada</p>
            </div>
            <div className="detail-section">
              <h4>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="inline mr-2 text-orange-500"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
                Riscos
              </h4>
              <p className="text-white-muted">Alta concorrência, necessidade de capital inicial</p>
            </div>
            <div className="detail-section">
              <h4>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="inline mr-2 text-green-500"><path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"/><path d="M20 2v4"/><path d="M22 4h-4"/><circle cx="4" cy="20" r="2"/></svg>
                Recomendações
              </h4>
              <p className="text-white-muted">Foco em diferenciação, buscar mentoria em marketing</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  )
}

export default AnaliseIA