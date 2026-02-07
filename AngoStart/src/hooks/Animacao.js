// src/hooks/useCounterAnimation.js
import { useCallback } from 'react';

export const useCounterAnimation = () => {
  const startCounter = useCallback((element, target, duration = 2000) => {
    let current = 0;
    const increment = target / (duration / 16); // 60fps
    const isDecimal = target.toString().includes('.');
    const hasSymbol = target.toString().includes('$') || target.toString().includes('+');
    
    const timer = setInterval(() => {
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
  }, []);

  return { startCounter };
};