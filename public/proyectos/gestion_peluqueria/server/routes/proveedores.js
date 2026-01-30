const express = require('express');
const db = require('../database');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

router.use(authMiddleware);

router.get('/', (req, res) => {
  const { busqueda } = req.query;
  let sql = 'SELECT * FROM proveedores ORDER BY nombre';
  let params = [];

  if (busqueda) {
    sql = 'SELECT * FROM proveedores WHERE nombre LIKE ? OR contacto LIKE ? OR telefono LIKE ? ORDER BY nombre';
    params = [`%${busqueda}%`, `%${busqueda}%`, `%${busqueda}%`];
  }

  db.all(sql, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener proveedores' });
    }
    res.json(rows);
  });
});

router.get('/:id', (req, res) => {
  db.get('SELECT * FROM proveedores WHERE id = ?', [req.params.id], (err, proveedor) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener proveedor' });
    }
    if (!proveedor) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }
    res.json(proveedor);
  });
});

router.post('/', (req, res) => {
  const { nombre, contacto, telefono, email, direccion, notas, activo } = req.body;
  if (!nombre) {
    return res.status(400).json({ error: 'El nombre es requerido' });
  }

  const sql = `
    INSERT INTO proveedores (nombre, contacto, telefono, email, direccion, notas, activo)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(sql, [nombre, contacto, telefono, email, direccion, notas, activo ?? 1], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Error al crear proveedor' });
    }
    res.status(201).json({ id: this.lastID, message: 'Proveedor creado' });
  });
});

router.put('/:id', (req, res) => {
  const { nombre, contacto, telefono, email, direccion, notas, activo } = req.body;

  const sql = `
    UPDATE proveedores
    SET nombre = ?, contacto = ?, telefono = ?, email = ?, direccion = ?, notas = ?, activo = ?
    WHERE id = ?
  `;

  db.run(sql, [nombre, contacto, telefono, email, direccion, notas, activo ?? 1, req.params.id], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Error al actualizar proveedor' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }
    res.json({ message: 'Proveedor actualizado' });
  });
});

router.delete('/:id', (req, res) => {
  db.run('DELETE FROM proveedores WHERE id = ?', [req.params.id], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Error al eliminar proveedor' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }
    res.json({ message: 'Proveedor eliminado' });
  });
});

module.exports = router;
