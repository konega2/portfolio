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
  MenuItem,
  Card,
  CardContent,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ReceiptLong as ReceiptIcon,
  AccountBalanceWallet as WalletIcon,
} from '@mui/icons-material';
import api from '../api';
import { format } from 'date-fns';

const categorias = ['Alquiler', 'Suministros', 'Servicios', 'Marketing', 'Productos', 'Mantenimiento', 'Formación', 'Material', 'Limpieza'];
const metodosPago = ['efectivo', 'tarjeta', 'transferencia', 'bizum'];

function Gastos() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [gastos, setGastos] = useState([]);
  const [resumen, setResumen] = useState({ gastosHoy: 0, gastosMes: 0, totalGastos: 0 });
  const [openDialog, setOpenDialog] = useState(false);
  const [gastoActual, setGastoActual] = useState(null);
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [formData, setFormData] = useState({
    concepto: '',
    categoria: '',
    monto: '',
    fecha: '',
    metodo_pago: 'tarjeta',
    proveedor: '',
    notas: '',
    empleado_id: null,
  });

  useEffect(() => {
    cargarUsuarioActual();
    cargarDatos();
  }, []);

  const cargarUsuarioActual = () => {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    setUsuarioActual(usuario);
  };

  const cargarDatos = async () => {
    try {
      const [gastosRes, resumenRes] = await Promise.all([
        api.get('/gastos'),
        api.get('/gastos/resumen'),
      ]);
      setGastos(gastosRes.data);
      setResumen(resumenRes.data);
    } catch (error) {
      console.error('Error al cargar gastos:', error);
    }
  };

  const handleOpenDialog = (gasto = null) => {
    if (gasto) {
      setGastoActual(gasto);
      setFormData({
        ...gasto,
        fecha: gasto.fecha ? format(new Date(gasto.fecha), "yyyy-MM-dd'T'HH:mm") : '',
      });
    } else {
      const ahora = new Date();
      ahora.setSeconds(0);
      setGastoActual(null);
      setFormData({
        concepto: '',
        categoria: '',
        monto: '',
        fecha: format(ahora, "yyyy-MM-dd'T'HH:mm"),
        metodo_pago: 'tarjeta',
        proveedor: '',
        notas: '',
        empleado_id: usuarioActual?.id || 1,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setGastoActual(null);
  };

  const handleSubmit = async () => {
    try {
      if (gastoActual) {
        await api.put(`/gastos/${gastoActual.id}`, formData);
      } else {
        await api.post('/gastos', formData);
      }
      handleCloseDialog();
      cargarDatos();
    } catch (error) {
      console.error('Error al guardar gasto:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este gasto?')) {
      try {
        await api.delete(`/gastos/${id}`);
        cargarDatos();
      } catch (error) {
        console.error('Error al eliminar gasto:', error);
      }
    }
  };

  const StatCard = ({ title, value, icon, color }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography color="textSecondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h5" component="div">
              {value}
            </Typography>
          </Box>
          <Box sx={{ color: color, fontSize: 36 }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Gastos</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
          Nuevo Gasto
        </Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Gastos Hoy"
            value={`€${Number(resumen.gastosHoy || 0).toFixed(2)}`}
            icon={<ReceiptIcon />}
            color="#ff7043"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Gastos Mes"
            value={`€${Number(resumen.gastosMes || 0).toFixed(2)}`}
            icon={<WalletIcon />}
            color="#f57c00"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Total Gastos"
            value={`€${Number(resumen.totalGastos || 0).toFixed(2)}`}
            icon={<WalletIcon />}
            color="#ef6c00"
          />
        </Grid>
      </Grid>

      {isMobile ? (
        <Box display="flex" flexDirection="column" gap={2}>
          {gastos.map((gasto) => (
            <Paper key={gasto.id} sx={{ p: 2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {gasto.concepto}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  €{Number(gasto.monto).toFixed(2)}
                </Typography>
              </Box>
              <Box display="grid" gap={0.5} mb={1.5}>
                <Typography variant="body2" color="text.secondary">
                  Fecha: {new Date(gasto.fecha).toLocaleDateString('es-ES')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Categoría: {gasto.categoria || '-'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Método: {gasto.metodo_pago || '-'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Proveedor: {gasto.proveedor || '-'}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="flex-end" gap={1}>
                <IconButton size="small" onClick={() => handleOpenDialog(gasto)}>
                  <EditIcon />
                </IconButton>
                <IconButton size="small" onClick={() => handleDelete(gasto.id)}>
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
                <TableCell>Fecha</TableCell>
                <TableCell>Concepto</TableCell>
                <TableCell>Categoría</TableCell>
                <TableCell>Monto</TableCell>
                <TableCell>Método</TableCell>
                <TableCell>Proveedor</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {gastos.map((gasto) => (
                <TableRow key={gasto.id}>
                  <TableCell>{new Date(gasto.fecha).toLocaleDateString('es-ES')}</TableCell>
                  <TableCell>{gasto.concepto}</TableCell>
                  <TableCell>{gasto.categoria || '-'}</TableCell>
                  <TableCell>€{Number(gasto.monto).toFixed(2)}</TableCell>
                  <TableCell>{gasto.metodo_pago || '-'}</TableCell>
                  <TableCell>{gasto.proveedor || '-'}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => handleOpenDialog(gasto)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(gasto.id)}>
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
        <DialogTitle>{gastoActual ? 'Editar Gasto' : 'Nuevo Gasto'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Concepto"
                value={formData.concepto}
                onChange={(e) => setFormData({ ...formData, concepto: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Categoría"
                value={formData.categoria}
                onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
              >
                {categorias.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Monto (€)"
                value={formData.monto}
                onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="datetime-local"
                label="Fecha"
                value={formData.fecha}
                onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Método de Pago"
                value={formData.metodo_pago}
                onChange={(e) => setFormData({ ...formData, metodo_pago: e.target.value })}
              >
                {metodosPago.map((metodo) => (
                  <MenuItem key={metodo} value={metodo}>
                    {metodo}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Proveedor"
                value={formData.proveedor}
                onChange={(e) => setFormData({ ...formData, proveedor: e.target.value })}
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
    </Box>
  );
}

export default Gastos;
