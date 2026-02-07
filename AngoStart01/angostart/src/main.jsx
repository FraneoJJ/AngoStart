import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Para navegar em todas apaginas 
import { BrowserRouter, RouterProvider, Route, createBrowserRouter } from 'react-router-dom'

// Pagina de erro 
import ErrorPage from './Pages/ErrorPage.jsx'

// Paginas de navegacao
import LoginPage from './Pages/LoginPage.jsx'
import CriarContaPage from './Pages/CriarContaPage.jsx'
import RecuperarSenhaPage from './Pages/RecuperarSenhaPage.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/criar-conta",
    element: <CriarContaPage />,
  },
  {
    path: "/recuperar-senha",
    element: <RecuperarSenhaPage />,
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
