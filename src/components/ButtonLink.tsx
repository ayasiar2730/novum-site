import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "onDark" | "onDarkSecondary";
type Size = "md" | "sm";

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-semibold transition-colors duration-200";

const sizes: Record<Size, string> = {
  md: "h-12 px-5 text-small",
  sm: "h-10 px-4 text-small",
};

const variants: Record<Variant, string> = {
  primary: "bg-purple-700 text-white hover:bg-purple-900",
  secondary: "border border-neutral-300 text-neutral-900 hover:border-neutral-500",
  onDark: "bg-green-500 text-purple-900 hover:bg-green-300",
  onDarkSecondary: "border border-white/35 text-white hover:border-white/70",
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  size = "md",
  external = false,
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  external?: boolean;
  className?: string;
}) {
  const externalProps = external ? { target: "_blank", rel: "noopener noreferrer" } : {};
  return (
    <a href={href} className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...externalProps}>
      {children}
    </a>
  );
}
