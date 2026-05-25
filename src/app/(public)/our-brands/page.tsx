"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Wrench,
  Palette,
  Lightbulb,
  CheckCircle2,
  Loader2
} from "lucide-react";
import { QuoteModal } from "@/components/common";
import { useGetBrandsQuery } from "@/redux/api/brandsApi";
import { useState } from "react";
// remove static import
import siteContent from "@/data/site-content.json";
import { PageHeader } from "@/components/ui";

export default function OurBrandsPage() {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const { data: brandsResult, isLoading } = useGetBrandsQuery({ limit: 100 });
  const { ourBrandsPage } = siteContent;

  const brandsList = React.useMemo(() => {
    return brandsResult?.data || [];
  }, [brandsResult]);

  if (isLoading) {
    return (
      <main className="bg-white flex items-center justify-center min-h-[600px]">
        <Loader2 className="animate-spin text-primary" size={32} />
      </main>
    );
  }

  return (
    <main className="bg-white">
      <QuoteModal isOpen={isQuoteOpen} onClose={() => setIsQuoteOpen(false)} />
      
      {/* Hero Section */}
      <PageHeader
        bgImage="/hero-bg.png"
        badgeText={ourBrandsPage.hero.badge}
        titlePrefix="Elite"
        titleHighlight="Partnerships."
        subtitle={ourBrandsPage.hero.subtitle}
      />

      {/* Expertise Details - SaaS Layout */}
      <section className="py-32 lg:py-48 bg-white relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-24 lg:gap-32 items-center">
            <div className="space-y-16">
              <div className="space-y-6">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">{ourBrandsPage.expertise.badge}</span>
                <h2 className="text-3xl lg:text-5xl font-bold text-secondary leading-tight tracking-tight">
                  {ourBrandsPage.expertise.title.split(' ')[0]} <br /> <span className="text-primary mt-4 block">{ourBrandsPage.expertise.title.split(' ')[1]}</span>
                </h2>
                <p className="text-base text-gray-500 leading-relaxed font-normal max-w-xl">
                  {ourBrandsPage.expertise.desc}
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-10">
                {ourBrandsPage.expertise.list.map((item, i) => (
                  <div key={i} className="space-y-5 p-8 rounded-[32px] bg-neutral-50 border border-neutral-100 group hover:border-primary/20 transition-all duration-300">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                       <CheckCircle2 className="text-primary" size={18} />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-lg font-bold text-secondary tracking-tight">{item.title}</h4>
                      <p className="text-sm text-gray-400 font-medium leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-6 bg-primary/5 rounded-[60px] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <div className="aspect-square relative rounded-[48px] overflow-hidden shadow-2xl shadow-neutral-200 ring-1 ring-neutral-100 group-hover:shadow-[0_60px_120px_-20px_rgba(0,0,0,0.1)] transition-all duration-700">
                <Image
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80"
                  alt="Technical Expertise"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-1000"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specialty Pillars - Modern Card Grid */}
      <section className="py-32 lg:py-48 bg-neutral-50 overflow-hidden relative">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
            {ourBrandsPage.pillars.map((item, i) => {
              const icons = [Building2, Palette, Wrench, Lightbulb];
              const Icon = icons[i % icons.length];
              return (
                <div key={i} className="bg-white p-12 rounded-[40px] border border-neutral-100 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.02)] hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] hover:border-primary/20 transition-all duration-700 group">
                  <div className="w-16 h-16 bg-neutral-50 text-secondary group-hover:bg-primary group-hover:text-white flex items-center justify-center rounded-2xl transition-all duration-500 mb-10 group-hover:-translate-y-2 shadow-lg shadow-neutral-100 group-hover:shadow-primary/20">
                    <Icon size={28} />
                  </div>
                  <h3 className="text-2xl font-bold text-secondary tracking-tight mb-5">{item.title}</h3>
                  <p className="text-gray-500 leading-relaxed font-medium">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Brand Grid Section - World Class Display */}
      <section className="py-32 lg:py-48 bg-white">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 space-y-24">
          <div className="text-center space-y-6">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">{ourBrandsPage.grid.badge}</span>
            <h2 className="text-3xl lg:text-5xl font-bold text-secondary tracking-tight">
              {ourBrandsPage.grid.title.split(' ')[0]} <span className="text-primary">{ourBrandsPage.grid.title.split(' ')[1]}</span>
            </h2>
            <p className="text-gray-500 text-base font-normal max-w-xl mx-auto leading-relaxed">
              {ourBrandsPage.grid.desc}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {brandsList.map((brand, i) => (
              <Link
                key={i}
                href={`/products?brand=${brand.name.toLowerCase().replace(/ /g, "-")}`}
                className="group relative aspect-[4/3] bg-neutral-50 rounded-[32px] border border-neutral-100 flex items-center justify-center p-10 hover:bg-white hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)] hover:border-primary/20 transition-all duration-500 cursor-pointer"
              >
                <Image
                  src={brand.url}
                  alt={brand.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                  className="object-contain p-8 grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                />
                <div className="absolute inset-x-0 -bottom-8 text-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                  <p className="text-[10px] font-black tracking-[0.3em] text-primary uppercase">{brand.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA - High Impact Banner */}
      <section className="py-32 lg:py-48 bg-neutral-950 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 z-0">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(var(--primary-rgb),0.15),transparent_70%)]" />
        </div>
        
        <div className="max-w-4xl mx-auto px-6 relative z-10 space-y-10">
          <div className="space-y-6">
            <span className="text-[10px] font-black tracking-[0.5em] text-primary uppercase">{ourBrandsPage.cta.badge}</span>
            <h2 className="text-3xl lg:text-5xl font-bold text-white leading-tight tracking-tight">
              {ourBrandsPage.cta.title.split(' a ')[0]} <br /> {ourBrandsPage.cta.title.split(' a ')[1]}
            </h2>
          </div>
          <button
            onClick={() => setIsQuoteOpen(true)}
            className="inline-flex items-center gap-6 px-12 py-5 bg-primary text-white font-bold rounded-xl hover:bg-white hover:text-black transition-all duration-500 shadow-[0_20px_40px_-10px_rgba(var(--primary-rgb),0.3)] tracking-[0.2em] text-[11px] uppercase cursor-pointer active:scale-95 group"
          >
            {ourBrandsPage.cta.button}
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>
    </main>
  );
}
