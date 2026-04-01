import React from 'react'
import { Link } from 'react-router-dom'
import '../style/auth.css'

import { useRouteError } from 'react-router-dom'

const logoUrl = `${import.meta.env.BASE_URL}logo.png`

const ErrorPage = () => {
  const error = useRouteError()
  console.error(error)

  return (
    <div className="auth-page">
    <div className="auth-container">
    <div className="auth-content">
      {/* <!-- Header --> */}
      <div className="auth-header">
        <div className="auth-logo">
          <img src={logoUrl} alt="AngoStart"/>
        </div>
      </div>

      {/* <!-- Card --> */}
      <div className="auth-card">
        <div className="card-header">
          <h2 style={{display: "flex", alignItems: "center", gap: "0.5rem"}}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-x-icon lucide-circle-x"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
            Ops! Algo deu errado.
          </h2>
          <p className="card-description">{error.error.message}</p>
        </div>

        <div className="card-content">
          <form id="forgotPasswordForm" className="auth-form">
            {/* <!-- Submit Button --> */}
            <Link to="/" className="btn btn-primary btn-block">
              Voltar para a página inicial
            </Link>

          </form>
        </div>
      </div>
    </div>
  </div>
</div>
    
  )
}

export default ErrorPage