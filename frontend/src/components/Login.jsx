import { useState } from 'react'
import { login } from '../api/client' // Metodo login exportado de client

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError('')
    setCargando(true)

    try {
      const data = await login(username, password)
      onLoginSuccess(data)
    } catch (error) {
      setError(
        error.response?.data?.detail ||
        'No se pudo iniciar sesión. Comprueba tus datos.'
      )
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="login-container">
      <h1>SuperMarket Manager</h1>
      <h2>Iniciar sesión</h2>

      <form onSubmit={handleSubmit}>
        <label>Usuario</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Ingresa tu usuario"
          required
        />

        <label>Contraseña</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Ingresa tu contraseña"
          required
        />

        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={cargando}>
          {cargando ? 'Ingresando...' : 'Iniciar sesión'}
        </button>
      </form>
    </div>
  )
}

export default Login