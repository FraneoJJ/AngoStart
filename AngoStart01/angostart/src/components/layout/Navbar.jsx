import React from 'react'

const Navbar = () => {
  return (
      <nav id="navbar" className="navbar">
    <div className="container">
      <div className="navbar-content">
        {/* <!-- Logo --> */}
        <a href="#" className="navbar-logo">
          <img src="img/logo.png" alt="AngoStart" className="logo-image"/>
        </a>

        {/* <!-- Navegação Desktop (PC) --> */}
        <div className="navbar-links">
          <a href="#sobre" className="nav-link">Sobre</a>
          <a href="#funcionalidades" className="nav-link">Funcionalidades</a>
          <a href="#para-quem" className="nav-link">Para quem é?</a>
          <a href="#mentores" className="nav-link">Mentores</a>
          <a href="#investimento" className="nav-link">Marketplace</a>
          <a href="#planos" className="nav-link">Planos</a>
        </div>

        {/* <!-- Desktop CTAs --> */}
        <div className="navbar-ctas">
          <button className="btn btn-ghost" onclick="window.location.href='html/login.html'">Entrar</button>
          <button className="btn btn-primary" onclick="window.location.href='html/register.html'">Criar Conta</button>
        </div>

        {/* <!-- Mobile Menu Button --> */}
        <button className="mobile-menu-btn" id="mobileMenuBtn" aria-label="Menu">
          <svg className="menu-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
          <svg className="close-icon hidden" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      {/* Mobile Menu  */}
      <div className="mobile-menu hidden" id="mobileMenu">
        <div className="mobile-menu-links">
          <a href="#sobre" className="mobile-link">Sobre</a>
          <a href="#funcionalidades" className="mobile-link">Funcionalidades</a>
          <a href="#para-quem" className="mobile-link">Para quem é?</a>
          <a href="#mentores" className="mobile-link">Mentores</a>
          <a href="#investimento" className="mobile-link">Marketplace</a>
          <a href="#planos" className="mobile-link">Planos</a>
        </div>
        <div className="mobile-menu-ctas">
          <button className="btn btn-outline-mobile" onclick="showLogin()">Entrar</button>
          <button className="btn btn-primary-mobile" onclick="showRegister()">Criar Conta</button>
        </div>
      </div>
    </div>
  </nav>
  )
}

export default Navbar