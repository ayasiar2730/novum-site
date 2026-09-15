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
  tagline: "Inteligencia que anticipa, análisis que transforma, decisiones que generan valor.",
  shortDescription: "Software y consultoría para el sector solidario.",
  footerLine: "Software y acompañamiento especializado para el sector solidario.",
  metaDescription:
    "Empresa colombiana de software y consultoría para cooperativas, fondos de empleados y mutuales: gestión de riesgos, presupuesto y planeación estratégica.",
  institutional:
    "Novum Integral SAS es una empresa colombiana de software y consultoría especializada en el sector de economía solidaria: cooperativas de ahorro y crédito, fondos de empleados y asociaciones mutuales. Desarrollamos SIAR, un sistema integral de administración de riesgos, y productos independientes para presupuesto y planeación estratégica, y acompañamos a las entidades con diagnóstico, implementación, capacitación y servicios especializados como oficial de cumplimiento y gestor de riesgos. Somos un equipo especializado, con experiencia directa en el sector.",
  year: 2026,
} as const;

export const contact = {
  emails: ["contacto@novumintegral.com", "administracion@novumintegral.com"],
  whatsapp: [
    { number: "573015661091", display: "+57 301 566 1091" },
    { number: "573214809336", display: "+57 321 480 9336" },
  ],
  demoMessage: "Hola, quiero agendar una demostración de Novum Integral para mi entidad.",
} as const;

export const nav = [
  { label: "Soluciones", href: "#soluciones" },
  { label: "Acompañamiento", href: "#servicios" },
  { label: "Nosotros", href: "#nosotros" },
  { label: "Contacto", href: "#contacto" },
] as const;

export const cta = {
  primary: "Agendar una demostración",
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
    { label: "Estándares", value: "Superintendencia Financiera · ISO 31000" },
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

export const products = {
  eyebrow: "Soluciones",
  title: "Tecnología especializada para el sector solidario.",
  intro:
    "Cada solución resuelve un frente distinto de la gestión de su entidad y se contrata por separado, con el mismo criterio sectorial y el mismo acompañamiento.",
  siar: {
    name: "SIAR",
    fullName: "Sistema Integral de Administración de Riesgos",
    tagline: "Gestión integral de riesgos para el sector solidario.",
    description:
      "Una solución orientada a fortalecer la gestión de riesgos mediante metodologías, medición, control, monitoreo, matrices, indicadores y evidencias.",
    basis:
      "Diseñado tomando como referencia buenas prácticas de gestión de riesgos, ISO 31000 y referentes técnicos aplicables al sistema financiero, adaptados a las necesidades del sector solidario.",
    /** Componentes metodológicos que enuncia la descripción; alimentan la composición visual. */
    pillars: ["Metodologías", "Medición", "Control", "Monitoreo", "Matrices", "Indicadores", "Evidencias"],
  },
  others: [
    {
      name: "Presupuesto",
      tagline:
        "Planeación, construcción, seguimiento y análisis presupuestal orientado a la toma de decisiones.",
      open: false,
    },
    {
      name: "Planeación estratégica",
      tagline:
        "Objetivos, indicadores, iniciativas, responsables y seguimiento dentro de una metodología estructurada.",
      open: false,
    },
    {
      name: "Más soluciones",
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

export const services = {
  eyebrow: "Acompañamiento",
  title: "Cómo acompañamos",
  intro: "El software es la herramienta. El acompañamiento es lo que hace que funcione dentro de la entidad.",
  items: [
    {
      title: "Diagnóstico de madurez",
      body: "Evaluación del sistema de riesgos frente a la norma y a las buenas prácticas, con una calificación y un plan de cierre de brechas.",
    },
    {
      title: "Implementación y consultoría",
      body: "Políticas, manuales, reglamentos de comités y acompañamiento hasta que el sistema opera solo.",
    },
    {
      title: "Capacitación",
      body: "Para consejos, juntas, comités y equipos operativos. Metodologías activas, no presentaciones de tres horas.",
    },
    {
      title: "Auditoría SIAR",
      body: "Evaluamos el nivel de implementación y madurez del Sistema Integral de Administración de Riesgos de su entidad, así como su alineación con los requerimientos aplicables, e identificamos fortalezas, brechas y oportunidades de mejora en gobierno, metodologías, documentación, controles, monitoreo y evidencia.",
    },
    {
      title: "Oficial de cumplimiento",
      body: "Acompañamiento especializado para fortalecer la gestión de cumplimiento, el seguimiento y la documentación requerida por la entidad.",
    },
    {
      title: "Gestor de riesgos",
      body: "Gestión de riesgos tercerizada: comités, indicadores, informes y seguimiento.",
    },
  ],
} as const;

export const finalCta = {
  eyebrow: "Demostración",
  title: "¿Quiere ver la plataforma con una cartera como la de su entidad?",
  body: "Agende una demostración de 45 minutos. La hacemos con información anonimizada de una entidad real, para que vea cómo se comporta el sistema con datos como los suyos.",
} as const;
