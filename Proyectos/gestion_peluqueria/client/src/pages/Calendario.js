import React, { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  IconButton,
  Chip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, isBefore, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Today as TodayIcon } from '@mui/icons-material';

function Calendario() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [fechaActual, setFechaActual] = useState(new Date());
  const [citas, setCitas] = useState([]);
  const [eventos, setEventos] = useState([]);
  const navigate = useNavigate();

  const cargarCitas = useCallback(async () => {
    try {
      const inicio = startOfMonth(fechaActual);
      const fin = endOfMonth(fechaActual);
      
      const response = await api.get('/citas', {
        params: {
          fecha_inicio: inicio.toISOString(),
          fecha_fin: fin.toISOString(),
        },
      });
      setCitas(response.data);
    } catch (error) {
      console.error('Error al cargar citas:', error);
    }
  }, [fechaActual]);

  const cargarEventos = useCallback(async () => {
    try {
      const inicio = startOfMonth(fechaActual);
      const fin = endOfMonth(fechaActual);
      const response = await api.get('/eventos', {
        params: {
          fecha_inicio: inicio.toISOString(),
          fecha_fin: fin.toISOString(),
        },
      });
      setEventos(response.data);
    } catch (error) {
      console.error('Error al cargar eventos:', error);
    }
  }, [fechaActual]);

  useEffect(() => {
    cargarCitas();
    cargarEventos();
  }, [cargarCitas, cargarEventos]);

  const diasDelMes = eachDayOfInterval({
    start: startOfMonth(fechaActual),
    end: endOfMonth(fechaActual),
  });

  const getCitasDelDia = (dia) => {
    return citas.filter(cita => isSameDay(new Date(cita.fecha_hora), dia));
  };

  const getEventosDelDia = (dia) => {
    return eventos.filter(evento => isSameDay(new Date(evento.fecha_inicio), dia));
  };

  const cambiarMes = (direccion) => {
    const nuevaFecha = new Date(fechaActual);
    nuevaFecha.setMonth(nuevaFecha.getMonth() + direccion);
    setFechaActual(nuevaFecha);
  };

  const irHoy = () => {
    setFechaActual(new Date());
  };

  const entrarDia = (dia) => {
    const fecha = format(dia, 'yyyy-MM-dd');
    navigate(`/calendario/dia/${fecha}`);
  };

  return (
    <Box>
      <Paper sx={{ p: { xs: 1.5, sm: 2 }, mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" gap={2} flexWrap="wrap">
          <Box>
            <Typography variant="overline" color="text.secondary">Vista mensual</Typography>
            <Typography variant="h4">Calendario</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <IconButton onClick={() => cambiarMes(-1)}>
              <ChevronLeft />
            </IconButton>
            <Typography variant="subtitle1" sx={{ minWidth: 160, textAlign: 'center', fontWeight: 600 }}>
              {format(fechaActual, 'MMMM yyyy', { locale: es }).toUpperCase()}
            </Typography>
            <IconButton onClick={() => cambiarMes(1)}>
              <ChevronRight />
            </IconButton>
            <Button variant="outlined" size="small" startIcon={<TodayIcon />} onClick={irHoy}>
              Hoy
            </Button>
          </Box>
        </Box>
      </Paper>

      {isMobile ? (
        <Box display="flex" flexDirection="column" gap={1.5}>
          {diasDelMes.map((dia, index) => {
            const citasDelDia = getCitasDelDia(dia);
            const eventosDelDia = getEventosDelDia(dia);
            const esHoy = isToday(dia);
            const esPasado = isBefore(startOfDay(dia), startOfDay(new Date()));

            return (
              <Paper
                key={index}
                variant="outlined"
                sx={{
                  p: 1.5,
                  backgroundColor: esHoy ? 'rgba(124, 58, 237, 0.08)' : 'background.paper',
                  borderColor: esHoy ? 'secondary.main' : 'divider',
                  opacity: esPasado && !esHoy ? 0.7 : 1,
                  cursor: 'pointer',
                }}
                onClick={() => entrarDia(dia)}
              >
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {format(dia, 'EEE dd', { locale: es }).toUpperCase()}
                  </Typography>
                  <Box display="flex" gap={1}>
                    <Chip size="small" label={`${citasDelDia.length} citas`} variant="outlined" />
                    <Chip size="small" label={`${eventosDelDia.length} eventos`} variant="outlined" />
                  </Box>
                </Box>
                <Box mt={1} display="grid" gap={0.5}>
                  {citasDelDia.slice(0, 4).map((cita) => (
                    <Typography
                      key={cita.id}
                      variant="caption"
                      sx={{
                        backgroundColor: 'rgba(124, 58, 237, 0.12)',
                        color: '#4C1D95',
                        px: 0.8,
                        py: 0.4,
                        borderRadius: 1,
                      }}
                    >
                      {format(new Date(cita.fecha_hora), 'HH:mm')} · {cita.cliente_nombre}
                    </Typography>
                  ))}
                  {eventosDelDia.slice(0, 2).map((evento) => (
                    <Typography
                      key={evento.id}
                      variant="caption"
                      sx={{
                        backgroundColor: evento.color || 'rgba(251, 146, 60, 0.2)',
                        color: '#9A3412',
                        px: 0.8,
                        py: 0.4,
                        borderRadius: 1,
                      }}
                    >
                      {evento.todo_dia ? 'Todo el día' : format(new Date(evento.fecha_inicio), 'HH:mm')} · {evento.titulo}
                    </Typography>
                  ))}
                  {citasDelDia.length === 0 && eventosDelDia.length === 0 && (
                    <Typography variant="caption" color="text.secondary">
                      Sin citas ni eventos
                    </Typography>
                  )}
                </Box>
              </Paper>
            );
          })}
        </Box>
      ) : (
        <Paper sx={{ p: { xs: 1.5, sm: 2 }, mb: 3 }}>
          <Grid container spacing={1}>
            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((dia) => (
              <Grid item xs={12/7} key={dia}>
                <Typography align="center" fontWeight="bold" color="text.secondary" variant="caption">
                  {dia}
                </Typography>
              </Grid>
            ))}

            {diasDelMes.map((dia, index) => {
              const citasDelDia = getCitasDelDia(dia);
              const eventosDelDia = getEventosDelDia(dia);
              const esHoy = isToday(dia);
              const esPasado = isBefore(startOfDay(dia), startOfDay(new Date()));

              return (
                <Grid item xs={12/7} key={index}>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 1,
                      minHeight: 110,
                      backgroundColor: esHoy ? 'rgba(124, 58, 237, 0.08)' : esPasado ? 'grey.100' : 'background.paper',
                      borderColor: esHoy ? 'secondary.main' : 'divider',
                      cursor: 'pointer',
                      opacity: esPasado && !esHoy ? 0.65 : 1,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: 'secondary.main',
                        boxShadow: '0 6px 18px rgba(17, 24, 39, 0.08)',
                      },
                    }}
                    onClick={() => entrarDia(dia)}
                  >
                    <Typography
                      variant="body2"
                      fontWeight={esHoy ? 'bold' : 'normal'}
                      color={esPasado ? 'text.secondary' : 'text.primary'}
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
                            backgroundColor: 'rgba(124, 58, 237, 0.12)',
                            color: '#4C1D95',
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
                      {eventosDelDia.slice(0, 2).map((evento) => (
                        <Typography
                          key={evento.id}
                          variant="caption"
                          display="block"
                          sx={{
                            fontSize: '0.7rem',
                            backgroundColor: evento.color || 'rgba(251, 146, 60, 0.2)',
                            color: '#9A3412',
                            p: 0.3,
                            mb: 0.3,
                            borderRadius: 1,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {evento.todo_dia ? 'Todo el día' : format(new Date(evento.fecha_inicio), 'HH:mm')} {evento.titulo}
                        </Typography>
                      ))}
                      {citasDelDia.length > 3 && (
                        <Typography variant="caption" color="text.secondary">
                          +{citasDelDia.length - 3} más
                        </Typography>
                      )}
                    </Box>
                    <Box mt={1} display="flex" justifyContent="space-between" alignItems="center" gap={1}>
                      <Chip
                        size="small"
                        label={`${citasDelDia.length} citas`}
                        variant="outlined"
                      />
                      <Chip
                        size="small"
                        label={`${eventosDelDia.length} eventos`}
                        variant="outlined"
                      />
                    </Box>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </Paper>
      )}
    </Box>
  );
}

export default Calendario;
