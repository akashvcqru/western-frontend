"use client";

import React from "react";

import Image from "next/image";
import { FilterSidebar } from "@/components/sections/FilterSidebar";
import { ProductCard } from "@/components/ui/ProductCard";
import { ChevronRight, ArrowRight } from "lucide-react";
import Link from "next/link";

import productsData from "@/data/products.json";
import categoriesData from "@/data/categories.json";
import navigation from "@/data/navigation.json";
import { cn } from "@/lib/utils";
import { AppRoutes } from "@/constants/routes";
import ProductDetailView from "@/components/sections/ProductDetailView";

export default function ProductListingPage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ slug: string[] }>,
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = React.use(params);
  const slug = resolvedParams.slug;
  const [selectedFilters, setSelectedFilters] = React.useState<string[]>([]);
  
  const lastSlugSegment = slug ? slug[slug.length - 1] : "";
  const product = productsData.find(p => p.slug === lastSlugSegment);

  if (product) {
    return <ProductDetailView product={product} />;
  }
  
  const categorySlug = slug ? slug[0] : "";
  const subcategorySlug = slug && slug.length > 1 ? slug[1] : null;
  
  const navItem = Array.isArray(navigation) ? navigation.find(n => n.id === "products") : null;
  
  const toggleFilter = (option: string) => {
    setSelectedFilters(prev => 
      prev.includes(option) ? prev.filter(f => f !== option) : [...prev, option]
    );
  };

  // Filter products based on full slug AND active filters
  const filteredProducts = Array.isArray(productsData) ? productsData.filter(p => {
    if (!categorySlug) return true;
    if (p.category !== categorySlug) return false;
    
    // Apply Faceted Filter Sidebar logic
    if (selectedFilters.length > 0) {
      const greedyMatch = selectedFilters.some(filter => 
        p.name?.toLowerCase().includes(filter.toLowerCase()) ||
        p.description?.toLowerCase().includes(filter.toLowerCase())
      );
      if (!greedyMatch) return false;
    }

    return true;
  }) : [];

  const currentCategory = categoriesData.find(c => c.slug === categorySlug);
  const heroImage = currentCategory?.image || "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2070&auto=format&fit=crop";
  const categoryName = currentCategory?.name || lastSlugSegment.replace(/-/g, " ");

  return (
    <div className="bg-white min-h-screen pb-24">
      {/* Header with Background */}
      <div className="relative py-24 flex items-center justify-center overflow-hidden bg-secondary">
        <Image 
          src={heroImage}
          alt={categoryName}
          fill
          sizes="100vw"
          priority
          className="object-cover opacity-20 grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/80 via-secondary/40 to-secondary" />
        
        <div className="relative z-10 text-center space-y-6 max-w-4xl px-4">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-primary/10 rounded-full border border-primary/20 backdrop-blur-xl">
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Product Collection</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight">
            {categoryName}
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Professional {categoryName} solutions for modern office environments.
          </p>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 -mt-12 relative z-20">
          <div className="bg-white p-8 md:p-12 border border-neutral-100 shadow-premium rounded-[40px]">
            <main className="space-y-12">
              <div className="flex flex-col md:flex-row items-center justify-between pb-8 border-b border-neutral-100 gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Browse Collection</p>
                  <p className="text-sm text-neutral-500 font-bold">
                    Showing <span className="text-secondary">{filteredProducts.length}</span> premium models
                  </p>
                </div>
                <div className="flex items-center gap-4">
                   <div className="h-px w-12 bg-neutral-100 hidden md:block" />
                   <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-300">Western Interio</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-10">
                {filteredProducts.map((product) => (
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

              {filteredProducts.length === 0 && (
                <div className="text-center py-32 space-y-8 bg-neutral-50/50 rounded-[32px] border border-dashed border-neutral-200">
                  <div className="space-y-4">
                    <p className="text-3xl font-bold text-secondary tracking-tight">No items found</p>
                    <p className="text-gray-400 font-medium max-w-sm mx-auto">We couldn't find any products in this specific section. Please explore our other collections.</p>
                  </div>
                  <Link href={AppRoutes.Public.Products} className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-white font-bold uppercase tracking-widest text-[10px] rounded-xl hover:bg-secondary transition-all shadow-xl shadow-primary/20">
                    <ArrowRight size={16} />
                    Back to All Products
                  </Link>
                </div>
              )}
            </main>
          </div>
      </div>
    </div>
  );
}
