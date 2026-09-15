/**
 * Marco de producto: esqueleto estructural de la interfaz, con profundidad,
 * reservado para la captura real (Fase 1). No dibuja cifras ni gráficos
 * que puedan confundirse con datos del software: solo bloques de estructura.
 * Es el único elemento con sombra en su sección (design system §5, §7).
 */
export function ProductFrame({ caption }: { caption: string }) {
  return (
    <div className="relative" role="img" aria-label={`Espacio reservado: ${caption}`}>
      {/* capa trasera: profundidad */}
      <div
        aria-hidden="true"
        className="absolute inset-x-6 -bottom-3 top-6 rounded-xl border border-neutral-100 bg-neutral-0/70"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-3 -bottom-1.5 top-3 rounded-xl border border-neutral-100 bg-neutral-0/90"
      />

      {/* capa frontal: la interfaz */}
      <div className="shadow-lift relative overflow-hidden rounded-xl border border-neutral-100 bg-neutral-0">
        {/* barra de ventana */}
        <div className="flex h-9 items-center gap-1.5 border-b border-neutral-100 bg-neutral-50 px-3">
          <span className="h-2 w-2 rounded-full bg-neutral-300" />
          <span className="h-2 w-2 rounded-full bg-neutral-300" />
          <span className="h-2 w-2 rounded-full bg-neutral-300" />
          <span className="ml-3 h-4 w-1/3 rounded-sm bg-neutral-100" />
          <span className="ml-auto rounded-sm bg-purple-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-purple-700">
            SARC
          </span>
        </div>

        <div className="grid aspect-[16/10] grid-cols-[52px_1fr] md:grid-cols-[60px_1fr]">
          {/* barra lateral */}
          <div className="flex flex-col items-center gap-3 border-r border-neutral-100 bg-neutral-50 py-4">
            <span className="h-5 w-5 rounded-md bg-purple-700" />
            <span className="mt-2 h-4 w-4 rounded-sm bg-purple-100" />
            <span className="h-4 w-4 rounded-sm bg-neutral-100" />
            <span className="h-4 w-4 rounded-sm bg-neutral-100" />
            <span className="h-4 w-4 rounded-sm bg-neutral-100" />
            <span className="h-4 w-4 rounded-sm bg-neutral-100" />
          </div>

          {/* área principal */}
          <div className="flex min-h-0 min-w-0 flex-col gap-3 p-4 md:gap-4 md:p-5">
            <div className="flex items-center justify-between">
              <span className="h-3.5 w-2/5 rounded-sm bg-neutral-100" />
              <div className="flex gap-2">
                <span className="hidden h-6 w-16 rounded-md border border-neutral-100 sm:block" />
                <span className="h-6 w-20 rounded-md bg-purple-700/90" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 md:gap-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="flex flex-col gap-2 rounded-lg border border-neutral-100 p-2.5 md:p-3"
                >
                  <span className="h-2 w-3/5 rounded-sm bg-neutral-100" />
                  <span className={`h-4 w-full rounded-sm ${i === 0 ? "bg-purple-100" : "bg-neutral-100"}`} />
                </div>
              ))}
            </div>

            <div className="relative min-h-0 flex-1 overflow-hidden rounded-lg border border-neutral-100 bg-neutral-50">
              <div
                aria-hidden="true"
                className="absolute inset-x-4 top-4 flex flex-col justify-between"
                style={{ bottom: "1rem" }}
              >
                {[0, 1, 2, 3, 4].map((i) => (
                  <span key={i} className="block h-px w-full bg-neutral-100" />
                ))}
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="rounded-sm border border-neutral-100 bg-neutral-0 px-3 py-2 text-label uppercase text-neutral-500 shadow-sm">
                  {caption}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
