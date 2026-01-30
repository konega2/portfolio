const express = require('express');
const db = require('../database');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

router.use(authMiddleware);

// Listar caja diaria
router.get('/', (req, res) => {
  const { fecha_inicio, fecha_fin } = req.query;
  let sql = 'SELECT * FROM caja_diaria WHERE 1=1';
  const params = [];

  if (fecha_inicio) {
    sql += ' AND fecha >= ?';
    params.push(fecha_inicio);
  }
  if (fecha_fin) {
    sql += ' AND fecha <= ?';
    params.push(fecha_fin);
  }

  sql += ' ORDER BY fecha DESC';

  db.all(sql, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener caja diaria' });
    }
    res.json(rows);
  });
});

// Crear o actualizar caja diaria
router.post('/', (req, res) => {
  const { fecha, apertura, cierre, notas, usuario_id, estado } = req.body;
  if (!fecha) {
    return res.status(400).json({ error: 'La fecha es requerida' });
  }

  const sql = `
    INSERT INTO caja_diaria (fecha, apertura, cierre, estado, notas, usuario_id)
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(fecha) DO UPDATE SET
      apertura = excluded.apertura,
      cierre = excluded.cierre,
      estado = excluded.estado,
      notas = excluded.notas,
      usuario_id = excluded.usuario_id
  `;

  db.run(sql, [fecha, apertura || 0, cierre || 0, estado || 'cerrada', notas, usuario_id], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Error al guardar caja diaria' });
    }
    res.status(201).json({ message: 'Caja diaria guardada' });
  });
});

router.patch('/:id/cerrar', (req, res) => {
  const { cierre } = req.body;
  const sql = `UPDATE caja_diaria SET estado = 'cerrada', cierre = COALESCE(?, cierre) WHERE id = ?`;
  db.run(sql, [cierre, req.params.id], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Error al cerrar caja' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Caja no encontrada' });
    }
    res.json({ message: 'Caja cerrada' });
  });
});

router.patch('/:id/abrir', (req, res) => {
  db.serialize(() => {
    db.run("UPDATE caja_diaria SET estado = 'cerrada' WHERE estado = 'abierta' AND id != ?", [req.params.id]);
    const sql = `UPDATE caja_diaria SET estado = 'abierta' WHERE id = ?`;
    db.run(sql, [req.params.id], function (err) {
      if (err) {
        return res.status(500).json({ error: 'Error al abrir caja' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Caja no encontrada' });
      }
      res.json({ message: 'Caja abierta' });
    });
  });
});

module.exports = router;
