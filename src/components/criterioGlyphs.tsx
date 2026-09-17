/**
 * Glifos del acto de criterio (B1.3): los cuatro diferenciadores en el
 * lenguaje de nodos del sistema. Trazos a 1,5 en un viewBox de 40 y sin
 * escalar (vector-effect vía .glifo): los datos son el único ornamento.
 */
export const criterioGlyphs = [
  // Analítica en todo: anillo con núcleo
  <svg key="0" viewBox="0 0 40 40" aria-hidden="true" className="h-10 w-10">
    <circle cx="20" cy="20" r="15" fill="none" stroke="var(--color-purple-500)" strokeWidth="1.5" />
    <circle
      cx="20"
      cy="20"
      r="8"
      fill="none"
      stroke="var(--color-purple-500)"
      strokeWidth="1.5"
      strokeDasharray="2 4"
    />
    <circle cx="20" cy="20" r="3" fill="var(--color-purple-700)" />
  </svg>,
  // Evidencia creada en el proceso: nodo con registro
  <svg key="1" viewBox="0 0 40 40" aria-hidden="true" className="h-10 w-10">
    <circle cx="14" cy="20" r="6" fill="var(--color-purple-700)" />
    <path d="M20 20h12" stroke="var(--color-purple-500)" strokeWidth="1.5" strokeLinecap="round" />
    <path
      d="M26 13h8M26 27h8"
      stroke="var(--color-purple-500)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeOpacity="0.5"
    />
  </svg>,
  // Su entidad frente al sector: dos puntos sobre una escala
  <svg key="2" viewBox="0 0 40 40" aria-hidden="true" className="h-10 w-10">
    <path d="M6 24h28" stroke="var(--color-neutral-300)" strokeWidth="1.5" strokeLinecap="round" />
    <path
      d="M10 21v6M20 21v6M30 21v6"
      stroke="var(--color-neutral-300)"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <circle cx="20" cy="15" r="4" fill="none" stroke="var(--color-purple-500)" strokeWidth="1.5" />
    <circle cx="28" cy="15" r="4" fill="var(--color-green-500)" />
  </svg>,
  // Diagnóstico antes que software: arco de madurez
  <svg key="3" viewBox="0 0 40 40" aria-hidden="true" className="h-10 w-10">
    <path
      d="M8 28a12 12 0 0 1 24 0"
      fill="none"
      stroke="var(--color-neutral-300)"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M8 28a12 12 0 0 1 14-11.8"
      fill="none"
      stroke="var(--color-purple-700)"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <circle cx="22" cy="16.2" r="3" fill="var(--color-green-500)" />
  </svg>,
];
