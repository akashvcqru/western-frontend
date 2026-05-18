import React from "react";
import Image from "next/image";
import { Sparkles, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  bgImage: string;
  badgeText?: string;
  badgeIcon?: LucideIcon;
  badge?: React.ReactNode;
  titlePrefix?: string;
  titleHighlight?: string;
  title?: React.ReactNode;
  subtitle: string;
  className?: string;
  imageClassName?: string;
}

export default function PageHeader({
  bgImage,
  badgeText,
  badgeIcon: BadgeIcon,
  badge,
  titlePrefix,
  titleHighlight,
  title,
  subtitle,
  className,
  imageClassName,
}: PageHeaderProps) {
  return (
    <section
      className={cn(
        "relative min-h-[50vh] flex items-center justify-center overflow-hidden bg-neutral-950 pt-28 pb-32",
        className,
      )}
    >
      {/* Background Image with subtle scale/pulsing */}
      <Image
        src={bgImage}
        alt={badgeText || "Western Interio"}
        fill
        sizes="100vw"
        priority
        className={cn(
          "object-cover opacity-15 grayscale scale-105 transition-transform duration-[12000ms] ease-out",
          imageClassName,
        )}
      />

      {/* Premium Geometric Mesh Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4.5rem_4.5rem]" />

      {/* Radical Contrast Blur Effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[500px] bg-[radial-gradient(circle,rgba(237,28,39,0.12)_0%,transparent_70%)] rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 text-center space-y-6 max-w-4xl px-6 mt-6">
        {/* Glowing Animated Badge */}
        {badge
          ? badge
          : badgeText && (
              <div className="inline-flex items-center gap-2.5 px-4.5 py-1.5 bg-white/5 border border-white/10 backdrop-blur-md rounded-full shadow-inner animate-in fade-in duration-700">
                {BadgeIcon ? (
                  <BadgeIcon size={12} className="text-primary" />
                ) : (
                  <Sparkles size={12} className="text-primary animate-pulse" />
                )}
                <span className="text-[10px] font-black tracking-[0.35em] text-white uppercase">
                  {badgeText}
                </span>
              </div>
            )}

        {/* Premium Typography */}
        {title ? (
          typeof title === "string" ? (
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight uppercase"
              dangerouslySetInnerHTML={{ __html: title }}
            />
          ) : (
            title
          )
        ) : (
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight uppercase">
            {titlePrefix} <br className="sm:hidden" />
            {titleHighlight && (
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-rose-500 font-extrabold relative inline-block">
                {titleHighlight}
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-primary/95 rounded-full blur-[0.5px]" />
              </span>
            )}
          </h1>
        )}

        {/* Elegant descriptive sub-headline */}
        <p className="text-xs sm:text-sm md:text-base text-neutral-400 max-w-2xl mx-auto leading-relaxed font-normal">
          {subtitle}
        </p>
      </div>
    </section>
  );
}
