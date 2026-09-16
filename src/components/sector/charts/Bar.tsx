/**
 * Una barra horizontal: SVG mínimo con <title> propio, escalada por porcentaje.
 * Las etiquetas y valores van en HTML alrededor (no dentro del SVG) para que
 * el texto no se encoja con el viewBox en pantallas pequeñas.
 */
export type Tono = "fuerte" | "medio" | "suave" | "acento";

const fills: Record<Tono, string> = {
  fuerte: "var(--color-purple-900)",
  medio: "var(--color-purple-700)",
  suave: "var(--color-purple-100)",
  acento: "var(--color-green-500)",
};

export function Bar({
  pct,
  tono = "medio",
  title,
  height = "h-2.5",
}: {
  /** 0–100 */
  pct: number;
  tono?: Tono;
  title: string;
  height?: string;
}) {
  const w = Math.max(0, Math.min(100, pct));
  return (
    <svg viewBox="0 0 100 10" preserveAspectRatio="none" className={`${height} w-full`} role="img">
      <title>{title}</title>
      <rect x="0" y="0" width="100" height="10" fill="var(--color-neutral-100)" />
      <rect x="0" y="0" width={w} height="10" fill={fills[tono]} />
    </svg>
  );
}

export const swatch: Record<Tono, string> = {
  fuerte: "bg-purple-900",
  medio: "bg-purple-700",
  suave: "bg-purple-100 ring-1 ring-inset ring-purple-500",
  acento: "bg-green-500",
};
