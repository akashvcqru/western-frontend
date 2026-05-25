"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Briefcase,
  Sparkles,
  ArrowRight,
  Users,
  Globe2,
  ShieldCheck,
  Trophy,
  Layers,
  Compass,
  Activity,
  HeartHandshake,
} from "lucide-react";
import { QuoteModal } from "@/components/common";
import { PageHeader } from "@/components/ui";
import { useGetBrandsQuery } from "@/redux/api/brandsApi";
import { Loader2 } from "lucide-react";

export default function ClientsPage() {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
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

  return (
    <main className="bg-white">
      <QuoteModal isOpen={isQuoteOpen} onClose={() => setIsQuoteOpen(false)} />

      {/* Hero Section */}
      <PageHeader
        bgImage="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2070&auto=format&fit=crop"
        badgeIcon={Briefcase}
        badgeText="Client Portfolio"
        titlePrefix="Trusted by"
        titleHighlight="Industry Leaders."
        subtitle="We take pride in partnering with some of the world's most prestigious organizations to deliver high-performance workspace solutions."
      />

      {/* Trust Indicators Section - Upgraded to elegant rounded-xl cards */}
      <section className="py-12 lg:py-16 bg-white border-b border-neutral-100">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Users, label: "Happy Clients", value: "1000+" },
              {
                icon: Globe2,
                label: "Pan-India Presence",
                value: "32+ Cities",
              },
              {
                icon: ShieldCheck,
                label: "Quality Assurance",
                value: "100% Certified",
              },
              { icon: Trophy, label: "Years Experience", value: "20+ Years" },
            ].map((stat, i) => (
              <div
                key={i}
                className="flex flex-col items-center text-center p-6 bg-neutral-50/20 border border-neutral-100 rounded-xl hover:border-primary/25 hover:shadow-soft transition-all duration-500 group"
              >
                <div className="w-14 h-14 rounded-xl bg-neutral-50 flex items-center justify-center text-secondary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm mb-4">
                  <stat.icon size={24} />
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-extrabold text-secondary tracking-tight transition-colors group-hover:text-primary">
                    {stat.value}
                  </p>
                  <p className="text-[9px] font-black uppercase tracking-[0.25em] text-neutral-400">
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Clients Grid Section - Premium Logo Showcase loaded directly from JSON */}
      <section className="py-12 lg:py-16 bg-neutral-50/50 relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 space-y-12">
          {/* Section Heading */}
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary flex items-center justify-center gap-2">
              <Sparkles size={12} className="animate-pulse" /> Corporate Network
            </span>
            <h2 className="text-3xl lg:text-5xl font-extrabold text-secondary tracking-tight uppercase">
              Our <span className="text-primary">Esteemed Clients.</span>
            </h2>
            <p className="text-neutral-500 text-sm font-normal leading-relaxed">
              Serving a highly diverse network of industries, from corporate
              giants and tech leaders to medical conglomerates and automotive
              legends.
            </p>
          </div>

          {/* Premium Logo Cards Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="animate-spin text-primary" size={32} />
            </div>
          ) : brands.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-neutral-100 shadow-sm">
              <p className="text-neutral-400 text-sm font-semibold uppercase tracking-wider">No client brands added yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
              {brands.map((brand) => (
                <div
                  key={brand.id}
                  className="relative bg-white rounded-xl border border-neutral-100/70 p-6 flex flex-col items-center justify-between text-center overflow-hidden h-52 shadow-[0_8px_30px_rgba(0,0,0,0.015)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] hover:border-neutral-200 transition-all duration-300"
                >
                  {/* Logo Area: Styled Container with pure white background to integrate actual logo seamlessly */}
                  <div className="w-full h-16 flex items-center justify-center bg-white rounded-lg border border-neutral-50 p-2 shadow-sm shrink-0">
                    <Image
                      src={brand.url}
                      alt={brand.name}
                      width={130}
                      height={52}
                      className="object-contain hover:scale-105 transition-all duration-300"
                    />
                  </div>

                  {/* Brand Meta Details */}
                  <div className="space-y-1 w-full mt-3 flex-grow flex flex-col justify-center min-w-0">
                    <h3 className="text-xs font-bold text-neutral-800 tracking-tight leading-snug line-clamp-2 px-1">
                      {brand.name}
                    </h3>
                  </div>

                  {/* Globe domain representation with clean spacing */}
                  {brand.link && (
                    <div className="w-full pt-2 flex items-center justify-center gap-1.5 text-neutral-400 text-[10px] font-semibold tracking-wider shrink-0 min-w-0">
                      <Globe2 size={12} className="text-neutral-300" />
                      <span className="truncate">{getDomainName(brand.link)}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Excellence Pillars - Upgraded to elegant layout aspects */}
      <section className="py-16 lg:py-24 bg-white overflow-hidden relative">
        {/* Architectural Grid and Ambient Glow Background */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-45">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:16px_28px]" />
          <div className="absolute left-0 top-1/4 w-96 h-96 bg-primary/5 rounded-full filter blur-[100px] pointer-events-none" />
          <div className="absolute right-0 bottom-1/4 w-96 h-96 bg-neutral-100 rounded-full filter blur-[100px] pointer-events-none" />
        </div>

        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Image Container with premium border frames and asymmetrical overlays */}
            <div className="relative order-2 lg:order-1 flex justify-center items-center group/collage">
              {/* Asymmetrical Background Accent frame */}
              <div className="absolute -inset-4 rounded-xl bg-gradient-to-tr from-primary/5 to-neutral-50 border border-neutral-100 -rotate-2 scale-95 transition-all duration-700 group-hover/collage:rotate-1 group-hover/collage:scale-100" />
              
              {/* Main Image Frame with sleek shadows */}
              <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.08)] p-2 bg-white border border-neutral-100/80 z-10 transition-all duration-700 group-hover/collage:shadow-[0_30px_70px_rgba(0,0,0,0.12)]">
                <div className="w-full h-full relative overflow-hidden rounded-xl">
                  <Image
                    src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop"
                    alt="Corporate Office Interiors"
                    fill
                    priority
                    className="object-cover rounded-xl transition-all duration-1000 ease-out group-hover/collage:scale-105 group-hover/collage:rotate-0.5"
                  />
                  {/* Subtle vignette layer inside the image */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>

              {/* Floating Glassmorphic Badge A: Bottom Right */}
              <div className="absolute -bottom-6 -right-4 md:right-4 z-20 backdrop-blur-md bg-white/80 border border-neutral-200/50 rounded-lg p-4 shadow-[0_15px_30px_rgba(0,0,0,0.08)] flex items-center gap-3.5 transition-all duration-500 hover:scale-105 hover:bg-white/95 group/badgea">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary transition-all duration-300 group-hover/badgea:bg-primary group-hover/badgea:text-white">
                  <Activity size={18} className="animate-pulse" />
                </div>
                <div className="space-y-0.5 text-left">
                  <p className="text-[10px] font-black uppercase tracking-wider text-neutral-400">Ergonomic Design</p>
                  <p className="text-xs font-extrabold text-secondary tracking-tight">100% Certified Standards</p>
                </div>
              </div>

              {/* Floating Glassmorphic Badge B: Top Left */}
              <div className="absolute -top-6 -left-4 md:left-4 z-20 backdrop-blur-md bg-white/80 border border-neutral-200/50 rounded-lg p-3.5 shadow-[0_15px_30px_rgba(0,0,0,0.06)] flex items-center gap-3 transition-all duration-500 hover:scale-105 hover:bg-white/95 group/badgeb">
                <div className="w-9 h-9 rounded-lg bg-neutral-900 flex items-center justify-center text-white transition-all duration-300">
                  <Compass size={16} className="group-hover/badgeb:rotate-45 transition-transform duration-500" />
                </div>
                <div className="space-y-0.5 text-left">
                  <p className="text-[10px] font-black uppercase tracking-wider text-primary">Blueprints to Reality</p>
                  <p className="text-xs font-extrabold text-secondary tracking-tight">Complete Turnkey Delivery</p>
                </div>
              </div>
            </div>

            <div className="space-y-10 order-1 lg:order-2 relative z-10 text-left">
              {/* Header block */}
              <div className="space-y-5">
                {/* Premium pill badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/5 text-primary text-[10px] font-black uppercase tracking-[0.3em] border border-primary/10 shadow-sm w-fit">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  Why Leaders Choose Us
                </div>
                
                <h2 className="text-3xl lg:text-5xl font-extrabold text-secondary leading-tight tracking-tight uppercase">
                  Beyond <span className="text-primary relative inline-block">
                    Furniture.
                    <span className="absolute bottom-1.5 left-0 w-full h-[6px] bg-primary/15 rounded-full -z-10" />
                  </span>
                </h2>
                
                <p className="text-sm text-neutral-500 leading-relaxed font-normal max-w-xl">
                  We don&apos;t just supply layouts and office products; we <strong className="text-secondary font-bold">engineer complete modern environments</strong> that foster active collaboration, human-centric wellness, and world-class productivity standards.
                </p>
              </div>

              {/* Sophisticated 2x2 grid of modern micro-cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                {[
                  {
                    icon: Layers,
                    title: "Modular Solutions",
                    desc: "Tailored layout systems crafted specifically for every corporate sector.",
                  },
                  {
                    icon: Compass,
                    title: "Turnkey Execution",
                    desc: "Seamless project management from initial blueprint to final delivery.",
                  },
                  {
                    icon: Activity,
                    title: "Smart Ergonomics",
                    desc: "High-performance body alignment and strict global safety certifications.",
                  },
                  {
                    icon: HeartHandshake,
                    title: "Elite Support",
                    desc: "Unmatched post-sales care and scheduled lifecycle maintenance.",
                  }
                ].map((item, i) => (
                  <div 
                    key={i} 
                    className="group/card flex flex-col items-start gap-4 p-5 rounded-xl bg-neutral-50/45 border border-neutral-100 hover:border-neutral-200 hover:bg-white hover:shadow-[0_15px_35px_rgba(0,0,0,0.03)] -translate-y-0 hover:-translate-y-1 transition-all duration-300"
                  >
                    {/* Icon container */}
                    <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center text-secondary group-hover/card:bg-primary group-hover/card:text-white transition-all duration-300 shadow-sm shrink-0">
                      <item.icon size={18} className="group-hover/card:rotate-6 transition-transform duration-300" />
                    </div>
                    
                    <div className="space-y-1.5 text-left">
                      <h4 className="font-extrabold text-secondary tracking-tight text-xs uppercase group-hover/card:text-primary transition-colors duration-300">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-neutral-400 font-medium leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Redesigned executive banner layout */}
      <section className="py-12 lg:py-16 bg-neutral-950 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(237,28,39,0.12),transparent_70%)]" />
        </div>

        <div className="max-w-4xl mx-auto px-6 relative z-10 space-y-8">
          <div className="space-y-4">
            <span className="text-[10px] font-black tracking-[0.5em] text-primary uppercase">
              Ready to Transform?
            </span>
            <h2 className="text-3xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight uppercase">
              Join our <span className="text-primary">Network.</span>
            </h2>
            <p className="text-neutral-400 text-xs md:text-sm font-normal max-w-lg mx-auto">
              Partner with Western Interio to plan and erect workspaces designed
              specifically for the future. Request custom consultations now.
            </p>
          </div>

          <button
            onClick={() => setIsQuoteOpen(true)}
            className="inline-flex items-center gap-6 px-10 py-4.5 bg-primary text-white font-bold rounded-lg hover:bg-white hover:text-black transition-all duration-500 shadow-xl shadow-primary/20 tracking-[0.2em] text-[10px] uppercase cursor-pointer active:scale-95 group"
          >
            Get a Consultation
            <ArrowRight
              size={16}
              className="group-hover:translate-x-0.5 transition-transform"
            />
          </button>
        </div>
      </section>
    </main>
  );
}
