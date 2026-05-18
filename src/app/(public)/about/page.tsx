"use client";

import Image from "next/image";
import Link from "next/link";
import { 
  Building2, 
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Palette,
  Layout,
  Layers,
  Settings,
  ShieldCheck
} from "lucide-react";
import QuoteModal from "@/components/common/QuoteModal";
import siteContent from "@/data/site-content.json";
import { AppRoutes } from "@/constants/routes";
import React, { useState } from "react";

export default function AboutPage() {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const { aboutPage } = siteContent;

  return (
    <main className="bg-white">
      {/* Hero Section - Cinematic */}
      <section className="relative pt-48 pb-32 flex items-center justify-center overflow-hidden bg-neutral-950">
        <Image 
          src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2070&auto=format&fit=crop"
          alt="Western Interio"
          fill
          sizes="100vw"
          priority
          className="object-cover opacity-20 grayscale scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/80 via-neutral-950/40 to-neutral-950" />
        
        <div className="relative z-10 text-center space-y-6 max-w-4xl px-6">
          <div className="inline-flex items-center gap-3 px-5 py-1.5 bg-white/5 backdrop-blur-md border border-white/10 rounded-full animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Sparkles size={14} className="text-primary" />
            <span className="text-[10px] font-black tracking-[0.4em] text-white uppercase">{aboutPage.hero.badge}</span>
          </div>
          <h1 className="text-3xl lg:text-5xl font-bold text-white leading-tight tracking-tight animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            Design for <br /><span className="text-primary">Better Life.</span>
          </h1>
          <p className="text-base lg:text-lg text-gray-400 max-w-xl mx-auto leading-relaxed font-normal animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
            {aboutPage.hero.subtitle}
          </p>
        </div>
      </section>

      {/* Intro Section - Our Legacy */}
      <section className="py-32 lg:py-48 bg-white relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-24 lg:gap-32 items-start">
            <div className="space-y-16">
              <div className="space-y-6">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Established Excellence</span>
                <h2 className="text-3xl lg:text-5xl font-bold text-secondary leading-tight tracking-tight">
                  {aboutPage.legacy.title.split('. ')[0]}. <br /> <span className="text-primary mt-4 block"> {aboutPage.legacy.title.split('. ')[1]}</span>
                </h2>
                <div className="space-y-6 text-base text-gray-500 leading-relaxed font-normal">
                   {aboutPage.legacy.content.map((p, i) => (
                     <p key={i}>{p}</p>
                   ))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-12 pt-16 border-t border-neutral-100">
                 {aboutPage.legacy.stats.map((stat, i) => (
                   <div key={i} className="space-y-4">
                      <p className="text-6xl font-bold text-secondary tracking-tighter leading-none">{stat.value}</p>
                      <p className="text-[10px] font-black tracking-[0.3em] text-primary uppercase">{stat.label}</p>
                   </div>
                 ))}
              </div>
            </div>

            <div className="relative group">
               <div className="absolute -inset-6 bg-primary/5 rounded-[60px] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
               <div className="aspect-[4/5] relative rounded-[48px] overflow-hidden shadow-2xl shadow-neutral-200 ring-1 ring-neutral-100 group-hover:shadow-[0_60px_120px_-20px_rgba(0,0,0,0.1)] transition-all duration-700">
                <Image 
                  src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop"
                  alt="Western Office Legacy"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars Section - Modern Grid */}
      <section className="py-32 lg:py-48 bg-neutral-50 overflow-hidden relative">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10">
          <div className="flex flex-col items-center text-center space-y-6 mb-24">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">{aboutPage.services.badge}</span>
            <h2 className="text-4xl lg:text-6xl font-bold tracking-tight text-secondary">
              {aboutPage.services.title}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
            {aboutPage.services.list.map((item, i) => {
              const icons = [Layout, Settings, Layers, ShieldCheck];
              const Icon = icons[i % icons.length];
              return (
                <div key={i} className="bg-white p-12 rounded-[40px] border border-neutral-100 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.02)] hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] hover:border-primary/20 transition-all duration-700 group">
                  <div className="w-16 h-16 bg-neutral-50 text-secondary group-hover:bg-primary group-hover:text-white flex items-center justify-center rounded-2xl transition-all duration-500 mb-10 group-hover:-translate-y-2 shadow-lg shadow-neutral-100 group-hover:shadow-primary/20">
                    <Icon size={28} />
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight mb-5 group-hover:text-primary transition-colors">{item.title}</h3>
                  <p className="text-gray-500 font-medium leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final Call to Action - High Impact Banner */}
      <section className="py-32 lg:py-48 bg-neutral-950 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 z-0">
           <Image 
             src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop"
             alt="CTA Background"
             fill
             className="object-cover opacity-10 grayscale"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-neutral-950" />
        </div>
        
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10 space-y-10">
          <div className="space-y-6">
             <span className="text-[10px] font-black tracking-[0.5em] text-primary uppercase">{aboutPage.cta.badge}</span>
             <h2 className="text-3xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
               {aboutPage.cta.title}
             </h2>
             <p className="text-gray-400 text-base font-normal tracking-wide max-w-xl mx-auto">{siteContent.common.contact.address}</p>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 pt-10">
             <button 
               onClick={() => setIsQuoteOpen(true)}
               className="w-full sm:w-auto px-12 py-5 bg-primary text-white font-bold rounded-xl hover:bg-white hover:text-black transition-all duration-500 shadow-[0_20px_40px_-10px_rgba(var(--primary-rgb),0.3)] tracking-[0.2em] text-[11px] uppercase flex items-center justify-center gap-4 cursor-pointer active:scale-95 group"
             >
                {aboutPage.cta.visitButton}
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
             </button>
             <Link 
               href={AppRoutes.Public.Products} 
               className="w-full sm:w-auto px-12 py-5 bg-white/5 backdrop-blur-xl border border-white/20 text-white font-bold rounded-xl hover:bg-white/20 transition-all duration-500 tracking-[0.2em] text-[11px] uppercase"
             >
                {aboutPage.cta.exploreButton}
             </Link>
          </div>
        </div>
      </section>
      <QuoteModal isOpen={isQuoteOpen} onClose={() => setIsQuoteOpen(false)} />
    </main>
  );
}
