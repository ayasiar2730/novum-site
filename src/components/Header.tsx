"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cta, nav, site } from "@/content/site";
import { demoLink } from "@/lib/links";
import { ButtonLink } from "@/components/ButtonLink";

/**
 * Header (Fase A + B0; multipágina en la fase 2). Vive en el layout, así que
 * persiste entre páginas. Tres estados de superficie, ninguno con scroll handler:
 * - en la cima del Home: liviano y transparente, parte del hero;
 * - desplazado dentro del hero: velo claro apenas perceptible;
 * - superado el hero (o en cualquier página interna, que no tiene hero): barra
 *   clara con un desenfoque discreto y sombra corta; el CTA principal entra aquí
 *   para no competir con el del hero.
 * La marca es el imagotipo que llega por <Logo>; "Ingresar a la plataforma" es un
 * botón secundario tintado, sin borde. La página activa sale de la ruta; el
 * indicador es una píldora morada que se desliza detrás del enlace activo.
 */
export function Header({ logo }: { logo: ReactNode }) {
  const pathname = usePathname() ?? "/";
  const esInicio = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [pastHeroObservado, setPastHero] = useState(false);
  const pastHero = esInicio ? pastHeroObservado : true;
  const active =
    nav.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))?.href ?? null;
  const [marker, setMarker] = useState<{ left: number; width: number } | null>(null);
  const [open, setOpen] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Superficie: el centinela (8 px en la cima del documento) dice si hay
  // desplazamiento; el hero del Home, observado con el margen de la barra, dice
  // si ya quedó atrás. Se vuelve a enganchar en cada página.
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const sentinel = sentinelRef.current;
    const hero = document.getElementById("inicio");
    const observers: IntersectionObserver[] = [];

    if (sentinel) {
      const io = new IntersectionObserver(([e]) => setScrolled(!e.isIntersecting));
      io.observe(sentinel);
      observers.push(io);
    }
    if (hero) {
      const bar = headerRef.current?.offsetHeight ?? 72;
      const io = new IntersectionObserver(([e]) => setPastHero(!e.isIntersecting), {
        rootMargin: `-${bar}px 0px 0px 0px`,
      });
      io.observe(hero);
      observers.push(io);
    }
    return () => observers.forEach((io) => io.disconnect());
  }, [pathname]);

  // Indicador: se mide sobre el enlace activo; se vuelve a medir si la barra cambia de tamaño.
  useEffect(() => {
    const navEl = navRef.current;
    if (!navEl) return;
    const measure = () => {
      const link = active ? navEl.querySelector<HTMLAnchorElement>(`a[href="${active}"]`) : null;
      setMarker(link ? { left: link.offsetLeft, width: link.offsetWidth } : null);
    };
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(navEl);
    return () => ro.disconnect();
  }, [active]);

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const focusables = panel?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
    focusables?.[0]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (e.key === "Tab" && focusables && focusables.length > 0) {
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const surface = open
    ? "bg-neutral-0 shadow-hairline"
    : pastHero
      ? "bg-neutral-0/88 shadow-lift backdrop-blur-sm"
      : scrolled
        ? "bg-neutral-50/90 shadow-hairline backdrop-blur-md"
        : "bg-transparent";

  return (
    <>
      <div
        ref={sentinelRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 h-2 w-px"
      />
      <header
        ref={headerRef}
        className={`sticky top-0 z-50 transition-[background-color,box-shadow] duration-300 motion-reduce:transition-none ${surface}`}
      >
        {/* progreso del recorrido: hairline ligado al scroll; aparece cuando el hero queda atrás */}
        <span
          aria-hidden="true"
          className={`progreso absolute bottom-0 left-0 h-0.5 w-full bg-purple-500 transition-opacity duration-300 motion-reduce:transition-none ${
            pastHero && !open ? "opacity-100" : "opacity-0"
          }`}
        />
        <div className="container-wide flex h-16 items-center justify-between gap-6 lg:h-[4.5rem]">
          <Link href="/" aria-label={`${site.name} — inicio`} className="flex min-h-11 shrink-0 items-center">
            {logo}
          </Link>

          <nav
            ref={navRef}
            aria-label="Principal"
            className="relative hidden h-full items-center gap-1 lg:flex xl:gap-2"
          >
            {nav.map((item) => {
              const isActive = active === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`relative z-[1] flex h-11 items-center rounded-md px-3.5 text-nav transition-colors duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] motion-reduce:transition-none ${
                    isActive ? "text-white" : "text-neutral-700 hover:text-purple-900"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            {/* Indicador de sección activa: una píldora morada que se desliza detrás del enlace activo. */}
            <span
              aria-hidden="true"
              className={`absolute top-1/2 h-11 -translate-y-1/2 rounded-md bg-purple-700 shadow-button transition-[left,width,opacity] duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] motion-reduce:transition-none ${
                marker ? "opacity-100" : "opacity-0"
              }`}
              style={marker ? { left: marker.left, width: marker.width } : { left: 0, width: 0 }}
            />
          </nav>

          <div className="hidden items-center gap-4 lg:flex xl:gap-5">
            <a
              href={site.appUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center gap-2 rounded-md bg-purple-100/70 px-3.5 text-small font-semibold text-purple-900 transition-[background-color,color] duration-200 hover:bg-purple-100"
            >
              {cta.app}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path
                  d="M3.5 10.5 10.5 3.5M5.5 3.5h5v5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            {/* El CTA principal solo gana protagonismo cuando el hero (que ya lo tiene) queda atrás. */}
            <div
              inert={!pastHero}
              className={`grid transition-[grid-template-columns,margin-left,opacity,transform] duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] motion-reduce:transition-none ${
                pastHero
                  ? "ml-4 translate-y-0 opacity-100 [grid-template-columns:1fr]"
                  : "pointer-events-none ml-0 -translate-y-1 opacity-0 [grid-template-columns:0fr]"
              }`}
            >
              <div className="min-w-0 overflow-hidden">
                <ButtonLink href={demoLink} external size="sm">
                  {cta.primary}
                </ButtonLink>
              </div>
            </div>
          </div>

          <button
            ref={toggleRef}
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-md text-neutral-900 lg:hidden"
            aria-expanded={open}
            aria-controls="menu-movil"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">{open ? "Cerrar menú" : "Abrir menú"}</span>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              {open ? (
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>

        {open ? (
          <div
            id="menu-movil"
            ref={panelRef}
            className="menu-movil max-h-[calc(100dvh-4rem)] overflow-y-auto bg-neutral-0 shadow-lift lg:hidden"
          >
            <nav aria-label="Principal (móvil)" className="container-wide flex flex-col gap-1 py-5">
              {nav.map((item) => {
                const isActive = active === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={isActive ? "page" : undefined}
                    className={`-mx-3 flex min-h-14 items-center gap-4 rounded-md px-3 text-lead font-semibold transition-colors duration-200 ${
                      isActive
                        ? "bg-purple-700 text-white shadow-button"
                        : "text-neutral-900 hover:bg-neutral-50"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`h-3 w-3 shrink-0 rounded-sm border-[1.5px] ${
                        isActive ? "border-white bg-white/90" : "border-purple-500 bg-purple-100"
                      }`}
                    />
                    {item.label}
                  </Link>
                );
              })}
              <a
                href={site.appUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="-mx-3 mt-3 flex min-h-12 items-center rounded-md px-3 text-body text-neutral-700 transition-colors duration-200 hover:text-purple-900"
              >
                {cta.app}
              </a>
              <div className="pb-1 pt-4">
                <ButtonLink href={demoLink} external className="w-full">
                  {cta.primary}
                </ButtonLink>
              </div>
            </nav>
          </div>
        ) : null}
      </header>
    </>
  );
}
