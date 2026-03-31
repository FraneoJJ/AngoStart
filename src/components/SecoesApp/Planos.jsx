import React from 'react'

const Planos = ({ onSelectPlan, currentPlanCode = "", loadingPlanCode = "", userRole = "empreendedor" }) => {
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

  const roleKey = String(userRole || "")
    .toLowerCase()
    .includes("invest") ? "investidor"
    : String(userRole || "").toLowerCase().includes("mentor") ? "mentor"
    : "empreendedor";

  const planContent = {
    empreendedor: {
      sectionTitle: "Planos para Empreendedores",
      sectionDescription: "Escolha o plano ideal para validar sua ideia, obter análise de IA e acelerar o crescimento.",
      free: {
        subtitle: "Para começar a validar sua ideia",
        features: [
          "Validação básica de 1 ideia/mês",
          "Análise de IA simplificada",
          "Acesso ao marketplace",
          "Comunidade de empreendedores",
          "Suporte via email",
        ],
      },
      pro: {
        subtitle: "Para empreendedores ativos",
        features: [
          "Validação ilimitada de ideias",
          "Análise completa de IA",
          "Geração de planos de negócio em PDF",
          "3 sessões de mentoria/mês",
          "Gestão financeira básica",
          "Matching com investidores",
          "Suporte prioritário",
        ],
      },
      premium: {
        subtitle: "Para negócios em crescimento",
        features: [
          "Tudo do plano Pro",
          "Mentoria ilimitada",
          "Consultoria estratégica trimestral",
          "Análise de concorrência avançada",
          "Dashboard executivo personalizado",
          "Prioridade em matching",
          "Gerente de conta dedicado",
          "Suporte 24/7",
        ],
      },
    },
    investidor: {
      sectionTitle: "Planos para Investidores",
      sectionDescription: "Escolha o plano ideal para analisar oportunidades, contactar empreendedores e acompanhar propostas.",
      free: {
        subtitle: "Para começar a acompanhar oportunidades",
        features: [
          "1 proposta/conversa por mês",
          "Análise de IA simplificada (viabilidade e risco base)",
          "Acesso ao marketplace de startups",
          "Chat para iniciar conversas",
          "Suporte via email",
        ],
      },
      pro: {
        subtitle: "Para investir com mais frequência",
        features: [
          "Propostas ilimitadas",
          "Análise completa de IA (viabilidade e risco)",
          "Relatórios de due diligence (base)",
          "Dashboard de investimentos básico",
          "Matching com empreendedores por perfil e setor",
          "Apoio prioritário",
        ],
      },
      premium: {
        subtitle: "Para investidores avançados",
        features: [
          "Tudo do plano Pro",
          "Análise avançada e recomendações",
          "Relatórios de due diligence completos (PDF)",
          "Dashboard executivo de investimentos",
          "Prioridade no matching",
          "Gerente de conta dedicado",
          "Suporte 24/7",
        ],
      },
    },
    mentor: {
      sectionTitle: "Planos para Mentores",
      sectionDescription: "Escolha o plano ideal para receber empreendedores qualificados, preparar sessões e acompanhar resultados.",
      free: {
        subtitle: "Para começar a orientar",
        features: [
          "1 sessão de mentoria/mês",
          "Preparação com insights de IA (base)",
          "Agenda de mentoria e gestão de sessões",
          "Chat com empreendedores",
          "Suporte via email",
        ],
      },
      pro: {
        subtitle: "Para mentores ativos",
        features: [
          "Sessões ilimitadas",
          "Análise completa para preparar mentoria",
          "Relatórios mensais de progresso",
          "Matching com empreendedores qualificados",
          "Gestão financeira/indicadores (base)",
          "Suporte prioritário",
        ],
      },
      premium: {
        subtitle: "Para mentores avançados",
        features: [
          "Tudo do plano Pro",
          "Frameworks e consultoria estratégica mensal",
          "Dashboards de desempenho do mentor",
          "Prioridade no matching",
          "Gerente de conta dedicado",
          "Suporte 24/7",
        ],
      },
    },
  };

  const content = planContent[roleKey] || planContent.empreendedor;

  const renderFeatures = (features = [], extraClassName = "") => (
    <ul className={`pricing-features${extraClassName ? ` ${extraClassName}` : ""}`}>
      {(features || []).map((txt, idx) => (
        <li key={`${idx}-${txt}`}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-500 mr-2">
            <path d="M20 6L9 17l-5-5" />
          </svg>
          {txt}
        </li>
      ))}
    </ul>
  );

  return (
      <section id="planos" className="section section-light">
    <div className="container">
      <div className="section-header">
        <h2 className="section-title">{content.sectionTitle}</h2>
        <p className="section-description">
          {content.sectionDescription}
        </p>
      </div>

      <div className="pricing-grid">
        <div className="pricing-card">
          <div className="pricing-header">
            <h3 className="pricing-title">Free</h3>
            <p className="pricing-subtitle">{content.free.subtitle}</p>
            <div className="pricing-price">
              <span className="price">0kz</span>
              <span className="period">/mês</span>
            </div>
          </div>
          {renderFeatures(content.free.features)}
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
            <p className="pricing-subtitle colorwhite">{content.pro.subtitle}</p>
            <div className="pricing-price">
              <span className="price colorwhite">5.000kz</span>
              <span className="period colorwhite">/mês</span>
            </div>
          </div>
          {renderFeatures(content.pro.features, "colorwhite")}
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
            <p className="pricing-subtitle">{content.premium.subtitle}</p>
            <div className="pricing-price">
              <span className="price">10.000kz</span>
              <span className="period">/mês</span>
            </div>
          </div>
          {renderFeatures(content.premium.features)}
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