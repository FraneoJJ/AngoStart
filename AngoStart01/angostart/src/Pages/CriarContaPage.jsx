import React from 'react'
import { Link } from 'react-router-dom'
import '../style/auth.css'

const CriarConta = () => {
  return (
    <div className="auth-page">
    <div className="auth-container">
      <div className="auth-content auth-content-wide">
        {/* <!-- Header --> */}
        <div className="auth-header">
          <div className="auth-logo">
            <img src="/logo.png" alt="AngoStart" />
          </div>
          <h1 className="auth-title">Criar sua conta</h1>
          <p className="auth-subtitle">Comece sua jornada empreendedora hoje</p>
        </div>

        {/* <!-- Card --> */}
        <div className="auth-card">
          {/* <!-- Step 1: Choose Role --> */}
          <div id="stepRole" className="step-content">
            <div className="card-header">
              <h2>Escolha seu tipo de conta</h2>
              <p className="card-description">Selecione como você deseja usar a AngoStart</p>
            </div>

            <div className="card-content">
              <div className="role-options">
                {/* <!-- Empreendedor --> */}
                <label className="role-card" for="roleEmpreendedor">
                  <input type="radio" name="role" id="roleEmpreendedor" value="empreendedor" checked />
                  <div className="role-content">
                    <div className="role-header">
                      <svg className="role-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                      </svg>
                      <span className="role-title">Empreendedor</span>
                    </div>
                    <p className="role-description">Quero validar e desenvolver minha ideia</p>
                  </div>
                </label>

                {/* <!-- Investidor --> */}
                <label className="role-card" for="roleInvestidor">
                  <input type="radio" name="role" id="roleInvestidor" value="investidor"/>
                  <div className="role-content">
                    <div className="role-header">
                      <svg className="role-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                      </svg>
                      <span className="role-title">Investidor</span>
                    </div>
                    <p className="role-description">Quero investir em startups promissoras</p>
                  </div>
                </label>

                {/* <!-- Mentor --> */}
                <label className="role-card" for="roleMentor">
                  <input type="radio" name="role" id="roleMentor" value="mentor"/>
                  <div className="role-content">
                    <div className="role-header">
                      <svg className="role-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                        <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                      </svg>
                      <span className="role-title">Mentor</span>
                    </div>
                    <p className="role-description">Quero compartilhar conhecimento e experiência</p>
                  </div>
                </label>
              </div>

              <button type="button" className="btn btn-primary btn-block" id="continueBtn">
                Continuar
              </button>

              <div className="auth-footer-link">
                <p>
                  Já tem uma conta? 
                  <Link to={'/dashboard'} className="link-primary">Entrar</Link>
                </p>
              </div>
            </div>
          </div>

          {/* <!-- Step 2: User Details --> */}
          <div id="stepDetails" className="step-content hidden">
            <div className="card-header">
              <h2>Complete seu cadastro</h2>
              <p className="card-description">Preencha seus dados para criar a conta</p>
            </div>

            <div className="card-content">
              <form id="registerForm" className="auth-form">
                {/* <!-- Error Alert --> */}
                <div id="errorAlert" className="alert alert-error hidden">
                  <svg className="alert-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  <span id="errorMessage"></span>
                </div>

                {/* <!-- Name Field --> */}
                <div className="form-group">
                  <label for="name" className="form-label">Nome completo</label>
                  <div className="input-wrapper">
                    <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    <input 
                      type="text" 
                      id="name" 
                      className="form-input" 
                      placeholder="Seu nome"
                      required
                    />
                  </div>
                </div>

                {/* <!-- Email Field --> */}
                <div className="form-group">
                  <label for="email" className="form-label">Email</label>
                  <div className="input-wrapper">
                    <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                    <input 
                      type="email" 
                      id="email" 
                      className="form-input" 
                      placeholder="seu@email.com"
                      required
                    />
                  </div>
                </div>

                {/* <!-- Password Field --> */}
                <div className="form-group">
                  <label for="password" className="form-label">Senha</label>
                  <div className="input-wrapper">
                    <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                    <input 
                      type="password" 
                      id="password" 
                      className="form-input" 
                      placeholder="Mínimo 6 caracteres"
                      required
                    />
                  </div>
                </div>

                {/* <!-- Confirm Password Field --> */}
                <div className="form-group">
                  <label for="confirmPassword" className="form-label">Confirmar senha</label>
                  <div className="input-wrapper">
                    <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                    <input 
                      type="password" 
                      id="confirmPassword" 
                      className="form-input" 
                      placeholder="Digite a senha novamente"
                      required
                    />
                  </div>
                </div>

                {/* <!-- Buttons --> */}
                <div className="form-button-group">
                  <button type="button" className="btn btn-outline" id="backBtn">
                    Voltar
                  </button>
                  <button type="submit" className="btn btn-primary" id="submitBtn">
                    Criar conta
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>

    </div>
  )
}

export default CriarConta