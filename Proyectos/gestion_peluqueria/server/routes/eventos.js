const express = require('express');
const db = require('../database');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

router.use(authMiddleware);

// Obtener eventos
router.get('/', (req, res) => {
  const { fecha_inicio, fecha_fin } = req.query;
  let sql = 'SELECT * FROM eventos WHERE 1=1';
  const params = [];

  if (fecha_inicio) {
    sql += ' AND fecha_inicio >= ?';
    params.push(fecha_inicio);
  }
  if (fecha_fin) {
    sql += ' AND (fecha_fin <= ? OR fecha_fin IS NULL)';
    params.push(fecha_fin);
  }

  sql += ' ORDER BY fecha_inicio';

  db.all(sql, params, (err, eventos) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener eventos' });
    }
    res.json(eventos);
  });
});

// Crear evento
router.post('/', (req, res) => {
  const { titulo, descripcion, fecha_inicio, fecha_fin, todo_dia, tipo, color, creado_por } = req.body;

  if (!titulo || !fecha_inicio) {
    return res.status(400).json({ error: 'Título y fecha de inicio son requeridos' });
  }

  const sql = `
    INSERT INTO eventos (titulo, descripcion, fecha_inicio, fecha_fin, todo_dia, tipo, color, creado_por)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(
    sql,
    [titulo, descripcion, fecha_inicio, fecha_fin, todo_dia ? 1 : 0, tipo, color, creado_por],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Error al crear evento' });
      }
      res.status(201).json({ id: this.lastID, message: 'Evento creado exitosamente' });
    }
  );
});

// Actualizar evento
router.put('/:id', (req, res) => {
  const { titulo, descripcion, fecha_inicio, fecha_fin, todo_dia, tipo, color, creado_por } = req.body;

  const sql = `
    UPDATE eventos
    SET titulo = ?, descripcion = ?, fecha_inicio = ?, fecha_fin = ?, todo_dia = ?, tipo = ?, color = ?, creado_por = ?
    WHERE id = ?
  `;

  db.run(
    sql,
    [titulo, descripcion, fecha_inicio, fecha_fin, todo_dia ? 1 : 0, tipo, color, creado_por, req.params.id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Error al actualizar evento' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Evento no encontrado' });
      }
      res.json({ message: 'Evento actualizado exitosamente' });
    }
  );
});

// Eliminar evento
router.delete('/:id', (req, res) => {
  db.run('DELETE FROM eventos WHERE id = ?', [req.params.id], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Error al eliminar evento' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }
    res.json({ message: 'Evento eliminado exitosamente' });
  });
});

module.exports = router;
