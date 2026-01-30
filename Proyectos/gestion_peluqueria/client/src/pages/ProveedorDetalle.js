import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  TextField,
  Chip,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Stack,
  Divider,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';

function ProveedorDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [proveedor, setProveedor] = useState(null);
  const [pedidos, setPedidos] = useState([]);
  const [formPedido, setFormPedido] = useState({
    fecha_pedido: new Date().toISOString().slice(0, 10),
    producto: '',
    cantidad: 1,
    notas: '',
  });
  const [busquedaPedido, setBusquedaPedido] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');

  useEffect(() => {
    cargarProveedor();
    cargarPedidos();
  }, [id]);

  const cargarProveedor = async () => {
    try {
      const response = await api.get(`/proveedores/${id}`);
      setProveedor(response.data);
    } catch (error) {
      console.error('Error al cargar proveedor:', error);
    }
  };

  const cargarPedidos = async () => {
    try {
      const response = await api.get('/proveedores-pedidos', { params: { proveedor_id: id } });
      setPedidos(response.data);
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
    }
  };

  const registrarPedido = async () => {
    if (!formPedido.producto || !formPedido.cantidad) return;
    try {
      await api.post('/proveedores-pedidos', {
        proveedor_id: id,
        fecha_pedido: `${formPedido.fecha_pedido}T09:00:00`,
        producto: formPedido.producto,
        cantidad: Number(formPedido.cantidad),
        notas: formPedido.notas,
      });
      setFormPedido({
        fecha_pedido: new Date().toISOString().slice(0, 10),
        producto: '',
        cantidad: 1,
        notas: '',
      });
      cargarPedidos();
    } catch (error) {
      console.error('Error al registrar pedido:', error);
    }
  };

  const marcarRecibido = async (pedidoId) => {
    try {
      await api.patch(`/proveedores-pedidos/${pedidoId}/recibir`, {});
      cargarPedidos();
    } catch (error) {
      console.error('Error al marcar recibido:', error);
    }
  };

  const eliminarPedido = async (pedidoId) => {
    if (!window.confirm('¿Eliminar pedido?')) return;
    try {
      await api.delete(`/proveedores-pedidos/${pedidoId}`);
      cargarPedidos();
    } catch (error) {
      console.error('Error al eliminar pedido:', error);
    }
  };

  const pedidosPendientes = useMemo(
    () => pedidos.filter((pedido) => pedido.estado !== 'recibido'),
    [pedidos]
  );

  const ultimoPedido = pedidos[0];
  const totalPedidos = pedidos.length;
  const pedidosRecibidos = pedidos.filter((pedido) => pedido.estado === 'recibido').length;
  const proximoPedido = pedidosPendientes
    .slice()
    .sort((a, b) => new Date(a.fecha_pedido) - new Date(b.fecha_pedido))[0];

  const pedidosFiltrados = useMemo(() => {
    const texto = busquedaPedido.toLowerCase().trim();
    return pedidos.filter((pedido) => {
      const coincideTexto = texto
        ? pedido.producto?.toLowerCase().includes(texto) || (pedido.notas || '').toLowerCase().includes(texto)
        : true;
      const coincideEstado = filtroEstado === 'todos'
        ? true
        : filtroEstado === 'pendientes'
          ? pedido.estado !== 'recibido'
          : pedido.estado === 'recibido';
      return coincideTexto && coincideEstado;
    });
  }, [busquedaPedido, filtroEstado, pedidos]);

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Ficha de proveedor</Typography>
        <Button variant="outlined" onClick={() => navigate('/proveedores')}>
          Volver
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 2 }}>
        {proveedor ? (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6">{proveedor.nombre}</Typography>
              <Typography variant="body2" color="text.secondary">
                {proveedor.contacto || '-'} · {proveedor.telefono || '-'} · {proveedor.email || '-'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {proveedor.direccion || '-'}
              </Typography>
              {proveedor.notas && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {proveedor.notas}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="caption" color="text.secondary">Estado</Typography>
                    <Typography variant="h6">
                      {proveedor.activo ? 'Activo' : 'Inactivo'}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="caption" color="text.secondary">Pedidos pendientes</Typography>
                    <Typography variant="h6">{pedidosPendientes.length}</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="caption" color="text.secondary">Total pedidos</Typography>
                    <Typography variant="h6">{totalPedidos}</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="caption" color="text.secondary">Recibidos</Typography>
                    <Typography variant="h6">{pedidosRecibidos}</Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        ) : (
          <Typography variant="body2" color="text.secondary">Cargando proveedor...</Typography>
        )}
      </Paper>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>Resumen rápido</Typography>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} divider={<Divider flexItem />}> 
          <Box>
            <Typography variant="caption" color="text.secondary">Último pedido</Typography>
            <Typography variant="body1">
              {ultimoPedido ? `${ultimoPedido.fecha_pedido?.slice(0, 10)} · ${ultimoPedido.producto}` : 'Sin pedidos'}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">Próximo pendiente</Typography>
            <Typography variant="body1">
              {proximoPedido ? `${proximoPedido.fecha_pedido?.slice(0, 10)} · ${proximoPedido.producto}` : 'Sin pendientes'}
            </Typography>
          </Box>
        </Stack>
      </Paper>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>Registrar pedido</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="date"
              label="Fecha del pedido"
              value={formPedido.fecha_pedido}
              InputLabelProps={{ shrink: true }}
              onChange={(e) => setFormPedido({ ...formPedido, fecha_pedido: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Producto"
              value={formPedido.producto}
              onChange={(e) => setFormPedido({ ...formPedido, producto: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              type="number"
              label="Cantidad"
              value={formPedido.cantidad}
              onChange={(e) => setFormPedido({ ...formPedido, cantidad: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={8}>
            <TextField
              fullWidth
              label="Notas"
              value={formPedido.notas}
              onChange={(e) => setFormPedido({ ...formPedido, notas: e.target.value })}
              multiline
              rows={2}
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" onClick={registrarPedido} disabled={!formPedido.producto || !formPedido.cantidad}>
              Guardar pedido
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Box display="flex" flexWrap="wrap" gap={2} alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h6">Historial de pedidos</Typography>
          <Box display="flex" gap={1} flexWrap="wrap">
            <TextField
              size="small"
              label="Buscar producto o nota"
              value={busquedaPedido}
              onChange={(e) => setBusquedaPedido(e.target.value)}
            />
            <TextField
              size="small"
              select
              label="Estado"
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              SelectProps={{ native: true }}
            >
              <option value="todos">Todos</option>
              <option value="pendientes">Pendientes</option>
              <option value="recibidos">Recibidos</option>
            </TextField>
          </Box>
        </Box>
        {pedidosFiltrados.length === 0 ? (
          <Typography variant="body2" color="text.secondary">Sin pedidos registrados.</Typography>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Fecha pedido</TableCell>
                <TableCell>Producto</TableCell>
                <TableCell>Cantidad</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Fecha llegada</TableCell>
                <TableCell>Notas</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pedidosFiltrados.map((pedido) => (
                <TableRow key={pedido.id} sx={{ backgroundColor: pedido.estado !== 'recibido' ? 'rgba(255, 243, 224, 0.6)' : 'inherit' }}>
                  <TableCell>{pedido.fecha_pedido?.slice(0, 10)}</TableCell>
                  <TableCell>{pedido.producto}</TableCell>
                  <TableCell>{pedido.cantidad}</TableCell>
                  <TableCell>
                    <Chip
                      label={pedido.estado}
                      color={pedido.estado === 'recibido' ? 'success' : 'warning'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{pedido.fecha_entrega ? pedido.fecha_entrega.slice(0, 10) : '-'}</TableCell>
                  <TableCell>{pedido.notas || '-'}</TableCell>
                  <TableCell align="right">
                    {pedido.estado !== 'recibido' && (
                      <Button size="small" onClick={() => marcarRecibido(pedido.id)}>
                        Marcar recibido
                      </Button>
                    )}
                    <IconButton size="small" onClick={() => eliminarPedido(pedido.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>
    </Box>
  );
}

export default ProveedorDetalle;
