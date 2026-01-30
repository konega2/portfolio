const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../database');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

router.use(authMiddleware);

router.get('/', (req, res) => {
  db.all("SELECT id, nombre, email, usuario, rol, telefono, activo FROM usuarios WHERE rol = 'empleado' ORDER BY nombre", (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener empleados' });
    }
    res.json(rows);
  });
});

router.get('/:id', (req, res) => {
  db.get('SELECT id, nombre, email, usuario, rol, telefono, activo FROM usuarios WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener empleado' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Empleado no encontrado' });
    }
    res.json(row);
  });
});

router.post('/', (req, res) => {
  const { nombre, usuario, email, telefono, password } = req.body;
  if (!nombre || !usuario || !password) {
    return res.status(400).json({ error: 'Nombre, usuario y contraseña son requeridos' });
  }

  const hash = bcrypt.hashSync(password, 10);
  const sql = `
    INSERT INTO usuarios (nombre, email, usuario, password, rol, telefono, activo)
    VALUES (?, ?, ?, ?, 'empleado', ?, 1)
  `;

  db.run(sql, [nombre, email || null, usuario, hash, telefono || null], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Error al crear empleado' });
    }
    res.status(201).json({ id: this.lastID, message: 'Empleado creado' });
  });
});

router.put('/:id', (req, res) => {
  const { nombre, email, telefono, activo, password } = req.body;

  const actualizarBasico = () => {
    const sql = `
      UPDATE usuarios
      SET nombre = ?, email = ?, telefono = ?, activo = ?
      WHERE id = ?
    `;

    db.run(sql, [nombre, email, telefono, activo ?? 1, req.params.id], function (err) {
      if (err) {
        return res.status(500).json({ error: 'Error al actualizar empleado' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Empleado no encontrado' });
      }
      res.json({ message: 'Empleado actualizado' });
    });
  };

  if (password) {
    const hash = bcrypt.hashSync(password, 10);
    db.run('UPDATE usuarios SET password = ? WHERE id = ?', [hash, req.params.id], (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error al actualizar contraseña' });
      }
      actualizarBasico();
    });
  } else {
    actualizarBasico();
  }
});

router.get('/:id/fichajes', (req, res) => {
  db.all('SELECT * FROM empleados_fichajes WHERE empleado_id = ? ORDER BY fecha_entrada DESC', [req.params.id], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener fichajes' });
    }
    res.json(rows);
  });
});

router.post('/:id/fichajes/entrada', (req, res) => {
  db.get(
    'SELECT id FROM empleados_fichajes WHERE empleado_id = ? AND fecha_salida IS NULL ORDER BY fecha_entrada DESC LIMIT 1',
    [req.params.id],
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'Error al registrar entrada' });
      }
      if (row) {
        return res.status(400).json({ error: 'Ya hay un fichaje abierto' });
      }
      db.run(
        'INSERT INTO empleados_fichajes (empleado_id, fecha_entrada) VALUES (?, datetime(\'now\'))',
        [req.params.id],
        function (error) {
          if (error) {
            return res.status(500).json({ error: 'Error al registrar entrada' });
          }
          res.status(201).json({ id: this.lastID, message: 'Entrada registrada' });
        }
      );
    }
  );
});

router.post('/:id/fichajes/salida', (req, res) => {
  db.get(
    'SELECT id, fecha_entrada FROM empleados_fichajes WHERE empleado_id = ? AND fecha_salida IS NULL ORDER BY fecha_entrada DESC LIMIT 1',
    [req.params.id],
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'Error al registrar salida' });
      }
      if (!row) {
        return res.status(400).json({ error: 'No hay fichaje abierto' });
      }
      const sql = `
        UPDATE empleados_fichajes
        SET fecha_salida = datetime('now'),
            minutos_trabajados = CAST((julianday(datetime('now')) - julianday(fecha_entrada)) * 24 * 60 AS INTEGER)
        WHERE id = ?
      `;
      db.run(sql, [row.id], function (error) {
        if (error) {
          return res.status(500).json({ error: 'Error al registrar salida' });
        }
        res.json({ message: 'Salida registrada' });
      });
    }
  );
});

router.get('/:id/ausencias', (req, res) => {
  db.all('SELECT * FROM empleados_ausencias WHERE empleado_id = ? ORDER BY fecha_inicio DESC', [req.params.id], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener ausencias' });
    }
    res.json(rows);
  });
});

router.post('/:id/ausencias', (req, res) => {
  const { fecha_inicio, fecha_fin, motivo, notas } = req.body;
  if (!fecha_inicio || !fecha_fin) {
    return res.status(400).json({ error: 'Fechas son requeridas' });
  }
  db.run(
    'INSERT INTO empleados_ausencias (empleado_id, fecha_inicio, fecha_fin, motivo, notas) VALUES (?, ?, ?, ?, ?)',
    [req.params.id, fecha_inicio, fecha_fin, motivo || null, notas || null],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Error al registrar ausencia' });
      }
      res.status(201).json({ id: this.lastID, message: 'Ausencia registrada' });
    }
  );
});

router.delete('/:id/ausencias/:ausenciaId', (req, res) => {
  db.run('DELETE FROM empleados_ausencias WHERE id = ? AND empleado_id = ?', [req.params.ausenciaId, req.params.id], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Error al eliminar ausencia' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Ausencia no encontrada' });
    }
    res.json({ message: 'Ausencia eliminada' });
  });
});

router.get('/:id/objetivos', (req, res) => {
  db.all('SELECT * FROM empleados_objetivos WHERE empleado_id = ? ORDER BY fecha_inicio DESC', [req.params.id], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener objetivos' });
    }
    res.json(rows);
  });
});

router.post('/:id/objetivos', (req, res) => {
  const { titulo, descripcion, objetivo, logrado, fecha_inicio, fecha_fin } = req.body;
  if (!titulo) {
    return res.status(400).json({ error: 'Título requerido' });
  }
  db.run(
    `INSERT INTO empleados_objetivos (empleado_id, titulo, descripcion, objetivo, logrado, fecha_inicio, fecha_fin)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
    ,
    [req.params.id, titulo, descripcion || null, objetivo || 0, logrado || 0, fecha_inicio || null, fecha_fin || null],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Error al crear objetivo' });
      }
      res.status(201).json({ id: this.lastID, message: 'Objetivo creado' });
    }
  );
});

router.delete('/:id/objetivos/:objetivoId', (req, res) => {
  db.run('DELETE FROM empleados_objetivos WHERE id = ? AND empleado_id = ?', [req.params.objetivoId, req.params.id], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Error al eliminar objetivo' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Objetivo no encontrado' });
    }
    res.json({ message: 'Objetivo eliminado' });
  });
});

router.get('/:id/notas', (req, res) => {
  db.all('SELECT * FROM empleados_notas WHERE empleado_id = ? ORDER BY fecha DESC', [req.params.id], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener notas' });
    }
    res.json(rows);
  });
});

router.post('/:id/notas', (req, res) => {
  const { nota } = req.body;
  if (!nota) {
    return res.status(400).json({ error: 'Nota requerida' });
  }
  db.run('INSERT INTO empleados_notas (empleado_id, nota) VALUES (?, ?)', [req.params.id, nota], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Error al crear nota' });
    }
    res.status(201).json({ id: this.lastID, message: 'Nota creada' });
  });
});

router.delete('/:id/notas/:notaId', (req, res) => {
  db.run('DELETE FROM empleados_notas WHERE id = ? AND empleado_id = ?', [req.params.notaId, req.params.id], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Error al eliminar nota' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Nota no encontrada' });
    }
    res.json({ message: 'Nota eliminada' });
  });
});

module.exports = router;
