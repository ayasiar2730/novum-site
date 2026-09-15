/**
 * Geometría compartida de la composición "Un solo aliado, todas las dimensiones".
 * La usan el hero (HeroSystem) y la marca de agua del CTA, para que digan lo mismo.
 *
 * Lo que representa — y es verdad del negocio:
 *   productos independientes (SIAR, Presupuesto, Planeación, y más por venir)
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

export const DESKTOP = {
  viewBox: "34 34 766 420",
  center: { x: 520, y: 250, label: "SU ENTIDAD" },
  output: { x: 730, y: 250, label: "DECISIÓN" },
  groups: [
    {
      key: "software",
      label: "SOFTWARE",
      labelAt: { x: 208, y: 58 },
      nodes: [
        { x: 208, y: 92, label: "SIAR" },
        { x: 208, y: 132, label: "PRESUPUESTO" },
        { x: 208, y: 172, label: "PLANEACIÓN" },
        { x: 208, y: 212, label: "MÁS MÓDULOS", dashed: true },
      ],
    },
    {
      key: "acompanamiento",
      label: "ACOMPAÑAMIENTO",
      labelAt: { x: 208, y: 274 },
      nodes: [
        { x: 208, y: 308, label: "DIAGNÓSTICO" },
        { x: 208, y: 348, label: "IMPLEMENTACIÓN" },
        { x: 208, y: 388, label: "CAPACITACIÓN" },
        { x: 208, y: 428, label: "CUMPLIMIENTO" },
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
        { x: 160, y: 158, label: "IMPLEMENTACIÓN" },
        { x: 260, y: 158, label: "CAPACITACIÓN" },
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
