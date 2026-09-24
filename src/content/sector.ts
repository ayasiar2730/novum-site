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

  /**
   * Etiquetas del Observatorio (contrato v2). Son rótulos de interfaz, no copy
   * comercial ni cifras: los números y las lecturas llegan en el snapshot.
   */
  informe: {
    titulo: "Informe sectorial",
    cortePrefijo: "Corte",
    indiceLabel: "Contenido",
    resumenLabel: "Resumen ejecutivo",
    resumenIntro:
      "Los hallazgos principales del corte. El dato sale del motor sectorial; la lectura es de Novum.",
    datoLabel: "Dato del corte",
    lecturaLabel: "Lectura Novum",
    verCapitulo: "Ver capítulo",
    fotoLabel: "Fotografía del sector",
    fotoNota:
      "Con un solo corte procesado, este informe describe cómo está compuesto y cómo se comporta el sector en la fecha de corte. La evolución aparecerá cuando exista un segundo corte comparable.",
    dimension: {
      pregunta: "¿Qué tamaño tiene el sector en este corte?",
      secundariasLabel: "Otras magnitudes del corte",
      respectoLabel: "respecto de la cifra principal",
    },
    riesgo: {
      pregunta: "¿Cómo se comporta el riesgo de cartera?",
      ponderadoLabel: "Indicador del sector",
      ponderadoNota:
        "Fórmula de la metodología aplicada a las sumas del universo (ponderado), no promedio de indicadores.",
      distribucionLabel: "Distribución entre entidades",
      medianaLabel: "Mediana",
      mediaLabel: "Media",
      p25Label: "P25",
      p75Label: "P75",
      nLabel: "entidades con dato",
      sinDenominador: "Sin denominador en este corte",
      otrosLabel: "Otros indicadores del corte",
      direccion: {
        menor_es_mejor: "Menor es mejor",
        mayor_es_mejor: "Mayor es mejor",
        neutro: "Sin dirección",
      },
    },
    estructura: {
      pregunta: "¿Cómo está compuesto el sector?",
      entidadesLabel: "entidades",
      participacionLabel: "participación",
      concentracionLabel: "Concentración",
    },
    evolucion: {
      pregunta: "¿Cómo cambia el sector entre cortes comparables?",
      baseLabel: "Corte base",
      actualLabel: "Corte actual",
      variacionLabel: "Variación",
      comparablesLabel: "Entidades comparables",
      criterioLabel: "Criterio de comparabilidad",
      exclusionesLabel: "Exclusiones",
      serieLabel: "Serie",
    },
    metodologia: {
      label: "Metodología y fuentes",
      pregunta: "¿De dónde salen estas cifras y qué no dicen?",
      fuenteDatosLabel: "Fuente de datos",
      procesamientoLabel: "Procesamiento y análisis",
      fechaCorteLabel: "Fecha de corte",
      fechaProcesamientoLabel: "Fecha de procesamiento",
      metodologiaLabel: "Metodología",
      evaluadorLabel: "Evaluador",
      universoLabel: "Universo y cobertura",
      exclusionesLabel: "Exclusiones",
      definicionesLabel: "Definiciones",
      formulaLabel: "Fórmula",
      unidadLabel: "Unidad",
      comparabilidadLabel: "Criterio de comparabilidad",
      limitacionesLabel: "Limitaciones",
      privacidadLabel: "Privacidad",
      privacidadTexto:
        "Solo se publican agregados. Ninguna categoría con menos de {k} entidades se muestra por separado; no se publican nombres, NIT ni cifras de una entidad identificable.",
    },
  },

  /**
   * Catálogo de informes (fase 2): la web es el catálogo y la puerta de entrada;
   * el informe completo es la página del informe y su PDF ejecutivo. Rótulos y
   * texto institucional; las cifras y los títulos llegan en el snapshot.
   */
  catalogo: {
    intro:
      "Lecturas del sector solidario colombiano construidas con los datos oficiales que las entidades reportan a la Superintendencia de la Economía Solidaria. Cada informe se publica en la web y como PDF ejecutivo descargable.",
    destacadoLabel: "Último informe publicado",
    publicadosLabel: "Informes publicados",
    contenidoLabel: "Hallazgos del corte",
    leer: "Leer el informe",
    descargar: "Descargar PDF",
    todos: "Ver todos los informes",
    pdfLabel: "PDF",
    paginasLabel: "páginas",
    entidadesLabel: "entidades analizadas",
    entidadesAnalizadasLabel: "Entidades analizadas",
    reportantesLabel: "reportantes",
    estadoLabel: "Estado del corte",
    /** Descripción (metadatos) de la página de una edición; {fecha} y {n} salen del snapshot. */
    descripcionEdicion:
      "Sector solidario colombiano con corte al {fecha}: {n} entidades analizadas con los datos oficiales de la Supersolidaria. Resumen ejecutivo, riesgo de cartera, estructura del sector y metodología.",
    verCatalogo: "Ver los informes sectoriales",
    comoLabel: "Cómo se elaboran",
    como: [
      {
        titulo: "Datos oficiales",
        texto:
          "La información financiera que las entidades reportan a la Supersolidaria, en la fecha de corte que indica cada informe.",
      },
      {
        titulo: "Un método publicado",
        texto:
          "Los indicadores salen del motor sectorial de Novum y se publican con su fórmula, su universo, sus exclusiones y sus limitaciones.",
      },
      {
        titulo: "Solo agregados",
        texto:
          "Ninguna categoría con menos de {k} entidades se muestra por separado; no se publican nombres, NIT ni cifras de una entidad identificable.",
      },
      {
        titulo: "Dato y lectura, separados",
        texto:
          "Cada hallazgo distingue el dato del corte de la Lectura Novum, que es la interpretación del equipo y se aprueba antes de publicar.",
      },
    ],
  },

  /** Solo aparece con la fixture de desarrollo (source.ts); nunca en producción. */
  fixtureBanner: "FIXTURE DE DESARROLLO — valores sintéticos, no publicar",
} as const;
