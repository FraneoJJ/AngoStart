import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'

const Home = () => {

  // ===== PARALLAX BLOBS =====
  useEffect(() => {
    const handleScroll = () => {
      const blobs = document.querySelectorAll('.bg-blob')
      const scrolled = window.scrollY

      blobs.forEach((blob, index) => {
        const speed = (index + 1) * 0.3
        blob.style.transform = `translateY(${scrolled * speed}px)`
      })
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // ===== HERO STATS COUNTER =====
  useEffect(() => {
    const stats = document.querySelectorAll('.stat-value')

    const animate = (el, target) => {
      let current = 0
      const increment = target / 120

      const timer = setInterval(() => {
        current += increment
        if (current >= target) {
          current = target
          clearInterval(timer)
        }
        el.textContent = Math.floor(current) + '+'
      }, 16)
    }

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          stats.forEach(stat => {
            const value = parseInt(stat.textContent)
            animate(stat, value)
          })
          observer.disconnect()
        }
      })
    }, { threshold: 0.5 })

    const container = document.querySelector('.hero-stats')
    if (container) observer.observe(container)

    return () => observer.disconnect()
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
    <section id="hero" className="hero-section">

      {/* Background */}
      <div className="hero-bg">
        <div className="bg-blob bg-blob-1"></div>
        <div className="bg-blob bg-blob-2"></div>
        <div className="grid-pattern"></div>
      </div>

      {/* Content */}
      <div className="container hero-container">
        <div className="hero-content">

          {/* Badge */}
          <div className="hero-badge fade-in">
            <svg
              className="badge-icon"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 3l1.912 5.813a1 1 0 00.95.69h6.11l-4.944 3.594a1 1 0 00-.364 1.118L17.576 20l-4.944-3.594a1 1 0 00-1.176 0L6.512 20l1.912-5.813a1 1 0 00-.364-1.118L3.116 9.503h6.11a1 1 0 00.95-.69L12 3z" />
            </svg>
            <span>Plataforma para empreendedores angolanos</span>
          </div>

          {/* Headline */}
          <h1 className="hero-headline fade-in-delay-1">
            Transforme ideias em <span className="gradient-text">negócios reais</span>
          </h1>

          {/* Subheadline */}
          <p className="hero-subheadline fade-in-delay-2">
            A plataforma que ajuda empreendedores angolanos a validar ideias,
            encontrar mentores e conectar-se a investidores.
          </p>

          {/* CTA */}
          <div className="hero-ctas fade-in-delay-3">
            <Link to="/criar-conta" className="btn btn-cta-primary">
              Criar Conta
            </Link>

            <button className="btn btn-cta-secondary" onClick={() => scrollToSection('#investimento')}>
              Explorar Ideias
            </button>
          </div>

          {/* Stats */}
          <div className="hero-stats fade-in-delay-4">
            <div className="stat-item">
              <div className="stat-valueHome">500+</div>
              <div className="stat-label">Ideias Validadas</div>
            </div>
            <div className="stat-item">
              <div className="stat-valueHome">150+</div>
              <div className="stat-label">Mentores Ativos</div>
            </div>
            <div className="stat-item">
              <div className="stat-valueHome">20+</div>
              <div className="stat-label">Investidores Ativos</div>
            </div>
          </div>

        </div>
      </div>

      {/* Decorative */}
      <div className="decorative-square"></div>
      <div className="decorative-circle"></div>

    </section>
  )
}

export default Home
