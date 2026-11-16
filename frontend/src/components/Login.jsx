
import { useState } from 'react'
import { login } from '../api/client'

function Login({ onLoginSuccess }) {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  // INICIAR SESION
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

      <h1 className="login-titulo">
        Administrador de inventario
      </h1>

      <p className="login-subtitulo">
        Por favor inicie sesión
      </p>

      <div className="login-caja">

        <form className="login-formulario" onSubmit={handleSubmit}>

          <label htmlFor="usuario" className="login-etiqueta">
            Usuario
          </label>

          <input
            id="usuario"
            className="login-input"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Ingrese su usuario"
            autoComplete="username"
            required
          />

          <label htmlFor="contrasena" className="login-etiqueta">
            Contraseña
          </label>

          <input
            id="contrasena"
            className="login-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ingrese su contraseña"
            autoComplete="current-password"
            required
          />

          {error && (
            <p className="login-error">{error}</p>
          )}

          <button
            className="login-boton"
            type="submit"
            disabled={cargando}
          >
            {cargando ? 'Ingresando...' : 'Iniciar sesión'}
          </button>

        </form>

      </div>

    </div>
  )
}

export default Login