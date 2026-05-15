"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import brands from "@/data/brands.json";
import siteContent from "@/data/site-content.json";

export default function BrandSlider() {
  const { brandSlider } = siteContent;

  return (
    <section className="w-full bg-[#fcfcfc] py-24 border-y border-gray-100 overflow-hidden relative">
      {/* Decorative background element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-[0.03] pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(#ed1c27_1px,transparent_1px)] [background-size:40px_40px]"></div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 space-y-16 relative z-10">
        <div className="text-center space-y-4">
          <span className="text-primary font-extrabold tracking-[0.2em] text-xs">
            {brandSlider.badge}
          </span>
          <h2 className="text-4xl lg:text-6xl font-extrabold text-secondary leading-none">
            {brandSlider.title.split(' Partners')[0]} <span className="text-primary">Partners.</span>
          </h2>
        </div>
      </div>
      
      <div className="relative brand-slider-container mask-fade">
        <div className="animate-marquee flex items-center gap-8 lg:gap-12 py-4 whitespace-nowrap marquee-content">
          {[...brands, ...brands, ...brands, ...brands].map((brand, index) => (
            <Link
              key={`${brand.name}-${index}`}
              href={brand.link}
              className="flex-shrink-0 group"
            >
              <div className="relative w-36 h-20 lg:w-48 lg:h-24 flex items-center justify-center bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-premium transition-all duration-500 group-hover:-translate-y-2 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative w-full h-full p-6 grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 flex items-center justify-center scale-90 group-hover:scale-100">
                  <Image
                    src={brand.url}
                    alt={brand.name}
                    fill
                    sizes="(max-width: 768px) 144px, 192px"
                    className="object-contain p-2"
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
