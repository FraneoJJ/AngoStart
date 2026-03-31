import React, { useState } from 'react'

// Link 
import { Link } from 'react-router-dom'

const ParaQuem = () => {
  const [activeTab, setActiveTab] = useState('empreendedores');

  const openTab = (tabId) => {
    setActiveTab(tabId);
  };

  return (
    <section id="para-quem" className="section section-light">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Para Quem é a AngoStart?</h2>
          <p className="section-description">Uma plataforma completa para todos os participantes do ecossistema de inovação</p>
        </div>

        <div className="audience-tabs">
          <div className="tab-buttons">
            <button 
              className={`tab-btn ${activeTab === 'empreendedores' ? 'active' : ''}`} 
              onClick={() => openTab('empreendedores')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="M2 21a8 8 0 0 1 13.292-6"/>
                <circle cx="10" cy="8" r="5"/>
                <path d="m16 19 2 2 4-4"/>
              </svg> 
              Empreendedores
            </button>
            <button 
              className={`tab-btn ${activeTab === 'investidores' ? 'active' : ''}`} 
              onClick={() => openTab('investidores')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
                <line x1="12" y1="1" x2="12" y2="23"/>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
              Investidores
            </button>
            <button 
              className={`tab-btn ${activeTab === 'mentores-tab' ? 'active' : ''}`} 
              onClick={() => openTab('mentores-tab')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
              </svg>
              Mentores
            </button>
          </div>

          <div id="empreendedores" className={`tab-content ${activeTab === 'empreendedores' ? 'active' : 'hidden'}`}>
            <div className="tab-content-grid">
              <div className="tab-text">
                <h3 className="tab-title">Empreendedores</h3>
                <p className="tab-subtitle">Transforme sua ideia em realidade</p>
                <ul className="feature-list">
                  <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-500 mr-2"><path d="M20 6L9 17l-5-5"/></svg> Valide sua ideia com IA em minutos</li>
                  <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-500 mr-2"><path d="M20 6L9 17l-5-5"/></svg> Gere planos de negócio profissionais</li>
                  <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-500 mr-2"><path d="M20 6L9 17l-5-5"/></svg> Acesso a mentoria especializada</li>
                  <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-500 mr-2"><path d="M20 6L9 17l-5-5"/></svg> Conecte-se com investidores</li>
                  <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-500 mr-2"><path d="M20 6L9 17l-5-5"/></svg> Ferramentas de gestão financeira</li>
                </ul>
                <Link to="/criar-conta" className="btn btn-primary mt-6">Começar Agora</Link>
              </div>
              <div className="tab-image">
                <img src="/Jovem empresário africano feliz _ Foto Grátis.jpg" 
                     alt="Empreendedor" className="rounded-xl"/>
              </div>
            </div>
          </div>

          <div id="investidores" className={`tab-content ${activeTab === 'investidores' ? 'active' : 'hidden'}`}>
            <div className="tab-content-grid">
              <div className="tab-text">
                <h3 className="tab-title">Investidores</h3>
                <p className="tab-subtitle">Descubra oportunidades promissoras</p>
                <ul className="feature-list">
                  <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-500 mr-2"><path d="M20 6L9 17l-5-5"/></svg> Acesso a ideias validadas por IA</li>
                  <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-500 mr-2"><path d="M20 6L9 17l-5-5"/></svg> Filtre projetos por setor e estágio</li>
                  <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-500 mr-2"><path d="M20 6L9 17l-5-5"/></svg> Análises detalhadas de cada projeto</li>
                  <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-500 mr-2"><path d="M20 6L9 17l-5-5"/></svg> Conecte-se diretamente com empreendedores</li>
                  <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-500 mr-2"><path d="M20 6L9 17l-5-5"/></svg> Acompanhe seu portfólio de investimentos</li>
                </ul>
                <Link to="/criar-conta" className="btn btn-primary mt-6">Explorar Oportunidades</Link>
              </div>
              <div className="tab-image">
                <img src="/download (2).jpg" 
                     alt="Investidor" className="rounded-xl"/>
              </div>
            </div>
          </div>

          <div id="mentores-tab" className={`tab-content ${activeTab === 'mentores-tab' ? 'active' : 'hidden'}`}>
            <div className="tab-content-grid">
              <div className="tab-text">
                <h3 className="tab-title">Mentores</h3>
                <p className="tab-subtitle">Compartilhe sua experiência</p>
                <ul className="feature-list">
                  <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-500 mr-2"><path d="M20 6L9 17l-5-5"/></svg> Ajude empreendedores a crescer</li>
                  <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-500 mr-2"><path d="M20 6L9 17l-5-5"/></svg> Agende sessões de forma flexível</li>
                  <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-500 mr-2"><path d="M20 6L9 17l-5-5"/></svg> Receba por suas mentorias</li>
                  <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-500 mr-2"><path d="M20 6L9 17l-5-5"/></svg> Construa sua reputação</li>
                  <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-500 mr-2"><path d="M20 6L9 17l-5-5"/></svg> Acesso a relatórios de impacto</li>
                </ul>
                <Link to="/criar-conta" className="btn btn-primary mt-6">Torne-se Mentor</Link>
              </div>
              <div className="tab-image">
                <img src="/Professional Black Excellence Art - Diverse Business Leaders in Modern Conference Room.jpg" 
                     alt="Mentor" className="rounded-xl"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ParaQuem