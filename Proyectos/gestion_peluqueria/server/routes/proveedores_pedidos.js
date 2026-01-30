const express = require('express');
const db = require('../database');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

router.use(authMiddleware);

router.get('/', (req, res) => {
  const { proveedor_id } = req.query;
  if (!proveedor_id) {
    return res.status(400).json({ error: 'proveedor_id es requerido' });
  }

  const sql = `
    SELECT * FROM proveedores_pedidos
    WHERE proveedor_id = ?
    ORDER BY fecha_pedido DESC
  `;

  db.all(sql, [proveedor_id], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener pedidos' });
    }
    res.json(rows);
  });
});

router.post('/', (req, res) => {
  const { proveedor_id, fecha_pedido, producto, cantidad, notas } = req.body;
  if (!proveedor_id || !fecha_pedido || !producto || !cantidad) {
    return res.status(400).json({ error: 'Proveedor, fecha, producto y cantidad son requeridos' });
  }

  const sql = `
    INSERT INTO proveedores_pedidos (proveedor_id, fecha_pedido, producto, cantidad, notas)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(sql, [proveedor_id, fecha_pedido, producto, cantidad, notas], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Error al crear pedido' });
    }
    res.status(201).json({ id: this.lastID, message: 'Pedido creado' });
  });
});

router.patch('/:id/recibir', (req, res) => {
  const { fecha_entrega } = req.body;
  const sql = `
    UPDATE proveedores_pedidos
    SET estado = 'recibido', fecha_entrega = COALESCE(?, datetime('now'))
    WHERE id = ?
  `;

  db.run(sql, [fecha_entrega || null, req.params.id], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Error al marcar pedido como recibido' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }
    res.json({ message: 'Pedido recibido' });
  });
});

router.delete('/:id', (req, res) => {
  db.run('DELETE FROM proveedores_pedidos WHERE id = ?', [req.params.id], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Error al eliminar pedido' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }
    res.json({ message: 'Pedido eliminado' });
  });
});

module.exports = router;
