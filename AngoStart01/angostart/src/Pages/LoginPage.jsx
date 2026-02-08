import React from 'react'
import { Link } from 'react-router-dom'
import '../style/auth.css'

const Login = ({ email, setEmail, password, setPassword, error, handleLogin, users }) => {
  return (
    <div className="auth-page">
        <div className="auth-container">
    <div className="auth-content">
      {/* <!-- Header --> */}
      <div className="auth-header">
        <div className="auth-logo">
          <img src="..//logo.png" alt="AngoStart"/>
        </div>
        <h1 className="auth-title">Bem-vindo de volta!</h1>
        <p className="auth-subtitle">Entre para continuar sua jornada empreendedora</p>
      </div>

      {/* <!-- Card --> */}
      <div className="auth-card">
        <div className="card-header">
          <h2>Entrar na sua conta</h2>
          <p className="card-description">Digite suas credenciais para acessar a plataforma</p>
        </div>

        <div className="card-content">
          <form id="loginForm" className="auth-form">
            {/* <!-- Error Alert --> */}
            <div id="errorAlert" className="alert alert-error hidden">
              <svg className="alert-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span id="errorMessage">Email ou senha incorretos</span>
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
                  value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                {error && (
                <div className="alert alert-error">{error}</div>
              )}
              </div>
            </div>

            {/* <!-- Forgot Password --> */}
            <div className="form-actions">
              <Link to={'/recuperar-senha'} className="link-primary">Esqueceu a senha?</Link>
            </div>

            {/* <!-- Submit Button --> */}
            <button type="submit" className="btn btn-primary btn-block" id="submitBtn" onClick={handleLogin}>
              Entrar
            </button>

            {/* <!-- Register Link --> */}
            <div className="auth-footer-link">
              <p>
                Não tem uma conta? 
                <Link to={'/criar-conta'} className="link-primary">Criar conta</Link>
              </p>
            </div>

            {/* <!-- Demo Credentials --> */}
            <div className="demo-box">
              <p className="demo-title">Usuários de teste</p>
              <div className="demo-list">
                <p>• empreendedor@gmail.com / 123456</p>
                <p>• investidor@gmail.com / 123456</p>
                <p>• mentor@gmail.com / 123456</p>
                <p>• admin@gmail.com / 123456</p>
                <p className="demo-note">Qualquer senha funciona</p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
    </div>
  )
}

export default Login