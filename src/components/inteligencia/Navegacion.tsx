"use client";

import Link from "next/link";
import { useEffect, useId, useRef, type KeyboardEvent } from "react";
import { inteligencia } from "@/content/inteligencia";
import type { InformeId } from "@/lib/inteligencia/estado";

const t = inteligencia.navegacion;

export interface Seccion {
  id: string;
  label: string;
  texto: string;
}

/**
 * Menú de secciones del informe, responsive sin desbordes:
 *   · desde 768 px: pestañas (patrón ARIA «tabs»: flechas, Inicio y Fin). Si no
 *     caben, la fila se desplaza dentro de su marco con un degradado que lo
 *     avisa, y la pestaña activa siempre queda a la vista;
 *   · por debajo de 768 px: un selector nativo (el control más usable en un
 *     teléfono), con la descripción de la sección debajo.
 */
export function NavSecciones({
  secciones,
  activa,
  onCambio,
  panelId,
}: {
  secciones: readonly Seccion[];
  activa: string;
  onCambio: (id: string) => void;
  panelId: string;
}) {
  const lista = useRef<HTMLDivElement>(null);
  const idSelect = useId();

  useEffect(() => {
    const el = lista.current?.querySelector<HTMLButtonElement>(`[data-seccion="${activa}"]`);
    el?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [activa]);

  const teclado = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const n = secciones.length;
    const destino =
      e.key === "ArrowRight"
        ? (i + 1) % n
        : e.key === "ArrowLeft"
          ? (i - 1 + n) % n
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? n - 1
              : -1;
    if (destino < 0) return;
    e.preventDefault();
    onCambio(secciones[destino].id);
    lista.current?.querySelector<HTMLButtonElement>(`[data-seccion="${secciones[destino].id}"]`)?.focus();
  };

  const actual = secciones.find((s) => s.id === activa);

  return (
    <div className="flex flex-col gap-2">
      <div className="md:hidden">
        <label htmlFor={idSelect} className="text-label uppercase text-neutral-700">
          {t.seccionMovil}
        </label>
        <select
          id={idSelect}
          value={activa}
          onChange={(e) => onCambio(e.target.value)}
          aria-controls={panelId}
          className="mt-1.5 min-h-12 w-full rounded-md border border-neutral-300 bg-neutral-0 px-3 text-body-sm font-semibold text-neutral-950 focus-visible:border-purple-500"
        >
          {secciones.map((s, i) => (
            <option key={s.id} value={s.id}>
              {`${i + 1}. ${s.label}`}
            </option>
          ))}
        </select>
        {actual ? <p className="mt-2 text-small text-neutral-700">{actual.texto}</p> : null}
      </div>

      <div className="relative hidden md:block">
        <div
          ref={lista}
          role="tablist"
          aria-label={t.secciones}
          className="flex gap-1 overflow-x-auto rounded-lg border border-neutral-100 bg-neutral-0 p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{ maskImage: "linear-gradient(90deg, black calc(100% - 2.5rem), transparent)" }}
        >
          {secciones.map((s, i) => {
            const es = s.id === activa;
            return (
              <button
                key={s.id}
                type="button"
                role="tab"
                data-seccion={s.id}
                id={`tab-${s.id}`}
                aria-selected={es}
                aria-controls={panelId}
                tabIndex={es ? 0 : -1}
                onClick={() => onCambio(s.id)}
                onKeyDown={(e) => teclado(e, i)}
                className={`shrink-0 whitespace-nowrap rounded-md px-3.5 py-2 text-nav transition-colors duration-200 lg:px-4 ${
                  es
                    ? "bg-purple-900 text-white"
                    : "text-neutral-700 hover:bg-purple-100 hover:text-purple-900"
                }`}
              >
                {s.label}
              </button>
            );
          })}
          <span aria-hidden="true" className="w-8 shrink-0" />
        </div>
      </div>
    </div>
  );
}

/** Cambio de informe: dos enlaces (son páginas distintas) que conservan los filtros comunes. */
export function CambioDeInforme({ activo, hrefs }: { activo: InformeId; hrefs: Record<InformeId, string> }) {
  const informes = inteligencia.informes;
  return (
    <nav aria-label={t.cambiarInforme} className="w-full md:w-auto">
      <ul className="grid grid-cols-2 gap-1 rounded-lg bg-purple-100/60 p-1 md:inline-grid">
        {(Object.keys(informes) as InformeId[]).map((id) => {
          const es = id === activo;
          return (
            <li key={id}>
              <Link
                href={hrefs[id]}
                aria-current={es ? "page" : undefined}
                className={`flex min-h-11 items-center justify-center rounded-md px-3 text-center text-nav transition-colors duration-200 md:px-5 ${
                  es
                    ? "bg-neutral-0 text-purple-900 shadow-hairline"
                    : "text-neutral-700 hover:text-purple-900"
                }`}
              >
                {informes[id].corto}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
