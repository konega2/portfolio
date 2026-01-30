const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'peluqueria.db'), (err) => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err);
  } else {
    console.log('✅ Conectado a la base de datos SQLite');
  }
});

// Crear tablas
db.serialize(() => {
  // Tabla de usuarios (empleados)
  db.run(`CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    usuario TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    rol TEXT DEFAULT 'empleado',
    telefono TEXT,
    activo INTEGER DEFAULT 1,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Tabla de clientes
  db.run(`CREATE TABLE IF NOT EXISTS clientes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    apellidos TEXT,
    telefono TEXT,
    email TEXT,
    notas TEXT,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    ultima_visita DATETIME
  )`);

  // Tabla de servicios
  db.run(`CREATE TABLE IF NOT EXISTS servicios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    precio REAL NOT NULL,
    duracion INTEGER NOT NULL,
    activo INTEGER DEFAULT 1,
    categoria TEXT
  )`);

  // Tabla de citas
  db.run(`CREATE TABLE IF NOT EXISTS citas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cliente_id INTEGER NOT NULL,
    servicio_id INTEGER NOT NULL,
    empleado_id INTEGER NOT NULL,
    fecha_hora DATETIME NOT NULL,
    duracion INTEGER NOT NULL,
    estado TEXT DEFAULT 'pendiente',
    notas TEXT,
    precio REAL,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id),
    FOREIGN KEY (servicio_id) REFERENCES servicios(id),
    FOREIGN KEY (empleado_id) REFERENCES usuarios(id)
  )`);

  db.run('CREATE INDEX IF NOT EXISTS idx_citas_fecha_hora ON citas (fecha_hora)');
  db.run('CREATE INDEX IF NOT EXISTS idx_citas_estado ON citas (estado)');
  db.run('CREATE INDEX IF NOT EXISTS idx_citas_empleado ON citas (empleado_id)');
  db.run('CREATE INDEX IF NOT EXISTS idx_citas_fecha_empleado ON citas (fecha_hora, empleado_id)');

  // Tabla de ventas/pagos
  db.run(`CREATE TABLE IF NOT EXISTS ventas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cita_id INTEGER,
    cliente_id INTEGER NOT NULL,
    monto REAL NOT NULL,
    metodo_pago TEXT,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    empleado_id INTEGER,
    FOREIGN KEY (cita_id) REFERENCES citas(id),
    FOREIGN KEY (cliente_id) REFERENCES clientes(id),
    FOREIGN KEY (empleado_id) REFERENCES usuarios(id)
  )`);

  // Tabla de gastos
  db.run(`CREATE TABLE IF NOT EXISTS gastos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    concepto TEXT NOT NULL,
    categoria TEXT,
    monto REAL NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    metodo_pago TEXT,
    proveedor TEXT,
    notas TEXT,
    empleado_id INTEGER,
    FOREIGN KEY (empleado_id) REFERENCES usuarios(id)
  )`);

  // Tabla de eventos manuales del calendario
  db.run(`CREATE TABLE IF NOT EXISTS eventos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    descripcion TEXT,
    fecha_inicio DATETIME NOT NULL,
    fecha_fin DATETIME,
    todo_dia INTEGER DEFAULT 0,
    tipo TEXT DEFAULT 'nota',
    color TEXT,
    creado_por INTEGER,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (creado_por) REFERENCES usuarios(id)
  )`);

  db.run('CREATE INDEX IF NOT EXISTS idx_eventos_fecha_inicio ON eventos (fecha_inicio)');

  // Tabla de inventario de productos
  db.run(`CREATE TABLE IF NOT EXISTS productos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    categoria TEXT,
    stock INTEGER DEFAULT 0,
    stock_minimo INTEGER DEFAULT 0,
    costo REAL DEFAULT 0,
    precio REAL DEFAULT 0,
    proveedor TEXT,
    activo INTEGER DEFAULT 1,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Turnos de empleados
  db.run(`CREATE TABLE IF NOT EXISTS empleados_turnos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    empleado_id INTEGER NOT NULL,
    fecha DATE NOT NULL,
    hora_inicio TEXT NOT NULL,
    hora_fin TEXT NOT NULL,
    notas TEXT,
    FOREIGN KEY (empleado_id) REFERENCES usuarios(id)
  )`);

  // Fichajes de empleados
  db.run(`CREATE TABLE IF NOT EXISTS empleados_fichajes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    empleado_id INTEGER NOT NULL,
    fecha_entrada DATETIME NOT NULL,
    fecha_salida DATETIME,
    minutos_trabajados INTEGER DEFAULT 0,
    notas TEXT,
    FOREIGN KEY (empleado_id) REFERENCES usuarios(id)
  )`);

  // Ausencias de empleados
  db.run(`CREATE TABLE IF NOT EXISTS empleados_ausencias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    empleado_id INTEGER NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    motivo TEXT,
    notas TEXT,
    FOREIGN KEY (empleado_id) REFERENCES usuarios(id)
  )`);

  // Objetivos de empleados
  db.run(`CREATE TABLE IF NOT EXISTS empleados_objetivos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    empleado_id INTEGER NOT NULL,
    titulo TEXT NOT NULL,
    descripcion TEXT,
    objetivo REAL DEFAULT 0,
    logrado REAL DEFAULT 0,
    fecha_inicio DATE,
    fecha_fin DATE,
    FOREIGN KEY (empleado_id) REFERENCES usuarios(id)
  )`);

  // Notas internas de empleados
  db.run(`CREATE TABLE IF NOT EXISTS empleados_notas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    empleado_id INTEGER NOT NULL,
    nota TEXT NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (empleado_id) REFERENCES usuarios(id)
  )`);

  // Movimientos de inventario
  db.run(`CREATE TABLE IF NOT EXISTS inventario_movimientos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    producto_id INTEGER NOT NULL,
    tipo TEXT NOT NULL,
    cantidad INTEGER NOT NULL,
    notas TEXT,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    usuario_id INTEGER,
    FOREIGN KEY (producto_id) REFERENCES productos(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
  )`);

  // Tabla de proveedores
  db.run(`CREATE TABLE IF NOT EXISTS proveedores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL UNIQUE,
    contacto TEXT,
    telefono TEXT,
    email TEXT,
    direccion TEXT,
    notas TEXT,
    activo INTEGER DEFAULT 1,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Entregas de proveedores
  db.run(`CREATE TABLE IF NOT EXISTS proveedores_entregas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    proveedor_id INTEGER NOT NULL,
    fecha DATETIME NOT NULL,
    producto TEXT NOT NULL,
    cantidad INTEGER NOT NULL,
    notas TEXT,
    proximo_pedido_fecha DATE,
    proximo_pedido_cantidad INTEGER,
    FOREIGN KEY (proveedor_id) REFERENCES proveedores(id)
  )`);

  // Pedidos a proveedores
  db.run(`CREATE TABLE IF NOT EXISTS proveedores_pedidos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    proveedor_id INTEGER NOT NULL,
    fecha_pedido DATETIME NOT NULL,
    producto TEXT NOT NULL,
    cantidad INTEGER NOT NULL,
    estado TEXT DEFAULT 'pendiente',
    fecha_entrega DATETIME,
    notas TEXT,
    FOREIGN KEY (proveedor_id) REFERENCES proveedores(id)
  )`);

  // Tabla de caja diaria
  db.run(`CREATE TABLE IF NOT EXISTS caja_diaria (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fecha DATE NOT NULL,
    apertura REAL DEFAULT 0,
    cierre REAL DEFAULT 0,
    estado TEXT DEFAULT 'abierta',
    notas TEXT,
    usuario_id INTEGER,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(fecha),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
  )`);

  db.run("ALTER TABLE caja_diaria ADD COLUMN estado TEXT DEFAULT 'abierta'", () => {});

  // Movimientos de caja
  db.run(`CREATE TABLE IF NOT EXISTS caja_movimientos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    caja_id INTEGER NOT NULL,
    tipo TEXT NOT NULL,
    metodo_pago TEXT,
    monto REAL NOT NULL,
    propina REAL DEFAULT 0,
    efectivo_recibido REAL DEFAULT 0,
    cambio REAL DEFAULT 0,
    cita_id INTEGER,
    notas TEXT,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    usuario_id INTEGER,
    FOREIGN KEY (caja_id) REFERENCES caja_diaria(id),
    FOREIGN KEY (cita_id) REFERENCES citas(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
  )`);
});

module.exports = db;
