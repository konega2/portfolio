const express = require('express');
const db = require('../database');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

router.use(authMiddleware);

// Obtener todos los servicios
router.get('/', (req, res) => {
  const { activo } = req.query;
  let sql = 'SELECT * FROM servicios ORDER BY categoria, nombre';
  let params = [];

  if (activo !== undefined) {
    sql = 'SELECT * FROM servicios WHERE activo = ? ORDER BY categoria, nombre';
    params = [activo === 'true' ? 1 : 0];
  }

  db.all(sql, params, (err, servicios) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener servicios' });
    }
    res.json(servicios);
  });
});

// Obtener un servicio por ID
router.get('/:id', (req, res) => {
  db.get('SELECT * FROM servicios WHERE id = ?', [req.params.id], (err, servicio) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener servicio' });
    }
    if (!servicio) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }
    res.json(servicio);
  });
});

// Crear nuevo servicio
router.post('/', (req, res) => {
  const { nombre, descripcion, precio, duracion, categoria } = req.body;

  if (!nombre || !precio || !duracion) {
    return res.status(400).json({ error: 'Nombre, precio y duración son requeridos' });
  }

  const sql = 'INSERT INTO servicios (nombre, descripcion, precio, duracion, categoria) VALUES (?, ?, ?, ?, ?)';
  db.run(sql, [nombre, descripcion, precio, duracion, categoria], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Error al crear servicio' });
    }
    res.status(201).json({ id: this.lastID, message: 'Servicio creado exitosamente' });
  });
});

// Actualizar servicio
router.put('/:id', (req, res) => {
  const { nombre, descripcion, precio, duracion, categoria, activo } = req.body;

  const sql = 'UPDATE servicios SET nombre = ?, descripcion = ?, precio = ?, duracion = ?, categoria = ?, activo = ? WHERE id = ?';
  db.run(sql, [nombre, descripcion, precio, duracion, categoria, activo, req.params.id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Error al actualizar servicio' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }
    res.json({ message: 'Servicio actualizado exitosamente' });
  });
});

// Eliminar servicio
router.delete('/:id', (req, res) => {
  db.run('DELETE FROM servicios WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Error al eliminar servicio' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }
    res.json({ message: 'Servicio eliminado exitosamente' });
  });
});

// Obtener categorías únicas
router.get('/categorias/lista', (req, res) => {
  db.all('SELECT DISTINCT categoria FROM servicios WHERE activo = 1 AND categoria IS NOT NULL', (err, categorias) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener categorías' });
    }
    res.json(categorias.map(c => c.categoria));
  });
});

module.exports = router;
