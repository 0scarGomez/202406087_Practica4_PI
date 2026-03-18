const pool = require('../db')

// OBTENER COMENTARIOS DE UNA PUBLICACION
const obtenerComentarios = async (req, res) => {
  const { id_publicacion } = req.params
  try {
    const resultado = await pool.query(`
      SELECT c.id_comentario, c.mensaje, c.fecha,
             u.nombres, u.apellidos
      FROM Comentario c
      JOIN Usuario u ON c.Usuario_id_usuario = u.id_usuario
      WHERE c.Publicacion_id_publicacion = $1
      ORDER BY c.fecha DESC
    `, [id_publicacion])
    res.json(resultado.rows)
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message })
  }
}

// CREAR COMENTARIO
const crearComentario = async (req, res) => {
  const { id_comentario, mensaje } = req.body
  const { id_publicacion } = req.params
  const id_usuario = req.usuario.id_usuario

  try {
    await pool.query(`
      INSERT INTO Comentario 
        (id_comentario, Publicacion_id_publicacion, Usuario_id_usuario, mensaje, fecha)
      VALUES ($1, $2, $3, $4, CURRENT_DATE)
    `, [id_comentario, id_publicacion, id_usuario, mensaje])

    res.status(201).json({ mensaje: 'Comentario creado correctamente' })
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message })
  }
}

module.exports = { obtenerComentarios, crearComentario }