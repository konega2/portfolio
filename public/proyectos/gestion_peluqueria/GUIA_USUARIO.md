# 📱 Guía de Usuario - Sistema de Gestión para Peluquerías

## 🎯 Introducción

Este sistema te permite gestionar completamente tu peluquería desde cualquier dispositivo (móvil, tablet u ordenador). Incluye gestión de citas, clientes, servicios, y estadísticas en tiempo real.

## 🚀 Instalación

### Requisitos Previos
- Node.js versión 14 o superior ([Descargar aquí](https://nodejs.org/))

### Instalación Automática

**En Linux/Mac:**
```bash
chmod +x install.sh
./install.sh
```

**En Windows:**
```
install.bat
```

### Instalación Manual

```bash
# Instalar dependencias del servidor y cliente
npm run install-all

# O manualmente:
npm install
cd client
npm install
cd ..
```

## ▶️ Iniciar la Aplicación

```bash
npm run dev
```

Esto iniciará:
- **Servidor Backend**: http://localhost:5000
- **Aplicación Frontend**: http://localhost:3000

## 👤 Usuarios de Demostración

El sistema viene con usuarios pre-configurados:

### Administrador
- **Usuario**: `admin`
- **Contraseña**: `admin123`
- **Permisos**: Acceso completo a todas las funciones

### Empleado
- **Usuario**: `empleado1`
- **Contraseña**: `empleado123`
- **Permisos**: Gestión de citas y clientes

## 📚 Funcionalidades Principales

### 1. 📊 Dashboard
Al iniciar sesión verás el panel principal con:
- **Ventas del día y del mes**
- **Número de citas pendientes**
- **Gráficos de ventas últimos 30 días**
- **Servicios más populares**
- **Próximas citas programadas**
- **Métodos de pago utilizados**

### 2. 👥 Gestión de Clientes

**Crear un nuevo cliente:**
1. Click en "Clientes" en el menú lateral
2. Click en "Nuevo Cliente"
3. Completa los datos:
   - Nombre (obligatorio)
   - Apellidos
   - Teléfono
   - Email
   - Notas (alergias, preferencias, etc.)
4. Click en "Guardar"

**Buscar clientes:**
- Usa la barra de búsqueda para encontrar por nombre, apellidos o teléfono

**Ver historial:**
- Click en el icono de reloj junto a un cliente
- Verás todas sus citas anteriores con detalles

**Editar/Eliminar:**
- Click en los iconos de editar o eliminar en cada fila

### 3. ✂️ Gestión de Servicios

**Crear un nuevo servicio:**
1. Click en "Servicios"
2. Click en "Nuevo Servicio"
3. Completa:
   - Nombre del servicio
   - Descripción
   - Precio (€)
   - Duración (minutos)
   - Categoría (Corte, Color, Tratamiento, etc.)
   - Estado (Activo/Inactivo)
4. Click en "Guardar"

**Categorías disponibles:**
- Corte
- Color
- Tratamiento
- Peinado
- Básico
- Estética

### 4. 📅 Gestión de Citas

**Crear una nueva cita:**
1. Click en "Citas"
2. Click en "Nueva Cita"
3. Selecciona:
   - Cliente (si no existe, créalo primero)
   - Servicio (precio y duración se cargan automáticamente)
   - Fecha y hora
   - Duración
   - Estado (Pendiente, Confirmada, Completada, Cancelada)
   - Notas opcionales
4. Click en "Guardar"

**Cambiar estado de cita:**
- ✅ Click en el check verde para marcar como completada
- ❌ Click en la X roja para cancelar

**Estados de citas:**
- 🟡 **Pendiente**: Cita programada
- 🔵 **Confirmada**: Cliente confirmó asistencia
- 🟢 **Completada**: Servicio realizado
- 🔴 **Cancelada**: Cita cancelada

### 5. 📆 Vista de Calendario

- Visualización mensual de todas las citas
- Click en las flechas para navegar entre meses
- El día actual se resalta
- Cada día muestra hasta 3 citas (y cantidad si hay más)

## 📱 Instalar como Aplicación (PWA)

### En Android/iPhone:
1. Abre la aplicación en Chrome o Safari
2. Click en el menú del navegador (⋮ o ⋯)
3. Selecciona "Añadir a pantalla de inicio" o "Instalar app"
4. La app aparecerá en tu escritorio

### En Windows/Mac/Linux:
1. Abre la aplicación en Chrome o Edge
2. Busca el icono de instalación en la barra de direcciones
3. Click en "Instalar"
4. La app se abrirá en una ventana independiente

## 💡 Datos de Demostración

El sistema incluye datos de prueba:
- **15 clientes** ficticios
- **13 servicios** variados con precios
- **Citas** de los últimos 30 días y próximos 14 días
- **Ventas** registradas automáticamente
- **4 empleados** (1 admin + 3 empleados)

## 🔒 Seguridad

- Autenticación por token JWT
- Contraseñas encriptadas con bcrypt
- Sesiones de 8 horas
- Cierre de sesión automático al expirar

## 🛠️ Problemas Comunes

### El servidor no inicia
```bash
# Verifica que el puerto 5000 esté libre
lsof -i :5000  # Linux/Mac
netstat -ano | findstr :5000  # Windows
```

### El cliente no se conecta al servidor
- Verifica que el servidor esté corriendo en el puerto 5000
- El cliente usa proxy automático a http://localhost:5000

### Error al instalar dependencias
```bash
# Limpia cache de npm
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## 📞 Estructura de la Base de Datos

El sistema usa SQLite con las siguientes tablas:
- **usuarios**: Empleados y administradores
- **clientes**: Base de datos de clientes
- **servicios**: Catálogo de servicios
- **citas**: Agenda de citas
- **ventas**: Registro de pagos

Los datos se guardan en `server/peluqueria.db`

## 🎨 Personalización

### Cambiar colores:
Edita `client/src/App.js` en la sección `createTheme`:
```javascript
const theme = createTheme({
  palette: {
    primary: {
      main: '#9c27b0',  // Color principal
    },
    secondary: {
      main: '#ff4081',  // Color secundario
    },
  },
});
```

### Cambiar nombre del negocio:
Edita `client/src/components/Layout.js`:
```javascript
<Typography variant="h6">
  💇 TU NOMBRE AQUÍ
</Typography>
```

## 📊 Exportar Datos

Para hacer backup de la base de datos:
```bash
# Copia el archivo de base de datos
cp server/peluqueria.db backup-$(date +%Y%m%d).db
```

## 🚀 Despliegue en Producción

### Backend
1. Configura variables de entorno en `.env`
2. Cambia `NODE_ENV=production`
3. Usa un servicio como Heroku, Railway o DigitalOcean

### Frontend
```bash
cd client
npm run build
# Los archivos compilados estarán en client/build/
```

## 💻 Comandos Útiles

```bash
# Iniciar en desarrollo
npm run dev

# Solo servidor
npm run server

# Solo cliente
cd client && npm start

# Compilar para producción
cd client && npm run build

# Iniciar servidor en producción
npm start
```

## 📈 Próximas Mejoras

Ideas para expandir el sistema:
- [ ] Recordatorios automáticos por SMS/Email
- [ ] Sistema de puntos/fidelización
- [ ] Integración con pasarelas de pago
- [ ] Gestión de inventario de productos
- [ ] Reportes PDF exportables
- [ ] Sistema de comisiones para empleados
- [ ] Multi-sucursales

---

**¿Necesitas ayuda?** Revisa el código, todos los archivos están comentados y son fáciles de entender. Este es un sistema completamente funcional listo para personalizar y usar en tu negocio.
