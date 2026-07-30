"use client";

import React from "react";
import { ProductCard } from "@/components/ui/ProductCard";
import { ArrowRight, Loader2, PackageX } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Pagination } from "@/components/ui/Pagination";
import PageHeader from "@/components/ui/PageHeader";
import { useGetCategoriesQuery, useGetSubCategoriesQuery } from "@/redux/api/categoriesApi";
import { useGetProductsQuery } from "@/redux/api/productsApi";

import { AppRoutes } from "@/constants/routes";
import ProductDetailView from "@/components/sections/ProductDetailView";
import CtaSection from "@/components/sections/home/CtaSection";
import QuoteModal from "@/components/common/QuoteModal";
import { resolveCategorySlugs } from "@/lib/categoryResolver";

interface Category {
  id?: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  metaTitle?: string;
  metaDescription?: string;
}

interface SubCategory {
  id: string;
  slug?: string;
  name: string;
  description: string;
  image?: string;
  categoryId: string;
  status: string;
  metaTitle?: string;
  metaDescription?: string;
}

interface ProductSpec {
  label: string;
  value: string;
}

interface Product {
  id: string;
  name: string;
  category: string;
  subCategory?: string;
  slug: string;
  price: string;
  images: string[];
  brand?: string;
  subcategory?: string;
  type?: string;
  material?: string;
  finish?: string;
  size?: string;
  specifications?: ProductSpec[];
  shortSpecs?: string[];
  detailsTitle?: string;
  detailsText1?: string;
  detailsText2?: string;
  quickSpecs?: string[];
  stock: number;
  metaTitle?: string;
  metaDescription?: string;
}

function CategoryHubPage({ 
  category, 
  subCategoriesList, 
  productsList 
}: { 
  category: Category | undefined; 
  subCategoriesList: SubCategory[]; 
  productsList: Product[]; 
}) {
  const [isQuoteOpen, setIsQuoteOpen] = React.useState(false);
  
  // Filter active subcategories that belong to this category
  const categorySubcategories = React.useMemo(() => {
    if (!category) return [];
    return subCategoriesList.filter(
      (sub) => sub.categoryId === category.id && sub.status === "Active"
    );
  }, [category, subCategoriesList]);

  const heroImage = category?.image || "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2070&auto=format&fit=crop";
  const categoryName = category?.name || "Category";
  const categoryDescription = category?.description || `Professional ${categoryName} solutions engineered for premium workspaces and lasting comfort.`;

  const metaTitle = category?.metaTitle || `${categoryName} | Western Interio`;
  const metaDescription = category?.metaDescription || categoryDescription;

  React.useEffect(() => {
    if (metaTitle) document.title = metaTitle;
  }, [metaTitle]);

  return (
    <div className="bg-white min-h-screen">
      <PageHeader 
        bgImage={heroImage}
        badgeText="Product Category"
        titlePrefix="Explore"
        titleHighlight={categoryName}
        subtitle={categoryDescription}
      />

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-12 lg:py-16 space-y-16">
        {/* Section Title */}
        <div className="space-y-4 text-center max-w-2xl mx-auto">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Browse Subcategories</span>
          <h2 className="text-3xl lg:text-4xl font-bold text-secondary tracking-tight leading-tight">
            Select a product series to browse
          </h2>
          <p className="text-sm text-neutral-400 font-medium leading-relaxed">
            Explore our meticulously designed furniture collections, engineered for long-term ergonomics, durability, and style.
          </p>
        </div>

        {/* Subcategories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {categorySubcategories.map((sub: SubCategory) => {
            const subImgUrl = sub.image || "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2070&auto=format&fit=crop";
            const subTitle = sub.name;
            const subDescription = sub.description || "High-end corporate collection featuring premium aesthetics and absolute support.";
            
            // Calculate model count correctly using subCategory field
            const count = productsList.filter(p => 
              p.subCategory === sub.id || 
              p.subcategory === sub.id ||
              p.subCategory?.toLowerCase() === sub.slug?.toLowerCase() ||
              p.subcategory?.toLowerCase() === sub.slug?.toLowerCase()
            ).length;
            
            const badgeText = `${count} ${count === 1 ? "Model" : "Models"}`;
            const ctaText = "Explore Series";
            const cardHref = `/products/${category?.slug || category?.id}/${sub.slug || sub.id}`;

            return (
              <Link
                key={sub.id}
                href={cardHref}
                className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-neutral-100/80 shadow-[0_12px_30px_-10px_rgba(0,0,0,0.03)] hover:shadow-[0_30px_60px_-15px_rgba(237,28,39,0.12)] transition-all duration-[600ms] hover:-translate-y-1.5"
              >
                {/* Image Container with aspect ratio */}
                <div className="relative aspect-[4/3] overflow-hidden bg-white p-2 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={subImgUrl}
                    alt={subTitle}
                    className="object-contain w-full h-full transform group-hover:scale-105 transition-transform duration-[1.2s] ease-out animate-in fade-in"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Dynamic Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-2.5 py-1 bg-neutral-900/70 backdrop-blur-md text-[9px] font-black tracking-[0.2em] text-white rounded-lg border border-white/10 uppercase">
                      {badgeText}
                    </span>
                  </div>
                </div>

                {/* Subcategory Details */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-secondary group-hover:text-primary transition-colors tracking-tight uppercase leading-tight">
                      {subTitle}
                    </h3>
                    <p className="text-xs leading-relaxed text-secondary/60 font-medium line-clamp-3">
                      {subDescription}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center gap-2 text-primary text-[9px] font-black tracking-[0.25em] uppercase border-t border-neutral-50">
                    {ctaText} 
                    <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform duration-300" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      
      {/* High-Impact CTA Banner */}
      <CtaSection onOpenQuote={() => setIsQuoteOpen(true)} />
      <QuoteModal isOpen={isQuoteOpen} onClose={() => setIsQuoteOpen(false)} />
    </div>
  );
}

export default function ProductListingPage({ 
  params,
}: { 
  params?: Promise<{ slug: string[] }>
}) {
  const routeParams = useParams();
  const rawSlug = routeParams?.slug;
  const slug = React.useMemo(() => {
    return Array.isArray(rawSlug) ? rawSlug : rawSlug ? [rawSlug] : [];
  }, [rawSlug]);

  const decodedSlug = React.useMemo(() => {
    return slug 
      ? slug.map(s => decodeURIComponent(s).trim().toLowerCase().replace(/\s+/g, "-"))
      : [];
  }, [slug]);

  const [currentPage, setCurrentPage] = React.useState(1);
  const [isQuoteOpen, setIsQuoteOpen] = React.useState(false);
  const ITEMS_PER_PAGE = 8;

  const { data: categoriesResult, isLoading: isCatsLoading } = useGetCategoriesQuery({ limit: 100 });
  const { data: subCategoriesResult, isLoading: isSubsLoading } = useGetSubCategoriesQuery({ limit: 100 });
  const { data: productsResult, isLoading: isProdsLoading } = useGetProductsQuery({ limit: 1000 });

  const categoriesList = React.useMemo(() => {
    return (categoriesResult?.data?.filter(c => c.status === "Active") || []) as unknown as Category[];
  }, [categoriesResult]);

  const subCategoriesList = React.useMemo(() => {
    return subCategoriesResult?.data?.filter(s => s.status === "Active") || [];
  }, [subCategoriesResult]);

  const productsList = React.useMemo(() => {
    return (productsResult?.data?.filter(p => p.status === "Active") || []) as unknown as Product[];
  }, [productsResult]);

  // Dynamically resolve and enrich products with premium specifications at runtime
  const resolvedProducts = React.useMemo(() => {
    return productsList.map(p => {
      const availability = p.stock > 0 ? "In Stock" : "Out of Stock";
      const brand = p.brand || "";

      const subCatObj = subCategoriesList.find(
        (s) => s.id === p.subCategory || s.slug === p.subCategory
      );
      const subcategory = subCatObj ? subCatObj.name : "";

      const catObj = categoriesList.find(
        (c) => c.id === p.category || c.slug === p.category
      );
      const type = catObj ? catObj.name : p.category;

      const specifications: { label: string; value: string }[] = [];
      const shortSpecs: string[] = [];

      if (p.material) {
        specifications.push({ label: "Material", value: p.material });
        shortSpecs.push(p.material);
      }
      if (p.finish) {
        specifications.push({ label: "Finish", value: p.finish });
        shortSpecs.push(p.finish);
      }
      if (p.size) {
        specifications.push({ label: "Size", value: p.size });
        shortSpecs.push(p.size);
      }

      if (p.specifications && Array.isArray(p.specifications)) {
        p.specifications.forEach(spec => {
          const isDuplicate = ["material", "finish", "size"].includes(spec.label.toLowerCase());
          if (!isDuplicate) {
            specifications.push(spec);
            if (spec.value) {
              shortSpecs.push(spec.value);
            }
          }
        });
      }

      shortSpecs.push(availability);

      return {
        ...p,
        brand,
        subcategory,
        type,
        availability,
        specifications,
        shortSpecs
      };
    });
  }, [productsList, subCategoriesList, categoriesList]);

  const lastSlugSegment = decodedSlug.length > 0 ? decodedSlug[decodedSlug.length - 1] : "";
  const product = resolvedProducts.find(p => p.slug === lastSlugSegment);

  const parentCatSlug = decodedSlug.length > 0 ? decodedSlug[0] : "";
  const subCatSlug = decodedSlug.length > 1 ? decodedSlug[1] : "";
  
  const resolvedCategorySlugs = React.useMemo(() => {
    return resolveCategorySlugs(parentCatSlug);
  }, [parentCatSlug]);

  const resolvedSubCatSlugs = React.useMemo(() => {
    return resolveCategorySlugs(subCatSlug);
  }, [subCatSlug]);

  const activeSubCategory = React.useMemo(() => {
    if (!subCatSlug) return null;
    const targetSlugs = new Set([
      subCatSlug.toLowerCase(),
      ...resolvedSubCatSlugs.map(s => s.toLowerCase()),
      subCatSlug.toLowerCase().replace(/s$/, ""),
      subCatSlug.toLowerCase().replace(/-/g, " ")
    ]);

    return subCategoriesList.find(s => {
      const sSlug = s.slug?.toLowerCase();
      const sId = s.id?.toLowerCase();
      const sNameSlug = s.name?.toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-");
      return (
        (sSlug && targetSlugs.has(sSlug)) ||
        (sId && targetSlugs.has(sId)) ||
        (sNameSlug && targetSlugs.has(sNameSlug))
      );
    });
  }, [subCatSlug, resolvedSubCatSlugs, subCategoriesList]);

  const categoryProducts = React.useMemo(() => {
    const validCategoryIds = new Set<string>();
    if (parentCatSlug) {
      const allParentSlugs = [
        parentCatSlug.toLowerCase(),
        ...resolvedCategorySlugs.map(s => s.toLowerCase()),
        parentCatSlug.toLowerCase().replace(/s$/, "")
      ];

      allParentSlugs.forEach(slug => {
        validCategoryIds.add(slug);
        categoriesList.forEach(c => {
          const cSlug = c.slug?.toLowerCase();
          const cId = c.id?.toLowerCase();
          const cNameSlug = c.name?.toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-");
          if (cSlug === slug || cId === slug || cNameSlug === slug) {
            if (c.id) validCategoryIds.add(c.id.toLowerCase());
            if (c.slug) validCategoryIds.add(c.slug.toLowerCase());
            if (c.name) validCategoryIds.add(c.name.toLowerCase());
          }
        });
      });
    }

    const validSubCategoryIds = new Set<string>();
    if (subCatSlug) {
      validSubCategoryIds.add(subCatSlug.toLowerCase());
      if (activeSubCategory) {
        if (activeSubCategory.id) validSubCategoryIds.add(activeSubCategory.id.toLowerCase());
        if (activeSubCategory.slug) validSubCategoryIds.add(activeSubCategory.slug.toLowerCase());
        if (activeSubCategory.name) validSubCategoryIds.add(activeSubCategory.name.toLowerCase());
      }
      resolvedSubCatSlugs.forEach(slug => {
        validSubCategoryIds.add(slug.toLowerCase());
        subCategoriesList.forEach(s => {
          const sSlug = s.slug?.toLowerCase();
          const sId = s.id?.toLowerCase();
          const sNameSlug = s.name?.toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-");
          if (sSlug === slug || sId === slug || sNameSlug === slug) {
            if (s.id) validSubCategoryIds.add(s.id.toLowerCase());
            if (s.slug) validSubCategoryIds.add(s.slug.toLowerCase());
            if (s.name) validSubCategoryIds.add(s.name.toLowerCase());
          }
        });
      });
    }

    // Step A: If subCatSlug is present, filter and return ONLY products specifically matching the subcategory or product ID/slug
    if (subCatSlug) {
      return resolvedProducts.filter(p => {
        const pSubCatRaw = (p.subCategory || p.subcategory || "").toString().toLowerCase();
        const pSlug = (p.slug || "").toLowerCase();
        const pId = (p.id || "").toLowerCase();

        const pSubCatClean = pSubCatRaw.replace(/[\s_-]+/g, "-");
        const pSubCatNoHyphen = pSubCatRaw.replace(/[\s_-]+/g, "");

        const pSubObj = subCategoriesList.find(s => s.id === pSubCatRaw || s.slug?.toLowerCase() === pSubCatRaw);
        const subNameLower = pSubObj?.name?.toLowerCase();
        const subSlugLower = pSubObj?.slug?.toLowerCase();

        const matches = 
          pSlug === subCatSlug.toLowerCase() ||
          pId === subCatSlug.toLowerCase() ||
          (pSubCatRaw && validSubCategoryIds.has(pSubCatRaw)) ||
          (pSubCatClean && validSubCategoryIds.has(pSubCatClean)) ||
          (pSubCatNoHyphen && validSubCategoryIds.has(pSubCatNoHyphen)) ||
          (pSlug && validSubCategoryIds.has(pSlug)) ||
          (pId && validSubCategoryIds.has(pId)) ||
          (subNameLower && validSubCategoryIds.has(subNameLower)) ||
          (subSlugLower && validSubCategoryIds.has(subSlugLower)) ||
          (pSubCatRaw && pSubCatRaw.replace(/-/g, " ") === subCatSlug.replace(/-/g, " "));

        return matches;
      });
    }

    // Step B: If no subcategory slug is in the URL, filter strictly by parent category!
    if (parentCatSlug && validCategoryIds.size > 0) {
      return resolvedProducts.filter(p => {
        const catLower = p.category?.toLowerCase();
        const pCatObj = categoriesList.find(c => c.id === p.category || c.slug === p.category);
        const catNameLower = pCatObj?.name?.toLowerCase();
        const catSlugLower = pCatObj?.slug?.toLowerCase();

        return (
          (catLower && validCategoryIds.has(catLower)) ||
          (catNameLower && validCategoryIds.has(catNameLower)) ||
          (catSlugLower && validCategoryIds.has(catSlugLower))
        );
      });
    }

    return resolvedProducts;
  }, [resolvedProducts, parentCatSlug, subCatSlug, activeSubCategory, categoriesList, subCategoriesList, resolvedCategorySlugs, resolvedSubCatSlugs]);

  const currentCategory = React.useMemo(() => {
    return categoriesList.find(c => c.slug === parentCatSlug) ||
           categoriesList.find(c => resolvedCategorySlugs.includes(c.slug));
  }, [categoriesList, parentCatSlug, resolvedCategorySlugs]);

  const categoryName = activeSubCategory
    ? activeSubCategory.name
    : (currentCategory?.name || lastSlugSegment.replace(/-/g, " "));

  const metaTitle = activeSubCategory
    ? (activeSubCategory.metaTitle || `${categoryName} | Western Interio`)
    : (currentCategory?.metaTitle || `${categoryName} | Western Interio`);
  const metaDescription = activeSubCategory
    ? (activeSubCategory.metaDescription || `Professional ${categoryName} solutions engineered for premium workspaces and lasting comfort.`)
    : (currentCategory?.metaDescription || `Professional ${categoryName} solutions engineered for premium workspaces and lasting comfort.`);

  React.useEffect(() => {
    if (metaTitle) document.title = metaTitle;
  }, [metaTitle]);

  const isLoading = isCatsLoading || isSubsLoading || isProdsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (product && !activeSubCategory) {
    return <ProductDetailView product={product} />;
  }

  // Handle 1-segment routes (e.g. /products/office-furniture) as a Subcategory Hub Page
  if (decodedSlug.length === 1) {
    const parentSlug = decodedSlug[0];
    const currentCategoryObj = categoriesList.find(c => c.slug === parentSlug || c.id === parentSlug);
    if (currentCategoryObj) {
      return <CategoryHubPage category={currentCategoryObj} subCategoriesList={subCategoriesList} productsList={productsList} />;
    }
  }

  const totalPages = Math.ceil(categoryProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = categoryProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  
  const heroImage = currentCategory?.image || "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2070&auto=format&fit=crop";

  return (
    <div className="bg-white min-h-screen">
      {/* Premium Integrated PageHeader */}
      <PageHeader 
        bgImage={heroImage}
        badgeText="Product Collection"
        titlePrefix="Explore"
        titleHighlight={categoryName}
        subtitle={`Professional ${categoryName} solutions engineered for premium workspaces and lasting comfort.`}
      />

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-12 lg:py-16 relative z-20">
        <main className="space-y-12">
          {/* Header Row */}
          <div className="flex items-center justify-between pb-6 border-b border-neutral-100">
            <div className="space-y-1">
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-primary">Browse Collection</p>
              <p className="text-xs text-neutral-500 font-bold">
                Showing <span className="text-secondary font-black">{categoryProducts.length}</span> premium models
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="h-px w-12 bg-neutral-100 hidden md:block" />
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-300">Western Interio</span>
            </div>
          </div>

          {/* Full Width Product Listing Grid */}
          <div className="space-y-10">
            {categoryProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
                {paginatedProducts.map((product) => (
                    <ProductCard 
                      key={product.id} 
                      id={product.id}
                      name={product.name}
                      category={product.category}
                      image={product.images && Array.isArray(product.images) && product.images.length > 0 && product.images[0] ? product.images[0] : "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2070&auto=format&fit=crop"}
                      slug={product.slug}
                      price={product.price}
                    />
                ))}
              </div>
            ) : (
              <div className="text-center py-24 px-8 space-y-8 bg-neutral-50/40 rounded-xl border border-dashed border-neutral-200/80 shadow-sm animate-in fade-in duration-500">
                <div className="w-16 h-16 bg-white border border-neutral-100 rounded-xl flex items-center justify-center mx-auto text-neutral-400 shadow-sm">
                  <PackageX size={24} className="text-neutral-400" />
                </div>
                <div className="space-y-3">
                  <p className="text-xl font-bold text-secondary tracking-tight">No Models Found</p>
                  <p className="text-neutral-400 text-xs font-medium leading-relaxed">
                    We couldn&apos;t find any products in <span className="text-primary font-bold">{categoryName}</span> at this time.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
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

            {categoryProducts.length > 0 && (
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
        </main>
      </div>

      {/* High-Impact CTA Banner */}
      <CtaSection onOpenQuote={() => setIsQuoteOpen(true)} />
      <QuoteModal isOpen={isQuoteOpen} onClose={() => setIsQuoteOpen(false)} />
    </div>
  );
}

