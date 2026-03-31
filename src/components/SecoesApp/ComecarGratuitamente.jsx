import React from 'react'

import { Link } from 'react-router-dom'

const ComecarGratuitamente = () => {
  return (
      <section className="cta-section">
    <div className="container cta-container">
      <h2 className="cta-title">Comece hoje a construir o seu negócio</h2>
      <p className="cta-subtitle">
        Junte-se a centenas de empreendedores angolanos que já transformaram suas ideias em negócios de sucesso com a AngoStart.
      </p>
      
      <div className="cta-buttons">
        <Link to={'/criar-conta'} className="btn btn-secondary btn-lg">
          Criar Conta Gratuitamente
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" className="ml-2">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </Link>
        <Link to={'/criar-conta'} className="btn btn-outline btn-lg">
          Analise a sua ideia de negócio 
        </Link>
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