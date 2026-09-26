/**
 * Contenido del módulo «Inteligencia sectorial»: textos, no números. Las cifras
 * llegan en el archivo del corte (contrato novum.inteligencia-sectorial/1), que
 * produce el motor sectorial de Novum sobre los archivos oficiales de la
 * Supersolidaria. Aquí no hay ninguna cifra ni conclusión escrita a mano.
 */

export const inteligencia = {
  ruta: "/inteligencia-sectorial",
  titulo: "Inteligencia sectorial",
  descripcion:
    "Dos informes interactivos del sector solidario colombiano con los datos oficiales de la Supersolidaria: cartera y riesgo, y panorama financiero. Por sector, tipo de entidad, departamento y entidad.",
  eyebrow: "Inteligencia del sector",
  intro:
    "Los estados financieros que publica la Supersolidaria, procesados por el motor sectorial de Novum y organizados para responder dos preguntas: cómo está la cartera del sector y cómo se mueve su balance. Filtre por tipo de entidad y departamento, o busque una entidad para ver dónde está.",
  informesLabel: "Los informes",
  edicionesLabel: "Ediciones en PDF",
  edicionesTexto:
    "Las ediciones ejecutivas del informe sectorial, con lectura Novum, siguen disponibles para descargar.",
  edicionesCta: "Ver las ediciones en PDF",
  abrir: "Abrir el informe",
  corteLabel: "Corte",
  baseLabel: "comparado con",
  entidadesLabel: "entidades",
  sinDatos:
    "Todavía no hay un corte procesado para publicar. Cuando el motor sectorial procese los archivos oficiales de la Supersolidaria, los informes aparecerán aquí.",
  cargando: "Cargando el corte…",
  errorCarga: "No se pudo cargar el corte. Recargue la página; si persiste, escríbanos.",

  fuente: {
    datos:
      "Fuente: Superintendencia de la Economía Solidaria (estados financieros de cuentas principales y a seis dígitos).",
    procesamiento: "Procesamiento: motor sectorial de Novum Integral. Cálculo Novum sobre datos públicos.",
    unidades:
      "Cifras en pesos colombianos. bn = billones (millón de millones); mm = miles de millones; M = millones.",
    metodologiaLabel: "Metodología",
    archivosLabel: "Archivos oficiales usados",
  },

  informes: {
    "cartera-riesgo": {
      titulo: "Cartera y riesgo",
      corto: "Cartera y riesgo",
      descripcion:
        "Calidad de la cartera de las cooperativas especializadas de ahorro y crédito y las asociaciones mutuales: índice de cartera en mora, zonas de riesgo, posicionamiento, pares y recomendaciones.",
      pregunta: "¿Cómo está la cartera del sector y dónde está cada entidad?",
      secciones: [
        { id: "resumen", label: "Resumen", texto: "El panorama del corte en una lectura." },
        { id: "sector", label: "Vista sector", texto: "Cómo se reparte el riesgo entre las entidades." },
        {
          id: "posicionamiento",
          label: "Posicionamiento",
          texto: "Tamaño frente a mora, entidad por entidad.",
        },
        {
          id: "mora",
          label: "Análisis de mora",
          texto: "La cartera en mora por categoría y quién la concentra.",
        },
        { id: "pares", label: "Benchmarking", texto: "Una entidad frente a sus pares comparables." },
        { id: "recomendaciones", label: "Recomendaciones", texto: "Señales del corte y qué mirar." },
      ],
    },
    "panorama-financiero": {
      titulo: "Panorama financiero",
      corto: "Panorama financiero",
      descripcion:
        "El balance y los resultados del sector: crecimiento de activo, cartera, pasivo, depósitos, patrimonio y aportes; calidad de cartera, liquidez, rentabilidad, intermediación, CAMEL y saldos.",
      pregunta: "¿Cómo se mueve el balance del sector frente al año anterior?",
      secciones: [
        { id: "resumen", label: "Resumen", texto: "Las cifras que resumen el corte." },
        { id: "crecimiento", label: "Crecimiento", texto: "Variación anual de las principales cuentas." },
        { id: "calidad", label: "Calidad de cartera", texto: "Mora, castigos y coberturas." },
        { id: "liquidez", label: "Liquidez y estructura", texto: "Activos líquidos y activo productivo." },
        { id: "rentabilidad", label: "Rentabilidad", texto: "Márgenes, eficiencia, excedentes y ROE." },
        {
          id: "intermediacion",
          label: "Intermediación",
          texto: "Tasa de colocación, costo de depósitos y margen.",
        },
        { id: "camel", label: "CAMEL", texto: "Los indicadores clave, lado a lado." },
        { id: "saldos", label: "Saldos", texto: "Las principales cifras del balance." },
      ],
    },
  },

  filtros: {
    etiqueta: "Filtros del informe",
    tipo: "Tipo de entidad",
    tipoTodos: "Todos los tipos",
    segmento: "Segmento",
    segmentoTodos: "Consolidado",
    segmentos: { COOPERATIVAS: "Cooperativas de ahorro y crédito", MUTUALES: "Asociaciones mutuales" },
    departamento: "Departamento",
    departamentoTodos: "Todos los departamentos",
    entidad: "Entidad",
    entidadPlaceholder: "Nombre, sigla o código",
    entidadQuitar: "Quitar entidad",
    limpiar: "Limpiar filtros",
    aplica: "Los filtros aplican a todas las secciones del informe.",
    sinResultados: "Ninguna entidad coincide.",
    miEntidad: "Su entidad",
  },

  navegacion: {
    secciones: "Secciones del informe",
    seccionMovil: "Sección",
    cambiarInforme: "Informe",
  },

  ficha: {
    boton: "Cómo se calcula",
    formula: "Qué mide",
    unidad: "Unidad",
    periodo: "Periodo",
    periodos: {
      actual: "Corte actual",
      base: "Mismo mes del año anterior",
      actual_vs_base: "Corte actual frente al mismo mes del año anterior",
    },
    unidades: { porcentaje: "Porcentaje", pesos: "Pesos colombianos", veces: "Veces" },
    fuente: "Fuente",
    universo: "Universo",
    nota: "Nota de método",
    cerrar: "Cerrar",
  },

  vacios: {
    grupo: "No hay entidades con esa combinación de filtros.",
    entidad: "Busque una entidad en los filtros para ver su posición en esta lectura.",
    sinBase: "Esta entidad no reportó el corte del año anterior: sus crecimientos no se pueden calcular.",
    sinPares: "No hay pares comparables en su segmento con una cartera entre 40 % y 160 % de la suya.",
  },

  /** Nombres cortos de las cifras para los encabezados de tabla (el nombre completo va en su ficha y en el título). */
  cortos: {
    activo: "Activo",
    cartera_creditos: "Cartera",
    pasivo: "Pasivo",
    depositos: "Depósitos",
    patrimonio: "Patrimonio",
    aportes_sociales: "Aportes",
    excedente: "Excedente",
    cartera_bruta: "Cartera bruta",
    icm: "ICM",
    icm_con_castigos: "ICM con castigos",
    cobertura_cde: "Cobertura CDE",
    cobertura_general: "Cobertura general",
    activo_productivo: "Act. productivo (actual)",
    liquidez: "Liquidez",
    margen_operacional: "Margen operacional",
    eficiencia_operativa: "Eficiencia",
    margen_neto: "Margen neto",
    tasa_colocacion_bruta: "Tasa colocación",
    costo_depositos: "Costo depósitos",
    margen_intermediacion: "Margen intermediación",
    crecimiento_activo: "Crec. activo",
    crecimiento_cartera: "Crec. cartera",
    crecimiento_pasivo: "Crec. pasivo",
    crecimiento_depositos: "Crec. depósitos",
    crecimiento_patrimonio: "Crec. patrimonio",
    crecimiento_aportes: "Crec. aportes",
    roe_simple: "ROE",
    icm_anterior: "ICM año anterior",
    activo_productivo_base: "Activo productivo",
    cobertura_general_base: "Cobertura general",
    tasa_colocacion_bruta_anterior: "Tasa colocación ant.",
    costo_depositos_anterior: "Costo depósitos ant.",
    margen_intermediacion_anterior: "Margen intermediación ant.",
  } as Record<string, string>,

  tabla: {
    mostrar: "Mostrar",
    de: "de",
    anteriores: "Anteriores",
    siguientes: "Siguientes",
    ordenarPor: "Ordenar por",
    entidad: "Entidad",
    tipo: "Tipo",
    departamento: "Departamento",
    puesto: "Puesto",
    pista: "Desplace la tabla horizontalmente para ver todas las columnas.",
  },
} as const;

export type InformeContenido = (typeof inteligencia.informes)[keyof typeof inteligencia.informes];
