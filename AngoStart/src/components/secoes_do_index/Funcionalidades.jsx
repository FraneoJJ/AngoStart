// src/components/sections/Features.jsx
import React from 'react';

const Features = () => {
  const features = [
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
      ),
      title: 'Análise por IA',
      description: 'Validação automática usando algoritmos avançados de machine learning',
      iconclassName: 'feature-icon-primary'
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10 9 9 9 8 9"/>
        </svg>
      ),
      title: 'Plano de Negócio',
      description: 'Gere planos de negócio profissionais em PDF automaticamente',
      iconclassName: 'feature-icon-secondary'
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
      title: 'Rede de Mentores',
      description: 'Acesso a mentores experientes em diversos setores de mercado',
      iconclassName: 'feature-icon-success'
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="1" x2="12" y2="23"/>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
      ),
      title: 'Marketplace de Investimentos',
      description: 'Conecte-se diretamente com investidores interessados no seu setor',
      iconclassName: 'feature-icon-warning'
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="22" y1="12" x2="2" y2="12"/>
          <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>
          <line x1="6" y1="16" x2="6.01" y2="16"/>
          <line x1="10" y1="16" x2="10.01" y2="16"/>
        </svg>
      ),
      title: 'Dashboard Completo',
      description: 'Acompanhe métricas, progresso e oportunidades em tempo real',
      iconclassName: 'feature-icon-info'
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      ),
      title: 'Chat Integrado',
      description: 'Comunique-se facilmente com mentores e investidores na plataforma',
      iconclassName: 'feature-icon-primary'
    }
  ];

  return (
    <section id="funcionalidades" classNameName="section section-dark">
      <div classNameName="container">
        <div classNameName="section-header">
          <h2 classNameName="section-title text-white">Funcionalidades Principais</h2>
          <p classNameName="section-description text-white-muted">
            Tudo que você precisa para transformar sua ideia em realidade
          </p>
        </div>

        <div classNameName="features-grid">
          {features.map((feature, index) => (
            <div key={index} classNameName="feature-card">
              <div classNameName={`feature-icon ${feature.iconclassName}`}>
                {feature.icon}
              </div>
              <h4 classNameName="feature-title">{feature.title}</h4>
              <p classNameName="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;