import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
  Tabs,
  Tab,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import api from '../api';

function Empleados() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [empleados, setEmpleados] = useState([]);
  const [empleadoActivo, setEmpleadoActivo] = useState(null);
  const [tab, setTab] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [editando, setEditando] = useState(null);
  const [formEmpleado, setFormEmpleado] = useState({
    nombre: '',
    usuario: '',
    email: '',
    telefono: '',
    password: '',
    activo: 1,
  });

  const [fichajes, setFichajes] = useState([]);
  const [ausencias, setAusencias] = useState([]);
  const [objetivos, setObjetivos] = useState([]);
  const [notas, setNotas] = useState([]);

  const [formAusencia, setFormAusencia] = useState({
    fecha_inicio: new Date().toISOString().slice(0, 10),
    fecha_fin: new Date().toISOString().slice(0, 10),
    motivo: '',
    notas: '',
  });
  const [formObjetivo, setFormObjetivo] = useState({
    titulo: '',
    descripcion: '',
    objetivo: 0,
    logrado: 0,
    fecha_inicio: new Date().toISOString().slice(0, 10),
    fecha_fin: new Date().toISOString().slice(0, 10),
  });
  const [formNota, setFormNota] = useState({ nota: '' });

  const seleccionarEmpleado = useCallback((empleado) => {
    setEmpleadoActivo(empleado);
    cargarDetalleEmpleado(empleado.id);
  }, []);

  const cargarEmpleados = useCallback(async () => {
    try {
      const response = await api.get('/empleados');
      setEmpleados(response.data);
      if (!empleadoActivo && response.data.length > 0) {
        seleccionarEmpleado(response.data[0]);
      }
    } catch (error) {
      console.error('Error al cargar empleados:', error);
    }
  }, [empleadoActivo, seleccionarEmpleado]);

  useEffect(() => {
    cargarEmpleados();
  }, [cargarEmpleados]);

  const cargarDetalleEmpleado = async (id) => {
    try {
      const [fichajesRes, ausenciasRes, objetivosRes, notasRes] = await Promise.all([
        api.get(`/empleados/${id}/fichajes`),
        api.get(`/empleados/${id}/ausencias`),
        api.get(`/empleados/${id}/objetivos`),
        api.get(`/empleados/${id}/notas`),
      ]);
      setFichajes(fichajesRes.data);
      setAusencias(ausenciasRes.data);
      setObjetivos(objetivosRes.data);
      setNotas(notasRes.data);
    } catch (error) {
      console.error('Error al cargar detalle de empleado:', error);
    }
  };

  const abrirDialogo = (empleado = null) => {
    if (empleado) {
      setEditando(empleado);
      setFormEmpleado({
        nombre: empleado.nombre || '',
        usuario: empleado.usuario || '',
        email: empleado.email || '',
        telefono: empleado.telefono || '',
        password: '',
        activo: empleado.activo ?? 1,
      });
    } else {
      setEditando(null);
      setFormEmpleado({
        nombre: '',
        usuario: '',
        email: '',
        telefono: '',
        password: '',
        activo: 1,
      });
    }
    setOpenDialog(true);
  };

  const cerrarDialogo = () => {
    setOpenDialog(false);
    setEditando(null);
  };

  const guardarEmpleado = async () => {
    if (!formEmpleado.nombre || (!editando && !formEmpleado.password) || (!editando && !formEmpleado.usuario)) return;
    try {
      if (editando) {
        await api.put(`/empleados/${editando.id}`, formEmpleado);
      } else {
        await api.post('/empleados', formEmpleado);
      }
      cerrarDialogo();
      cargarEmpleados();
    } catch (error) {
      console.error('Error al guardar empleado:', error);
    }
  };

  const eliminarEmpleado = async (empleado) => {
    if (!window.confirm('¿Desactivar empleado?')) return;
    try {
      await api.put(`/empleados/${empleado.id}`, {
        ...empleado,
        activo: 0,
        password: '',
      });
      cargarEmpleados();
    } catch (error) {
      console.error('Error al desactivar empleado:', error);
    }
  };

  const ficharEntrada = async () => {
    if (!empleadoActivo) return;
    await api.post(`/empleados/${empleadoActivo.id}/fichajes/entrada`);
    cargarDetalleEmpleado(empleadoActivo.id);
  };

  const ficharSalida = async () => {
    if (!empleadoActivo) return;
    await api.post(`/empleados/${empleadoActivo.id}/fichajes/salida`);
    cargarDetalleEmpleado(empleadoActivo.id);
  };

  const registrarAusencia = async () => {
    if (!empleadoActivo) return;
    await api.post(`/empleados/${empleadoActivo.id}/ausencias`, formAusencia);
    cargarDetalleEmpleado(empleadoActivo.id);
    setFormAusencia({
      fecha_inicio: new Date().toISOString().slice(0, 10),
      fecha_fin: new Date().toISOString().slice(0, 10),
      motivo: '',
      notas: '',
    });
  };

  const eliminarAusencia = async (ausenciaId) => {
    if (!empleadoActivo) return;
    await api.delete(`/empleados/${empleadoActivo.id}/ausencias/${ausenciaId}`);
    cargarDetalleEmpleado(empleadoActivo.id);
  };

  const registrarObjetivo = async () => {
    if (!empleadoActivo || !formObjetivo.titulo) return;
    await api.post(`/empleados/${empleadoActivo.id}/objetivos`, formObjetivo);
    cargarDetalleEmpleado(empleadoActivo.id);
    setFormObjetivo({
      titulo: '',
      descripcion: '',
      objetivo: 0,
      logrado: 0,
      fecha_inicio: new Date().toISOString().slice(0, 10),
      fecha_fin: new Date().toISOString().slice(0, 10),
    });
  };

  const eliminarObjetivo = async (objetivoId) => {
    if (!empleadoActivo) return;
    await api.delete(`/empleados/${empleadoActivo.id}/objetivos/${objetivoId}`);
    cargarDetalleEmpleado(empleadoActivo.id);
  };

  const registrarNota = async () => {
    if (!empleadoActivo || !formNota.nota) return;
    await api.post(`/empleados/${empleadoActivo.id}/notas`, formNota);
    cargarDetalleEmpleado(empleadoActivo.id);
    setFormNota({ nota: '' });
  };

  const eliminarNota = async (notaId) => {
    if (!empleadoActivo) return;
    await api.delete(`/empleados/${empleadoActivo.id}/notas/${notaId}`);
    cargarDetalleEmpleado(empleadoActivo.id);
  };

  const resumenEmpleado = useMemo(() => {
    if (!empleadoActivo) return null;
    return {
      fichajes: fichajes.length,
      ausencias: ausencias.length,
      objetivos: objetivos.length,
      notas: notas.length,
    };
  }, [empleadoActivo, fichajes, ausencias, objetivos, notas]);

  const fichajeAbierto = useMemo(
    () => fichajes.find((fichaje) => !fichaje.fecha_salida),
    [fichajes]
  );

  const detalleEmpleado = (
    <>
      <Paper sx={{ p: 2, mb: 2 }}>
        {empleadoActivo ? (
          <Box>
            <Typography variant="h6">{empleadoActivo.nombre}</Typography>
            <Typography variant="body2" color="text.secondary">
              {empleadoActivo.email || '-'} · {empleadoActivo.telefono || '-'}
            </Typography>
            {resumenEmpleado && (
              <Box display="flex" gap={1} flexWrap="wrap" mt={2}>
                <Chip label={`Fichajes: ${resumenEmpleado.fichajes}`} />
                <Chip label={`Ausencias: ${resumenEmpleado.ausencias}`} />
                <Chip label={`Objetivos: ${resumenEmpleado.objetivos}`} />
                <Chip label={`Notas: ${resumenEmpleado.notas}`} />
              </Box>
            )}
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">Selecciona un empleado.</Typography>
        )}
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Tabs value={tab} onChange={(_, value) => setTab(value)} variant="scrollable">
          <Tab label="Fichajes" />
          <Tab label="Ausencias" />
          <Tab label="Objetivos" />
          <Tab label="Notas" />
        </Tabs>

            {tab === 0 && (
              <Box mt={2}>
                <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
                  <Button
                    variant="contained"
                    color={fichajeAbierto ? 'warning' : 'primary'}
                    onClick={fichajeAbierto ? ficharSalida : ficharEntrada}
                    disabled={!empleadoActivo}
                  >
                    {fichajeAbierto ? 'Fichar salida' : 'Fichar entrada'}
                  </Button>
                  {fichajeAbierto && (
                    <Chip label={`Entrada abierta: ${fichajeAbierto.fecha_entrada?.slice(0, 16).replace('T', ' ')}`} color="warning" />
                  )}
                </Box>
                <Table size="small" sx={{ mt: 2 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Entrada</TableCell>
                      <TableCell>Salida</TableCell>
                      <TableCell>Minutos</TableCell>
                      <TableCell>Notas</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {fichajes.map((fichaje) => (
                      <TableRow key={fichaje.id}>
                        <TableCell>{fichaje.fecha_entrada?.slice(0, 16).replace('T', ' ')}</TableCell>
                        <TableCell>{fichaje.fecha_salida ? fichaje.fecha_salida.slice(0, 16).replace('T', ' ') : '-'}</TableCell>
                        <TableCell>{fichaje.minutos_trabajados || 0}</TableCell>
                        <TableCell>{fichaje.notas || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            )}

            {tab === 1 && (
              <Box mt={2}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      type="date"
                      label="Desde"
                      value={formAusencia.fecha_inicio}
                      InputLabelProps={{ shrink: true }}
                      onChange={(e) => setFormAusencia({ ...formAusencia, fecha_inicio: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      type="date"
                      label="Hasta"
                      value={formAusencia.fecha_fin}
                      InputLabelProps={{ shrink: true }}
                      onChange={(e) => setFormAusencia({ ...formAusencia, fecha_fin: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      label="Motivo"
                      value={formAusencia.motivo}
                      onChange={(e) => setFormAusencia({ ...formAusencia, motivo: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      label="Notas"
                      value={formAusencia.notas}
                      onChange={(e) => setFormAusencia({ ...formAusencia, notas: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button variant="contained" onClick={registrarAusencia}>Registrar ausencia</Button>
                  </Grid>
                </Grid>
                <Table size="small" sx={{ mt: 2 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Desde</TableCell>
                      <TableCell>Hasta</TableCell>
                      <TableCell>Motivo</TableCell>
                      <TableCell>Notas</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {ausencias.map((ausencia) => (
                      <TableRow key={ausencia.id}>
                        <TableCell>{ausencia.fecha_inicio}</TableCell>
                        <TableCell>{ausencia.fecha_fin}</TableCell>
                        <TableCell>{ausencia.motivo || '-'}</TableCell>
                        <TableCell>{ausencia.notas || '-'}</TableCell>
                        <TableCell align="right">
                          <IconButton size="small" onClick={() => eliminarAusencia(ausencia.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            )}

            {tab === 2 && (
              <Box mt={2}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      label="Título"
                      value={formObjetivo.titulo}
                      onChange={(e) => setFormObjetivo({ ...formObjetivo, titulo: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      label="Descripción"
                      value={formObjetivo.descripcion}
                      onChange={(e) => setFormObjetivo({ ...formObjetivo, descripcion: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={6} md={2}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Objetivo"
                      value={formObjetivo.objetivo}
                      onChange={(e) => setFormObjetivo({ ...formObjetivo, objetivo: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={6} md={2}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Logrado"
                      value={formObjetivo.logrado}
                      onChange={(e) => setFormObjetivo({ ...formObjetivo, logrado: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={6} md={2}>
                    <TextField
                      fullWidth
                      type="date"
                      label="Inicio"
                      value={formObjetivo.fecha_inicio}
                      InputLabelProps={{ shrink: true }}
                      onChange={(e) => setFormObjetivo({ ...formObjetivo, fecha_inicio: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={6} md={2}>
                    <TextField
                      fullWidth
                      type="date"
                      label="Fin"
                      value={formObjetivo.fecha_fin}
                      InputLabelProps={{ shrink: true }}
                      onChange={(e) => setFormObjetivo({ ...formObjetivo, fecha_fin: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button variant="contained" onClick={registrarObjetivo}>Añadir objetivo</Button>
                  </Grid>
                </Grid>
                <Table size="small" sx={{ mt: 2 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Título</TableCell>
                      <TableCell>Objetivo</TableCell>
                      <TableCell>Logrado</TableCell>
                      <TableCell>Periodo</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {objetivos.map((objetivo) => (
                      <TableRow key={objetivo.id}>
                        <TableCell>{objetivo.titulo}</TableCell>
                        <TableCell>{objetivo.objetivo}</TableCell>
                        <TableCell>{objetivo.logrado}</TableCell>
                        <TableCell>
                          {objetivo.fecha_inicio || '-'} → {objetivo.fecha_fin || '-'}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton size="small" onClick={() => eliminarObjetivo(objetivo.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            )}

            {tab === 3 && (
              <Box mt={2}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={10}>
                    <TextField
                      fullWidth
                      label="Nota"
                      value={formNota.nota}
                      onChange={(e) => setFormNota({ nota: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <Button variant="contained" fullWidth onClick={registrarNota}>Añadir</Button>
                  </Grid>
                </Grid>
                <Table size="small" sx={{ mt: 2 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Fecha</TableCell>
                      <TableCell>Nota</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {notas.map((nota) => (
                      <TableRow key={nota.id}>
                        <TableCell>{nota.fecha?.slice(0, 10)}</TableCell>
                        <TableCell>{nota.nota}</TableCell>
                        <TableCell align="right">
                          <IconButton size="small" onClick={() => eliminarNota(nota.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            )}
      </Paper>
    </>
  );

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Empleados</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => abrirDialogo()}>
          Nuevo empleado
        </Button>
      </Box>

      {isMobile ? (
        <Box display="flex" flexDirection="column" gap={2}>
          {empleados.map((empleado) => (
            <Paper
              key={empleado.id}
              sx={{ p: 2, cursor: 'pointer' }}
              onClick={() => seleccionarEmpleado(empleado)}
            >
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {empleado.nombre}
                </Typography>
                <Chip label={empleado.activo ? 'Activo' : 'Inactivo'} color={empleado.activo ? 'success' : 'default'} size="small" />
              </Box>
              <Typography variant="body2" color="text.secondary" mb={1}>
                {empleado.usuario}
              </Typography>
              <Box display="flex" justifyContent="flex-end" gap={1}>
                <IconButton size="small" onClick={(e) => { e.stopPropagation(); abrirDialogo(empleado); }}>
                  <EditIcon />
                </IconButton>
                <IconButton size="small" onClick={(e) => { e.stopPropagation(); eliminarEmpleado(empleado); }}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Paper>
          ))}

          {detalleEmpleado}
        </Box>
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Empleado</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell align="right">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {empleados.map((empleado) => (
                    <TableRow
                      key={empleado.id}
                      hover
                      selected={empleadoActivo?.id === empleado.id}
                      onClick={() => seleccionarEmpleado(empleado)}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell>
                        <Typography variant="body1">{empleado.nombre}</Typography>
                        <Typography variant="caption" color="text.secondary">{empleado.usuario}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={empleado.activo ? 'Activo' : 'Inactivo'} color={empleado.activo ? 'success' : 'default'} size="small" />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small" onClick={(e) => { e.stopPropagation(); abrirDialogo(empleado); }}>
                          <EditIcon />
                        </IconButton>
                        <IconButton size="small" onClick={(e) => { e.stopPropagation(); eliminarEmpleado(empleado); }}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Grid item xs={12} md={8}>
            {detalleEmpleado}
          </Grid>
        </Grid>
      )}

      <Dialog open={openDialog} onClose={cerrarDialogo} maxWidth="sm" fullWidth>
        <DialogTitle>{editando ? 'Editar empleado' : 'Nuevo empleado'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nombre"
                value={formEmpleado.nombre}
                onChange={(e) => setFormEmpleado({ ...formEmpleado, nombre: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Usuario"
                value={formEmpleado.usuario}
                onChange={(e) => setFormEmpleado({ ...formEmpleado, usuario: e.target.value })}
                required={!editando}
                disabled={Boolean(editando)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                value={formEmpleado.email}
                onChange={(e) => setFormEmpleado({ ...formEmpleado, email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Teléfono"
                value={formEmpleado.telefono}
                onChange={(e) => setFormEmpleado({ ...formEmpleado, telefono: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Contraseña"
                type="password"
                value={formEmpleado.password}
                onChange={(e) => setFormEmpleado({ ...formEmpleado, password: e.target.value })}
                required={!editando}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Estado"
                value={formEmpleado.activo}
                onChange={(e) => setFormEmpleado({ ...formEmpleado, activo: Number(e.target.value) })}
                SelectProps={{ native: true }}
              >
                <option value={1}>Activo</option>
                <option value={0}>Inactivo</option>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={cerrarDialogo}>Cancelar</Button>
          <Button onClick={guardarEmpleado} variant="contained">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Empleados;
