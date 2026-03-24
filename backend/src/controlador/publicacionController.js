const pool = require('../db')

// OBTENER TODAS LAS PUBLICACIONES
const obtenerPublicaciones = async (req, res) => {
  try {
    const resultado = await pool.query(`
      SELECT p.id_publicacion, p.mensaje, p.fecha,
             u.nombres, u.apellidos,
             c.nombre_curso,
             cat.nombres AS nombre_catedratico, cat.apellidos AS apellido_catedratico
      FROM Publicacion p
      JOIN Usuario u ON p.Usuario_id_usuario = u.id_usuario
      LEFT JOIN Curso c ON p.Curso_id_curso = c.id_curso
      LEFT JOIN Catedratico cat ON p.Catedratico_id_catedratico = cat.id_catedratico
      ORDER BY p.fecha DESC
    `)
    res.json(resultado.rows)
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message })
  }
}

// OBTENER PUBLICACIONES POR CURSO
const obtenerPorCurso = async (req, res) => {
  const { id_curso } = req.params
  try {
    const resultado = await pool.query(`
      SELECT p.id_publicacion, p.mensaje, p.fecha,
             u.nombres, u.apellidos,
             c.nombre_curso
      FROM Publicacion p
      JOIN Usuario u ON p.Usuario_id_usuario = u.id_usuario
      LEFT JOIN Curso c ON p.Curso_id_curso = c.id_curso
      WHERE p.Curso_id_curso = $1
      ORDER BY p.fecha DESC
    `, [id_curso])
    res.json(resultado.rows)
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message })
  }
}

// OBTENER PUBLICACIONES POR CATEDRATICO
const obtenerPorCatedratico = async (req, res) => {
  const { id_catedratico } = req.params
  try {
    const resultado = await pool.query(`
      SELECT p.id_publicacion, p.mensaje, p.fecha,
             u.nombres, u.apellidos,
             cat.nombres AS nombre_catedratico, cat.apellidos AS apellido_catedratico
      FROM Publicacion p
      JOIN Usuario u ON p.Usuario_id_usuario = u.id_usuario
      LEFT JOIN Catedratico cat ON p.Catedratico_id_catedratico = cat.id_catedratico
      WHERE p.Catedratico_id_catedratico = $1
      ORDER BY p.fecha DESC
    `, [id_catedratico])
    res.json(resultado.rows)
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message })
  }
}

// CREAR PUBLICACION
const crearPublicacion = async (req, res) => {
  const { id_publicacion, id_curso, id_catedratico, mensaje } = req.body
  const id_usuario = req.usuario.id_usuario

  try {
    await pool.query(`
  INSERT INTO Publicacion 
    (id_publicacion, id_usuario, id_curso, id_catedratico, mensaje, fecha,
     Usuario_id_usuario, Curso_id_curso, Catedratico_id_catedratico)
  VALUES ($1, $2, $3, $4, $5, CURRENT_DATE, $2, $3, $4)
`, [id_publicacion, id_usuario, id_curso, id_catedratico, mensaje])

    res.status(201).json({ mensaje: 'Publicación creada correctamente' })
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message })
  }
}

module.exports = { obtenerPublicaciones, obtenerPorCurso, obtenerPorCatedratico, crearPublicacion }