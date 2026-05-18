"use client";

import React from "react";
import Image from "next/image";
import { FilterSidebar } from "@/components/sections/FilterSidebar";
import { ProductCard } from "@/components/ui/ProductCard";
import { ChevronRight, ArrowRight, Filter } from "lucide-react";
import Link from "next/link";
import { Pagination } from "@/components/ui/Pagination";
import PageHeader from "@/components/ui/PageHeader";

import productsData from "@/data/products.json";
import categoriesData from "@/data/categories.json";
import { AppRoutes } from "@/constants/routes";
import ProductDetailView from "@/components/sections/ProductDetailView";

const parsePrice = (priceStr?: string): number => {
  if (!priceStr) return 0;
  const cleaned = priceStr.replace(/[^0-9]/g, "");
  return cleaned ? parseInt(cleaned, 10) : 0;
};

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
  
  const lastSlugSegment = slug ? slug[slug.length - 1] : "";
  const product = productsData.find(p => p.slug === lastSlugSegment);

  const categorySlug = slug ? slug[0] : "";
  
  const categoryProducts = React.useMemo(() => {
    return Array.isArray(productsData) ? (productsData as any[]).filter(p => p.category === categorySlug) : [];
  }, [categorySlug]);

  const dynamicMaxPrice = React.useMemo(() => {
    if (categoryProducts.length === 0) return 0;
    const prices = categoryProducts.map(p => parsePrice(p.price)).filter(p => p > 0);
    return prices.length > 0 ? Math.max(...prices) : 0;
  }, [categoryProducts]);

  const [maxPrice, setMaxPrice] = React.useState<number>(0);
  const activeMaxPrice = maxPrice || dynamicMaxPrice;

  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedFilters, maxPrice]);

  if (product) {
    return <ProductDetailView product={product} />;
  }
  
  const toggleFilter = (option: string) => {
    setSelectedFilters(prev => 
      prev.includes(option) ? prev.filter(f => f !== option) : [...prev, option]
    );
  };

  // Filter products based on category slug, price range AND active faceted filters
  const filteredProducts = Array.isArray(productsData) ? (productsData as any[]).filter(p => {
    if (!categorySlug) return true;
    if (p.category !== categorySlug) return false;
    
    // Apply Price Slider Filter
    if (activeMaxPrice > 0) {
      const price = parsePrice(p.price);
      if (price > 0 && price > activeMaxPrice) return false;
    }

    // Apply Faceted Filter Sidebar logic
    if (selectedFilters.length > 0) {
      // Group active filters by facet type for precise e-commerce matching
      const activeSubcategories = selectedFilters.filter(f => 
        categoriesData.some(c => c.name.toLowerCase() === f.toLowerCase()) || 
        categoryProducts.some(p => p.subcategory?.toLowerCase() === f.toLowerCase())
      );
      
      const activeBrands = selectedFilters.filter(f => 
        categoryProducts.some(p => p.brand?.toLowerCase() === f.toLowerCase())
      );

      const activeTypes = selectedFilters.filter(f => 
        categoryProducts.some(p => p.type?.toLowerCase() === f.toLowerCase())
      );

      const activeSpecs = selectedFilters.filter(f => 
        !activeSubcategories.includes(f) && !activeBrands.includes(f) && !activeTypes.includes(f)
      );

      // Check subcategory match (if any active)
      if (activeSubcategories.length > 0) {
        const matchesSub = activeSubcategories.some(sub => 
          p.subcategory?.toLowerCase().replace(/-/g, " ") === sub.toLowerCase().replace(/-/g, " ")
        );
        if (!matchesSub) return false;
      }

      // Check brand match (if any active)
      if (activeBrands.length > 0) {
        const matchesBrand = activeBrands.some(brand => p.brand?.toLowerCase() === brand.toLowerCase());
        if (!matchesBrand) return false;
      }

      // Check type match (if any active)
      if (activeTypes.length > 0) {
        const matchesType = activeTypes.some(type => p.type?.toLowerCase() === type.toLowerCase());
        if (!matchesType) return false;
      }

      // Check specifications match (if any active)
      if (activeSpecs.length > 0) {
        const matchesSpec = activeSpecs.some(spec => {
          if (spec === "In Stock") return true;
          const specMatch = p.specifications?.some((s: any) => s.value === spec);
          if (specMatch) return true;
          const shortSpecMatch = p.shortSpecs?.some((ss: string) => ss === spec);
          if (shortSpecMatch) return true;
          return false;
        });
        if (!matchesSpec) return false;
      }
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
      {/* Premium Integrated PageHeader */}
      <PageHeader 
        bgImage={heroImage}
        badgeText="Product Collection"
        titlePrefix="Explore"
        titleHighlight={categoryName}
        subtitle={`Professional ${categoryName} solutions engineered for premium workspaces and lasting comfort.`}
      />

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-16 relative z-20">
        <main className="space-y-12">
          {/* Header Row */}
          <div className="flex items-center justify-between pb-6 border-b border-neutral-100">
            <div className="space-y-1">
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-primary">Browse Collection</p>
              <p className="text-xs text-neutral-500 font-bold">
                Showing <span className="text-secondary font-black">{filteredProducts.length}</span> premium models
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="lg:hidden inline-flex items-center gap-2 px-4 py-2 border border-neutral-200 rounded-lg text-[10px] font-bold uppercase tracking-wider text-secondary hover:border-primary hover:text-primary transition-colors cursor-pointer"
              >
                <Filter size={14} />
                {showMobileFilters ? "Hide Filters" : "Filters"}
                {(selectedFilters.length > 0 || maxPrice < dynamicMaxPrice) && (
                  <span className="w-4 h-4 bg-primary text-white text-[8px] flex items-center justify-center rounded-full font-bold">
                    {selectedFilters.length + (maxPrice < dynamicMaxPrice ? 1 : 0)}
                  </span>
                )}
              </button>
              <div className="h-px w-12 bg-neutral-100 hidden md:block" />
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-300">Western Interio</span>
            </div>
          </div>

          {/* Mobile Filter Collapsible */}
          {showMobileFilters && (
            <div className="lg:hidden bg-neutral-50 p-6 rounded-xl border border-neutral-100 animate-in slide-in-from-top duration-300 mb-6">
              <FilterSidebar 
                products={categoryProducts}
                selectedFilters={selectedFilters}
                onFilterChange={toggleFilter}
                onClearAll={() => setSelectedFilters([])}
                maxPrice={maxPrice}
                onPriceChange={setMaxPrice}
              />
            </div>
          )}

          {/* Two Column Layout: Clean Sidebar + Minimalist Product Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Desktop Filter Sidebar - Clean & Borderless on background */}
            <div className="hidden lg:block lg:col-span-1">
              <FilterSidebar 
                products={categoryProducts}
                selectedFilters={selectedFilters}
                onFilterChange={toggleFilter}
                onClearAll={() => setSelectedFilters([])}
                maxPrice={maxPrice}
                onPriceChange={setMaxPrice}
              />
            </div>

            {/* Products Listing Grid Column */}
            <div className="lg:col-span-3 space-y-10">
              {filteredProducts.length > 0 ? (
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
              ) : (
                <div className="text-center py-24 px-8 space-y-8 bg-neutral-50/40 rounded-xl border border-dashed border-neutral-200/80 max-w-lg mx-auto shadow-sm animate-in fade-in duration-500">
                  <div className="w-16 h-16 bg-white border border-neutral-100 rounded-xl flex items-center justify-center mx-auto text-neutral-400 shadow-sm">
                    <Filter size={24} className="text-neutral-400 animate-pulse" />
                  </div>
                  <div className="space-y-3">
                    <p className="text-xl font-bold text-secondary tracking-tight">No Matching Models</p>
                    <p className="text-neutral-400 text-xs font-medium max-w-xs mx-auto leading-relaxed">
                      We couldn't find any products in <span className="text-primary font-bold">{categoryName}</span> matching your current filter selections. Try adjusting your checkboxes or price range slider.
                    </p>
                  </div>
                  <div className="pt-2 flex flex-col sm:flex-row justify-center gap-4">
                    <button 
                      onClick={() => {
                        setSelectedFilters([]);
                        setMaxPrice(0);
                      }} 
                      className="px-6 py-3.5 bg-secondary text-white font-black uppercase tracking-widest text-[9px] rounded-xl hover:bg-primary transition-all duration-300 shadow-md active:scale-95 cursor-pointer"
                    >
                      Clear All Filters
                    </button>
                    <Link 
                      href={AppRoutes.Public.Products} 
                      className="px-6 py-3.5 bg-white text-secondary border border-neutral-200 font-black uppercase tracking-widest text-[9px] rounded-xl hover:border-primary hover:text-primary transition-all duration-300 shadow-sm active:scale-95 inline-flex items-center justify-center gap-2"
                    >
                      <ArrowRight size={12} />
                      All Collections
                    </Link>
                  </div>
                </div>
              )}

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
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

