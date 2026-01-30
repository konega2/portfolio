const express = require('express');
const db = require('../database');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

router.use(authMiddleware);

// Obtener estadísticas generales
router.get('/stats', (req, res) => {
  const hoy = new Date().toISOString().split('T')[0];
  const inicioMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();

  const queries = {
    // Ventas de hoy
    ventasHoy: `SELECT COALESCE(SUM(monto), 0) as total FROM ventas WHERE DATE(fecha) = DATE('${hoy}')`,
    
    // Ventas del mes
    ventasMes: `SELECT COALESCE(SUM(monto), 0) as total FROM ventas WHERE fecha >= '${inicioMes}'`,

    // Gastos del mes
    gastosMes: `SELECT COALESCE(SUM(monto), 0) as total FROM gastos WHERE fecha >= '${inicioMes}'`,
    
    // Citas de hoy
    citasHoy: `SELECT COUNT(*) as total FROM citas WHERE DATE(fecha_hora) = DATE('${hoy}')`,
    
    // Citas pendientes
    citasPendientes: `SELECT COUNT(*) as total FROM citas WHERE estado = 'pendiente' AND fecha_hora >= datetime('now')`,
    
    // Total clientes
    totalClientes: `SELECT COUNT(*) as total FROM clientes`,
    
    // Servicios activos
    serviciosActivos: `SELECT COUNT(*) as total FROM servicios WHERE activo = 1`
  };

  const stats = {};
  let completed = 0;

  Object.keys(queries).forEach(key => {
    db.get(queries[key], (err, result) => {
      if (!err) {
        stats[key] = result.total;
      }
      completed++;
      if (completed === Object.keys(queries).length) {
        stats.beneficioMes = (stats.ventasMes || 0) - (stats.gastosMes || 0);
        res.json(stats);
      }
    });
  });
});

// Ventas por día (últimos 30 días)
router.get('/ventas-diarias', (req, res) => {
  const sql = `
    SELECT DATE(fecha) as fecha, SUM(monto) as total, COUNT(*) as cantidad
    FROM ventas
    WHERE fecha >= date('now', '-30 days')
    GROUP BY DATE(fecha)
    ORDER BY fecha
  `;

  db.all(sql, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener datos' });
    }
    res.json(rows);
  });
});

// Servicios más populares
router.get('/servicios-populares', (req, res) => {
  const sql = `
    SELECT s.nombre, COUNT(c.id) as cantidad, SUM(s.precio) as ingresos
    FROM citas c
    JOIN servicios s ON c.servicio_id = s.id
    WHERE c.estado = 'completada'
    GROUP BY s.id, s.nombre
    ORDER BY cantidad DESC
    LIMIT 10
  `;

  db.all(sql, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener datos' });
    }
    res.json(rows);
  });
});

// Rendimiento de empleados
router.get('/rendimiento-empleados', (req, res) => {
  const inicioMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
  
  const sql = `
    SELECT u.nombre, COUNT(c.id) as citas_completadas, COALESCE(SUM(v.monto), 0) as ingresos
    FROM usuarios u
    LEFT JOIN citas c ON u.id = c.empleado_id AND c.estado = 'completada' AND c.fecha_hora >= ?
    LEFT JOIN ventas v ON c.id = v.cita_id
    WHERE u.rol = 'empleado' AND u.activo = 1
    GROUP BY u.id, u.nombre
    ORDER BY ingresos DESC
  `;

  db.all(sql, [inicioMes], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener datos' });
    }
    res.json(rows);
  });
});

// Próximas citas
router.get('/proximas-citas', (req, res) => {
  const sql = `
    SELECT c.*, 
           cl.nombre as cliente_nombre, cl.apellidos as cliente_apellidos,
           s.nombre as servicio_nombre,
           u.nombre as empleado_nombre
    FROM citas c
    JOIN clientes cl ON c.cliente_id = cl.id
    JOIN servicios s ON c.servicio_id = s.id
    JOIN usuarios u ON c.empleado_id = u.id
    WHERE c.fecha_hora >= datetime('now') AND c.estado = 'pendiente'
    ORDER BY c.fecha_hora
    LIMIT 10
  `;

  db.all(sql, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener datos' });
    }
    res.json(rows);
  });
});

// Métodos de pago
router.get('/metodos-pago', (req, res) => {
  const inicioMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
  
  const sql = `
    SELECT metodo_pago, COUNT(*) as cantidad, SUM(monto) as total
    FROM ventas
    WHERE fecha >= ?
    GROUP BY metodo_pago
  `;

  db.all(sql, [inicioMes], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener datos' });
    }
    res.json(rows);
  });
});

module.exports = router;
