# 💇‍♀️ Sistema de Gestión para Peluquerías

Sistema **completo y funcional** de gestión para peluquerías con datos de demostración. Progressive Web App (PWA) que funciona en móviles, tablets y ordenadores.

## ✨ Características Principales

- ✅ **Dashboard Interactivo**: Estadísticas en tiempo real con gráficos
- 👥 **Gestión de Clientes**: Base de datos completa con historial de visitas
- ✂️ **Catálogo de Servicios**: Precios, duraciones y categorías personalizables
- 📅 **Gestión de Citas**: Agenda completa con estados y notificaciones
- 📆 **Calendario Visual**: Vista mensual de todas las citas
- 💰 **Control de Ventas**: Registro automático con diferentes métodos de pago
- 🔐 **Sistema de Autenticación**: Login seguro con JWT y roles
- 📱 **PWA**: Instalable como app nativa en cualquier dispositivo
- 🎨 **Diseño Responsive**: Adaptado a móviles, tablets y ordenadores
- 🚀 **Datos Demo**: 15 clientes, 13 servicios, 100+ citas pre-cargadas

## ⚡ Inicio Rápido

### Opción 1: Script Automático (Recomendado)

**Linux/Mac:**
```bash
./start.sh
```

**Windows:**
```bash
start.bat
```

### Opción 2: Manual

```bash
# Instalar dependencias
npm install && cd client && npm install && cd ..

# Iniciar aplicación
npm run dev
```

Abre http://localhost:3000 en tu navegador.

## 🔑 Acceso al Sistema

### Administrador
- **Usuario**: `admin`
- **Contraseña**: `admin123`
- **Permisos**: Acceso completo

### Empleado
- **Usuario**: `empleado1`
- **Contraseña**: `empleado123`
- **Permisos**: Gestión de citas y clientes

## 📚 Documentación

- 📖 **[INICIO_RAPIDO.md](INICIO_RAPIDO.md)** - Guía de inicio rápido
- 📖 **[GUIA_USUARIO.md](GUIA_USUARIO.md)** - Manual completo de usuario
- 📖 **[RESUMEN_PROYECTO.txt](RESUMEN_PROYECTO.txt)** - Resumen visual del proyecto

## 🛠️ Tecnologías

### Backend
- Node.js + Express
- SQLite (base de datos)
- JWT (autenticación)
- bcryptjs (encriptación)

### Frontend
- React 18
- Material-UI 5
- React Router 6
- Recharts (gráficos)
- Axios (API client)
- date-fns (fechas)

## 📦 Estructura del Proyecto

```
gestion_peluqueria/
├── server/              # Backend API REST
│   ├── routes/          # Endpoints
│   ├── middleware/      # Autenticación
│   ├── database.js      # Configuración BD
│   └── seedData.js      # Datos demo
├── client/              # Frontend React
│   ├── src/
│   │   ├── pages/       # Páginas
│   │   └── components/  # Componentes
│   └── public/          # Assets y PWA
└── docs/                # Documentación
```

## 📱 Instalar como App

### Android/iPhone
1. Abrir en Chrome/Safari
2. Menú → "Añadir a pantalla de inicio"
3. ¡Listo!

### Windows/Mac/Linux
1. Abrir en Chrome/Edge
2. Click en icono de instalación (barra de direcciones)
3. Click "Instalar"

## 🎯 Funcionalidades Detalladas

### Dashboard
- Ventas del día y del mes
- Gráfico de ventas últimos 30 días
- Servicios más populares
- Próximas citas
- Métodos de pago

### Gestión de Clientes
- Crear, editar, eliminar
- Búsqueda rápida
- Historial completo de visitas
- Notas personalizadas

### Gestión de Servicios
- CRUD completo
- Categorización
- Control de precios y duraciones
- Activar/desactivar servicios

### Gestión de Citas
- Crear citas rápidamente
- Estados: pendiente, confirmada, completada, cancelada
- Vista de lista y calendario
- Filtros por fecha y estado

### Calendario
- Vista mensual
- Navegación entre meses
- Resumen de citas por día
- Resaltado del día actual

## 💾 Base de Datos

Archivo: `server/peluqueria.db` (SQLite)

Tablas:
- `usuarios` - Empleados y administradores
- `clientes` - Base de datos de clientes
- `servicios` - Catálogo de servicios
- `citas` - Agenda de citas
- `ventas` - Registro de pagos

## 🔒 Seguridad

- ✅ Contraseñas encriptadas con bcrypt
- ✅ Autenticación JWT con expiración (8h)
- ✅ Middleware de protección de rutas
- ✅ Validación en frontend y backend
- ✅ Variables de entorno para configuración

## 🚀 Comandos Útiles

```bash
# Desarrollo
npm run dev              # Servidor + Cliente
npm run server           # Solo servidor
npm run client           # Solo cliente

# Producción
npm start                # Servidor en producción
cd client && npm build   # Compilar frontend

# Mantenimiento
npm run install-all      # Instalar todas las dependencias
```

## 🎨 Personalización

### Cambiar nombre del negocio
Edita `client/src/components/Layout.js` línea 56

### Cambiar colores
Edita `client/src/App.js` en la función `createTheme`

### Modificar datos demo
Edita `server/seedData.js`

## 🐛 Solución de Problemas

**Puerto ocupado:**
```bash
# Cambiar puerto en .env
PORT=5001
```

**Error de dependencias:**
```bash
rm -rf node_modules client/node_modules
npm run install-all
```

**Resetear base de datos:**
```bash
rm server/peluqueria.db
# Se recreará automáticamente al iniciar
```

## 📈 Próximas Mejoras

- [ ] Notificaciones por email/SMS
- [ ] Sistema de fidelización
- [ ] Integración con pagos online
- [ ] Gestión de inventario
- [ ] Reportes PDF
- [ ] Multi-sucursales
- [ ] Sistema de comisiones

## 🎯 Ideal para

- Peluquerías
- Barberías
- Salones de belleza
- Spas
- Centros de estética
- Cualquier negocio con sistema de citas

## 📞 Soporte

Para más información consulta:
- [GUIA_USUARIO.md](GUIA_USUARIO.md) - Manual completo
- [INICIO_RAPIDO.md](INICIO_RAPIDO.md) - Inicio rápido
- [RESUMEN_PROYECTO.txt](RESUMEN_PROYECTO.txt) - Visión general

---

## 🎉 ¡Listo para empezar!

```bash
./start.sh  # Linux/Mac
start.bat   # Windows
```

**¡Éxito con tu negocio! 💇‍♀️💇‍♂️**
