import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { obtenerPerfil, actualizarPerfil, obtenerCursosAprobados } from '../services/usuarioService'
import api from '../services/api'

export default function Perfil() {
  const { id } = useParams()
  const [perfil, setPerfil] = useState(null)
  const [cursos, setCursos] = useState([])
  const [totalCreditos, setTotalCreditos] = useState(0)
  const [editando, setEditando] = useState(false)
  const [form, setForm] = useState({})
  const [todosCursos, setTodosCursos] = useState([])
  const [error, setError] = useState('')
  const [exito, setExito] = useState('')
  const navigate = useNavigate()
  const usuarioActual = JSON.parse(localStorage.getItem('usuario'))
  const esMiPerfil = usuarioActual?.registro_academico === id

  useEffect(() => {
    if (!localStorage.getItem('token')) navigate('/')
    cargarDatos()
  }, [id])

  const handleActualizar = async (e) => {
    e.preventDefault()
    try {
      // Usamos perfil.id_usuario en lugar de 'id' (el carnet)
      await actualizarPerfil(perfil.id_usuario, { 
        nombres: form.nombres, 
        apellidos: form.apellidos, 
        correo: form.correo 
      })
      setExito('Perfil actualizado correctamente')
      setEditando(false)
      cargarDatos()
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al actualizar')
    }
  }

  const cargarDatos = async () => {
    try {
      const res = await obtenerPerfil(id) 
      setPerfil(res.data)
      setForm(res.data)
            const idUsuarioReal = res.data.id_usuario 

      const cursosRes = await obtenerCursosAprobados(idUsuarioReal)
      setCursos(cursosRes.data.cursos)
      setTotalCreditos(cursosRes.data.total_creditos)
      
      if (esMiPerfil) {
        const todos = await api.get('/cursos')
        setTodosCursos(todos.data)
      }
    } catch (err) {
      console.error("Error al cargar datos:", err)
      setError("No se pudo cargar el perfil")
    }
  }

  const agregarCurso = async (id_curso) => {
    try {
      const id_registro = 'REG' + Math.floor(Math.random() * 1000000)
      
      await api.post('/usuarios/' + perfil.id_usuario + '/cursos-aprobados', { 
        id_registro, 
        id_curso 
      })
      cargarDatos() // Recarga la tabla
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al agregar curso')
    }
  }

  
  if (!perfil) return <div className="container mt-4">Cargando...</div>

  return (
    <div className="container mt-4" style={{ maxWidth: '700px' }}>
      <Link to="/home" className="btn btn-outline-secondary btn-sm mb-3">← Volver</Link>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="fw-bold mb-0">{perfil.nombres} {perfil.apellidos}</h4>
            {esMiPerfil && !editando && (
              <button className="btn btn-outline-primary btn-sm" onClick={() => setEditando(true)}>
                Editar perfil
              </button>
            )}
          </div>

          {error && <div className="alert alert-danger">{error}</div>}
          {exito && <div className="alert alert-success">{exito}</div>}

          {!editando ? (
            <>
              <p className="mb-1"><strong>Registro Académico:</strong> {perfil.registro_academico}</p>
              <p className="mb-1"><strong>Correo:</strong> {perfil.correo}</p>
            </>
          ) : (
            <form onSubmit={handleActualizar}>
              <div className="mb-2">
                <input type="text" className="form-control" placeholder="Nombres"
                  value={form.nombres} onChange={(e) => setForm({ ...form, nombres: e.target.value })} required />
              </div>
              <div className="mb-2">
                <input type="text" className="form-control" placeholder="Apellidos"
                  value={form.apellidos} onChange={(e) => setForm({ ...form, apellidos: e.target.value })} required />
              </div>
              <div className="mb-3">
                <input type="email" className="form-control" placeholder="Correo"
                  value={form.correo} onChange={(e) => setForm({ ...form, correo: e.target.value })} required />
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary btn-sm">Guardar</button>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setEditando(false)}>Cancelar</button>
              </div>
            </form>
          )}
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold mb-0">Cursos Aprobados</h5>
            <span className="badge bg-primary">Total créditos: {totalCreditos}</span>
          </div>

          {cursos.length === 0 ? (
            <p className="text-muted">No hay cursos aprobados registrados.</p>
          ) : (
            <table className="table table-sm">
              <thead>
                <tr>
                  <th>Curso</th>
                  <th>Créditos</th>
                  <th>Área</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {cursos.map(c => (
                  <tr key={c.id_registro}>
                    <td>{c.nombre_curso}</td>
                    <td>{c.creditos}</td>
                    <td>{c.area}</td>
                    <td>{c.fecha_aprobacion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {esMiPerfil && (
            <div className="mt-3">
              <h6 className="fw-bold">Agregar curso aprobado:</h6>
              <select className="form-select" onChange={(e) => e.target.value && agregarCurso(e.target.value)}>
                <option value="">Selecciona un curso</option>
                {todosCursos.filter(c => !cursos.find(ca => ca.nombre_curso === c.nombre_curso))
                  .map(c => <option key={c.id_curso} value={c.id_curso}>{c.nombre_curso}</option>)}
              </select>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}