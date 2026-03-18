const jwt = require('jsonwebtoken')

const verificarToken = (req, res, next) => {
  // El token viene en el header Authorization: Bearer <token>
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ mensaje: 'Acceso denegado, token no proporcionado' })
  }

  try {
    // Verificar que el token sea válido
    const verificado = jwt.verify(token, process.env.JWT_SECRET)
    req.usuario = verificado // Guardamos los datos del usuario en la petición
    next() // Continúa a la siguiente función
  } catch (error) {
    res.status(401).json({ mensaje: 'Token inválido o expirado' })
  }
}

module.exports = verificarToken