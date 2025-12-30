// ===== VARIÁVEIS GLOBAIS =====
let selectedAccountType = '';
let demoAccounts = {
    'empreendedor@angostart.com': 'empreendedor',
    'investidor@angostart.com': 'investidor', 
    'mentor@angostart.com': 'mentor',
    'admin@angostart.com': 'admin'
};

// ===== CONTROLE DE TELAS =====
function showScreen(screenName) {
    // Esconder todas as telas
    document.querySelectorAll('.auth-screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Mostrar tela solicitada
    const targetScreen = document.getElementById(`${screenName}Screen`);
    if (targetScreen) {
        targetScreen.classList.add('active');
        targetScreen.classList.add('slide-left');
        
        // Remover classe de animação após completar
        setTimeout(() => {
            targetScreen.classList.remove('slide-left');
        }, 300);
        
        // Ajustar título da página
        updatePageTitle(screenName);
    }
}

function updatePageTitle(screenName) {
    const titles = {
        'login': 'Entrar - AngoStart',
        'registerType': 'Criar Conta - AngoStart',
        'registerData': 'Cadastro - AngoStart',
        'forgotPassword': 'Recuperar Senha - AngoStart',
        'resetPassword': 'Redefinir Senha - AngoStart'
    };
    
    document.title = titles[screenName] || 'AngoStart - Autenticação';
}

// ===== GERENCIAMENTO DE CONTA DE DEMONSTRAÇÃO =====
function setupDemoAccounts() {
    document.getElementById('loginEmail').addEventListener('input', function() {
        const email = this.value.toLowerCase();
        if (demoAccounts[email]) {
            this.style.borderColor = 'var(--success-500)';
            this.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
        } else {
            this.style.borderColor = '';
            this.style.boxShadow = '';
        }
    });
    
    // Preencher automaticamente ao clicar em uma conta de demo
    document.querySelectorAll('.demo-account').forEach(account => {
        account.addEventListener('click', function() {
            const email = this.querySelector('.demo-email').textContent;
            document.getElementById('loginEmail').value = email;
            document.getElementById('loginPassword').value = '123456'; // Senha padrão para demo
            document.getElementById('loginEmail').focus();
            showNotification('success', 'Conta de demonstração carregada. Qualquer senha funciona!');
        });
    });
}

// ===== ESCOLHA DO TIPO DE CONTA =====
function setupAccountTypeSelection() {
    const accountTypeOptions = document.querySelectorAll('input[name="accountType"]');
    const continueBtn = document.getElementById('continueBtn');
    
    accountTypeOptions.forEach(option => {
        option.addEventListener('change', function() {
            if (this.checked) {
                selectedAccountType = this.value;
                continueBtn.disabled = false;
                continueBtn.classList.add('btn-pulse');
                
                // Destacar opção selecionada
                accountTypeOptions.forEach(opt => {
                    const label = opt.nextElementSibling;
                    if (opt === this) {
                        label.classList.add('selected');
                    } else {
                        label.classList.remove('selected');
                    }
                });
            }
        });
    });
}

function continueToRegister() {
    if (!selectedAccountType) {
        showNotification('error', 'Por favor, selecione um tipo de conta.');
        return;
    }
    
    showScreen('registerData');
    
    // Adicionar efeito visual para o tipo de conta selecionado
    const accountTypeLabel = document.querySelector(`[for="type${capitalizeFirstLetter(selectedAccountType)}"]`);
    if (accountTypeLabel) {
        const accountIcon = accountTypeLabel.querySelector('.account-type-icon');
        accountIcon.style.background = 'linear-gradient(135deg, var(--secondary-500), var(--secondary-600))';
    }
}

function backToAccountType() {
    showScreen('registerType');
    
    // Resetar seleção visual
    document.querySelectorAll('.account-type-label').forEach(label => {
        label.classList.remove('selected');
    });
}

// ===== VALIDAÇÃO DE FORMULÁRIOS =====
function validatePasswordMatch() {
    const password = document.getElementById('registerPassword');
    const confirmPassword = document.getElementById('registerConfirmPassword');
    const matchMessage = document.getElementById('passwordMatch');
    
    if (!password.value || !confirmPassword.value) {
        matchMessage.textContent = '';
        matchMessage.className = 'validation-message';
        return false;
    }
    
    if (password.value === confirmPassword.value) {
        matchMessage.textContent = '✓ As senhas coincidem';
        matchMessage.className = 'validation-message success';
        return true;
    } else {
        matchMessage.textContent = '✗ As senhas não coincidem';
        matchMessage.className = 'validation-message error';
        return false;
    }
}

function validateResetPasswordMatch() {
    const password = document.getElementById('resetPassword');
    const confirmPassword = document.getElementById('resetConfirmPassword');
    const matchMessage = document.getElementById('resetPasswordMatch');
    
    if (!password.value || !confirmPassword.value) {
        matchMessage.textContent = '';
        matchMessage.className = 'validation-message';
        return false;
    }
    
    if (password.value === confirmPassword.value) {
        matchMessage.textContent = '✓ As senhas coincidem';
        matchMessage.className = 'validation-message success';
        return true;
    } else {
        matchMessage.textContent = '✗ As senhas não coincidem';
        matchMessage.className = 'validation-message error';
        return false;
    }
}

function checkPasswordStrength(password) {
    let strength = 0;
    const strengthBar = document.querySelector('.strength-bar');
    const strengthValue = document.getElementById('strengthValue');
    
    if (!password) {
        strengthBar.style.width = '0%';
        strengthBar.style.backgroundColor = 'var(--neutral-300)';
        strengthValue.textContent = 'fraca';
        return 'weak';
    }
    
    // Verificar comprimento
    if (password.length >= 8) strength++;
    
    // Verificar letras minúsculas
    if (/[a-z]/.test(password)) strength++;
    
    // Verificar letras maiúsculas
    if (/[A-Z]/.test(password)) strength++;
    
    // Verificar números
    if (/[0-9]/.test(password)) strength++;
    
    // Verificar caracteres especiais
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    // Atualizar visualização
    let strengthLevel, color, width;
    switch(strength) {
        case 0:
        case 1:
            strengthLevel = 'fraca';
            color = 'var(--error-500)';
            width = '20%';
            break;
        case 2:
        case 3:
            strengthLevel = 'média';
            color = 'var(--warning-500)';
            width = '50%';
            break;
        case 4:
            strengthLevel = 'forte';
            color = 'var(--success-500)';
            width = '75%';
            break;
        case 5:
            strengthLevel = 'muito forte';
            color = 'var(--success-600)';
            width = '100%';
            break;
        default:
            strengthLevel = 'fraca';
            color = 'var(--error-500)';
            width = '20%';
    }
    
    strengthBar.style.width = width;
    strengthBar.style.backgroundColor = color;
    strengthValue.textContent = strengthLevel;
    
    return strengthLevel;
}

// ===== MANIPULAÇÃO DE FORMULÁRIOS =====
function setupFormValidation() {
    // Validação de senha no registro
    const registerPassword = document.getElementById('registerPassword');
    const registerConfirmPassword = document.getElementById('registerConfirmPassword');
    
    if (registerPassword && registerConfirmPassword) {
        registerPassword.addEventListener('input', validatePasswordMatch);
        registerConfirmPassword.addEventListener('input', validatePasswordMatch);
    }
    
    // Validação de senha no reset
    const resetPassword = document.getElementById('resetPassword');
    const resetConfirmPassword = document.getElementById('resetConfirmPassword');
    
    if (resetPassword && resetConfirmPassword) {
        resetPassword.addEventListener('input', function() {
            checkPasswordStrength(this.value);
            validateResetPasswordMatch();
        });
        resetConfirmPassword.addEventListener('input', validateResetPasswordMatch);
    }
    
    // Formulário de Login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Formulário de Registro
    const registerForm = document.getElementById('registerDataForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    // Formulário de Recuperação de Senha
    const forgotForm = document.getElementById('forgotPasswordForm');
    if (forgotForm) {
        forgotForm.addEventListener('submit', handleForgotPassword);
    }
    
    // Formulário de Redefinição de Senha
    const resetForm = document.getElementById('resetPasswordForm');
    if (resetForm) {
        resetForm.addEventListener('submit', handleResetPassword);
    }
}

async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Validação básica
    if (!email || !password) {
        showNotification('error', 'Por favor, preencha todos os campos.');
        return;
    }
    
    // Mostrar loading
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Entrando...';
    submitBtn.disabled = true;
    
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Verificar se é conta de demonstração
    if (demoAccounts[email.toLowerCase()]) {
        // Login bem-sucedido para demonstração
        showNotification('success', `Bem-vindo, ${demoAccounts[email.toLowerCase()]}! Login realizado com sucesso.`);
        
        // Redirecionar para dashboard após 1.5 segundos
        setTimeout(() => {
            window.location.href = 'index.html'; // Mudar para dashboard real
        }, 1500);
    } else {
        // Verificar se é um email válido
        if (!isValidEmail(email)) {
            showNotification('error', 'Por favor, insira um email válido.');
        } else if (password.length < 6) {
            showNotification('error', 'A senha deve ter pelo menos 6 caracteres.');
        } else {
            showNotification('success', 'Login realizado com sucesso!');
            
            // Redirecionar após sucesso
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        }
    }
    
    // Restaurar botão
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
}

async function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    
    // Validação
    if (!name || !email || !password || !confirmPassword) {
        showNotification('error', 'Por favor, preencha todos os campos.');
        return;
    }
    
    if (!selectedAccountType) {
        showNotification('error', 'Por favor, selecione um tipo de conta.');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('error', 'Por favor, insira um email válido.');
        return;
    }
    
    if (password.length < 6) {
        showNotification('error', 'A senha deve ter pelo menos 6 caracteres.');
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('error', 'As senhas não coincidem.');
        return;
    }
    
    // Mostrar loading
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Criando conta...';
    submitBtn.disabled = true;
    
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Verificar se email já existe (simulação)
    if (demoAccounts[email.toLowerCase()]) {
        showNotification('error', 'Este email já está em uso. Por favor, use outro email.');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        return;
    }
    
    // Registro bem-sucedido
    showNotification('success', `Conta criada com sucesso! Bem-vindo(a), ${name}!`);
    
    // Mostrar modal de confirmação de email
    document.getElementById('confirmationEmail').textContent = email;
    showModal('emailConfirmationModal');
    
    // Restaurar botão
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
}

async function handleForgotPassword(e) {
    e.preventDefault();
    
    const email = document.getElementById('forgotEmail').value;
    
    if (!email) {
        showNotification('error', 'Por favor, insira seu email.');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('error', 'Por favor, insira um email válido.');
        return;
    }
    
    // Mostrar loading
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    submitBtn.disabled = true;
    
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulação de envio de email
    showNotification('success', `Link de recuperação enviado para ${email}. Verifique sua caixa de entrada.`);
    
    // Redirecionar para tela de reset de senha após 2 segundos
    setTimeout(() => {
        showScreen('resetPassword');
    }, 2000);
    
    // Restaurar botão
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
}

async function handleResetPassword(e) {
    e.preventDefault();
    
    const password = document.getElementById('resetPassword').value;
    const confirmPassword = document.getElementById('resetConfirmPassword').value;
    
    if (!password || !confirmPassword) {
        showNotification('error', 'Por favor, preencha todos os campos.');
        return;
    }
    
    if (password.length < 6) {
        showNotification('error', 'A senha deve ter pelo menos 6 caracteres.');
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('error', 'As senhas não coincidem.');
        return;
    }
    
    // Mostrar loading
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Redefinindo...';
    submitBtn.disabled = true;
    
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Sucesso
    showNotification('success', 'Senha redefinida com sucesso!');
    
    // Redirecionar para login após 1.5 segundos
    setTimeout(() => {
        showScreen('login');
        
        // Limpar campos
        document.getElementById('resetPassword').value = '';
        document.getElementById('resetConfirmPassword').value = '';
    }, 1500);
    
    // Restaurar botão
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
}

// ===== FUNÇÕES UTILITÁRIAS =====
function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
    const toggleBtn = field.parentElement.querySelector('.toggle-password i');
    
    if (field.type === 'password') {
        field.type = 'text';
        toggleBtn.classList.remove('fa-eye');
        toggleBtn.classList.add('fa-eye-slash');
    } else {
        field.type = 'password';
        toggleBtn.classList.remove('fa-eye-slash');
        toggleBtn.classList.add('fa-eye');
    }
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.style.opacity = '1';
        }, 10);
    }
}

function closeModal() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    });
}

function resendConfirmation() {
    showNotification('success', 'Email de confirmação reenviado!');
    closeModal();
    
    // Simular delay e fechar modal
    setTimeout(() => {
        showScreen('login');
    }, 2000);
}

function showNotification(type, message) {
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Adicionar estilos se não existirem
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                border-radius: var(--radius-lg);
                padding: var(--space-md) var(--space-lg);
                box-shadow: var(--shadow-xl);
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: var(--space-lg);
                max-width: 400px;
                z-index: 9999;
                animation: slideInRight 0.3s ease;
                border-left: 4px solid;
            }
            .notification-success {
                border-left-color: var(--success-500);
                background: var(--success-100);
            }
            .notification-error {
                border-left-color: var(--error-500);
                background: var(--error-100);
            }
            .notification-info {
                border-left-color: var(--info-500);
                background: var(--info-100);
            }
            .notification-content {
                display: flex;
                align-items: center;
                gap: var(--space-md);
            }
            .notification-content i {
                font-size: 1.25rem;
            }
            .notification-success .notification-content i {
                color: var(--success-500);
            }
            .notification-error .notification-content i {
                color: var(--error-500);
            }
            .notification-info .notification-content i {
                color: var(--info-500);
            }
            .notification-close {
                background: none;
                border: none;
                color: var(--neutral-500);
                cursor: pointer;
                padding: var(--space-xs);
                border-radius: var(--radius-sm);
            }
            .notification-close:hover {
                background: rgba(0,0,0,0.1);
            }
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            .btn-pulse {
                animation: pulse 2s infinite;
            }
            @keyframes pulse {
                0% { box-shadow: 0 0 0 0 rgba(255, 107, 43, 0.4); }
                70% { box-shadow: 0 0 0 10px rgba(255, 107, 43, 0); }
                100% { box-shadow: 0 0 0 0 rgba(255, 107, 43, 0); }
            }
        `;
        document.head.appendChild(styles);
    }
    
    // Adicionar ao body
    document.body.appendChild(notification);
    
    // Remover automaticamente após 5 segundos
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
    // Configurar contas de demonstração
    setupDemoAccounts();
    
    // Configurar seleção de tipo de conta
    setupAccountTypeSelection();
    
    // Configurar validação de formulários
    setupFormValidation();
    
    // Verificar se há parâmetros na URL
    const urlParams = new URLSearchParams(window.location.search);
    const screenParam = urlParams.get('screen');
    
    if (screenParam && ['login', 'register', 'forgot', 'reset'].includes(screenParam)) {
        const screenMap = {
            'login': 'login',
            'register': 'registerType',
            'forgot': 'forgotPassword',
            'reset': 'resetPassword'
        };
        showScreen(screenMap[screenParam]);
    } else {
        // Tela padrão é login
        showScreen('login');
    }
    
    // Fechar modal ao clicar fora
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });
    });
    
    // Fechar modal com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
    
    // Adicionar botão de voltar no navegador
    window.addEventListener('popstate', function() {
        const currentScreen = document.querySelector('.auth-screen.active').id.replace('Screen', '');
        if (currentScreen !== 'login') {
            showScreen('login');
        }
    });
});