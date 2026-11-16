import { useState, useEffect } from 'react'
import api, { ENDPOINTS } from '../api/client'

function HistorialList() {

  const [acciones, setAcciones] = useState([])
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    try {
      const [respuestaAcciones, respuestaProductos] = await Promise.all([
        api.get(ENDPOINTS.acciones),
        api.get(ENDPOINTS.productos)
      ])

      setAcciones(
        respuestaAcciones.data.results || respuestaAcciones.data
      )

      setProductos(
        respuestaProductos.data.results || respuestaProductos.data
      )

    } catch (error) {
      console.error('Error al cargar el historial:', error)
    } finally {
      setCargando(false)
    }
  }

  const obtenerProducto = (id) => {
    const producto = productos.find(p => p.id === id)

    return producto ? producto.nombre : `Producto ${id}`
  }

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleString('es-CL')
  }

  if (cargando) {
    return <p>Cargando historial...</p>
  }

  return (
    <div>
      <h2>Historial de movimientos</h2>

      <button onClick={cargarDatos}>
        Actualizar historial
      </button>

      {acciones.length === 0 ? (
        <p>No hay movimientos registrados.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Usuario</th>
              <th>Tipo</th>
              <th>Cantidad</th>
              <th>Fecha</th>
              <th>Descripción</th>
            </tr>
          </thead>

          <tbody>
            {acciones.map((accion) => (
              <tr key={accion.id}>
                <td>{obtenerProducto(accion.producto)}</td>
                <td>{accion.usuario}</td>
                <td>{accion.tipo}</td>
                <td>{accion.cantidad}</td>
                <td>{formatearFecha(accion.fecha)}</td>
                <td>{accion.descripcion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default HistorialList