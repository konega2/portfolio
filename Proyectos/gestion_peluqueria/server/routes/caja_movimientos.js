const express = require('express');
const db = require('../database');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

router.use(authMiddleware);

// Obtener movimientos de caja
router.get('/', (req, res) => {
  const { caja_id } = req.query;
  let sql = `
    SELECT m.*, c.fecha as fecha_caja, cli.nombre as cliente_nombre, cli.apellidos as cliente_apellidos
    FROM caja_movimientos m
    LEFT JOIN caja_diaria c ON c.id = m.caja_id
    LEFT JOIN citas ct ON ct.id = m.cita_id
    LEFT JOIN clientes cli ON cli.id = ct.cliente_id
    ORDER BY m.fecha DESC
  `;
  const params = [];

  if (caja_id) {
    sql = `
      SELECT m.*, c.fecha as fecha_caja, cli.nombre as cliente_nombre, cli.apellidos as cliente_apellidos
      FROM caja_movimientos m
      LEFT JOIN caja_diaria c ON c.id = m.caja_id
      LEFT JOIN citas ct ON ct.id = m.cita_id
      LEFT JOIN clientes cli ON cli.id = ct.cliente_id
      WHERE m.caja_id = ?
      ORDER BY m.fecha DESC
    `;
    params.push(caja_id);
  }

  db.all(sql, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener movimientos' });
    }
    res.json(rows);
  });
});

// Registrar movimiento de caja
router.post('/', (req, res) => {
  const {
    caja_id,
    tipo,
    metodo_pago,
    monto,
    propina,
    efectivo_recibido,
    cambio,
    cita_id,
    notas,
    usuario_id,
  } = req.body;

  if (!caja_id || !tipo || !monto) {
    return res.status(400).json({ error: 'Caja, tipo y monto son requeridos' });
  }

  const sql = `
    INSERT INTO caja_movimientos (caja_id, tipo, metodo_pago, monto, propina, efectivo_recibido, cambio, cita_id, notas, usuario_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(
    sql,
    [caja_id, tipo, metodo_pago, monto, propina || 0, efectivo_recibido || 0, cambio || 0, cita_id || null, notas, usuario_id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Error al registrar movimiento' });
      }
      res.status(201).json({ id: this.lastID, message: 'Movimiento registrado' });
    }
  );
});

module.exports = router;
