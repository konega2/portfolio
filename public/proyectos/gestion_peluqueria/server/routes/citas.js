const express = require('express');
const db = require('../database');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

router.use(authMiddleware);

// Obtener todas las citas
router.get('/', (req, res) => {
  const { fecha_inicio, fecha_fin, estado, empleado_id } = req.query;
  
  let sql = `
    SELECT c.*, 
           cl.nombre as cliente_nombre, cl.apellidos as cliente_apellidos, cl.telefono as cliente_telefono,
           s.nombre as servicio_nombre, s.precio as servicio_precio,
           u.nombre as empleado_nombre
    FROM citas c
    JOIN clientes cl ON c.cliente_id = cl.id
    JOIN servicios s ON c.servicio_id = s.id
    JOIN usuarios u ON c.empleado_id = u.id
    WHERE 1=1
  `;
  const params = [];

  if (fecha_inicio) {
    sql += ' AND c.fecha_hora >= ?';
    params.push(fecha_inicio);
  }
  if (fecha_fin) {
    sql += ' AND c.fecha_hora <= ?';
    params.push(fecha_fin);
  }
  if (estado) {
    sql += ' AND c.estado = ?';
    params.push(estado);
  }
  if (empleado_id) {
    sql += ' AND c.empleado_id = ?';
    params.push(empleado_id);
  }

  sql += ' ORDER BY c.fecha_hora';

  db.all(sql, params, (err, citas) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener citas' });
    }
    res.json(citas);
  });
});

// Obtener una cita por ID
router.get('/:id', (req, res) => {
  const sql = `
    SELECT c.*, 
           cl.nombre as cliente_nombre, cl.apellidos as cliente_apellidos, cl.telefono as cliente_telefono,
           s.nombre as servicio_nombre, s.precio as servicio_precio,
           u.nombre as empleado_nombre
    FROM citas c
    JOIN clientes cl ON c.cliente_id = cl.id
    JOIN servicios s ON c.servicio_id = s.id
    JOIN usuarios u ON c.empleado_id = u.id
    WHERE c.id = ?
  `;

  db.get(sql, [req.params.id], (err, cita) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener cita' });
    }
    if (!cita) {
      return res.status(404).json({ error: 'Cita no encontrada' });
    }
    res.json(cita);
  });
});

// Crear nueva cita
router.post('/', (req, res) => {
  const { cliente_id, servicio_id, empleado_id, fecha_hora, duracion, notas, precio } = req.body;

  if (!cliente_id || !servicio_id || !empleado_id || !fecha_hora) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }

  const sql = 'INSERT INTO citas (cliente_id, servicio_id, empleado_id, fecha_hora, duracion, notas, precio) VALUES (?, ?, ?, ?, ?, ?, ?)';
  db.run(sql, [cliente_id, servicio_id, empleado_id, fecha_hora, duracion || 45, notas, precio], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Error al crear cita' });
    }
    res.status(201).json({ id: this.lastID, message: 'Cita creada exitosamente' });
  });
});

// Actualizar cita
router.put('/:id', (req, res) => {
  const { cliente_id, servicio_id, empleado_id, fecha_hora, duracion, estado, notas, precio } = req.body;

  const sql = `UPDATE citas 
               SET cliente_id = ?, servicio_id = ?, empleado_id = ?, fecha_hora = ?, 
                   duracion = ?, estado = ?, notas = ?, precio = ?
               WHERE id = ?`;
  
  db.run(sql, [cliente_id, servicio_id, empleado_id, fecha_hora, duracion, estado, notas, precio, req.params.id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Error al actualizar cita' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Cita no encontrada' });
    }
    res.json({ message: 'Cita actualizada exitosamente' });
  });
});

// Eliminar cita
router.delete('/:id', (req, res) => {
  db.run('DELETE FROM citas WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Error al eliminar cita' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Cita no encontrada' });
    }
    res.json({ message: 'Cita eliminada exitosamente' });
  });
});

// Cambiar estado de cita
router.patch('/:id/estado', (req, res) => {
  const { estado } = req.body;

  if (!['pendiente', 'confirmada', 'completada', 'cancelada'].includes(estado)) {
    return res.status(400).json({ error: 'Estado inválido' });
  }

  db.run('UPDATE citas SET estado = ? WHERE id = ?', [estado, req.params.id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Error al actualizar estado' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Cita no encontrada' });
    }
    res.json({ message: 'Estado actualizado exitosamente' });
  });
});

module.exports = router;
