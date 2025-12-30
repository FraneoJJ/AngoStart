// ===== MOBILE MENU =====
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

function toggleMobileMenu() {
    mobileMenu.classList.toggle('active');
    const icon = mobileMenuBtn.querySelector('i');
    if (mobileMenu.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
}

function closeMobileMenu() {
    mobileMenu.classList.remove('active');
    const icon = mobileMenuBtn.querySelector('i');
    icon.classList.remove('fa-times');
    icon.classList.add('fa-bars');
}

mobileMenuBtn.addEventListener('click', toggleMobileMenu);

// Fechar menu ao clicar fora
document.addEventListener('click', (event) => {
    if (!mobileMenu.contains(event.target) && !mobileMenuBtn.contains(event.target)) {
        closeMobileMenu();
    }
});

// ===== TAB SYSTEM =====
function openTab(tabName) {
    // Esconder todos os tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remover classe active de todos os botões
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Mostrar o tab selecionado
    document.getElementById(tabName).classList.add('active');
    
    // Adicionar classe active ao botão clicado
    event.currentTarget.classList.add('active');
}

// ===== AUTH MODALS =====
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');

function showLogin() {
    closeModals();
    loginModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function showRegister() {
    closeModals();
    registerModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function showForgotPassword() {
    closeModals();
    alert('Em breve você receberá um email para redefinir sua senha!');
    showLogin();
}

function closeModals() {
    loginModal.classList.remove('active');
    registerModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Fechar modais ao clicar fora
window.addEventListener('click', (event) => {
    if (event.target === loginModal) {
        closeModals();
    }
    if (event.target === registerModal) {
        closeModals();
    }
});

// Fechar modais com ESC
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeModals();
    }
});

// ===== FORM HANDLING =====
document.getElementById('loginForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Simulação de login
    if (email && password) {
        showNotification('success', 'Login realizado com sucesso!');
        closeModals();
    } else {
        showNotification('error', 'Por favor, preencha todos os campos.');
    }
});

document.getElementById('registerForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name')?.value;
    const email = document.getElementById('email')?.value;
    const password = document.getElementById('password')?.value;
    const confirmPassword = document.getElementById('confirmPassword')?.value;
    const userType = document.getElementById('userType')?.value;
    
    if (!name || !email || !password || !confirmPassword || !userType) {
        showNotification('error', 'Por favor, preencha todos os campos.');
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('error', 'As senhas não coincidem.');
        return;
    }
    
    // Simulação de registro
    showNotification('success', `Conta criada com sucesso! Bem-vindo(a), ${name}!`);
    closeModals();
});

// ===== FUNÇÕES DE INTERAÇÃO =====
function exploreIdeas() {
    showNotification('info', 'Redirecionando para o marketplace de ideias...');
    // Aqui você poderia redirecionar para uma página real
    setTimeout(() => {
        window.location.href = '#funcionalidades';
    }, 1000);
}

function contactExpert() {
    showNotification('info', 'Entraremos em contato em breve para agendar uma conversa!');
}

function investInStartups() {
    showNotification('success', 'Agora você pode explorar todas as oportunidades de investimento!');
}

function becomeMentor() {
    showNotification('success', 'Obrigado pelo seu interesse! Entraremos em contato em breve.');
}

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
            closeMobileMenu();
        }
    });
});

// ===== ANIMAÇÕES AO SCROLL =====
function animateOnScroll() {
    const elements = document.querySelectorAll('.card, .section-title, .section-subtitle, .feature-card, .mentor-card, .investment-card, .testimonial-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// ===== NAVIGATION HIGHLIGHT =====
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-desktop a, .mobile-menu a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// ===== NOTIFICAÇÕES =====
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
    
    // Adicionar ao body
    document.body.appendChild(notification);
    
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
                animation: slideIn 0.3s ease;
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
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(styles);
    }
    
    // Remover automaticamente após 5 segundos
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// ===== COOKIE CONSENT =====
function checkCookieConsent() {
    if (!localStorage.getItem('cookieConsent')) {
        // Criar banner de cookies se necessário
        const cookieBanner = document.createElement('div');
        cookieBanner.className = 'cookie-banner';
        cookieBanner.innerHTML = `
            <p>Usamos cookies para melhorar sua experiência. Ao continuar navegando, você concorda com nossa <a href="#" onclick="showPrivacyPolicy()">Política de Privacidade</a>.</p>
            <button onclick="acceptCookies()" class="btn btn-sm btn-primary">Aceitar</button>
        `;
        document.body.appendChild(cookieBanner);
        
        // Estilos para o banner de cookies
        const style = document.createElement('style');
        style.textContent = `
            .cookie-banner {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background: var(--neutral-900);
                color: white;
                padding: var(--space-lg);
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
                align-items: center;
                gap: var(--space-md);
                z-index: 1000;
                animation: slideUp 0.3s ease;
            }
            .cookie-banner p {
                margin: 0;
                flex: 1;
                min-width: 250px;
                font-size: 0.875rem;
            }
            .cookie-banner a {
                color: var(--secondary-300);
                text-decoration: underline;
            }
            .btn-sm {
                padding: var(--space-xs) var(--space-lg);
                font-size: 0.875rem;
            }
            @keyframes slideUp {
                from {
                    transform: translateY(100%);
                }
                to {
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

function acceptCookies() {
    localStorage.setItem('cookieConsent', 'true');
    document.querySelector('.cookie-banner')?.remove();
    showNotification('success', 'Preferências de cookies salvas!');
}

function showPrivacyPolicy() {
    alert('Política de Privacidade: Respeitamos sua privacidade e usamos cookies apenas para melhorar sua experiência no site.');
}

// ===== INICIALIZAÇÃO =====
window.addEventListener('DOMContentLoaded', () => {
    animateOnScroll();
    checkCookieConsent();
    
    // Inicializar primeiro tab
    if (document.querySelector('.tab-btn')) {
        document.querySelector('.tab-btn').click();
    }
});

// ===== CONTAGEM DE IDEIAS =====
function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current).toLocaleString();
    }, 30);
}

// Animar contadores quando visíveis
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll('.stat-value');
            counters.forEach(counter => {
                const target = parseInt(counter.textContent.replace('+', '').replace('$', ''));
                animateCounter(counter, target);
            });
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

// Observar hero section para animar contadores
const heroSection = document.querySelector('.hero-section');
if (heroSection) {
    counterObserver.observe(heroSection);
}