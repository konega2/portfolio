import React, { useEffect, useMemo, useState } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  Chip,
  Stack,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { format } from 'date-fns';
import api from '../api';
import CajaRetiroDialog from '../components/CajaRetiroDialog';

function Caja() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [cajas, setCajas] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openRetiro, setOpenRetiro] = useState(false);
  const [movimientos, setMovimientos] = useState([]);
  const [formData, setFormData] = useState({
    fecha: format(new Date(), 'yyyy-MM-dd'),
    apertura: 0,
    cierre: 0,
    notas: '',
  });
  const [formRetiro, setFormRetiro] = useState({
    monto: 0,
    metodo_pago: 'efectivo',
    notas: '',
  });

  useEffect(() => {
    cargarCajas();
  }, []);

  const cargarCajas = async () => {
    try {
      const response = await api.get('/caja');
      setCajas(response.data);
    } catch (error) {
      console.error('Error al cargar caja diaria:', error);
    }
  };


  const cargarMovimientos = async (cajaId) => {
    try {
      const response = await api.get('/caja-movimientos', { params: { caja_id: cajaId } });
      setMovimientos(response.data);
    } catch (error) {
      console.error('Error al cargar movimientos:', error);
    }
  };

  const abrirDialog = () => {
    setOpenDialog(true);
  };

  const cerrarDialog = () => {
    setOpenDialog(false);
  };

  const guardarCaja = async () => {
    try {
      await api.post('/caja', { ...formData, estado: 'cerrada' });
      cerrarDialog();
      cargarCajas();
    } catch (error) {
      console.error('Error al guardar caja diaria:', error);
    }
  };

  const cajaSeleccionada = useMemo(() => cajas.find((caja) => caja.fecha === formData.fecha), [cajas, formData.fecha]);
  const cajaAbierta = useMemo(() => cajas.find((caja) => caja.estado === 'abierta'), [cajas]);

  const abrirCajaHoy = () => {
    setOpenDialog(true);
  };

  const cerrarCaja = async (cajaId) => {
    try {
      await api.patch(`/caja/${cajaId}/cerrar`, { cierre: cajaSeleccionada?.cierre ?? 0 });
      cargarCajas();
    } catch (error) {
      console.error('Error al cerrar caja:', error);
    }
  };

  const abrirCaja = async (cajaId) => {
    try {
      await api.patch(`/caja/${cajaId}/abrir`);
      cargarCajas();
    } catch (error) {
      console.error('Error al abrir caja:', error);
    }
  };


  const iniciarRetiro = async () => {
    if (!cajaAbierta) {
      setOpenDialog(true);
      return;
    }
    setFormRetiro({ monto: 0, metodo_pago: 'efectivo', notas: '' });
    setOpenRetiro(true);
  };

  const registrarRetiro = async () => {
    if (!cajaAbierta) return;
    try {
      await api.post('/caja-movimientos', {
        caja_id: cajaAbierta.id,
        tipo: 'retiro',
        metodo_pago: formRetiro.metodo_pago,
        monto: formRetiro.monto,
        notas: formRetiro.notas || 'Retiro de caja',
        usuario_id: null,
      });
      setOpenRetiro(false);
      cargarMovimientos(cajaAbierta.id);
    } catch (error) {
      console.error('Error al registrar retiro:', error);
    }
  };

  useEffect(() => {
    if (cajaAbierta) {
      cargarMovimientos(cajaAbierta.id);
    }
  }, [cajaAbierta]);

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={1}>
        <Typography variant="h4">Caja diaria</Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Button variant="outlined" onClick={abrirCajaHoy}>Abrir caja</Button>
          {cajaAbierta && (
            <Button variant="contained" color="warning" onClick={() => cerrarCaja(cajaAbierta.id)}>
              Cerrar caja
            </Button>
          )}
          <Button variant="contained" color="error" onClick={iniciarRetiro}>Retiro</Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => window.location.href = '/caja/pos'}
            disabled={!cajaAbierta}
          >
            Caja registradora
          </Button>
        </Stack>
      </Box>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Caja actual
        </Typography>
        {cajaAbierta ? (
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
            <Chip label={`Fecha: ${cajaAbierta.fecha}`} />
            <Chip label={`Apertura: €${Number(cajaAbierta.apertura).toFixed(2)}`} color="info" />
            <Chip label={`Cierre: €${Number(cajaAbierta.cierre).toFixed(2)}`} color="success" />
            <Chip label={`Estado: ${cajaAbierta.estado || 'abierta'}`} color={cajaAbierta.estado === 'cerrada' ? 'default' : 'primary'} />
          </Stack>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No hay caja abierta. Usa “Abrir caja” para activar la caja registradora.
          </Typography>
        )}
      </Paper>

      {isMobile ? (
        <Box display="flex" flexDirection="column" gap={2}>
          {cajas.map((caja) => (
            <Paper key={caja.id} sx={{ p: 2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {caja.fecha}
                </Typography>
                <Chip label={caja.estado || 'abierta'} size="small" color={caja.estado === 'cerrada' ? 'default' : 'primary'} />
              </Box>
              <Box display="grid" gap={0.5} mb={1.5}>
                <Typography variant="body2" color="text.secondary">
                  Apertura: €{Number(caja.apertura).toFixed(2)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Cierre: €{Number(caja.cierre).toFixed(2)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Notas: {caja.notas || '-'}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="flex-end">
                {caja.estado === 'cerrada' ? (
                  <Button size="small" onClick={() => abrirCaja(caja.id)}>Abrir</Button>
                ) : (
                  <Button size="small" color="warning" onClick={() => cerrarCaja(caja.id)}>
                    Cerrar
                  </Button>
                )}
              </Box>
            </Paper>
          ))}

          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Movimientos de caja
            </Typography>
            <Box display="flex" flexDirection="column" gap={1.5}>
              {movimientos.map((mov) => (
                <Paper key={mov.id} variant="outlined" sx={{ p: 1.5 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {mov.tipo}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      €{Number(mov.monto).toFixed(2)}
                    </Typography>
                  </Box>
                  <Box display="grid" gap={0.25}>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(mov.fecha).toLocaleString('es-ES')}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Método: {mov.metodo_pago || '-'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Propina: €{Number(mov.propina || 0).toFixed(2)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Cliente: {mov.cliente_nombre ? `${mov.cliente_nombre} ${mov.cliente_apellidos || ''}` : '-'}
                    </Typography>
                  </Box>
                </Paper>
              ))}
            </Box>
          </Paper>
        </Box>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Apertura</TableCell>
                  <TableCell>Cierre</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Notas</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cajas.map((caja) => (
                  <TableRow key={caja.id}>
                    <TableCell>{caja.fecha}</TableCell>
                    <TableCell>€{Number(caja.apertura).toFixed(2)}</TableCell>
                    <TableCell>€{Number(caja.cierre).toFixed(2)}</TableCell>
                    <TableCell>
                      <Chip label={caja.estado || 'abierta'} size="small" color={caja.estado === 'cerrada' ? 'default' : 'primary'} />
                    </TableCell>
                    <TableCell>{caja.notas || '-'}</TableCell>
                    <TableCell>
                      {caja.estado === 'cerrada' ? (
                        <Button size="small" onClick={() => abrirCaja(caja.id)}>Abrir</Button>
                      ) : (
                        <Button size="small" color="warning" onClick={() => cerrarCaja(caja.id)}>
                          Cerrar
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Paper sx={{ p: 2, mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Movimientos de caja
            </Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Método</TableCell>
                  <TableCell>Monto</TableCell>
                  <TableCell>Propina</TableCell>
                  <TableCell>Cliente</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {movimientos.map((mov) => (
                  <TableRow key={mov.id}>
                    <TableCell>{new Date(mov.fecha).toLocaleString('es-ES')}</TableCell>
                    <TableCell>{mov.tipo}</TableCell>
                    <TableCell>{mov.metodo_pago || '-'}</TableCell>
                    <TableCell>€{Number(mov.monto).toFixed(2)}</TableCell>
                    <TableCell>€{Number(mov.propina || 0).toFixed(2)}</TableCell>
                    <TableCell>
                      {mov.cliente_nombre ? `${mov.cliente_nombre} ${mov.cliente_apellidos || ''}` : '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </>
      )}

      <Dialog open={openDialog} onClose={cerrarDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Nueva caja diaria</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Fecha"
                value={formData.fecha}
                onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Apertura (€)"
                value={formData.apertura}
                onChange={(e) => setFormData({ ...formData, apertura: Number(e.target.value) })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Cierre (€)"
                value={formData.cierre}
                onChange={(e) => setFormData({ ...formData, cierre: Number(e.target.value) })}
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
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={cerrarDialog}>Cancelar</Button>
          <Button onClick={guardarCaja} variant="contained">Guardar</Button>
        </DialogActions>
      </Dialog>

      <CajaRetiroDialog
        open={openRetiro}
        onClose={() => setOpenRetiro(false)}
        formData={formRetiro}
        setFormData={setFormRetiro}
        onSubmit={registrarRetiro}
      />
    </Box>
  );
}

export default Caja;
