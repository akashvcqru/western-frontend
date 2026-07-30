"use client";

import React from "react";
import Link from "next/link";
import { Loader2, Search, ArrowRight } from "lucide-react";
import { useGetProductsQuery } from "@/redux/api/productsApi";
import { useGetCategoriesQuery } from "@/redux/api/categoriesApi";
import PageHeader from "@/components/ui/PageHeader";
import { ProductCard } from "@/components/ui/ProductCard";

export default function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const resolvedParams = React.use(searchParams);
  const q = resolvedParams.q || "";

  const { data: productsResult, isLoading: isProdsLoading } = useGetProductsQuery(
    { search: q, limit: 100 },
    { skip: !q }
  );
  
  const { data: categoriesResult, isLoading: isCatsLoading } = useGetCategoriesQuery({ limit: 100 });

  const isLoading = isProdsLoading || isCatsLoading;

  const productsList = React.useMemo(() => {
    return (productsResult?.data?.filter((p) => p.status === "Active") || []) as any[];
  }, [productsResult]);

  const categoriesList = React.useMemo(() => {
    return categoriesResult?.data || [];
  }, [categoriesResult]);

  const resolvedProducts = React.useMemo(() => {
    return productsList.map((p) => {
      // Find category name
      const catObj = categoriesList.find(
        (c) => c.id === p.category || c.slug === p.category
      );
      const categoryName = catObj ? catObj.name : p.category;
      return {
        ...p,
        categoryName,
      };
    });
  }, [productsList, categoriesList]);

  React.useEffect(() => {
    const title = q ? `Search Results for "${q}" | Western Interio` : "Search | Western Interio";
    document.title = title;
  }, [q]);

  return (
    <div className="bg-white min-h-screen">
      <PageHeader 
        bgImage="https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2070&auto=format&fit=crop"
        badgeText="Product Search"
        titlePrefix="Search"
        titleHighlight={q ? `"${q}"` : "Products"}
        subtitle={q ? `Showing search results for "${q}" across our collections.` : "Type something in the search overlay to search our premium collections."}
      />

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-12 lg:py-16 relative z-20">
        {isLoading ? (
          <div className="py-24 flex items-center justify-center">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : !q ? (
          <div className="text-center py-24 px-8 space-y-8 bg-neutral-50/40 rounded-xl border border-dashed border-neutral-200/80 shadow-sm">
            <div className="w-16 h-16 bg-white border border-neutral-100 rounded-xl flex items-center justify-center mx-auto text-neutral-400 shadow-sm">
              <Search size={24} className="text-neutral-400" />
            </div>
            <div className="space-y-3">
              <p className="text-xl font-bold text-secondary tracking-tight">No Search Query Provided</p>
              <p className="text-neutral-400 text-xs font-medium leading-relaxed">
                Please type your search keyword in the search bar above.
              </p>
            </div>
          </div>
        ) : resolvedProducts.length > 0 ? (
          <div className="space-y-10">
            <div className="flex items-center justify-between pb-6 border-b border-neutral-100">
              <div className="space-y-1">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-primary">Search Results</p>
                <p className="text-xs text-neutral-500 font-bold">
                  Found <span className="text-secondary font-black">{resolvedProducts.length}</span> matching products
                </p>
              </div>
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-300">Western Interio</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
              {resolvedProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  id={product.id}
                  name={product.name}
                  category={product.categoryName}
                  image={product.images && Array.isArray(product.images) && product.images.length > 0 && product.images[0] ? product.images[0] : "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2070&auto=format&fit=crop"}
                  slug={product.slug}
                  price={product.price}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-24 px-8 space-y-8 bg-neutral-50/40 rounded-xl border border-dashed border-neutral-200/80 shadow-sm">
            <div className="w-16 h-16 bg-white border border-neutral-100 rounded-xl flex items-center justify-center mx-auto text-neutral-400 shadow-sm">
              <Search size={24} className="text-neutral-400" />
            </div>
            <div className="space-y-3">
              <p className="text-xl font-bold text-secondary tracking-tight">No Products Found</p>
              <p className="text-neutral-400 text-xs font-medium leading-relaxed">
                We couldn&apos;t find any products matching <span className="text-primary font-bold">"{q}"</span>. Try adjusting your search query.
              </p>
            </div>
            <div className="flex justify-center">
              <Link 
                href="/products" 
                className="px-6 py-3.5 bg-secondary text-white border border-neutral-200 font-black uppercase tracking-widest text-[9px] rounded-xl hover:bg-primary hover:border-primary transition-all duration-300 shadow-sm active:scale-95 inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <ArrowRight size={12} />
                All Collections
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
