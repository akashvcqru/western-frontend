"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function SpaceSection() {
  const spaces = [
    {
      title: "Bathroom",
      slug: "sanitary-fittings",
      image: "/category_sanitary_1777633617437.png"
    },
    {
      title: "Kitchen",
      slug: "kitchen-ware",
      image: "/space_kitchen_1777633658509.png"
    },
    {
      title: "Living Room",
      slug: "tiles-marbles",
      image: "/category_tiles_1777633637937.png"
    },
    {
      title: "Outdoor",
      slug: "outdoor",
      image: "/space_outdoor_1777633678279.png"
    }
  ];

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 space-y-16">
        <div className="text-center space-y-4">
          <span className="text-primary font-extrabold uppercase tracking-[0.2em] text-xs">
            Curated Environments
          </span>
          <h2 className="text-3xl lg:text-5xl font-bold text-secondary tracking-tight leading-tight">
            Shop by Space.
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {spaces.map((space, idx) => (
            <Link 
              key={idx}
              href={`/products/${space.slug}`}
              className="group relative h-[600px] overflow-hidden rounded-2xl shadow-soft transition-all duration-700 block"
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
    </section>
  );
}
