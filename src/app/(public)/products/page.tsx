"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Search, 
  Grid, 
  List,
  ArrowUpRight,
  ArrowRight
} from "lucide-react";

import { cn } from "@/lib/utils";
import QuoteModal from "@/components/common/QuoteModal";
import CtaSection from "@/components/sections/home/CtaSection";
import categoriesData from "@/data/categories.json";
import productsData from "@/data/products.json";
import siteContent from "@/data/site-content.json";
import { PageHeader } from "@/components/ui";

export default function ProductsPage() {
  const [isQuoteOpen, setIsQuoteOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [viewType, setViewType] = React.useState<"grid" | "list">("grid");

  const { productsPage } = siteContent;
  const { hero, filterBar, noResults, cta } = productsPage;

  const filteredCategories = categoriesData.filter(cat => 
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getProductCount = (categoryId: string) => {
    return productsData.filter(p => p.category === categoryId).length;
  };

  return (
    <main className="bg-white">
      {/* Hero Section */}
      <PageHeader
        bgImage="https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2070&auto=format&fit=crop"
        badgeText={hero.badge}
        titlePrefix="Our"
        titleHighlight="Collections."
        subtitle={hero.subtitle}
      />

      {/* Product Categories Grid - World Class Showcase */}
      <section className="py-12 lg:py-16 relative bg-white overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 space-y-12">
          
          {/* Filter Bar - Modern & Minimal */}
          <div className="flex flex-col lg:flex-row justify-between items-center gap-10 pb-8 border-b border-neutral-100">
            <div className="flex items-center gap-12 w-full lg:w-auto justify-between lg:justify-start">
               <div className="space-y-2">
                  <h2 className="text-3xl font-bold text-secondary tracking-tight">{filterBar.title}</h2>
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">{filterBar.subtitle}</p>
               </div>
                <div className="flex gap-3 bg-neutral-50 p-1.5 rounded-2xl border border-neutral-100">
                   <button 
                     onClick={() => setViewType("grid")}
                     className={cn(
                       "p-3 rounded-xl transition-all duration-500 cursor-pointer active:scale-90",
                       viewType === "grid" ? "bg-white text-primary shadow-xl shadow-neutral-200" : "text-neutral-400 hover:text-secondary"
                     )}
                   >
                     <Grid size={18} />
                   </button>
                   <button 
                     onClick={() => setViewType("list")}
                     className={cn(
                       "p-3 rounded-xl transition-all duration-500 cursor-pointer active:scale-90",
                       viewType === "list" ? "bg-white text-primary shadow-xl shadow-neutral-200" : "text-neutral-400 hover:text-secondary"
                     )}
                   >
                     <List size={18} />
                   </button>
                </div>
            </div>

            <div className="flex items-center gap-4 w-full lg:w-auto">
               <div className="relative flex-1 lg:w-[400px] group">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-primary transition-colors" size={18} />
                  <input 
                    type="text" 
                    placeholder={filterBar.searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-100 py-5 pl-14 pr-8 rounded-2xl focus:outline-none focus:border-primary/30 focus:bg-white text-sm font-bold transition-all placeholder:text-neutral-300 shadow-sm"
                  />
               </div>
            </div>
          </div>

          {filteredCategories.length > 0 ? (
            <div className={cn(
              "transition-all duration-700",
              viewType === "grid" 
                ? "grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-10" 
                : "flex flex-col gap-6"
            )}>
              {filteredCategories.map((cat) => {
                const count = getProductCount(cat.id);
                if (viewType === "grid") {
                  return (
                    <Link 
                      key={cat.id} 
                      href={`/products/${cat.slug}`} 
                      className="group relative block aspect-[4/5] overflow-hidden bg-neutral-900 rounded-xl shadow-[0_12px_30px_-10px_rgba(0,0,0,0.04)] hover:shadow-[0_30px_60px_-15px_rgba(237,28,39,0.12)] transition-all duration-[800ms] ease-out border border-neutral-100 hover:-translate-y-2"
                    >
                      {/* Dynamic Product Count Glassmorphic Badge */}
                      <div className="absolute top-6 left-6 z-10">
                        <span className="px-3 py-1.5 bg-neutral-900/60 backdrop-blur-md text-[9px] font-black tracking-[0.2em] text-white rounded-lg border border-white/10 uppercase shadow-sm">
                          {count} {count === 1 ? "Model" : "Models"}
                        </span>
                      </div>

                      <Image 
                        src={cat.image}
                        alt={cat.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition-transform duration-[1.8s] cubic-bezier(0.16, 1, 0.3, 1) group-hover:scale-105 opacity-80 group-hover:opacity-90"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent opacity-70 group-hover:opacity-85 transition-opacity duration-700" />
                      
                      {/* Luxury Glassmorphic Slide-up bottom strip */}
                      <div className="absolute inset-x-5 bottom-5 p-6 bg-neutral-950/50 backdrop-blur-md rounded-xl border border-white/10 shadow-lg space-y-2 translate-y-3 group-hover:translate-y-0 transition-all duration-[600ms] cubic-bezier(0.16, 1, 0.3, 1)">
                        <h3 className="text-lg md:text-xl font-bold text-white leading-tight tracking-tight uppercase">
                          {cat.name}
                        </h3>
                        <p className="text-[10px] text-neutral-300 font-medium line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 leading-normal">
                          {cat.description}
                        </p>
                        <div className="pt-2 flex items-center gap-2 text-primary text-[8px] font-black tracking-[0.25em] uppercase">
                          Explore Collection <ArrowUpRight size={12} className="text-primary animate-pulse" />
                        </div>
                      </div>
                    </Link>
                  );
                } else {
                  return (
                    <Link 
                      key={cat.id} 
                      href={`/products/${cat.slug}`} 
                      className="group flex flex-col md:flex-row items-center gap-8 p-6 bg-white border border-neutral-100 rounded-2xl hover:border-primary/20 hover:bg-neutral-50/[0.2] hover:shadow-[0_20px_50px_-12px_rgba(237,28,39,0.04)] hover:-translate-y-0.5 transition-all duration-500 ease-out relative overflow-hidden"
                    >
                      {/* Left accent bar on hover */}
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-center" />

                      {/* Image container */}
                      <div className="relative w-full md:w-56 h-36 shrink-0 overflow-hidden rounded-xl border border-neutral-100 bg-neutral-50 shadow-sm">
                        <Image 
                          src={cat.image}
                          alt={cat.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 224px"
                          className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-neutral-950/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </div>

                      {/* Content block */}
                      <div className="flex-1 space-y-3.5 text-center md:text-left py-2">
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                          <h3 className="text-xl md:text-2xl font-bold text-secondary group-hover:text-primary transition-colors duration-500 tracking-tight uppercase leading-tight">
                            {cat.name}
                          </h3>
                          <span className="px-3 py-1 bg-primary/10 text-primary text-[9px] font-black tracking-[0.15em] rounded-lg uppercase transition-all duration-500 group-hover:bg-primary group-hover:text-white">
                            {count} {count === 1 ? "Model" : "Models"}
                          </span>
                        </div>
                        <p className="text-neutral-400 text-sm font-medium leading-relaxed max-w-3xl group-hover:text-neutral-500 transition-colors duration-500">
                          {cat.description}
                        </p>
                      </div>

                      {/* Right button - playful rotating arrow */}
                      <div className="w-14 h-14 bg-neutral-50 rounded-2xl flex items-center justify-center text-neutral-400 border border-neutral-100 group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all duration-500 shadow-sm group-hover:rotate-45 active:scale-95 cursor-pointer shrink-0">
                        <ArrowRight size={20} className="-rotate-45 group-hover:rotate-0 transition-transform duration-500" />
                      </div>
                    </Link>
                  );
                }
              })}
            </div>
          ) : (
            <div className="text-center space-y-10">
              <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center mx-auto text-neutral-300">
                <Search size={40} />
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl font-bold text-secondary tracking-tight">{noResults.title}</h3>
                <p className="text-gray-400 font-medium">Try adjusting your keywords to find what you&apos;re looking for.</p>
              </div>
              <button 
                onClick={() => setSearchQuery("")}
                className="px-10 py-4 bg-secondary text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-primary transition-all duration-500 shadow-2xl shadow-secondary/10 hover:shadow-primary/30 active:scale-95"
              >
                {noResults.clearButton}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* High-Impact CTA Banner */}
      <CtaSection onOpenQuote={() => setIsQuoteOpen(true)} />
      <QuoteModal isOpen={isQuoteOpen} onClose={() => setIsQuoteOpen(false)} />
    </main>
  );
}
