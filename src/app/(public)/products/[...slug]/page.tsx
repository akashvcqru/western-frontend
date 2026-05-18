"use client";

import React from "react";
import Image from "next/image";
import { FilterSidebar } from "@/components/sections/FilterSidebar";
import { ProductCard } from "@/components/ui/ProductCard";
import { ChevronRight, ArrowRight, Filter } from "lucide-react";
import Link from "next/link";
import { Pagination } from "@/components/ui/Pagination";

import productsData from "@/data/products.json";
import categoriesData from "@/data/categories.json";
import { AppRoutes } from "@/constants/routes";
import ProductDetailView from "@/components/sections/ProductDetailView";

export default function ProductListingPage({ 
  params,
}: { 
  params: Promise<{ slug: string[] }>
}) {
  const resolvedParams = React.use(params);
  const slug = resolvedParams.slug;
  const [selectedFilters, setSelectedFilters] = React.useState<string[]>([]);
  const [showMobileFilters, setShowMobileFilters] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const ITEMS_PER_PAGE = 6;
  
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedFilters]);
  
  const lastSlugSegment = slug ? slug[slug.length - 1] : "";
  const product = productsData.find(p => p.slug === lastSlugSegment);

  if (product) {
    return <ProductDetailView product={product} />;
  }
  
  const categorySlug = slug ? slug[0] : "";
  
  const toggleFilter = (option: string) => {
    setSelectedFilters(prev => 
      prev.includes(option) ? prev.filter(f => f !== option) : [...prev, option]
    );
  };

  // Filter products based on category slug AND active filters
  const filteredProducts = Array.isArray(productsData) ? (productsData as any[]).filter(p => {
    if (!categorySlug) return true;
    if (p.category !== categorySlug) return false;
    
    // Apply Faceted Filter Sidebar logic
    if (selectedFilters.length > 0) {
      const greedyMatch = selectedFilters.some(filter => 
        p.name?.toLowerCase().includes(filter.toLowerCase()) ||
        p.description?.toLowerCase().includes(filter.toLowerCase()) ||
        p.brand?.toLowerCase().includes(filter.toLowerCase()) ||
        p.type?.toLowerCase().includes(filter.toLowerCase()) ||
        p.subcategory?.toLowerCase().includes(filter.toLowerCase())
      );
      if (!greedyMatch) return false;
    }

    return true;
  }) : [];

  const currentCategory = categoriesData.find(c => c.slug === categorySlug);
  
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  
  const heroImage = currentCategory?.image || "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2070&auto=format&fit=crop";
  const categoryName = currentCategory?.name || lastSlugSegment.replace(/-/g, " ");

  return (
    <div className="bg-white min-h-screen pb-24">
      {/* Header with Background */}
      <div className="relative py-20 lg:py-28 flex items-center justify-center overflow-hidden bg-secondary">
        <Image 
          src={heroImage}
          alt={categoryName}
          fill
          sizes="100vw"
          priority
          className="object-cover opacity-20 grayscale animate-in fade-in zoom-in-105 duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/90 via-secondary/50 to-secondary" />
        
        <div className="relative z-10 text-center space-y-4 max-w-4xl px-4">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-primary/10 rounded-full border border-primary/20 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-700">
             <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white">Product Collection</span>
          </div>
          <h1 className="text-3xl lg:text-5xl font-black text-white leading-tight tracking-tight uppercase animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {categoryName}
          </h1>
          <p className="text-sm lg:text-base text-gray-400 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-150">
            Professional {categoryName} solutions for modern office environments.
          </p>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-16 relative z-20">
        <main className="space-y-12">
          {/* Header Row */}
          <div className="flex items-center justify-between pb-6 border-b border-neutral-100">
            <div className="space-y-1">
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-primary">Browse Collection</p>
              <p className="text-xs text-neutral-500 font-bold">
                Showing <span className="text-secondary">{filteredProducts.length}</span> premium models
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="lg:hidden inline-flex items-center gap-2 px-4 py-2 border border-neutral-200 rounded-lg text-[10px] font-bold uppercase tracking-wider text-secondary hover:border-primary hover:text-primary transition-colors cursor-pointer"
              >
                <Filter size={14} />
                {showMobileFilters ? "Hide Filters" : "Filters"}
                {selectedFilters.length > 0 && (
                  <span className="w-4 h-4 bg-primary text-white text-[8px] flex items-center justify-center rounded-full font-bold">
                    {selectedFilters.length}
                  </span>
                )}
              </button>
              <div className="h-px w-12 bg-neutral-100 hidden md:block" />
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-300">Western Interio</span>
            </div>
          </div>

          {/* Mobile Filter Collapsible */}
          {showMobileFilters && (
            <div className="lg:hidden bg-neutral-50 p-6 rounded-2xl border border-neutral-100 animate-in slide-in-from-top duration-300 mb-6">
              <FilterSidebar 
                products={(productsData as any[]).filter(p => p.category === categorySlug)}
                selectedFilters={selectedFilters}
                onFilterChange={toggleFilter}
                onClearAll={() => setSelectedFilters([])}
              />
            </div>
          )}

          {/* Two Column Layout: Clean Sidebar + Minimalist Product Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Desktop Filter Sidebar - Clean & Borderless on background */}
            <div className="hidden lg:block lg:col-span-1">
              <FilterSidebar 
                products={(productsData as any[]).filter(p => p.category === categorySlug)}
                selectedFilters={selectedFilters}
                onFilterChange={toggleFilter}
                onClearAll={() => setSelectedFilters([])}
              />
            </div>

            {/* Products Listing Grid Column */}
            <div className="lg:col-span-3 space-y-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8">
                {paginatedProducts.map((product) => (
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

              {filteredProducts.length > 0 && (
                <Pagination 
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => {
                    setCurrentPage(page);
                    window.scrollTo({ top: 320, behavior: "smooth" });
                  }}
                />
              )}

              {filteredProducts.length === 0 && (
                <div className="text-center py-32 space-y-8 bg-neutral-50/50 rounded-[24px] border border-dashed border-neutral-200">
                  <div className="space-y-4">
                    <p className="text-2xl font-bold text-secondary tracking-tight">No items found</p>
                    <p className="text-gray-400 font-medium max-w-sm mx-auto">We couldn't find any products in this specific section. Please explore our other collections.</p>
                  </div>
                  <Link href={AppRoutes.Public.Products} className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-white font-bold uppercase tracking-widest text-[9px] rounded-xl hover:bg-secondary transition-all shadow-xl shadow-primary/20">
                    <ArrowRight size={16} />
                    Back to All Products
                  </Link>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
