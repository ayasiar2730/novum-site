import Link from "next/link";
import { lineas, solucionesTexto } from "@/content/portafolio";

function Flecha() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="mt-1.5 shrink-0 text-purple-700 transition-transform duration-200 group-hover:translate-x-0.5"
    >
      <path
        d="M3 8h9M8.5 4.5 12 8l-3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Las siete líneas del portafolio como índice: número, título y promesa, y
 * cada fila entera lleva a la página de su línea (enlace estirado sobre el
 * título, para que el nombre accesible sea el de la línea). En «completa»
 * (página /soluciones) cada fila añade lo que la entidad recibe. Sin
 * tarjetas: filas sobre una retícula de dos columnas con filetes.
 */
export function ListaLineas({
  variante = "resumen",
  nivel = 3,
}: {
  variante?: "resumen" | "completa";
  /** Nivel del título de cada línea: 3 bajo un h2 del Home, 2 bajo el h1 de /soluciones. */
  nivel?: 2 | 3;
}) {
  const Titulo = nivel === 2 ? "h2" : "h3";
  return (
    <ol className="grid border-t border-neutral-300/70 md:grid-cols-2 md:gap-x-10">
      {lineas.map((l, i) => (
        <li
          key={l.slug}
          className="group relative grid grid-cols-[auto_1fr_auto] gap-x-5 border-b border-neutral-300/70 py-6 md:py-7"
          data-reveal
          style={{ transitionDelay: `${(i % 2) * 60}ms` }}
        >
          <span className="tnum pt-1 text-label text-purple-700" aria-hidden="true">
            {l.numero}
          </span>
          <div className="flex flex-col gap-2">
            <Titulo className="text-h3-sm md:text-h3 text-neutral-950 transition-colors duration-200 group-hover:text-purple-900">
              <Link
                href={`/soluciones/${l.slug}`}
                className="outline-none after:absolute after:inset-0 after:rounded-sm focus-visible:after:ring-2 focus-visible:after:ring-purple-500"
              >
                {l.titulo}
              </Link>
            </Titulo>
            <p className="text-body-sm max-w-[32rem] text-neutral-700">{l.promesa}</p>
            {variante === "completa" ? (
              <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-label uppercase text-purple-700">
                <span className="sr-only">{solucionesTexto.valorLabel}:</span>
                {l.valor.map((v, j) => (
                  <span key={v.titulo} className="flex items-center gap-3">
                    {j > 0 ? <span aria-hidden="true" className="h-1 w-1 rounded-full bg-green-500" /> : null}
                    {v.titulo}
                  </span>
                ))}
              </p>
            ) : null}
          </div>
          <Flecha />
        </li>
      ))}
    </ol>
  );
}
