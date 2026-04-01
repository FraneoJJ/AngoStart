import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const logoUrl = `${import.meta.env.BASE_URL}logo.png`

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Scroll effect navbar
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Scroll suave para âncoras
  const scrollToSection = (id) => {
    const el = document.querySelector(id)
    if (!el) return

    const navbarHeight = document.getElementById('navbar')?.offsetHeight || 0
    const y = el.getBoundingClientRect().top + window.scrollY - navbarHeight

    window.scrollTo({ top: y, behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <nav
      id="navbar"
      className={`navbar ${scrolled ? 'scrolled' : ''}`}
    >
      <div className="container">
        <div className="navbar-content">

          {/* Logo */}
          <button onClick={() => scrollToSection('#hero')} className="navbar-logo">
            <img src={logoUrl} alt="AngoStart" className="logo-image" />
          </button>

          {/* Desktop Links */}
          <div className="navbar-links">
            <button onClick={() => scrollToSection('#sobre')} className="nav-link">Sobre</button>
            <button onClick={() => scrollToSection('#funcionalidades')} className="nav-link">Funcionalidades</button>
            <button onClick={() => scrollToSection('#para-quem')} className="nav-link">Para quem é?</button>
            <button onClick={() => scrollToSection('#ia')} className="nav-link">IA</button>
            <button onClick={() => scrollToSection('#mentores')} className="nav-link">Mentores</button>
            <button onClick={() => scrollToSection('#investimento')} className="nav-link">Marketplace</button>
            <button onClick={() => scrollToSection('#planos')} className="nav-link">Planos</button>
            <button onClick={() => scrollToSection('#depoimentos')} className="nav-link">Depoimentos</button>
            <button onClick={() => scrollToSection('#parceiros')} className="nav-link">Parcerias</button>
          </div>

          {/* CTAs */}
          <div className="navbar-ctas">
            <Link to="/dashboard" className="btn btn-ghost">Entrar</Link>
            <Link to="/criar-conta" className="btn btn-primary">Criar Conta</Link>
          </div>

          {/* Mobile Button */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            {!menuOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" stroke="currentColor">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" stroke="currentColor">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="mobile-menu">
            <button onClick={() => scrollToSection('#sobre')} className="mobile-link">Sobre</button>
            <button onClick={() => scrollToSection('#funcionalidades')} className="mobile-link">Funcionalidades</button>
            <button onClick={() => scrollToSection('#para-quem')} className="mobile-link">Para quem é?</button>
            <button onClick={() => scrollToSection('#ia')} className="mobile-link">IA</button>
            <button onClick={() => scrollToSection('#mentores')} className="mobile-link">Mentores</button>
            <button onClick={() => scrollToSection('#investimento')} className="mobile-link">Marketplace</button>
            <button onClick={() => scrollToSection('#planos')} className="mobile-link">Planos</button>
            <button onClick={() => scrollToSection('#depoimentos')} className="mobile-link">Depoimentos</button>
            <button onClick={() => scrollToSection('#parceiros')} className="mobile-link">Parcerias</button>

            <div className="mobile-menu-ctas">
              <Link to="/dashboard" className="btn btn-outline-mobile">Entrar</Link>
              <Link to="/criar-conta" className="btn btn-primary-mobile">Criar Conta</Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
