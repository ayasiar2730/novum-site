import { statusLabel, type ProductStatus } from "@/content/site";

/**
 * Estado de producto. Misma forma, tamaño y posición en los tres módulos;
 * solo cambia el color (docs/novum-design-system-v1.md §2).
 */
const styles: Record<ProductStatus, string> = {
  pruebas: "bg-green-100 text-green-700",
  desarrollo: "bg-purple-100 text-purple-700",
  diseno: "bg-neutral-100 text-neutral-700",
};

export function StatusTag({ status }: { status: ProductStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-2 self-start rounded-full px-3 py-1.5 text-label uppercase ${styles[status]}`}
    >
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />
      {statusLabel[status]}
    </span>
  );
}
