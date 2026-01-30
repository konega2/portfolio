const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const db = require('./database');
require('./seedData');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Importar rutas
const authRoutes = require('./routes/auth');
const clientesRoutes = require('./routes/clientes');
const serviciosRoutes = require('./routes/servicios');
const citasRoutes = require('./routes/citas');
const ventasRoutes = require('./routes/ventas');
const dashboardRoutes = require('./routes/dashboard');
const gastosRoutes = require('./routes/gastos');
const eventosRoutes = require('./routes/eventos');
const inventarioRoutes = require('./routes/inventario');
const cajaRoutes = require('./routes/caja');
const cajaMovimientosRoutes = require('./routes/caja_movimientos');
const proveedoresRoutes = require('./routes/proveedores');
const proveedoresEntregasRoutes = require('./routes/proveedores_entregas');
const proveedoresPedidosRoutes = require('./routes/proveedores_pedidos');
const empleadosRoutes = require('./routes/empleados');

// Usar rutas
app.use('/api/auth', authRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/servicios', serviciosRoutes);
app.use('/api/citas', citasRoutes);
app.use('/api/ventas', ventasRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/gastos', gastosRoutes);
app.use('/api/eventos', eventosRoutes);
app.use('/api/inventario', inventarioRoutes);
app.use('/api/caja', cajaRoutes);
app.use('/api/caja-movimientos', cajaMovimientosRoutes);
app.use('/api/proveedores', proveedoresRoutes);
app.use('/api/proveedores-entregas', proveedoresEntregasRoutes);
app.use('/api/proveedores-pedidos', proveedoresPedidosRoutes);
app.use('/api/empleados', empleadosRoutes);

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Servidor funcionando correctamente' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
