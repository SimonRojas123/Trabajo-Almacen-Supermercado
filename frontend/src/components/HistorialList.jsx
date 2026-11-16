import { useState, useEffect } from 'react'
import api, { ENDPOINTS } from '../api/client'

function HistorialList() {

  const [acciones, setAcciones] = useState([])
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  // CARGAR HISTORIAL
  const cargarDatos = async () => {
    setCargando(true)
    setError('')

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
      setError('No se pudo cargar el historial de movimientos.')

    } finally {
      setCargando(false)
    }
  }

  // EJECUTAR AL CARGAR EL COMPONENTE
  useEffect(() => {
    cargarDatos()
  }, [])

  // OBTENER NOMBRE DEL PRODUCTO
  const obtenerProducto = (id) => {
    const producto = productos.find(p => p.id === id)

    return producto ? producto.nombre : `Producto ${id}`
  }

  // FORMATEAR FECHA
  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleString('es-CL')
  }

  return (
    <div className="seccion-historial">

      <h2 className="titulo-historial">
        Historial de movimientos
      </h2>

      <div className="contenedor-actualizar">
        <button
          className="boton-actualizar"
          onClick={cargarDatos}
          disabled={cargando}
        >
          Actualizar historial
        </button>
      </div>

      {error && (
        <p className="mensaje-error">{error}</p>
      )}

      {cargando && (
        <p>Cargando historial...</p>
      )}

      {!cargando && !error && (

        <div className="contenedor-tabla-historial">

          <table className="tabla-historial">

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

              {acciones.length === 0 ? (

                <tr>
                  <td colSpan="6">
                    No hay movimientos registrados.
                  </td>
                </tr>

              ) : (

                acciones.map((accion) => (

                  <tr key={accion.id}>

                    <td>{obtenerProducto(accion.producto)}</td>

                    <td>{accion.nombre_usuario}</td>

                    <td>{accion.tipo}</td>

                    <td>{accion.cantidad}</td>

                    <td>{formatearFecha(accion.fecha)}</td>

                    <td>{accion.descripcion}</td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      )}

    </div>
  )
}

export default HistorialList