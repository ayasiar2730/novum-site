"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { inteligencia } from "@/content/inteligencia";
import type { FichaCifra } from "@/lib/inteligencia/contrato";

const t = inteligencia.ficha;

/**
 * Un bloque de lectura: título, una línea que dice qué se ve y el contenido.
 * Sin sombras apiladas: borde fino y aire (sistema de diseño v1).
 */
export function Bloque({
  titulo,
  subtitulo,
  accion,
  children,
  id,
  className = "",
}: {
  titulo: string;
  subtitulo?: ReactNode;
  accion?: ReactNode;
  children: ReactNode;
  id?: string;
  className?: string;
}) {
  const auto = useId();
  const hid = id ?? `b-${auto}`;
  return (
    <section
      aria-labelledby={hid}
      className={`flex min-w-0 flex-col gap-5 rounded-lg border border-neutral-100 bg-neutral-0 p-5 md:p-6 ${className}`}
    >
      <header className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
        <div className="flex min-w-0 flex-col gap-1">
          <h3 id={hid} className="text-h3-sm text-neutral-950">
            {titulo}
          </h3>
          {subtitulo ? <p className="text-small text-neutral-700">{subtitulo}</p> : null}
        </div>
        {accion ? <div className="shrink-0">{accion}</div> : null}
      </header>
      {children}
    </section>
  );
}

/** Nota de contexto (fuente, alcance, advertencia). Morado suave: es método, no alarma. */
export function Nota({ children }: { children: ReactNode }) {
  return (
    <p className="flex gap-2.5 rounded-md border border-purple-100 bg-purple-100/40 px-3.5 py-3 text-small text-neutral-900">
      <span aria-hidden="true" className="mt-2 inline-block size-1.5 shrink-0 rounded-full bg-purple-500" />
      <span className="min-w-0">{children}</span>
    </p>
  );
}

/**
 * «Cómo se calcula»: la ficha de una cifra (definición, unidad, periodo, fuente,
 * universo y nota de método) en un diálogo nativo. Teclado: Esc cierra; el foco
 * vuelve al botón.
 */
export function Ficha({
  ficha,
  fuente,
  universo,
  periodo,
  compacta = false,
}: {
  ficha: FichaCifra | undefined;
  fuente: string;
  universo: string;
  periodo: string;
  /** Solo el icono (dentro de una tarjeta); el nombre va en el texto accesible. */
  compacta?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [abierta, setAbierta] = useState(false);
  const tid = useId();
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (abierta && !d.open) d.showModal();
    if (!abierta && d.open) d.close();
  }, [abierta]);
  if (!ficha) return null;
  return (
    <>
      <button
        type="button"
        onClick={() => setAbierta(true)}
        className={`inline-flex items-center gap-1.5 rounded-md text-small text-purple-700 transition-colors hover:bg-purple-100 hover:text-purple-900 ${compacta ? "-m-1.5 size-8 justify-center" : "min-h-8 px-2"}`}
        aria-haspopup="dialog"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          className="size-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <circle cx="8" cy="8" r="6.25" />
          <path d="M8 7.25v4M8 4.75v.5" strokeLinecap="round" />
        </svg>
        {compacta ? (
          <span className="sr-only">{`${t.boton}: ${ficha.nombre}`}</span>
        ) : (
          <>
            {t.boton}
            <span className="sr-only">: {ficha.nombre}</span>
          </>
        )}
      </button>
      <dialog
        ref={ref}
        aria-labelledby={tid}
        onClose={() => setAbierta(false)}
        onClick={(e) => {
          if (e.target === ref.current) setAbierta(false);
        }}
        className="m-auto w-[min(34rem,calc(100vw-2rem))] rounded-lg border border-neutral-100 bg-neutral-0 p-0 text-neutral-900 shadow-lift backdrop:bg-neutral-950/40"
      >
        <div className="flex flex-col gap-4 p-5 md:p-6">
          <div className="flex items-start justify-between gap-4">
            <h2 id={tid} className="text-h3-sm text-neutral-950">
              {ficha.nombre}
            </h2>
            <button
              type="button"
              onClick={() => setAbierta(false)}
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-md text-neutral-700 hover:bg-neutral-50"
            >
              <span className="sr-only">{t.cerrar}</span>
              <svg
                aria-hidden="true"
                viewBox="0 0 16 16"
                className="size-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              >
                <path d="M4 4l8 8M12 4l-8 8" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <dl className="grid gap-3 text-small">
            <Dato termino={t.formula}>{ficha.definicion}</Dato>
            <Dato termino={t.unidad}>{t.unidades[ficha.unidad]}</Dato>
            <Dato termino={t.periodo}>{`${t.periodos[ficha.periodo]} · ${periodo}`}</Dato>
            <Dato termino={t.universo}>{universo}</Dato>
            <Dato termino={t.fuente}>{fuente}</Dato>
            {ficha.nota ? <Dato termino={t.nota}>{ficha.nota}</Dato> : null}
          </dl>
        </div>
      </dialog>
    </>
  );
}

function Dato({ termino, children }: { termino: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-label uppercase text-neutral-700">{termino}</dt>
      <dd className="text-neutral-900">{children}</dd>
    </div>
  );
}

/** Selector compacto dentro de un bloque (p. ej. qué crecimiento o qué indicador ver). */
export function Selector<T extends string>({
  etiqueta,
  valor,
  opciones,
  onCambio,
}: {
  etiqueta: string;
  valor: T;
  opciones: readonly { id: T; label: string }[];
  onCambio: (v: T) => void;
}) {
  const id = useId();
  return (
    <label htmlFor={id} className="flex flex-col gap-1 text-label uppercase text-neutral-700">
      {etiqueta}
      <select
        id={id}
        value={valor}
        onChange={(e) => onCambio(e.target.value as T)}
        className="min-h-10 rounded-md border border-neutral-300 bg-neutral-0 px-3 text-small normal-case tracking-normal text-neutral-950 focus-visible:border-purple-500"
      >
        {opciones.map((o) => (
          <option key={o.id} value={o.id}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
