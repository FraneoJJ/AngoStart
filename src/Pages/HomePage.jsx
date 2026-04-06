import React, { useEffect } from 'react'

import Navbar from '../components/layout/Navbar'
import Home from '../components/SecoesApp/Home'
import Comofunciona from '../components/SecoesApp/ComoFunciona'
import Funcionalidade from '../components/SecoesApp/Funcionalidades'
import Paraquem from '../components/SecoesApp/ParaQuem'
import Analiseia from '../components/SecoesApp/AnaliseIA'
import Mentores from '../components/SecoesApp/Mentores'
import Investimentos from '../components/SecoesApp/Investimentos'
import Planos from '../components/SecoesApp/Planos'
import Depoimentos from '../components/SecoesApp/Depoimentos'
import Parceiros from '../components/SecoesApp/Parceiros'
import TesteGratuito from '../components/SecoesApp/ComecarGratuitamente'
import Footer from '../components/layout/footer'


function PaginaInicial() {
  useEffect(() => {
    const revealTargets = Array.from(document.querySelectorAll('main > section, footer.footer'))
    if (!revealTargets.length) return

    const variants = ['reveal-up', 'reveal-left', 'reveal-right', 'reveal-zoom']
    revealTargets.forEach((el, index) => {
      el.classList.add('scroll-reveal', variants[index % variants.length])
      el.style.setProperty('--reveal-delay', `${Math.min(index * 45, 260)}ms`)
    })

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.18, rootMargin: '0px 0px -8% 0px' }
    )

    revealTargets.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <Navbar />
      <main>
        <Home />
        <Comofunciona />
        <Funcionalidade />
        <Paraquem />
        <Analiseia />
        <Mentores />
        <Investimentos />
        <Planos />
        <Depoimentos />
        <Parceiros />
        <TesteGratuito />
      </main>
      <Footer />
    </>
  )
}

export default PaginaInicial
