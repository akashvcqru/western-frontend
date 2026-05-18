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
  Building2,
  Trophy,
  CheckCircle2
} from "lucide-react";
import { QuoteModal } from "@/components/common";
import clients from "@/data/clients.json";
import { PageHeader } from "@/components/ui";

export default function ClientsPage() {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);

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
              { icon: Globe2, label: "Pan-India Presence", value: "32+ Cities" },
              { icon: ShieldCheck, label: "Quality Assurance", value: "100% Certified" },
              { icon: Trophy, label: "Years Experience", value: "20+ Years" }
            ].map((stat, i) => (
              <div 
                key={i} 
                className="flex flex-col items-center text-center p-6 bg-neutral-50/20 border border-neutral-100 rounded-xl hover:border-primary/25 hover:shadow-soft transition-all duration-500 group"
              >
                <div className="w-14 h-14 rounded-xl bg-neutral-50 flex items-center justify-center text-secondary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm mb-4">
                  <stat.icon size={24} />
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-extrabold text-secondary tracking-tight transition-colors group-hover:text-primary">{stat.value}</p>
                  <p className="text-[9px] font-black uppercase tracking-[0.25em] text-neutral-400">{stat.label}</p>
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
              Serving a highly diverse network of industries, from corporate giants and tech leaders to medical conglomerates and automotive legends.
            </p>
          </div>

          {/* Premium Logo Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
            {clients.map((client, i) => (
              <div
                key={i}
                className="relative bg-white rounded-xl border border-neutral-100/70 p-6 flex flex-col items-center justify-between text-center overflow-hidden h-52 shadow-[0_8px_30px_rgba(0,0,0,0.015)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] hover:border-neutral-200 transition-all duration-300"
              >
                {/* Logo Area: Styled Container with pure white background to integrate actual logo seamlessly */}
                <div className="w-full h-16 flex items-center justify-center bg-white rounded-lg border border-neutral-50 p-2 shadow-sm shrink-0">
                  <Image
                    src={client.logo}
                    alt={client.name}
                    width={130}
                    height={52}
                    className="object-contain hover:scale-105 transition-all duration-300"
                  />
                </div>

                {/* Brand Meta Details */}
                <div className="space-y-1 w-full mt-3 flex-grow flex flex-col justify-center min-w-0">
                  <h3 className="text-xs font-bold text-neutral-800 tracking-tight leading-snug line-clamp-2 px-1">
                    {client.name}
                  </h3>
                </div>

                {/* Globe domain representation with clean spacing (no divider line!) */}
                <div className="w-full pt-2 flex items-center justify-center gap-1.5 text-neutral-400 text-[10px] font-semibold tracking-wider shrink-0 min-w-0">
                  <Globe2 size={12} className="text-neutral-300" />
                  <span className="truncate">{client.domain}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Excellence Pillars - Upgraded to elegant layout aspects */}
      <section className="py-12 lg:py-16 bg-white overflow-hidden relative">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            
            {/* Image Container with premium border frames */}
            <div className="relative order-2 lg:order-1">
              <div className="aspect-[4/3] relative rounded-2xl overflow-hidden shadow-2xl p-2 bg-neutral-50 border border-neutral-100">
                <Image
                  src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop"
                  alt="Corporate Office Interiors"
                  fill
                  className="object-cover rounded-xl"
                />
              </div>
            </div>
            
            <div className="space-y-10 order-1 lg:order-2">
              <div className="space-y-4">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Why Leaders Choose Us</span>
                <h2 className="text-3xl lg:text-5xl font-extrabold text-secondary leading-tight tracking-tight uppercase">
                  Beyond <span className="text-primary">Furniture.</span>
                </h2>
                <p className="text-sm text-neutral-500 leading-relaxed font-normal">
                  We don't just supply layout products; we engineer office environments that foster active collaboration, employee wellness, and corporate productivity standards.
                </p>
              </div>

              <div className="space-y-5">
                {[
                  "Tailored modular solutions for every corporate sector",
                  "Turnkey project management from design blueprints to delivery",
                  "High-performance ergonomics and strict certifications",
                  "Unmatched prompt after-sales support and scheduled maintenance"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 group">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors duration-300 shrink-0">
                      <CheckCircle2 size={13} className="text-primary group-hover:text-white" />
                    </div>
                    <span className="font-extrabold text-secondary tracking-tight text-sm uppercase transition-colors group-hover:text-primary">{item}</span>
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
            <span className="text-[10px] font-black tracking-[0.5em] text-primary uppercase">Ready to Transform?</span>
            <h2 className="text-3xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight uppercase">
              Join our <span className="text-primary">Network.</span>
            </h2>
            <p className="text-neutral-400 text-xs md:text-sm font-normal max-w-lg mx-auto">
              Partner with Western Interio to plan and erect workspaces designed specifically for the future. Request custom consultations now.
            </p>
          </div>
          
          <button
            onClick={() => setIsQuoteOpen(true)}
            className="inline-flex items-center gap-6 px-10 py-4.5 bg-primary text-white font-bold rounded-lg hover:bg-white hover:text-black transition-all duration-500 shadow-xl shadow-primary/20 tracking-[0.2em] text-[10px] uppercase cursor-pointer active:scale-95 group"
          >
            Get a Consultation
            <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </section>
    </main>
  );
}
