const express = require('express');
const db = require('../database');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

router.use(authMiddleware);

// Obtener todos los clientes
router.get('/', (req, res) => {
  const { busqueda } = req.query;
  let sql = 'SELECT * FROM clientes ORDER BY nombre';
  let params = [];

  if (busqueda) {
    sql = 'SELECT * FROM clientes WHERE nombre LIKE ? OR apellidos LIKE ? OR telefono LIKE ? ORDER BY nombre';
    params = [`%${busqueda}%`, `%${busqueda}%`, `%${busqueda}%`];
  }

  db.all(sql, params, (err, clientes) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener clientes' });
    }
    res.json(clientes);
  });
});

// Obtener un cliente por ID
router.get('/:id', (req, res) => {
  db.get('SELECT * FROM clientes WHERE id = ?', [req.params.id], (err, cliente) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener cliente' });
    }
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    res.json(cliente);
  });
});

// Crear nuevo cliente
router.post('/', (req, res) => {
  const { nombre, apellidos, telefono, email, notas } = req.body;

  if (!nombre) {
    return res.status(400).json({ error: 'El nombre es requerido' });
  }

  const sql = 'INSERT INTO clientes (nombre, apellidos, telefono, email, notas) VALUES (?, ?, ?, ?, ?)';
  db.run(sql, [nombre, apellidos, telefono, email, notas], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Error al crear cliente' });
    }
    res.status(201).json({ id: this.lastID, message: 'Cliente creado exitosamente' });
  });
});

// Actualizar cliente
router.put('/:id', (req, res) => {
  const { nombre, apellidos, telefono, email, notas } = req.body;

  const sql = 'UPDATE clientes SET nombre = ?, apellidos = ?, telefono = ?, email = ?, notas = ? WHERE id = ?';
  db.run(sql, [nombre, apellidos, telefono, email, notas, req.params.id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Error al actualizar cliente' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    res.json({ message: 'Cliente actualizado exitosamente' });
  });
});

// Eliminar cliente
router.delete('/:id', (req, res) => {
  db.run('DELETE FROM clientes WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Error al eliminar cliente' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    res.json({ message: 'Cliente eliminado exitosamente' });
  });
});

// Obtener historial de citas de un cliente
router.get('/:id/historial', (req, res) => {
  const sql = `
    SELECT c.*, s.nombre as servicio, s.precio, u.nombre as empleado
    FROM citas c
    JOIN servicios s ON c.servicio_id = s.id
    JOIN usuarios u ON c.empleado_id = u.id
    WHERE c.cliente_id = ?
    ORDER BY c.fecha_hora DESC
  `;

  db.all(sql, [req.params.id], (err, historial) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener historial' });
    }
    res.json(historial);
  });
});

module.exports = router;
