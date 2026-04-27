import React, { useState, useEffect } from 'react'

const AnaliseIA = () => {
  const [score, setScore] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  // Animação de contagem da pontuação
  useEffect(() => {
    const timer = setTimeout(() => {
      if (score < 82) {
        setScore(prev => prev + 1);
      }
    }, 20);

    return () => clearTimeout(timer);
  }, [score]);

  // Função para gerar análise com IA
  const generateAnalysis = () => {
    setIsGenerating(true);
    
    // Simulação do processo de geração
    setTimeout(() => {
      setIsGenerating(false);
      setGenerated(true);
      // Reset para a animação da pontuação
      setScore(0);
      
      // Re-anima a pontuação
      const animateScore = () => {
        let current = 0;
        const interval = setInterval(() => {
          if (current < 82) {
            setScore(current);
            current++;
          } else {
            clearInterval(interval);
          }
        }, 20);
      };
      
      setTimeout(animateScore, 500);
    }, 2000);
  };

  return (
    <section id="ia" className="section section-dark">
      <div className="container">
        <div className="ia-analysis">
          <div className="ia-features">
            <div>
              <p className="ia-subtitle">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-sparkles-icon lucide-sparkles"><path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"/><path d="M20 2v4"/><path d="M22 4h-4"/><circle cx="4" cy="20" r="2"/></svg>
                ANÁLISE INTELIGENTE
              </p>
              <h3 className="section-title text-white" style={{ fontSize: '1.5rem', margin: '1rem', fontWeight: 'bold' }}>
                Análise de Negócios com IA
              </h3>
              <p className="section-description text-white-muted" style={{ fontSize: '1rem', lineHeight: '1.6', marginBottom: '1rem' }}>
                Nossa inteligência artificial analisa mais de 50 variáveis para dar uma pontuação precisa da viabilidade do seu negócio.
              </p>
            </div>
            
            <div className="ia-feature">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-400">
                <path d="M19.07 4.93A10 10 0 0 0 6.99 3.34"/>
                <path d="M4 6h.01"/>
                <path d="M2.29 9.62A10 10 0 1 0 21.31 8.35"/>
                <path d="M16.24 7.76A6 6 0 1 0 8.23 16.67"/>
                <path d="M12 18h.01"/>
                <path d="M17.99 11.66A6 6 0 0 1 15.77 16.67"/>
                <circle cx="12" cy="12" r="2"/>
                <path d="m13.41 10.59 5.66-5.66"/>
              </svg>
                <p>Análise de mercado e concorrência</p>
            </div>
            
            <div className="ia-feature">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary-400">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
              </svg>
              <p>Avaliação de viabilidade financeira</p>
            </div>
            
            <div className="ia-feature">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-400">
                <path d="M8 3 4 7l4 4"/>
                <path d="M4 7h16"/>
                <path d="m16 21 4-4-4-4"/>
                <path d="M20 17H4"/>
              </svg>
              <p>Identificação de riscos e oportunidades</p>
            </div>
            
            <div className="ia-feature">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-400">
                <path d="M15 12h-5"/>
                <path d="M15 8h-5"/>
                <path d="M19 17V5a2 2 0 0 0-2-2H4"/>
                <path d="M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3"/>
              </svg>
              <p>Recomendações personalizadas</p>
            </div>
            
            <button 
              className={`btn-ia-generate ${isGenerating ? 'generating' : ''} ${generated ? 'generated' : ''}`}
              onClick={generateAnalysis}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12a9 9 0 11-6.219-8.56" />
                  </svg>
                  Analisando com IA...
                </>
              ) : generated ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="white"/>
                    <path d="m9 11 3 3L22 4" stroke="white"/>
                  </svg>
                  Análise Gerada com Sucesso!
                </>
              ) : (
                <>
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-refresh-cw-icon lucide-refresh-cw " ><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" stroke="white"/><path d="M21 3v5h-5" stroke="white"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" stroke="white"/><path d="M8 16H3v5" stroke="white"/></svg>
                  Gerar plano de negócio
                </>
              )}
            </button>
          </div>

          <div className="ia-score-card">
            <div className="score-circle">
              <div className="score-value">{score}</div>
              <div className="score-label">de 100</div>
            </div>
            <div className="score-title">Pontuação de Viabilidade (Exemplo)</div>
            
            <div className="ia-details">
              <div className="detail-section">
                <h4>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m3 8 4-4 4 4"/>
                    <path d="M7 4v16"/>
                    <path d="M11 12h4"/>
                    <path d="M11 16h7"/>
                    <path d="M11 20h10"/>
                  </svg>
                  Pontos Fortes
                </h4>
                <p>Mercado em crescimento, equipe qualificada</p>
              </div>
              <div className="detail-section">
                <h4>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" x2="12" y1="8" y2="12"/>
                    <line x1="12" x2="12.01" y1="16" y2="16"/>
                  </svg>
                  Riscos
                </h4>
                <p>Alta concorrência, necessidade de capital inicial</p>
              </div>
              <div className="detail-section">
                <h4>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"/>
                    <path d="M20 2v4"/>
                    <path d="M22 4h-4"/>
                    <circle cx="4" cy="20" r="2"/>
                  </svg>
                  Recomendações
                </h4>
                <p>Foco em diferenciação, buscar mentoria em marketing</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AnaliseIA