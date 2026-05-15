import React from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant = "primary" | "secondary" | "outline" | "ghost" | "dark";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
  className?: string;
  children: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({
  variant = "primary",
  className,
  children,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black tracking-widest transition-all duration-300 hover:scale-105 active:scale-95";

  const variantStyles = {
    primary: "bg-primary/10 text-primary border border-primary/20",
    secondary: "bg-secondary/10 text-secondary border border-secondary/20",
    outline: "bg-transparent border border-neutral-200 text-neutral-500",
    ghost: "bg-neutral-100 text-neutral-600 border-transparent",
    dark: "bg-white/10 text-white/60 border border-white/10 hover:border-primary hover:text-white",
  };

  return (
    <div
      className={cn(baseStyles, variantStyles[variant], className)}
      {...props}
    >
      {children}
    </div>
  );
};

export default Badge;
