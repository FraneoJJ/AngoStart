import React, { useState } from "react";
import { Link } from "react-router-dom";
import { requestPasswordReset } from "../services/authApi";
import "../style/auth.css";

const RecuperarSenha = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const resp = await requestPasswordReset(email.trim());
      setMessage(resp?.message || "Se o email existir na plataforma, enviaremos o link de recuperação.");
      setEmail("");
    } catch (err) {
      setError(err.message || "Falha ao enviar pedido de recuperação.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-content">
          <div className="auth-header">
            <div className="auth-logo">
              <img src="/logo.png" alt="AngoStart" />
            </div>
            <h1 className="auth-title">Recuperar senha</h1>
            <p className="auth-subtitle">Digite seu email para receber instruções</p>
          </div>

          <div className="auth-card">
            <div className="card-header">
              <h2>Esqueceu sua senha?</h2>
              <p className="card-description">Enviaremos um link de recuperação para seu email</p>
            </div>

            <div className="card-content">
              <form id="forgotPasswordForm" className="auth-form" onSubmit={onSubmit}>
                {message && (
                  <div className="alert alert-success">
                    <span>{message}</span>
                  </div>
                )}
                {error && (
                  <div className="alert alert-error">
                    <span>{error}</span>
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email</label>
                  <div className="input-wrapper">
                    <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
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

                <button type="submit" className="btn btn-primary btn-block" id="submitBtn" disabled={loading}>
                  {loading ? "Enviando..." : "Enviar link de recuperação"}
                </button>

                <div className="auth-footer-link">
                  <p>
                    Lembrou sua senha?{" "}
                    <Link to="/dashboard" className="link-primary">Voltar ao login</Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecuperarSenha;