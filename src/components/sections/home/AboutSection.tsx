"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Palette, 
  Layout, 
  Building2, 
  Wrench, 
  ShieldCheck, 
  Utensils, 
  GraduationCap, 
  Sparkles,
  ArrowRight,
  Award,
  Sparkle
} from "lucide-react";
import siteContent from "@/data/site-content.json";
import { AppRoutes } from "@/constants/routes";

export default function AboutSection() {
  const { homePage } = siteContent;

  // Custom mapping of index to highly relevant corporate design icons
  const getIcon = (index: number) => {
    const icons = [
      Palette,        // Office interior decorating solutions
      Layout,         // Wall décor and storage solutions
      Building2,      // Office cubicles
      Wrench,         // Aluminium glass partitions
      ShieldCheck,    // File cabinets
      Utensils,       // Restaurant furniture
      GraduationCap,  // School furniture
      Sparkles        // Modular kitchen manufacturers
    ];
    return icons[index] || ShieldCheck;
  };

  return (
    <section className="py-24 lg:py-32 bg-neutral-50 overflow-hidden relative">
      {/* Background Architectural Grid Accent & Glows */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent skew-x-12 translate-x-1/3 pointer-events-none" />
      <div className="absolute top-1/2 left-2/3 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          
          {/* Left Column: Narrative & Values Grid */}
          <div className="lg:col-span-7 space-y-8 flex flex-col justify-center">
            
            {/* Header / Badging */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 animate-fade-in">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-primary font-black uppercase tracking-[0.3em] text-[10px]">
                  01 / About the Brand
                </span>
                <div className="h-[1px] w-12 bg-primary/20" />
              </div>
              <h2 className="text-3xl lg:text-5xl font-black text-secondary tracking-tight leading-[1.15]">
                Think to design <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-red-500 to-orange-500 font-extrabold relative inline-block">
                  beyond.
                  <span className="absolute left-0 bottom-1 w-full h-[3px] bg-gradient-to-r from-primary to-orange-500 rounded-full opacity-35" />
                </span>
              </h2>
            </div>

            {/* Description */}
            <p className="text-base text-neutral-600 leading-relaxed font-normal max-w-2xl">
              {homePage.whatWeAre.desc}
            </p>

            {/* Premium Stats Strip */}
            <div className="grid grid-cols-2 gap-8 border-y border-neutral-200/60 py-6 max-w-xl">
              <div className="space-y-1">
                <span className="text-4xl lg:text-5xl font-extrabold tracking-tighter text-secondary flex items-baseline">
                  20<span className="text-primary font-black text-3xl ml-0.5">+</span>
                </span>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
                  Years of Craftsmanship
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-4xl lg:text-5xl font-extrabold tracking-tighter text-secondary flex items-baseline">
                  1000<span className="text-primary font-black text-3xl ml-0.5">+</span>
                </span>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
                  Corporate Spaces Executed
                </p>
              </div>
            </div>

            {/* Custom Interactive Capabilities Grid */}
            <div className="space-y-4">
              <p className="text-xs font-black uppercase tracking-widest text-neutral-400">Our Areas of Expertise</p>
              <div className="grid sm:grid-cols-2 gap-4">
                {homePage.whatWeAre.list.map((item: string, i: number) => {
                  const IconComponent = getIcon(i);
                  return (
                    <div 
                      key={i} 
                      className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-neutral-100 shadow-soft hover:shadow-premium hover:border-primary/20 hover:-translate-y-0.5 transition-all duration-300 group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-neutral-50 text-secondary group-hover:bg-primary group-hover:text-white flex items-center justify-center shrink-0 transition-all duration-300 shadow-sm">
                        <IconComponent size={18} className="transition-transform group-hover:scale-110 duration-300" />
                      </div>
                      <span className="text-neutral-700 font-bold tracking-tight text-xs lg:text-[13px] leading-tight">
                        {item}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <Link 
                href={AppRoutes.Public.About} 
                className="inline-flex items-center gap-3 px-8 py-4 bg-secondary text-white font-extrabold tracking-[0.2em] text-[10px] uppercase rounded-xl transition-all duration-500 hover:bg-primary hover:-translate-y-0.5 shadow-lg shadow-neutral-200 hover:shadow-primary/20 group cursor-pointer active:scale-95"
              >
                Discover Our Journey
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>

          </div>
          
          {/* Right Column: Dynamic Overlapping Collage */}
          <div className="lg:col-span-5 relative flex items-center justify-center w-full min-h-[500px] lg:min-h-[600px] mt-12 lg:mt-0">
            
            {/* Main Backdrop Frame */}
            <div className="relative w-full aspect-[4/3] rounded-[48px] overflow-hidden shadow-2xl shadow-neutral-200 border-8 border-white bg-white group z-10">
              <Image 
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2070&auto=format&fit=crop"
                alt="Western Interio Corporate Boardroom"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-secondary/5 group-hover:bg-transparent transition-colors duration-1000" />
            </div>

            {/* Overlapping Detail Frame (Craftsmanship & Planning) */}
            <div className="absolute -bottom-10 -left-10 w-[55%] aspect-square rounded-[36px] overflow-hidden border-8 border-white bg-white shadow-2xl z-20 hidden sm:block group/sub hover:z-30 transition-all duration-500">
              <Image 
                src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=2070&auto=format&fit=crop"
                alt="Workspace Precision Manufacturing Detail"
                fill
                sizes="20vw"
                className="object-cover group-hover/sub:scale-105 transition-transform duration-1000"
              />
            </div>

            {/* Top-Right Floating Quality Badge (Glassmorphic) */}
            <div className="absolute -top-6 -right-4 z-30 bg-white/90 backdrop-blur-md px-5 py-3 rounded-2xl border border-neutral-100 shadow-premium flex items-center gap-3 animate-pulse hover:animate-none duration-1000">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Award size={18} />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-wider text-neutral-400">Quality Assured</p>
                <p className="text-[11px] font-black text-secondary">ISO 9001:2015 Firm</p>
              </div>
            </div>

            {/* Bottom-Right Luxury Overlay Card */}
            <div className="absolute -bottom-6 -right-4 z-30 bg-secondary/95 backdrop-blur-md text-white p-6 rounded-[28px] border border-neutral-800 shadow-2xl max-w-[220px] hidden md:block">
              <div className="flex items-center gap-2 text-primary mb-2">
                <Sparkle size={12} className="fill-primary" />
                <span className="text-[9px] font-black uppercase tracking-[0.2em]">Execution</span>
              </div>
              <h4 className="text-xs font-black text-white mb-1.5 leading-snug">Turnkey Interiors</h4>
              <p className="text-[10px] text-neutral-400 leading-normal font-normal">
                Bespoke layouts, False ceilings, acoustic glass partition systems, and optimized office workspace seating.
              </p>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
