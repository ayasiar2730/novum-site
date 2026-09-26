/**
 * Tipos de entidad: el archivo trae el texto oficial de la Supersolidaria (sin
 * tildes); aquí solo se escribe bien para leer. Y el puente entre el tipo del
 * Panorama y el segmento de «Cartera y riesgo», para que el filtro sobreviva al
 * cambiar de informe.
 */

const LEGIBLES: Record<string, string> = {
  "Aportes y credito": "Aportes y crédito",
  "Especializada de ahorro y credito": "Especializada de ahorro y crédito",
  "Especializada sin seccion de ahorro": "Especializada sin sección de ahorro",
  "Integral sin seccion de ahorro": "Integral sin sección de ahorro",
  "Multiactiva con ahorro y credito": "Multiactiva con ahorro y crédito",
  "Multiactiva sin seccion de ahorro": "Multiactiva sin sección de ahorro",
};

export function etiquetaDeTipo(tipo: string | null | undefined): string {
  if (!tipo) return "Sin tipo";
  return LEGIBLES[tipo] ?? tipo;
}

const TIPO_POR_SEGMENTO = {
  COOPERATIVAS: "Especializada de ahorro y credito",
  MUTUALES: "Asociaciones mutuales",
} as const;

export function tipoDeSegmento(s: keyof typeof TIPO_POR_SEGMENTO): string {
  return TIPO_POR_SEGMENTO[s];
}

export function segmentoDeTipo(tipo: string | null): "COOPERATIVAS" | "MUTUALES" | null {
  if (tipo === TIPO_POR_SEGMENTO.COOPERATIVAS) return "COOPERATIVAS";
  if (tipo === TIPO_POR_SEGMENTO.MUTUALES) return "MUTUALES";
  return null;
}
