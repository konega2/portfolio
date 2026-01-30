const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database');
const router = express.Router();

// Login
router.post('/login', (req, res) => {
  const { usuario, password } = req.body;

  if (!usuario || !password) {
    return res.status(400).json({ error: 'Usuario y contraseña requeridos' });
  }

  db.get('SELECT * FROM usuarios WHERE usuario = ? AND activo = 1', [usuario], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Error en el servidor' });
    }

    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err || !isMatch) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      const token = jwt.sign(
        { id: user.id, usuario: user.usuario, rol: user.rol },
        process.env.JWT_SECRET,
        { expiresIn: '8h' }
      );

      res.json({
        token,
        usuario: {
          id: user.id,
          nombre: user.nombre,
          usuario: user.usuario,
          email: user.email,
          rol: user.rol
        }
      });
    });
  });
});

// Obtener usuario actual
router.get('/me', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    db.get('SELECT id, nombre, email, usuario, rol, telefono FROM usuarios WHERE id = ?', [decoded.id], (err, user) => {
      if (err || !user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      res.json(user);
    });
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
});

module.exports = router;
