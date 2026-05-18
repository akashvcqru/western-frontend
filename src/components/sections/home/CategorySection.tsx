"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CategorySection() {
  const categories = [
    {
      title: "Plywood & Glass",
      slug: "plywood-glass",
      image: "/hero-3.png",
      count: "20+"
    },
    {
      title: "GP / GC / CR Sheets",
      slug: "gp-gc-cr-sheets",
      image: "/hero-bg.png",
      count: "27+"
    },
    {
      title: "Tiles & Marbles",
      slug: "tiles-marbles",
      image: "/category_tiles_1777633637937.png",
      count: "34+"
    },
    {
      title: "Kitchen Ware Appliances",
      slug: "kitchen-ware",
      image: "/space_kitchen_1777633658509.png",
      count: "41+"
    },
    {
      title: "Hardware & Accessories",
      slug: "hardware",
      image: "/hero-1.png",
      count: "48+"
    },
    {
      title: "Sanitary & Fittings",
      slug: "sanitary-fittings",
      image: "/category_sanitary_1777633617437.png",
      count: "25+"
    }
  ];

  return (
    <section className="py-24 bg-neutral-50">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 space-y-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <span className="text-primary font-extrabold uppercase tracking-[0.2em] text-xs">
              Explore Collections
            </span>
            <h2 className="text-3xl lg:text-5xl font-bold text-secondary tracking-tight leading-tight">
              Shop by <br /> Category.
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

        {/* Desktop Grid */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat, idx) => (
            <Link 
              key={idx}
              href={`/products/${cat.slug}`}
              className="group relative overflow-hidden rounded-xl bg-neutral-100 aspect-[4/5] shadow-soft hover:shadow-premium transition-all duration-500 block"
            >
              <Image 
                alt={cat.title} 
                src={cat.image}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />
              <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary/80 mb-1 block">
                      {cat.count} Products
                    </span>
                    <h3 className="text-xl font-bold tracking-tight">
                      {cat.title}
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

        {/* Mobile Snap Slider */}
        <div className="relative group/slider sm:hidden">
          <div className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory gap-6 pb-8 -mx-4 px-4 scroll-smooth">
            {categories.map((cat, idx) => (
              <div key={idx} className="min-w-[85%] snap-center">
                <Link 
                  href={`/products/${cat.slug}`}
                  className="group relative overflow-hidden rounded-xl bg-neutral-100 aspect-[4/5] shadow-soft hover:shadow-premium transition-all duration-500 block"
                >
                  <Image 
                    alt={cat.title} 
                    src={cat.image}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />
                  <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary/80 mb-1 block">
                          {cat.count} Products
                        </span>
                        <h3 className="text-xl font-bold tracking-tight">
                          {cat.title}
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
                className={cn(
                  "h-2 rounded-full transition-all duration-500",
                  idx === 0 ? "w-8 bg-primary shadow-lg shadow-primary/20" : "w-2 bg-neutral-300 hover:bg-neutral-400"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
