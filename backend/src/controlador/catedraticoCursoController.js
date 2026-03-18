const pool = require('../db')

// OBTENER TODOS LOS CATEDRATICOS
const obtenerCatedraticos = async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM Catedratico')
    res.json(resultado.rows)
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message })
  }
}

// OBTENER TODOS LOS CURSOS
const obtenerCursos = async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM Curso')
    res.json(resultado.rows)
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message })
  }
}

module.exports = { obtenerCatedraticos, obtenerCursos }