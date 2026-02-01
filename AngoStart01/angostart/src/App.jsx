import { useState } from 'react'

// Cadastros
import PaginaInicial from './Pages/HomePage.jsx'
// import LoginPage from './pages/LoginPage'
// import CriarContaPage from './pages/CriarContaPage'
// import RecuperarSenhaPage from './pages/RecuperarSenhaPage'

// Estilizacao 
import './App.css'

function App() {
  return (
    <PaginaInicial />
    // <BrowserRouter>
    //   <Routes>
    //     <Route path="/" element={<PaginaInicial />} />
    //     <Route path="/login" element={<LoginPage />} />
    //     <Route path="/criar-conta" element={<CriarContaPage />} />
    //     <Route path="/recuperar-senha" element={<RecuperarSenhaPage />} />
    //   </Routes>
    // </BrowserRouter>
  )
}

export default App
