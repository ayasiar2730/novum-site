"use client";

import { useEffect } from "react";

/**
 * Activa el motion solo cuando hay JavaScript: marca <html class="js">
 * y revela los bloques [data-reveal] al entrar en pantalla.
 * Lo que ya está en el primer fotograma se marca visible en el mismo tick,
 * así que nunca se pinta oculto. Sin JS o con reduced-motion: todo visible.
 */
export function MotionRoot() {
  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const blocks = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));

    if (reduce || !("IntersectionObserver" in window)) {
      blocks.forEach((el) => el.classList.add("in"));
      root.classList.add("js");
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -6% 0px" },
    );

    const viewportBottom = window.innerHeight;
    for (const el of blocks) {
      if (el.getBoundingClientRect().top < viewportBottom) {
        el.classList.add("in");
      } else {
        io.observe(el);
      }
    }
    root.classList.add("js");

    return () => io.disconnect();
  }, []);

  return null;
}
