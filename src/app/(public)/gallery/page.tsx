"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Maximize2,
  Camera,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { QuoteModal } from "@/components/common";

import galleryItems from "@/data/gallery.json";
import siteContent from "@/data/site-content.json";

export default function GalleryPage() {
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);
  const [isQuoteOpen, setIsQuoteOpen] = React.useState(false);

  const { galleryPage } = siteContent;

  const handleNext = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex + 1) % galleryItems.length);
  };

  const handlePrev = () => {
    if (selectedIndex === null) return;
    setSelectedIndex(
      (selectedIndex - 1 + galleryItems.length) % galleryItems.length,
    );
  };

  const currentItem =
    selectedIndex !== null ? galleryItems[selectedIndex] : null;

  return (
    <main className="bg-white">
      {/* Hero Section - Cinematic */}
      <section className="relative pt-48 pb-32 flex items-center justify-center overflow-hidden bg-neutral-950">
        <Image
          src="/hero-bg.png"
          alt={galleryPage.hero.title}
          fill
          sizes="100vw"
          priority
          className="object-cover opacity-20 grayscale scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/80 via-neutral-950/40 to-neutral-950" />

        <div className="relative z-10 text-center space-y-6 max-w-4xl px-6">
          <div className="inline-flex items-center gap-3 px-5 py-1.5 bg-white/5 backdrop-blur-md border border-white/10 rounded-full animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Camera size={14} className="text-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">
              {galleryPage.hero.badge}
            </span>
          </div>
          <h1 
            className="text-3xl lg:text-5xl font-bold text-white leading-tight tracking-tight animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200"
            dangerouslySetInnerHTML={{ __html: galleryPage.hero.title }}
          />
          <p className="text-base lg:text-lg text-gray-400 max-w-xl mx-auto leading-relaxed font-normal animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
            {galleryPage.hero.subtitle}
          </p>
        </div>
      </section>

      {/* Gallery Grid - World Class Showcase */}
      <section className="py-12 lg:py-20 bg-white relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
            {galleryItems.map((item, i) => (
              <div
                key={i}
                className="group relative aspect-square overflow-hidden rounded-[48px] bg-neutral-50 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)] cursor-pointer"
                onClick={() => setSelectedIndex(i)}
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-neutral-950/0 group-hover:bg-neutral-950/60 transition-all duration-700" />

                {/* Overlay Info - Premium Styling */}
                <div className="absolute inset-0 p-12 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="space-y-4 translate-y-8 group-hover:translate-y-0 transition-transform duration-700">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30 text-[10px] font-black uppercase tracking-widest text-primary">
                      {item.category}
                    </span>
                    <h3 className="text-3xl font-bold text-white tracking-tight leading-tight">
                      {item.title}
                    </h3>
                    <div className="pt-6 flex items-center gap-3 text-white text-[10px] font-bold tracking-[0.2em] uppercase opacity-60 group-hover:opacity-100 transition-opacity">
                      Interactive View{" "}
                      <ArrowUpRight size={16} className="text-primary" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal - Immersive Experience */}
      {currentItem && (
        <div
          className="fixed inset-0 z-[100] bg-neutral-950/98 backdrop-blur-2xl flex flex-col animate-in fade-in duration-700"
          onClick={() => setSelectedIndex(null)}
        >
          {/* Top Bar - Minimal */}
          <div className="w-full p-8 lg:p-12 flex justify-between items-center relative z-20">
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">
                {currentItem.category}
              </span>
              <h2 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
                {currentItem.title}
              </h2>
            </div>

            <div className="flex items-center gap-10">
              <div className="hidden md:block text-white/30 text-xs font-black uppercase tracking-[0.3em]">
                <span className="text-white">{(selectedIndex || 0) + 1}</span> /{" "}
                {galleryItems.length}
              </div>
              <button
                className="w-14 h-14 flex items-center justify-center text-white/50 hover:text-white transition-all bg-white/5 rounded-2xl hover:bg-white/10 cursor-pointer active:scale-90"
                onClick={() => setSelectedIndex(null)}
              >
                <X size={28} />
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-grow relative px-8 lg:px-24">
            {/* Navigation Arrows - Premium Styling */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-12 top-1/2 -translate-y-1/2 z-20 w-20 h-20 rounded-3xl bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-all group cursor-pointer hidden xl:flex"
            >
              <ChevronLeft
                size={40}
                className="group-hover:-translate-x-1 transition-transform"
              />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-12 top-1/2 -translate-y-1/2 z-20 w-20 h-20 rounded-3xl bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-all group cursor-pointer hidden xl:flex"
            >
              <ChevronRight
                size={40}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>

            <div
              className="absolute inset-0 animate-in zoom-in-95 fade-in duration-1000 flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-[80vh] rounded-[40px] overflow-hidden">
                <Image
                  src={currentItem.image}
                  alt={currentItem.title}
                  fill
                  sizes="100vw"
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Mobile Navigation - Simplified */}
          <div className="md:hidden p-12 flex justify-center gap-10 bg-black/40">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="w-16 h-16 rounded-2xl bg-white/10 text-white flex items-center justify-center active:scale-90 transition-transform"
            >
              <ChevronLeft size={32} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="w-16 h-16 rounded-2xl bg-white/10 text-white flex items-center justify-center active:scale-90 transition-transform"
            >
              <ChevronRight size={32} />
            </button>
          </div>
        </div>
      )}

      {/* CTA - High Impact Banner */}
      <section className="py-24 lg:py-32 bg-neutral-50 border-t border-neutral-100 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 space-y-10 relative z-10">
          <div className="space-y-4">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Next Steps</span>
            <h2 className="text-3xl lg:text-5xl font-bold text-secondary tracking-tight">
              {galleryPage.cta.title}
            </h2>
            <p className="text-gray-500 text-base lg:text-lg font-normal leading-relaxed">
              {galleryPage.cta.subtitle}
            </p>
          </div>
          <button
            onClick={() => setIsQuoteOpen(true)}
            className="inline-flex items-center gap-6 px-12 py-5 bg-secondary text-white font-bold rounded-xl hover:bg-primary transition-all duration-500 shadow-2xl shadow-secondary/10 hover:shadow-primary/30 uppercase tracking-[0.2em] text-[11px] cursor-pointer active:scale-95 group"
          >
            {galleryPage.cta.button}
            <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </section>
      <QuoteModal isOpen={isQuoteOpen} onClose={() => setIsQuoteOpen(false)} />
    </main>
  );
}
