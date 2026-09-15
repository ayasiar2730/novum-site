/**
 * Contenido del sitio — fuente de verdad: docs/novum-web-fase0.md
 * Todo texto visible sale de aquí. No inventar datos que no estén en el documento.
 */

export const site = {
  name: "Novum Integral",
  legalName: "Novum Integral SAS",
  url: "https://novumintegral.com",
  appUrl: "https://app.novumintegral.com",
  tagline: "Inteligencia que anticipa, análisis que transforma, decisiones que generan valor.",
  shortDescription: "Software y consultoría para el sector solidario.",
  metaDescription:
    "Empresa colombiana de software y consultoría para cooperativas, fondos de empleados y mutuales: gestión de riesgos, presupuesto y planeación estratégica.",
  institutional:
    "Novum Integral SAS es una empresa colombiana de software y consultoría especializada en el sector de economía solidaria: cooperativas de ahorro y crédito, fondos de empleados y asociaciones mutuales. Construimos SIAR, un sistema integral de administración de riesgos, y módulos de presupuesto y planeación estratégica que comparten los mismos datos, acompañados de diagnóstico, implementación y capacitación. Somos un equipo pequeño y especializado, con experiencia directa en el sector.",
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
  { label: "Servicios", href: "#servicios" },
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
    "Una plataforma integral y un equipo que conoce el sector, para que su entidad cumpla con la norma y decida con datos.",
  facts: [
    { label: "Sector", value: "Cooperativas, fondos de empleados y mutuales" },
    { label: "Estándares", value: "Superintendencia Financiera · ISO 31000" },
    { label: "Estado", value: "SIAR en pruebas con datos reales" },
  ],
} as const;

export const problem = {
  eyebrow: "El problema",
  title: "Lo que vemos en las entidades del sector",
  intro:
    "Tres situaciones que se repiten en entidades pequeñas y medianas, y que ningún reporte trimestral resuelve por sí solo.",
  items: [
    {
      title: "Cierres a mano.",
      body: "Los indicadores de cartera, liquidez y solvencia se arman en hojas de cálculo cada mes. Cada fórmula es un riesgo, y el error aparece cuando el reporte ya salió.",
    },
    {
      title: "La norma no deja de crecer.",
      body: "SARC, SARL, SARO, SARLAFT: cada sistema exige políticas, comités, evidencias y reportes. Y los equipos que los sostienen son de dos o tres personas.",
    },
    {
      title: "Decisiones sin tablero.",
      body: "Consejos de administración y juntas directivas aprueban colocaciones, tasas y presupuestos con información de hace dos meses — o sin ella.",
    },
  ],
} as const;

export const about = {
  eyebrow: "Nosotros",
  title: "Conocemos el sector desde adentro",
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

export type ProductStatus = "pruebas" | "desarrollo" | "diseno";

export const products = {
  eyebrow: "Lo que construimos",
  title: "Una sola plataforma, tres módulos que comparten los mismos datos.",
  intro: "Su entidad contrata lo que necesita hoy y amplía cuando crece.",
  siar: {
    name: "SIAR",
    fullName: "Sistema Integral de Administración de Riesgos",
    status: "pruebas" as ProductStatus,
    paragraphs: [
      "Riesgo de crédito con segmentación de cartera, análisis de deterioro y mapas de riesgo. Comités de expertos con calificación individual y trazabilidad completa para auditoría. Indicadores macroeconómicos actualizados automáticamente y comparativo de su entidad frente al sector. El informe integral de riesgos se exporta con un clic.",
      "Construido sobre los estándares de la Superintendencia Financiera y la norma ISO 31000, para que su entidad esté por encima de lo que exige la Supersolidaria, no apenas al día.",
    ],
    features: [
      "Segmentación de cartera, análisis de deterioro y mapas de riesgo",
      "Comités de expertos con calificación individual y trazabilidad para auditoría",
      "Indicadores macroeconómicos automáticos y comparativo frente al sector",
      "Informe integral de riesgos exportable con un clic",
    ],
    roadmap: "Riesgo de crédito primero; liquidez, operativo, mercado y LA/FT en las siguientes fases.",
    frameCaption: "Captura del módulo SARC · Fase 1",
  },
  others: [
    {
      name: "Presupuesto y ejecución presupuestal",
      status: "desarrollo" as ProductStatus,
      body: "Presupuesto por escenarios, seguimiento de la ejecución y alertas cuando una partida se desvía. Integrado con los indicadores de riesgo, para que el presupuesto refleje la cartera real y no solo el histórico.",
    },
    {
      name: "Planeación estratégica",
      status: "diseno" as ProductStatus,
      body: "Objetivos, indicadores y responsables en un solo lugar, con seguimiento periódico. Cierra el ciclo: lo que la entidad define en la planeación se mide en el presupuesto y se controla en los riesgos.",
    },
  ],
} as const;

export const roadmap = {
  title: "Hoja de ruta",
  intro:
    "Un solo sistema que crece módulo a módulo. El orden es deliberado: los riesgos alimentan el presupuesto, y ambos la planeación.",
} as const;

export const statusLabel: Record<ProductStatus, string> = {
  pruebas: "En pruebas con datos reales",
  desarrollo: "En desarrollo",
  diseno: "En diseño",
};

export const differentiators = {
  eyebrow: "Por qué es distinto",
  title: "Criterio sectorial, no solo software",
  items: [
    {
      title: "Analítica en todo.",
      body: "Cada módulo incluye analítica de datos. No es un informe aparte que se compra después.",
    },
    {
      title: "Evidencia para la auditoría, creada en el proceso.",
      body: "Las calificaciones de los comités quedan registradas persona por persona. Cuando llega la revisoría fiscal o la Supersolidaria, el soporte ya existe.",
    },
    {
      title: "Su entidad frente al sector.",
      body: "No solo sus propios números: dónde está frente al promedio en cobertura, deterioro y crecimiento.",
    },
    {
      title: "Diagnóstico antes que software.",
      body: "Empezamos midiendo la madurez del sistema de riesgos de su entidad. Cada seis meses se repite, para ver la evolución con datos y no con impresiones.",
    },
  ],
} as const;

export const services = {
  eyebrow: "Servicios",
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
      title: "Transformación digital",
      body: "Acompañamiento para pasar del Excel a procesos digitales, a la medida de entidades pequeñas y medianas.",
    },
  ],
} as const;

export const finalCta = {
  eyebrow: "Demostración",
  title: "¿Quiere ver la plataforma con una cartera como la de su entidad?",
  body: "Agende una demostración de 45 minutos. La hacemos con información anonimizada de una entidad real, para que vea cómo se comporta el sistema con datos como los suyos.",
} as const;
