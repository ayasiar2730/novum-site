"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cta, nav, site } from "@/content/site";
import { demoLink } from "@/lib/links";
import { ButtonLink } from "@/components/ButtonLink";

/** Altura de la barra (h-16). Se usa como margen del observador del hero. */
const BAR = 64;

/**
 * Header premium (Fase A). Tres estados de superficie, ninguno con scroll handler:
 * - en la cima: liviano y transparente sobre el hero;
 * - desplazado dentro del hero: velo claro apenas perceptible;
 * - superado el hero: barra de vidrio sutil con sombra corta; el CTA principal
 *   entra aquí para no competir con el del hero.
 * La sección activa se detecta con IntersectionObserver sobre una banda al
 * 40–45 % del alto de la ventana; el indicador es una línea que se desliza bajo
 * el enlace. Nunca se modifica la URL: los enlaces siguen siendo anclas normales.
 */
export function Header({ logo }: { logo: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [marker, setMarker] = useState<{ left: number; width: number } | null>(null);
  const [open, setOpen] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Superficie: el centinela (8 px en la cima del documento) dice si hay
  // desplazamiento; el hero, observado con el margen de la barra, dice si ya
  // quedó atrás.
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
      const io = new IntersectionObserver(([e]) => setPastHero(!e.isIntersecting), {
        rootMargin: `-${BAR}px 0px 0px 0px`,
      });
      io.observe(hero);
      observers.push(io);
    }
    return () => observers.forEach((io) => io.disconnect());
  }, []);

  // Sección activa: la última cuyo inicio ya cruzó el 45 % del alto de la
  // ventana. El observador solo despierta cuando un borde cruza la banda.
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const sections = nav
      .map((item) => document.getElementById(item.href.slice(1)))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const pick = () => {
      const limit = window.innerHeight * 0.45;
      let current: string | null = null;
      for (const el of sections) {
        if (el.getBoundingClientRect().top <= limit) current = `#${el.id}`;
      }
      setActive(current);
    };
    const io = new IntersectionObserver(pick, { rootMargin: "-40% 0px -55% 0px" });
    sections.forEach((el) => io.observe(el));
    pick();
    return () => io.disconnect();
  }, []);

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
    ? "bg-neutral-0 shadow-[0_1px_0_rgba(44,14,114,0.06)]"
    : pastHero
      ? "bg-neutral-0/80 shadow-[0_1px_0_rgba(44,14,114,0.06),0_16px_32px_-28px_rgba(44,14,114,0.35)] backdrop-blur-md"
      : scrolled
        ? "bg-neutral-50/70 backdrop-blur-sm"
        : "bg-transparent";

  return (
    <>
      <div
        ref={sentinelRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 h-2 w-px"
      />
      <header
        className={`sticky top-0 z-50 transition-[background-color,box-shadow] duration-300 motion-reduce:transition-none ${surface}`}
      >
        <div className="container-site flex h-16 items-center justify-between gap-6">
          <a href="#" aria-label={`${site.name} — inicio`} className="shrink-0">
            {logo}
          </a>

          <nav
            ref={navRef}
            aria-label="Principal"
            className="relative hidden h-16 items-center gap-6 lg:flex xl:gap-8"
          >
            {nav.map((item) => {
              const isActive = active === item.href;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "location" : undefined}
                  className={`text-nav transition-colors duration-200 hover:text-purple-900 ${
                    isActive ? "text-purple-900" : "text-neutral-700"
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
            {/* Indicador de sección activa: una línea que se desliza bajo el enlace. */}
            <span
              aria-hidden="true"
              className={`absolute bottom-0 h-0.5 rounded-full bg-purple-500 transition-[left,width,opacity] duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] motion-reduce:transition-none ${
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
              className="text-nav text-neutral-500 transition-colors duration-200 hover:text-purple-900"
            >
              {cta.app}
            </a>
            {/* El CTA principal solo gana protagonismo cuando el hero (que ya lo tiene) queda atrás. */}
            <div
              inert={!pastHero}
              className={`transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] motion-reduce:transition-none ${
                pastHero ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0"
              }`}
            >
              <ButtonLink href={demoLink} external size="sm">
                {cta.primary}
              </ButtonLink>
            </div>
          </div>

          <button
            ref={toggleRef}
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-neutral-900 lg:hidden"
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
            <nav aria-label="Principal (móvil)" className="container-site flex flex-col gap-1 py-5">
              {nav.map((item) => {
                const isActive = active === item.href;
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={isActive ? "location" : undefined}
                    className={`-mx-3 flex min-h-14 items-center gap-4 rounded-lg px-3 text-lead font-semibold transition-colors duration-200 ${
                      isActive ? "bg-purple-100/70 text-purple-900" : "text-neutral-900 hover:bg-neutral-50"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`h-2.5 w-2.5 shrink-0 rounded-full border-[1.5px] ${
                        isActive ? "border-purple-700 bg-purple-500" : "border-purple-500 bg-purple-100"
                      }`}
                    />
                    {item.label}
                  </a>
                );
              })}
              <a
                href={site.appUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="-mx-3 mt-3 flex min-h-12 items-center rounded-lg px-3 text-body text-neutral-500 transition-colors duration-200 hover:text-purple-900"
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
