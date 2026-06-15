"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useGetGalleryQuery } from "@/redux/api/galleryApi";
import { slugify } from "@/lib/utils";

export default function SpaceSection() {
  const { data: galleryResult } = useGetGalleryQuery({ limit: 1000 });

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

  // Guarantee at least 8 items in the single set to prevent blank spaces on wide screens
  const singleSet = React.useMemo(() => {
    if (!spaces || spaces.length === 0) return [];
    let list = [...spaces];
    while (list.length < 8) {
      list = [...list, ...spaces];
    }
    return list;
  }, [spaces]);

  // Duplicate the set once for continuous marquee loop
  const listToRender = React.useMemo(() => {
    return [...singleSet, ...singleSet];
  }, [singleSet]);

  if (!spaces || spaces.length === 0) {
    return null;
  }

  return (
    <section className="pt-12 pb-6 lg:pt-16 lg:pb-10 bg-white overflow-hidden relative">
      {/* Centered Title Header */}
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 mb-10">
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
      </div>
      
      {/* Full-Width Carousel (No max-width constraints, no mask-fade) */}
      <div className="relative w-full project-slider-container overflow-hidden">
        {/* Horizontal Carousel Container */}
        <div 
          className="animate-marquee-projects flex items-center gap-4 py-4 whitespace-nowrap project-marquee-row w-max"
        >
          {listToRender.map((space, idx) => (
            <Link 
              key={idx}
              href={space.href}
              className="group relative h-[420px] w-[280px] md:w-[320px] flex-shrink-0 overflow-hidden rounded-2xl shadow-soft transition-all duration-700 block"
            >
              <Image 
                alt={space.title} 
                src={space.image}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/60 transition-all duration-500" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 whitespace-normal">
                <h3 className="text-2xl font-bold text-white tracking-tight translate-y-4 group-hover:translate-y-0 transition-transform duration-500 leading-tight">
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
