export function SectionHeading({
  id,
  eyebrow,
  title,
  intro,
  tone = "light",
}: {
  id: string;
  eyebrow: string;
  title: string;
  intro?: string;
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  return (
    <div className="flex flex-col gap-4">
      <p className={`text-label uppercase ${dark ? "text-green-300" : "text-purple-700"}`}>{eyebrow}</p>
      <h2 id={id} className={`text-h1-sm md:text-h1 measure ${dark ? "text-white" : "text-neutral-950"}`}>
        {title}
      </h2>
      {intro ? (
        <p className={`text-body measure ${dark ? "text-neutral-100" : "text-neutral-700"}`}>{intro}</p>
      ) : null}
    </div>
  );
}
