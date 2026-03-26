import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../services/api'

export default function DetallePublicacion() {
  const { id } = useParams()
  const [publicacion, setPublicacion] = useState(null)
  const [comentarios, setComentarios] = useState([])
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (!localStorage.getItem('token')) navigate('/')
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    const pubs = await api.get('/publicaciones')
    const pub = pubs.data.find(p => p.id_publicacion === id)
    setPublicacion(pub)
    const coms = await api.get(`/comentarios/${id}`)
    setComentarios(coms.data)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post(`/comentarios/${id}`, {
        id_comentario: 'COM' + Math.floor(Math.random() * 1000000),
        mensaje
      })
      setMensaje('')
      cargarDatos()
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al comentar')
    }
  }

  return (
    <div className="container mt-4" style={{ maxWidth: '700px' }}>
      <Link to="/home" className="btn btn-outline-secondary btn-sm mb-3">← Volver</Link>

      {publicacion && (
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <div className="d-flex justify-content-between">
              <h6 className="fw-bold">{publicacion.nombres} {publicacion.apellidos}</h6>
              <small className="text-muted">{new Date(publicacion.fecha).toLocaleDateString()}</small>
            </div>
            {publicacion.nombre_curso && <span className="badge bg-info text-dark me-2">Curso: {publicacion.nombre_curso}</span>}
            {publicacion.nombre_catedratico && <span className="badge bg-secondary me-2">Catedrático: {publicacion.nombre_catedratico}</span>}
            <p className="mt-2">{publicacion.mensaje}</p>
          </div>
        </div>
      )}

      <h5 className="fw-bold mb-3">Comentarios ({comentarios.length})</h5>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="card p-3 mb-4">
        <div className="mb-2">
          <textarea className="form-control" rows="2" placeholder="Escribe un comentario..."
            value={mensaje} onChange={(e) => setMensaje(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-primary btn-sm">Comentar</button>
      </form>

      {comentarios.length === 0 ? (
        <p className="text-muted">No hay comentarios aún.</p>
      ) : (
        comentarios.map(com => (
          <div key={com.id_comentario} className="card mb-2">
            <div className="card-body py-2">
              <div className="d-flex justify-content-between">
                <span className="fw-bold">{com.nombres} {com.apellidos}</span>
                <small className="text-muted">{new Date(com.fecha).toLocaleDateString()}</small>
              </div>
              <p className="mb-0 mt-1">{com.mensaje}</p>
            </div>
          </div>
        ))
      )}
    </div>
  )
}