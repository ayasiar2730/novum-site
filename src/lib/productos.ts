import { products } from "@/content/site";
import type { ProductoClave } from "@/content/portafolio";

export interface ProductoVM {
  clave: ProductoClave;
  nombre: string;
  subtitulo: string;
  texto: string;
}

/** Los tres productos de Tecnología Novum en una forma común (resúmenes y páginas de línea). */
export const PRODUCTOS: readonly ProductoVM[] = [
  {
    clave: "risk",
    nombre: products.siar.name,
    subtitulo: products.siar.fullName,
    texto: products.siar.resumen,
  },
  {
    clave: "budget",
    nombre: products.others[0].name,
    subtitulo: products.others[0].subtitle,
    texto: products.others[0].tagline,
  },
  {
    clave: "planning",
    nombre: products.others[1].name,
    subtitulo: products.others[1].subtitle,
    texto: products.others[1].tagline,
  },
];

export const productoPorClave = (clave: ProductoClave) => PRODUCTOS.find((p) => p.clave === clave) ?? null;
