"use client";

import React from "react";
import { useParams } from "next/navigation";
import productsData from "@/data/products.json";
import { ProductCard } from "@/components/ui/ProductCard";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { AppRoutes } from "@/constants/routes";
import { PageHeader } from "@/components/ui";

export default function BrandPage() {
  const params = useParams();
  const slug = params.slug as string;
  const brandName = slug.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");

  const filteredProducts = productsData.filter((p: any) => 
    p.brand?.toLowerCase() === brandName.toLowerCase() || 
    p.brand?.toLowerCase().replace(/ /g, "-") === slug.toLowerCase()
  );

  return (
    <main className="bg-white">
      {/* Brand Header */}
      <PageHeader
        bgImage="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2070&auto=format&fit=crop"
        badge={
          <div className="inline-flex items-center gap-3 px-5 py-1.5 bg-white/5 backdrop-blur-md border border-white/10 rounded-full animate-in fade-in slide-in-from-bottom-4 duration-700">
            <nav className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
              <Link href={AppRoutes.Public.Home} className="hover:text-primary transition-colors">Home</Link>
              <ChevronRight size={10} className="text-white/20" />
              <span className="text-white/40">Brands</span>
              <ChevronRight size={10} className="text-white/20" />
              <span className="text-white">{brandName}</span>
            </nav>
          </div>
        }
        titlePrefix={brandName}
        titleHighlight="Collection."
        subtitle={`Experience the finest collection of products from ${brandName}, curated specifically for your premium lifestyle needs.`}
      />

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-32">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-20 border-b border-neutral-100 pb-10">
          <p className="text-lg text-neutral-500 font-medium">
            Showing <span className="text-secondary font-bold">{filteredProducts.length}</span> signature products from {brandName}
          </p>
          <div className="flex items-center gap-6">
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-300">Sort Collection:</span>
             <select className="bg-neutral-50 border border-neutral-100 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] focus:outline-none cursor-pointer focus:border-primary/30 transition-all">
                <option>Newest Arrivals</option>
                <option>Price: Low to High</option>
             </select>
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {filteredProducts.map((product: any) => (
              <ProductCard 
                key={product.id} 
                id={product.id}
                name={product.name}
                category={product.category}
                image={product.images[0]}
                slug={product.slug}
                price={product.price}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 space-y-10">
            <div className="w-24 h-24 bg-neutral-50 rounded-[32px] flex items-center justify-center mx-auto text-neutral-200">
               <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m16 16-4-4-4 4"/><path d="M12 12V8"/></svg>
            </div>
            <div className="space-y-4">
              <h3 className="text-3xl font-bold text-secondary tracking-tight">No products found.</h3>
              <p className="text-gray-400 font-medium max-w-md mx-auto">We're currently updating this brand's collection. Check back soon for new arrivals.</p>
            </div>
            <Link href={AppRoutes.Public.Products} className="inline-flex items-center px-12 py-5 bg-secondary text-white font-bold uppercase tracking-[0.2em] text-[11px] rounded-xl hover:bg-primary transition-all duration-500 shadow-2xl shadow-secondary/10 active:scale-95">
              Browse All Categories
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
