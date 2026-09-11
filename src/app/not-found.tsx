import { ButtonLink } from "@/components/ButtonLink";
import { Logo } from "@/components/Logo";

export default function NotFound() {
  return (
    <main className="container-site flex flex-1 flex-col items-start justify-center gap-6 py-24">
      <Logo variant="light" />
      <p className="text-label uppercase text-purple-700">Error 404</p>
      <h1 className="text-h1-sm md:text-h1 measure text-neutral-950">Esta página no existe.</h1>
      <p className="text-body measure text-neutral-700">
        Es posible que el enlace esté incompleto o que la página se haya movido.
      </p>
      <ButtonLink href="/">Volver al inicio</ButtonLink>
    </main>
  );
}
