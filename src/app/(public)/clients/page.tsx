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
import siteContent from "@/data/site-content.json";

export default function ClientsPage() {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const { common } = siteContent;

  return (
    <main className="bg-white">
      <QuoteModal isOpen={isQuoteOpen} onClose={() => setIsQuoteOpen(false)} />
      
      {/* Hero Section - Elite Corporate Aesthetic */}
      <section className="relative pt-48 pb-32 flex items-center justify-center overflow-hidden bg-neutral-950">
        <Image
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2070&auto=format&fit=crop"
          alt="Corporate Clients Background"
          fill
          sizes="100vw"
          priority
          className="object-cover opacity-20 grayscale scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/80 via-neutral-950/40 to-neutral-950" />

        <div className="relative z-10 text-center space-y-6 max-w-4xl px-6">
          <div className="inline-flex items-center gap-3 px-5 py-1.5 bg-white/5 backdrop-blur-md border border-white/10 rounded-full animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Briefcase size={14} className="text-primary" />
            <span className="text-[10px] font-black tracking-[0.4em] text-white uppercase">Client Portfolio</span>
          </div>
          <h1 className="text-3xl lg:text-5xl font-bold text-white leading-tight tracking-tight animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            Trusted by <span className="text-primary">Industry Leaders.</span>
          </h1>
          <p className="text-base lg:text-lg text-gray-400 max-w-xl mx-auto leading-relaxed font-normal animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
            We take pride in partnering with some of the world's most prestigious organizations to deliver high-performance workspace solutions.
          </p>
        </div>
      </section>

      {/* Trust Indicators Section */}
      <section className="py-12 lg:py-16 bg-white border-b border-neutral-100">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {[
              { icon: Users, label: "Happy Clients", value: "1000+" },
              { icon: Globe2, label: "Pan-India Presence", value: "32+ Cities" },
              { icon: ShieldCheck, label: "Quality Assurance", value: "100% Certified" },
              { icon: Trophy, label: "Years Experience", value: "20+ Years" }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center text-center space-y-4 group">
                <div className="w-16 h-16 rounded-2xl bg-neutral-50 flex items-center justify-center text-secondary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm">
                  <stat.icon size={28} />
                </div>
                <div>
                  <p className="text-3xl font-bold text-secondary tracking-tight">{stat.value}</p>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Clients Grid Section - Premium Logo Showcase */}
      <section className="pt-16 pb-16 lg:pt-20 lg:pb-24 bg-neutral-50/50">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 space-y-24">
          <div className="text-center space-y-6">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Global Network</span>
            <h2 className="text-3xl lg:text-5xl font-bold text-secondary tracking-tight">
              Our <span className="text-primary">Esteemed Clients.</span>
            </h2>
            <p className="text-gray-500 text-base font-normal max-w-xl mx-auto leading-relaxed">
              Serving a diverse range of industries, from technology and pharmaceuticals to aviation and automotive.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-10">
            {clients.map((client, i) => (
              <div
                key={i}
                className="group relative aspect-square bg-white rounded-[32px] border border-neutral-200/50 flex flex-col items-center justify-center p-8 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] hover:border-primary/20 transition-all duration-500 group overflow-hidden"
              >
                <div className="relative w-full h-full flex items-center justify-center mb-4">
                  <Image
                    src={`https://placehold.co/200x200/f5f5f5/d0021b.png?text=${encodeURIComponent(client.name.split(' ').slice(0, 2).join(' '))}`}
                    alt={client.name}
                    width={120}
                    height={120}
                    className="object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                  />
                </div>
                <div className="w-full text-center">
                  <p className="text-sm font-bold tracking-tight text-secondary leading-tight line-clamp-2 px-2">
                    {client.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Excellence Pillars */}
      <section className="pt-16 pb-32 lg:pt-24 lg:pb-48 bg-white overflow-hidden relative">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-24 lg:gap-32 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="aspect-[4/3] relative rounded-[48px] overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop"
                  alt="Corporate Office Interiors"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            
            <div className="space-y-12 order-1 lg:order-2">
              <div className="space-y-4">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Why Leaders Choose Us</span>
                <h2 className="text-3xl lg:text-5xl font-bold text-secondary leading-tight tracking-tight">
                  Beyond <span className="text-primary">Furniture.</span>
                </h2>
                <p className="text-base text-gray-500 leading-relaxed font-normal">
                  We don't just supply products; we engineer environments that foster collaboration, efficiency, and well-being.
                </p>
              </div>

              <div className="space-y-6">
                {[
                  "Tailored modular solutions for every industry",
                  "Turnkey project management from design to delivery",
                  "High-performance ergonomic standards",
                  "Unmatched after-sales support and maintenance"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-5 group">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
                      <CheckCircle2 size={12} className="text-primary group-hover:text-white" />
                    </div>
                    <span className="font-bold text-secondary tracking-tight">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-32 lg:py-48 bg-neutral-950 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 z-0">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(var(--primary-rgb),0.15),transparent_70%)]" />
        </div>
        
        <div className="max-w-4xl mx-auto px-6 relative z-10 space-y-10">
          <div className="space-y-6">
            <span className="text-[10px] font-black tracking-[0.5em] text-primary uppercase">Ready to Transform?</span>
            <h2 className="text-3xl lg:text-5xl font-bold text-white leading-tight tracking-tight">
              Join our <span className="text-primary">Network.</span>
            </h2>
          </div>
          <button
            onClick={() => setIsQuoteOpen(true)}
            className="inline-flex items-center gap-6 px-12 py-5 bg-primary text-white font-bold rounded-xl hover:bg-white hover:text-black transition-all duration-500 shadow-[0_20px_40px_-10px_rgba(var(--primary-rgb),0.3)] tracking-[0.2em] text-[11px] uppercase cursor-pointer active:scale-95 group"
          >
            Get a Consultation
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>
    </main>
  );
}
