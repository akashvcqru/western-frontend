"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGetGalleryQuery } from "@/redux/api/galleryApi";
import { slugify } from "@/lib/utils";

export default function SpaceSection() {
  const { data: galleryResult } = useGetGalleryQuery({ limit: 1000 });
  const scrollRef = useRef<HTMLDivElement>(null);
  const isInteracting = useRef(false);

  const dynamicSpaces = React.useMemo(() => {
    if (!galleryResult?.data || galleryResult.data.length === 0) {
      return null;
    }

    const groups: { [key: string]: string } = {};
    galleryResult.data.forEach((item) => {
      const cat = item.category || "Uncategorized";
      if (!groups[cat] && item.image) {
        groups[cat] = item.image;
      }
    });

    return Object.entries(groups).map(([category, image]) => ({
      title: category,
      href: `/gallery/${slugify(category)}`,
      image: image,
    }));
  }, [galleryResult]);

  const spaces = dynamicSpaces;

  // Triple the items for infinite scrolling
  const extendedSpaces = React.useMemo(() => {
    if (!spaces) return [];
    return [...spaces, ...spaces, ...spaces];
  }, [spaces]);

  // Infinite Scroll Boundary Reset (for manual swipe/drag)
  useEffect(() => {
    const container = scrollRef.current;
    if (!container || !spaces || spaces.length <= 1) return;

    const handleScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      const firstCard = container.firstElementChild as HTMLElement;
      if (!firstCard) return;
      const cardWidth = firstCard.offsetWidth + 16; // card width + gap-4
      const singleSetWidth = spaces.length * cardWidth;

      // If we scroll too close to the end, jump back to the middle set
      if (scrollLeft + clientWidth >= scrollWidth - cardWidth) {
        container.scrollTo({ left: scrollLeft - singleSetWidth, behavior: "auto" });
      }
      // If we scroll too close to the beginning, jump forward to the middle set
      else if (scrollLeft <= cardWidth) {
        container.scrollTo({ left: scrollLeft + singleSetWidth, behavior: "auto" });
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });

    // Initial position: center the scroll on the second set of cards
    const initScroll = () => {
      const firstCard = container.firstElementChild as HTMLElement;
      if (firstCard) {
        const cardWidth = firstCard.offsetWidth + 16;
        container.scrollTo({ left: spaces.length * cardWidth, behavior: "auto" });
      }
    };

    initScroll();
    const timer = setTimeout(initScroll, 150);

    return () => {
      container.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, [spaces]);

  // Auto-scroll loop
  useEffect(() => {
    if (!spaces || spaces.length <= 1) return;

    const interval = setInterval(() => {
      if (isInteracting.current) return;

      if (scrollRef.current) {
        const container = scrollRef.current;
        const firstCard = container.firstElementChild as HTMLElement;
        if (!firstCard) return;

        const cardWidth = firstCard.offsetWidth + 16;
        const singleSetWidth = spaces.length * cardWidth;
        const { scrollLeft, scrollWidth, clientWidth } = container;

        // If we are about to scroll past the second set, jump back to the second set first
        if (scrollLeft >= singleSetWidth * 2 - clientWidth) {
          container.scrollTo({ left: scrollLeft - singleSetWidth, behavior: "auto" });
        }

        // Smoothly scroll by one card width
        container.scrollBy({ left: cardWidth, behavior: "smooth" });
      }
    }, 4000); // Autoplay slide interval

    return () => clearInterval(interval);
  }, [spaces]);

  if (!spaces) {
    return null;
  }

  return (
    <section className="pt-12 pb-6 lg:pt-16 lg:pb-10 bg-white overflow-hidden relative">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 space-y-10">
        
        {/* Title header */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shrink-0" />
            <span className="text-primary font-black tracking-[0.25em] text-[10px] uppercase">
              Curated Environments
            </span>
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold text-secondary tracking-tight leading-tight">
            Our Projects.
          </h2>
        </div>
        
        {/* Carousel Container Wrapper */}
        <div className="relative w-full">
          
          {/* Horizontal Carousel Container */}
          <div 
            ref={scrollRef}
            onMouseEnter={() => { isInteracting.current = true; }}
            onMouseLeave={() => { isInteracting.current = false; }}
            onTouchStart={() => { isInteracting.current = true; }}
            onTouchEnd={() => {
              setTimeout(() => {
                isInteracting.current = false;
              }, 2000);
            }}
            className="w-full flex overflow-x-auto no-scrollbar gap-4 pb-6 -mx-4 px-4 md:mx-0 md:px-0 scroll-smooth snap-x snap-mandatory"
          >
            {extendedSpaces.map((space, idx) => (
              <Link 
                key={idx}
                href={space.href}
                className="group relative h-[420px] w-[280px] sm:w-[calc((100%-16px)/2)] md:w-[calc((100%-32px)/3)] lg:w-[calc((100%-48px)/4)] flex-shrink-0 overflow-hidden rounded-2xl shadow-soft transition-all duration-700 block snap-start"
              >
                <Image 
                  alt={space.title} 
                  src={space.image}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/60 transition-all duration-500" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                  <h3 className="text-2xl font-bold text-white tracking-tight translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    {space.title}
                  </h3>
                  <div className="w-0 h-[2px] bg-primary mt-4 group-hover:w-24 transition-all duration-700" />
                  <p className="text-white/0 group-hover:text-white/80 text-[10px] font-bold uppercase tracking-[0.2em] mt-4 transition-opacity duration-700">
                    Explore Collection
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


