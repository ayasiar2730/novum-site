/**
 * Geometría del "ensamble" del hero (B0): la composición que traduce la marca
 * —una ficha construida por módulos— al sistema de Novum.
 *
 *   SOFTWARE (módulos)  +  ACOMPAÑAMIENTO (servicios)
 *        →  SU ENTIDAD (núcleo)  →  DECISIÓN (resultado, fuera de la placa)
 *
 * Lo que dice sigue siendo verdad del negocio (ver systemGeometry.ts, que
 * conserva la marca de agua del CTA): soluciones independientes y servicios
 * convergen en la entidad, que es quien decide. No representa dependencias
 * de datos entre productos.
 */

export type Tile = { label: string; dashed?: boolean };
export type TileGroup = { key: "software" | "acompanamiento"; label: string; tiles: Tile[] };

export const GROUPS: TileGroup[] = [
  {
    key: "software",
    label: "SOFTWARE",
    tiles: [
      { label: "SIAR" },
      { label: "PRESUPUESTO" },
      { label: "PLANEACIÓN" },
      { label: "MÁS SOLUCIONES", dashed: true },
    ],
  },
  {
    key: "acompanamiento",
    label: "ACOMPAÑAMIENTO",
    tiles: [
      { label: "DIAGNÓSTICO" },
      { label: "IMPLEMENTACIÓN" },
      { label: "CAPACITACIÓN" },
      { label: "AUDITORÍA SIAR" },
      { label: "CUMPLIMIENTO" },
    ],
  },
];

/** Escritorio: placa apaisada; los módulos a la izquierda, el núcleo a la derecha, DECISIÓN sobre el borde. */
export const DESK = {
  viewBox: "0 0 700 560",
  plate: { x: 0, y: 0, w: 600, h: 560, rx: 44 },
  tile: { x: 44, w: 176, h: 36, rx: 10, step: 44 },
  groupTop: { software: 62, acompanamiento: 292 } as Record<TileGroup["key"], number>,
  core: { x: 400, y: 282, r: 44, label: "SU ENTIDAD" },
  output: { x: 528, y: 254, w: 144, h: 56, rx: 14, label: "DECISIÓN" },
};

/** Móvil: placa vertical; dos columnas de módulos, el núcleo debajo y DECISIÓN sobre el borde inferior. */
export const MOB = {
  viewBox: "0 0 342 420",
  plate: { x: 0, y: 0, w: 342, h: 370, rx: 28 },
  tile: { w: 146, h: 30, rx: 8, step: 36, top: 46 },
  columns: { software: 18, acompanamiento: 178 } as Record<TileGroup["key"], number>,
  captionY: 32,
  core: { x: 171, y: 284, r: 30, label: "SU ENTIDAD" },
  output: { x: 105, y: 356, w: 132, h: 40, rx: 11, label: "DECISIÓN" },
};

/** Posición vertical del módulo i de un grupo (escritorio): etiqueta del grupo + módulos apilados. */
export function deskTileY(group: TileGroup["key"], i: number) {
  return DESK.groupTop[group] + 18 + i * DESK.tile.step;
}

/** Curva desde el borde derecho de un módulo hasta el borde izquierdo del núcleo. */
export function deskLink(y: number) {
  const x0 = DESK.tile.x + DESK.tile.w;
  const x1 = DESK.core.x - DESK.core.r;
  const bend = (x1 - x0) * 0.5;
  return `M ${x0} ${y} C ${x0 + bend} ${y} ${x1 - bend} ${DESK.core.y} ${x1} ${DESK.core.y}`;
}

/** Curva desde la base de un módulo (móvil) hasta la parte superior del núcleo. */
export function mobLink(cx: number, y0: number) {
  const y1 = MOB.core.y - MOB.core.r;
  const bend = (y1 - y0) * 0.55;
  return `M ${cx} ${y0} C ${cx} ${y0 + bend} ${MOB.core.x} ${y1 - bend} ${MOB.core.x} ${y1}`;
}
