const pool = require('../db')

// OBTENER PERFIL DE USUARIO
const obtenerPerfil = async (req, res) => {
  const { id_usuario } = req.params
  try {
    const resultado = await pool.query(`
      SELECT id_usuario, registro_academico, nombres, apellidos, correo
      FROM Usuario
      WHERE id_usuario = $1
    `, [id_usuario])

    if (resultado.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' })
    }

    res.json(resultado.rows[0])
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message })
  }
}

// ACTUALIZAR PERFIL
const actualizarPerfil = async (req, res) => {
  const { id_usuario } = req.params
  const { nombres, apellidos, correo } = req.body

  try {
    await pool.query(`
      UPDATE Usuario
      SET nombres = $1, apellidos = $2, correo = $3
      WHERE id_usuario = $4
    `, [nombres, apellidos, correo, id_usuario])

    res.json({ mensaje: 'Perfil actualizado correctamente' })
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message })
  }
}

// OBTENER CURSOS APROBADOS DE UN USUARIO
const obtenerCursosAprobados = async (req, res) => {
  const { id_usuario } = req.params
  try {
    const resultado = await pool.query(`
      SELECT ca.id_registro, ca.fecha_aprobacion,
             c.nombre_curso, c.creditos, c.area
      FROM Curso_Aprobado ca
      JOIN Curso c ON ca.id_curso = c.id_curso
      WHERE ca.Usuario_id_usuario = $1
    `, [id_usuario])

    const totalCreditos = resultado.rows.reduce((sum, c) => sum + c.creditos, 0)

    res.json({ cursos: resultado.rows, total_creditos: totalCreditos })
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message })
  }
}

module.exports = { obtenerPerfil, actualizarPerfil, obtenerCursosAprobados }