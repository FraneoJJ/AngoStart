import React from 'react'
const Planos = ({ onSelectPlan, currentPlanCode = "", loadingPlanCode = "" }) => {
  const handleSelect = (planCode) => {
    if (typeof onSelectPlan === "function") {
      onSelectPlan(planCode);
    }
  };

  const buttonLabel = (planCode, defaultLabel) => {
    if (loadingPlanCode === planCode) return "A atualizar...";
    if (currentPlanCode === planCode) return "Plano atual";
    return defaultLabel;
  };

  const isDisabled = (planCode) => loadingPlanCode === planCode || currentPlanCode === planCode;

  return (
      <section id="planos" className="section section-light">
    <div className="container">
      <div className="section-header">
        <h2 className="section-title">Planos para Cada Etapa</h2>
        <p className="section-description">
          Escolha o plano ideal para transformar sua ideia em negócio
        </p>
      </div>

      <div className="pricing-grid">
        <div className="pricing-card">
          <div className="pricing-header">
            <h3 className="pricing-title">Free</h3>
            <p className="pricing-subtitle">Para começar a validar sua ideia</p>
            <div className="pricing-price">
              <span className="price">0kz</span>
              <span className="period">/mês</span>
            </div>
          </div>
          <ul className="pricing-features">
            <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" className="text-green-500 mr-2"><path d="M20 6L9 17l-5-5"/></svg> Validação básica de 1 ideia/mês</li>
            <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" className="text-green-500 mr-2"><path d="M20 6L9 17l-5-5"/></svg> Análise de IA simplificada</li>
            <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" className="text-green-500 mr-2"><path d="M20 6L9 17l-5-5"/></svg> Acesso ao marketplace</li>
            <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" className="text-green-500 mr-2"><path d="M20 6L9 17l-5-5"/></svg> Comunidade de empreendedores</li>
            <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" className="text-green-500 mr-2"><path d="M20 6L9 17l-5-5"/></svg> Suporte via email</li>
          </ul>
          <button
            className={currentPlanCode === "free" ? "btn btn-primary btn-block mt-6 colorblue" : "btn btn-outline btn-block mt-6 colorblue"}
            onClick={() => handleSelect("free")}
            disabled={isDisabled("free")}
          >
            {buttonLabel("free", "Começar Grátis")}
          </button>
        </div>

        <div className="pricing-card popular">
          <div className="popular-badge">Mais Popular</div>
          <div className="pricing-header">
            <h3 className="pricing-title colorwhite">Pro</h3>
            <p className="pricing-subtitle colorwhite">Para empreendedores ativos</p>
            <div className="pricing-price">
              <span className="price colorwhite">5.000kz</span>
              <span className="period colorwhite">/mês</span>
            </div>
          </div>
          <ul className="pricing-features colorwhite">
            <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" className="text-green-500 mr-2"><path d="M20 6L9 17l-5-5"/></svg> Validação ilimitada de ideias</li>
            <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" className="text-green-500 mr-2"><path d="M20 6L9 17l-5-5"/></svg> Análise completa de IA</li>
            <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" className="text-green-500 mr-2"><path d="M20 6L9 17l-5-5"/></svg> Geração de planos de negócio em PDF</li>
            <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" className="text-green-500 mr-2"><path d="M20 6L9 17l-5-5"/></svg> 3 sessões de mentoria/mês</li>
            <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" className="text-green-500 mr-2"><path d="M20 6L9 17l-5-5"/></svg> Gestão financeira básica</li>
            <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" className="text-green-500 mr-2"><path d="M20 6L9 17l-5-5"/></svg> Matching com investidores</li>
            <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" className="text-green-500 mr-2"><path d="M20 6L9 17l-5-5"/></svg> Suporte prioritário</li>
          </ul>
          <button
            className={currentPlanCode === "pro" ? "btn btn-primary btn-block mt-6" : "btn btnPlano btn-block mt-6"}
            onClick={() => handleSelect("pro")}
            disabled={isDisabled("pro")}
          >
            {buttonLabel("pro", "Escolher Pro")}
          </button>
        </div>

        <div className="pricing-card">
          <div className="pricing-header">
            <h3 className="pricing-title">Premium</h3>
            <p className="pricing-subtitle">Para negócios em crescimento</p>
            <div className="pricing-price">
              <span className="price">10.000kz</span>
              <span className="period">/mês</span>
            </div>
          </div>
          <ul className="pricing-features">
            <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" className="text-green-500 mr-2"><path d="M20 6L9 17l-5-5"/></svg> Tudo do plano Pro</li>
            <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" className="text-green-500 mr-2"><path d="M20 6L9 17l-5-5"/></svg> Mentoria ilimitada</li>
            <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" className="text-green-500 mr-2"><path d="M20 6L9 17l-5-5"/></svg> Consultoria estratégica trimestral</li>
            <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" className="text-green-500 mr-2"><path d="M20 6L9 17l-5-5"/></svg> Análise de concorrência avançada</li>
            <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" className="text-green-500 mr-2"><path d="M20 6L9 17l-5-5"/></svg> Dashboard executivo personalizado</li>
            <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" className="text-green-500 mr-2"><path d="M20 6L9 17l-5-5"/></svg> Prioridade em matching</li>
            <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" className="text-green-500 mr-2"><path d="M20 6L9 17l-5-5"/></svg> Gerente de conta dedicado</li>
            <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" className="text-green-500 mr-2"><path d="M20 6L9 17l-5-5"/></svg> Suporte 24/7</li>
          </ul>
          <button
            className={currentPlanCode === "premium" ? "btn btn-primary btn-block mt-6 colorblue" : "btn btn-outline btn-block mt-6 colorblue"}
            onClick={() => handleSelect("premium")}
            disabled={isDisabled("premium")}
          >
            {buttonLabel("premium", "Escolher Premium")}
          </button>
        </div>
      </div>

      <div className="pricing-note text-center mt-8">
        <p className="text-neutral-600">✅ Todos os planos incluem 14 dias de teste grátis. Cancele quando quiser.</p>
      </div>
    </div>
  </section>
  )
}

export default Planos