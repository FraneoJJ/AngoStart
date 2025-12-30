// ===== INTEGRAÇÃO COM AUTENTICAÇÃO =====

function showLoginModal() {
    window.location.href = 'auth.html?screen=login';
}

function showRegisterModal() {
    window.location.href = 'auth.html?screen=register';
}

function showForgotPasswordModal() {
    window.location.href = 'auth.html?screen=forgot';
}

// Atualizar os botões do site principal para redirecionar
document.querySelectorAll('[onclick*="showLogin"]').forEach(btn => {
    btn.onclick = showLoginModal;
});

document.querySelectorAll('[onclick*="showRegister"]').forEach(btn => {
    btn.onclick = showRegisterModal;
});

document.querySelectorAll('[onclick*="showForgotPassword"]').forEach(btn => {
    btn.onclick = showForgotPasswordModal;
});