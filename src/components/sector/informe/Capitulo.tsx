import type { ReactNode } from "react";

/**
 * Cabecera editorial de un capítulo del informe: numeración grande (decorativa
 * para tecnologías de apoyo; el título lleva el sentido), título y la pregunta
 * que responde. Misma anatomía que los capítulos de la versión editorial.
 */
export function Capitulo({
  id,
  numero,
  titulo,
  pregunta,
  children,
  nivel = 3,
}: {
  id: string;
  numero: string;
  titulo: string;
  pregunta: string;
  children: ReactNode;
  /** 3 dentro del Home; 2 en la página del informe, donde la portada es el h1. */
  nivel?: 2 | 3;
}) {
  const Titulo = nivel === 2 ? "h2" : "h3";
  return (
    <article id={id} className="relative scroll-mt-28" aria-labelledby={`${id}-title`} data-reveal>
      <header className="flex items-start gap-5 md:gap-6">
        <p className="tnum text-[3.5rem] font-bold leading-none tracking-[-0.03em] text-purple-100 md:text-[4.5rem]">
          <span className="sr-only">Capítulo {numero}</span>
          <span aria-hidden="true">{numero}</span>
        </p>
        <div className="flex flex-col gap-2 pt-1 md:pt-2">
          <Titulo id={`${id}-title`} className="text-h2-sm md:text-h2 text-neutral-950">
            {titulo}
          </Titulo>
          <p className="text-body max-w-[30rem] text-purple-900">{pregunta}</p>
        </div>
      </header>
      <div className="mt-8 md:mt-10">{children}</div>
    </article>
  );
}

/** Rótulo pequeño con nodo de módulo, para subtítulos dentro de un capítulo. */
export function Rotulo({ children, tono = "purple" }: { children: ReactNode; tono?: "purple" | "neutral" }) {
  return (
    <p
      className={`flex items-center gap-3 text-label uppercase ${tono === "purple" ? "text-purple-700" : "text-neutral-700"}`}
    >
      <span
        aria-hidden="true"
        className={`h-2.5 w-2.5 shrink-0 rounded-sm border-[1.5px] ${
          tono === "purple" ? "border-purple-500 bg-purple-100" : "border-neutral-500 bg-neutral-0"
        }`}
      />
      {children}
    </p>
  );
}
