import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
} from '@mui/material';
import {
  TrendingUp,
  People,
  Event,
  AttachMoney,
  Schedule,
} from '@mui/icons-material';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../api';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const COLORS = ['#9c27b0', '#ff4081', '#00bcd4', '#4caf50', '#ff9800'];

function Dashboard() {
  const [stats, setStats] = useState({});
  const [ventasDiarias, setVentasDiarias] = useState([]);
  const [serviciosPopulares, setServiciosPopulares] = useState([]);
  const [proximasCitas, setProximasCitas] = useState([]);
  const [metodosPago, setMetodosPago] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [statsRes, ventasRes, serviciosRes, citasRes, pagosRes] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/dashboard/ventas-diarias'),
        api.get('/dashboard/servicios-populares'),
        api.get('/dashboard/proximas-citas'),
        api.get('/dashboard/metodos-pago'),
      ]);

      setStats(statsRes.data);
      setVentasDiarias(ventasRes.data);
      setServiciosPopulares(serviciosRes.data);
      setProximasCitas(citasRes.data);
      setMetodosPago(pagosRes.data);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Typography>Cargando...</Typography>;
  }

  const StatCard = ({ title, value, icon, color }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography color="textSecondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h4" component="div">
              {value}
            </Typography>
          </Box>
          <Box sx={{ color: color, fontSize: 40 }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Ventas Hoy"
            value={`€${stats.ventasHoy?.toFixed(2) || '0.00'}`}
            icon={<AttachMoney />}
            color="#4caf50"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Ventas del Mes"
            value={`€${stats.ventasMes?.toFixed(2) || '0.00'}`}
            icon={<TrendingUp />}
            color="#2196f3"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Gastos del Mes"
            value={`€${stats.gastosMes?.toFixed(2) || '0.00'}`}
            icon={<AttachMoney />}
            color="#f57c00"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Citas Hoy"
            value={stats.citasHoy || 0}
            icon={<Event />}
            color="#9c27b0"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Beneficio Mes"
            value={`€${stats.beneficioMes?.toFixed(2) || '0.00'}`}
            icon={<TrendingUp />}
            color="#4caf50"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Clientes"
            value={stats.totalClientes || 0}
            icon={<People />}
            color="#ff9800"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Ventas Últimos 30 Días
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={ventasDiarias}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="fecha"
                  tickFormatter={(fecha) => format(new Date(fecha), 'dd/MM', { locale: es })}
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(fecha) => format(new Date(fecha), 'dd MMMM', { locale: es })}
                  formatter={(value) => [`€${value.toFixed(2)}`, 'Total']}
                />
                <Legend />
                <Line type="monotone" dataKey="total" stroke="#9c27b0" name="Ventas" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Métodos de Pago
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={metodosPago}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => entry.metodo_pago}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="total"
                >
                  {metodosPago.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `€${value.toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Servicios Más Populares
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={serviciosPopulares.slice(0, 5)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nombre" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="cantidad" fill="#9c27b0" name="Cantidad" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Próximas Citas
            </Typography>
            <List>
              {proximasCitas.slice(0, 6).map((cita, index) => (
                <React.Fragment key={cita.id}>
                  <ListItem>
                    <Schedule sx={{ mr: 2, color: 'primary.main' }} />
                    <ListItemText
                      primary={`${cita.cliente_nombre} ${cita.cliente_apellidos || ''}`}
                      secondary={
                        <>
                          <Typography component="span" variant="body2" color="text.primary">
                            {cita.servicio_nombre}
                          </Typography>
                          {' — '}
                          {format(new Date(cita.fecha_hora), "dd/MM/yyyy HH:mm", { locale: es })}
                          {' — '}
                          {cita.empleado_nombre}
                        </>
                      }
                    />
                    <Chip label={cita.estado} size="small" color="primary" />
                  </ListItem>
                  {index < proximasCitas.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;
