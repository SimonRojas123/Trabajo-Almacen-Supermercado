
import { useState } from 'react'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import { logout } from './api/client'
import './App.css'

function App() {
  const [autenticado, setAutenticado] = useState(
    Boolean(localStorage.getItem('access'))
  )

  // INICIAR SESION
  const iniciarSesion = () => {
    setAutenticado(true)
  }

  // CERRAR SESION
  const cerrarSesion = () => {
    logout()
    setAutenticado(false)
  }

  return (
    <div className="app">

      {autenticado ? (

        <Dashboard onLogout={cerrarSesion} />

      ) : (

        <Login onLoginSuccess={iniciarSesion} />

      )}

    </div>
  )
}

export default App