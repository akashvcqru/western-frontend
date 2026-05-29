"use client";

import Image from "next/image";
import Link from "next/link";
import siteContent from "@/data/site-content.json";
import { useGetBrandsQuery } from "@/redux/api/brandsApi";
import { Loader2 } from "lucide-react";

export default function BrandSlider() {
  const { brandSlider } = siteContent;
  const { data: brandsResult, isLoading } = useGetBrandsQuery({ limit: 100 });
  const brands = brandsResult?.data || [];

  const getDomainName = (url: string) => {
    try {
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = "https://" + url;
      }
      return new URL(url).hostname.replace("www.", "");
    } catch {
      return url;
    }
  };

  if (isLoading) {
    return (
      <section className="w-full bg-[#fcfcfc] py-12 border-y border-gray-100/50 overflow-hidden relative">
        <div className="flex items-center justify-center min-h-[120px]">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      </section>
    );
  }

  if (brands.length === 0) {
    return null; // Gracefully hide the section if no brands are added
  }

  // Duplicate the brand list for a smooth marquee loop
  const listToRender = [...brands, ...brands];

  return (
    <section className="w-full bg-[#fcfcfc] py-12 border-y border-gray-100/50 overflow-hidden relative">
      {/* Decorative dotted grid background */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(#ed1c27_1px,transparent_1px)] [background-size:32px_32px]"></div>
      </div>

      {/* Luxury Ambient Spotlight Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(237,28,39,0.04),transparent_65%)] pointer-events-none"></div>

      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 space-y-10 relative z-10">
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
            {listToRender.map((brand, index) => (
              <div
                key={`${brand.id}-${index}`}
                className="flex-shrink-0 group"
              >
                <Link
                  href={brand.link || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative w-36 h-20 lg:w-48 lg:h-24 flex flex-col items-center justify-center bg-white/80 backdrop-blur-md rounded-2xl border border-gray-100/80 shadow-soft hover:shadow-[0_20px_40px_-15px_rgba(237,28,39,0.12)] hover:border-primary/20 hover:bg-white transition-all duration-500 scale-95 group-hover:scale-100 group-hover:-translate-y-2.5 overflow-hidden cursor-pointer"
                >
                  {/* Subtle red glow tint on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Logo Container Wrapper (guarantees perfect elegant proportions) */}
                  <div className="relative w-full h-full flex items-center justify-center grayscale opacity-55 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700">
                    <div className="relative w-[60%] h-[60%] group-hover:scale-90 transition-all duration-700">
                      <Image
                        src={brand.url}
                        alt={brand.name}
                        fill
                        sizes="(max-width: 768px) 100px, 130px"
                        className="object-contain"
                      />
                    </div>
                  </div>

                  {/* Slide up website domain text */}
                  {brand.link && (
                    <span className="absolute bottom-2 text-[8px] font-black tracking-[0.2em] text-primary uppercase opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                      {getDomainName(brand.link)}
                    </span>
                  )}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
