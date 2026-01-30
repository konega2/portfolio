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
    SELECT * FROM proveedores_entregas
    WHERE proveedor_id = ?
    ORDER BY fecha DESC
  `;

  db.all(sql, [proveedor_id], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener entregas' });
    }
    res.json(rows);
  });
});

router.post('/', (req, res) => {
  const {
    proveedor_id,
    fecha,
    producto,
    cantidad,
    notas,
    proximo_pedido_fecha,
    proximo_pedido_cantidad,
  } = req.body;

  if (!proveedor_id || !fecha || !producto || !cantidad) {
    return res.status(400).json({ error: 'Proveedor, fecha, producto y cantidad son requeridos' });
  }

  const sql = `
    INSERT INTO proveedores_entregas
      (proveedor_id, fecha, producto, cantidad, notas, proximo_pedido_fecha, proximo_pedido_cantidad)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(
    sql,
    [
      proveedor_id,
      fecha,
      producto,
      cantidad,
      notas,
      proximo_pedido_fecha || null,
      proximo_pedido_cantidad || null,
    ],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Error al guardar entrega' });
      }
      res.status(201).json({ id: this.lastID, message: 'Entrega registrada' });
    }
  );
});

router.delete('/:id', (req, res) => {
  db.run('DELETE FROM proveedores_entregas WHERE id = ?', [req.params.id], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Error al eliminar entrega' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Entrega no encontrada' });
    }
    res.json({ message: 'Entrega eliminada' });
  });
});

module.exports = router;
