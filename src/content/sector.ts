/**
 * Contenido de la sección «Inteligencia del sector» (Bloque 2).
 * Textos, no números: las cifras solo llegan por un snapshot aprobado y trazable
 * (src/lib/sector/source.ts). Fuente de verdad: docs/novum-web-fase0.md §5.9.
 *
 * Distinción deliberada del copy: primero el valor del análisis sectorial,
 * después la capacidad de Novum. Nada afirma que una experiencia numérica esté
 * operativa mientras no haya snapshot.
 */

export const sector = {
  id: "inteligencia",
  eyebrow: "Inteligencia del sector",
  title: "Datos públicos convertidos en información útil para tomar mejores decisiones.",
  intro:
    "El análisis sectorial permite transformar información pública en contexto para comprender tendencias, comportamiento financiero y dinámicas del sector solidario.",
  capacidad:
    "En Novum combinamos analítica, conocimiento sectorial y lectura financiera para convertir esa información en una herramienta útil para la gestión.",

  fuente: {
    datos: "Fuente de información sectorial: Superintendencia de la Economía Solidaria.",
    procesamiento: "Análisis y procesamiento: Novum Integral.",
    /** Se antepone a la fecha de corte cuando hay snapshot. */
    corteLabel: "Corte",
    coberturaLabel: "Cobertura",
    unidadNota: "Cifras en pesos colombianos; «billón» equivale a un millón de millones.",
  },

  /** Los tres capítulos de la versión editorial (sin snapshot). Sin gráficas, sin cifras. */
  capitulos: [
    {
      numero: "01",
      titulo: "Crecimiento y evolución",
      pregunta: "¿Cómo está cambiando el sector en el tiempo?",
      texto:
        "El análisis entre cortes permite entender la evolución de activos, cartera, depósitos, patrimonio y otras variables relevantes.",
    },
    {
      numero: "02",
      titulo: "Riesgo y calidad financiera",
      pregunta: "¿Qué señales permiten interpretar el comportamiento del riesgo?",
      texto:
        "La lectura de indicadores de cartera, deterioro, cobertura y dispersión permite identificar comportamientos que requieren mayor contexto.",
    },
    {
      numero: "03",
      titulo: "Estructura y concentración",
      pregunta: "¿Cómo está compuesto el sector?",
      texto:
        "Tipo de entidad, territorio, tamaño y concentración ayudan a comprender dónde se encuentra la actividad y cómo se distribuye.",
    },
  ],

  /** Etiquetas de la versión con snapshot. */
  conDatos: {
    kpisLabel: "Indicadores principales",
    historiasLabel: "Tres lecturas",
    lecturaLabel: "Lectura",
    metodologiaLabel: "Metodología",
    universoLabel: "Universo",
    limitacionesLabel: "Alcance y limitaciones",
    contextoRangosLabel: "Rangos de tamaño por activo",
    contextoRangosNota: "Participación de cada rango en el número de entidades y en el activo del sector.",
  },

  contexto: {
    eyebrow: "Su entidad en contexto",
    title: "No vea solamente el sector. Entienda su posición dentro de él.",
    body: "Una lectura sectorial adquiere mayor valor cuando permite contrastar los indicadores de una entidad con organizaciones comparables, su territorio y su tipo de organización. Esa es la dirección de la inteligencia analítica de Novum.",
    /** El botón reutiliza `cta.primary` de site.ts: un solo texto y un solo destino de demostración en toda la web. */
  },

  /** Solo aparece con la fixture de desarrollo (source.ts); nunca en producción. */
  fixtureBanner: "FIXTURE DE DESARROLLO — valores sintéticos, no publicar",
} as const;
