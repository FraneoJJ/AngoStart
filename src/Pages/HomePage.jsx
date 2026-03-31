import React from 'react'

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
