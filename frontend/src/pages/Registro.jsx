import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { registro } from '../services/authService'

export default function Registro() {
  const [form, setForm] = useState({
    id_usuario: 'USR' + Math.floor(Math.random() * 1000000),
    registro_academico: '',
    nombres: '',
    apellidos: '',
    correo: '',
    contrasena: ''
  })
  const [error, setError] = useState('')
  const [exito, setExito] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await registro(form)
      setExito('Usuario registrado correctamente')
      setTimeout(() => navigate('/'), 2000)
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al registrarse')
    }
  }

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow p-4" style={{ width: '450px' }}>
        <h4 className="text-center fw-bold mb-4">Crear Cuenta</h4>

        {error && <div className="alert alert-danger">{error}</div>}
        {exito && <div className="alert alert-success">{exito}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <input type="text" name="registro_academico" className="form-control"
              placeholder="Registro Académico" value={form.registro_academico}
              onChange={handleChange} required />
          </div>
          <div className="mb-2">
            <input type="text" name="nombres" className="form-control"
              placeholder="Nombres" value={form.nombres}
              onChange={handleChange} required />
          </div>
          <div className="mb-2">
            <input type="text" name="apellidos" className="form-control"
              placeholder="Apellidos" value={form.apellidos}
              onChange={handleChange} required />
          </div>
          <div className="mb-2">
            <input type="email" name="correo" className="form-control"
              placeholder="Correo electrónico" value={form.correo}
              onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <input type="password" name="contrasena" className="form-control"
              placeholder="Contraseña" value={form.contrasena}
              onChange={handleChange} required />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Registrarse
          </button>
        </form>

        <div className="text-center mt-3">
          <Link to="/">¿Ya tiene cuenta? Inicie sesión</Link>
        </div>
      </div>
    </div>
  )
}