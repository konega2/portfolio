export type Project = {
  title: string
  niche: string
  summary: string
  highlights: string[]
  tags: string[]
  links?: { label: string; href: string }[]
  cta?: { label: string; href: string }
}

export type RealProject = {
  title: string
  client: string
  summary: string
  highlights: string[]
  links: { label: string; href: string }[]
  note?: string
  images?: { src: string; alt: string }[]
}

export const SERVICES = [
  {
    title: 'Webs que convierten',
    description:
      'Diseño atractivo y directo que transforma visitas en clientes. Pensada para que te contacten.',
    bullets: ['Perfecta para negocios locales', 'Optimizada para móvil', 'Carga rápida y profesional']
  },
  {
    title: 'SEO y presencia en Google',
    description:
      'Te ayudo a aparecer mejor: textos, estructura, y mejoras en tu Perfil de Empresa (Google).',
    bullets: ['Más facilidad para que te encuentren', 'Mejor primera impresión', 'Consejos para tu huella digital']
  },
  {
    title: 'Reservas y gestión',
    description:
      'Sistema para citas y gestión básica según lo que necesites.',
    bullets: ['Menos mensajes de ida y vuelta', 'Más orden en el día a día', 'Hecho a tu medida']
  }
] as const

export const TRUST_PILLARS = [
  {
    title: 'Transparencia total',
    badge: 'Claridad',
    description:
      'Te explico lo que sí puedo hacer, lo que no y por qué. Sin humo ni promesas raras.',
    bullets: ['Presupuesto simple', 'Objetivos realistas', 'Sin sorpresas en el proceso']
  },
  {
    title: 'Comunicación cercana',
    badge: 'Cercanía',
    description:
      'WhatsApp directo conmigo. Avances cortos y claros para que siempre sepas en qué punto estamos.',
    bullets: ['Respuesta rápida', 'Revisión por fases', 'Progreso visible']
  },
  {
    title: 'Entrega profesional',
    badge: 'Calidad',
    description:
      'Aunque soy estudiante, entrego como profesional: orden, velocidad y estructura clara.',
    bullets: ['Optimizada para móvil', 'SEO básico incluido', 'Código limpio y mantenible']
  }
] as const

export const TRUST_BADGES = [
  'Estudiante DAM + DAW',
  'Enfoque en negocios locales',
  'PWA instalable',
  'Acompañamiento cercano',
  'Entrega rápida y ordenada'
] as const

export const PROCESS_STEPS = [
  {
    step: '01',
    title: 'Brief rápido',
    description: 'Me cuentas tu negocio, objetivos y referencias que te gusten.'
  },
  {
    step: '02',
    title: 'Propuesta clara',
    description: 'Te envío estructura, secciones y tiempos. Ajustamos el enfoque.'
  },
  {
    step: '03',
    title: 'Diseño + contenido',
    description: 'Monto la web y preparo textos/estructura para que se entienda rápido.'
  },
  {
    step: '04',
    title: 'Entrega + mejoras',
    description: 'Revisamos, ajusto detalles y la web queda lista para publicar.'
  }
] as const

export const PRESENTATION = {
  offer: {
    title: 'Lo que ofrezco',
    bullets: [
      'Web clara, rápida y con enfoque profesional',
      'Trato directo y cercano durante todo el proyecto',
      'Ayuda con textos, estructura y presencia en Google',
      'Demo gratuita: si te gusta, seguimos adelante'
    ]
  },
  seek: {
    title: 'Lo que busco',
    bullets: [
      'Experiencia real con negocios y casos para mi portfolio',
      'Financiar cursos y certificaciones para seguir mejorando',
      'Colaboraciones reales basadas en confianza y resultados'
    ]
  }
} as const

export const REAL_PROJECTS: RealProject[] = [
  {
    title: 'Sistema de gestión + reservas',
    client: 'Restaurante La Visteta',
    summary:
      'Proyecto real: software completo para reservas, mesas, clientes, estadísticas, usuarios y fichaje. Además, configuración avanzada de reservas (cierres automáticos) y correos automatizados.',
    highlights: [
      'Gestión total de reservas y mesas',
      'Usuarios, roles y fichaje de empleados',
      'Estadísticas, clientes y control operativo',
      'Reservas conectadas a la configuración del software (cierres automáticos)',
      'Formulario de reservas moderno y visual'
    ],
    links: [
      { label: 'Reservas (widget)', href: 'https://lavisteta.com/reservas.php' },
      { label: 'Reservar', href: 'https://lavisteta.com/visteta/reservar.php' }
    ],
    note:
      'Lo único añadido a la web existente fue el apartado de reservas con un widget que recomienda interior/terraza según el día seleccionado.',
    images: [
      { src: '/casos/lavisteta-1.png', alt: 'Panel de reservas de La Visteta' },
      { src: '/casos/lavisteta-2.png', alt: 'Gestión de mesas y horarios' },
      { src: '/casos/lavisteta-3.png', alt: 'Estadísticas y control de usuarios' }
    ]
  }
]

export const FAQS = [
  {
    question: '¿Cuánto tiempo tardas en tener mi web lista?',
    answer: 'Entre 5 y 10 días para una landing profesional. Si necesitas sistemas más complejos (reservas, panel de gestión), hablamos de 2-3 semanas. Te doy fechas claras desde el inicio.'
  },
  {
    question: '¿Puedo pedir cambios después de la entrega?',
    answer: 'Totalmente. Incluyo 2 rondas completas de revisiones y ajustes menores posteriores sin coste extra. Quiero que quedes 100% satisfecho con el resultado final.'
  },
  {
    question: '¿Incluyes dominio y hosting en el precio?',
    answer: 'Te ayudo a elegir el mejor proveedor según tu caso y lo dejo todo configurado y funcionando. Si ya tienes dominio/hosting, lo conecto sin problema. El coste de dominio/hosting va aparte (suele ser 30-50€/año).'
  },
  {
    question: '¿Haces webs con reservas o sistemas personalizados?',
    answer: 'Sí, puedo integrar calendarios de reservas, formularios avanzados, paneles de gestión, zonas de clientes... Si tu negocio necesita funcionalidades específicas, lo hacemos realidad.'
  },
  {
    question: '¿Cómo comenzamos a trabajar juntos?',
    answer: 'Primero hablamos por WhatsApp o videollamada: me cuentas tu negocio, qué quieres conseguir y ejemplos que te gusten. Te envío una propuesta clara con precio, tiempos y mockup de la demo gratuita. Si te convence, arrancamos.'
  },
  {
    question: '¿Qué pasa si no me gusta la demo gratuita?',
    answer: 'No pasa nada. La demo es sin compromiso: si no te convence el resultado, no seguimos adelante y no pagas nada. Solo cobramos cuando estés seguro de que quieres continuar con el proyecto completo.'
  }
]

export const PROJECTS: Project[] = [
  {
    title: 'Gestión peluquería (panel)',
    niche: 'Panel de gestión',
    summary: 'Dashboard completo para gestionar citas, clientes y servicios.',
    highlights: ['Panel administrativo', 'Gestión de citas', 'Vistas internas'],
    tags: ['Panel', 'Full Stack', 'React'],
    links: [
      { label: 'Ver demo', href: 'https://gestionpeluqueria.vercel.app/login' }
    ],
    cta: { label: 'Ver demo', href: 'https://gestionpeluqueria.vercel.app/login' }
  },
  {
    title: 'InkSoul Studio',
    niche: 'Estudio de tatuajes',
    summary: 'Web oscura con estética fuerte, secciones completas y contenido muy visual.',
    highlights: ['Galería', 'Secciones de artistas', 'Detalle de estilos'],
    tags: ['Oscura', 'Visual', 'Galería'],
    links: [
      { label: 'Ver demo', href: '/proyectos/inksoulstudio/index.html' }
    ],
    cta: { label: 'Ver web', href: '/proyectos/inksoulstudio/index.html' }
  },
  {
    title: 'Cafeteria',
    niche: 'Cafetería',
    summary: 'Landing con menú, galería y contacto. Estilo "premium" y animaciones suaves.',
    highlights: ['Menú por categorías', 'Secciones claras', 'Diseño visual'],
    tags: ['Top', 'Premium', 'Menú'],
    links: [
      { label: 'Ver demo', href: '/proyectos/cafeteria/index.html' }
    ],
    cta: { label: 'Ver web', href: '/proyectos/cafeteria/index.html' }
  },
  {
    title: 'Salón de belleza',
    niche: 'Peluquería (mujer)',
    summary: 'Web de salón femenino con secciones completas y estilo elegante.',
    highlights: ['Servicios', 'Galería', 'Contacto'],
    tags: ['Top', 'Elegante', 'Responsive'],
    links: [
      { label: 'Ver demo', href: '/proyectos/salonbelleza/index.html' }
    ],
    cta: { label: 'Ver web', href: '/proyectos/salonbelleza/index.html' }
  },
  {
    title: 'JaviFit',
    niche: 'Entrenador personal',
    summary: 'Landing enfocada a conversión con secciones de servicios, precios y testimonios.',
    highlights: ['Estructura clara', 'CTA visibles', 'Diseño deportivo'],
    tags: ['Conversión', 'CTA', 'Deportivo'],
    links: [
      { label: 'Ver demo', href: '/proyectos/javifit/index.html' }
    ],
    cta: { label: 'Ver web', href: '/proyectos/javifit/index.html' }
  },
  {
    title: 'Peluquería',
    niche: 'Peluquería',
    summary: 'Landing con servicios principales y llamada a reservar.',
    highlights: ['Servicios', 'CTA', 'Información clara'],
    tags: ['Landing', 'Limpia', 'Directa'],
    links: [
      { label: 'Ver demo', href: '/proyectos/peluqueria/index.html' }
    ],
    cta: { label: 'Ver web', href: '/proyectos/peluqueria/index.html' }
  },
  {
    title: 'Laura Luz',
    niche: 'Fotografía',
    summary: 'Portfolio de fotografía con estilo editorial, secciones y contacto.',
    highlights: ['Portfolio', 'Secciones por servicio', 'Diseño elegante'],
    tags: ['Editorial', 'Portfolio', 'Minimalista'],
    links: [
      { label: 'Ver demo', href: '/proyectos/lauraluz/index.html' }
    ],
    cta: { label: 'Ver web', href: '/proyectos/lauraluz/index.html' }
  },
  {
    title: 'Encuesta de satisfacción',
    niche: 'Sistema / Formulario',
    summary: 'Encuesta de satisfacción para La Visteta con progreso y UI cuidada.',
    highlights: ['Formulario', 'Progreso', 'Resultados'],
    tags: ['Formulario', 'Interactivo', 'UI'],
    links: [
      { label: 'Ver demo', href: '/proyectos/encuesta/index.html' }
    ],
    cta: { label: 'Ver web', href: '/proyectos/encuesta/index.html' }
  }
]
