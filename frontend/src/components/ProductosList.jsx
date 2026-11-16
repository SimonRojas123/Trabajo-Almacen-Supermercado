import { useState, useEffect } from 'react'
import api, { ENDPOINTS } from '../api/client'
import ProductoForm from './ProductoForm'

function ProductosList() {

  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [productoEditar, setProductoEditar] = useState(null)

  // OBTENER PRODUCTOS
  const obtenerProductos = async () => {
    setCargando(true)
    setError('')

    try {
      const respuesta = await api.get(ENDPOINTS.productos)

      setProductos(respuesta.data.results || respuesta.data)

    } catch (error) {
      setError('No se pudieron obtener los productos.')
    } finally {
      setCargando(false)
    }
  }

  // EJECUTAR AL CARGAR EL COMPONENTE
  useEffect(() => {
    obtenerProductos()
  }, [])

  // REGISTRAR PRODUCTO
  const nuevoProducto = () => {
    setProductoEditar(null)
    setMostrarFormulario(true)
  }

  // EDITAR PRODUCTO
  const editarProducto = (producto) => {
    setProductoEditar(producto)
    setMostrarFormulario(true)
  }

  // ELIMINAR PRODUCTO
  const eliminarProducto = async (producto) => {

    const confirmar = window.confirm(
      `¿Estás seguro de eliminar el producto ${producto.nombre}?`
    )

    if (!confirmar) {
      return
    }

    setError('')

    try {

      await api.delete(`${ENDPOINTS.productos}${producto.id}/`)

      await obtenerProductos()

    } catch (error) {

      if (error.response?.status === 409 ||
          error.response?.status === 400 ||
          error.response?.status === 500) {

        setError(
          'No se pudo eliminar el producto. Puede tener movimientos asociados.'
        )

      } else {

        setError('No se pudo eliminar el producto.')

      }
    }
  }

  // GUARDAR PRODUCTO
  const guardarProducto = () => {
    setMostrarFormulario(false)
    setProductoEditar(null)
    obtenerProductos()
  }

  // CANCELAR FORMULARIO
  const cancelarFormulario = () => {
    setMostrarFormulario(false)
    setProductoEditar(null)
  }

  return (
    <div className="seccion-productos">

      {mostrarFormulario ? (

        <ProductoForm
          producto={productoEditar}
          onGuardar={guardarProducto}
          onCancelar={cancelarFormulario}
        />

      ) : (

        <>

          <h2 className="titulo-productos">Productos</h2>

          <div className="contenedor-registrar">
            <button
              className="boton-registrar"
              onClick={nuevoProducto}
            >
              Registrar
            </button>
          </div>

          {cargando && <p>Cargando productos...</p>}

          {error && <p className="mensaje-error">{error}</p>}

          <div className="contenedor-tabla-productos">

            <table className="tabla-productos">

              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Código</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Descripción</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>

                {!cargando && productos.length === 0 && (
                  <tr>
                    <td colSpan="6">
                      No hay productos registrados.
                    </td>
                  </tr>
                )}

                {productos.map((producto) => (

                  <tr key={producto.id}>

                    <td>{producto.nombre}</td>

                    <td>{producto.codigo}</td>

                    <td>${producto.precio}</td>

                    <td>{producto.stock}</td>

                    <td>{producto.descripcion}</td>

                    <td className="acciones-productos">

                      <button
                        className="boton-editar"
                        onClick={() => editarProducto(producto)}
                      >
                        Editar
                      </button>

                      <button
                        className="boton-eliminar"
                        onClick={() => eliminarProducto(producto)}
                      >
                        Eliminar
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </>

      )}

    </div>
  )
}

export default ProductosList