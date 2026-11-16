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

  // REGISTRAR NUEVO PRODUCTO
  const nuevoProducto = () => {
    setProductoEditar(null)
    setMostrarFormulario(true)
  }

  // EDITAR PRODUCTO
  const editarProducto = (producto) => {
    setProductoEditar(producto)
    setMostrarFormulario(true)
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
    <div>

      {mostrarFormulario ? (

        <ProductoForm
          producto={productoEditar}
          onGuardar={guardarProducto}
          onCancelar={cancelarFormulario}
        />

      ) : (

        <>

          <h2>Lista de productos</h2>

          <button onClick={nuevoProducto}>
            Registrar producto
          </button>

          {cargando && <p>Cargando productos...</p>}

          {error && <p>{error}</p>}

          {!cargando && !error && productos.length === 0 && (
            <p>No hay productos registrados.</p>
          )}

          {productos.map((producto) => (

            <div key={producto.id}>

              <h3>{producto.nombre}</h3>

              <p>Código: {producto.codigo}</p>

              <p>Precio: ${producto.precio}</p>

              <p>Stock: {producto.stock}</p>

              <p>Descripción: {producto.descripcion}</p>

              <button onClick={() => editarProducto(producto)}>
                Editar
              </button>

            </div>

          ))}

        </>

      )}

    </div>
  )
}

export default ProductosList