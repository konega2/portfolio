import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  TextField,
  MenuItem,
  Card,
  CardContent,
  Divider,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import { AddShoppingCart, PointOfSale } from '@mui/icons-material';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, isBefore, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';
import api from '../api';

const metodosPago = ['efectivo', 'tarjeta', 'bizum', 'transferencia'];

function CajaPos() {
  const [cajaHoy, setCajaHoy] = useState(null);
  const [servicios, setServicios] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [metodoPago, setMetodoPago] = useState('efectivo');
  const [propina, setPropina] = useState(0);
  const [efectivoRecibido, setEfectivoRecibido] = useState(0);
  const [itemLibre, setItemLibre] = useState({ nombre: '', precio: 0 });
  const [busqueda, setBusqueda] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('servicios');
  const [fechaCitas, setFechaCitas] = useState(new Date().toISOString().split('T')[0]);
  const [fechaCalendario, setFechaCalendario] = useState(new Date());
  const [citasMes, setCitasMes] = useState([]);
  const [citaSeleccionadaId, setCitaSeleccionadaId] = useState('');
  const [citaActiva, setCitaActiva] = useState(null);
  const [dialogoCitasAbierto, setDialogoCitasAbierto] = useState(false);
  const [clienteMostradorId, setClienteMostradorId] = useState(null);

  useEffect(() => {
    cargarCajaHoy();
    cargarServicios();
    asegurarClienteMostrador();
  }, []);

  useEffect(() => {
    cargarCitasMes(fechaCalendario);
  }, [fechaCalendario]);

  const cargarCajaHoy = async () => {
    try {
      const response = await api.get('/caja');
      const caja = response.data.find((c) => c.estado === 'abierta');
      setCajaHoy(caja || null);
    } catch (error) {
      console.error('Error al cargar caja hoy:', error);
    }
  };

  const cargarServicios = async () => {
    try {
      const response = await api.get('/servicios', { params: { activo: 'true' } });
      setServicios(response.data);
    } catch (error) {
      console.error('Error al cargar servicios:', error);
    }
  };

  const asegurarClienteMostrador = async () => {
    try {
      const response = await api.get('/clientes', { params: { busqueda: 'Mostrador' } });
      const existente = response.data.find((cliente) => cliente.nombre === 'Venta' && cliente.apellidos === 'Mostrador');
      if (existente) {
        setClienteMostradorId(existente.id);
        return;
      }
      const creado = await api.post('/clientes', {
        nombre: 'Venta',
        apellidos: 'Mostrador',
        telefono: '',
        email: '',
        notas: 'Cliente genérico para ventas libres en POS',
      });
      setClienteMostradorId(creado.data.id);
    } catch (error) {
      console.error('Error al asegurar cliente mostrador:', error);
    }
  };

  const cargarCitasMes = async (fecha) => {
    try {
      const inicio = startOfMonth(fecha);
      const fin = endOfMonth(fecha);
      const response = await api.get('/citas', { params: { fecha_inicio: inicio.toISOString(), fecha_fin: fin.toISOString() } });
      setCitasMes(response.data || []);
    } catch (error) {
      console.error('Error al cargar citas del mes:', error);
      setCitasMes([]);
    }
  };

  const categoriasDisponibles = Array.from(
    new Set(servicios.map((servicio) => servicio.categoria).filter(Boolean))
  );

  const serviciosFiltrados = servicios.filter((servicio) => {
    const coincideNombre = servicio.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria = filtroCategoria ? servicio.categoria === filtroCategoria : true;
    return coincideNombre && coincideCategoria;
  });

  const total = useMemo(() => carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0), [carrito]);
  const totalConPropina = total + Number(propina || 0);
  const cambio = metodoPago === 'efectivo' ? Math.max(Number(efectivoRecibido || 0) - totalConPropina, 0) : 0;
  const cantidadesInvalidas = carrito.some((item) => !Number.isFinite(item.cantidad) || item.cantidad < 1);

  const agregarServicio = (servicio) => {
    setCarrito((prev) => {
      const existente = prev.find((item) => item.id === servicio.id && item.tipo === 'servicio');
      if (existente) {
        return prev.map((item) => item.id === servicio.id && item.tipo === 'servicio'
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
        );
      }
      return [...prev, { id: servicio.id, tipo: 'servicio', nombre: servicio.nombre, precio: servicio.precio, cantidad: 1 }];
    });
    setCitaActiva(null);
    setCitaSeleccionadaId('');
  };

  const agregarItemLibre = () => {
    if (!itemLibre.nombre || Number(itemLibre.precio) <= 0) return;
    setCarrito((prev) => [
      ...prev,
      { id: Date.now(), tipo: 'libre', nombre: itemLibre.nombre, precio: Number(itemLibre.precio), cantidad: 1 },
    ]);
    setItemLibre({ nombre: '', precio: 0 });
  };

  const actualizarCantidad = (id, tipo, cantidad) => {
    const cantidadNumero = Number(cantidad);
    setCarrito((prev) => prev.map((item) => (
      item.id === id && item.tipo === tipo
        ? { ...item, cantidad: Number.isNaN(cantidadNumero) ? 0 : cantidadNumero }
        : item
    )));
  };

  const eliminarItem = (id, tipo) => {
    setCarrito((prev) => prev.filter((item) => !(item.id === id && item.tipo === tipo)));
  };

  const seleccionarCita = (cita) => {
    if (!cita) return;
    const precio = cita.precio ?? cita.servicio_precio ?? 0;
    const servicioNombre = cita.servicio_nombre || 'Servicio de cita';
    setCarrito([
      { id: `cita-${cita.id}`, tipo: 'cita', nombre: servicioNombre, precio: Number(precio), cantidad: 1 },
    ]);
    setCitaActiva(cita);
    setCitaSeleccionadaId(String(cita.id));
    setDialogoCitasAbierto(false);
  };

  const limpiarCitaActiva = () => {
    setCitaActiva(null);
    setCitaSeleccionadaId('');
  };

  const diasDelMes = eachDayOfInterval({
    start: startOfMonth(fechaCalendario),
    end: endOfMonth(fechaCalendario),
  });

  const diaSeleccionado = new Date(`${fechaCitas}T00:00:00`);

  const citasDelDiaSeleccionado = citasMes.filter((cita) => (
    isSameDay(new Date(cita.fecha_hora), diaSeleccionado)
  ));

  const cambiarMes = (direccion) => {
    const nuevaFecha = new Date(fechaCalendario);
    nuevaFecha.setMonth(nuevaFecha.getMonth() + direccion);
    setFechaCalendario(nuevaFecha);
  };

  const seleccionarDiaCalendario = (dia) => {
    setFechaCitas(format(dia, 'yyyy-MM-dd'));
    setCitaSeleccionadaId('');
  };

  const cobrar = async () => {
    if (!cajaHoy) return;
    if (carrito.length === 0) return;
    try {
      const ahora = new Date();
      const horaActual = ahora.toTimeString().slice(0, 8);
      const fechaVenta = `${cajaHoy.fecha} ${horaActual}`;
      const descripcionItems = carrito.map((i) => `${i.nombre} x${i.cantidad}`).join(', ');
      const notas = citaActiva
        ? `Cita #${citaActiva.id} - ${citaActiva.cliente_nombre} ${citaActiva.cliente_apellidos}`
        : `Venta POS: ${descripcionItems}`;
      const clienteIdVenta = citaActiva?.cliente_id || clienteMostradorId;
      if (!clienteIdVenta) {
        console.error('No hay cliente asignado para la venta');
        return;
      }
      await api.post('/caja-movimientos', {
        caja_id: cajaHoy.id,
        tipo: 'ingreso',
        metodo_pago: metodoPago,
        monto: total,
        propina: Number(propina || 0),
        efectivo_recibido: metodoPago === 'efectivo' ? Number(efectivoRecibido || 0) : 0,
        cambio: metodoPago === 'efectivo' ? cambio : 0,
        cita_id: citaActiva ? citaActiva.id : null,
        notas,
        usuario_id: null,
      });
      await api.post('/ventas', {
        cita_id: citaActiva ? citaActiva.id : null,
        cliente_id: clienteIdVenta,
        monto: total,
        metodo_pago: metodoPago,
        fecha: fechaVenta,
        empleado_id: null,
      });
      setCarrito([]);
      setPropina(0);
      setEfectivoRecibido(0);
      setCitaActiva(null);
      setCitaSeleccionadaId('');
    } catch (error) {
      console.error('Error al cobrar:', error);
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" gap={1}>
          <PointOfSale color="primary" />
          <Typography variant="h4">Caja registradora</Typography>
        </Box>
        <Button variant="outlined" onClick={() => window.location.href = '/caja'}>
          Volver a caja
        </Button>
      </Box>

      {!cajaHoy && (
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            No hay caja abierta. Ve a "Caja diaria" y abre la caja para empezar a cobrar.
          </Typography>
        </Paper>
      )}

      <Grid container spacing={2}>
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Servicios</Typography>
              <Box display="flex" gap={1} alignItems="center" flexWrap="wrap">
                <TextField
                  size="small"
                  label="Buscar"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
                <TextField
                  size="small"
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
                <TextField
                  size="small"
                  select
                  label="Tipo"
                  value={filtroTipo}
                  onChange={(e) => setFiltroTipo(e.target.value)}
                >
                  <MenuItem value="servicios">Servicios</MenuItem>
                  <MenuItem value="venta-libre">Venta libre</MenuItem>
                </TextField>
                <Button
                  variant="outlined"
                  onClick={() => setDialogoCitasAbierto(true)}
                >
                  Buscar cita
                </Button>
                {citaActiva && (
                  <Chip
                    color="primary"
                    label={`Cita #${citaActiva.id} - ${citaActiva.cliente_nombre}`}
                    onDelete={limpiarCitaActiva}
                  />
                )}
              </Box>
            </Box>

            {filtroTipo === 'servicios' && (
              <Grid container spacing={1}>
                {serviciosFiltrados.map((servicio) => (
                  <Grid item xs={12} sm={6} md={4} key={servicio.id}>
                    <Card variant="outlined" sx={{ cursor: 'pointer' }} onClick={() => agregarServicio(servicio)}>
                      <CardContent>
                        <Typography variant="subtitle1">{servicio.nombre}</Typography>
                        <Typography variant="caption" color="text.secondary">€{Number(servicio.precio).toFixed(2)}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}

            {filtroTipo === 'venta-libre' && (
              <Box>
                <Typography variant="subtitle1" gutterBottom>Venta libre</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Concepto"
                      value={itemLibre.nombre}
                      onChange={(e) => setItemLibre({ ...itemLibre, nombre: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Precio (€)"
                      value={itemLibre.precio}
                      onChange={(e) => setItemLibre({ ...itemLibre, precio: Number(e.target.value) })}
                    />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <Button variant="contained" fullWidth startIcon={<AddShoppingCart />} onClick={agregarItemLibre}>
                      Añadir
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>Ticket</Typography>
            {carrito.length === 0 && (
              <Typography variant="body2" color="text.secondary">Añade servicios o venta libre.</Typography>
            )}
            {carrito.map((item) => (
              <Box key={`${item.tipo}-${item.id}`} display="flex" alignItems="center" gap={1} mb={1}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2">{item.nombre}</Typography>
                  <Typography variant="caption" color="text.secondary">€{Number(item.precio).toFixed(2)}</Typography>
                </Box>
                <TextField
                  size="small"
                  type="number"
                  value={item.cantidad}
                  onChange={(e) => actualizarCantidad(item.id, item.tipo, e.target.value)}
                  inputProps={{ min: 0, style: { width: 60 } }}
                />
                <Chip label={`€${(item.precio * item.cantidad).toFixed(2)}`} size="small" />
                <Button size="small" color="error" onClick={() => eliminarItem(item.id, item.tipo)}>
                  Quitar
                </Button>
              </Box>
            ))}

            <Divider sx={{ my: 2 }} />
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography>Total</Typography>
              <Typography>€{total.toFixed(2)}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography>Propina</Typography>
              <Typography>€{Number(propina || 0).toFixed(2)}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography variant="subtitle1">Total a cobrar</Typography>
              <Typography variant="subtitle1">€{totalConPropina.toFixed(2)}</Typography>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Método de pago"
                  value={metodoPago}
                  onChange={(e) => setMetodoPago(e.target.value)}
                >
                  {metodosPago.map((metodo) => (
                    <MenuItem key={metodo} value={metodo}>
                      {metodo}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Propina (€)"
                  value={propina}
                  onChange={(e) => setPropina(Number(e.target.value))}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Efectivo recibido (€)"
                  value={efectivoRecibido}
                  onChange={(e) => setEfectivoRecibido(Number(e.target.value))}
                  disabled={metodoPago !== 'efectivo'}
                />
              </Grid>
            </Grid>

            <Box display="flex" justifyContent="space-between" mt={2}>
              <Typography variant="body2" color="text.secondary">Cambio</Typography>
              <Typography variant="body2">€{cambio.toFixed(2)}</Typography>
            </Box>

            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
              onClick={cobrar}
              disabled={!cajaHoy || carrito.length === 0 || cantidadesInvalidas}
            >
              Cobrar
            </Button>
          </Paper>
        </Grid>
      </Grid>

      <Dialog
        open={dialogoCitasAbierto}
        onClose={() => setDialogoCitasAbierto(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Buscar cita</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} md={7}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Button onClick={() => cambiarMes(-1)}>← Anterior</Button>
                <Typography variant="subtitle1">
                  {format(fechaCalendario, 'MMMM yyyy', { locale: es }).toUpperCase()}
                </Typography>
                <Button onClick={() => cambiarMes(1)}>Siguiente →</Button>
              </Box>

              <Grid container spacing={1}>
                {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((dia) => (
                  <Grid item xs={12/7} key={dia}>
                    <Typography align="center" fontWeight="bold" color="primary">
                      {dia}
                    </Typography>
                  </Grid>
                ))}

                {diasDelMes.map((dia, index) => {
                  const citasDelDia = citasMes.filter((cita) => isSameDay(new Date(cita.fecha_hora), dia));
                  const esHoy = isToday(dia);
                  const esSeleccionado = isSameDay(dia, diaSeleccionado);
                  const esPasado = isBefore(startOfDay(dia), startOfDay(new Date()));

                  return (
                    <Grid item xs={12/7} key={index}>
                      <Paper
                        elevation={esSeleccionado ? 4 : esHoy ? 3 : 1}
                        sx={{
                          p: 1,
                          minHeight: 90,
                          backgroundColor: esSeleccionado
                            ? 'secondary.light'
                            : esHoy
                              ? 'primary.light'
                              : esPasado
                                ? 'grey.200'
                                : 'background.paper',
                          border: esSeleccionado ? 2 : esPasado ? 0 : 1,
                          borderColor: esSeleccionado ? 'secondary.main' : esPasado ? 'transparent' : 'primary.light',
                          cursor: 'pointer',
                          opacity: esPasado && !esHoy && !esSeleccionado ? 0.6 : 1,
                        }}
                        onClick={() => seleccionarDiaCalendario(dia)}
                      >
                        <Typography
                          variant="body2"
                          fontWeight={esHoy || esSeleccionado ? 'bold' : 'normal'}
                          color={esHoy || esSeleccionado ? 'white' : esPasado ? 'text.secondary' : 'text.primary'}
                        >
                          {format(dia, 'd')}
                        </Typography>
                        <Box mt={1}>
                          {citasDelDia.slice(0, 3).map((cita) => (
                            <Typography
                              key={cita.id}
                              variant="caption"
                              display="block"
                              sx={{
                                fontSize: '0.7rem',
                                backgroundColor: 'secondary.light',
                                color: 'white',
                                p: 0.3,
                                mb: 0.3,
                                borderRadius: 1,
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {format(new Date(cita.fecha_hora), 'HH:mm')} {cita.cliente_nombre}
                            </Typography>
                          ))}
                          {citasDelDia.length > 3 && (
                            <Typography variant="caption" color={esHoy || esSeleccionado ? 'white' : 'text.secondary'}>
                              +{citasDelDia.length - 3} más
                            </Typography>
                          )}
                        </Box>
                      </Paper>
                    </Grid>
                  );
                })}
              </Grid>
            </Grid>

            <Grid item xs={12} md={5}>
              <Typography variant="subtitle1" gutterBottom>
                Citas del {format(diaSeleccionado, 'dd/MM/yyyy')}
              </Typography>
              {citasDelDiaSeleccionado.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  No hay citas para esta fecha.
                </Typography>
              )}
              {citasDelDiaSeleccionado.length > 0 && (
                <List dense>
                  {citasDelDiaSeleccionado.map((cita) => (
                    <ListItemButton
                      key={cita.id}
                      selected={String(cita.id) === String(citaSeleccionadaId)}
                      onClick={() => seleccionarCita(cita)}
                    >
                      <ListItemText
                        primary={`${new Date(cita.fecha_hora).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} - ${cita.cliente_nombre} ${cita.cliente_apellidos}`}
                        secondary={`${cita.servicio_nombre} · €${Number(cita.servicio_precio ?? cita.precio ?? 0).toFixed(2)}`}
                      />
                    </ListItemButton>
                  ))}
                </List>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogoCitasAbierto(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default CajaPos;
