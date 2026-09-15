export function SectionHeading({
  id,
  eyebrow,
  title,
  intro,
  tone = "light",
  size = "md",
}: {
  id: string;
  eyebrow: string;
  title: string;
  intro?: string;
  tone?: "light" | "dark";
  size?: "md" | "lg";
}) {
  const dark = tone === "dark";
  const titleClass = size === "lg" ? "text-h1-sm md:text-display-md" : "text-h1-sm md:text-h1";
  return (
    <div className="flex flex-col gap-5">
      <p
        className={`flex items-center gap-3 text-label uppercase ${dark ? "text-green-300" : "text-purple-700"}`}
      >
        <span aria-hidden="true" className={`h-px w-6 ${dark ? "bg-green-500" : "bg-purple-500"}`} />
        {eyebrow}
      </p>
      <h2 id={id} className={`${titleClass} measure ${dark ? "text-white" : "text-neutral-950"}`}>
        {title}
      </h2>
      {intro ? (
        <p className={`text-body measure ${dark ? "text-neutral-100" : "text-neutral-700"}`}>{intro}</p>
      ) : null}
    </div>
  );
}
