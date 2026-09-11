/**
 * Marco de producto: espacio reservado para la captura real (Fase 1).
 * No dibuja gráficos falsos que puedan confundirse con el software.
 * Único elemento con sombra en su sección (design system §5, §7).
 */
export function ProductFrame({ caption }: { caption: string }) {
  return (
    <div
      role="img"
      aria-label={`Espacio reservado: ${caption}`}
      className="overflow-hidden rounded-xl border border-neutral-100 bg-neutral-0 shadow-lift"
    >
      <div className="flex h-8 items-center gap-1.5 border-b border-neutral-100 bg-neutral-50 px-3">
        <span className="h-2 w-2 rounded-full bg-neutral-300" />
        <span className="h-2 w-2 rounded-full bg-neutral-300" />
        <span className="h-2 w-2 rounded-full bg-neutral-300" />
      </div>
      <div className="relative aspect-[16/10] bg-dotgrid">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="rounded-sm border border-neutral-100 bg-neutral-0 px-3 py-2 text-label uppercase text-neutral-500">
            {caption}
          </span>
        </div>
      </div>
    </div>
  );
}
