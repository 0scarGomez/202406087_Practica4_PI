import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Registro from './pages/Registro'
import RecuperarContrasena from './pages/RecuperarContrasena'
import Home from './pages/Home'
import NuevaPublicacion from './pages/NuevaPublicacion'
import DetallePublicacion from './pages/DetallePublicacion'
import Perfil from './pages/Perfil'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/recuperar" element={<RecuperarContrasena />} />
        <Route path="/home" element={<Home />} />
        <Route path="/publicacion/nueva" element={<NuevaPublicacion />} />
        <Route path="/publicacion/:id" element={<DetallePublicacion />} />
        <Route path="/perfil/:id" element={<Perfil />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}