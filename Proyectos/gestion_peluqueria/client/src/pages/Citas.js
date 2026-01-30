import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
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
  TextField,
  MenuItem,
  Chip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import api from '../api';

function Citas() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [citas, setCitas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [citaActual, setCitaActual] = useState(null);
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [formData, setFormData] = useState({
    cliente_id: '',
    servicio_id: '',
    empleado_id: '',
    fecha_hora: '',
    duracion: 45,
    notas: '',
    estado: 'pendiente',
  });

  useEffect(() => {
    cargarDatos();
    cargarUsuarioActual();
  }, []);

  const cargarUsuarioActual = () => {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    setUsuarioActual(usuario);
  };

  const cargarDatos = async () => {
    try {
      const [citasRes, clientesRes, serviciosRes] = await Promise.all([
        api.get('/citas'),
        api.get('/clientes'),
        api.get('/servicios', { params: { activo: 'true' } }),
      ]);
      setCitas(citasRes.data);
      setClientes(clientesRes.data);
      setServicios(serviciosRes.data);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    }
  };

  const handleOpenDialog = (cita = null) => {
    if (cita) {
      setCitaActual(cita);
      setFormData({
        cliente_id: cita.cliente_id,
        servicio_id: cita.servicio_id,
        empleado_id: cita.empleado_id,
        fecha_hora: format(new Date(cita.fecha_hora), "yyyy-MM-dd'T'HH:mm"),
        duracion: cita.duracion,
        notas: cita.notas || '',
        estado: cita.estado,
      });
    } else {
      setCitaActual(null);
      const ahora = new Date();
      ahora.setMinutes(0);
      ahora.setSeconds(0);
      setFormData({
        cliente_id: '',
        servicio_id: '',
        empleado_id: usuarioActual?.id || 2,
        fecha_hora: format(ahora, "yyyy-MM-dd'T'HH:mm"),
        duracion: 45,
        notas: '',
        estado: 'pendiente',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCitaActual(null);
  };

  const handleSubmit = async () => {
    try {
      const servicioSeleccionado = servicios.find(s => s.id === formData.servicio_id);
      const dataToSend = {
        ...formData,
        precio: servicioSeleccionado?.precio || 0,
      };

      if (citaActual) {
        await api.put(`/citas/${citaActual.id}`, dataToSend);
      } else {
        await api.post('/citas', dataToSend);
      }
      handleCloseDialog();
      cargarDatos();
    } catch (error) {
      console.error('Error al guardar cita:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta cita?')) {
      try {
        await api.delete(`/citas/${id}`);
        cargarDatos();
      } catch (error) {
        console.error('Error al eliminar cita:', error);
      }
    }
  };

  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      await api.patch(`/citas/${id}/estado`, { estado: nuevoEstado });
      cargarDatos();
    } catch (error) {
      console.error('Error al cambiar estado:', error);
    }
  };

  const getEstadoColor = (estado) => {
    const colores = {
      pendiente: 'warning',
      confirmada: 'info',
      completada: 'success',
      cancelada: 'error',
    };
    return colores[estado] || 'default';
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Citas</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nueva Cita
        </Button>
      </Box>

      {isMobile ? (
        <Box display="flex" flexDirection="column" gap={2}>
          {citas.map((cita) => (
            <Paper key={cita.id} sx={{ p: 2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {format(new Date(cita.fecha_hora), 'dd/MM/yyyy HH:mm', { locale: es })}
                </Typography>
                <Chip label={cita.estado} color={getEstadoColor(cita.estado)} size="small" />
              </Box>
              <Box display="grid" gap={0.5} mb={1.5}>
                <Typography variant="body2" color="text.secondary">
                  Cliente: {cita.cliente_nombre} {cita.cliente_apellidos}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Teléfono: {cita.cliente_telefono || '-'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Servicio: {cita.servicio_nombre}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Empleado: {cita.empleado_nombre}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="flex-end" gap={1}>
                {cita.estado === 'pendiente' && (
                  <>
                    <IconButton
                      size="small"
                      color="success"
                      onClick={() => cambiarEstado(cita.id, 'completada')}
                    >
                      <CheckIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => cambiarEstado(cita.id, 'cancelada')}
                    >
                      <CancelIcon />
                    </IconButton>
                  </>
                )}
                <IconButton size="small" onClick={() => handleOpenDialog(cita)}>
                  <EditIcon />
                </IconButton>
                <IconButton size="small" onClick={() => handleDelete(cita.id)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Paper>
          ))}
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Fecha y Hora</TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell>Servicio</TableCell>
                <TableCell>Empleado</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {citas.map((cita) => (
                <TableRow key={cita.id}>
                  <TableCell>
                    {format(new Date(cita.fecha_hora), "dd/MM/yyyy HH:mm", { locale: es })}
                  </TableCell>
                  <TableCell>
                    {cita.cliente_nombre} {cita.cliente_apellidos}
                    <br />
                    <Typography variant="caption">{cita.cliente_telefono}</Typography>
                  </TableCell>
                  <TableCell>{cita.servicio_nombre}</TableCell>
                  <TableCell>{cita.empleado_nombre}</TableCell>
                  <TableCell>
                    <Chip
                      label={cita.estado}
                      color={getEstadoColor(cita.estado)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    {cita.estado === 'pendiente' && (
                      <>
                        <IconButton
                          size="small"
                          color="success"
                          onClick={() => cambiarEstado(cita.id, 'completada')}
                        >
                          <CheckIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => cambiarEstado(cita.id, 'cancelada')}
                        >
                          <CancelIcon />
                        </IconButton>
                      </>
                    )}
                    <IconButton size="small" onClick={() => handleOpenDialog(cita)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(cita.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {citaActual ? 'Editar Cita' : 'Nueva Cita'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Cliente"
                value={formData.cliente_id}
                onChange={(e) => setFormData({ ...formData, cliente_id: e.target.value })}
                required
              >
                {clientes.map((cliente) => (
                  <MenuItem key={cliente.id} value={cliente.id}>
                    {cliente.nombre} {cliente.apellidos} - {cliente.telefono}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Servicio"
                value={formData.servicio_id}
                onChange={(e) => {
                  const servicio = servicios.find(s => s.id === e.target.value);
                  setFormData({
                    ...formData,
                    servicio_id: e.target.value,
                    duracion: servicio?.duracion || 45,
                  });
                }}
                required
              >
                {servicios.map((servicio) => (
                  <MenuItem key={servicio.id} value={servicio.id}>
                    {servicio.nombre} - €{servicio.precio} ({servicio.duracion} min)
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="datetime-local"
                label="Fecha y Hora"
                value={formData.fecha_hora}
                onChange={(e) => setFormData({ ...formData, fecha_hora: e.target.value })}
                InputLabelProps={{ shrink: true }}
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
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Estado"
                value={formData.estado}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
              >
                <MenuItem value="pendiente">Pendiente</MenuItem>
                <MenuItem value="confirmada">Confirmada</MenuItem>
                <MenuItem value="completada">Completada</MenuItem>
                <MenuItem value="cancelada">Cancelada</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notas"
                multiline
                rows={3}
                value={formData.notas}
                onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Citas;
