"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import categoriesData from "@/data/categories.json";
import { ChevronRight, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui";
import { AppRoutes } from "@/constants/routes";

import productsData from "@/data/products.json";

export default function CategoriesPage() {
  const getProductCount = (categoryId: string) => {
    return productsData.filter(p => p.category === categoryId).length;
  };

  return (
    <main className="bg-white">
      {/* Hero Section - Cinematic */}
      <section className="relative pt-48 pb-32 flex items-center justify-center overflow-hidden bg-neutral-950">
        <Image 
          src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2070&auto=format&fit=crop"
          alt="Categories Hero"
          fill
          sizes="100vw"
          priority
          className="object-cover opacity-20 grayscale scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/80 via-neutral-950/40 to-neutral-950" />
        
        <div className="relative z-10 text-center space-y-6 max-w-4xl px-6">
          <div className="inline-flex items-center gap-3 px-5 py-1.5 bg-white/5 backdrop-blur-md border border-white/10 rounded-full animate-in fade-in slide-in-from-bottom-4 duration-700">
            <nav className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
              <Link href={AppRoutes.Public.Home} className="hover:text-primary transition-colors">Home</Link>
              <ChevronRight size={10} className="text-white/20" />
              <span className="text-white">All Categories</span>
            </nav>
          </div>
          <h1 className="text-3xl lg:text-5xl font-bold text-white leading-tight tracking-tight animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            Expert <br /><span className="text-primary">Collections.</span>
          </h1>
          <p className="text-base lg:text-lg text-gray-400 max-w-xl mx-auto leading-relaxed font-normal animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
            Discover a comprehensive range of premium building materials, luxury sanitaryware, and modern home improvement solutions across specialized categories.
          </p>
        </div>
      </section>

      {/* Grid - World Class Categories */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-32 lg:py-48">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 lg:gap-12">
          {categoriesData.map((cat, index) => (
            <Link 
              key={cat.id}
              href={`/products/${cat.slug}`}
              className="group relative h-[600px] rounded-[48px] overflow-hidden bg-neutral-100 flex flex-col justify-end p-12 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] transition-all duration-700 border border-neutral-100"
            >
              {/* Image Background */}
              <div className="absolute inset-0">
                <Image 
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              </div>

              {/* Content */}
              <div className="relative z-10 space-y-6 translate-y-6 group-hover:translate-y-0 transition-transform duration-700">
                <div className="flex items-center gap-4">
                  <span className="text-primary font-black text-sm tracking-tighter">0{index + 1}</span>
                  <div className="h-px w-10 bg-primary/40 group-hover:w-16 transition-all duration-700" />
                </div>
                <div className="space-y-4">
                  <h2 className="text-4xl font-bold text-white tracking-tight leading-none">{cat.name}</h2>
                  <p className="text-white/50 text-lg font-medium line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
                <div className="pt-6 flex items-center gap-4 text-white text-[10px] font-black uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-all duration-700">
                  Explore Collection
                  <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center -rotate-45 group-hover:rotate-0 transition-transform duration-700 shadow-xl shadow-primary/20">
                    <ArrowRight size={18} />
                  </div>
                </div>
              </div>
              
              {/* Badge */}
              <div className="absolute top-10 right-10">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 text-white text-[9px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full">
                  {getProductCount(cat.id)} Designs
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Trust Section - High Impact Banner */}
      <section className="bg-neutral-950 py-32 lg:py-48 text-white relative overflow-hidden">
        <div className="absolute inset-0 z-0">
           <Image 
             src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2070&auto=format&fit=crop"
             alt="CTA Background"
             fill
             className="object-cover opacity-10 grayscale"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-neutral-950" />
        </div>

        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-20">
          <div className="max-w-2xl space-y-6 text-center lg:text-left">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Next Project</span>
            <h3 className="text-3xl lg:text-5xl font-bold leading-tight tracking-tight">Need a <br /> <span className="text-primary">Custom Quote?</span></h3>
            <p className="text-gray-400 text-base font-normal leading-relaxed">Our experts are here to help you select the best materials for your specific architectural needs. Let's build something extraordinary together.</p>
          </div>
          <div className="flex flex-wrap justify-center lg:justify-end gap-6">
            <Link href={AppRoutes.Public.Contact} className="bg-primary hover:bg-white hover:text-black px-12 py-6 rounded-2xl text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-500 shadow-2xl shadow-primary/20 active:scale-95 group flex items-center gap-3">
              Contact Expert
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href={AppRoutes.Public.Gallery} className="bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 px-12 py-6 rounded-2xl text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-500 active:scale-95">
              View Showcase
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
