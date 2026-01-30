const express = require('express');
const db = require('../database');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

router.use(authMiddleware);

// Obtener todas las ventas
router.get('/', (req, res) => {
  const { fecha_inicio, fecha_fin } = req.query;
  
  let sql = `
    SELECT v.*, 
           c.nombre as cliente_nombre, c.apellidos as cliente_apellidos,
           u.nombre as empleado_nombre
    FROM ventas v
    JOIN clientes c ON v.cliente_id = c.id
    LEFT JOIN usuarios u ON v.empleado_id = u.id
    WHERE 1=1
  `;
  const params = [];

  if (fecha_inicio) {
    sql += ' AND v.fecha >= ?';
    params.push(fecha_inicio);
  }
  if (fecha_fin) {
    sql += ' AND v.fecha <= ?';
    params.push(fecha_fin);
  }

  sql += ' ORDER BY v.fecha DESC';

  db.all(sql, params, (err, ventas) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener ventas' });
    }
    res.json(ventas);
  });
});

// Registrar nueva venta
router.post('/', (req, res) => {
  const { cita_id, cliente_id, monto, metodo_pago, empleado_id, fecha } = req.body;

  if (!cliente_id || !monto) {
    return res.status(400).json({ error: 'Cliente y monto son requeridos' });
  }

  const sql = fecha
    ? 'INSERT INTO ventas (cita_id, cliente_id, monto, metodo_pago, fecha, empleado_id) VALUES (?, ?, ?, ?, ?, ?)'
    : 'INSERT INTO ventas (cita_id, cliente_id, monto, metodo_pago, empleado_id) VALUES (?, ?, ?, ?, ?)';
  const params = fecha
    ? [cita_id, cliente_id, monto, metodo_pago, fecha, empleado_id]
    : [cita_id, cliente_id, monto, metodo_pago, empleado_id];
  db.run(sql, params, function(err) {
    if (err) {
      return res.status(500).json({ error: 'Error al registrar venta' });
    }
    res.status(201).json({ id: this.lastID, message: 'Venta registrada exitosamente' });
  });
});

module.exports = router;
