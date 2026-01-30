const bcrypt = require('bcryptjs');
const db = require('./database');

// Función para insertar datos de demostración
const insertarDatosDemo = () => {
  const insertarProveedoresSiVacio = () => {
    db.get('SELECT COUNT(*) as total FROM proveedores', (err, row) => {
      if (err) {
        return;
      }
      if (row.total > 0) {
        return;
      }
      const proveedores = [
        ['Proveedor Beauty', 'Ana Torres', '666-900-111', 'contacto@beauty.com', 'Av. Central 123', 'Productos capilares', 1],
        ['ColorPro', 'Luis Martín', '666-900-222', 'ventas@colorpro.com', 'C/ Sol 45', 'Coloración profesional', 1],
        ['StyleLab', 'Carla Ruiz', '666-900-333', 'hola@stylelab.com', 'C/ Norte 88', 'Styling y fijación', 1],
        ['Accesorios Pro', 'Jorge Pérez', '666-900-444', 'info@accesoriospro.com', 'C/ Sur 12', 'Accesorios peluquería', 1],
        ['Argan Lux', 'Sofía Gómez', '666-900-555', 'ventas@arganlux.com', 'Av. Este 9', 'Tratamientos premium', 1]
      ];

      const sqlProveedores = `
        INSERT OR IGNORE INTO proveedores (nombre, contacto, telefono, email, direccion, notas, activo)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      proveedores.forEach((proveedor) => {
        db.run(sqlProveedores, proveedor);
      });
    });
  };

  const insertarEntregasSiVacio = () => {
    db.get('SELECT COUNT(*) as total FROM proveedores_entregas', (err, row) => {
      if (err) {
        return;
      }
      if (row.total > 0) {
        return;
      }
      db.all('SELECT id FROM proveedores ORDER BY id', (error, proveedores) => {
        if (error || !proveedores.length) {
          return;
        }
        const hoy = new Date();
        const entregas = [
          { producto: 'Champú Hidratante 500ml', cantidad: 12, notas: 'Lote enero', proximoDias: 20 },
          { producto: 'Tinte Profesional 60ml', cantidad: 30, notas: 'Colores variados', proximoDias: 30 },
          { producto: 'Mascarilla Nutritiva 250ml', cantidad: 8, notas: 'Reponer stock', proximoDias: 15 },
          { producto: 'Cera Mate 100ml', cantidad: 15, notas: 'Promoción', proximoDias: 25 },
          { producto: 'Peine Profesional', cantidad: 20, notas: 'Accesorios', proximoDias: 45 },
        ];

        const sqlEntregas = `
          INSERT INTO proveedores_entregas
            (proveedor_id, fecha, producto, cantidad, notas, proximo_pedido_fecha, proximo_pedido_cantidad)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        proveedores.forEach((proveedor, index) => {
          const entrega = entregas[index % entregas.length];
          const fechaEntrega = new Date(hoy);
          fechaEntrega.setDate(hoy.getDate() - (index + 1) * 3);
          const fechaProximo = new Date(hoy);
          fechaProximo.setDate(hoy.getDate() + entrega.proximoDias);
          db.run(sqlEntregas, [
            proveedor.id,
            fechaEntrega.toISOString(),
            entrega.producto,
            entrega.cantidad,
            entrega.notas,
            fechaProximo.toISOString().split('T')[0],
            Math.max(5, Math.round(entrega.cantidad * 0.8)),
          ]);
        });
      });
    });
  };

  const insertarPedidosSiVacio = () => {
    db.get('SELECT COUNT(*) as total FROM proveedores_pedidos', (err, row) => {
      if (err) {
        return;
      }
      if (row.total > 0) {
        return;
      }
      db.all('SELECT id FROM proveedores ORDER BY id', (error, proveedores) => {
        if (error || !proveedores.length) {
          return;
        }
        const hoy = new Date();
        const pedidos = [
          { producto: 'Champú Hidratante 500ml', cantidad: 20, notas: 'Reposición mensual', recibido: true },
          { producto: 'Tinte Profesional 60ml', cantidad: 40, notas: 'Colores base', recibido: false },
          { producto: 'Cera Mate 100ml', cantidad: 25, notas: 'Campaña invierno', recibido: true },
          { producto: 'Peine Profesional', cantidad: 30, notas: 'Accesorios', recibido: false },
        ];

        const sqlPedidos = `
          INSERT INTO proveedores_pedidos
            (proveedor_id, fecha_pedido, producto, cantidad, estado, fecha_entrega, notas)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        proveedores.forEach((proveedor, index) => {
          const pedido = pedidos[index % pedidos.length];
          const fechaPedido = new Date(hoy);
          fechaPedido.setDate(hoy.getDate() - (index + 2) * 2);
          const fechaEntrega = new Date(hoy);
          fechaEntrega.setDate(hoy.getDate() - (index + 1));
          db.run(sqlPedidos, [
            proveedor.id,
            fechaPedido.toISOString(),
            pedido.producto,
            pedido.cantidad,
            pedido.recibido ? 'recibido' : 'pendiente',
            pedido.recibido ? fechaEntrega.toISOString() : null,
            pedido.notas,
          ]);
        });
      });
    });
  };

  const insertarEmpleadosExtrasSiVacio = () => {
    db.get('SELECT COUNT(*) as total FROM empleados_fichajes', (err, row) => {
      if (err) {
        return;
      }
      if (row.total > 0) {
        return;
      }
      db.all("SELECT id FROM usuarios WHERE rol = 'empleado'", (error, empleados) => {
        if (error || !empleados.length) {
          return;
        }
        const hoy = new Date();
        const sqlFichajes = `
          INSERT INTO empleados_fichajes (empleado_id, fecha_entrada, fecha_salida, minutos_trabajados, notas)
          VALUES (?, ?, ?, ?, ?)
        `;
        const sqlAusencias = `
          INSERT INTO empleados_ausencias (empleado_id, fecha_inicio, fecha_fin, motivo, notas)
          VALUES (?, ?, ?, ?, ?)
        `;
        const sqlObjetivos = `
          INSERT INTO empleados_objetivos (empleado_id, titulo, descripcion, objetivo, logrado, fecha_inicio, fecha_fin)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const sqlNotas = `
          INSERT INTO empleados_notas (empleado_id, nota)
          VALUES (?, ?)
        `;

        empleados.forEach((empleado, index) => {
          const fechaEntrada = new Date(hoy);
          fechaEntrada.setDate(hoy.getDate() - (index + 1));
          fechaEntrada.setHours(9, 0, 0, 0);
          const fechaSalida = new Date(fechaEntrada);
          fechaSalida.setHours(17, 0, 0, 0);
          db.run(sqlFichajes, [
            empleado.id,
            fechaEntrada.toISOString(),
            fechaSalida.toISOString(),
            480,
            'Fichaje demo',
          ]);

          const fechaAusenciaInicio = new Date(hoy);
          fechaAusenciaInicio.setDate(hoy.getDate() - (index + 3));
          const fechaAusenciaFin = new Date(hoy);
          fechaAusenciaFin.setDate(hoy.getDate() - (index + 2));
          db.run(sqlAusencias, [
            empleado.id,
            fechaAusenciaInicio.toISOString().split('T')[0],
            fechaAusenciaFin.toISOString().split('T')[0],
            'Consulta médica',
            'Justificado',
          ]);

          const fechaInicio = new Date(hoy);
          fechaInicio.setDate(hoy.getDate() - 15);
          const fechaFin = new Date(hoy);
          fechaFin.setDate(hoy.getDate() + 15);
          db.run(sqlObjetivos, [
            empleado.id,
            'Ventas mensuales',
            'Objetivo de ventas personales',
            1200,
            650,
            fechaInicio.toISOString().split('T')[0],
            fechaFin.toISOString().split('T')[0],
          ]);

          db.run(sqlNotas, [
            empleado.id,
            'Empleado con buen rendimiento y buena atención al cliente.',
          ]);
        });
      });
    });
  };

  db.get('SELECT COUNT(*) as total FROM usuarios', (err, row) => {
    if (err) {
      return;
    }
    if (row.total > 0) {
      insertarProveedoresSiVacio();
      insertarEntregasSiVacio();
      insertarPedidosSiVacio();
      insertarEmpleadosExtrasSiVacio();
      console.log('ℹ️ Datos de demostración ya existen, se omite seed');
      return;
    }

  // Hash de contraseñas
  const hashAdmin = bcrypt.hashSync('admin123', 10);
  const hashEmpleado = bcrypt.hashSync('empleado123', 10);

  // Insertar usuarios
  const usuarios = [
    ['Admin Principal', 'admin@peluqueria.com', 'admin', hashAdmin, 'admin', '666-111-222'],
    ['María García', 'maria@peluqueria.com', 'empleado1', hashEmpleado, 'empleado', '666-222-333'],
    ['Carlos Ruiz', 'carlos@peluqueria.com', 'empleado2', hashEmpleado, 'empleado', '666-333-444'],
    ['Laura Martín', 'laura@peluqueria.com', 'empleado3', hashEmpleado, 'empleado', '666-444-555']
  ];

  const sqlUsuarios = 'INSERT OR IGNORE INTO usuarios (nombre, email, usuario, password, rol, telefono) VALUES (?, ?, ?, ?, ?, ?)';
  usuarios.forEach(usuario => {
    db.run(sqlUsuarios, usuario);
  });

  // Insertar servicios (demo reducida)
  const servicios = [
    ['Corte de Pelo Mujer', 'Corte con acabado profesional', 25.00, 45, 'Corte'],
    ['Corte de Pelo Hombre', 'Corte clásico o moderno', 15.00, 30, 'Corte'],
    ['Tinte Completo', 'Tinte de raíces a puntas', 45.00, 120, 'Color'],
    ['Mechas', 'Mechas californianas o balayage', 60.00, 150, 'Color'],
    ['Permanente', 'Permanente ondulada o rizada', 55.00, 120, 'Tratamiento'],
    ['Alisado Keratina', 'Tratamiento alisador con keratina', 80.00, 180, 'Tratamiento'],
    ['Peinado Evento', 'Peinado para bodas, eventos especiales', 35.00, 60, 'Peinado'],
    ['Recogido', 'Recogido elegante para eventos', 40.00, 75, 'Peinado'],
    ['Lavado y Secado', 'Lavado con productos premium y secado', 12.00, 30, 'Básico']
  ];

  const totalServiciosSeed = servicios.length;
  const sqlServicios = 'INSERT OR IGNORE INTO servicios (nombre, descripcion, precio, duracion, categoria) VALUES (?, ?, ?, ?, ?)';
  servicios.forEach(servicio => {
    db.run(sqlServicios, servicio);
  });

  // Insertar clientes (demo reducida)
  const totalClientesSeed = 30;
  const clientes = [
    ['Ana Fernández', 'López', '666-100-001', 'ana.fernandez@email.com', 'Cliente frecuente, prefiere mechas rubias'],
    ['Pedro Sánchez', 'García', '666-100-002', 'pedro.sanchez@email.com', 'Viene cada 3 semanas para corte'],
    ['Isabel Martínez', 'Ruiz', '666-100-003', 'isabel.martinez@email.com', 'Alérgica a ciertos tintes'],
    ['Javier López', 'Pérez', '666-100-004', 'javier.lopez@email.com', 'Prefiere cortes clásicos'],
    ['Carmen Rodríguez', 'Gómez', '666-100-005', 'carmen.rodriguez@email.com', 'Cliente VIP'],
    ['Miguel Ángel Torres', 'Díaz', '666-100-006', 'miguel.torres@email.com', 'Viene con cita previa siempre'],
    ['Lucía Jiménez', 'Moreno', '666-100-007', 'lucia.jimenez@email.com', 'Le gusta cambiar de look'],
    ['Roberto Muñoz', 'Álvarez', '666-100-008', 'roberto.munoz@email.com', 'Corte y barba mensual'],
    ['Elena Romero', 'Navarro', '666-100-009', 'elena.romero@email.com', 'Tratamientos capilares'],
    ['Francisco Serrano', 'Blanco', '666-100-010', 'francisco.serrano@email.com', ''],
    ['Marta Iglesias', 'Castro', '666-100-011', 'marta.iglesias@email.com', 'Prefiere los sábados por la mañana'],
    ['David Ortega', 'Rubio', '666-100-012', 'david.ortega@email.com', 'Cliente nuevo'],
    ['Raquel Delgado', 'Ramos', '666-100-013', 'raquel.delgado@email.com', 'Viene para eventos especiales'],
    ['Alberto Gil', 'Vega', '666-100-014', 'alberto.gil@email.com', ''],
    ['Cristina Méndez', 'Fuentes', '666-100-015', 'cristina.mendez@email.com', 'Mechas cada 2 meses'],
    ['Sofía Navarro', 'Cano', '666-100-016', 'sofia.navarro@email.com', ''],
    ['Hugo Pérez', 'Santos', '666-100-017', 'hugo.perez@email.com', 'Cliente nuevo'],
    ['Natalia Ruiz', 'Campos', '666-100-018', 'natalia.ruiz@email.com', 'Prefiere tonos cálidos'],
    ['Álvaro Martín', 'Ferrer', '666-100-019', 'alvaro.martin@email.com', 'Corte y barba'],
    ['Paula Gómez', 'Vidal', '666-100-020', 'paula.gomez@email.com', ''],
    ['Sergio Morales', 'León', '666-100-021', 'sergio.morales@email.com', ''],
    ['Irene Castillo', 'Soto', '666-100-022', 'irene.castillo@email.com', 'Tratamientos capilares'],
    ['Diego Romero', 'Mora', '666-100-023', 'diego.romero@email.com', ''],
    ['Laura Herrera', 'Cruz', '666-100-024', 'laura.herrera@email.com', ''],
    ['Mario González', 'Pardo', '666-100-025', 'mario.gonzalez@email.com', ''],
    ['Nuria León', 'Ramos', '666-100-026', 'nuria.leon@email.com', ''],
    ['Adrián Ruiz', 'Vega', '666-100-027', 'adrian.ruiz@email.com', ''],
    ['Claudia Serrano', 'Gil', '666-100-028', 'claudia.serrano@email.com', ''],
    ['Rubén Díaz', 'Álvarez', '666-100-029', 'ruben.diaz@email.com', ''],
    ['Carla Méndez', 'Iglesias', '666-100-030', 'carla.mendez@email.com', ''],
    ['Jorge Campos', 'Fuentes', '666-100-031', 'jorge.campos@email.com', ''],
    ['Aitana Moreno', 'Lara', '666-100-032', 'aitana.moreno@email.com', 'Prefiere sábados'],
    ['Iván Ortiz', 'Núñez', '666-100-033', 'ivan.ortiz@email.com', ''],
    ['María José Pérez', 'Suárez', '666-100-034', 'mariajose.perez@email.com', ''],
    ['Lucas Delgado', 'Prieto', '666-100-035', 'lucas.delgado@email.com', ''],
    ['Beatriz Morales', 'Marín', '666-100-036', 'beatriz.morales@email.com', ''],
    ['Óscar Vega', 'Rey', '666-100-037', 'oscar.vega@email.com', ''],
    ['Noelia Romero', 'Sanz', '666-100-038', 'noelia.romero@email.com', ''],
    ['Pablo Flores', 'Saez', '666-100-039', 'pablo.flores@email.com', ''],
    ['Sara Torres', 'Calvo', '666-100-040', 'sara.torres@email.com', ''],
    ['Daniel Iglesias', 'Bravo', '666-100-041', 'daniel.iglesias@email.com', ''],
    ['Elisa Medina', 'Cortes', '666-100-042', 'elisa.medina@email.com', ''],
    ['Gonzalo Ruiz', 'López', '666-100-043', 'gonzalo.ruiz@email.com', ''],
    ['Rocío Castro', 'Molina', '666-100-044', 'rocio.castro@email.com', ''],
    ['Héctor Navarro', 'Rubio', '666-100-045', 'hector.navarro@email.com', ''],
    ['Patricia Blanco', 'Serrano', '666-100-046', 'patricia.blanco@email.com', ''],
    ['Víctor Ramos', 'Carmona', '666-100-047', 'victor.ramos@email.com', ''],
    ['Celia Vega', 'Herrero', '666-100-048', 'celia.vega@email.com', ''],
    ['Andrés Molina', 'Ponce', '666-100-049', 'andres.molina@email.com', ''],
    ['Lidia Prieto', 'Flores', '666-100-050', 'lidia.prieto@email.com', ''],
    ['Santi León', 'Varela', '666-100-051', 'santi.leon@email.com', ''],
    ['Marina Santos', 'Mendez', '666-100-052', 'marina.santos@email.com', ''],
    ['Ángel Herrera', 'García', '666-100-053', 'angel.herrera@email.com', ''],
    ['Teresa Núñez', 'Paz', '666-100-054', 'teresa.nunez@email.com', ''],
    ['Alex Medina', 'Sierra', '666-100-055', 'alex.medina@email.com', ''],
    ['Inés Gil', 'Rivas', '666-100-056', 'ines.gil@email.com', ''],
    ['Samuel Ruiz', 'Lamas', '666-100-057', 'samuel.ruiz@email.com', ''],
    ['Alicia Campos', 'Luna', '666-100-058', 'alicia.campos@email.com', ''],
    ['Marcos Soto', 'Nieto', '666-100-059', 'marcos.soto@email.com', ''],
    ['Eva Delgado', 'Lorenzo', '666-100-060', 'eva.delgado@email.com', ''],
    ['Julián Ramos', 'Aguilar', '666-100-061', 'julian.ramos@email.com', ''],
    ['Mónica Calvo', 'Serra', '666-100-062', 'monica.calvo@email.com', ''],
    ['Bruno Ortega', 'Bautista', '666-100-063', 'bruno.ortega@email.com', ''],
    ['Nerea Gómez', 'Tomas', '666-100-064', 'nerea.gomez@email.com', ''],
    ['Joel Castillo', 'Arias', '666-100-065', 'joel.castillo@email.com', ''],
    ['Verónica Vidal', 'Pérez', '666-100-066', 'veronica.vidal@email.com', ''],
    ['Tomás Mora', 'Domínguez', '666-100-067', 'tomas.mora@email.com', ''],
    ['Iria Fuentes', 'Soler', '666-100-068', 'iria.fuentes@email.com', ''],
    ['César Rivas', 'Esteban', '666-100-069', 'cesar.rivas@email.com', ''],
    ['Olga Serrano', 'Rico', '666-100-070', 'olga.serrano@email.com', 'Cliente VIP']
  ];

  const clientesDemo = clientes.slice(0, totalClientesSeed);
  const sqlClientes = 'INSERT OR IGNORE INTO clientes (nombre, apellidos, telefono, email, notas) VALUES (?, ?, ?, ?, ?)';
  db.get('SELECT COUNT(*) as total FROM clientes', (err, row) => {
    if (err) {
      return;
    }
    if (row.total >= totalClientesSeed) {
      return;
    }
    clientesDemo.forEach(cliente => {
      db.run(sqlClientes, cliente);
    });
  });

  // Insertar citas demo limitadas (máx. 5 por día y 100 en total)
  const ahora = new Date();
  const maxCitasTotales = 100;
  const maxCitasPorDia = 5;
  const inicioDemo = new Date(ahora.getFullYear(), 0, 1);
  const finDemo = new Date(ahora.getFullYear(), 2, 15);

  db.get('SELECT COUNT(*) as total FROM citas', (err, row) => {
    if (err) {
      return;
    }
    if (row.total >= maxCitasTotales) {
      return;
    }

    const citas = [];
    const restantes = maxCitasTotales - row.total;

    for (let fecha = new Date(inicioDemo); fecha <= finDemo && citas.length < restantes; fecha.setDate(fecha.getDate() + 1)) {
      const cupoDia = Math.min(restantes - citas.length, maxCitasPorDia);
      const numCitas = Math.min(cupoDia, Math.floor(Math.random() * (maxCitasPorDia + 1)));

      for (let j = 0; j < numCitas; j++) {
        const hora = Math.floor(Math.random() * 9) + 9; // 9:00 - 18:00
        const fechaHora = new Date(fecha);
        fechaHora.setHours(hora, [0, 15, 30, 45][Math.floor(Math.random() * 4)], 0);

        const clienteId = Math.floor(Math.random() * totalClientesSeed) + 1;
        const servicioId = Math.floor(Math.random() * totalServiciosSeed) + 1;
        const empleadoId = Math.floor(Math.random() * 3) + 2; // empleados 2, 3, 4
        const esPasada = fechaHora < ahora;
        const estado = esPasada
          ? ['completada', 'completada', 'completada', 'cancelada'][Math.floor(Math.random() * 4)]
          : ['pendiente', 'confirmada'][Math.floor(Math.random() * 2)];

        citas.push([
          clienteId,
          servicioId,
          empleadoId,
          fechaHora.toISOString(),
          45,
          estado,
          '',
          0
        ]);
      }
    }

    const sqlCitas = 'INSERT INTO citas (cliente_id, servicio_id, empleado_id, fecha_hora, duracion, estado, notas, precio) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    citas.forEach(cita => {
      db.run(sqlCitas, cita);
    });
  });

  // Insertar ventas basadas en citas completadas
  const sqlVentas = `
    INSERT INTO ventas (cita_id, cliente_id, monto, metodo_pago, fecha, empleado_id)
    SELECT c.id, c.cliente_id, s.precio, 
           CASE (ABS(RANDOM()) % 4)
             WHEN 0 THEN 'efectivo'
             WHEN 1 THEN 'tarjeta'
             WHEN 2 THEN 'transferencia'
             ELSE 'bizum'
           END,
           c.fecha_hora,
           c.empleado_id
    FROM citas c
    JOIN servicios s ON c.servicio_id = s.id
    WHERE c.estado = 'completada'
  `;
  
  db.run(sqlVentas);

  // Insertar gastos demo (últimos 30 días)
  const gastosFijos = [
    ['Alquiler del local', 'Alquiler', 420.00, 'transferencia', 'Inmobiliaria Centro', 'Pago mensual del local'],
    ['Suministros eléctricos', 'Suministros', 85.00, 'transferencia', 'Compañía Eléctrica', 'Factura de luz'],
    ['Agua', 'Suministros', 25.00, 'transferencia', 'Compañía de Agua', 'Factura mensual'],
    ['Internet y teléfono', 'Servicios', 35.00, 'tarjeta', 'Proveedor Telecom', 'Plan empresa'],
    ['Marketing redes sociales', 'Marketing', 45.00, 'tarjeta', 'Agencia Social', 'Campaña mensual']
  ];

  const sqlGastos = `
    INSERT INTO gastos (concepto, categoria, monto, fecha, metodo_pago, proveedor, notas, empleado_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  gastosFijos.forEach((gasto, index) => {
    const fecha = new Date(ahora);
    fecha.setDate(fecha.getDate() - (index * 5));
    db.run(sqlGastos, [...gasto.slice(0, 3), fecha.toISOString(), gasto[3], gasto[4], gasto[5], 1]);
  });

  const categoriasVariables = ['Productos', 'Mantenimiento', 'Formación', 'Material', 'Limpieza'];
  for (let i = 0; i < 10; i++) {
    const fecha = new Date(ahora);
    fecha.setDate(fecha.getDate() - Math.floor(Math.random() * 30));
    const monto = Math.round((Math.random() * 60 + 10) * 100) / 100;
    const categoria = categoriasVariables[Math.floor(Math.random() * categoriasVariables.length)];
    db.run(
      sqlGastos,
      [`Gasto variable ${i + 1}`, categoria, monto, fecha.toISOString(), 'tarjeta', 'Proveedor local', '', 1]
    );
  }

  // Insertar productos demo de inventario
  const productos = [
    ['Champú Hidratante 500ml', 'Cabello', 18, 5, 6.5, 12.0, 'Proveedor Beauty'],
    ['Acondicionador Reparador 500ml', 'Cabello', 14, 5, 7.0, 13.0, 'Proveedor Beauty'],
    ['Mascarilla Nutritiva 250ml', 'Cabello', 9, 4, 8.0, 15.0, 'Proveedor Beauty'],
    ['Tinte Profesional 60ml', 'Color', 45, 20, 4.0, 8.5, 'ColorPro'],
    ['Decolorante 500g', 'Color', 6, 3, 12.0, 22.0, 'ColorPro'],
    ['Cera Mate 100ml', 'Styling', 12, 5, 5.0, 10.0, 'StyleLab'],
    ['Laca Fijación Extra', 'Styling', 10, 4, 6.0, 11.0, 'StyleLab'],
    ['Aceite Argan 100ml', 'Tratamiento', 7, 3, 9.0, 18.0, 'Argan Lux'],
    ['Peine Profesional', 'Accesorios', 20, 8, 1.5, 4.0, 'Accesorios Pro'],
    ['Cepillo Redondo', 'Accesorios', 16, 6, 2.5, 6.0, 'Accesorios Pro'],
    ['Capa de Corte', 'Accesorios', 5, 2, 8.0, 16.0, 'Accesorios Pro'],
    ['Guantes Desechables (100)', 'Higiene', 22, 10, 3.5, 7.0, 'HigienePlus']
  ];

  const sqlProductos = `
    INSERT OR IGNORE INTO productos (nombre, categoria, stock, stock_minimo, costo, precio, proveedor)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  productos.forEach(producto => {
    db.run(sqlProductos, producto);
  });

    insertarProveedoresSiVacio();
    insertarEntregasSiVacio();
    insertarPedidosSiVacio();
    insertarEmpleadosExtrasSiVacio();

  // Insertar caja diaria demo (últimos 7 días)
  const sqlCaja = `
    INSERT OR IGNORE INTO caja_diaria (fecha, apertura, cierre, estado, notas, usuario_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  for (let i = 7; i >= 0; i--) {
    const fecha = new Date(ahora);
    fecha.setDate(fecha.getDate() - i);
    const apertura = 100 + (Math.random() * 50);
    const cierre = apertura + (Math.random() * 300);
    db.run(sqlCaja, [fecha.toISOString().split('T')[0], apertura.toFixed(2), cierre.toFixed(2), 'cerrada', 'Caja del día', 1]);
  }

  console.log('✅ Datos de demostración insertados correctamente');
  });
};

// Ejecutar cuando se importa el módulo
setTimeout(insertarDatosDemo, 1000);

module.exports = { insertarDatosDemo };
