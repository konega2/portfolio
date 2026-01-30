import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Chip,
  Divider,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Today as TodayIcon,
  Event as EventIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { format, parseISO, startOfDay, endOfDay, addDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';

const categoriasTipo = [
  { value: 'nota', label: 'Nota' },
  { value: 'tarea', label: 'Tarea' },
  { value: 'bloqueo', label: 'Bloqueo' },
  { value: 'recordatorio', label: 'Recordatorio' },
];

function CalendarioDia() {
  const { fecha } = useParams();
  const navigate = useNavigate();
  const [diaSeleccionado, setDiaSeleccionado] = useState(() => (fecha ? parseISO(fecha) : new Date()));
  const [citas, setCitas] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [openEvento, setOpenEvento] = useState(false);
  const [eventoActual, setEventoActual] = useState(null);
  const [draggingItem, setDraggingItem] = useState(null);
  const [showTrash, setShowTrash] = useState(false);
  const [trashActive, setTrashActive] = useState(false);
  const [formEvento, setFormEvento] = useState({
    titulo: '',
    descripcion: '',
    fecha_inicio: '',
    fecha_fin: '',
    todo_dia: 0,
    tipo: 'nota',
    color: '#ff7043',
  });

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    setUsuarioActual(usuario);
  }, []);

  useEffect(() => {
    if (fecha) {
      setDiaSeleccionado(parseISO(fecha));
    }
  }, [fecha]);

  useEffect(() => {
    cargarDia();
  }, [diaSeleccionado]);

  const cargarDia = async () => {
    try {
      const inicio = startOfDay(diaSeleccionado);
      const fin = endOfDay(diaSeleccionado);
      const [citasRes, eventosRes] = await Promise.all([
        api.get('/citas', {
          params: { fecha_inicio: inicio.toISOString(), fecha_fin: fin.toISOString() },
        }),
        api.get('/eventos', {
          params: { fecha_inicio: inicio.toISOString(), fecha_fin: fin.toISOString() },
        }),
      ]);
      setCitas(citasRes.data);
      setEventos(eventosRes.data);
    } catch (error) {
      console.error('Error al cargar el día:', error);
    }
  };

  const abrirEvento = (evento = null, hora = null) => {
    if (evento) {
      setEventoActual(evento);
      setFormEvento({
        ...evento,
        fecha_inicio: format(new Date(evento.fecha_inicio), "yyyy-MM-dd'T'HH:mm"),
        fecha_fin: evento.fecha_fin ? format(new Date(evento.fecha_fin), "yyyy-MM-dd'T'HH:mm") : '',
      });
    } else {
      const inicio = new Date(diaSeleccionado);
      inicio.setHours(hora ?? 9, 0, 0, 0);
      setEventoActual(null);
      setFormEvento({
        titulo: '',
        descripcion: '',
        fecha_inicio: format(inicio, "yyyy-MM-dd'T'HH:mm"),
        fecha_fin: '',
        todo_dia: 0,
        tipo: 'nota',
        color: '#ff7043',
      });
    }
    setOpenEvento(true);
  };

  const cerrarEvento = () => {
    setOpenEvento(false);
    setEventoActual(null);
  };

  const guardarEvento = async () => {
    try {
      const payload = { ...formEvento, creado_por: usuarioActual?.id || 1 };
      if (eventoActual) {
        await api.put(`/eventos/${eventoActual.id}`, payload);
      } else {
        await api.post('/eventos', payload);
      }
      cerrarEvento();
      cargarDia();
    } catch (error) {
      console.error('Error al guardar evento:', error);
    }
  };

  const eliminarEvento = async (id) => {
    if (window.confirm('¿Eliminar este evento?')) {
      try {
        await api.delete(`/eventos/${id}`);
        cargarDia();
      } catch (error) {
        console.error('Error al eliminar evento:', error);
      }
    }
  };

  const horasDia = useMemo(() => Array.from({ length: 13 }, (_, i) => i + 8), []);

  const iniciarDrag = (item) => {
    setDraggingItem(item);
    setShowTrash(true);
  };

  const finalizarDrag = () => {
    setDraggingItem(null);
    setShowTrash(false);
    setTrashActive(false);
  };

  const moverEventoAHora = async (hora) => {
    if (!draggingItem) {
      return;
    }
    if (draggingItem.tipo !== 'evento') {
      return;
    }
    const fechaNueva = new Date(diaSeleccionado);
    fechaNueva.setHours(hora, draggingItem.minuto || 0, 0, 0);
    try {
      await api.put(`/eventos/${draggingItem.id}`,
        {
          ...draggingItem.original,
          fecha_inicio: fechaNueva.toISOString(),
        }
      );
      cargarDia();
    } catch (error) {
      console.error('Error al mover evento:', error);
    }
  };

  const moverCitaAHora = async (hora) => {
    if (!draggingItem || draggingItem.tipo !== 'cita') {
      return;
    }
    const fechaNueva = new Date(diaSeleccionado);
    fechaNueva.setHours(hora, draggingItem.minuto || 0, 0, 0);
    try {
      const cita = draggingItem.original;
      await api.put(`/citas/${draggingItem.id}`, {
        cliente_id: cita.cliente_id,
        servicio_id: cita.servicio_id,
        empleado_id: cita.empleado_id,
        fecha_hora: fechaNueva.toISOString(),
        duracion: cita.duracion,
        estado: cita.estado,
        notas: cita.notas,
        precio: cita.precio,
      });
      cargarDia();
    } catch (error) {
      console.error('Error al mover cita:', error);
    }
  };

  const { eventosTodoDia, eventosConHora, citasConHora } = useMemo(() => {
    const eventosDelDia = eventos.filter((evento) => format(new Date(evento.fecha_inicio), 'yyyy-MM-dd') === format(diaSeleccionado, 'yyyy-MM-dd'));
    const eventosTodoDia = eventosDelDia.filter((evento) => evento.todo_dia === 1);
    const eventosConHora = eventosDelDia
      .filter((evento) => evento.todo_dia !== 1)
      .map((evento) => {
        const fechaEvento = new Date(evento.fecha_inicio);
        return {
          ...evento,
          hora: fechaEvento.getHours(),
          minuto: fechaEvento.getMinutes(),
        };
      });

    const citasConHora = citas.map((cita) => {
      const fechaCita = new Date(cita.fecha_hora);
      return {
        ...cita,
        hora: fechaCita.getHours(),
        minuto: fechaCita.getMinutes(),
      };
    });

    return { eventosTodoDia, eventosConHora, citasConHora };
  }, [citas, eventos, diaSeleccionado]);

  const cambiarDia = (offset) => {
    const nuevoDia = addDays(diaSeleccionado, offset);
    const ruta = format(nuevoDia, 'yyyy-MM-dd');
    navigate(`/calendario/dia/${ruta}`);
  };

  return (
    <Box>
      <Paper sx={{ p: { xs: 1.5, sm: 2 }, mb: 3 }} elevation={0}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="overline" color="text.secondary">Vista diaria</Typography>
            <Typography variant="h4">
              {format(diaSeleccionado, 'dd MMMM yyyy', { locale: es })}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => cambiarDia(-1)}>
              Anterior
            </Button>
            <Button variant="outlined" startIcon={<TodayIcon />} onClick={() => navigate('/calendario')}>
              Mes
            </Button>
            <Button variant="contained" endIcon={<ArrowForwardIcon />} onClick={() => cambiarDia(1)}>
              Siguiente
            </Button>
          </Box>
        </Box>
        <Box mt={2} display="flex" gap={1} flexWrap="wrap">
          <Chip label={`${citas.length} citas`} variant="outlined" />
          <Chip label={`${eventos.length} eventos`} variant="outlined" />
        </Box>
      </Paper>

      <Paper sx={{ p: 3, mb: 2, borderRadius: 3 }} elevation={1}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <EventIcon color="primary" />
            <Typography variant="h6">Agenda del día</Typography>
          </Box>
          <Button variant="contained" onClick={() => abrirEvento(null, 9)}>
            Añadir evento
          </Button>
        </Box>

        <Typography variant="subtitle1" sx={{ mb: 1 }}>Todo el día</Typography>
        <Paper variant="outlined" sx={{ p: 2, mb: 3, borderRadius: 2, backgroundColor: 'rgba(156, 39, 176, 0.04)' }}>
          {eventosTodoDia.length === 0 && (
            <Typography variant="body2" color="text.secondary">Sin eventos de todo el día.</Typography>
          )}
          {eventosTodoDia.map((evento) => (
            <Chip
              key={`allday-${evento.id}`}
              label={evento.titulo}
              sx={{ mr: 1, mb: 1, backgroundColor: evento.color || '#ff7043', color: 'white', fontWeight: 600 }}
              onClick={() => abrirEvento(evento)}
            />
          ))}
        </Paper>

        <Typography variant="subtitle1" sx={{ mb: 1 }}>Horario por horas</Typography>
        <Box>
          {horasDia.map((hora) => {
            const itemsHora = [
              ...
              citasConHora.filter((cita) => cita.hora === hora).map((cita) => ({
                tipo: 'cita',
                id: cita.id,
                hora: cita.hora,
                minuto: cita.minuto,
                titulo: `${cita.cliente_nombre} ${cita.cliente_apellidos || ''}`,
                detalle: `${cita.servicio_nombre} · ${cita.empleado_nombre}`,
                estado: cita.estado,
                original: cita,
              })),
              ...eventosConHora.filter((evento) => evento.hora === hora).map((evento) => ({
                tipo: 'evento',
                id: evento.id,
                hora: evento.hora,
                minuto: evento.minuto,
                titulo: evento.titulo,
                detalle: evento.descripcion || evento.tipo,
                color: evento.color,
                original: evento,
              })),
            ].sort((a, b) => a.minuto - b.minuto);

            return (
              <Paper
                key={`hora-${hora}`}
                variant="outlined"
                sx={{ p: 2, mb: 2, borderRadius: 2 }}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => {
                  moverEventoAHora(hora);
                  moverCitaAHora(hora);
                }}
              >
                <Box display="flex" gap={2}>
                  <Box sx={{ width: 90 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                      {String(hora).padStart(2, '0')}:00
                    </Typography>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    {itemsHora.length === 0 && (
                      <Typography variant="body2" color="text.secondary">Sin actividades</Typography>
                    )}
                    {itemsHora.map((item) => (
                      <Paper
                        key={`${item.tipo}-${item.id}`}
                        draggable={item.tipo === 'evento' || item.tipo === 'cita'}
                        onDragStart={() => iniciarDrag(item)}
                        onDragEnd={finalizarDrag}
                        sx={{
                          p: 1.5,
                          mb: 1,
                          borderLeft: 5,
                          borderColor: item.tipo === 'cita' ? 'secondary.main' : (item.color || '#ff7043'),
                          borderRadius: 2,
                          backgroundColor: item.tipo === 'cita' ? 'rgba(255, 64, 129, 0.08)' : 'rgba(255, 112, 67, 0.08)'
                        }}
                      >
                        <Box display="flex" justifyContent="space-between" alignItems="center" gap={2}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                            {String(item.hora).padStart(2, '0')}:{String(item.minuto).padStart(2, '0')} · {item.titulo}
                          </Typography>
                          {item.tipo === 'cita' ? (
                            <Chip
                              label={item.estado}
                              size="small"
                              color={item.estado === 'completada' ? 'success' : item.estado === 'cancelada' ? 'error' : 'warning'}
                            />
                          ) : (
                            <Box>
                              <Button size="small" onClick={() => abrirEvento(item.original)}>Editar</Button>
                              <Button size="small" color="error" onClick={() => eliminarEvento(item.id)}>Eliminar</Button>
                            </Box>
                          )}
                        </Box>
                        <Typography variant="body2" color="text.secondary">{item.detalle}</Typography>
                      </Paper>
                    ))}
                    <Button size="small" variant="outlined" onClick={() => abrirEvento(null, hora)}>
                      Añadir evento
                    </Button>
                    <Divider sx={{ mt: 2 }} />
                  </Box>
                </Box>
              </Paper>
            );
          })}
        </Box>
      </Paper>

      <Dialog open={openEvento} onClose={cerrarEvento} maxWidth="sm" fullWidth>
        <DialogTitle>{eventoActual ? 'Editar evento' : 'Nuevo evento'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Título"
                value={formEvento.titulo}
                onChange={(e) => setFormEvento({ ...formEvento, titulo: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descripción"
                multiline
                rows={2}
                value={formEvento.descripcion}
                onChange={(e) => setFormEvento({ ...formEvento, descripcion: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="datetime-local"
                label="Fecha inicio"
                value={formEvento.fecha_inicio}
                onChange={(e) => setFormEvento({ ...formEvento, fecha_inicio: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="datetime-local"
                label="Fecha fin"
                value={formEvento.fecha_fin}
                onChange={(e) => setFormEvento({ ...formEvento, fecha_fin: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Tipo"
                value={formEvento.tipo}
                onChange={(e) => setFormEvento({ ...formEvento, tipo: e.target.value })}
              >
                {categoriasTipo.map((tipo) => (
                  <MenuItem key={tipo.value} value={tipo.value}>
                    {tipo.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="color"
                label="Color"
                value={formEvento.color}
                onChange={(e) => setFormEvento({ ...formEvento, color: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Todo el día"
                value={formEvento.todo_dia}
                onChange={(e) => setFormEvento({ ...formEvento, todo_dia: Number(e.target.value) })}
              >
                <MenuItem value={0}>No</MenuItem>
                <MenuItem value={1}>Sí</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={cerrarEvento}>Cancelar</Button>
          <Button onClick={guardarEvento} variant="contained">Guardar</Button>
        </DialogActions>
      </Dialog>

      {showTrash && (
        <Box
          onDragOver={(event) => {
            event.preventDefault();
            setTrashActive(true);
          }}
          onDragLeave={() => setTrashActive(false)}
          onDrop={async () => {
            if (draggingItem?.tipo === 'evento') {
              await eliminarEvento(draggingItem.id);
            }
            finalizarDrag();
          }}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            width: 120,
            height: 120,
            borderRadius: '50%',
            backgroundColor: trashActive ? 'error.main' : 'grey.800',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: 0.5,
            fontWeight: 700,
            boxShadow: 6,
            zIndex: 1400,
            transition: 'transform 0.2s ease, background-color 0.2s ease',
            transform: trashActive ? 'scale(1.1)' : 'scale(1)'
          }}
        >
          <DeleteIcon
            sx={{
              fontSize: 40,
              transition: 'transform 0.2s ease',
              transform: trashActive ? 'rotate(-12deg) scale(1.15)' : 'rotate(0deg) scale(1)'
            }}
          />
          <Typography variant="caption" sx={{ color: 'white', fontWeight: 700 }}>
            Papelera
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default CalendarioDia;
