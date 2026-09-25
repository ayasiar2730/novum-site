/**
 * Contenido del sitio — fuente de verdad: docs/novum-web-fase0.md
 * Todo texto visible sale de aquí. No inventar datos que no estén en el documento.
 *
 * Regla del corte comercial (14 sep 2026): los estados internos de construcción
 * de producto (en desarrollo, en diseño, en pruebas, roadmap) NO forman parte de
 * la comunicación pública. El sitio comunica utilidad, capacidad, experiencia,
 * especialización, tecnología + acompañamiento e información convertida en decisiones.
 */

export const site = {
  name: "Novum Integral",
  legalName: "Novum Integral SAS",
  url: "https://novumintegral.com",
  appUrl: "https://app.novumintegral.com",
  /** Eslogan tal como va en el logotipo (24 sep 2026: «análisis que transforman»). */
  tagline: "Inteligencia que anticipa, análisis que transforman, decisiones que generan valor.",
  shortDescription: "Software y consultoría para el sector solidario.",
  footerLine: "Software y acompañamiento especializado para el sector solidario.",
  /** Título para compartir (Open Graph / Twitter): más descriptivo que el nombre, coherente con el hero. */
  ogTitle: "Novum Integral | Tecnología, riesgos y gestión para el sector solidario",
  metaDescription:
    "Empresa colombiana de software y consultoría para cooperativas, fondos de empleados y mutuales: riesgos, finanzas, auditoría, cumplimiento, formación, analítica y tecnología propia.",
  institutional:
    "Novum Integral SAS es una empresa colombiana de software y consultoría especializada en el sector de economía solidaria: cooperativas de ahorro y crédito, fondos de empleados y asociaciones mutuales. Trabajamos en siete líneas —gestión integral de riesgos, consultoría financiera, auditoría y aseguramiento, transformación institucional, capacitación, cumplimiento y analítica de datos— y desarrollamos tres productos independientes: Novum Risk, Novum Budget y Novum Strategic Planning. Somos un equipo especializado, con experiencia directa en el sector.",
  year: 2026,
  /**
   * Fecha del último corte editorial publicado (AAAA-MM-DD). Alimenta `lastModified`
   * del sitemap de forma determinista: se actualiza a mano cuando cambia el contenido,
   * nunca con la fecha del build.
   */
  contentUpdatedAt: "2026-09-24",
} as const;

export const contact = {
  emails: ["contacto@novumintegral.com", "administracion@novumintegral.com"],
  /**
   * El PRIMERO es el destino de todos los botones de WhatsApp (demostración y
   * chat, lib/links.ts) y el teléfono del JSON-LD. 24-sep-2026: el 321 480 9336
   * va primero porque por ahora es el que está más pendiente.
   */
  whatsapp: [
    { number: "573214809336", display: "+57 321 480 9336" },
    { number: "573015661091", display: "+57 301 566 1091" },
  ],
  demoMessage: "Hola, quiero agendar una demostración de Novum Integral para mi entidad.",
} as const;

/**
 * Redes sociales (24 sep 2026). Direcciones canónicas, sin parámetros de
 * rastreo: el enlace de Facebook que se compartió («/share/…») redirige a la
 * página por su id. Alimentan el pie, la banda de contacto y `sameAs` del JSON-LD.
 */
export const redes = [
  { red: "linkedin", nombre: "LinkedIn", url: "https://www.linkedin.com/in/novum-integral-608544438" },
  { red: "instagram", nombre: "Instagram", url: "https://www.instagram.com/novumintegral/" },
  { red: "facebook", nombre: "Facebook", url: "https://www.facebook.com/profile.php?id=61594481222000" },
] as const;

/**
 * Navegación principal (fase 2, multipágina): cada entrada es una página. El
 * Home es la puerta de entrada —un resumen de cada tema con su enlace— y cada
 * página tiene el contenido completo, sin repetirlo en el Home.
 */
export const nav = [
  { label: "Soluciones", href: "/soluciones" },
  { label: "Tecnología", href: "/tecnologia" },
  { label: "Informes", href: "/informes" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Contacto", href: "/contacto" },
] as const;

/** Títulos y descripciones de las páginas internas (metadatos y migas). */
export const paginas = {
  soluciones: {
    titulo: "Soluciones",
    descripcion:
      "Siete líneas para el sector solidario: riesgos, consultoría financiera, auditoría, transformación institucional, formación, cumplimiento y analítica de datos.",
  },
  tecnologia: {
    titulo: "Tecnología",
    descripcion:
      "Novum Risk, Novum Budget y Novum Strategic Planning: software que convierte la metodología en gestión diaria para cooperativas, fondos de empleados y mutuales.",
  },
  informes: {
    titulo: "Informes sectoriales",
    descripcion:
      "Informes del sector solidario colombiano con los datos oficiales de la Supersolidaria, procesados y leídos por Novum Integral.",
  },
  nosotros: {
    titulo: "Nosotros",
    descripcion:
      "Novum Integral SAS: propuesta de valor, a quién acompañamos, cómo trabajamos y por qué Novum, con experiencia directa en el sector de economía solidaria.",
  },
  contacto: {
    titulo: "Contacto",
    descripcion:
      "Formas de vinculación con Novum Integral —de una necesidad puntual a una transformación completa— y datos de contacto para agendar una demostración.",
  },
} as const;

export const cta = {
  primary: "Agende una demostración",
  secondary: "Escribir por WhatsApp",
  app: "Ingresar a la plataforma",
} as const;

export const hero = {
  eyebrow: "Software y consultoría para el sector solidario",
  titleAccent: "Gestión de riesgos, presupuesto y planeación",
  title: "Gestión de riesgos, presupuesto y planeación para cooperativas, fondos de empleados y mutuales.",
  subtitle:
    "Una plataforma integral y un equipo que conoce el sector, para que su entidad gestione sus riesgos con método y decida con datos.",
  facts: [
    { label: "Sector", value: "Cooperativas, fondos de empleados y mutuales" },
    { label: "Referentes", value: "Superintendencia Financiera · ISO 31000" },
    { label: "Enfoque", value: "Tecnología y acompañamiento especializado" },
  ],
} as const;

export const problem = {
  eyebrow: "El problema",
  title: "Cuando la información existe, pero no se convierte en decisiones",
  intro:
    "Tres situaciones que se repiten en entidades del sector solidario, independientemente de su tamaño.",
  items: [
    {
      title: "Sistemas que no aportan valor estratégico.",
      body: "Las entidades cuentan con información, aplicativos y reportes, pero con frecuencia funcionan de manera aislada y no se convierten en una visión útil para tomar decisiones.",
    },
    {
      title: "Regulación y gestión cada vez más exigentes.",
      body: "Cumplir no consiste solo en presentar reportes: exige metodologías, evidencia, seguimiento y capacidad de análisis sostenidas en el tiempo.",
    },
    {
      title: "Decisiones sin contexto suficiente.",
      body: "Conocer los indicadores propios es importante. Entender cómo se comporta la entidad frente al sector, su entorno y sus riesgos permite decidir mejor.",
    },
  ],
} as const;

export const about = {
  eyebrow: "Nosotros",
  title: "Experiencia que entiende el sector",
  base: "Novum integra profesionales con experiencia en gestión financiera, riesgos, cumplimiento, tecnología, analítica, planeación, procesos y dirección de organizaciones del sector solidario.",
  complement:
    "Nuestro equipo combina experiencia práctica en cooperativas, fondos de empleados, asociaciones mutuales, sistemas de administración de riesgos, transformación de procesos y desarrollo tecnológico.",
  capabilitiesLabel: "Capacidades",
  capabilities: ["Riesgos", "Finanzas", "Cumplimiento", "Planeación", "Analítica", "Tecnología"],
  /**
   * Perfiles individuales: NO se publican. Quedan en código tras
   * NEXT_PUBLIC_SHOW_TEAM (false en producción) por si se decide lo contrario.
   */
  teamTitle: "Nuestro equipo",
  team: [
    {
      name: "Yorgi Celiar Ríos Epalza",
      role: "Riesgos y sector solidario",
      bio: "Administrador financiero, especialista en riesgos. Ocho años de experiencia en el sector solidario.",
    },
    {
      name: "Aura Carolina González Guerrero",
      role: "Producto: riesgo de crédito",
      bio: "Ingeniera financiera, especialista en finanzas. Tres años de experiencia en el sector financiero.",
    },
    {
      name: "Ingrid Legret Angarita Villamizar",
      role: "Riesgo de crédito",
      bio: "Ocho años de experiencia en el sector solidario.",
    },
    {
      name: "Adrián López Aisales",
      role: "Producto y desarrollo",
      bio: "Ingeniero financiero, especialista en finanzas. Cinco años de experiencia en el sector real y en Mipymes.",
    },
    {
      name: "Andrés Felipe Lozano Arboleda",
      role: "Tecnología, seguridad y analítica",
      bio: "Ingeniero de sistemas.",
    },
  ],
} as const;

/**
 * Estados internos de producto. Información de gestión del proyecto:
 * NO se muestran en la web pública. Los conserva StatusTag para preview
 * o futuras interfaces donde exista una razón de producto.
 */
export type ProductStatus = "pruebas" | "desarrollo" | "diseno";

export const statusLabel: Record<ProductStatus, string> = {
  pruebas: "En pruebas con datos reales",
  desarrollo: "En desarrollo",
  diseno: "En diseño",
};

/** Tecnología Novum (portafolio 24 sep 2026): tres productos independientes, cada uno se contrata por separado. */
export const products = {
  eyebrow: "Tecnología Novum",
  title: "Software que convierte la metodología en gestión diaria",
  intro:
    "Las soluciones digitales de Novum organizan la información, mantienen la trazabilidad y facilitan que la administración y los órganos de gobierno decidan con evidencia. Cada producto se contrata por separado.",
  ver: "Conocer la tecnología",
  siar: {
    name: "Novum Risk",
    etiqueta: "RISK",
    fullName: "Administración integral de riesgos",
    /** Línea corta (resúmenes y páginas de línea). */
    resumen:
      "Matrices, controles, indicadores, límites, eventos, planes de acción y reportes para SARC, SARLAFT y SARO.",
    tagline: "Gestión integral de riesgos para el sector solidario.",
    description:
      "Matrices, controles, indicadores, límites, eventos, planes de acción y reportes para SARC, SARLAFT y SARO, con metodologías, medición, control, monitoreo y evidencias.",
    basis:
      "Diseñado tomando como referencia buenas prácticas de gestión de riesgos, ISO 31000 y referentes técnicos aplicables al sistema financiero, adaptados a las necesidades del sector solidario.",
    /** Componentes metodológicos que enuncia la descripción; alimentan la composición visual. */
    pillars: ["Metodologías", "Medición", "Control", "Monitoreo", "Matrices", "Indicadores", "Evidencias"],
  },
  others: [
    {
      name: "Novum Budget",
      etiqueta: "BUDGET",
      subtitle: "Presupuesto y desempeño financiero",
      tagline:
        "Formulación presupuestal, escenarios, ejecución mensual, variaciones, proyecciones y lectura gerencial.",
      open: false,
    },
    {
      name: "Novum Strategic Planning",
      etiqueta: "STRATEGIC PLANNING",
      subtitle: "Planeación estratégica",
      tagline:
        "Diagnóstico, DOFA, objetivos, indicadores, riesgos estratégicos, proyectos, metas y seguimiento.",
      open: false,
    },
    {
      name: "Más soluciones",
      etiqueta: "MÁS SOLUCIONES",
      tagline:
        "Seguimos construyendo herramientas especializadas para las necesidades reales del sector solidario.",
      open: true,
    },
  ],
} as const;

export const differentiators = {
  eyebrow: "Por qué es distinto",
  title: "Criterio sectorial, no solo software",
  items: [
    {
      title: "Analítica para decidir.",
      body: "La información adquiere valor cuando permite interpretar, comparar y tomar decisiones con mayor criterio.",
    },
    {
      title: "Evidencia para la gestión.",
      body: "Una gestión sólida requiere metodologías, soportes, trazabilidad y evidencia que permitan entender cómo se toman y se siguen las decisiones.",
    },
    {
      title: "Su entidad en contexto.",
      body: "Los indicadores propios cuentan una parte de la historia. Entender el comportamiento del sector y del entorno aporta contexto para interpretar mejor los resultados.",
    },
    {
      title: "Diagnóstico antes que solución.",
      body: "Antes de recomendar herramientas o acompañamiento, buscamos entender el nivel de madurez, las brechas y las necesidades reales de la entidad.",
    },
  ],
} as const;

export const finalCta = {
  eyebrow: "Demostración",
  title: "¿Quiere ver la plataforma con una cartera como la de su entidad?",
  body: "Agende una demostración de 45 minutos. La hacemos con información anonimizada de una entidad real, para que vea cómo se comporta el sistema con datos como los suyos.",
} as const;
