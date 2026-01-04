/* =================================
   AngoStart - Register Page Script
   ================================= */

// Step management
const stepRole = document.getElementById('stepRole');
const stepDetails = document.getElementById('stepDetails');
const continueBtn = document.getElementById('continueBtn');
const backBtn = document.getElementById('backBtn');
const form = document.getElementById('registerForm');
const submitBtn = document.getElementById('submitBtn');
const errorAlert = document.getElementById('errorAlert');
const errorMessage = document.getElementById('errorMessage');

// Form inputs
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');

// Role selection
const roleInputs = document.querySelectorAll('input[name="role"]');

// Continue to step 2
continueBtn.addEventListener('click', function() {
  stepRole.classList.add('hidden');
  stepDetails.classList.remove('hidden');
});

// Back to step 1
backBtn.addEventListener('click', function() {
  stepDetails.classList.add('hidden');
  stepRole.classList.remove('hidden');
  
  // Clear error
  errorAlert.classList.add('hidden');
});

// Form submission
form.addEventListener('submit', function(e) {
  e.preventDefault();
  
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;
  
  // Get selected role
  let selectedRole = 'empreendedor';
  roleInputs.forEach(function(input) {
    if (input.checked) {
      selectedRole = input.value;
    }
  });
  
  // Hide previous errors
  errorAlert.classList.add('hidden');
  
  // Validation
  if (!name || !email || !password || !confirmPassword) {
    showError('Por favor, preencha todos os campos');
    return;
  }
  
  if (password !== confirmPassword) {
    showError('As senhas não coincidem');
    return;
  }
  
  if (password.length < 6) {
    showError('A senha deve ter pelo menos 6 caracteres');
    return;
  }
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showError('Por favor, insira um email válido');
    return;
  }
  
  // Show loading
  submitBtn.disabled = true;
  submitBtn.textContent = 'Criando conta...';
  
  // Simulate API call
  setTimeout(function() {
    // Save user to localStorage
    localStorage.setItem('angostart_user', JSON.stringify({
      email: email,
      name: name,
      role: selectedRole,
      isAuthenticated: true
    }));
    
    // Show success message
    alert('Conta criada com sucesso! Redirecionando...');
    
    // Redirect to dashboard
    window.location.href = 'dashboard.html';
  }, 1500);
});

function showError(message) {
  errorMessage.textContent = message;
  errorAlert.classList.remove('hidden');
  
  // Scroll to error
  errorAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  
  // Reset button
  submitBtn.disabled = false;
  submitBtn.textContent = 'Criar conta';
}

// Check if already logged in
document.addEventListener('DOMContentLoaded', function() {
  const user = JSON.parse(localStorage.getItem('angostart_user') || 'null');
  if (user && user.isAuthenticated) {
    window.location.href = 'dashboard.html';
  }
});

// Add visual feedback for role selection
roleInputs.forEach(function(input) {
  input.addEventListener('change', function() {
    // Optional: Add animation or feedback
    const card = input.closest('.role-card');
    card.style.transform = 'scale(1.02)';
    setTimeout(function() {
      card.style.transform = 'scale(1)';
    }, 200);
  });
});
