"use client";

import React, { Suspense } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowUpRight,
  Maximize2,
  Camera,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Filter,
  Loader2,
} from "lucide-react";

import { QuoteModal } from "@/components/common";
import { PageHeader } from "@/components/ui";
import { cn, slugify } from "@/lib/utils";

import galleryItemsRaw from "@/data/gallery.json";
import siteContent from "@/data/site-content.json";
import { useGetGalleryQuery } from "@/redux/api/galleryApi";
import type { GalleryItem } from "@/types/api";

interface RawGalleryItem {
  title: string;
  category: string;
  image: string;
}

const fallbackGalleryItems = galleryItemsRaw as RawGalleryItem[];

interface PageProps {
  params: Promise<{
    category?: string[];
  }>;
}

export default function GalleryPage({ params }: PageProps) {
  const unwrappedParams = React.use(params);
  const categorySlug = unwrappedParams.category?.[0];

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    }>
      <GalleryContent categorySlug={categorySlug} />
    </Suspense>
  );
}

function GalleryContent({ categorySlug }: { categorySlug?: string }) {
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);
  const [lightboxItems, setLightboxItems] = React.useState<GalleryItem[]>([]);
  const [isQuoteOpen, setIsQuoteOpen] = React.useState(false);
  const [quoteTitle, setQuoteTitle] = React.useState<string>("Get a Premium Quote");
  const [quoteSubtitle, setQuoteSubtitle] = React.useState<string>("Tell us about your project and our experts will contact you within 24 hours.");

  const { data: galleryResult, isLoading } = useGetGalleryQuery({ limit: 1000 });
  const { galleryPage } = siteContent;

  const gallery = React.useMemo(() => {
    if (!galleryResult?.data || galleryResult.data.length === 0) {
      // Map static fallback items
      return fallbackGalleryItems.map((item, index) => ({
        id: index + 1,
        title: item.title,
        category: item.category || "Interiors",
        image: item.image,
      })) as GalleryItem[];
    }
    return galleryResult.data;
  }, [galleryResult]);

  // Dynamically extract categories
  const categories = React.useMemo(() => {
    return ["All", ...Array.from(new Set(gallery.map((item) => item.category)))];
  }, [gallery]);

  // Find original category name from the URL slug
  const selectedCategory = React.useMemo(() => {
    if (!categorySlug) return "All";
    const found = categories.find((cat) => slugify(cat) === categorySlug);
    return found || "All";
  }, [categorySlug, categories]);

  // Group gallery items by category
  const groupedGallery = React.useMemo(() => {
    const groups: { [key: string]: GalleryItem[] } = {};
    gallery.forEach((item) => {
      const cat = item.category || "Interiors";
      if (!groups[cat]) {
        groups[cat] = [];
      }
      groups[cat].push(item);
    });
    return Object.entries(groups).map(([category, items]) => ({
      category,
      items,
    }));
  }, [gallery]);

  // Filter groups based on selected category
  const filteredGroups = React.useMemo(() => {
    return selectedCategory === "All"
      ? groupedGallery
      : groupedGallery.filter((group) => group.category === selectedCategory);
  }, [selectedCategory, groupedGallery]);

  const handleNext = () => {
    if (selectedIndex === null || lightboxItems.length === 0) return;
    setSelectedIndex((selectedIndex + 1) % lightboxItems.length);
  };

  const handlePrev = () => {
    if (selectedIndex === null || lightboxItems.length === 0) return;
    setSelectedIndex(
      (selectedIndex - 1 + lightboxItems.length) % lightboxItems.length,
    );
  };

  // Close lightbox on Escape key press
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedIndex(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  const currentItem =
    selectedIndex !== null && lightboxItems.length > 0 ? lightboxItems[selectedIndex] : null;

  return (
    <main className="bg-white min-h-screen pb-20">
      {/* Hero Section */}
      <PageHeader
        bgImage="/hero-bg.png"
        badgeIcon={Camera}
        badgeText={galleryPage.hero.badge}
        title={
          <h1 
            className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight uppercase"
            dangerouslySetInnerHTML={{ __html: galleryPage.hero.title }}
          />
        }
        subtitle={galleryPage.hero.subtitle}
      />

      {/* Dynamic Category Filtering Row */}
      <section className="py-12 lg:py-16 bg-white relative">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-neutral-100 pb-8">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary flex items-center gap-2">
                <Filter size={12} /> Gallery Categories
              </span>
              <p className="text-sm text-neutral-400 font-medium">Filter our portfolio by workspace design types</p>
            </div>
            
            {/* Scrollable Tab bar styled with rounded-lg active pills */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 md:pb-0 scroll-smooth -mx-6 px-6 md:mx-0 md:px-0">
              {categories.map((category) => {
                const count = category === "All" 
                  ? gallery.length 
                  : gallery.filter(item => item.category === category).length;
                
                const isActive = selectedCategory === category;
                
                return (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedIndex(null); // Close lightbox on filter change
                      if (category === "All") {
                        router.push("/gallery");
                      } else {
                        router.push(`/gallery/${slugify(category)}`);
                      }
                    }}
                    className={cn(
                      "px-5 py-2.5 text-xs font-bold tracking-wider uppercase transition-all duration-300 whitespace-nowrap cursor-pointer flex items-center gap-2 border",
                      isActive
                        ? "bg-secondary text-white border-secondary rounded-lg shadow-md shadow-secondary/10"
                        : "bg-neutral-50 text-neutral-500 hover:text-secondary hover:bg-neutral-100 border-neutral-200/60 rounded-lg"
                    )}
                  >
                    {category}
                    <span className={cn(
                      "inline-flex items-center justify-center px-1.5 py-0.5 text-[9px] font-black rounded-md",
                      isActive
                        ? "bg-primary text-white"
                        : "bg-neutral-200 text-neutral-600 group-hover:bg-neutral-300"
                    )}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Grid - World Class Showcase */}
      <section className="py-12 lg:py-16 bg-white relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          {filteredGroups.length === 0 ? (
            <div className="text-center py-20 bg-neutral-50 rounded-xl border border-dashed border-neutral-200">
              <Camera className="mx-auto text-neutral-300 mb-4 animate-bounce" size={40} />
              <p className="text-neutral-500 font-bold uppercase tracking-wider text-sm">No Projects Found</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              {filteredGroups.map((group, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setLightboxItems(group.items);
                    setSelectedIndex(0);
                  }}
                  className="group bg-white rounded-xl border border-neutral-100 p-4 shadow-soft hover:shadow-premium hover:-translate-y-1.5 transition-all duration-500 cursor-pointer flex flex-col"
                >
                  {/* Image Container with rounded-lg */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-neutral-50">
                    <Image
                      src={group.items[0]?.image || ""}
                      alt={group.category}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                    {/* Dark/Blurred Overlay on Hover */}
                    <div className="absolute inset-0 bg-neutral-950/0 group-hover:bg-neutral-950/40 transition-all duration-500 flex items-center justify-center">
                      {/* Glassmorphic Play/Zoom Icon */}
                      <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 text-white shadow-xl">
                        <Maximize2 size={22} className="animate-pulse" />
                      </div>
                    </div>
                    
                    {/* Premium Floating Category Tag */}
                    <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/90 backdrop-blur-md shadow-sm border border-white/30 text-[9px] font-black uppercase tracking-wider text-secondary">
                      <Sparkles size={8} className="text-primary" />
                      {group.category}
                    </span>
                  </div>

                  {/* Metadata Section */}
                  <div className="pt-5 pb-1 flex-grow flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <span className="text-[9px] font-black uppercase tracking-widest text-primary block">
                        {group.items.length} Design{group.items.length !== 1 ? "s" : ""}
                      </span>
                      <h3 className="text-xl font-extrabold text-secondary tracking-tight group-hover:text-primary transition-colors duration-300 leading-snug">
                        {group.category}
                      </h3>
                    </div>
                    
                    {/* Bottom Interactive Prompt */}
                    <div className="pt-4 border-t border-neutral-50 mt-4 flex items-center justify-between text-neutral-400 group-hover:text-secondary transition-colors duration-300">
                      <span className="text-[10px] font-bold tracking-widest uppercase">View Gallery</span>
                      <ArrowUpRight size={16} className="text-neutral-300 group-hover:text-primary transition-colors group-hover:translate-x-0.5 group-hover:-translate-y-0.5 duration-300" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal - Immersive Experience */}
      {currentItem && (
        <div
          className="fixed inset-0 z-[100] bg-neutral-950/98 backdrop-blur-2xl flex flex-col animate-in fade-in duration-700"
          onClick={() => setSelectedIndex(null)}
        >
          {/* Top Bar - Minimal */}
          <div className="w-full p-6 lg:p-10 flex justify-between items-center relative z-20">
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary flex items-center gap-2">
                <Sparkles size={10} className="animate-pulse" /> {currentItem.category}
              </span>
              <h2 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
                {currentItem.title}
              </h2>
            </div>

            <div className="flex items-center gap-6 md:gap-10">
              <div className="hidden md:block text-white/30 text-xs font-black uppercase tracking-[0.3em]">
                <span className="text-white">{(selectedIndex || 0) + 1}</span> /{" "}
                {lightboxItems.length}
              </div>
              
              {/* Quick Inquiry button inside Lightbox */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setQuoteTitle(`Inquire about ${currentItem.title}`);
                  setQuoteSubtitle(`Interested in our premium ${currentItem.category.toLowerCase()} installations? Request custom details below.`);
                  setIsQuoteOpen(true);
                }}
                className="px-5 py-2.5 bg-primary hover:bg-red-600 text-white font-bold text-[10px] tracking-widest uppercase rounded-lg shadow-lg shadow-primary/20 transition-all flex items-center gap-2 cursor-pointer active:scale-95 group"
              >
                Inquire Design <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>

              <button
                className="w-12 h-12 flex items-center justify-center text-white/50 hover:text-white transition-all bg-white/5 rounded-xl hover:bg-white/10 cursor-pointer active:scale-90"
                onClick={() => setSelectedIndex(null)}
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-grow relative px-6 lg:px-24 flex items-center justify-center">
            {/* Navigation Arrows - Premium Styling */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-8 lg:left-12 top-1/2 -translate-y-1/2 z-20 w-16 h-16 rounded-xl bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-all group cursor-pointer hidden xl:flex border border-white/5"
            >
              <ChevronLeft
                size={32}
                className="group-hover:-translate-x-1 transition-transform"
              />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-8 lg:right-12 top-1/2 -translate-y-1/2 z-20 w-16 h-16 rounded-xl bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-all group cursor-pointer hidden xl:flex border border-white/5"
            >
              <ChevronRight
                size={32}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>

            {/* Lightbox Frame */}
            <div
              className="relative w-full max-w-5xl h-[65vh] md:h-[75vh] bg-neutral-900 border border-neutral-800 p-2 rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-700"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-full rounded-lg overflow-hidden">
                <Image
                  src={currentItem.image}
                  alt={currentItem.title}
                  fill
                  sizes="(max-width: 1280px) 100vw, 1280px"
                  className="object-contain bg-neutral-950"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Mobile Navigation - Simplified */}
          <div className="xl:hidden p-6 flex justify-center gap-6 bg-black/40">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="w-14 h-14 rounded-xl bg-white/10 text-white flex items-center justify-center active:scale-90 transition-transform"
            >
              <ChevronLeft size={28} />
            </button>
            <span className="flex items-center text-white/50 text-[10px] font-black uppercase tracking-[0.25em]">
              <span className="text-white">{(selectedIndex || 0) + 1}</span> / {lightboxItems.length}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="w-14 h-14 rounded-xl bg-white/10 text-white flex items-center justify-center active:scale-90 transition-transform"
            >
              <ChevronRight size={28} />
            </button>
          </div>
        </div>
      )}

      {/* CTA - High Impact Banner */}
      <section className="py-12 lg:py-16 bg-white relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="relative bg-secondary text-white rounded-2xl p-12 md:p-20 shadow-2xl border border-neutral-800 overflow-hidden text-center">
            {/* Mesh/Gradient Backdrops */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(237,28,39,0.15),transparent_70%)]" />
            
            <div className="max-w-3xl mx-auto space-y-8 relative z-10">
              <div className="space-y-4">
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-black uppercase tracking-[0.3em] text-primary">
                  <Sparkles size={10} className="animate-pulse" /> Next Steps
                </span>
                <h2 className="text-3xl lg:text-5xl font-black tracking-tight leading-tight uppercase">
                  {galleryPage.cta.title}
                </h2>
                <p className="text-neutral-400 text-sm md:text-base leading-relaxed max-w-xl mx-auto font-normal">
                  {galleryPage.cta.subtitle}
                </p>
              </div>
              <button
                onClick={() => {
                  setQuoteTitle("Request a Custom Consultation");
                  setQuoteSubtitle("Let's plan your future workspace layout together with our design experts.");
                  setIsQuoteOpen(true);
                }}
                className="inline-flex items-center gap-6 px-10 py-4.5 bg-primary text-white font-bold rounded-lg hover:bg-white hover:text-secondary transition-all duration-500 shadow-xl shadow-primary/20 uppercase tracking-[0.25em] text-[10px] cursor-pointer active:scale-95 group"
              >
                {galleryPage.cta.button}
                <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>
      
      <QuoteModal 
        isOpen={isQuoteOpen} 
        onClose={() => setIsQuoteOpen(false)} 
        title={quoteTitle}
        subtitle={quoteSubtitle}
      />
    </main>
  );
}
