"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import clients from "@/data/clients.json";
import siteContent from "@/data/site-content.json";

export default function BrandSlider() {
  const { brandSlider } = siteContent;

  return (
    <section className="w-full bg-[#fcfcfc] py-24 border-y border-gray-100/50 overflow-hidden relative">
      {/* Decorative dotted grid background */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(#ed1c27_1px,transparent_1px)] [background-size:32px_32px]"></div>
      </div>

      {/* Luxury Ambient Spotlight Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(237,28,39,0.04),transparent_65%)] pointer-events-none"></div>

      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 space-y-20 relative z-10">
        {/* Premium Title Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 shadow-sm animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            <span className="text-primary font-black tracking-[0.25em] text-[9px] uppercase">
              {brandSlider.badge}
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-secondary leading-none uppercase">
            {brandSlider.title.split(' Partners')[0]} <span className="text-primary">Partners.</span>
          </h2>
        </div>

        {/* Unified Sliding Marquee Container */}
        <div className="relative brand-slider-container mask-fade">
          <div className="animate-marquee-left flex items-center gap-6 lg:gap-8 py-2 whitespace-nowrap marquee-content-row">
            {[...clients, ...clients].map((client, index) => (
              <div
                key={`${client.name}-${index}`}
                className="flex-shrink-0 group"
              >
                <Link
                  href="/clients"
                  className="relative w-36 h-20 lg:w-48 lg:h-24 flex flex-col items-center justify-center bg-white/80 backdrop-blur-md rounded-2xl border border-gray-100/80 shadow-soft hover:shadow-[0_20px_40px_-15px_rgba(237,28,39,0.12)] hover:border-primary/20 hover:bg-white transition-all duration-500 scale-95 group-hover:scale-100 group-hover:-translate-y-2.5 overflow-hidden cursor-pointer"
                >
                  {/* Subtle red glow tint on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Logo Container Wrapper (guarantees perfect elegant proportions) */}
                  <div className="relative w-full h-full flex items-center justify-center grayscale opacity-55 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700">
                    <div className="relative w-[60%] h-[60%] group-hover:scale-90 transition-all duration-700">
                      <Image
                        src={client.logo}
                        alt={client.name}
                        fill
                        sizes="(max-width: 768px) 100px, 130px"
                        className="object-contain"
                      />
                    </div>
                  </div>

                  {/* Slide up website domain text */}
                  <span className="absolute bottom-2 text-[8px] font-black tracking-[0.2em] text-primary uppercase opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                    {client.domain}
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
