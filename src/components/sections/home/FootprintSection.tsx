"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import siteContent from "@/data/site-content.json";
import { AppRoutes } from "@/constants/routes";

export default function FootprintSection() {
  const { footer } = siteContent;

  return (
    <section className="py-24 lg:py-32 bg-white relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#C5A267 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10">
        <div className="flex flex-col items-center text-center space-y-8 mb-20">
          <div className="w-20 h-20 rounded-[28px] bg-neutral-50 flex items-center justify-center text-primary border border-neutral-100 shadow-sm animate-pulse">
             <MapPin size={36} strokeWidth={1.5} />
          </div>
          <div className="space-y-4 max-w-3xl">
            <span className="text-primary font-extrabold uppercase tracking-[0.2em] text-xs">Our Footprint</span>
            <h3 className="text-3xl lg:text-5xl font-bold text-secondary tracking-tight leading-tight">
              Pan India <span className="text-primary">Presence.</span>
            </h3>
            <p className="text-gray-500 text-base lg:text-lg font-normal leading-relaxed">
              Delivering excellence across all major corporate hubs with seamless installation and local support.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 lg:gap-4">
          {footer.deliveryLocations.map((loc: string, i: number) => (
            <div 
              key={i} 
              className="group relative flex items-center justify-center py-5 px-4 bg-neutral-50/50 border border-neutral-100 rounded-2xl hover:bg-white hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 cursor-default"
            >
              <div className="absolute left-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              </div>
              <span className="text-[10px] font-semibold text-neutral-400 tracking-[0.2em] uppercase group-hover:text-secondary group-hover:translate-x-2 transition-all duration-500">
                {loc}
              </span>
            </div>
          ))}
        </div>
        
        <div className="mt-20 pt-12 border-t border-neutral-100 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="w-10 h-10 rounded-full border-2 border-white bg-neutral-100 flex items-center justify-center overflow-hidden">
                  <Image src={`https://i.pravatar.cc/100?img=${n + 10}`} alt="user" width={40} height={40} />
                </div>
              ))}
            </div>
            <p className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest">Trusted by 500+ Corporate Clients</p>
          </div>
          <Link 
            href={AppRoutes.Public.Contact}
            className="group flex items-center gap-4 text-xs font-black uppercase tracking-[0.2em] text-secondary hover:text-primary transition-colors"
          >
            Check Availability in Your Area
            <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
