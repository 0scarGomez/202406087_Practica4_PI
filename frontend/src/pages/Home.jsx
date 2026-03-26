import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { obtenerPublicaciones, obtenerPorCurso, obtenerPorCatedratico } from '../services/publicacionService'
import api from '../services/api'

export default function Home() {
  const [publicaciones, setPublicaciones] = useState([])
  const [catedraticos, setCatedraticos] = useState([])
  const [cursos, setCursos] = useState([])
  const [filtro, setFiltro] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [buscarUsuario, setBuscarUsuario] = useState('')
  const navigate = useNavigate()
  const usuario = JSON.parse(localStorage.getItem('usuario'))

  useEffect(() => {
    if (!localStorage.getItem('token')) navigate('/')
    cargarPublicaciones()
    cargarCatalogos()
  }, [])

  const cargarPublicaciones = async () => {
    const res = await obtenerPublicaciones()
    setPublicaciones(res.data)
  }

  const cargarCatalogos = async () => {
    const cats = await api.get('/catedraticos')
    const curs = await api.get('/cursos')
    setCatedraticos(cats.data)
    setCursos(curs.data)
  }

  const handleFiltro = async (tipo, id) => {
    if (tipo === 'curso') {
      const res = await obtenerPorCurso(id)
      setPublicaciones(res.data)
    } else if (tipo === 'catedratico') {
      const res = await obtenerPorCatedratico(id)
      setPublicaciones(res.data)
    } else {
      cargarPublicaciones()
    }
  }

  const handleBusqueda = async () => {
    if (!busqueda) return
    if (filtro === 'nombre_curso') {
      const res = await obtenerPublicaciones()
      setPublicaciones(res.data.filter(p =>
        p.nombre_curso?.toLowerCase().includes(busqueda.toLowerCase())
      ))
    } else if (filtro === 'nombre_catedratico') {
      const res = await obtenerPublicaciones()
      setPublicaciones(res.data.filter(p =>
        p.nombre_catedratico?.toLowerCase().includes(busqueda.toLowerCase())
      ))
    }
  }

  const irAPerfil = async () => {
    if (!buscarUsuario) return
    try {
      const res = await api.get('/usuarios/' + buscarUsuario)
      navigate(`/perfil/${res.data.registro_academico}`)
    } catch {
      alert('Usuario no encontrado')
    }
  }

  const cerrarSesion = () => {
    localStorage.clear()
    navigate('/')
  }

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-dark bg-primary px-4">
        <span className="navbar-brand fw-bold">Facultad de Ingeniería USAC</span>
        <div className="d-flex gap-2 align-items-center">
          <span className="text-white">Hola, {usuario?.nombres}</span>
          <Link to={`/perfil/${usuario?.registro_academico}`} className="btn btn-light btn-sm">Mi Perfil</Link>
          <Link to="/publicacion/nueva" className="btn btn-warning btn-sm">+ Publicar</Link>
          <button onClick={cerrarSesion} className="btn btn-outline-light btn-sm">Salir</button>
        </div>
      </nav>

      <div className="container mt-4">
        {/* Filtros */}
        <div className="card p-3 mb-4">
          <div className="row g-2">
            <div className="col-md-3">
              <select className="form-select" onChange={(e) => handleFiltro('curso', e.target.value)}>
                <option value="">Filtrar por Curso</option>
                {cursos.map(c => <option key={c.id_curso} value={c.id_curso}>{c.nombre_curso}</option>)}
              </select>
            </div>
            <div className="col-md-3">
              <select className="form-select" onChange={(e) => handleFiltro('catedratico', e.target.value)}>
                <option value="">Filtrar por Catedrático</option>
                {catedraticos.map(c => <option key={c.id_catedratico} value={c.id_catedratico}>{c.nombres} {c.apellidos}</option>)}
              </select>
            </div>
            <div className="col-md-2">
              <select className="form-select" value={filtro} onChange={(e) => setFiltro(e.target.value)}>
                <option value="">Buscar por...</option>
                <option value="nombre_curso">Nombre de Curso</option>
                <option value="nombre_catedratico">Nombre de Catedrático</option>
              </select>
            </div>
            <div className="col-md-3">
              <input type="text" className="form-control" placeholder="Escribe para buscar..."
                value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
            </div>
            <div className="col-md-1">
              <button className="btn btn-primary w-100" onClick={handleBusqueda}>Buscar</button>
            </div>
          </div>

          {/* Buscador de usuarios */}
          <div className="row g-2 mt-2">
            <div className="col-md-4">
              <input type="text" className="form-control"
                placeholder="Buscar usuario por Numero de Carnet..."
                value={buscarUsuario}
                onChange={(e) => setBuscarUsuario(e.target.value)} />
            </div>
            <div className="col-md-2">
              <button className="btn btn-secondary w-100" onClick={irAPerfil}>
                Buscar Usuario
              </button>
            </div>
          </div>

          <button className="btn btn-link mt-2 p-0" onClick={cargarPublicaciones}>Limpiar filtros</button>
        </div>

        {/* Publicaciones */}
        {publicaciones.length === 0 ? (
          <p className="text-muted text-center">No hay publicaciones aún.</p>
        ) : (
          publicaciones.map(pub => (
            <div key={pub.id_publicacion} className="card mb-3 shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <h6 className="fw-bold">{pub.nombres} {pub.apellidos}</h6>
                  <small className="text-muted">{new Date(pub.fecha).toLocaleDateString()}</small>
                </div>
                {pub.nombre_curso && <span className="badge bg-info text-dark me-2">Curso: {pub.nombre_curso}</span>}
                {pub.nombre_catedratico && <span className="badge bg-secondary me-2">Catedrático: {pub.nombre_catedratico} {pub.apellido_catedratico}</span>}
                <p className="mt-2 mb-1">{pub.mensaje}</p>
                <Link to={`/publicacion/${pub.id_publicacion}`} className="btn btn-outline-primary btn-sm mt-1">
                  Ver comentarios
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}