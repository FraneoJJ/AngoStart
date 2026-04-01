import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword, validateResetToken } from "../services/authApi";
import "../style/auth.css";

const logoUrl = `${import.meta.env.BASE_URL}logo.png`;

function validatePasswordStrength(password) {
  if (password.length < 8) return "A senha deve ter no mínimo 8 caracteres.";
  if (!/[A-Z]/.test(password)) return "A senha deve conter pelo menos uma letra maiúscula.";
  if (!/[a-z]/.test(password)) return "A senha deve conter pelo menos uma letra minúscula.";
  if (!/[0-9]/.test(password)) return "A senha deve conter pelo menos um número.";
  return "";
}

const RedefinirSenhaPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = useMemo(() => searchParams.get("token") || "", [searchParams]);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [tokenError, setTokenError] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      if (!token) {
        setTokenError("Token de recuperação ausente.");
        setValidating(false);
        return;
      }
      try {
        await validateResetToken(token);
        setTokenError("");
      } catch (err) {
        setTokenError(err.message || "Link de recuperação inválido ou expirado.");
      } finally {
        setValidating(false);
      }
    })();
  }, [token]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const strengthError = validatePasswordStrength(password);
    if (strengthError) {
      setError(strengthError);
      return;
    }
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    try {
      const resp = await resetPassword(token, password);
      setMessage(resp?.message || "Senha redefinida com sucesso.");
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => navigate("/dashboard"), 1800);
    } catch (err) {
      setError(err.message || "Falha ao redefinir senha.");
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
              <img src={logoUrl} alt="AngoStart" />
            </div>
            <h1 className="auth-title">Redefinir senha</h1>
            <p className="auth-subtitle">Crie uma nova senha segura para sua conta</p>
          </div>

          <div className="auth-card">
            <div className="card-header">
              <h2>Nova senha</h2>
              <p className="card-description">Use uma senha forte para proteger sua conta.</p>
            </div>

            <div className="card-content">
              {validating ? (
                <p>A validar link de recuperação...</p>
              ) : tokenError ? (
                <div className="auth-form">
                  <div className="alert alert-error">
                    <span>{tokenError}</span>
                  </div>
                  <Link to="/recuperar-senha" className="btn btn-outline btn-block">
                    Solicitar novo link
                  </Link>
                </div>
              ) : (
                <form className="auth-form" onSubmit={onSubmit}>
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
                    <label htmlFor="password" className="form-label">Nova senha</label>
                    <div className="input-wrapper">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        className="form-input password-input-with-toggle"
                        style={{ paddingLeft: "0.75rem" }}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="input-toggle-btn"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={showPassword ? "Ocultar nova senha" : "Mostrar nova senha"}
                      >
                        {showPassword ? (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C7 20 2.73 16.11 1 12c.73-1.73 1.81-3.24 3.16-4.44" />
                            <path d="M10.58 10.58A2 2 0 0 0 12 14a2 2 0 0 0 1.42-.58" />
                            <path d="M1 1l22 22" />
                            <path d="M9.88 4.24A10.94 10.94 0 0 1 12 4c5 0 9.27 3.89 11 8a11.8 11.8 0 0 1-1.67 2.79" />
                          </svg>
                        ) : (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmPassword" className="form-label">Confirmar senha</label>
                    <div className="input-wrapper">
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        className="form-input password-input-with-toggle"
                        style={{ paddingLeft: "0.75rem" }}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="input-toggle-btn"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        aria-label={showConfirmPassword ? "Ocultar confirmação de senha" : "Mostrar confirmação de senha"}
                      >
                        {showConfirmPassword ? (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C7 20 2.73 16.11 1 12c.73-1.73 1.81-3.24 3.16-4.44" />
                            <path d="M10.58 10.58A2 2 0 0 0 12 14a2 2 0 0 0 1.42-.58" />
                            <path d="M1 1l22 22" />
                            <path d="M9.88 4.24A10.94 10.94 0 0 1 12 4c5 0 9.27 3.89 11 8a11.8 11.8 0 0 1-1.67 2.79" />
                          </svg>
                        ) : (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                    {loading ? "Atualizando..." : "Redefinir senha"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RedefinirSenhaPage;
