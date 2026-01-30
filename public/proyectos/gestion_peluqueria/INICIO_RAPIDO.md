# 🚀 Inicio Rápido - Sistema de Gestión de Peluquería

## 📋 ¿Qué es esto?

Un sistema **completo y funcional** para gestionar peluquerías con:
- 📊 Dashboard con estadísticas en tiempo real
- 👥 Gestión de clientes con historial
- ✂️ Catálogo de servicios personalizable
- 📅 Agenda de citas interactiva
- 📆 Calendario visual mensual
- 💰 Control de ventas y métodos de pago
- 📱 **Instalable como app en móviles y ordenadores**

## ⚡ Instalación en 2 pasos

### 1️⃣ Instalar dependencias

**Linux/Mac:**
```bash
./install.sh
```

**Windows:**
```
install.bat
```

**O manualmente:**
```bash
npm install && cd client && npm install
```

### 2️⃣ Iniciar la aplicación

```bash
npm run dev
```

¡Listo! Abre http://localhost:3000 en tu navegador

## 🔑 Acceso

**Administrador:**
- Usuario: `admin`
- Contraseña: `admin123`

**Empleado:**
- Usuario: `empleado1`
- Contraseña: `empleado123`

## 📦 Contenido

```
gestion_peluqueria/
├── server/              # Backend (Node.js + Express + SQLite)
│   ├── database.js      # Configuración base de datos
│   ├── seedData.js      # Datos de demostración
│   ├── index.js         # Servidor principal
│   ├── routes/          # Rutas API REST
│   └── middleware/      # Autenticación JWT
├── client/              # Frontend (React + Material-UI)
│   ├── src/
│   │   ├── pages/       # Dashboard, Clientes, Citas, etc.
│   │   ├── components/  # Componentes reutilizables
│   │   └── api.js       # Cliente API
│   └── public/
│       ├── manifest.json      # PWA manifest
│       └── service-worker.js  # Service Worker PWA
├── README.md            # Este archivo
├── GUIA_USUARIO.md      # Documentación completa
└── package.json         # Dependencias
```

## 🎯 Características

### ✅ Datos de Demostración Incluidos

- **15 clientes** con información realista
- **13 servicios** (cortes, tintes, tratamientos, etc.)
- **100+ citas** (últimos 30 días + próximos 14 días)
- **Ventas registradas** automáticamente
- **4 usuarios** (1 admin + 3 empleados)

### ✅ Funcionalidades Principales

1. **Dashboard Completo**
   - Ventas del día y del mes
   - Gráficos de evolución
   - Servicios más populares
   - Próximas citas

2. **Gestión de Clientes**
   - Crear, editar, eliminar
   - Búsqueda rápida
   - Historial de visitas
   - Notas personalizadas

3. **Gestión de Servicios**
   - Catálogo completo
   - Precios y duraciones
   - Categorías organizadas
   - Activar/desactivar servicios

4. **Agenda de Citas**
   - Crear citas en segundos
   - Estados (pendiente, confirmada, completada, cancelada)
   - Vista de lista y calendario
   - Búsqueda y filtros

5. **Calendario Visual**
   - Vista mensual
   - Navegación fácil
   - Resumen de citas por día

### ✅ Progressive Web App (PWA)

**¡Instálala como una app nativa!**

- 📱 En móvil: Añadir a pantalla de inicio
- 💻 En ordenador: Click en instalar en el navegador
- 🚀 Funciona offline (caché)
- ⚡ Rápida y responsive

## 🛠️ Tecnologías

**Backend:**
- Node.js + Express
- SQLite (base de datos)
- JWT (autenticación)
- bcrypt (encriptación)

**Frontend:**
- React 18
- Material-UI (diseño)
- Recharts (gráficos)
- React Router (navegación)
- Axios (API)

## 📱 Uso Móvil

### Instalar en Android/iPhone

1. Abre http://localhost:3000 en Chrome/Safari
2. Menú → "Añadir a pantalla de inicio"
3. ¡Ya puedes usarla como app nativa!

### Instalar en Ordenador

1. Abre http://localhost:3000 en Chrome/Edge
2. Busca icono de instalación en barra de direcciones
3. Click "Instalar"

## 🎨 Personalización

### Cambiar nombre del negocio
`client/src/components/Layout.js` línea 56

### Cambiar colores
`client/src/App.js` en `createTheme`

### Agregar más servicios
En la app: Servicios → Nuevo Servicio

### Modificar datos demo
`server/seedData.js`

## 📊 Base de Datos

Los datos se guardan en `server/peluqueria.db` (SQLite)

**Hacer backup:**
```bash
cp server/peluqueria.db backup.db
```

**Resetear datos:**
```bash
rm server/peluqueria.db
# Al reiniciar el servidor se crearán datos nuevos
```

## 🔒 Seguridad

- ✅ Contraseñas encriptadas (bcrypt)
- ✅ Autenticación JWT
- ✅ Sesiones de 8 horas
- ✅ Middleware de protección de rutas
- ✅ Validación en frontend y backend

## 🚀 Desplegar en Producción

### Backend (Heroku/Railway/Render)
1. Conecta el repositorio
2. Variables de entorno: `JWT_SECRET`, `NODE_ENV=production`
3. Comando inicio: `npm start`

### Frontend (Vercel/Netlify)
```bash
cd client
npm run build
# Subir carpeta build/
```

## 🐛 Solución de Problemas

**Puerto 5000 ocupado:**
```bash
# Cambiar puerto en .env
PORT=5001
```

**Error de dependencias:**
```bash
rm -rf node_modules client/node_modules
npm run install-all
```

**Base de datos bloqueada:**
```bash
rm server/peluqueria.db
# Se recreará automáticamente
```

## 📚 Documentación Completa

Lee `GUIA_USUARIO.md` para:
- Tutoriales detallados
- Capturas de pantalla
- Casos de uso
- Preguntas frecuentes

## 💡 Consejos

1. **Empieza explorando el Dashboard** para ver las estadísticas
2. **Revisa los clientes y servicios** pre-cargados
3. **Crea una cita de prueba** para entender el flujo
4. **Instala como PWA** para mejor experiencia
5. **Personaliza los datos** según tu negocio

## 🎯 Para Pequeños Negocios

Este sistema está diseñado específicamente para:
- Peluquerías
- Barberías
- Salones de belleza
- Spas
- Centros de estética
- Cualquier negocio con citas

**Ventajas:**
- 🆓 100% gratuito
- 💾 Datos en tu ordenador (privacidad)
- 📱 Funciona en cualquier dispositivo
- ⚡ Rápido y ligero
- 🎨 Fácil de personalizar
- 🔧 Sin mantenimiento complejo

## 📈 Próximas Mejoras

¿Ideas? El código es tuyo, puedes añadir:
- Notificaciones por email/SMS
- Sistema de fidelización
- Pagos online
- Gestión de inventario
- Reportes PDF
- Multi-sucursales

## 🤝 Contribuir

Este es un proyecto de código abierto. Siéntete libre de:
- Reportar bugs
- Sugerir mejoras
- Compartir con otros negocios

---

## 🎉 ¡Listo para empezar!

```bash
npm run dev
```

Abre http://localhost:3000 y comienza a gestionar tu peluquería profesionalmente.

**¡Éxito con tu negocio! 💇‍♀️💇‍♂️**
