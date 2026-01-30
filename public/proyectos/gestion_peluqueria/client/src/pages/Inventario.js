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
  Chip,
  Alert,
  Stack,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon } from '@mui/icons-material';
import api from '../api';

const categorias = ['Cabello', 'Color', 'Styling', 'Tratamiento', 'Accesorios', 'Higiene'];

function Inventario() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [filtroProveedor, setFiltroProveedor] = useState('');
  const [cantidadUso, setCantidadUso] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [productoActual, setProductoActual] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    categoria: '',
    stock: 0,
    stock_minimo: 0,
    costo: 0,
    precio: 0,
    proveedor: '',
    activo: 1,
  });

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const response = await api.get('/inventario/productos');
      setProductos(response.data);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    }
  };

  const handleOpenDialog = (producto = null) => {
    if (producto) {
      setProductoActual(producto);
      setFormData(producto);
    } else {
      setProductoActual(null);
      setFormData({
        nombre: '',
        categoria: '',
        stock: 0,
        stock_minimo: 0,
        costo: 0,
        precio: 0,
        proveedor: '',
        activo: 1,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setProductoActual(null);
  };

  const handleSubmit = async () => {
    try {
      if (productoActual) {
        await api.put(`/inventario/productos/${productoActual.id}`, formData);
      } else {
        await api.post('/inventario/productos', formData);
      }
      handleCloseDialog();
      cargarProductos();
    } catch (error) {
      console.error('Error al guardar producto:', error);
    }
  };

  const getStockColor = (producto) => {
    if (producto.stock <= producto.stock_minimo) return 'error';
    if (producto.stock <= producto.stock_minimo + 2) return 'warning';
    return 'success';
  };

  const handleGastar = async (producto) => {
    const cantidad = Number(cantidadUso[producto.id] || 1);
    if (Number.isNaN(cantidad) || cantidad <= 0) {
      return;
    }
    try {
      await api.post('/inventario/movimientos', {
        producto_id: producto.id,
        tipo: 'salida',
        cantidad,
        notas: 'Salida rápida desde inventario',
        usuario_id: null,
      });
      setCantidadUso((prev) => ({ ...prev, [producto.id]: 1 }));
      cargarProductos();
    } catch (error) {
      console.error('Error al gastar producto:', error);
    }
  };

  const handleAñadir = async (producto) => {
    const cantidad = Number(cantidadUso[producto.id] || 1);
    if (Number.isNaN(cantidad) || cantidad <= 0) {
      return;
    }
    try {
      await api.post('/inventario/movimientos', {
        producto_id: producto.id,
        tipo: 'entrada',
        cantidad,
        notas: 'Entrada rápida desde inventario',
        usuario_id: null,
      });
      setCantidadUso((prev) => ({ ...prev, [producto.id]: 1 }));
      cargarProductos();
    } catch (error) {
      console.error('Error al añadir producto:', error);
    }
  };

  const categoriasDisponibles = Array.from(
    new Set(productos.map((producto) => producto.categoria).filter(Boolean))
  );
  const proveedoresDisponibles = Array.from(
    new Set(productos.map((producto) => producto.proveedor).filter(Boolean))
  );

  const productosFiltrados = productos.filter((producto) => {
    const coincideNombre = producto.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria = filtroCategoria ? producto.categoria === filtroCategoria : true;
    const coincideProveedor = filtroProveedor ? producto.proveedor === filtroProveedor : true;
    return coincideNombre && coincideCategoria && coincideProveedor;
  });

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Inventario</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
          Nuevo Producto
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Buscar producto por nombre"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              select
              label="Categoría"
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
            >
              <MenuItem value="">Todas</MenuItem>
              {categoriasDisponibles.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              select
              label="Proveedor"
              value={filtroProveedor}
              onChange={(e) => setFiltroProveedor(e.target.value)}
            >
              <MenuItem value="">Todos</MenuItem>
              {proveedoresDisponibles.map((prov) => (
                <MenuItem key={prov} value={prov}>
                  {prov}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      <Stack spacing={1} sx={{ mb: 2 }}>
        {productosFiltrados.some((producto) => producto.stock === 0) && (
          <Alert severity="error">
            Hay productos sin stock. Revisa el inventario.
          </Alert>
        )}
        {productosFiltrados.some((producto) => producto.stock > 0 && producto.stock <= 3) && (
          <Alert severity="warning">
            Algunos productos tienen poco stock (2/3 unidades).
          </Alert>
        )}
      </Stack>

      {isMobile ? (
        <Box display="flex" flexDirection="column" gap={2}>
          {productosFiltrados.map((producto) => (
            <Paper key={producto.id} sx={{ p: 2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {producto.nombre}
                </Typography>
                <Chip label={producto.stock} color={getStockColor(producto)} size="small" />
              </Box>
              <Box display="flex" gap={1} flexWrap="wrap" mb={1}>
                <Chip label={producto.categoria || 'Sin categoría'} size="small" />
                <Chip label={producto.activo ? 'Activo' : 'Inactivo'} color={producto.activo ? 'success' : 'default'} size="small" />
                {producto.stock === 0 && (
                  <Chip label="Sin stock" color="error" size="small" />
                )}
                {producto.stock > 0 && producto.stock <= 3 && (
                  <Chip label="Poco stock" color="warning" size="small" />
                )}
              </Box>
              <Box display="grid" gap={0.5} mb={1.5}>
                <Typography variant="body2" color="text.secondary">
                  Stock mínimo: {producto.stock_minimo}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Proveedor: {producto.proveedor || '-'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Costo €{Number(producto.costo).toFixed(2)} · Precio €{Number(producto.precio).toFixed(2)}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <TextField
                  size="small"
                  type="number"
                  value={cantidadUso[producto.id] ?? 1}
                  onChange={(e) => setCantidadUso((prev) => ({
                    ...prev,
                    [producto.id]: Number(e.target.value),
                  }))}
                  inputProps={{ min: 1, style: { width: 80 } }}
                />
                <Button variant="outlined" size="small" onClick={() => handleGastar(producto)}>
                  Gastar
                </Button>
                <Button variant="contained" size="small" onClick={() => handleAñadir(producto)}>
                  Añadir
                </Button>
              </Box>
              <Box display="flex" justifyContent="flex-end">
                <IconButton size="small" onClick={() => handleOpenDialog(producto)}>
                  <EditIcon />
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
                <TableCell>Producto</TableCell>
                <TableCell>Categoría</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Stock Mínimo</TableCell>
                <TableCell>Proveedor</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Gastar</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productosFiltrados.map((producto) => (
                <TableRow key={producto.id}>
                  <TableCell>
                    <Typography variant="body1">{producto.nombre}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Costo €{Number(producto.costo).toFixed(2)} · Precio €{Number(producto.precio).toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={producto.categoria || 'Sin categoría'} size="small" />
                  </TableCell>
                  <TableCell>
                    <Chip label={producto.stock} color={getStockColor(producto)} size="small" />
                    {producto.stock === 0 && (
                      <Chip label="Sin stock" color="error" size="small" sx={{ ml: 1 }} />
                    )}
                    {producto.stock > 0 && producto.stock <= 3 && (
                      <Chip label="Poco stock" color="warning" size="small" sx={{ ml: 1 }} />
                    )}
                  </TableCell>
                  <TableCell>{producto.stock_minimo}</TableCell>
                  <TableCell>{producto.proveedor || '-'}</TableCell>
                  <TableCell>
                    <Chip label={producto.activo ? 'Activo' : 'Inactivo'} color={producto.activo ? 'success' : 'default'} size="small" />
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <TextField
                        size="small"
                        type="number"
                        value={cantidadUso[producto.id] ?? 1}
                        onChange={(e) => setCantidadUso((prev) => ({
                          ...prev,
                          [producto.id]: Number(e.target.value),
                        }))}
                        inputProps={{ min: 1, style: { width: 60 } }}
                      />
                      <Button variant="outlined" size="small" onClick={() => handleGastar(producto)}>
                        Gastar
                      </Button>
                      <Button variant="contained" size="small" onClick={() => handleAñadir(producto)}>
                        Añadir
                      </Button>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => handleOpenDialog(producto)}>
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{productoActual ? 'Editar Producto' : 'Nuevo Producto'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
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
                label="Stock"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Stock mínimo"
                value={formData.stock_minimo}
                onChange={(e) => setFormData({ ...formData, stock_minimo: Number(e.target.value) })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Costo (€)"
                value={formData.costo}
                onChange={(e) => setFormData({ ...formData, costo: Number(e.target.value) })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Precio (€)"
                value={formData.precio}
                onChange={(e) => setFormData({ ...formData, precio: Number(e.target.value) })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Proveedor"
                value={formData.proveedor}
                onChange={(e) => setFormData({ ...formData, proveedor: e.target.value })}
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
                <MenuItem value={1}>Activo</MenuItem>
                <MenuItem value={0}>Inactivo</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">Guardar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Inventario;
