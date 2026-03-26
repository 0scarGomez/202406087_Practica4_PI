const pool = require('../db')

const obtenerPublicaciones = async (req, res) => {
  try {
    const resultado = await pool.query(`
      SELECT p.id_publicacion, p.mensaje, p.fecha,
             u.nombres, u.apellidos,
             c.nombre_curso,
             cat.nombres AS nombre_catedratico, cat.apellidos AS apellido_catedratico
      FROM publicacion p
      JOIN usuario u ON p.usuario_id_usuario = u.id_usuario
      LEFT JOIN curso c ON p.curso_id_curso = c.id_curso
      LEFT JOIN catedratico cat ON p.catedratico_id_catedratico = cat.id_catedratico
      ORDER BY p.fecha DESC
    `)
    res.json(resultado.rows)
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message })
  }
}

const obtenerPorCurso = async (req, res) => {
  const { id_curso } = req.params
  try {
    const resultado = await pool.query(`
      SELECT p.id_publicacion, p.mensaje, p.fecha,
             u.nombres, u.apellidos,
             c.nombre_curso
      FROM publicacion p
      JOIN usuario u ON p.usuario_id_usuario = u.id_usuario
      LEFT JOIN curso c ON p.curso_id_curso = c.id_curso
      WHERE p.curso_id_curso = $1
      ORDER BY p.fecha DESC
    `, [id_curso])
    res.json(resultado.rows)
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message })
  }
}

const obtenerPorCatedratico = async (req, res) => {
  const { id_catedratico } = req.params
  try {
    const resultado = await pool.query(`
      SELECT p.id_publicacion, p.mensaje, p.fecha,
             u.nombres, u.apellidos,
             cat.nombres AS nombre_catedratico, cat.apellidos AS apellido_catedratico
      FROM publicacion p
      JOIN usuario u ON p.usuario_id_usuario = u.id_usuario
      LEFT JOIN catedratico cat ON p.catedratico_id_catedratico = cat.id_catedratico
      WHERE p.catedratico_id_catedratico = $1
      ORDER BY p.fecha DESC
    `, [id_catedratico])
    res.json(resultado.rows)
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message })
  }
}

const crearPublicacion = async (req, res) => {
  const { id_publicacion, id_curso, id_catedratico, mensaje } = req.body
  const id_usuario = req.usuario.id_usuario

  try {
    await pool.query(`
      INSERT INTO publicacion 
        (id_publicacion, id_usuario, id_curso, id_catedratico, mensaje, fecha,
         usuario_id_usuario, curso_id_curso, catedratico_id_catedratico)
      VALUES ($1, $2, $3, $4, $5, CURRENT_DATE, $2, $3, $4)
    `, [id_publicacion, id_usuario, id_curso, id_catedratico, mensaje])

    res.status(201).json({ mensaje: 'Publicación creada correctamente' })
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message })
  }
}

module.exports = { obtenerPublicaciones, obtenerPorCurso, obtenerPorCatedratico, crearPublicacion }