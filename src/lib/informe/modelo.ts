import type { Hallazgo, IndicadorRiesgo, SectorSnapshotV2, Segmentacion } from "@/lib/sector/types";

/**
 * Modelo del INFORME SECTORIAL en PDF: del `SectorSnapshot v2` a lo que cada
 * página necesita, ya formateado. Misma regla que el Observatorio: aquí no se
 * calcula ningún indicador ni se escribe ninguna conclusión nueva. Solo se
 * ordena, se etiqueta y se formatea lo que el motor trae.
 *
 * Cada cifra que el informe imprime pasa por `dato()`, que la registra en la
 * trazabilidad con su ruta en el snapshot. Las pocas cifras DERIVADAS (restas y
 * cocientes exactos entre cifras publicadas, p. ej. capital en A = cartera
 * bruta − cartera vencida) quedan registradas con su derivación. La
 * trazabilidad sale junto al PDF: es la respuesta a «¿de dónde sale este número?».
 */

export interface Traza {
  id: string;
  etiqueta: string;
  texto: string;
  valor: number;
  ruta: string;
  derivacion?: string;
}

export type Formato = "billones" | "pct1" | "pct2" | "entero" | "fecha";

const nf = (min: number, max: number) =>
  new Intl.NumberFormat("es-CO", { minimumFractionDigits: min, maximumFractionDigits: max });
const NBSP = " ";

export function formatear(valor: number, formato: Formato): string {
  switch (formato) {
    case "billones":
      return nf(2, 2).format(valor / 1e12);
    case "pct1":
      return `${nf(1, 1).format(valor * 100)}${NBSP}%`;
    case "pct2":
      return `${nf(2, 2).format(valor * 100)}${NBSP}%`;
    case "entero":
      return nf(0, 0).format(valor);
    default:
      return String(valor);
  }
}

const MESES = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

/** «2026-07-31» → «31 de julio de 2026», sin desfase de zona horaria. */
export function fechaLarga(iso: string): string {
  const [a, m, d] = iso.slice(0, 10).split("-").map(Number);
  return `${d} de ${MESES[m - 1]} de ${a}`;
}

/** «2026-09-23T…» → «septiembre de 2026». */
export function mesAnio(iso: string): string {
  const [a, m] = iso.slice(0, 10).split("-").map(Number);
  return `${MESES[m - 1]} de ${a}`;
}

export interface CifraInf {
  etiqueta: string;
  texto: string;
  unidad: string;
  definicion?: string;
  nota?: string;
}

export interface DistribucionInf {
  n: string;
  nValor: number;
  /** Valores 0–1 para dibujar; los textos para rotular. */
  valores: { p25: number; mediana: number; p75: number; media: number; agregado: number | null };
  textos: { p25: string; mediana: string; p75: string; media: string; agregado: string | null };
}

export interface IndicadorInf {
  clave: string;
  etiqueta: string;
  definicion: string;
  formula?: string;
  nota?: string;
  agregado: string | null;
  agregadoValor: number | null;
  distribucion: DistribucionInf | null;
}

export interface CategoriaInf {
  etiqueta: string;
  entidades: string;
  entidadesValor: number;
  participacion: string;
  participacionValor: number;
  participacionEntidades: string;
  participacionEntidadesValor: number;
  esOtros: boolean;
}

export interface SegmentacionInf {
  clave: string;
  etiqueta: string;
  medida: string;
  categorias: CategoriaInf[];
  nota?: string;
}

export type SeccionId =
  | "portada"
  | "alcance"
  | "resumen"
  | "dimension"
  | "calidad"
  | "cobertura"
  | "tipo"
  | "territorio"
  | "otros"
  | "metodologia"
  | "cierre";

export const SECCIONES: Record<SeccionId, { numero: string; titulo: string; pregunta?: string }> = {
  portada: { numero: "01", titulo: "Portada" },
  alcance: {
    numero: "02",
    titulo: "Alcance del informe",
    pregunta: "Qué cubre este corte y de dónde salen las cifras",
  },
  resumen: { numero: "03", titulo: "Resumen ejecutivo", pregunta: "Los hallazgos del corte" },
  dimension: {
    numero: "04",
    titulo: "Dimensión del universo",
    pregunta: "¿Qué tamaño tiene la cartera del universo analizado?",
  },
  calidad: {
    numero: "05",
    titulo: "Calidad de cartera",
    pregunta: "¿Qué parte del capital está calificada en riesgo?",
  },
  cobertura: {
    numero: "06",
    titulo: "Deterioro y cobertura",
    pregunta: "¿Cuánto deterioro hay constituido frente a la cartera vencida?",
  },
  tipo: {
    numero: "07",
    titulo: "Estructura por tipo de organización",
    pregunta: "¿Cómo se reparte la cartera entre tipos de entidad?",
  },
  territorio: { numero: "08", titulo: "Estructura territorial", pregunta: "¿Dónde se concentra la cartera?" },
  otros: {
    numero: "09",
    titulo: "Otros indicadores",
    pregunta: "Mora por días de atraso, libranza e intereses vencidos",
  },
  metodologia: {
    numero: "10",
    titulo: "Metodología y fuentes",
    pregunta: "De dónde salen estas cifras y qué no dicen",
  },
  cierre: { numero: "11", titulo: "Cierre" },
};

export interface HallazgoInf {
  id: string;
  clasificacion: string;
  titulo: string;
  lectura: string;
  cifraTexto: string;
  cifraUnidad: string;
  cifraEtiqueta: string;
  universo: string;
  seccion: SeccionId;
}

export interface InformeModelo {
  titulo: string;
  subtitulo: string;
  corteEtiqueta: string;
  corteId: string;
  publicado: string;
  corte: {
    fecha: string;
    procesado: string;
    estado: "completo" | "parcial";
    estadoEtiqueta: string;
    cobertura: string;
    nReportantes: string;
    nUniverso: string;
    nExcluidas: string;
  };
  fuente: {
    datos: string;
    datosDescripcion?: string;
    datosUrl?: string;
    procesamiento: string;
    procesamientoDescripcion?: string;
  };
  metodologia: {
    nombre: string;
    version: string;
    descripcion: string;
    universoDefinicion: string;
    universoCriterio: string;
    exclusiones: string[];
    limitaciones: string[];
    comparabilidad: string;
    k: string;
    definiciones: Array<{ etiqueta: string; definicion: string; formula?: string; unidad: string }>;
  };
  hallazgos: HallazgoInf[];
  dimension: {
    bruta: CifraInf;
    secundarias: CifraInf[];
    calificacion: Array<{ etiqueta: string; texto: string; participacion: string; valor: number }> | null;
    asociados: CifraInf | null;
    parrafos: string[];
  };
  calidad: { icm: IndicadorInf | null; icv: IndicadorInf | null; parrafos: string[] };
  cobertura: {
    cobertura: IndicadorInf | null;
    deterioro: CifraInf | null;
    vencida: CifraInf | null;
    comparacion: { deterioroValor: number; vencidaValor: number } | null;
    parrafos: string[];
  };
  tipo: (SegmentacionInf & { parrafos: string[] }) | null;
  /** Nivel de supervisión, cuando el snapshot lo publica (en los cortes mensuales suele omitirse por k). */
  nivel: (SegmentacionInf & { parrafos: string[] }) | null;
  territorio:
    | (SegmentacionInf & {
        parrafos: string[];
        concentracion: { texto: string; valor: number; etiquetas: string[] } | null;
      })
    | null;
  otros: { moraDias: IndicadorInf[]; libranza: IndicadorInf | null; intereses: IndicadorInf | null };
  contacto: { web: string; correo: string };
  trazabilidad: Traza[];
}

export interface OpcionesModelo {
  contacto: { web: string; correo: string };
}

const CLASIFICACION: Record<Hallazgo["clasificacion"], string> = {
  dimension: "Dimensión",
  riesgo: "Riesgo",
  estructura: "Estructura",
  concentracion: "Concentración",
  evolucion: "Evolución",
};

/** El formato de impresión de una cifra según su unidad del contrato. */
function formatoDe(unidad: string): Formato {
  if (unidad === "cop") return "billones";
  if (unidad === "pct") return "pct2";
  return "entero";
}

function unidadTexto(unidad: string): string {
  if (unidad === "cop") return "billones de pesos";
  if (unidad === "pct") return "";
  if (unidad === "entidades") return "entidades";
  return "";
}

/**
 * Construye el modelo del informe. Lanza si el snapshot no es un v2 publicable
 * (origen siar, 3–5 hallazgos, k ≥ 5): un informe no se arma con un borrador.
 */
export function construirModelo(s: SectorSnapshotV2, o: OpcionesModelo): InformeModelo {
  if (s.version !== 2 || s.origen !== "siar")
    throw new Error("El informe solo se genera con un SectorSnapshot v2 de origen «siar».");
  if (s.hallazgos.length < 3 || s.hallazgos.length > 5)
    throw new Error(
      `El informe necesita la Lectura Novum aprobada (3–5 hallazgos); el snapshot trae ${s.hallazgos.length}.`,
    );
  if (!(s.metodologia.minEntidadesPorCategoria >= 5)) throw new Error("El informe público exige k ≥ 5.");

  const trazas: Traza[] = [];
  const dato = (
    id: string,
    etiqueta: string,
    valor: number,
    ruta: string,
    formato: Formato,
    derivacion?: string,
  ) => {
    const texto = formatear(valor, formato);
    trazas.push({ id, etiqueta, texto, valor, ruta, ...(derivacion ? { derivacion } : {}) });
    return texto;
  };

  const corte = s.cortes[0];
  const excluidas = corte.nReportantes - corte.nUniverso;
  const cifra = (clave: string) => s.dimension.cifras.find((c) => c.clave === clave);
  const indicador = (clave: string) => s.riesgo.indicadores.find((i) => i.clave === clave);
  const idxCifra = (clave: string) => s.dimension.cifras.findIndex((c) => c.clave === clave);
  const idxInd = (clave: string) => s.riesgo.indicadores.findIndex((i) => i.clave === clave);

  const nUniverso = dato(
    "n_universo",
    "Entidades en el universo",
    corte.nUniverso,
    "cortes[0].nUniverso",
    "entero",
  );
  const nReportantes = dato(
    "n_reportantes",
    "Entidades reportantes",
    corte.nReportantes,
    "cortes[0].nReportantes",
    "entero",
  );
  const nExcluidas = dato(
    "n_excluidas",
    "Reportantes fuera del universo",
    excluidas,
    "cortes[0].nReportantes − cortes[0].nUniverso",
    "entero",
    "resta de dos conteos publicados",
  );

  const cifraInf = (clave: string): CifraInf | null => {
    const c = cifra(clave);
    if (!c) return null;
    return {
      etiqueta: c.etiqueta,
      texto: dato(
        `cifra.${clave}`,
        c.etiqueta,
        c.valor,
        `dimension.cifras[${idxCifra(clave)}].valor`,
        formatoDe(c.unidad),
      ),
      unidad: unidadTexto(c.unidad),
      ...(c.definicion ? { definicion: c.definicion } : {}),
      ...(c.nota ? { nota: c.nota } : {}),
    };
  };

  const indicadorInf = (clave: string): IndicadorInf | null => {
    const i: IndicadorRiesgo | undefined = indicador(clave);
    if (!i) return null;
    const k = idxInd(clave);
    const def = s.metodologia.definiciones.find((d) => d.clave === clave);
    const d = i.distribucion;
    return {
      clave,
      etiqueta: i.etiqueta,
      definicion: i.definicion,
      ...(def?.formula ? { formula: def.formula } : {}),
      ...(i.nota ? { nota: i.nota.replace(/\s*Fórmula: [^.]*\.\s*$/, "").trim() || undefined } : {}),
      agregado:
        i.ponderado === null
          ? null
          : dato(
              `${clave}.agregado`,
              `${i.etiqueta} agregado`,
              i.ponderado,
              `riesgo.indicadores[${k}].ponderado`,
              "pct2",
            ),
      agregadoValor: i.ponderado,
      distribucion: d
        ? {
            n: dato(
              `${clave}.n`,
              `${i.etiqueta}: entidades con dato`,
              d.n,
              `riesgo.indicadores[${k}].distribucion.n`,
              "entero",
            ),
            nValor: d.n,
            valores: { p25: d.p25, mediana: d.mediana, p75: d.p75, media: d.media, agregado: i.ponderado },
            textos: {
              p25: dato(
                `${clave}.p25`,
                `${i.etiqueta} P25`,
                d.p25,
                `riesgo.indicadores[${k}].distribucion.p25`,
                "pct2",
              ),
              mediana: dato(
                `${clave}.mediana`,
                `${i.etiqueta} mediana`,
                d.mediana,
                `riesgo.indicadores[${k}].distribucion.mediana`,
                "pct2",
              ),
              p75: dato(
                `${clave}.p75`,
                `${i.etiqueta} P75`,
                d.p75,
                `riesgo.indicadores[${k}].distribucion.p75`,
                "pct2",
              ),
              media: dato(
                `${clave}.media`,
                `${i.etiqueta} media simple`,
                d.media,
                `riesgo.indicadores[${k}].distribucion.media`,
                "pct2",
              ),
              agregado: i.ponderado === null ? null : formatear(i.ponderado, "pct2"),
            },
          }
        : null,
    };
  };

  const segmentacionInf = (seg: Segmentacion, k: number): SegmentacionInf => ({
    clave: seg.clave,
    etiqueta: seg.etiqueta,
    medida: seg.medida.etiqueta,
    categorias: seg.categorias.map((c, j) => {
      const base = `estructura.segmentaciones[${k}].categorias[${j}]`;
      return {
        etiqueta: c.etiqueta,
        entidades: dato(
          `${seg.clave}.${j}.entidades`,
          `${c.etiqueta}: entidades`,
          c.entidades,
          `${base}.entidades`,
          "entero",
        ),
        entidadesValor: c.entidades,
        participacion: dato(
          `${seg.clave}.${j}.participacion`,
          `${c.etiqueta}: participación en ${seg.medida.etiqueta}`,
          c.participacion,
          `${base}.participacion`,
          "pct1",
        ),
        participacionValor: c.participacion,
        participacionEntidades: dato(
          `${seg.clave}.${j}.part_entidades`,
          `${c.etiqueta}: participación en entidades`,
          c.entidades / corte.nUniverso,
          `${base}.entidades / cortes[0].nUniverso`,
          "pct1",
          "cociente de dos conteos publicados",
        ),
        participacionEntidadesValor: c.entidades / corte.nUniverso,
        esOtros: c.etiqueta.startsWith("Otros"),
      };
    }),
    ...(seg.nota ? { nota: seg.nota } : {}),
  });

  // ── Hallazgos: dato y Lectura Novum, tal como vienen ──────────────────────
  const seccionDeHallazgo = (h: Hallazgo): SeccionId => {
    const c = h.cifra.clave;
    if (c === "cobertura" || c.startsWith("deterioro")) return "cobertura";
    if (c === "icm" || c === "icv") return "calidad";
    if (c.startsWith("departamento") || c.startsWith("territorio")) return "territorio";
    if (c.startsWith("tipo")) return "tipo";
    if (h.capitulo === "dimension") return "dimension";
    if (h.capitulo === "riesgo") return "calidad";
    if (h.clasificacion === "concentracion") return "territorio";
    return "tipo";
  };
  const hallazgos: HallazgoInf[] = s.hallazgos.map((h, j) => ({
    id: h.id,
    clasificacion: CLASIFICACION[h.clasificacion] ?? h.clasificacion,
    titulo: h.titulo,
    lectura: h.lectura,
    cifraTexto: dato(
      `hallazgo.${h.id}`,
      `Hallazgo: ${h.cifra.etiqueta}`,
      h.cifra.valor,
      `hallazgos[${j}].cifra.valor`,
      h.cifra.unidad === "pct" ? "pct1" : formatoDe(h.cifra.unidad),
    ),
    cifraUnidad: unidadTexto(h.cifra.unidad),
    cifraEtiqueta: h.cifra.etiqueta,
    universo: `${formatear(h.universo.nEntidades, "entero")} entidades — ${h.universo.descripcion}`,
    seccion: seccionDeHallazgo(h),
  }));

  // ── 04 Dimensión ──────────────────────────────────────────────────────────
  const brutaC = cifra("cartera_bruta");
  const vencidaC = cifra("cartera_vencida");
  const cdeC = cifra("cartera_cde");
  if (!brutaC) throw new Error("El snapshot no trae cartera_bruta: no hay dimensión que informar.");
  const bruta = cifraInf("cartera_bruta") as CifraInf;
  const secundarias = ["cartera_vencida", "cartera_cde", "cartera_neta", "deterioro_total_capital"]
    .map((k) => cifraInf(k))
    .filter((x): x is CifraInf => x !== null);
  const asociados = cifraInf("asociados");
  let calificacion: InformeModelo["dimension"]["calificacion"] = null;
  if (vencidaC && cdeC) {
    const a = brutaC.valor - vencidaC.valor;
    const b = vencidaC.valor - cdeC.valor;
    const ib = idxCifra("cartera_bruta");
    const iv = idxCifra("cartera_vencida");
    const ic = idxCifra("cartera_cde");
    calificacion = [
      {
        etiqueta: "Calificada en A",
        texto: dato(
          "calif.A",
          "Capital en A",
          a,
          `dimension.cifras[${ib}].valor − dimension.cifras[${iv}].valor`,
          "billones",
          "cartera bruta − cartera vencida (B a E)",
        ),
        participacion: dato(
          "calif.A.part",
          "Capital en A / cartera bruta",
          a / brutaC.valor,
          "(bruta − vencida) / bruta",
          "pct1",
          "cociente de cifras publicadas",
        ),
        valor: a / brutaC.valor,
      },
      {
        etiqueta: "Calificada en B",
        texto: dato(
          "calif.B",
          "Capital en B",
          b,
          `dimension.cifras[${iv}].valor − dimension.cifras[${ic}].valor`,
          "billones",
          "cartera vencida − cartera en C–E",
        ),
        participacion: dato(
          "calif.B.part",
          "Capital en B / cartera bruta",
          b / brutaC.valor,
          "(vencida − C–E) / bruta",
          "pct1",
          "cociente de cifras publicadas",
        ),
        valor: b / brutaC.valor,
      },
      {
        etiqueta: "Calificada en C, D o E",
        texto: formatear(cdeC.valor, "billones"),
        participacion: dato(
          "calif.CE.part",
          "Capital en C–E / cartera bruta",
          cdeC.valor / brutaC.valor,
          "C–E / bruta (= ICV agregado)",
          "pct1",
          "cociente de cifras publicadas",
        ),
        valor: cdeC.valor / brutaC.valor,
      },
    ];
  }
  const icmI = indicador("icm");
  const icvI = indicador("icv");
  const netaC = cifra("cartera_neta");
  const parrafosDimension = [
    `Las ${nUniverso} entidades del universo suman ${bruta.texto} billones de pesos de cartera bruta: el capital de todas las modalidades de crédito, en las cinco categorías de riesgo.`,
    ...(vencidaC && cdeC && icmI?.ponderado != null && icvI?.ponderado != null
      ? [
          `De ese capital, ${formatear(vencidaC.valor, "billones")} billones (${formatear(icmI.ponderado, "pct2")}) están calificados en B a E y ${formatear(cdeC.valor, "billones")} billones (${formatear(icvI.ponderado, "pct2")}) en C, D o E, las categorías de mayor riesgo.`,
        ]
      : []),
    ...(netaC
      ? [
          `La cartera neta —cartera bruta menos el deterioro total de capital— es ${formatear(netaC.valor, "billones")} billones de pesos.`,
        ]
      : []),
  ];

  // ── 05 Calidad de cartera ─────────────────────────────────────────────────
  const icm = indicadorInf("icm");
  const icv = indicadorInf("icv");
  const parrafosCalidad = [
    ...(icm?.agregado && icm.distribucion
      ? [
          `El ICM agregado —cartera vencida sobre cartera bruta, sumando todas las entidades del universo— es ${icm.agregado}. Calculado entidad por entidad, la mediana es ${icm.distribucion.textos.mediana}, la mitad central de las entidades está entre ${icm.distribucion.textos.p25} y ${icm.distribucion.textos.p75}, y la media simple es ${icm.distribucion.textos.media}.`,
        ]
      : []),
    ...(icv?.agregado && icv.distribucion
      ? [
          `El ICV —capital en C, D o E sobre cartera bruta— es ${icv.agregado} en el agregado, con una mediana de ${icv.distribucion.textos.mediana} entre entidades.`,
        ]
      : []),
  ];

  // ── 06 Deterioro y cobertura ──────────────────────────────────────────────
  const coberturaI = indicadorInf("cobertura");
  const deterioroC = cifra("deterioro_total_capital");
  const parrafosCobertura = [
    ...(deterioroC && vencidaC && coberturaI?.agregado
      ? [
          `El deterioro total de capital suma ${formatear(deterioroC.valor, "billones")} billones de pesos frente a ${formatear(vencidaC.valor, "billones")} billones de cartera vencida: una cobertura agregada de ${coberturaI.agregado}.`,
        ]
      : []),
    "La cobertura es una medida contable de provisión. Este informe no evalúa si el deterioro constituido es suficiente.",
  ];

  // ── 07 y 08 Estructura ────────────────────────────────────────────────────
  const segs = s.estructura.segmentaciones;
  const iTipo = segs.findIndex((x) => x.clave === "tipo");
  const iDepto = segs.findIndex((x) => x.clave === "departamento");
  const iNivel = segs.findIndex((x) => x.clave === "nivel");
  let tipo: InformeModelo["tipo"] = null;
  if (iTipo >= 0) {
    const inf = segmentacionInf(segs[iTipo], iTipo);
    const reales = inf.categorias.filter((c) => !c.esOtros);
    const mayor = reales[0];
    const segundo = reales[1];
    tipo = {
      ...inf,
      parrafos: [
        ...(mayor
          ? [
              `«${mayor.etiqueta}» reúne ${mayor.participacion} de la cartera bruta con ${mayor.entidades} entidades, ${mayor.participacionEntidades} del universo.`,
            ]
          : []),
        ...(segundo
          ? [
              `Le siguen «${segundo.etiqueta}», con ${segundo.participacion} de la cartera y ${segundo.entidades} entidades (${segundo.participacionEntidades} del universo).`,
            ]
          : []),
      ],
    };
  }
  let nivel: InformeModelo["nivel"] = null;
  if (iNivel >= 0) {
    const inf = segmentacionInf(segs[iNivel], iNivel);
    const reales = inf.categorias.filter((c) => !c.esOtros);
    const mayor = reales[0];
    const menor = reales.length > 1 ? reales[reales.length - 1] : undefined;
    nivel = {
      ...inf,
      parrafos: [
        ...(mayor
          ? [
              `«${mayor.etiqueta}» reúne ${mayor.participacion} de la cartera bruta con ${mayor.entidades} entidades, ${mayor.participacionEntidades} del universo.`,
            ]
          : []),
        ...(menor
          ? [
              `«${menor.etiqueta}», con ${menor.entidades} entidades (${menor.participacionEntidades} del universo), reúne ${menor.participacion} de la cartera.`,
            ]
          : []),
      ],
    };
  }
  let territorio: InformeModelo["territorio"] = null;
  if (iDepto >= 0) {
    const inf = segmentacionInf(segs[iDepto], iDepto);
    const reales = inf.categorias.filter((c) => !c.esOtros);
    const top3 = reales.slice(0, 3);
    const valorTop3 = top3.reduce((a, c) => a + c.participacionValor, 0);
    const entidadesTop3 = top3.reduce((a, c) => a + c.entidadesValor, 0);
    const concentracion =
      top3.length === 3
        ? {
            texto: dato(
              "departamento.top3",
              "Participación de los tres departamentos con más cartera",
              valorTop3,
              `suma de estructura.segmentaciones[${iDepto}].categorias[0..2].participacion`,
              "pct1",
              "suma de participaciones publicadas",
            ),
            valor: valorTop3,
            etiquetas: top3.map((c) => c.etiqueta),
          }
        : null;
    territorio = {
      ...inf,
      concentracion,
      parrafos: concentracion
        ? [
            `Tres departamentos —${top3[0].etiqueta}, ${top3[1].etiqueta} y ${top3[2].etiqueta}— reúnen ${concentracion.texto} de la cartera bruta con ${dato("departamento.top3.entidades", "Entidades en los tres departamentos", entidadesTop3, `suma de estructura.segmentaciones[${iDepto}].categorias[0..2].entidades`, "entero", "suma de conteos publicados")} de las ${nUniverso} entidades.`,
          ]
        : [],
    };
  }

  // ── 09 Otros indicadores ──────────────────────────────────────────────────
  const moraDias = ["icm_30", "icm_90", "icm_180"]
    .map((k) => indicadorInf(k))
    .filter((x): x is IndicadorInf => x !== null);

  return {
    titulo: "Informe sectorial",
    subtitulo: "Sector solidario colombiano",
    corteEtiqueta: `Corte ${corte.etiqueta.toLowerCase()}`,
    corteId: corte.id,
    publicado: mesAnio(s.generadoEl),
    corte: {
      fecha: fechaLarga(corte.fechaCorte),
      procesado: fechaLarga(corte.procesadoEl),
      estado: corte.estado,
      estadoEtiqueta: corte.estado === "parcial" ? "Corte parcial" : "Corte completo",
      cobertura: corte.cobertura,
      nReportantes,
      nUniverso,
      nExcluidas,
    },
    fuente: {
      datos: s.fuente.datos.entidad,
      ...(s.fuente.datos.descripcion ? { datosDescripcion: s.fuente.datos.descripcion } : {}),
      ...(s.fuente.datos.url ? { datosUrl: s.fuente.datos.url } : {}),
      procesamiento: s.fuente.procesamiento.entidad,
      ...(s.fuente.procesamiento.descripcion
        ? { procesamientoDescripcion: s.fuente.procesamiento.descripcion }
        : {}),
    },
    metodologia: {
      nombre: s.metodologia.nombre,
      version: `${s.metodologia.codigo} ${s.metodologia.version}${s.metodologia.evaluador ? ` · evaluador ${s.metodologia.evaluador}` : ""}`,
      descripcion: s.metodologia.descripcion,
      universoDefinicion: s.metodologia.universo.definicion,
      universoCriterio: s.metodologia.universo.criterio,
      exclusiones: s.metodologia.exclusiones,
      limitaciones: s.metodologia.limitaciones,
      comparabilidad: `${s.metodologia.comparabilidad.criterio} ${s.metodologia.comparabilidad.descripcion}`,
      k: formatear(s.metodologia.minEntidadesPorCategoria, "entero"),
      definiciones: s.metodologia.definiciones.map((d) => ({
        etiqueta: d.etiqueta,
        definicion: d.definicion,
        ...(d.formula ? { formula: d.formula } : {}),
        unidad: d.unidad === "cop" ? "Pesos" : d.unidad === "pct" ? "Porcentaje" : "Número",
      })),
    },
    hallazgos,
    dimension: { bruta, secundarias, calificacion, asociados, parrafos: parrafosDimension },
    calidad: { icm, icv, parrafos: parrafosCalidad },
    cobertura: {
      cobertura: coberturaI,
      deterioro: cifraInf("deterioro_total_capital"),
      vencida: vencidaC
        ? {
            etiqueta: vencidaC.etiqueta,
            texto: formatear(vencidaC.valor, "billones"),
            unidad: "billones de pesos",
          }
        : null,
      comparacion:
        deterioroC && vencidaC ? { deterioroValor: deterioroC.valor, vencidaValor: vencidaC.valor } : null,
      parrafos: parrafosCobertura,
    },
    tipo,
    nivel,
    territorio,
    otros: {
      moraDias,
      libranza: indicadorInf("participacion_libranza"),
      intereses: indicadorInf("intereses_vencidos_sobre_cartera"),
    },
    contacto: o.contacto,
    trazabilidad: dedupe(trazas),
  };
}

/** Una cifra se registra una vez aunque se imprima en varias páginas. */
function dedupe(t: Traza[]): Traza[] {
  const vistos = new Set<string>();
  return t.filter((x) => (vistos.has(x.id) ? false : (vistos.add(x.id), true)));
}
