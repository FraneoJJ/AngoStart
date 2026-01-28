import React from 'react'

const ComecarGratuitamente = () => {
  return (
      <section className="cta-section">
    <div className="container cta-container">
      <h2 className="cta-title">Comece hoje a construir o seu negócio</h2>
      <p className="cta-subtitle">
        Junte-se a centenas de empreendedores angolanos que já transformaram suas ideias em negócios de sucesso com a AngoStart.
      </p>
      
      <div className="cta-buttons">
        <button className="btn btn-secondary btn-lg">
          Criar Conta Gratuitamente
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" className="ml-2">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
        <button className="btn btn-outline btn-lg">
          Falar com Especialista
        </button>
      </div>

      <div className="cta-features">
        <div className="feature-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" className="text-green-500 mr-2">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
          <span>14 dias grátis</span>
        </div>
        <div className="feature-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" className="text-green-500 mr-2">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
          <span>Sem cartão de crédito</span>
        </div>
        <div className="feature-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" className="text-green-500 mr-2">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
          <span>Cancele quando quiser</span>
        </div>
      </div>
    </div>
  </section>
  )
}

export default ComecarGratuitamente