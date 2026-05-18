"use client";

import React from "react";
import Image from "next/image";
import { Quote, Star, Zap, MessageSquare } from "lucide-react";
import siteContent from "@/data/site-content.json";

export default function TestimonialsPage() {
  const { testimonialsPage } = siteContent;

  return (
    <main className="bg-white">
      {/* Hero Section - Cinematic */}
      <section className="relative pt-48 pb-32 flex items-center justify-center overflow-hidden bg-neutral-950">
        <Image 
          src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2070&auto=format&fit=crop"
          alt="Testimonials"
          fill
          sizes="100vw"
          priority
          className="object-cover opacity-20 grayscale scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/80 via-neutral-950/40 to-neutral-950" />
        
        <div className="relative z-10 text-center space-y-6 max-w-4xl px-6">
          <div className="inline-flex items-center gap-3 px-5 py-1.5 bg-white/5 backdrop-blur-md border border-white/10 rounded-full animate-in fade-in slide-in-from-bottom-4 duration-700">
            <MessageSquare size={14} className="text-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">{testimonialsPage.hero.badge}</span>
          </div>
          <h1 
            className="text-3xl lg:text-5xl font-bold text-white leading-tight tracking-tight animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200"
            dangerouslySetInnerHTML={{ __html: testimonialsPage.hero.title }}
          />
          <p className="text-base lg:text-lg text-gray-400 max-w-xl mx-auto leading-relaxed font-normal animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
            {testimonialsPage.hero.subtitle}
          </p>
        </div>
      </section>

      {/* Testimonials Grid - World Class Showcase */}
      <section className="py-32 lg:py-48 bg-neutral-50 relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
            {testimonialsPage.items.map((t: any, i: number) => (
              <div 
                key={i} 
                className="bg-white p-12 lg:p-16 rounded-[48px] border border-neutral-100 flex flex-col space-y-12 relative group hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] hover:-translate-y-2 transition-all duration-700"
              >
                {/* Quote Icon Background */}
                <div className="absolute top-12 right-12 text-primary/5 group-hover:text-primary/10 transition-colors duration-700">
                   <Quote size={120} strokeWidth={0.5} />
                </div>
                
                {/* Rating Stars */}
                <div className="flex gap-2 text-primary relative z-10">
                  {[...Array(t.rating)].map((_, idx) => (
                    <Star key={idx} size={18} fill="currentColor" strokeWidth={0} />
                  ))}
                </div>

                {/* Quote Text */}
                <p className="text-2xl text-secondary/90 font-medium leading-relaxed relative z-10 tracking-tight">
                  "{t.quote}"
                </p>

                {/* Author Info */}
                <div className="pt-12 border-t border-neutral-100 flex items-center gap-6 relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-secondary text-white flex items-center justify-center font-black shrink-0 group-hover:bg-primary transition-all duration-500 shadow-xl shadow-secondary/10 group-hover:shadow-primary/20">
                    {t.author.charAt(0)}
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-secondary uppercase tracking-tight text-xl leading-none">{t.author}</h4>
                    <p className="text-[11px] font-black text-primary uppercase tracking-[0.2em]">{t.designation}</p>
                    <p className="text-[10px] font-bold text-neutral-300 uppercase tracking-widest">{t.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Corporate Trust Section - Cinematic Banner */}
      <section className="py-32 lg:py-48 bg-white">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
           <div className="bg-neutral-950 p-16 lg:p-32 rounded-[64px] relative overflow-hidden shadow-2xl shadow-neutral-200">
              <div className="absolute top-0 right-0 w-2/3 h-full bg-primary/5 -skew-x-12 translate-x-1/4 pointer-events-none" />
              <div className="relative z-10 grid lg:grid-cols-2 gap-24 items-center">
                 <div className="space-y-6 text-center lg:text-left">
                    <div className="space-y-4">
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Global Trust</span>
                      <h2 className="text-3xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
                         Join <span className="text-primary">1000+</span> <br /> Satisfied Clients.
                      </h2>
                    </div>
                    <p className="text-gray-400 text-base font-normal leading-relaxed max-w-md">
                       From small startups to multinational corporations, we've helped businesses of all sizes create efficient and beautiful work environments.
                    </p>
                    <button className="w-full sm:w-auto px-12 py-5 bg-primary text-white font-bold uppercase tracking-[0.2em] text-[11px] rounded-xl hover:bg-white hover:text-black transition-all duration-500 shadow-2xl shadow-primary/20 active:scale-95 group flex items-center justify-center gap-4">
                       Work With Us
                       <Zap size={16} className="group-hover:fill-current transition-all" />
                    </button>
                 </div>
                 <div className="grid grid-cols-2 gap-8 lg:gap-12">
                    {[
                       { label: "Completion Rate", value: "99.9%" },
                       { label: "Repeat Clients", value: "85%" },
                       { label: "Corporate Projects", value: "500+" },
                       { label: "PAN India Delivery", value: "30+ Cities" }
                    ].map((stat, i) => (
                       <div key={i} className="p-10 bg-white/5 rounded-[32px] border border-white/10 backdrop-blur-md group hover:border-primary/30 transition-all duration-500">
                          <h4 className="text-4xl font-bold text-primary mb-2 tracking-tighter">{stat.value}</h4>
                          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-tight">{stat.label}</p>
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </section>
    </main>
  );
}
