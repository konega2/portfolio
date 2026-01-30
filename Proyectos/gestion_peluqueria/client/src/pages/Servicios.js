import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Chip,
  Switch,
  FormControlLabel,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  ContentCut as ContentCutIcon,
} from '@mui/icons-material';
import api from '../api';

const defaultForm = {
  nombre: '',
  descripcion: '',
  precio: '',
  duracion: '',
  categoria: '',
  activo: 1,
};

function Servicios() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [servicios, setServicios] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [servicioActual, setServicioActual] = useState(null);
  const [formData, setFormData] = useState(defaultForm);
  const [soloActivos, setSoloActivos] = useState(true);

  const cargarServicios = useCallback(async () => {
    try {
      const response = await api.get('/servicios', {
        params: soloActivos ? { activo: true } : {},
      });
      const data = response.data || [];
      if (busqueda) {
        const term = busqueda.toLowerCase();
        setServicios(
          data.filter(
            (servicio) =>
              servicio.nombre?.toLowerCase().includes(term) ||
              servicio.categoria?.toLowerCase().includes(term)
          )
        );
      } else {
        setServicios(data);
      }
    } catch (error) {
      console.error('Error al cargar servicios:', error);
    }
  }, [busqueda, soloActivos]);

  useEffect(() => {
    cargarServicios();
  }, [cargarServicios]);

  const categorias = useMemo(() => {
    const set = new Set();
    servicios.forEach((servicio) => {
      if (servicio.categoria) {
        set.add(servicio.categoria);
      }
    });
    return Array.from(set);
  }, [servicios]);

  const handleOpenDialog = (servicio = null) => {
    if (servicio) {
      setServicioActual(servicio);
      setFormData({
        nombre: servicio.nombre || '',
        descripcion: servicio.descripcion || '',
        precio: servicio.precio ?? '',
        duracion: servicio.duracion ?? '',
        categoria: servicio.categoria || '',
        activo: servicio.activo ?? 1,
      });
    } else {
      setServicioActual(null);
      setFormData(defaultForm);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setServicioActual(null);
  };

  const handleSubmit = async () => {
    const payload = {
      ...formData,
      precio: Number(formData.precio),
      duracion: Number(formData.duracion),
      activo: formData.activo ? 1 : 0,
    };

    try {
      if (servicioActual) {
        await api.put(`/servicios/${servicioActual.id}`, payload);
      } else {
        await api.post('/servicios', payload);
      }
      handleCloseDialog();
      cargarServicios();
    } catch (error) {
      console.error('Error al guardar servicio:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este servicio?')) {
      try {
        await api.delete(`/servicios/${id}`);
        cargarServicios();
      } catch (error) {
        console.error('Error al eliminar servicio:', error);
      }
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" gap={1}>
          <ContentCutIcon color="primary" />
          <Typography variant="h4">Servicios</Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nuevo Servicio
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              placeholder="Buscar por nombre o categoría..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={soloActivos}
                  onChange={(e) => setSoloActivos(e.target.checked)}
                  color="primary"
                />
              }
              label="Mostrar solo activos"
            />
          </Grid>
        </Grid>
      </Paper>

      {isMobile ? (
        <Box display="flex" flexDirection="column" gap={2}>
          {servicios.map((servicio) => (
            <Paper key={servicio.id} sx={{ p: 2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {servicio.nombre}
                </Typography>
                <Chip
                  label={servicio.activo ? 'Activo' : 'Inactivo'}
                  color={servicio.activo ? 'success' : 'default'}
                  size="small"
                />
              </Box>
              <Typography variant="body2" color="text.secondary" mb={1}>
                {servicio.descripcion || 'Sin descripción'}
              </Typography>
              <Box display="grid" gap={0.5} mb={1.5}>
                <Typography variant="body2" color="text.secondary">
                  Categoría: {servicio.categoria || 'Sin categoría'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Precio: {Number(servicio.precio).toFixed(2)} €
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Duración: {servicio.duracion} min
                </Typography>
              </Box>
              <Box display="flex" justifyContent="flex-end" gap={1}>
                <IconButton size="small" onClick={() => handleOpenDialog(servicio)}>
                  <EditIcon />
                </IconButton>
                <IconButton size="small" onClick={() => handleDelete(servicio.id)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Paper>
          ))}
          {servicios.length === 0 && (
            <Paper sx={{ p: 2, textAlign: 'center' }}>No hay servicios para mostrar.</Paper>
          )}
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Categoría</TableCell>
                <TableCell>Precio</TableCell>
                <TableCell>Duración (min)</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {servicios.map((servicio) => (
                <TableRow key={servicio.id}>
                  <TableCell>
                    <Typography variant="subtitle2">{servicio.nombre}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {servicio.descripcion}
                    </Typography>
                  </TableCell>
                  <TableCell>{servicio.categoria || 'Sin categoría'}</TableCell>
                  <TableCell>{Number(servicio.precio).toFixed(2)} €</TableCell>
                  <TableCell>{servicio.duracion} min</TableCell>
                  <TableCell>
                    <Chip
                      label={servicio.activo ? 'Activo' : 'Inactivo'}
                      color={servicio.activo ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => handleOpenDialog(servicio)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(servicio.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {servicios.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No hay servicios para mostrar.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {servicioActual ? 'Editar Servicio' : 'Nuevo Servicio'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Categoría"
                value={formData.categoria}
                onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descripción"
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Precio"
                value={formData.precio}
                onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Duración (min)"
                value={formData.duracion}
                onChange={(e) => setFormData({ ...formData, duracion: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={Boolean(formData.activo)}
                    onChange={(e) => setFormData({ ...formData, activo: e.target.checked ? 1 : 0 })}
                    color="primary"
                  />
                }
                label="Servicio activo"
              />
            </Grid>
            {categorias.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary">
                  Categorías existentes: {categorias.join(', ')}
                </Typography>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button variant="contained" onClick={handleSubmit}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Servicios;
