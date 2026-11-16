import { useState, useEffect } from 'react'
import api, { ENDPOINTS } from '../api/client'

function MovimientosList() {

  const [productos, setProductos] = useState([])
  const [producto, setProducto] = useState('')
  const [tipo, setTipo] = useState('ingresar')
  const [cantidad, setCantidad] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [mensaje, setMensaje] = useState('')

  // CARGAR PRODUCTOS
  useEffect(() => {cargarProductos()}, [])

  const cargarProductos = async () => {
    try {
      const respuesta = await api.get(ENDPOINTS.productos)
      setProductos(respuesta.data.results || respuesta.data)
    } catch (error) {
      console.error('Error al cargar productos:', error)
    }
  }

  // REGISTRAR MOVIMIENTO
  const registrarMovimiento = async (e) => {
    e.preventDefault()
    setMensaje('')

    try {
      await api.post(ENDPOINTS.acciones, {
        producto: Number(producto),
        tipo,
        cantidad: Number(cantidad),
        descripcion
      })

      setMensaje('Movimiento registrado correctamente.')

      setCantidad('')
      setDescripcion('')

      cargarProductos()

    } catch (error) {
      const detalle = error.response?.data
      setMensaje(
        typeof detalle === 'string'
          ? detalle
          : detalle?.detail || 'No se pudo registrar el movimiento.'
      )
    }
  }

  return (
    <div>
      <h2>Registrar movimiento</h2>

      <form onSubmit={registrarMovimiento}>

        <label>Producto</label>

        <select
          value={producto}
          onChange={(e) => setProducto(e.target.value)}
          required
        >
          <option value="">Seleccionar producto</option>

          {productos.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre} - Stock: {p.stock}
            </option>
          ))}
        </select>

        <label>Tipo de movimiento</label>

        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
        >
          <option value="ingresar">Ingreso</option>
          <option value="retirar">Retiro</option>
        </select>

        <label>Cantidad</label>

        <input
          type="number"
          min="1"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
          required
        />

        <label>Descripción</label>

        <input
          type="text"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Motivo del movimiento"
        />

        <button type="submit">
          Registrar movimiento
        </button>

      </form>

      {mensaje && <p>{mensaje}</p>}
    </div>
  )
}

export default MovimientosList