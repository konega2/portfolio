const express = require('express');
const db = require('../database');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

router.use(authMiddleware);

// Obtener gastos
router.get('/', (req, res) => {
  const { fecha_inicio, fecha_fin, categoria } = req.query;
  let sql = 'SELECT * FROM gastos WHERE 1=1';
  const params = [];

  if (fecha_inicio) {
    sql += ' AND fecha >= ?';
    params.push(fecha_inicio);
  }
  if (fecha_fin) {
    sql += ' AND fecha <= ?';
    params.push(fecha_fin);
  }
  if (categoria) {
    sql += ' AND categoria = ?';
    params.push(categoria);
  }

  sql += ' ORDER BY fecha DESC';

  db.all(sql, params, (err, gastos) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener gastos' });
    }
    res.json(gastos);
  });
});

// Resumen de gastos
router.get('/resumen', (req, res) => {
  const hoy = new Date().toISOString().split('T')[0];
  const inicioMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();

  const queries = {
    gastosHoy: `SELECT COALESCE(SUM(monto), 0) as total FROM gastos WHERE DATE(fecha) = DATE('${hoy}')`,
    gastosMes: `SELECT COALESCE(SUM(monto), 0) as total FROM gastos WHERE fecha >= '${inicioMes}'`,
    totalGastos: `SELECT COALESCE(SUM(monto), 0) as total FROM gastos`
  };

  const resumen = {};
  let completed = 0;

  Object.keys(queries).forEach((key) => {
    db.get(queries[key], (err, result) => {
      if (!err) {
        resumen[key] = result.total;
      }
      completed++;
      if (completed === Object.keys(queries).length) {
        res.json(resumen);
      }
    });
  });
});

// Crear gasto
router.post('/', (req, res) => {
  const { concepto, categoria, monto, fecha, metodo_pago, proveedor, notas, empleado_id } = req.body;

  if (!concepto || !monto) {
    return res.status(400).json({ error: 'Concepto y monto son requeridos' });
  }

  const sql = `
    INSERT INTO gastos (concepto, categoria, monto, fecha, metodo_pago, proveedor, notas, empleado_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(sql, [concepto, categoria, monto, fecha, metodo_pago, proveedor, notas, empleado_id], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Error al crear gasto' });
    }
    res.status(201).json({ id: this.lastID, message: 'Gasto creado exitosamente' });
  });
});

// Actualizar gasto
router.put('/:id', (req, res) => {
  const { concepto, categoria, monto, fecha, metodo_pago, proveedor, notas, empleado_id } = req.body;

  const sql = `
    UPDATE gastos
    SET concepto = ?, categoria = ?, monto = ?, fecha = ?, metodo_pago = ?, proveedor = ?, notas = ?, empleado_id = ?
    WHERE id = ?
  `;

  db.run(sql, [concepto, categoria, monto, fecha, metodo_pago, proveedor, notas, empleado_id, req.params.id], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Error al actualizar gasto' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Gasto no encontrado' });
    }
    res.json({ message: 'Gasto actualizado exitosamente' });
  });
});

// Eliminar gasto
router.delete('/:id', (req, res) => {
  db.run('DELETE FROM gastos WHERE id = ?', [req.params.id], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Error al eliminar gasto' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Gasto no encontrado' });
    }
    res.json({ message: 'Gasto eliminado exitosamente' });
  });
});

module.exports = router;
