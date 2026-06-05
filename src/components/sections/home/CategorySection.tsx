"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetCategoriesQuery } from "@/redux/api/categoriesApi";

export default function CategorySection() {
  const { data: categoriesResult, isLoading } = useGetCategoriesQuery({ limit: 100 });

  const categories = React.useMemo(() => {
    if (!categoriesResult?.data) return [];
    return categoriesResult.data.filter((c) => c.status === "Active" && (!c.location || c.location.toLowerCase() === "header"));
  }, [categoriesResult]);

  const [activeIndex, setActiveIndex] = React.useState(0);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const isInteracting = React.useRef(false);
  const autoplayTimer = React.useRef<ReturnType<typeof setInterval> | null>(null);

  // Scroll to a specific slide index
  const scrollToIndex = React.useCallback((index: number) => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const items = container.querySelectorAll("[data-slide-index]");
    const targetItem = items[index] as HTMLElement;
    if (targetItem) {
      container.scrollTo({
        left: targetItem.offsetLeft - container.offsetLeft - 16,
        behavior: "smooth"
      });
      setActiveIndex(index);
    }
  }, []);

  // Track manual scroll to update active dot index
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const items = container.querySelectorAll("[data-slide-index]");
    if (items.length === 0) return;
    
    // Find the item closest to the center of the scroll viewport
    const containerCenter = container.scrollLeft + container.clientWidth / 2;
    let closestIndex = 0;
    let minDistance = Infinity;

    items.forEach((item, index) => {
      const el = item as HTMLElement;
      const itemCenter = el.offsetLeft + el.clientWidth / 2;
      const distance = Math.abs(itemCenter - containerCenter);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });

    setActiveIndex(closestIndex);
  };

  // Setup autoplay loop
  React.useEffect(() => {
    if (categories.length <= 1) return;

    const startAutoplay = () => {
      if (autoplayTimer.current) clearInterval(autoplayTimer.current);
      autoplayTimer.current = setInterval(() => {
        if (isInteracting.current) return;
        setActiveIndex((prev) => {
          const nextIndex = (prev + 1) % categories.length;
          scrollToIndex(nextIndex);
          return nextIndex;
        });
      }, 5000); // Auto slide every 5 seconds
    };

    const stopAutoplay = () => {
      if (autoplayTimer.current) {
        clearInterval(autoplayTimer.current);
      }
    };

    startAutoplay();

    return () => stopAutoplay();
  }, [categories.length, scrollToIndex]);

  const handleTouchStart = () => {
    isInteracting.current = true;
  };

  const handleTouchEnd = () => {
    // Resume autoplay after a short delay
    setTimeout(() => {
      isInteracting.current = false;
    }, 2000);
  };

  return (
    <section className="pt-12 pb-12 lg:pt-16 lg:pb-16 bg-neutral-50">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 space-y-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shrink-0" />
              <span className="text-primary font-black tracking-[0.25em] text-[10px] uppercase">
                Explore Collections
              </span>
            </div>
            <h2 className="text-3xl lg:text-5xl font-bold text-secondary tracking-tight leading-tight">
              Shop by Category.
            </h2>
          </div>
          <Link
            href="/categories"
            className="group flex items-center gap-4 text-xs font-bold uppercase tracking-widest hover:text-primary transition-colors"
          >
            View All Categories
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        )}

        {/* Empty state */}
        {!isLoading && categories.length === 0 && (
          <div className="text-center py-24 text-neutral-400 text-sm">
            No categories available yet.
          </div>
        )}

        {/* Desktop Grid */}
        {!isLoading && categories.length > 0 && (
          <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products/${cat.slug || cat.id}`}
                className="group relative overflow-hidden rounded-xl bg-neutral-100 aspect-[4/3] shadow-soft hover:shadow-premium transition-all duration-500 block"
              >
                <Image
                  alt={cat.name}
                  src={cat.image || "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2070&auto=format&fit=crop"}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />
                <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold tracking-tight">
                        {cat.name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <span className="text-[10px] font-black uppercase tracking-widest border-b-2 border-primary pb-1">
                        View Collection
                      </span>
                      <ArrowUpRight size={16} className="text-primary" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Mobile Snap Slider */}
        {!isLoading && categories.length > 0 && (
          <div className="relative group/slider sm:hidden">
            <div 
              ref={scrollRef}
              onScroll={handleScroll}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onMouseEnter={() => { isInteracting.current = true; }}
              onMouseLeave={() => { isInteracting.current = false; }}
              className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory gap-6 pb-8 -mx-4 px-4 scroll-smooth"
            >
              {categories.map((cat, idx) => (
                <div 
                  key={cat.id} 
                  data-slide-index={idx}
                  className="min-w-[85%] snap-center"
                >
                  <Link
                    href={`/products/${cat.slug || cat.id}`}
                    className="group relative overflow-hidden rounded-xl bg-neutral-100 aspect-[4/3] shadow-soft hover:shadow-premium transition-all duration-500 block"
                  >
                    <Image
                      alt={cat.name}
                      src={cat.image || "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2070&auto=format&fit=crop"}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />
                    <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <h3 className="text-xl font-bold tracking-tight">
                            {cat.name}
                          </h3>
                        </div>
                        <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500">
                          <span className="text-[10px] font-black uppercase tracking-widest border-b-2 border-primary pb-1">
                            View Collection
                          </span>
                          <ArrowUpRight size={16} className="text-primary" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            {/* Slider Dots */}
            <div className="flex justify-center gap-3 mt-4">
              {categories.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => scrollToIndex(idx)}
                  className={cn(
                    "h-2 rounded-full transition-all duration-500 cursor-pointer",
                    activeIndex === idx ? "w-8 bg-primary shadow-lg shadow-primary/20" : "w-2 bg-neutral-300 hover:bg-neutral-400"
                  )}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
