// src/components/sections/ParaQuem.jsx
import React, { useState } from 'react';

const ParaQuem = () => {
  const [activeTab, setActiveTab] = useState('empreendedores');

  const tabs = [
    {
      id: 'empreendedores',
      title: 'Empreendedores',
      subtitle: 'Transforme sua ideia em realidade',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" classNameName="mr-2">
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
        </svg>
      ),
      features: [
        'Valide sua ideia com IA em minutos',
        'Gere planos de negócio profissionais',
        'Acesso a mentoria especializada',
        'Conecte-se com investidores',
        'Ferramentas de gestão financeira'
      ],
      image: '/img/jovem-empresario-africano-feliz.jpg',
      buttonText: 'Começar Agora'
    },
    {
      id: 'investidores',
      title: 'Investidores',
      subtitle: 'Descubra oportunidades promissoras',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" classNameName="mr-2">
          <line x1="12" y1="1" x2="12" y2="23"/>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
      ),
      features: [
        'Acesso a ideias validadas por IA',
        'Filtre projetos por setor e estágio',
        'Análises detalhadas de cada projeto',
        'Conecte-se diretamente com empreendedores',
        'Acompanhe seu portfólio de investimentos'
      ],
      image: '/img/download (2).jpg',
      buttonText: 'Explorar Oportunidades'
    },
    {
      id: 'mentores-tab',
      title: 'Mentores',
      subtitle: 'Compartilhe sua experiência',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" classNameName="mr-2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
        </svg>
      ),
      features: [
        'Ajude empreendedores a crescer',
        'Agende sessões de forma flexível',
        'Receba por suas mentorias',
        'Construa sua reputação',
        'Acesso a relatórios de impacto'
      ],
      image: '/img/professional-black-excellence-art.jpg',
      buttonText: 'Torne-se Mentor'
    }
  ];

  return (
    <section id="para-quem" classNameName="section section-light">
      <div classNameName="container">
        <div classNameName="section-header">
          <h2 classNameName="section-title">Para Quem é a AngoStart?</h2>
          <p classNameName="section-description">
            Uma plataforma completa para todos os participantes do ecossistema de inovação
          </p>
        </div>

        <div classNameName="audience-tabs">
          <div classNameName="tab-buttons">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                classNameName={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon}
                {tab.title}
              </button>
            ))}
          </div>

          {tabs.map((tab) => (
            <div
              key={tab.id}
              id={tab.id}
              classNameName={`tab-content ${activeTab === tab.id ? 'active' : ''}`}
            >
              <div classNameName="tab-content-grid">
                <div classNameName="tab-text">
                  <h3 classNameName="tab-title">{tab.title}</h3>
                  <p classNameName="tab-subtitle">{tab.subtitle}</p>
                  <ul classNameName="feature-list">
                    {tab.features.map((feature, index) => (
                      <li key={index}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" classNameName="text-green-500 mr-2">
                          <path d="M20 6L9 17l-5-5"/>
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button classNameName="btn btn-primary mt-6">
                    {tab.buttonText}
                  </button>
                </div>
                <div classNameName="tab-image">
                  <img
                    src={tab.image}
                    alt={tab.title}
                    classNameName="rounded-xl"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ParaQuem;