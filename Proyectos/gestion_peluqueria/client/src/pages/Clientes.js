import React, { useCallback, useEffect, useState } from 'react';
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
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import api from '../api';

function Clientes() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [clientes, setClientes] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openHistorial, setOpenHistorial] = useState(false);
  const [clienteActual, setClienteActual] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    telefono: '',
    email: '',
    notas: '',
  });

  const cargarClientes = useCallback(async () => {
    try {
      const response = await api.get('/clientes', {
        params: busqueda ? { busqueda } : {},
      });
      setClientes(response.data);
    } catch (error) {
      console.error('Error al cargar clientes:', error);
    }
  }, [busqueda]);

  useEffect(() => {
    cargarClientes();
  }, [cargarClientes]);

  const handleOpenDialog = (cliente = null) => {
    if (cliente) {
      setClienteActual(cliente);
      setFormData(cliente);
    } else {
      setClienteActual(null);
      setFormData({
        nombre: '',
        apellidos: '',
        telefono: '',
        email: '',
        notas: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setClienteActual(null);
  };

  const handleSubmit = async () => {
    try {
      if (clienteActual) {
        await api.put(`/clientes/${clienteActual.id}`, formData);
      } else {
        await api.post('/clientes', formData);
      }
      handleCloseDialog();
      cargarClientes();
    } catch (error) {
      console.error('Error al guardar cliente:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este cliente?')) {
      try {
        await api.delete(`/clientes/${id}`);
        cargarClientes();
      } catch (error) {
        console.error('Error al eliminar cliente:', error);
      }
    }
  };

  const verHistorial = async (cliente) => {
    try {
      const response = await api.get(`/clientes/${cliente.id}/historial`);
      setHistorial(response.data);
      setClienteActual(cliente);
      setOpenHistorial(true);
    } catch (error) {
      console.error('Error al cargar historial:', error);
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Clientes</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nuevo Cliente
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Buscar por nombre, apellidos o teléfono..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
        />
      </Paper>

      {isMobile ? (
        <Box display="flex" flexDirection="column" gap={2}>
          {clientes.map((cliente) => (
            <Paper key={cliente.id} sx={{ p: 2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {cliente.nombre} {cliente.apellidos}
                </Typography>
                <Chip label="Cliente" size="small" />
              </Box>
              <Box display="grid" gap={0.5} mb={1.5}>
                <Typography variant="body2" color="text.secondary">
                  Teléfono: {cliente.telefono || '-'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Email: {cliente.email || '-'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Notas: {cliente.notas?.substring(0, 80) || '-'}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Button size="small" onClick={() => verHistorial(cliente)} startIcon={<HistoryIcon />}>
                  Historial
                </Button>
                <Box>
                  <IconButton size="small" onClick={() => handleOpenDialog(cliente)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDelete(cliente.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Teléfono</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Notas</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clientes.map((cliente) => (
                <TableRow key={cliente.id}>
                  <TableCell>
                    {cliente.nombre} {cliente.apellidos}
                  </TableCell>
                  <TableCell>{cliente.telefono}</TableCell>
                  <TableCell>{cliente.email}</TableCell>
                  <TableCell>{cliente.notas?.substring(0, 50)}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => verHistorial(cliente)}>
                      <HistoryIcon />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleOpenDialog(cliente)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(cliente.id)}>
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
          {clienteActual ? 'Editar Cliente' : 'Nuevo Cliente'}
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
                label="Apellidos"
                value={formData.apellidos}
                onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Teléfono"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
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

      <Dialog open={openHistorial} onClose={() => setOpenHistorial(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Historial de {clienteActual?.nombre} {clienteActual?.apellidos}
        </DialogTitle>
        <DialogContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Fecha</TableCell>
                <TableCell>Servicio</TableCell>
                <TableCell>Empleado</TableCell>
                <TableCell>Precio</TableCell>
                <TableCell>Estado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {historial.map((cita) => (
                <TableRow key={cita.id}>
                  <TableCell>
                    {new Date(cita.fecha_hora).toLocaleDateString('es-ES')}
                  </TableCell>
                  <TableCell>{cita.servicio}</TableCell>
                  <TableCell>{cita.empleado}</TableCell>
                  <TableCell>€{cita.precio}</TableCell>
                  <TableCell>
                    <Chip label={cita.estado} size="small" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenHistorial(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Clientes;
