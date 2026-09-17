"use client";

import { useEffect, useRef, type RefObject } from "react";

/**
 * Navegación contextual de lectura (B2): mientras el usuario recorre una lista,
 * el elemento que cruza la banda central de la ventana (40–55 %) pasa a ser el
 * activo, así el panel que lo acompaña cuenta la historia al ritmo del scroll.
 * IntersectionObserver, sin scroll handlers; el cursor manda mientras está
 * encima de la lista, y el foco por teclado sigue fijando el activo como antes.
 */
export function useLectura<T extends HTMLElement>(
  list: RefObject<T | null>,
  itemSelector: string,
  onActive: (index: number) => void,
) {
  const hovering = useRef(false);
  useEffect(() => {
    const el = list.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const items = Array.from(el.querySelectorAll<HTMLElement>(itemSelector));
    const io = new IntersectionObserver(
      (entries) => {
        if (hovering.current) return;
        for (const e of entries) {
          if (e.isIntersecting) onActive(items.indexOf(e.target as HTMLElement));
        }
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    items.forEach((i) => io.observe(i));
    const enter = () => (hovering.current = true);
    const leave = () => (hovering.current = false);
    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointerleave", leave);
    return () => {
      io.disconnect();
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointerleave", leave);
    };
  }, [list, itemSelector, onActive]);
}
