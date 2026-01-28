import React from 'react'

const Mentores = () => {
  return (
      <section id="mentores" className="section section-light">
    <div className="container">
      <div className="section-header">
        <h2 className="section-title">Encontre o Mentor Ideal</h2>
        <p className="section-description">
          Conecte-se com especialistas que irão acelerar o crescimento do seu negócio
        </p>
      </div>

      <div className="mentors-grid">
        <div className="mentor-card">
          <div className="mentor-avatar">
            <span className="avatar-initials">AS</span>
          </div>
          <div className="mentor-info">
            <h4 className="mentor-name">Ana Silva</h4>
            <p className="mentor-specialty text-primary-600">Marketing Digital</p>
            <div className="mentor-rating">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-500 mr-1">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              <span className="text-neutral-600">4.9 (127 sessões)</span>
            </div>
            <div className="mentor-location">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" className="mr-1">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              Luanda
            </div>
            <div className="mentor-status available">
              <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor" className="mr-1">
                <circle cx="12" cy="12" r="10"/>
              </svg>
              Disponível
            </div>
            <button className="btn btn-outline btn-sm mt-3">
              Ver Perfil
            </button>
          </div>
        </div>

        <div className="mentor-card">
          <div className="mentor-avatar">
            <span className="avatar-initials">CM</span>
          </div>
          <div className="mentor-info">
            <h4 className="mentor-name">Carlos Mendes</h4>
            <p className="mentor-specialty text-primary-600">Finanças Empresariais</p>
            <div className="mentor-rating">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-500 mr-1">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              <span className="text-neutral-600">5.0 (89 sessões)</span>
            </div>
            <div className="mentor-location">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" className="mr-1">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              Benguela
            </div>
            <div className="mentor-status available">
              <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor" className="mr-1">
                <circle cx="12" cy="12" r="10"/>
              </svg>
              Disponível
            </div>
            <button className="btn btn-outline btn-sm mt-3">
              Ver Perfil
            </button>
          </div>
        </div>

        <div className="mentor-card">
          <div className="mentor-avatar">
            <span className="avatar-initials">MC</span>
          </div>
          <div className="mentor-info">
            <h4 className="mentor-name">Maria Costa</h4>
            <p className="mentor-specialty text-primary-600">Tecnologia & Inovação</p>
            <div className="mentor-rating">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-500 mr-1">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              <span className="text-neutral-600">4.8 (156 sessões)</span>
            </div>
            <div className="mentor-location">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" className="mr-1">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              Luanda
            </div>
            <div className="mentor-status busy">
              <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor" className="mr-1">
                <circle cx="12" cy="12" r="10"/>
              </svg>
              Ocupado
            </div>
            <button className="btn btn-outline btn-sm mt-3">
              Ver Perfil
            </button>
          </div>
        </div>
      </div>

      <div className="text-center mt-8">
        <button className="btn btn-primary btn-lg">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" className="mr-2">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35"/>
          </svg>
          Encontrar um mentor
        </button>
      </div>
    </div>
  </section>
  )
}

export default Mentores