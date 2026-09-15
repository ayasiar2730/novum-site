/**
 * Geometría compartida de la composición "Un solo aliado, todas las dimensiones".
 * La usan el hero (HeroSystem) y la marca de agua del CTA, para que digan lo mismo.
 *
 * Lo que representa — y es verdad del negocio:
 *   soluciones independientes (SIAR, Presupuesto, Planeación, y más por venir)
 *   + servicios de acompañamiento
 *   → convergen en la entidad → que es quien decide.
 * No representa dependencias de datos entre productos: no las hay.
 */

export type SystemNode = { x: number; y: number; label: string; dashed?: boolean };
export type SystemGroup = {
  key: string;
  label: string;
  labelAt: { x: number; y: number };
  nodes: SystemNode[];
};

const X = 208;
const STEP = 36;

export const DESKTOP = {
  viewBox: "34 34 766 440",
  center: { x: 520, y: 264, label: "SU ENTIDAD" },
  output: { x: 730, y: 264, label: "DECISIÓN" },
  groups: [
    {
      key: "software",
      label: "SOFTWARE",
      labelAt: { x: X, y: 58 },
      nodes: [
        { x: X, y: 92, label: "SIAR" },
        { x: X, y: 92 + STEP, label: "PRESUPUESTO" },
        { x: X, y: 92 + STEP * 2, label: "PLANEACIÓN" },
        { x: X, y: 92 + STEP * 3, label: "MÁS SOLUCIONES", dashed: true },
      ],
    },
    {
      key: "acompanamiento",
      label: "ACOMPAÑAMIENTO",
      labelAt: { x: X, y: 258 },
      nodes: [
        { x: X, y: 292, label: "DIAGNÓSTICO" },
        { x: X, y: 292 + STEP, label: "IMPLEMENTACIÓN" },
        { x: X, y: 292 + STEP * 2, label: "CAPACITACIÓN" },
        { x: X, y: 292 + STEP * 3, label: "AUDITORÍA SIAR" },
        { x: X, y: 292 + STEP * 4, label: "CUMPLIMIENTO" },
      ],
    },
  ] as SystemGroup[],
};

/** Curva suave desde un nodo de entrada hasta el borde del nodo central. */
export function inputPath(n: SystemNode, cx: number, cy: number, r = 32) {
  const x0 = n.x + 8;
  const x1 = cx - r;
  const bend = (x1 - x0) * 0.5;
  return `M ${x0} ${n.y} C ${x0 + bend} ${n.y} ${x1 - bend} ${cy} ${x1} ${cy}`;
}

/** Curva del nodo central al de salida. */
export function outputPath(cx: number, cy: number, ox: number, oy: number, r = 32, ro = 12) {
  const x0 = cx + r;
  const x1 = ox - ro;
  const bend = (x1 - x0) * 0.45;
  return `M ${x0} ${cy} C ${x0 + bend} ${cy} ${x1 - bend} ${oy} ${x1} ${oy}`;
}

/**
 * Móvil: subconjunto de tres nodos por grupo (aprobado):
 * SOFTWARE → SIAR · PRESUPUESTO · PLANEACIÓN
 * ACOMPAÑAMIENTO → DIAGNÓSTICO · AUDITORÍA SIAR · CUMPLIMIENTO
 */
export const MOBILE = {
  viewBox: "0 0 320 370",
  center: { x: 160, y: 262, label: "SU ENTIDAD" },
  output: { x: 160, y: 342, label: "DECISIÓN" },
  rows: [
    {
      key: "software",
      label: "SOFTWARE",
      y: 74,
      nodes: [
        { x: 60, y: 74, label: "SIAR" },
        { x: 160, y: 74, label: "PRESUPUESTO" },
        { x: 260, y: 74, label: "PLANEACIÓN" },
      ],
    },
    {
      key: "acompanamiento",
      label: "ACOMPAÑAMIENTO",
      y: 158,
      nodes: [
        { x: 60, y: 158, label: "DIAGNÓSTICO" },
        { x: 160, y: 158, label: "AUDITORÍA SIAR" },
        { x: 260, y: 158, label: "CUMPLIMIENTO" },
      ],
    },
  ],
};

/** Curva vertical desde un nodo de una fila hasta el nodo central (móvil). */
export function mobilePath(n: SystemNode, cx: number, cy: number, r = 24) {
  const y0 = n.y + 8;
  const y1 = cy - r;
  const bend = (y1 - y0) * 0.55;
  return `M ${n.x} ${y0} C ${n.x} ${y0 + bend} ${cx} ${y1 - bend} ${cx} ${y1}`;
}
