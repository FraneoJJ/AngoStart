// src/App.jsx
import React from 'react';
import Navbar from './components/layout/Navbar';
import Home from './components/secoes_do_index/Home';
import ComoFunciona from './components/sections/ComoFunciona';
import Funcionalidade from './components/secoes_do_index/Funcionalidades';
import ParaQuem from './components/secoes_do_index/ParaQuem';
import AnaliseIA from './components/sections/AnaliseIA';
import Mentores from './components/sections/Mentores';
import Investimentos from './components/sections/Investimentos';
import Planos from './components/sections/Planos';
import Depoimentos from './components/sections/Depoimentos';
import Parceiros from './components/sections/Parceiros';
import ComecarGratuitamente from './components/sections/ComecarGratuitamente';
import Footer from './components/layout/Footer';

import './index.css';

function App() {
  return (
    <div classNameName="App">
      <Navbar />
      <main>
        <Home />
        <ComoFunciona />
        <Funcionalidade />
        <ParaQuem />
        <AnaliseIA />
        <Mentores />
        <Investimentos />
        <Planos />
        <Depoimentos />
        <Parceiros />
        <ComecarGratuitamente />
      </main>
      <Footer />
    </div>
  );
}

export default App;