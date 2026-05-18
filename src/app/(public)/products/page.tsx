"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Search, 
  Filter, 
  ChevronRight, 
  Grid, 
  List,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Package,
  ArrowRight
} from "lucide-react";

import { cn } from "@/lib/utils";
import QuoteModal from "@/components/common/QuoteModal";
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
      <section className="py-32 lg:py-48 relative bg-white overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 space-y-24">
          
          {/* Filter Bar - Modern & Minimal */}
          <div className="flex flex-col lg:flex-row justify-between items-center gap-10 pb-12 border-b border-neutral-100">
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
                ? "grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 lg:gap-12" 
                : "flex flex-col gap-8"
            )}>
              {filteredCategories.map((cat) => {
                if (viewType === "grid") {
                  return (
                    <Link 
                      key={cat.id} 
                      href={`/products/${cat.slug}`} 
                      className="group relative overflow-hidden bg-neutral-50 rounded-[48px] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.03)] hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] transition-all duration-700 border border-neutral-100"
                    >
                      <div className="aspect-[4/5] relative overflow-hidden">
                        <Image 
                          src={cat.image}
                          alt={cat.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-cover transition-transform duration-[1.5s] group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent opacity-60 group-hover:opacity-85 transition-opacity duration-700" />
                        
                        <div className="absolute inset-0 p-10 flex flex-col justify-end">
                          <div className="space-y-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                            <h3 className="text-3xl font-bold text-white leading-none tracking-tight">
                              {cat.name}
                            </h3>
                            <div className="pt-2 flex items-center gap-3 text-white text-[10px] font-black tracking-[0.2em] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                              View Category <ArrowUpRight size={16} className="text-primary" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                } else {
                  return (
                    <Link 
                      key={cat.id} 
                      href={`/products/${cat.slug}`} 
                      className="group flex flex-col md:flex-row items-center gap-10 p-8 bg-white border border-neutral-100 rounded-[40px] hover:border-primary/20 hover:shadow-2xl transition-all duration-700"
                    >
                      <div className="relative w-full md:w-64 h-48 shrink-0 overflow-hidden rounded-[32px] shadow-lg">
                        <Image 
                          src={cat.image}
                          alt={cat.name}
                          fill
                          className="object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                      </div>
                      <div className="flex-1 space-y-4 text-center md:text-left">
                        <h3 className="text-3xl font-bold text-secondary tracking-tight">
                          {cat.name}
                        </h3>
                        <p className="text-gray-500 text-lg font-medium leading-relaxed max-w-3xl">
                          {cat.description}
                        </p>
                      </div>
                      <div className="w-16 h-16 bg-neutral-50 rounded-2xl flex items-center justify-center text-secondary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm group-hover:-translate-x-2">
                        <ArrowRight size={24} />
                      </div>
                    </Link>
                  );
                }
              })}
            </div>
          ) : (
            <div className="text-center py-32 space-y-10">
              <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center mx-auto text-neutral-300">
                <Search size={40} />
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl font-bold text-secondary tracking-tight">{noResults.title}</h3>
                <p className="text-gray-400 font-medium">Try adjusting your keywords to find what you're looking for.</p>
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

      {/* Final Call to Action - High Impact Banner */}
      <section className="py-32 lg:py-48 bg-neutral-950 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 z-0">
           <Image 
             src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2070&auto=format&fit=crop"
             alt="CTA Background"
             fill
             className="object-cover opacity-10 grayscale"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-neutral-950" />
        </div>
        
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10 space-y-10">
          <div className="space-y-6">
             <span className="text-[10px] font-black tracking-[0.5em] text-primary uppercase">{cta.badge}</span>
             <h2 className="text-3xl lg:text-5xl font-bold text-white leading-tight tracking-tight">{cta.title}</h2>
             <p className="text-gray-400 text-base font-normal tracking-wide max-w-xl mx-auto">{cta.supportText}</p>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 pt-10">
             <button 
               onClick={() => setIsQuoteOpen(true)}
               className="w-full sm:w-auto px-12 py-5 bg-primary text-white font-bold rounded-xl hover:bg-white hover:text-black transition-all duration-500 shadow-[0_20px_40px_-10px_rgba(var(--primary-rgb),0.3)] tracking-[0.2em] text-[11px] uppercase flex items-center justify-center gap-4 cursor-pointer active:scale-95 group"
             >
                {cta.buttons.quote}
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
             </button>
          </div>
        </div>
      </section>
      <QuoteModal isOpen={isQuoteOpen} onClose={() => setIsQuoteOpen(false)} />
    </main>
  );
}
