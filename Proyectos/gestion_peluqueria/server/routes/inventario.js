const express = require('express');
const db = require('../database');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

router.use(authMiddleware);

// Listar productos
router.get('/productos', (req, res) => {
  const { activo } = req.query;
  let sql = 'SELECT * FROM productos';
  const params = [];
  if (activo !== undefined) {
    sql += ' WHERE activo = ?';
    params.push(activo === 'true' ? 1 : 0);
  }
  sql += ' ORDER BY nombre';

  db.all(sql, params, (err, productos) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener productos' });
    }
    res.json(productos);
  });
});

// Crear producto
router.post('/productos', (req, res) => {
  const { nombre, categoria, stock, stock_minimo, costo, precio, proveedor, activo } = req.body;
  if (!nombre) {
    return res.status(400).json({ error: 'Nombre es requerido' });
  }

  const sql = `
    INSERT INTO productos (nombre, categoria, stock, stock_minimo, costo, precio, proveedor, activo)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  db.run(sql, [nombre, categoria, stock || 0, stock_minimo || 0, costo || 0, precio || 0, proveedor, activo ?? 1], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Error al crear producto' });
    }
    res.status(201).json({ id: this.lastID, message: 'Producto creado exitosamente' });
  });
});

// Actualizar producto
router.put('/productos/:id', (req, res) => {
  const { nombre, categoria, stock, stock_minimo, costo, precio, proveedor, activo } = req.body;
  const sql = `
    UPDATE productos
    SET nombre = ?, categoria = ?, stock = ?, stock_minimo = ?, costo = ?, precio = ?, proveedor = ?, activo = ?
    WHERE id = ?
  `;
  db.run(sql, [nombre, categoria, stock, stock_minimo, costo, precio, proveedor, activo, req.params.id], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Error al actualizar producto' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json({ message: 'Producto actualizado exitosamente' });
  });
});

// Registrar movimiento de inventario
router.post('/movimientos', (req, res) => {
  const { producto_id, tipo, cantidad, notas, usuario_id } = req.body;
  if (!producto_id || !tipo || !cantidad) {
    return res.status(400).json({ error: 'Producto, tipo y cantidad son requeridos' });
  }

  const sqlMovimiento = `
    INSERT INTO inventario_movimientos (producto_id, tipo, cantidad, notas, usuario_id)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(sqlMovimiento, [producto_id, tipo, cantidad, notas, usuario_id], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Error al registrar movimiento' });
    }

    const ajuste = tipo === 'entrada' ? cantidad : -cantidad;
    db.run('UPDATE productos SET stock = stock + ? WHERE id = ?', [ajuste, producto_id], function (err2) {
      if (err2) {
        return res.status(500).json({ error: 'Error al actualizar stock' });
      }
      res.status(201).json({ id: this.lastID, message: 'Movimiento registrado' });
    });
  });
});

// Listar movimientos
router.get('/movimientos', (req, res) => {
  const sql = `
    SELECT m.*, p.nombre as producto
    FROM inventario_movimientos m
    JOIN productos p ON p.id = m.producto_id
    ORDER BY m.fecha DESC
  `;

  db.all(sql, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener movimientos' });
    }
    res.json(rows);
  });
});

module.exports = router;
