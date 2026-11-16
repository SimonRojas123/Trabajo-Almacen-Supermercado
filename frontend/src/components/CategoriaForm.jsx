import { useState } from 'react'
import api, { ENDPOINTS } from '../api/client'

function CategoriaForm({ categoria, onGuardar, onCancelar }) {

  const [nombre, setNombre] = useState(categoria?.nombre || '')
  const [descripcion, setDescripcion] = useState(categoria?.descripcion || '')

  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  // GUARDAR CATEGORIA
  const handleSubmit = async (e) => {
    e.preventDefault()

    setError('')
    setCargando(true)

    const datos = {
      nombre,
      descripcion
    }

    try {

      if (categoria) {
        await api.put(
          `${ENDPOINTS.categorias}${categoria.id}/`,
          datos
        )
      } else {
        await api.post(ENDPOINTS.categorias, datos)
      }

      onGuardar()

    } catch (error) {
      setError(
        error.response?.data?.nombre?.[0] ||
        'No se pudo guardar la categoría.'
      )
    } finally {
      setCargando(false)
    }
  }

  return (
    <div>

      <h2>
        {categoria ? 'Editar categoría' : 'Registrar categoría'}
      </h2>

      <form onSubmit={handleSubmit}>

        <label>Nombre</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />

        <label>Descripción</label>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />

        {error && <p>{error}</p>}

        <button type="submit" disabled={cargando}>
          {cargando ? 'Guardando...' : 'Guardar categoría'}
        </button>

        <button type="button" onClick={onCancelar}>
          Cancelar
        </button>

      </form>

    </div>
  )
}

export default CategoriaForm