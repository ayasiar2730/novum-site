import { contact } from "@/content/site";

/** Enlace de WhatsApp con mensaje opcional, al primer número de contacto. */
export function whatsappLink(message?: string, index = 0): string {
  const number = contact.whatsapp[index]?.number ?? contact.whatsapp[0].number;
  const base = `https://wa.me/${number}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export const demoLink = whatsappLink(contact.demoMessage);
export const chatLink = whatsappLink();
