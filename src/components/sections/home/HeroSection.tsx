"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import siteContent from "@/data/site-content.json";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  onOpenQuote: () => void;
}

export default function HeroSection({ onOpenQuote }: HeroSectionProps) {
  const { homePage } = siteContent;
  const [currentSlide, setCurrentSlide] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % homePage.heroSlider.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [homePage.heroSlider.length]);

  return (
    <section className="relative h-screen overflow-hidden group bg-neutral-950">
      
      {homePage.heroSlider.map((slide: any, idx: number) => (
        <div
          key={slide.id}
          className={cn(
            "absolute inset-0 transition-all duration-1000 ease-in-out transform",
            currentSlide === idx 
              ? "opacity-100 scale-105 pointer-events-auto z-20" 
              : "opacity-0 scale-100 pointer-events-none z-0 invisible"
          )}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            priority={idx === 0}
            className="object-cover"
          />
          {/* Cinematic dark overlay layer for maximum text legibility and premium depth */}
          <div className="absolute inset-0 bg-neutral-950/40 z-10 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-neutral-950/60 z-10 pointer-events-none" />

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-20">
            <div className="max-w-4xl space-y-6">
              <span className="inline-block px-5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-black uppercase tracking-[0.4em] text-primary animate-in fade-in slide-in-from-bottom-8 duration-1000">
                {slide.subtitle}
              </span>
              <h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight animate-in fade-in slide-in-from-bottom-8 duration-1000"
                dangerouslySetInnerHTML={{ __html: slide.title }}
              />
              <p className="text-sm md:text-base lg:text-lg text-white/80 max-w-xl mx-auto font-normal leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000">
                {slide.description}
              </p>
              <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <button
                  onClick={onOpenQuote}
                  className="w-full sm:w-auto px-10 py-4 bg-primary text-white font-bold tracking-[0.2em] text-[11px] uppercase rounded-lg hover:bg-white hover:text-black transition-all duration-500 shadow-xl shadow-primary/10 cursor-pointer active:scale-95 flex items-center justify-center gap-3 group"
                >
                  Start Your Project
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <Link
                  href="/products"
                  className="w-full sm:w-auto px-10 py-4 bg-white/5 backdrop-blur-xl border border-white/20 text-white font-bold tracking-[0.2em] text-[11px] uppercase rounded-lg hover:bg-white hover:text-black transition-all duration-500 cursor-pointer active:scale-95 text-center"
                >
                  Explore Designs
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Slide Controls - Minimal */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4">
        {homePage.heroSlider.map((_: any, idx: number) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={cn(
              "h-1.5 rounded-full transition-all duration-500 cursor-pointer",
              currentSlide === idx ? "w-12 bg-primary" : "w-6 bg-white/20 hover:bg-white/40"
            )}
          />
        ))}
      </div>
    </section>
  );
}
