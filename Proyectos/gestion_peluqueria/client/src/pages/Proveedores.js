import React, { useEffect, useState } from 'react';
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
  Chip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function Proveedores() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [proveedores, setProveedores] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [proveedorActual, setProveedorActual] = useState(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    contacto: '',
    telefono: '',
    email: '',
    direccion: '',
    notas: '',
    activo: 1,
  });

  useEffect(() => {
    cargarProveedores();
  }, []);

  const cargarProveedores = async () => {
    try {
      const response = await api.get('/proveedores');
      setProveedores(response.data);
    } catch (error) {
      console.error('Error al cargar proveedores:', error);
    }
  };


  const abrirDialogo = (proveedor = null) => {
    if (proveedor) {
      setProveedorActual(proveedor);
      setFormData({
        nombre: proveedor.nombre || '',
        contacto: proveedor.contacto || '',
        telefono: proveedor.telefono || '',
        email: proveedor.email || '',
        direccion: proveedor.direccion || '',
        notas: proveedor.notas || '',
        activo: proveedor.activo ?? 1,
      });
    } else {
      setProveedorActual(null);
      setFormData({
        nombre: '',
        contacto: '',
        telefono: '',
        email: '',
        direccion: '',
        notas: '',
        activo: 1,
      });
    }
    setOpenDialog(true);
  };

  const cerrarDialogo = () => {
    setOpenDialog(false);
    setProveedorActual(null);
  };

  const guardarProveedor = async () => {
    try {
      if (!formData.nombre) return;
      if (proveedorActual) {
        await api.put(`/proveedores/${proveedorActual.id}`, formData);
      } else {
        await api.post('/proveedores', formData);
      }
      cerrarDialogo();
      cargarProveedores();
    } catch (error) {
      console.error('Error al guardar proveedor:', error);
    }
  };

  const eliminarProveedor = async (id) => {
    if (!window.confirm('¿Eliminar proveedor?')) return;
    try {
      await api.delete(`/proveedores/${id}`);
      cargarProveedores();
    } catch (error) {
      console.error('Error al eliminar proveedor:', error);
    }
  };


  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Proveedores</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => abrirDialogo()}>
          Nuevo proveedor
        </Button>
      </Box>

      {isMobile ? (
        <Box display="flex" flexDirection="column" gap={2}>
          {proveedores.map((proveedor) => (
            <Paper
              key={proveedor.id}
              sx={{ p: 2, cursor: 'pointer' }}
              onClick={() => navigate(`/proveedores/${proveedor.id}`)}
            >
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {proveedor.nombre}
                </Typography>
                <Chip
                  label={proveedor.activo ? 'Activo' : 'Inactivo'}
                  color={proveedor.activo ? 'success' : 'default'}
                  size="small"
                />
              </Box>
              <Box display="grid" gap={0.5} mb={1.5}>
                <Typography variant="body2" color="text.secondary">
                  Contacto: {proveedor.contacto || '-'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Teléfono: {proveedor.telefono || '-'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Dirección: {proveedor.direccion || '-'}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="flex-end" gap={1}>
                <IconButton size="small" onClick={(e) => { e.stopPropagation(); abrirDialogo(proveedor); }}>
                  <EditIcon />
                </IconButton>
                <IconButton size="small" onClick={(e) => { e.stopPropagation(); eliminarProveedor(proveedor.id); }}>
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
                <TableCell>Nombre</TableCell>
                <TableCell>Contacto</TableCell>
                <TableCell>Teléfono</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {proveedores.map((proveedor) => (
                <TableRow
                  key={proveedor.id}
                  hover
                  onClick={() => navigate(`/proveedores/${proveedor.id}`)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell>
                    <Typography variant="body1">{proveedor.nombre}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {proveedor.direccion || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell>{proveedor.contacto || '-'}</TableCell>
                  <TableCell>{proveedor.telefono || '-'}</TableCell>
                  <TableCell>
                    <Chip
                      label={proveedor.activo ? 'Activo' : 'Inactivo'}
                      color={proveedor.activo ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); abrirDialogo(proveedor); }}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); eliminarProveedor(proveedor.id); }}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openDialog} onClose={cerrarDialogo} maxWidth="sm" fullWidth>
        <DialogTitle>{proveedorActual ? 'Editar proveedor' : 'Nuevo proveedor'}</DialogTitle>
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
                label="Contacto"
                value={formData.contacto}
                onChange={(e) => setFormData({ ...formData, contacto: e.target.value })}
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
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Dirección"
                value={formData.direccion}
                onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notas"
                multiline
                rows={2}
                value={formData.notas}
                onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Estado"
                value={formData.activo}
                onChange={(e) => setFormData({ ...formData, activo: Number(e.target.value) })}
              >
                <option value={1}>Activo</option>
                <option value={0}>Inactivo</option>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={cerrarDialogo}>Cancelar</Button>
          <Button onClick={guardarProveedor} variant="contained">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Proveedores;
