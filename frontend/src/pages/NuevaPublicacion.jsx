import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { crearPublicacion } from '../services/publicacionService'
import api from '../services/api'

export default function NuevaPublicacion() {
  const [form, setForm] = useState({
    id_publicacion: 'PUB' + Math.floor(Math.random() * 1000000),
    id_curso: '',
    id_catedratico: '',
    mensaje: ''
  })
  const [tipo, setTipo] = useState('curso')
  const [cursos, setCursos] = useState([])
  const [catedraticos, setCatedraticos] = useState([])
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (!localStorage.getItem('token')) navigate('/')
    api.get('/cursos').then(res => setCursos(res.data))
    api.get('/catedraticos').then(res => setCatedraticos(res.data))
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const datos = {
        ...form,
        id_curso: tipo === 'curso' ? form.id_curso : null,
        id_catedratico: tipo === 'catedratico' ? form.id_catedratico : null
      }
      await crearPublicacion(datos)
      navigate('/home')
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al crear publicación')
    }
  }

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow p-4" style={{ width: '500px' }}>
        <h4 className="fw-bold mb-4">Nueva Publicación</h4>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-bold">Publicar sobre:</label>
            <div className="d-flex gap-3">
              <div className="form-check">
                <input className="form-check-input" type="radio" value="curso"
                  checked={tipo === 'curso'} onChange={() => setTipo('curso')} />
                <label className="form-check-label">Curso</label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="radio" value="catedratico"
                  checked={tipo === 'catedratico'} onChange={() => setTipo('catedratico')} />
                <label className="form-check-label">Catedrático</label>
              </div>
            </div>
          </div>

          {tipo === 'curso' && (
            <div className="mb-3">
              <select name="id_curso" className="form-select"
                value={form.id_curso} onChange={handleChange} required>
                <option value="">Selecciona un curso</option>
                {cursos.map(c => <option key={c.id_curso} value={c.id_curso}>{c.nombre_curso}</option>)}
              </select>
            </div>
          )}

          {tipo === 'catedratico' && (
            <div className="mb-3">
              <select name="id_catedratico" className="form-select"
                value={form.id_catedratico} onChange={handleChange} required>
                <option value="">Selecciona un catedrático</option>
                {catedraticos.map(c => <option key={c.id_catedratico} value={c.id_catedratico}>{c.nombres} {c.apellidos}</option>)}
              </select>
            </div>
          )}

          <div className="mb-3">
            <textarea name="mensaje" className="form-control" rows="4"
              placeholder="Escribe tu publicación..." value={form.mensaje}
              onChange={handleChange} required />
          </div>

          <button type="submit" className="btn btn-primary w-100">Publicar</button>
        </form>

        <div className="text-center mt-3">
          <Link to="/home">Cancelar</Link>
        </div>
      </div>
    </div>
  )
}