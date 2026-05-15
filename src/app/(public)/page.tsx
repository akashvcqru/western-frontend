"use client";

import React from "react";
import HeroSlider from "@/components/sections/HeroSlider";
import { 
  Building2, 
  ShieldCheck, 
  Palette, 
  Maximize, 
  Coffee as CoffeeIcon, 
  Layout,
  ArrowRight,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  Box,
  Layers,
  Zap,
  Wind
} from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import ImagePreview from "@/components/ui/ImagePreview";

import siteContent from "@/data/site-content.json";
import { cn } from "@/lib/utils";
import QuoteModal from "@/components/common/QuoteModal";
import { AppRoutes } from "@/constants/routes";

export default function Home() {
  const { homePage, footer, services, common } = siteContent;
  const [selectedGalleryImage, setSelectedGalleryImage] = React.useState<number | null>(null);
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [isQuoteOpen, setIsQuoteOpen] = React.useState(false);

  return (
    <div className="bg-white">
      {/* Hero Section - Premium Slider */}
      <section className="relative h-[92vh] overflow-hidden group bg-neutral-950">
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/60 via-black/20 to-black/60 pointer-events-none" />
        
        {homePage.heroSlider.map((slide: any, idx: number) => (
          <div
            key={slide.id}
            className={cn(
              "absolute inset-0 transition-all duration-1000 ease-in-out transform",
              currentSlide === idx ? "opacity-100 scale-105" : "opacity-0 scale-100"
            )}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              priority={idx === 0}
              className="object-cover"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 relative z-20">
              <div className="max-w-5xl space-y-10">
                <span className="inline-block px-6 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-black uppercase tracking-[0.4em] text-primary animate-in fade-in slide-in-from-bottom-4 duration-700">
                  {slide.subtitle}
                </span>
                <h1
                  className="text-6xl md:text-8xl lg:text-9xl font-bold text-white leading-[0.95] tracking-tight animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200"
                  dangerouslySetInnerHTML={{ __html: slide.title }}
                />
                <p className="text-lg md:text-2xl text-white/70 max-w-2xl mx-auto font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
                  {slide.description}
                </p>
                <div className="pt-10 flex flex-col sm:flex-row items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-700">
                  <button
                    onClick={() => setIsQuoteOpen(true)}
                    className="w-full sm:w-auto px-12 py-5 bg-primary text-white font-bold tracking-[0.2em] text-[11px] uppercase rounded-xl hover:bg-white hover:text-black transition-all duration-500 shadow-2xl shadow-primary/20 cursor-pointer active:scale-95 flex items-center justify-center gap-3 group"
                  >
                    Start Your Project
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  <Link
                    href="/products"
                    className="w-full sm:w-auto px-12 py-5 bg-white/5 backdrop-blur-xl border border-white/20 text-white font-bold tracking-[0.2em] text-[11px] uppercase rounded-xl hover:bg-white/20 transition-all duration-500 cursor-pointer active:scale-95"
                  >
                    Explore Designs
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Slide Controls - Minimal */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4">
          {homePage.heroSlider.map((_: any, idx: number) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-500 cursor-pointer",
                currentSlide === idx ? "w-12 bg-primary" : "w-6 bg-white/20 hover:bg-white/40"
              )}
            />
          ))}
        </div>
      </section>

      {/* Specifications - Modern Grid */}
      <section className="py-24 lg:py-40 bg-neutral-50/50 relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row justify-between items-end gap-12 mb-24">
            <div className="space-y-6 max-w-2xl">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Our Expertise</span>
              <h2 className="text-4xl lg:text-6xl font-bold text-secondary tracking-tight">
                Crafting Spaces that <br />Inspire <span className="text-primary">Success.</span>
              </h2>
            </div>
            <p className="text-gray-500 text-lg font-medium max-w-md leading-relaxed">
              We combine ergonomic innovation with aesthetic excellence to deliver modular solutions for the modern workforce.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {homePage.specifications.items.map((spec: any, idx: number) => {
              const IconMap: any = { Building2, ShieldCheck, Palette, Maximize, CoffeeIcon, Layout };
              const Icon = IconMap[spec.icon] || ShieldCheck;
              return (
                <div
                  key={idx}
                  className="p-10 rounded-[40px] bg-white border border-neutral-200/60 shadow-lg shadow-neutral-200/30 hover:border-primary/30 hover:shadow-2xl hover:shadow-neutral-200/50 transition-all duration-700 group hover:-translate-y-2"
                >
                  <div className="w-16 h-16 rounded-2xl bg-neutral-50 shadow-lg shadow-neutral-200/50 flex items-center justify-center text-secondary group-hover:bg-primary group-hover:text-white transition-all duration-500 mb-10 group-hover:-translate-y-2">
                    <Icon size={28} />
                  </div>
                  <h3 className="text-2xl font-bold text-secondary mb-4 tracking-tight">{spec.title}</h3>
                  <p className="text-gray-500 font-medium leading-relaxed">{spec.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Office Interiors - Cinematic Section */}
      <section className="py-32 lg:py-48 bg-neutral-950 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] -mr-96 -mt-96 pointer-events-none opacity-50" />
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-24 lg:gap-32 items-stretch">
            <div className="relative aspect-[4/5] rounded-[48px] overflow-hidden group shadow-2xl shadow-black/50">
              <Image 
                src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=2070&auto=format&fit=crop"
                alt="Office Interiors"
                fill
                className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-60" />
            </div>
            <div className="space-y-16">
              <div className="space-y-8">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">End-to-End Solutions</span>
                <h2 className="text-5xl lg:text-7xl font-bold tracking-tight">
                  Office <span className="text-primary">Interiors.</span>
                </h2>
                <p className="text-gray-400 text-lg lg:text-xl font-medium leading-relaxed max-w-xl">
                  Transforming shells into high-performance workspaces. We provide full interior decorating solutions including premium partitions, ceilings, and architectural flooring.
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-12">
                {services.map((service: any, i: number) => {
                  const icons = [Palette, Box, Layers, Zap, Wind];
                  const Icon = icons[i % icons.length];
                  return (
                    <div key={i} className="space-y-6 group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                          <Icon size={22} />
                        </div>
                        <h4 className="font-bold tracking-tight text-lg">{service.title}</h4>
                      </div>
                      <ul className="space-y-3 pl-16">
                        {service.subItems.slice(0, 2).map((sub: string, idx: number) => (
                          <li key={idx} className="text-sm text-gray-500 font-medium flex items-center gap-2">
                             <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                             {sub}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Product Categories - Premium Grid */}
      <section className="py-32 lg:py-48 bg-neutral-50 relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="flex flex-col items-center text-center space-y-6 mb-24">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Featured Collections</span>
            <h2 className="text-4xl lg:text-6xl font-bold text-secondary tracking-tight">
              Products We <span className="text-primary">Offer.</span>
            </h2>
            <p className="text-gray-500 text-lg font-medium max-w-2xl leading-relaxed">
              Explore our curated selection of modular office furniture designed for ergonomic comfort and modern aesthetics.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
            {homePage.productsWeOffer.categories.map((cat, i) => (
              <Link 
                key={i} 
                href={cat.link}
                className="group relative h-[400px] overflow-hidden rounded-[40px] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] transition-all duration-700"
              >
                <Image 
                  src={cat.image}
                  alt={cat.title}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-10 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-xl font-bold text-white leading-tight mb-4 group-hover:text-primary transition-colors">
                    {cat.title}
                  </h3>
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    Explore Collection <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. WHAT WE ARE Section - Brand Story */}
      <section className="py-32 lg:py-48 bg-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 translate-x-1/2 pointer-events-none" />
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-24 lg:gap-32 items-stretch">
            <div className="space-y-8">
              <div className="space-y-6">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">About Western Interio</span>
                <h2 className="text-4xl lg:text-6xl font-bold text-secondary tracking-tight leading-tight lg:whitespace-nowrap">
                  Think to design <span className="text-primary">beyond.</span>
                </h2>
              </div>
              <p className="text-xl text-neutral-600 leading-relaxed font-medium max-w-xl">
                {homePage.whatWeAre.desc}
              </p>
              <div className="grid sm:grid-cols-2 gap-6">
                {homePage.whatWeAre.list.map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-neutral-50 border border-neutral-100 text-neutral-600 font-bold tracking-tight text-sm group hover:border-primary/20 transition-all duration-300">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                       <CheckCircle2 size={14} className="text-primary" />
                    </div>
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="relative h-full min-h-[500px] rounded-[48px] overflow-hidden shadow-2xl shadow-neutral-200 group">
              <Image 
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2070&auto=format&fit=crop"
                alt="Western Interio Office"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-secondary/10 group-hover:bg-transparent transition-colors duration-1000" />
            </div>
          </div>
        </div>
      </section>

      {/* 5. GALLERY Section - Project Showcase */}
      <section id="gallery" className="py-32 lg:py-48 bg-white border-t border-neutral-100">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="flex flex-col items-center text-center space-y-6 mb-24">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Our Portfolio</span>
            <h2 className="text-4xl lg:text-6xl font-bold text-secondary tracking-tight">
              Recent <span className="text-primary">Projects.</span>
            </h2>
            <p className="text-gray-500 max-w-2xl text-lg font-medium leading-relaxed">
              {homePage.gallery.desc}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2070&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1517502884422-41eaead166d4?q=80&w=2070&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2070&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1505797149-43b0069ec26b?q=80&w=2071&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1595844730298-b960ff98fee0?q=80&w=2070&auto=format&fit=crop"
            ].map((img, i) => (
              <div 
                key={i} 
                className="group relative aspect-[4/3] overflow-hidden rounded-[40px] bg-neutral-100 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)] cursor-pointer"
                onClick={() => setSelectedGalleryImage(i)}
              >
                <Image 
                  src={img}
                  alt={`Project ${i+1}`}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-secondary/0 group-hover:bg-secondary/40 transition-all duration-500" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center shadow-2xl transform scale-75 group-hover:scale-100 transition-all duration-500">
                    <Maximize size={28} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-24 text-center">
            <Link 
              href="/gallery" 
              className="inline-flex items-center gap-4 px-12 py-5 bg-secondary text-white font-bold tracking-[0.2em] text-[11px] uppercase rounded-xl hover:bg-primary transition-all duration-500 shadow-2xl shadow-secondary/10 hover:shadow-primary/30 group active:scale-95"
            >
              View Full Portfolio
              <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Image Preview Modal */}
      <ImagePreview 
        isOpen={selectedGalleryImage !== null}
        images={[
          "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2070&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1517502884422-41eaead166d4?q=80&w=2070&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2070&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1505797149-43b0069ec26b?q=80&w=2071&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1595844730298-b960ff98fee0?q=80&w=2070&auto=format&fit=crop"
        ].map(url => ({ url, title: "Western Interio Project" }))}
        index={selectedGalleryImage || 0}
        onClose={() => setSelectedGalleryImage(null)}
        onNext={() => setSelectedGalleryImage(prev => (prev !== null ? (prev + 1) % 6 : null))}
        onPrev={() => setSelectedGalleryImage(prev => (prev !== null ? (prev - 1 + 6) % 6 : null))}
      />

      {/* 6. Popular Search Terms - Refined Tag Cloud */}
      <section className="py-32 bg-neutral-50 border-y border-neutral-100/50 relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="flex flex-col items-center text-center space-y-6 mb-16">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Discover More</span>
            <h3 className="text-3xl font-bold text-secondary tracking-tight">
              Popular Search Terms
            </h3>
          </div>
          <div className="flex flex-wrap justify-center gap-3 lg:gap-4 max-w-5xl mx-auto">
            {footer.popularSearchTerms.map((term: string, i: number) => (
              <span 
                key={i} 
                className="px-5 py-2.5 bg-white border border-neutral-200/60 rounded-full text-[9px] font-semibold text-neutral-500 tracking-widest hover:border-primary/40 hover:text-primary transition-all duration-300 cursor-default shadow-sm uppercase"
              >
                {term}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 7. We Deliver To - Premium Interactive Grid */}
      <section className="py-24 lg:py-40 bg-white relative overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#C5A267 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10">
          <div className="flex flex-col items-center text-center space-y-8 mb-24">
            <div className="w-20 h-20 rounded-[28px] bg-neutral-50 flex items-center justify-center text-primary border border-neutral-100 shadow-sm animate-pulse">
               <MapPin size={36} strokeWidth={1.5} />
            </div>
            <div className="space-y-4 max-w-3xl">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Our Footprint</span>
              <h3 className="text-4xl lg:text-7xl font-bold text-secondary tracking-tighter leading-[0.95]">
                Pan India <span className="text-primary">Presence.</span>
              </h3>
              <p className="text-gray-500 text-lg lg:text-xl font-medium leading-relaxed">
                Delivering excellence across all major corporate hubs with seamless installation and local support.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 lg:gap-4">
            {footer.deliveryLocations.map((loc: string, i: number) => (
              <div 
                key={i} 
                className="group relative flex items-center justify-center py-5 px-4 bg-neutral-50/50 border border-neutral-100 rounded-2xl hover:bg-white hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 cursor-default"
              >
                <div className="absolute left-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                </div>
                <span className="text-[10px] font-semibold text-neutral-400 tracking-[0.2em] uppercase group-hover:text-secondary group-hover:translate-x-2 transition-all duration-500">
                  {loc}
                </span>
              </div>
            ))}
          </div>
          
          <div className="mt-20 pt-12 border-t border-neutral-100 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="w-10 h-10 rounded-full border-2 border-white bg-neutral-100 flex items-center justify-center overflow-hidden">
                    <Image src={`https://i.pravatar.cc/100?img=${n + 10}`} alt="user" width={40} height={40} />
                  </div>
                ))}
              </div>
              <p className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest">Trusted by 500+ Corporate Clients</p>
            </div>
            <Link 
              href={AppRoutes.Public.Contact}
              className="group flex items-center gap-4 text-xs font-black uppercase tracking-[0.2em] text-secondary hover:text-primary transition-colors"
            >
              Check Availability in Your Area
              <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* 8. Contact Information - High-Impact Banner */}
      <section className="py-32 lg:py-48 bg-neutral-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 z-0">
           <Image 
             src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2070&auto=format&fit=crop"
             alt="bg"
             fill
             className="object-cover opacity-10 grayscale"
           />
           <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent" />
        </div>
        
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid lg:grid-cols-3 gap-24 lg:gap-16">
            <div className="space-y-10 group">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                <MapPin size={28} />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold tracking-tight">Headquarters</h3>
                <p className="text-lg text-gray-400 font-medium leading-relaxed">
                  {common.contact.address}
                </p>
              </div>
            </div>

            <div className="space-y-10 group">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                <Phone size={28} />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold tracking-tight">Direct Line</h3>
                <div className="space-y-2">
                  <p className="text-xl font-semibold tracking-tight hover:text-primary transition-colors cursor-pointer">{common.contact.phone}</p>
                  {common.contact.phones.map((p: string, i: number) => (
                    <p key={i} className="text-xl font-semibold tracking-tight hover:text-primary transition-colors cursor-pointer">{p}</p>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-10 group">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                <Mail size={28} />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold tracking-tight">Digital Inquiry</h3>
                <div className="space-y-2">
                  <p className="text-base font-semibold tracking-tight text-gray-400 hover:text-primary transition-colors cursor-pointer">{common.contact.email}</p>
                  {common.contact.emails.map((e: string, i: number) => (
                    <p key={i} className="text-base font-semibold tracking-tight text-gray-400 hover:text-primary transition-colors cursor-pointer">{e}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <QuoteModal isOpen={isQuoteOpen} onClose={() => setIsQuoteOpen(false)} />
    </div>
  );
}
