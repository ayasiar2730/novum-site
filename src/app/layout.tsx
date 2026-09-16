import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { site } from "@/content/site";
import { JsonLd } from "@/components/JsonLd";
import { MotionRoot } from "@/components/MotionRoot";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Novum Integral — Software y consultoría para el sector solidario",
    template: "%s · Novum Integral",
  },
  description: site.metaDescription,
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: "/",
    siteName: site.name,
    title: site.ogTitle,
    description: site.shortDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: site.ogTitle,
    description: site.shortDescription,
  },
};

export const viewport: Viewport = {
  themeColor: "#4b16a8",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-CO" className={`${jakarta.variable} h-full`}>
      <body className="flex min-h-full flex-col">
        {/* Primer elemento enfocable: invisible hasta recibir foco (WCAG 2.4.1). */}
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-purple-900 focus:px-4 focus:py-3 focus:text-small focus:font-semibold focus:text-white focus:shadow-lift"
        >
          Saltar al contenido
        </a>
        <JsonLd />
        {children}
        <MotionRoot />
      </body>
    </html>
  );
}
