import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from '@mui/material';
import { ContentCut } from '@mui/icons-material';
import api from '../api';

function Login({ onLogin }) {
  const isEmbedded = typeof window !== 'undefined' && window.self !== window.top;
  const [formData, setFormData] = useState({
    usuario: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('usuario', JSON.stringify(response.data.usuario));
      onLogin();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <ContentCut sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
          <Typography component="h1" variant="h4" gutterBottom>
            Gestión Peluquería
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Sistema de gestión completo para tu negocio
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="usuario"
              label="Usuario"
              name="usuario"
              autoComplete="username"
              autoFocus={!isEmbedded}
              value={formData.usuario}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Contraseña"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </Box>

          <Box sx={{ mt: 3, width: '100%' }}>
            <Typography variant="body2" color="text.secondary" align="center">
              <strong>Usuarios de prueba:</strong>
            </Typography>
            <Typography variant="caption" display="block" align="center" sx={{ mt: 1 }}>
              Admin: <strong>admin</strong> / <strong>admin123</strong>
            </Typography>
            <Typography variant="caption" display="block" align="center">
              Empleado: <strong>empleado1</strong> / <strong>empleado123</strong>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default Login;
