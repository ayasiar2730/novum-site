/**
 * Contenido del portafolio de soluciones — fuente: «Novum_Portafolio_Corporativo.pdf»
 * (24 sep 2026). Aquí vive lo que el sitio dice de las siete líneas, la
 * forma de trabajar, a quién acompañamos, los diferenciales y
 * las formas de vinculación; site.ts conserva la identidad, el contacto, los
 * productos (Tecnología Novum) y los textos del Home que no vienen del portafolio.
 *
 * Ajustes al publicar (decisiones del 24 sep 2026):
 *  - Novum Risk se describe con los sistemas que el software cubre hoy (SARC,
 *    SARLAFT y SARO); la consultoría de la línea 01 sí nombra los cuatro, porque
 *    no depende del software.
 *  - Oficial de cumplimiento y gestor de riesgos (servicios que ya estaban en la
 *    web y no aparecen en el portafolio) se conservan dentro de sus líneas.
 */

export type ProductoClave = "risk" | "budget" | "planning";

export interface Linea {
  slug: string;
  numero: string;
  titulo: string;
  /** Nombre corto para el menú de líneas y el hero. */
  corto: string;
  promesa: string;
  capacidades: readonly string[];
  valor: readonly { titulo: string; texto: string }[];
  /** Producto de software que acompaña la línea, si lo hay. */
  producto: ProductoClave | null;
}

export const lineas: readonly Linea[] = [
  {
    slug: "gestion-integral-de-riesgos",
    numero: "01",
    titulo: "Gestión integral de riesgos",
    corto: "Riesgos",
    promesa:
      "Diseñamos y fortalecemos sistemas de administración de riesgos que conectan gobierno, metodología, operación, información y seguimiento.",
    capacidades: [
      "Implementación y fortalecimiento del SIAR, desde el diagnóstico de brechas hasta su puesta en funcionamiento.",
      "Gestión especializada de SARC, SARL, SARLAFT y SARO, alineada con el perfil y la operación de la entidad.",
      "Diseño, actualización y documentación de matrices de riesgos, causas, controles, responsables y tratamientos.",
      "Metodologías de identificación, medición, monitoreo, control y seguimiento con criterios reproducibles.",
      "Construcción de indicadores, apetito, tolerancia, límites y alertas tempranas para la toma de decisiones.",
      "Acompañamiento a Comités de Riesgos y órganos de administración con lectura técnica y enfoque ejecutivo.",
      "Actualización de manuales, políticas, procedimientos, formatos e informes del sistema.",
      "Gestor de riesgos: gestión de riesgos tercerizada, con comités, indicadores, informes y seguimiento.",
      "Software integral para centralizar riesgos, controles, eventos, indicadores, planes de acción y reportes.",
    ],
    valor: [
      { titulo: "Control", texto: "Visión consolidada de exposiciones, límites y acciones." },
      { titulo: "Decisión", texto: "Información clara para comités y órganos de gobierno." },
      { titulo: "Trazabilidad", texto: "Evidencia del ciclo completo de gestión del riesgo." },
    ],
    producto: "risk",
  },
  {
    slug: "consultoria-financiera",
    numero: "02",
    titulo: "Consultoría financiera",
    corto: "Finanzas",
    promesa:
      "Convertimos la información financiera en planeación, escenarios y decisiones que protegen la sostenibilidad de la entidad.",
    capacidades: [
      "Planeación y estructuración financiera con objetivos, supuestos, metas y responsabilidades definidos.",
      "Elaboración, modelación y seguimiento presupuestal por centros, líneas, rubros y periodos.",
      "Análisis e implementación de indicadores financieros, de eficiencia, rentabilidad, calidad y metodología CAMEL.",
      "Gestión de liquidez, estructura de fondeo y portafolios de inversión con lectura de concentración y vencimientos.",
      "Análisis financiero ejecutivo para Gerencia, Junta, Consejo, comités y Asamblea.",
      "Proyecciones, sensibilidad y escenarios para anticipar impactos y evaluar decisiones.",
      "Construcción de flujos de caja operativos y proyectados para mejorar la capacidad de anticipación.",
      "Software de presupuesto con formulación, ejecución mensual, variaciones, alertas y reportes.",
    ],
    valor: [
      { titulo: "Planeación", texto: "Metas financieras conectadas con la estrategia." },
      { titulo: "Anticipación", texto: "Escenarios y flujos para decidir antes del impacto." },
      { titulo: "Seguimiento", texto: "Presupuesto vivo con variaciones y responsables." },
    ],
    producto: "budget",
  },
  {
    slug: "auditoria-y-aseguramiento",
    numero: "03",
    titulo: "Auditoría y aseguramiento de riesgos",
    corto: "Auditoría",
    promesa:
      "Evaluamos la madurez y efectividad de los sistemas para identificar brechas reales, priorizar acciones y fortalecer la confianza institucional.",
    capacidades: [
      "Auditorías especializadas sobre gobierno, políticas, procesos, metodologías, tecnología, divulgación y capacitación.",
      "Evaluación de diseño, implementación y efectividad operativa de controles clave.",
      "Revisión de cumplimiento frente a la regulación, los manuales internos y las mejores prácticas aplicables.",
      "Pruebas documentales y entrevistas para validar cómo funciona el sistema en la práctica.",
      "Clasificación de hallazgos por criticidad, impacto, urgencia y capacidad de corrección.",
      "Identificación de brechas, oportunidades de mejora y causas estructurales.",
      "Elaboración de planes de acción con responsables, plazos, entregables y criterios de cierre.",
      "Seguimiento independiente al avance y validación de evidencias de cumplimiento.",
    ],
    valor: [
      { titulo: "Objetividad", texto: "Una lectura independiente y basada en evidencia." },
      { titulo: "Prioridad", texto: "Brechas ordenadas según su impacto real." },
      { titulo: "Mejora", texto: "Planes de acción ejecutables y verificables." },
    ],
    producto: null,
  },
  {
    slug: "transformacion-institucional",
    numero: "04",
    titulo: "Transformación y fortalecimiento institucional",
    corto: "Transformación",
    promesa:
      "Acompañamos cambios complejos para que la tecnología, los procesos y la estructura organizacional evolucionen de forma ordenada.",
    capacidades: [
      "Acompañamiento funcional y financiero en migraciones de core de negocio y sistemas administrativos.",
      "Levantamiento, reingeniería y optimización de procesos críticos, eliminando reprocesos y puntos de falla.",
      "Fortalecimiento de estructuras administrativas, roles, responsabilidades y esquemas de coordinación.",
      "Optimización de procesos financieros, operativos, de cartera, tesorería y control.",
      "Gestión de proyectos de transformación tecnológica, pruebas, conciliaciones, salida en vivo y estabilización.",
      "Fortalecimiento del Gobierno Corporativo, comités, flujos de información y rendición de cuentas.",
      "Construcción de planes estratégicos participativos, medibles y conectados con la ejecución.",
      "Software para diagnóstico, formulación, riesgos estratégicos, indicadores, proyectos y seguimiento del plan.",
    ],
    valor: [
      { titulo: "Continuidad", texto: "Cambios controlados sin perder la operación." },
      { titulo: "Eficiencia", texto: "Procesos más simples, claros y sostenibles." },
      { titulo: "Dirección", texto: "Estrategia conectada con responsables y resultados." },
    ],
    producto: "planning",
  },
  {
    slug: "capacitacion-y-formacion",
    numero: "05",
    titulo: "Capacitación y formación",
    corto: "Formación",
    promesa:
      "Desarrollamos conocimiento aplicable para que empleados, directivos y órganos de administración comprendan, decidan y actúen con mayor seguridad.",
    capacidades: [
      "Formación en gestión integral de riesgos para equipos operativos, líderes, comités y cuerpos colegiados.",
      "Capacitación especializada en SARC y metodología de Pérdida Esperada.",
      "Talleres prácticos basados en casos, decisiones y situaciones propias del sector solidario.",
      "Programas para Juntas Directivas, Consejos de Administración y órganos de control.",
      "Fortalecimiento de la cultura de riesgos y su integración con la operación diaria.",
      "Inducciones para nuevos empleados y directivos sobre legislación solidaria, gobierno y responsabilidades.",
      "Mentoring en sistemas de riesgos, gestión de cartera, otorgamiento, tesorería y planeación financiera.",
      "Materiales, guías y ejercicios que facilitan la transferencia y permanencia del conocimiento.",
    ],
    valor: [
      { titulo: "Comprensión", texto: "Conceptos técnicos explicados de forma clara." },
      { titulo: "Aplicación", texto: "Aprendizaje conectado con el trabajo cotidiano." },
      { titulo: "Cultura", texto: "Equipos que reconocen y gestionan mejor el riesgo." },
    ],
    producto: null,
  },
  {
    slug: "cumplimiento-y-normatividad",
    numero: "06",
    titulo: "Cumplimiento, normatividad y gestión",
    corto: "Cumplimiento",
    promesa:
      "Traducimos las exigencias regulatorias en acciones, documentos y procesos que la entidad puede implementar, evidenciar y sostener.",
    capacidades: [
      "Atención y estructuración de respuestas a requerimientos de la Superintendencia de la Economía Solidaria.",
      "Actualización de manuales, reglamentos, políticas y marcos de actuación institucional.",
      "Elaboración de informes de gestión, riesgos, seguimiento y cumplimiento para órganos de gobierno.",
      "Diseño y actualización de procedimientos, instructivos, formatos y mecanismos de evidencia.",
      "Análisis de brechas regulatorias y construcción de hojas de ruta para su cierre.",
      "Acompañamiento en la implementación de obligaciones normativas y compromisos institucionales.",
      "Articulación entre regulación, procesos, responsables, controles y reportes.",
      "Seguimiento a planes de mejora derivados de supervisión, auditoría o decisiones internas.",
      "Oficial de cumplimiento: acompañamiento especializado para fortalecer la gestión de cumplimiento, el seguimiento y la documentación requerida por la entidad.",
    ],
    valor: [
      { titulo: "Claridad", texto: "Obligaciones convertidas en tareas concretas." },
      { titulo: "Evidencia", texto: "Documentación coherente con la práctica institucional." },
      { titulo: "Confianza", texto: "Respuesta organizada ante supervisión y gobierno." },
    ],
    producto: null,
  },
  {
    slug: "analitica-de-datos-y-automatizacion",
    numero: "07",
    titulo: "Analítica de datos y automatización",
    corto: "Analítica",
    promesa:
      "Transformamos datos dispersos en información confiable, visual y oportuna para dirigir la entidad, anticipar tendencias y reducir trabajo manual.",
    capacidades: [
      "Diagnóstico de fuentes, calidad, estructura, periodicidad y responsables de la información institucional.",
      "Diseño de modelos de datos que integran información financiera, cartera, asociados, riesgos y gestión.",
      "Construcción de dashboards ejecutivos en Power BI para Gerencia, Junta, Consejo, comités y líderes de proceso.",
      "Automatización de reportes periódicos, consolidaciones, cruces, validaciones y cálculos repetitivos.",
      "Diseño de indicadores, semáforos, alertas, tendencias y vistas comparativas para apoyar decisiones.",
      "Depuración, homologación y estandarización de bases para mejorar consistencia y trazabilidad.",
      "Integración de información proveniente de core, archivos de gestión, fuentes regulatorias y herramientas internas.",
      "Transferencia de conocimiento para que los equipos consulten, actualicen y aprovechen sus tableros.",
    ],
    valor: [
      { titulo: "Visibilidad", texto: "Tableros claros para entender la situación de la entidad." },
      { titulo: "Eficiencia", texto: "Menos tareas manuales y menor riesgo de error." },
      { titulo: "Inteligencia", texto: "Datos convertidos en alertas, tendencias y decisiones." },
    ],
    producto: null,
  },
];

export const lineaPorSlug = (slug: string) => lineas.find((l) => l.slug === slug) ?? null;

/** Rótulos de las páginas y bloques de líneas. */
export const solucionesTexto = {
  eyebrow: "Soluciones",
  titulo: "Siete líneas que se conectan",
  intro:
    "Integramos conocimiento especializado, tecnología y acompañamiento para convertir los retos de las entidades solidarias en decisiones, control y resultados sostenibles.",
  capacidadesLabel: "Capacidades y servicios",
  valorLabel: "Valor que recibe la entidad",
  productoLabel: "Tecnología de la línea",
  otrasLabel: "Las otras líneas",
  verLinea: "Ver la línea",
  verTodas: "Ver las siete líneas",
} as const;

/** Propuesta de valor. */
export const propuesta = {
  eyebrow: "Nuestra propuesta de valor",
  titulo: "Un aliado para gestionar con visión, rigor y tecnología",
  intro:
    "Acompañamos a cooperativas, asociaciones mutuales, fondos de empleados y demás organizaciones solidarias en la construcción de capacidades que permanecen en el tiempo.",
  pilares: [
    {
      titulo: "Innovación",
      texto: "Metodologías actuales, analítica y soluciones digitales que simplifican la gestión.",
    },
    {
      titulo: "Tecnología",
      texto: "Software especializado para organizar, medir, hacer seguimiento y reportar.",
    },
    {
      titulo: "Solidaridad",
      texto: "Conocimiento aplicado a la realidad normativa, financiera y humana del sector.",
    },
  ],
} as const;

/** Cómo trabajamos. */
export const metodologia = {
  eyebrow: "Cómo trabajamos",
  titulo: "De la necesidad al resultado verificable",
  intro:
    "Cada proyecto se estructura con alcance, responsables, entregables y evidencia. La tecnología acompaña el proceso, pero la apropiación institucional es el verdadero resultado.",
  pasos: [
    { titulo: "Entender", texto: "Diagnóstico y priorización" },
    { titulo: "Diseñar", texto: "Metodología y hoja de ruta" },
    { titulo: "Implementar", texto: "Procesos, herramientas y formación" },
    { titulo: "Medir", texto: "Indicadores, controles y seguimiento" },
    { titulo: "Mejorar", texto: "Decisiones y planes de acción" },
  ],
  capacidadTitulo: "Una implementación que deja capacidad instalada",
  capacidad: [
    "Documentación clara y alineada con la operación real.",
    "Equipos que entienden la metodología y pueden sostenerla.",
    "Información trazable para comités, Junta, Consejo y supervisión.",
    "Herramientas configuradas para la realidad de cada entidad.",
    "Seguimiento que conecta hallazgos, decisiones y resultados.",
  ],
  ver: "Ver cómo trabajamos",
} as const;

/** A quién acompañamos. */
export const segmentos = {
  eyebrow: "A quién acompañamos",
  titulo: "Soluciones diseñadas desde el conocimiento del sector",
  intro:
    "Entendemos las particularidades del modelo solidario, sus órganos de administración, su regulación y la necesidad de equilibrar sostenibilidad financiera, gestión de riesgos e impacto social.",
  items: [
    { titulo: "Cooperativas", texto: "Ahorro y crédito, aporte y crédito, multiactivas e integrales." },
    { titulo: "Asociaciones mutuales", texto: "Protección social, ahorro, crédito y servicios mutuales." },
    {
      titulo: "Fondos de empleados",
      texto: "Gestión financiera, riesgos, gobierno y servicios a asociados.",
    },
    {
      titulo: "Otras organizaciones",
      texto: "Entidades solidarias y organizaciones que requieren fortalecer su gestión.",
    },
  ],
  audiencias:
    "Trabajamos con la Gerencia, áreas financieras y de riesgos, cumplimiento, control interno, comités, Juntas Directivas, Consejos de Administración y demás cuerpos colegiados.",
} as const;

/** Por qué Novum. */
export const diferenciales = {
  eyebrow: "Por qué Novum",
  titulo: "Especialización que se traduce en ejecución",
  intro:
    "No entregamos documentos aislados. Conectamos metodología, personas, procesos y tecnología para que la solución funcione después de la implementación.",
  items: [
    {
      titulo: "Especialización sectorial",
      texto: "Experiencia aplicada a entidades vigiladas y a la dinámica real del sector solidario.",
    },
    {
      titulo: "Visión integral",
      texto: "Riesgos, finanzas, estrategia, procesos, gobierno y cumplimiento conectados.",
    },
    {
      titulo: "Tecnología propia",
      texto: "Software diseñado para organizar la gestión y convertir datos en seguimiento.",
    },
    {
      titulo: "Acompañamiento cercano",
      texto: "Trabajo colaborativo con equipos directivos, técnicos y órganos de administración.",
    },
    {
      titulo: "Rigor metodológico",
      texto: "Modelos documentados, indicadores, evidencia y trazabilidad de las decisiones.",
    },
    {
      titulo: "Orientación a resultados",
      texto: "Planes viables, responsables definidos y seguimiento hasta el cierre de brechas.",
    },
  ],
} as const;

/** Formas de vinculación. */
export const vinculacion = {
  eyebrow: "Formas de vinculación",
  titulo: "Podemos acompañar una necesidad puntual o una transformación completa",
  intro:
    "El alcance se construye según el nivel de madurez, la prioridad, el tamaño de la entidad y la capacidad de su equipo.",
  items: [
    {
      titulo: "Consultoría especializada",
      texto: "Diagnóstico, diseño metodológico, documentos, recomendaciones y hoja de ruta.",
    },
    {
      titulo: "Implementación",
      texto: "Acompañamiento práctico para poner en funcionamiento sistemas, procesos y controles.",
    },
    {
      titulo: "Software como servicio",
      texto: "Configuración, puesta en marcha, soporte y uso mensual de las soluciones Novum.",
    },
    {
      titulo: "Auditoría independiente",
      texto: "Evaluación de madurez, diseño y efectividad con hallazgos y planes de acción.",
    },
    {
      titulo: "Capacitación y mentoring",
      texto: "Formación aplicada para empleados, directivos y cuerpos colegiados.",
    },
    {
      titulo: "Acompañamiento continuo",
      texto: "Seguimiento periódico a riesgos, finanzas, estrategia y cumplimiento.",
    },
  ],
} as const;
