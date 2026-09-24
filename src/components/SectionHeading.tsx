/** Nivel del título: 2 dentro del Home; 1 cuando la sección abre su propia página (fase 2). */
export type NivelTitulo = 1 | 2;

export function SectionHeading({
  id,
  eyebrow,
  title,
  intro,
  tone = "light",
  size = "md",
  nivel = 2,
}: {
  id: string;
  eyebrow: string;
  title: string;
  intro?: string;
  tone?: "light" | "dark";
  size?: "md" | "lg";
  nivel?: NivelTitulo;
}) {
  const dark = tone === "dark";
  const titleClass = size === "lg" ? "text-h1-sm md:text-display-md" : "text-h1-sm md:text-h1";
  const Titulo = nivel === 1 ? "h1" : "h2";
  return (
    <div className="flex flex-col gap-5">
      <p
        className={`flex items-center gap-3 text-label uppercase ${dark ? "text-green-300" : "text-purple-700"}`}
      >
        <span aria-hidden="true" className={`h-px w-6 ${dark ? "bg-green-500" : "bg-purple-500"}`} />
        {eyebrow}
      </p>
      <Titulo id={id} className={`${titleClass} measure ${dark ? "text-white" : "text-neutral-950"}`}>
        {title}
      </Titulo>
      {intro ? (
        <p className={`text-body measure ${dark ? "text-neutral-100" : "text-neutral-700"}`}>{intro}</p>
      ) : null}
    </div>
  );
}
