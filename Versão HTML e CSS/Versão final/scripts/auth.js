/* =================================
   AngoStart - Login Page Script
   ================================= */

// Demo user credentials
const DEMO_USERS = {
  'empreendedor@angostart.com': { role: 'empreendedor', name: 'João Empreendedor' },
  'investidor@angostart.com': { role: 'investidor', name: 'Maria Investidora' },
  'mentor@angostart.com': { role: 'mentor', name: 'Carlos Mentor' },
  'admin@angostart.com': { role: 'admin', name: 'Admin Sistema' }
};

const form = document.getElementById('loginForm');
const submitBtn = document.getElementById('submitBtn');
const errorAlert = document.getElementById('errorAlert');
const errorMessage = document.getElementById('errorMessage');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

form.addEventListener('submit', function(e) {
  e.preventDefault();
  
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  
  // Hide previous errors
  errorAlert.classList.add('hidden');
  
  // Validate
  if (!email || !password) {
    showError('Por favor, preencha todos os campos');
    return;
  }
  
  // Show loading
  submitBtn.disabled = true;
  submitBtn.textContent = 'Entrando...';
  
  // Simulate API call
  setTimeout(function() {
    // Check if user exists
    const user = DEMO_USERS[email.toLowerCase()];
    
    if (user) {
      // Save to localStorage
      localStorage.setItem('angostart_user', JSON.stringify({
        email: email,
        name: user.name,
        role: user.role,
        isAuthenticated: true
      }));
      
      // Redirect to dashboard
      window.location.href = 'dashboard.html';
    } else {
      showError('Email ou senha incorretos');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Entrar';
    }
  }, 1000);
});

function showError(message) {
  errorMessage.textContent = message;
  errorAlert.classList.remove('hidden');
  
  // Scroll to error
  errorAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Auto-fill for demo (optional)
document.addEventListener('DOMContentLoaded', function() {
  // Check if already logged in
  const user = JSON.parse(localStorage.getItem('angostart_user') || 'null');
  if (user && user.isAuthenticated) {
    window.location.href = 'dashboard.html';
  }
});
