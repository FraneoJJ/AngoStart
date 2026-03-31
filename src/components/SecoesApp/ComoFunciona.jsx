import React from 'react'

const ComoFunciona = () => {
  return (
        <section id="sobre" className="section section-light">
    <div className="container">
      <div className="section-header">
        <h2 className="section-title">Como Funciona</h2>
        <p className="section-description">Validação simplificada em 4 passos</p>
      </div>

      <div className="steps-grid">
        <div className="step-card">
          <div className="step-number">1</div>
          <div className="step-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-lightbulb-icon lucide-lightbulb"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
          </div>
          <h3 className="step-title">Submeta sua Ideia</h3>
          <p className="step-description">Preencha um formulário intuitivo sobre sua ideia de negócio</p>
        </div>

        <div className="step-card">
          <div className="step-number">2</div>
          <div className="step-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-sparkles-icon lucide-sparkles"><path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"/><path d="M20 2v4"/><path d="M22 4h-4"/><circle cx="4" cy="20" r="2"/></svg>
          </div>
          <h3 className="step-title">Análise por IA</h3>
          <p className="step-description">Nossa IA avalia viabilidade, mercado e potencial da ideia</p>
        </div>

        <div className="step-card">
          <div className="step-number">3</div>
          <div className="step-icon">
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-users-icon lucide-users"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><path d="M16 3.128a4 4 0 0 1 0 7.744"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><circle cx="9" cy="7" r="4"/></svg>
          </div>
          <h3 className="step-title">Conecte-se</h3>
          <p className="step-description">Encontre mentores e investidores alinhados ao seu setor</p>
        </div>

        <div className="step-card">
          <div className="step-number">4</div>
          <div className="step-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-chart-no-axes-combined-icon lucide-chart-no-axes-combined"><path d="M12 16v5"/><path d="M16 14v7"/><path d="M20 10v11"/><path d="m22 3-8.646 8.646a.5.5 0 0 1-.708 0L9.354 8.354a.5.5 0 0 0-.707 0L2 15"/><path d="M4 18v3"/><path d="M8 14v7"/></svg>
          </div>
          <h3 className="step-title">Cresça</h3>
          <p className="step-description">Receba mentoria e oportunidades de investimento</p>
        </div>
      </div>
    </div>
  </section>
  )
}

export default ComoFunciona