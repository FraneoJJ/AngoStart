/* =================================
   AngoStart - JavaScript Principal
   HTML/CSS/JS Puro - Interações
   ================================= */

// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', function() {
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ===== MOBILE MENU TOGGLE =====
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const menuIcon = mobileMenuBtn.querySelector('.menu-icon');
const closeIcon = mobileMenuBtn.querySelector('.close-icon');

mobileMenuBtn.addEventListener('click', function() {
  const isOpen = !mobileMenu.classList.contains('hidden');
  
  if (isOpen) {
    // Close menu
    mobileMenu.classList.add('hidden');
    menuIcon.classList.remove('hidden');
    closeIcon.classList.add('hidden');
  } else {
    // Open menu
    mobileMenu.classList.remove('hidden');
    menuIcon.classList.add('hidden');
    closeIcon.classList.remove('hidden');
  }
});

// ===== CLOSE MOBILE MENU ON LINK CLICK =====
const mobileLinks = document.querySelectorAll('.mobile-link');
mobileLinks.forEach(function(link) {
  link.addEventListener('click', function() {
    mobileMenu.classList.add('hidden');
    menuIcon.classList.remove('hidden');
    closeIcon.classList.add('hidden');
  });
});

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    
    // Ignore empty hash or just "#"
    if (href === '#' || href === '') {
      e.preventDefault();
      return;
    }

    const target = document.querySelector(href);
    
    if (target) {
      e.preventDefault();
      
      const navbarHeight = navbar.offsetHeight;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-in');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe elements that should animate on scroll
const animateElements = document.querySelectorAll('.step-card, .feature-card');
animateElements.forEach(function(el) {
  observer.observe(el);
});

// ===== STAT COUNTER ANIMATION =====
function animateCounter(element, target, duration) {
  let current = 0;
  const increment = target / (duration / 16); // 60fps
  const isDecimal = target.toString().includes('.');
  const hasSymbol = target.toString().includes('$') || target.toString().includes('+');
  
  const timer = setInterval(function() {
    current += increment;
    
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    
    let displayValue = Math.floor(current);
    
    if (isDecimal) {
      displayValue = current.toFixed(1);
    }
    
    if (target.toString().includes('$')) {
      displayValue = '$' + displayValue + (target.toString().includes('M') ? 'M' : '') + '+';
    } else if (target.toString().includes('+')) {
      displayValue = displayValue + '+';
    }
    
    element.textContent = displayValue;
  }, 16);
}

// Observe hero stats for counter animation
const heroStatsObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      const statValues = entry.target.querySelectorAll('.stat-value');
      
      statValues.forEach(function(stat) {
        const text = stat.textContent;
        let value = parseInt(text.replace(/[^0-9.]/g, ''));
        
        // Handle different value formats
        if (text.includes('M')) {
          stat.setAttribute('data-target', text);
          animateCounter(stat, value, 2000);
        } else {
          stat.setAttribute('data-target', text);
          animateCounter(stat, value, 2000);
        }
      });
      
      heroStatsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
  heroStatsObserver.observe(heroStats);
}

// ===== LOGIN / REGISTER NAVIGATION (PLACEHOLDER) =====
function showLogin() {
  window.location.href = 'html/login.html';
}

function showRegister() {
  window.location.href = 'html/register.html';
}

// ===== PARALLAX EFFECT FOR BACKGROUND BLOBS =====
window.addEventListener('scroll', function() {
  const scrolled = window.pageYOffset;
  const blobs = document.querySelectorAll('.bg-blob');
  
  blobs.forEach(function(blob, index) {
    const speed = (index + 1) * 0.3;
    const yPos = scrolled * speed;
    blob.style.transform = `translateY(${yPos}px)`;
  });
});

// ===== LAZY LOADING FOR IMAGES =====
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        imageObserver.unobserve(img);
      }
    });
  });

  const lazyImages = document.querySelectorAll('img[data-src]');
  lazyImages.forEach(function(img) {
    imageObserver.observe(img);
  });
}

// ===== TYPING EFFECT FOR GRADIENT TEXT (OPTIONAL) =====
function createTypingEffect(element, text, speed) {
  let i = 0;
  element.textContent = '';
  
  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  
  type();
}

// Uncomment to enable typing effect on hero
// const gradientText = document.querySelector('.gradient-text');
// if (gradientText) {
//   const originalText = gradientText.textContent;
//   setTimeout(() => createTypingEffect(gradientText, originalText, 100), 1000);
// }

// ===== ADD ANIMATION CLASSES TO CSS =====
const style = document.createElement('style');
style.textContent = `
  .animate-in {
    animation: slideUp 0.6s ease-out forwards;
  }
  
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(style);

// ===== PERFORMANCE: DEBOUNCE SCROLL EVENTS =====
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = function() {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Apply debounce to scroll-heavy operations
const debouncedScroll = debounce(function() {
  // Add any expensive scroll operations here
}, 100);

window.addEventListener('scroll', debouncedScroll);

// ===== ACCESSIBILITY: KEYBOARD NAVIGATION =====
document.addEventListener('keydown', function(e) {
  // Close mobile menu on ESC key
  if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
    mobileMenu.classList.add('hidden');
    menuIcon.classList.remove('hidden');
    closeIcon.classList.add('hidden');
  }
});

// ===== CONSOLE MESSAGE =====
console.log('%c🚀 AngoStart - Plataforma SaaS', 'font-size: 20px; font-weight: bold; color: #234b75;');
console.log('%cVersão HTML/CSS/JS Puro', 'font-size: 14px; color: #ff6b2b;');
console.log('%cPara funcionalidades completas, use a versão React + Supabase', 'font-size: 12px; color: #6b7280;');

// ===== PAGE LOAD COMPLETE =====
window.addEventListener('load', function() {
  console.log('✅ Página carregada com sucesso!');
  
  // Remove loading class if exists
  document.body.classList.remove('loading');
  
  // Trigger any initial animations
  setTimeout(function() {
    const hero = document.getElementById('hero');
    if (hero) {
      hero.classList.add('loaded');
    }
  }, 100);
});

// ===== PREVENT ORPHAN ANIMATIONS =====
// Ensure all animations complete even if user navigates quickly
window.addEventListener('beforeunload', function() {
  document.body.classList.add('unloading');
});