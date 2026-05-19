"use client";

import Image from "next/image";
import Link from "next/link";
import { 
  ArrowRight,
  Layout,
  Layers,
  Settings,
  ShieldCheck,
  Award,
  Sparkles,
  Target,
  Eye,
  Compass,
  Quote,
  Star,
  Check,
  MapPin,
  Clock,
  Heart,
  Phone,
  Mail
} from "lucide-react";
import QuoteModal from "@/components/common/QuoteModal";
import siteContent from "@/data/site-content.json";
import { AppRoutes } from "@/constants/routes";
import React, { useState } from "react";
import { PageHeader } from "@/components/ui";
import BrandSlider from "@/components/sections/BrandSlider";

export default function AboutPage() {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const { aboutPage, testimonialsPage } = siteContent;

  // Custom mapping of index to highly relevant corporate design icons
  const getServiceIcon = (index: number) => {
    const icons = [Layout, Settings, Layers, ShieldCheck, Compass];
    return icons[index % icons.length];
  };

  // Helper to generate avatar fallback initials
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Safe split for legacy title
  const titleParts = aboutPage.legacy.title.split('. ');

  return (
    <main className="bg-white">
      {/* Hero Section */}
      <PageHeader
        bgImage="https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2070&auto=format&fit=crop"
        badgeText={aboutPage.hero.badge}
        titlePrefix="Design for"
        titleHighlight="Better Life."
        subtitle={aboutPage.hero.subtitle}
      />

      {/* Intro Section - Who We Are */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Background Architectural Grid Accent & Glows */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent skew-x-12 translate-x-1/3 pointer-events-none" />
        <div className="absolute top-1/2 left-2/3 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-center">
            
            {/* Left Column: Narrative & Values Grid */}
            <div className="lg:col-span-7 space-y-8 flex flex-col justify-center">
              
              {/* Header / Badging */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 animate-fade-in">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  <span className="text-primary font-black uppercase tracking-[0.3em] text-[10px]">
                    Established Excellence
                  </span>
                  <div className="h-[1px] w-12 bg-primary/20" />
                </div>
                <h2 className="text-3xl lg:text-5xl font-black text-secondary tracking-tight leading-[1.15]">
                  {titleParts[0]}. <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-red-500 to-orange-500 font-extrabold relative inline-block">
                    {titleParts[1] || "Furniture Manufacturing"}
                    <span className="absolute left-0 bottom-1 w-full h-[3px] bg-gradient-to-r from-primary to-orange-500 rounded-full opacity-35" />
                  </span>
                </h2>
              </div>

              {/* Description */}
              <div className="space-y-6 text-base text-neutral-600 leading-relaxed font-normal max-w-2xl">
                 {aboutPage.legacy.content.map((p, i) => (
                   <p key={i}>{p}</p>
                 ))}
              </div>

              {/* Premium Stats Strip */}
              <div className="grid grid-cols-2 gap-8 border-y border-neutral-200/60 py-8 max-w-xl">
                 {aboutPage.legacy.stats.map((stat, i) => (
                   <div key={i} className="space-y-1">
                      <span className="text-4xl lg:text-5xl font-extrabold tracking-tighter text-secondary flex items-baseline">
                        {stat.value.replace('+', '')}
                        <span className="text-primary font-black text-3xl ml-0.5">+</span>
                      </span>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
                        {stat.label}
                      </p>
                   </div>
                 ))}
              </div>
            </div>

            {/* Right Column: Dynamic Overlapping Collage */}
            <div className="lg:col-span-5 relative flex items-center justify-center w-full min-h-[500px] lg:min-h-[600px] mt-12 lg:mt-0">
              
              {/* Main Backdrop Frame */}
              <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-2xl shadow-neutral-200 border-8 border-white bg-white group z-10">
                <Image 
                  src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop"
                  alt="Western Interio Corporate Boardroom"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-secondary/5 group-hover:bg-transparent transition-colors duration-1000" />
              </div>

              {/* Overlapping Detail Frame */}
              <div className="absolute -bottom-10 -left-10 w-[55%] aspect-square rounded-xl overflow-hidden border-8 border-white bg-white shadow-2xl z-20 hidden sm:block group/sub hover:z-30 transition-all duration-500">
                <Image 
                  src="https://images.unsplash.com/photo-1524758631624?q=80&w=2070&auto=format&fit=crop"
                  alt="Workspace Precision Manufacturing Detail"
                  fill
                  sizes="20vw"
                  className="object-cover group-hover/sub:scale-105 transition-transform duration-1000"
                />
              </div>

              {/* Top-Right Floating Quality Badge (Glassmorphic) */}
              <div className="absolute -top-6 -right-4 z-30 bg-white/90 backdrop-blur-md px-5 py-3 rounded-xl border border-neutral-100 shadow-premium flex items-center gap-3 animate-pulse hover:animate-none duration-1000">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Award size={18} />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-wider text-neutral-400">Quality Assured</p>
                  <p className="text-[11px] font-black text-secondary">ISO 9001:2015 Firm</p>
                </div>
              </div>

              {/* Bottom-Right Luxury Overlay Card */}
              <div className="absolute -bottom-6 -right-4 z-30 bg-secondary/95 backdrop-blur-md text-white p-6 rounded-xl border border-neutral-800 shadow-2xl max-w-[220px] hidden md:block">
                <div className="flex items-center gap-2 text-primary mb-2">
                  <Sparkles size={12} className="text-primary animate-pulse" />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em]">Execution</span>
                </div>
                <h4 className="text-xs font-black text-white mb-1.5 leading-snug">Turnkey Interiors</h4>
                <p className="text-[10px] text-neutral-400 leading-normal font-normal">
                  Bespoke layouts, False ceilings, acoustic glass partition systems, and optimized office workspace seating.
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-24 bg-neutral-950 text-white relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(237,28,39,0.06)_0%,transparent_75%)] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10">
          <div className="text-center space-y-4 mb-20 max-w-2xl mx-auto">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Our Philosophy</span>
            <h2 className="text-4xl lg:text-5xl font-black tracking-tight leading-tight uppercase">
              COMMITTED TO DESIGN <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-rose-500">EXCELLENCE.</span>
            </h2>
            <p className="text-neutral-400 text-sm leading-relaxed">
              We redefine modern work spaces through ergonomic design, sustainable materials, and modular furniture systems engineered for high performance.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 md:gap-10">
            {/* Vision Card */}
            <div className="bg-white/5 backdrop-blur-md p-10 lg:p-12 rounded-xl border border-white/10 hover:border-primary/30 transition-all duration-500 hover:-translate-y-2.5 shadow-2xl relative group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="w-16 h-16 bg-white/5 text-primary group-hover:bg-primary group-hover:text-white flex items-center justify-center rounded-xl transition-all duration-500 mb-10 shadow-lg shadow-neutral-900 group-hover:shadow-primary/20">
                <Eye size={28} />
              </div>
              <span className="text-[9px] font-black tracking-[0.2em] text-primary uppercase block mb-3">Future-Focused</span>
              <h3 className="text-2xl font-black tracking-tight mb-5 text-white">Our Vision</h3>
              <p className="text-neutral-400 text-sm leading-relaxed font-normal">
                To be the global benchmark in sustainable and ergonomic workspace solutions, redefining how people interact with their professional environment through state-of-the-art interior engineering.
              </p>
            </div>

            {/* Mission Card */}
            <div className="bg-white/5 backdrop-blur-md p-10 lg:p-12 rounded-xl border border-white/10 hover:border-primary/30 transition-all duration-500 hover:-translate-y-2.5 shadow-2xl relative group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="w-16 h-16 bg-white/5 text-primary group-hover:bg-primary group-hover:text-white flex items-center justify-center rounded-xl transition-all duration-500 mb-10 shadow-lg shadow-neutral-900 group-hover:shadow-primary/20">
                <Target size={28} />
              </div>
              <span className="text-[9px] font-black tracking-[0.2em] text-primary uppercase block mb-3">Precision Engineering</span>
              <h3 className="text-2xl font-black tracking-tight mb-5 text-white">Our Mission</h3>
              <p className="text-neutral-400 text-sm leading-relaxed font-normal">
                To plan and manufacture high-performance modular office furniture that prioritizes human health, comfort, and productivity, delivering seamless turnkey office installations across India.
              </p>
            </div>

            {/* Values Card */}
            <div className="bg-white/5 backdrop-blur-md p-10 lg:p-12 rounded-xl border border-white/10 hover:border-primary/30 transition-all duration-500 hover:-translate-y-2.5 shadow-2xl relative group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="w-16 h-16 bg-white/5 text-primary group-hover:bg-primary group-hover:text-white flex items-center justify-center rounded-xl transition-all duration-500 mb-10 shadow-lg shadow-neutral-900 group-hover:shadow-primary/20">
                <Compass size={28} />
              </div>
              <span className="text-[9px] font-black tracking-[0.2em] text-primary uppercase block mb-3">Our Core Pillars</span>
              <h3 className="text-2xl font-black tracking-tight mb-5 text-white">Core Values</h3>
              <p className="text-neutral-400 text-sm leading-relaxed font-normal">
                Built on the pillars of Precision Craftsmanship, Eco-friendly Materials, Ergonomic Innovation, and Customer-centric execution, ensuring every installation stands the test of time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars Section - Modern Grid */}
      <section className="py-24 bg-neutral-50 overflow-hidden relative">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10">
          <div className="flex flex-col items-center text-center space-y-6 mb-24">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">{aboutPage.services.badge}</span>
            <h2 className="text-4xl lg:text-5xl font-black tracking-tight text-secondary">
              {aboutPage.services.title}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
            {aboutPage.services.list.map((item, i) => {
              const Icon = getServiceIcon(i);
              return (
                <div key={i} className="bg-white p-10 rounded-xl border border-neutral-100 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.02)] hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] hover:border-primary/20 transition-all duration-700 group h-full flex flex-col justify-between">
                  <div>
                    <div className="w-14 h-14 bg-neutral-50 text-secondary group-hover:bg-primary group-hover:text-white flex items-center justify-center rounded-xl transition-all duration-500 mb-8 group-hover:-translate-y-1 shadow-md shadow-neutral-100 group-hover:shadow-primary/20">
                      <Icon size={24} />
                    </div>
                    <h3 className="text-xl font-bold tracking-tight mb-4 group-hover:text-primary transition-colors">{item.title}</h3>
                    <p className="text-neutral-500 text-sm font-medium leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Brand Logos Section */}
      <BrandSlider />

      {/* Testimonials Section */}
      <section className="py-24 bg-neutral-50/50 relative overflow-hidden border-t border-gray-150/40">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 space-y-20 relative z-10">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4 max-w-xl">
              <span className="text-primary font-extrabold uppercase tracking-[0.3em] text-[10px] block">
                Client Appreciations
              </span>
              <h2 className="text-3xl lg:text-5xl font-black text-secondary tracking-tight leading-none uppercase">
                What Our <span className="text-primary">Clients Say.</span>
              </h2>
              <p className="text-neutral-500 text-sm font-medium leading-relaxed">
                Discover why leading startups and conglomerate enterprises trust Western Interio for their workspaces.
              </p>
            </div>
            
            <Link 
              href="/testimonials" 
              className="inline-flex items-center gap-2.5 px-8 py-4.5 bg-white text-secondary hover:text-white hover:bg-primary font-black uppercase tracking-widest text-[9px] border border-gray-200 rounded-xl transition-all duration-500 hover:shadow-lg shadow-soft active:scale-95 group shrink-0"
            >
              View All Reviews
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {testimonialsPage.items.slice(0, 6).map((t: any, i: number) => (
              <div 
                key={i} 
                className="bg-white p-10 lg:p-12 rounded-xl border border-neutral-100 flex flex-col justify-between space-y-8 relative group hover:shadow-[0_40px_100px_-20px_rgba(237,28,39,0.08)] hover:-translate-y-2 hover:border-primary/20 transition-all duration-700 h-full"
              >
                {/* Quote Icon */}
                <div className="absolute top-10 right-10 text-primary/5 group-hover:text-primary/10 transition-all duration-700 pointer-events-none scale-100 group-hover:scale-110">
                   <Quote size={80} strokeWidth={0.5} />
                </div>
                
                {/* Rating & Content */}
                <div className="space-y-6 relative z-10">
                  <div className="flex gap-1 text-primary">
                    {[...Array(5)].map((_, idx) => (
                      <Star 
                        key={idx} 
                        size={15} 
                        fill={idx < t.rating ? "currentColor" : "none"} 
                        className={idx < t.rating ? "" : "text-neutral-200"}
                        strokeWidth={idx < t.rating ? 0 : 1.5} 
                      />
                    ))}
                  </div>
                  <p className="text-[15px] text-neutral-800 font-medium leading-relaxed italic tracking-wide">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>

                {/* Author Info */}
                <div className="pt-6 border-t border-neutral-100 flex items-center gap-4 relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-secondary to-neutral-800 text-white flex items-center justify-center font-extrabold shrink-0 group-hover:from-primary group-hover:to-rose-600 transition-all duration-500 shadow-md group-hover:shadow-primary/20">
                    {getInitials(t.author)}
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-extrabold text-neutral-800 uppercase tracking-tight text-sm truncate">{t.author}</h4>
                      <Check size={14} className="text-green-500 shrink-0 bg-green-50 rounded-full p-0.5 border border-green-100" />
                    </div>
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest leading-none truncate">{t.designation}</p>
                    <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest leading-none truncate">{t.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action - High Impact Premium Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Background Decorative Mesh & Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] max-w-[800px] bg-[radial-gradient(circle,rgba(237,28,39,0.08)_0%,transparent_70%)] rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10">
          <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 rounded-xl border border-neutral-800 shadow-2xl relative overflow-hidden p-8 sm:p-12 lg:p-20 group">
            
            {/* Background image subtle overlay */}
            <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-1000">
              <Image 
                src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2070&auto=format&fit=crop"
                alt="CTA Background"
                fill
                className="object-cover grayscale"
              />
            </div>
            
            {/* Abstract geometric mesh layout */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

            {/* Content grid */}
            <div className="relative z-10 grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              
              {/* Left Column: Heading and info */}
              <div className="lg:col-span-7 space-y-8 text-left">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-primary/10 border border-primary/20 rounded-full">
                    <Sparkles size={12} className="text-primary animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-primary">
                      {aboutPage.cta.badge || "Corporate Consultation"}
                    </span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white uppercase">
                    Transforming your <br className="hidden sm:inline" />
                    workspace <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-rose-500 font-extrabold relative inline-block">
                      aesthetics.
                      <span className="absolute left-0 bottom-1 w-full h-[3px] bg-gradient-to-r from-primary to-rose-500 rounded-full opacity-35" />
                    </span>
                  </h2>
                  <p className="text-neutral-300 text-sm sm:text-base leading-relaxed max-w-xl font-normal">
                    From modular workstations and CEO seating to turnkey corporate false ceilings and acoustics. Partner with Gurgaon's premier furniture manufacturer to design beyond.
                  </p>
                </div>

                {/* Direct info list pills */}
                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-neutral-350 backdrop-blur-md">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <Phone size={14} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] font-black uppercase tracking-wider text-neutral-500 leading-none">Call Us</p>
                      <a href={`tel:${siteContent.common.contact.phoneRaw}`} className="text-xs font-bold text-white leading-tight hover:text-primary transition-colors truncate">
                        {siteContent.common.contact.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-neutral-350 backdrop-blur-md">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <Mail size={14} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] font-black uppercase tracking-wider text-neutral-500 leading-none">Email Us</p>
                      <a href={`mailto:${siteContent.common.contact.email}`} className="text-xs font-bold text-white leading-tight hover:text-primary transition-colors truncate">
                        {siteContent.common.contact.email}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-neutral-400 max-w-lg">
                  <MapPin size={16} className="text-primary shrink-0 mt-0.5" />
                  <p className="text-xs leading-relaxed font-normal">{siteContent.common.contact.address}</p>
                </div>
              </div>

              {/* Right Column: Actions panel */}
              <div className="lg:col-span-5 flex flex-col gap-5 w-full bg-white/5 border border-white/10 rounded-xl p-6 sm:p-8 backdrop-blur-xl">
                <h3 className="text-lg font-bold text-white tracking-tight uppercase">Ready to get started?</h3>
                <p className="text-xs text-neutral-400 leading-relaxed font-normal">
                  Schedule a private tour of our Kadipur manufacturing facility or receive a personalized high-fidelity 2D/3D workspace layout consultation.
                </p>

                <div className="space-y-4 pt-2">
                  <button 
                    onClick={() => setIsQuoteOpen(true)}
                    className="w-full px-8 py-4.5 bg-primary text-white font-extrabold rounded-xl hover:bg-white hover:text-black transition-all duration-500 shadow-[0_20px_40px_-10px_rgba(237,28,39,0.3)] tracking-[0.2em] text-[10px] uppercase flex items-center justify-center gap-3 cursor-pointer active:scale-98 group"
                  >
                    <span>Request a Free Quote</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>

                  <Link 
                    href={AppRoutes.Public.Products} 
                    className="w-full px-8 py-4.5 bg-white/5 border border-white/15 text-white font-extrabold rounded-xl hover:bg-white/20 transition-all duration-500 tracking-[0.2em] text-[10px] uppercase flex items-center justify-center gap-2 cursor-pointer active:scale-98 text-center"
                  >
                    Explore Collections
                  </Link>
                </div>

                <div className="pt-2 border-t border-white/10 flex justify-between items-center text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                  <span className="flex items-center gap-1.5"><Clock size={12} className="text-primary" /> Mon - Sat: 9:30 - 18:30</span>
                  <span className="text-primary">Gurgaon, IN</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
      <QuoteModal isOpen={isQuoteOpen} onClose={() => setIsQuoteOpen(false)} />
    </main>
  );
}
