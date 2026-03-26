import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../services/authService'

export default function Login() {
  const [form, setForm] = useState({ registro_academico: '', contrasena: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await login(form)
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('usuario', JSON.stringify(res.data.usuario))
      navigate('/home')
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al iniciar sesión')
    }
  }

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow p-4" style={{ width: '400px' }}>
        <h4 className="text-center fw-bold mb-1">Facultad de Ingeniería</h4>
        <p className="text-center text-muted mb-4">USAC — Iniciar Sesión</p>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              name="registro_academico"
              className="form-control"
              placeholder="Registro Académico"
              value={form.registro_academico}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              name="contrasena"
              className="form-control"
              placeholder="Contraseña"
              value={form.contrasena}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Iniciar Sesión
          </button>
        </form>

        <div className="text-center mt-3">
          <Link to="/recuperar">¿Olvidó su contraseña?</Link>
        </div>
        <div className="text-center mt-2">
          <span>¿No tiene cuenta? </span>
          <Link to="/registro">Regístrese aquí</Link>
        </div>
      </div>
    </div>
  )
}