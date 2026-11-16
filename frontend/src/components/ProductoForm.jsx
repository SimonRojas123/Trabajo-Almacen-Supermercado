import { useState, useEffect } from 'react'
import api, { ENDPOINTS } from '../api/client'

function ProductoForm({ producto, onGuardar, onCancelar }) {

  const [nombre, setNombre] = useState(producto?.nombre || '')
  const [codigo, setCodigo] = useState(producto?.codigo || '')
  const [categoria, setCategoria] = useState(producto?.categoria || '')
  const [precio, setPrecio] = useState(producto?.precio || '')
  const [descripcion, setDescripcion] = useState(producto?.descripcion || '')

  const [categorias, setCategorias] = useState([])
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  // OBTENER CATEGORIAS
  useEffect(() => {
    const obtenerCategorias = async () => {
      try {
        const respuesta = await api.get(ENDPOINTS.categorias)
        setCategorias(respuesta.data.results || respuesta.data)
      } catch (error) {
        setError('No se pudieron obtener las categorías.')
      }
    }

    obtenerCategorias()
  }, [])

  // GUARDAR PRODUCTO
  const handleSubmit = async (e) => {
    e.preventDefault()

    setError('')
    setCargando(true)

    const datos = {nombre, codigo, categoria, precio, descripcion}

    try {
      if (producto) {
        await api.put(
          `${ENDPOINTS.productos}${producto.id}/`,
          datos
        )
      } else {
        await api.post(ENDPOINTS.productos, datos)
      }

      onGuardar()

    } catch (error) {
      setError('No se pudo guardar el producto.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div>
      <h2>
        {producto ? 'Editar producto' : 'Registrar producto'}
      </h2>

      <form onSubmit={handleSubmit}>

        <label>Nombre</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />

        <label>Código</label>
        <input
          type="text"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          required
        />

        <label>Categoría</label>
        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          required
        >
          <option value="">Selecciona una categoría</option>

          {categorias.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.nombre}
            </option>
          ))}
        </select>

        <label>Precio</label>
        <input
          type="number"
          step="0.01"
          min="0"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          required
        />

        <label>Descripción</label>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />

        {error && <p>{error}</p>}

        <button type="submit" disabled={cargando}>
          {cargando ? 'Guardando...' : 'Guardar producto'}
        </button>

        <button type="button" onClick={onCancelar}>
          Cancelar
        </button>

      </form>
    </div>
  )
}

export default ProductoForm