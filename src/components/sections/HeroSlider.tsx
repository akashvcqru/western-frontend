"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { AppRoutes } from "@/constants/routes";
import siteContent from "@/data/site-content.json";

export default function HeroSlider() {
  const slides = siteContent.homePage.heroSlider;
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [current, slides.length]);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="relative h-[85vh] w-full overflow-hidden bg-black">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={cn(
            "absolute inset-0 transition-all duration-1000 ease-in-out",
            current === index ? "opacity-100 z-10 visible" : "opacity-0 z-0 invisible"
          )}
        >
          <Image
            src={slide.image}
            alt={slide.subtitle}
            fill
            sizes="100vw"
            className={cn(
              "object-cover opacity-60 transition-transform duration-[6000ms] ease-linear",
              current === index ? "scale-105" : "scale-100"
            )}
            priority={index === 0}
          />

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/80 via-secondary/20 to-transparent" />

          <div className="relative h-full max-w-[1440px] mx-auto px-4 lg:px-8 flex flex-col justify-center items-start">
            <div className="space-y-8 max-w-2xl">
              <div className={cn(
                "inline-block px-4 py-1.5 bg-primary/20 backdrop-blur-sm border-l-4 border-primary text-primary text-xs font-bold tracking-[0.2em] transition-all duration-1000 delay-100",
                current === index ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              )}>
                {slide.subtitle}
              </div>
              <h1
                className={cn(
                  "text-5xl lg:text-8xl font-black text-white leading-[1.1] transition-all duration-1000 delay-300",
                  current === index ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                )}
                dangerouslySetInnerHTML={{ __html: slide.title }}
              />

              <p className={cn(
                "text-lg text-gray-300 leading-relaxed max-w-lg transition-all duration-1000 delay-500",
                current === index ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              )}>
                {slide.description}
              </p>

              <div className={cn(
                "flex gap-4 pt-4 transition-all duration-1000 delay-700",
                current === index ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              )}>
                <Link
                  href={AppRoutes.Public.Products}
                  className="group px-8 py-4 bg-primary text-white font-bold rounded-sm flex items-center gap-2 hover:bg-secondary hover:-translate-y-1 transition-all duration-500 shadow-lg hover:shadow-primary/20"
                >
                  Explore Showcase
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href={AppRoutes.Public.Contact}
                  className="px-8 py-4 bg-white/10 backdrop-blur-md text-white font-bold rounded-sm border border-white/20 hover:bg-white hover:text-secondary hover:-translate-y-1 transition-all duration-500 shadow-lg"
                >
                  Get a Quote
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <div className="absolute bottom-12 right-12 flex gap-4 z-20">
        <button
          onClick={prevSlide}
          className="p-4 border border-white/20 rounded-full text-white hover:bg-primary hover:border-primary transition-all duration-500 cursor-pointer hover:scale-110 active:scale-95"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={nextSlide}
          className="p-4 border border-white/20 rounded-full text-white hover:bg-primary hover:border-primary transition-all duration-500 cursor-pointer hover:scale-110 active:scale-95"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-12 left-12 flex gap-3 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={cn(
              "h-1.5 transition-all duration-300 cursor-pointer",
              current === i ? "w-12 bg-primary" : "w-6 bg-white/30 hover:bg-white/50"
            )}
          />
        ))}
      </div>
    </section>
  );
}
