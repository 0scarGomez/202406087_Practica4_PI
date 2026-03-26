import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { recuperarContrasena } from '../services/authService'

export default function RecuperarContrasena() {
  const [form, setForm] = useState({ registro_academico: '', correo: '', nueva_contrasena: '' })
  const [error, setError] = useState('')
  const [exito, setExito] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await recuperarContrasena(form)
      setExito('Contraseña actualizada correctamente')
      setTimeout(() => navigate('/'), 2000)
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Los datos no coinciden')
    }
  }

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow p-4" style={{ width: '400px' }}>
        <h4 className="text-center fw-bold mb-4">Recuperar Contraseña</h4>

        {error && <div className="alert alert-danger">{error}</div>}
        {exito && <div className="alert alert-success">{exito}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input type="text" name="registro_academico" className="form-control"
              placeholder="Registro Académico" value={form.registro_academico}
              onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <input type="email" name="correo" className="form-control"
              placeholder="Correo electrónico" value={form.correo}
              onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <input type="password" name="nueva_contrasena" className="form-control"
              placeholder="Nueva contraseña" value={form.nueva_contrasena}
              onChange={handleChange} required />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Actualizar Contraseña
          </button>
        </form>

        <div className="text-center mt-3">
          <Link to="/">Volver al inicio</Link>
        </div>
      </div>
    </div>
  )
}