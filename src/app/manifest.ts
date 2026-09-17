import { existsSync } from "node:fs";
import path from "node:path";
import type { MetadataRoute } from "next";
import { site } from "@/content/site";

/**
 * Manifest mínimo. Los iconos 192/512 se derivan del isotipo (public/brand/README.md)
 * y solo se declaran si existen, para no publicar rutas rotas.
 */
export default function manifest(): MetadataRoute.Manifest {
  const icons = [
    { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
    { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
  ].filter((i) => existsSync(path.join(process.cwd(), "public", i.src)));
  return {
    name: site.name,
    short_name: "Novum",
    description: site.shortDescription,
    start_url: "/",
    display: "browser",
    background_color: "#f7f6fa",
    theme_color: "#4b16a8",
    icons,
  };
}
