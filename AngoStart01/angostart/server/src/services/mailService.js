import { env } from "../config/env.js";

async function sendWithResend({ to, subject, html }) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: env.MAIL_FROM,
      to: [to],
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const txt = await response.text();
    throw new Error(`Falha ao enviar email via Resend: ${txt || response.status}`);
  }
}

export async function sendPasswordResetEmail({ to, resetUrl }) {
  const subject = "Recuperação de senha - AngoStart";
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
      <h2 style="margin-bottom: 8px;">Recuperação de senha</h2>
      <p>Recebemos um pedido para redefinir a sua senha na AngoStart.</p>
      <p>
        Clique no link abaixo para criar uma nova senha:
        <br />
        <a href="${resetUrl}" target="_blank" rel="noopener noreferrer">${resetUrl}</a>
      </p>
      <p>Este link expira em ${env.PASSWORD_RESET_TTL_MINUTES} minutos.</p>
      <p>Se não fez este pedido, ignore este email.</p>
    </div>
  `;

  if (env.RESEND_API_KEY && env.MAIL_FROM) {
    await sendWithResend({ to, subject, html });
    return;
  }

  // Fallback de desenvolvimento para não bloquear fluxo quando email não está configurado.
  console.log("[PASSWORD RESET][DEV] Email não configurado. Link gerado:", resetUrl);
}
