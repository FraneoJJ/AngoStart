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
    alert('Funcionalidade de recuperação de senha será implementada em breve!');
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
        alert(`Login realizado com sucesso!\nEmail: ${email}`);
        closeModals();
    } else {
        alert('Por favor, preencha todos os campos.');
    }
});

document.getElementById('registerForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name')?.value;
    const email = document.getElementById('email')?.value;
    const password = document.getElementById('password')?.value;
    const confirmPassword = document.getElementById('confirmPassword')?.value;
    
    if (!name || !email || !password || !confirmPassword) {
        alert('Por favor, preencha todos os campos.');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('As senhas não coincidem.');
        return;
    }
    
    // Simulação de registro
    alert(`Conta criada com sucesso!\nBem-vindo(a), ${name}!`);
    closeModals();
});

// ===== EXPLORE IDEAS FUNCTION =====
function exploreIdeas() {
    alert('Redirecionando para a página de ideias...');
    // Aqui você poderia redirecionar para uma página real
    window.location.href = '#';
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
        }
    });
});

// ===== ANIMAÇÕES AO SCROLL =====
function animateOnScroll() {
    const elements = document.querySelectorAll('.card, .section-title, .section-subtitle');
    
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

// Inicializar animações quando a página carregar
window.addEventListener('DOMContentLoaded', () => {
    animateOnScroll();
    
    // Adicionar classe ativa ao link de navegação atual
    const currentSection = window.location.hash || '#hero';
    const navLinks = document.querySelectorAll('.nav-desktop a, .mobile-menu a');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentSection) {
            link.classList.add('active');
        }
    });
});

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

// ===== VALIDAÇÃO DE FORMULÁRIO =====
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

// ===== COOKIE CONSENT =====
function checkCookieConsent() {
    if (!localStorage.getItem('cookieConsent')) {
        // Criar banner de cookies se necessário
        const cookieBanner = document.createElement('div');
        cookieBanner.className = 'cookie-banner';
        cookieBanner.innerHTML = `
            <p>Usamos cookies para melhorar sua experiência. Ao continuar navegando, você concorda com nossa <a href="#">Política de Privacidade</a>.</p>
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
            }
            .cookie-banner p {
                margin: 0;
                flex: 1;
                min-width: 250px;
            }
            .cookie-banner a {
                color: var(--secondary-300);
                text-decoration: underline;
            }
            .btn-sm {
                padding: var(--space-xs) var(--space-lg);
                font-size: 0.875rem;
            }
        `;
        document.head.appendChild(style);
    }
}

function acceptCookies() {
    localStorage.setItem('cookieConsent', 'true');
    document.querySelector('.cookie-banner')?.remove();
}

// Verificar consentimento de cookies quando a página carregar
window.addEventListener('load', checkCookieConsent);