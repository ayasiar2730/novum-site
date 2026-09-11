import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { site } from "@/content/site";
import { JsonLd } from "@/components/JsonLd";

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
    title: site.name,
    description: site.shortDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
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
        <JsonLd />
        {children}
      </body>
    </html>
  );
}
