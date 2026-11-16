import { useState, useEffect } from 'react'
import api, { ENDPOINTS } from '../api/client'
import CategoriaForm from './CategoriaForm'

function CategoriasList() {

  const [categorias, setCategorias] = useState([])
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [categoriaEditar, setCategoriaEditar] = useState(null)

  // OBTENER CATEGORIAS
  const obtenerCategorias = async () => {
    setCargando(true)
    setError('')

    try {
      const respuesta = await api.get(ENDPOINTS.categorias)
      setCategorias(respuesta.data.results || respuesta.data)

    } catch (error) {
      setError('No se pudieron obtener las categorías.')
    } finally {
      setCargando(false)
    }
  }

  // EJECUTAR AL CARGAR EL COMPONENTE
  useEffect(() => {
    obtenerCategorias()
  }, [])

  // REGISTRAR CATEGORIA
  const nuevaCategoria = () => {
    setCategoriaEditar(null)
    setMostrarFormulario(true)
  }

  // EDITAR CATEGORIA
  const editarCategoria = (categoria) => {
    setCategoriaEditar(categoria)
    setMostrarFormulario(true)
  }

  // ELIMINAR CATEGORIA
  const eliminarCategoria = async (categoria) => {

    const confirmar = window.confirm(
      `¿Estás seguro de eliminar la categoría ${categoria.nombre}?`
    )

    if (!confirmar) {
      return
    }

    setError('')

    try {
      await api.delete(`${ENDPOINTS.categorias}${categoria.id}/`)
      await obtenerCategorias()

    } catch (error) {

      if (error.response?.status === 400 ||
          error.response?.status === 409) {

        setError(
          'No se pudo eliminar la categoría. Puede tener productos asociados.'
        )

      } else {
        setError('No se pudo eliminar la categoría.')
      }
    }
  }

  // GUARDAR CATEGORIA
  const guardarCategoria = () => {
    setMostrarFormulario(false)
    setCategoriaEditar(null)
    obtenerCategorias()
  }

  // CANCELAR FORMULARIO
  const cancelarFormulario = () => {
    setMostrarFormulario(false)
    setCategoriaEditar(null)
  }

  return (
    <div className="seccion-categorias">

      {mostrarFormulario ? (

        <CategoriaForm
          categoria={categoriaEditar}
          onGuardar={guardarCategoria}
          onCancelar={cancelarFormulario}
        />

      ) : (

        <>
          <h2 className="titulo-categorias">Categoría</h2>

          <div className="contenedor-registrar">
            <button
              className="boton-registrar"
              onClick={nuevaCategoria}
            >
              Registrar
            </button>
          </div>

          {cargando && <p>Cargando categorías...</p>}

          {error && <p className="mensaje-error">{error}</p>}

          <div className="contenedor-tabla-categorias">

            <table className="tabla-categorias">

              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>

                {!cargando && categorias.length === 0 && (
                  <tr>
                    <td colSpan="3">
                      No hay categorías registradas.
                    </td>
                  </tr>
                )}

                {categorias.map((categoria) => (

                  <tr key={categoria.id}>

                    <td>{categoria.nombre}</td>

                    <td>{categoria.descripcion}</td>

                    <td className="acciones-categorias">

                      <button
                        className="boton-editar"
                        onClick={() => editarCategoria(categoria)}
                      >
                        Editar
                      </button>

                      <button
                        className="boton-eliminar"
                        onClick={() => eliminarCategoria(categoria)}
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

export default CategoriasList