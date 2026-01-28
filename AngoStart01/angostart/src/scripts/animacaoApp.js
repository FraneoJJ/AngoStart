import { useEffect } from 'react';

export const useAppAnimations = () => {
  useEffect(() => {
    // 1. Efeito de Scroll na Navbar
    const navbar = document.getElementById('navbar');
    const handleScroll = () => {
      if (navbar) {
        if (window.scrollY > 20) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      }
    };

    // 2. Menu Mobile (Lógica segura para React)
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    const toggleMenu = () => {
      if (mobileMenu) {
        mobileMenu.classList.toggle('hidden');
        // Alterna os ícones manualmente se eles existirem
        const menuIcon = mobileMenuBtn?.querySelector('.menu-icon');
        const closeIcon = mobileMenuBtn?.querySelector('.close-icon');
        menuIcon?.classList.toggle('hidden');
        closeIcon?.classList.toggle('hidden');
      }
    };

    // 3. Animações de Scroll (Intersection Observer)
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in'); // Certifique-se de ter essa classe no CSS
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('.step-card, .feature-card, .hero-content');
    elements.forEach(el => observer.observe(el));

    // Adicionar Event Listeners
    window.addEventListener('scroll', handleScroll);
    mobileMenuBtn?.addEventListener('click', toggleMenu);

    // Limpeza ao sair da página
    return () => {
      window.removeEventListener('scroll', handleScroll);
      mobileMenuBtn?.removeEventListener('click', toggleMenu);
      observer.disconnect();
    };
  }, []);
};

// Exemplo de função auxiliar para as TABS (se você não usar State no React)
// Mas recomendo usar o useState que mostrei na resposta anterior no componente ParaQuem.jsx
export const setupTabs = (tabId, allTabsclassName, allBtnsclassName) => {
  const tabs = document.querySelectorAll(allTabsclassName);
  const btns = document.querySelectorAll(allBtnsclassName);

  tabs.forEach(tab => {
    tab.classNameList.remove('active');
    tab.classNameList.add('hidden');
  });

  btns.forEach(btn => btn.classNameList.remove('active'));

  const selectedTab = document.getElementById(tabId);
  if (selectedTab) {
    selectedTab.classNameList.remove('hidden');
    selectedTab.classNameList.add('active');
  }
};