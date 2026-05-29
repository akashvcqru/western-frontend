"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowRight, 
  CheckCircle2, 
  Layout, 
  Layers, 
  Maximize, 
  Grid,
  Trees,
  Shield,
  LayoutGrid,
  Cloud,
  Wind,
  Zap,
  Sparkles,
  Paintbrush,
  Columns,
  Award,
  Users,
  Briefcase,
  TrendingUp,
  FileCheck,
  Phone,
  Mail
} from "lucide-react";
import QuoteModal from "@/components/common/QuoteModal";
import { AppRoutes } from "@/constants/routes";
import { PageHeader } from "@/components/ui";
import { cn } from "@/lib/utils";
import siteContent from "@/data/site-content.json";

export default function ServicesPage() {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", label: "All Services" },
    { id: "partitions", label: "Partitions & Walls" },
    { id: "flooring", label: "Flooring & Tiles" },
    { id: "ceiling", label: "Ceiling & Comfort" },
    { id: "infrastructure", label: "Infrastructure" }
  ];

  const services = [
    {
      title: "Modular Partitions",
      slug: "modular-partition",
      desc: "Flexible, soundproof, and reconfigurable workspace divider systems optimized for dynamic floor planning.",
      category: "partitions",
      icon: Layers,
      image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop"
    },
    {
      title: "Glass & Gypsum Partitions",
      slug: "glass-gypsum-partition",
      desc: "Seamless double-glazed glass panels and sturdy gypsum structures that balance spatial light and acoustic isolation.",
      category: "partitions",
      icon: Columns,
      image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2070&auto=format&fit=crop"
    },
    {
      title: "Solid Wall Partitions",
      slug: "solid-wall-partition",
      desc: "Sturdy, fully sound-insulated floor-to-ceiling solid partitions designed to secure executive privacy and boardroom focus.",
      category: "partitions",
      icon: Maximize,
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2070&auto=format&fit=crop"
    },
    {
      title: "Aluminum Partitions",
      slug: "aluminum-partitions",
      desc: "Highly durable, sleek-profile aluminum frames customized with composite panel integrations for modern partitions.",
      category: "partitions",
      icon: Paintbrush,
      image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2069&auto=format&fit=crop"
    },
    {
      title: "Wooden Flooring",
      slug: "wooden-flooring",
      desc: "Premium engineered oak, walnut, and teak floor layouts tailored to elevate leadership suites and high-end boardrooms.",
      category: "flooring",
      icon: Trees,
      image: "https://images.unsplash.com/photo-1581850518616-bcb8186c3f30?q=80&w=2070&auto=format&fit=crop"
    },
    {
      title: "Vinyl Flooring",
      slug: "vinyl-flooring",
      desc: "Heavy-duty resilient sheets and interlocking plank systems engineered to withstand heavy, high-traffic commercial environments.",
      category: "flooring",
      icon: Shield,
      image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=2070&auto=format&fit=crop"
    },
    {
      title: "Vitrified Tiles",
      slug: "vitrified-tiles",
      desc: "Luxury double-charged vitrified tile grids styled for impressive high-gloss reception lobbies and corporate cafeterias.",
      category: "flooring",
      icon: LayoutGrid,
      image: "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?q=80&w=2070&auto=format&fit=crop"
    },
    {
      title: "False Flooring",
      slug: "false-flooring",
      desc: "Raised modular access floor paneling designed to route hidden electrical, server cooling, and telecom networking grids.",
      category: "flooring",
      icon: Grid,
      image: "https://images.unsplash.com/photo-1595844730298-b960ff98fee0?q=80&w=2070&auto=format&fit=crop"
    },
    {
      title: "False Ceiling Design",
      slug: "false-ceiling-design",
      desc: "Aesthetic suspended ceiling rafters, ambient grid ceilings, and drop light designs integrating smart office utilities.",
      category: "ceiling",
      icon: Cloud,
      image: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?q=80&w=2070&auto=format&fit=crop"
    },
    {
      title: "AC & Ducting",
      slug: "ac-ducting",
      desc: "Precision-designed central HVAC ventilation, VRV systems, and custom duct installations for optimal indoor airflow.",
      category: "ceiling",
      icon: Wind,
      image: "https://images.unsplash.com/photo-1581094288338-2314dddb7ec4?q=80&w=2070&auto=format&fit=crop"
    },
    {
      title: "Electrical & Networking",
      slug: "electrical-networking",
      desc: "Certified commercial power cabling, safety distribution boards, and structured server room networking installations.",
      category: "infrastructure",
      icon: Zap,
      image: "https://images.unsplash.com/photo-1517502884422-41eaead166d4?q=80&w=2070&auto=format&fit=crop"
    },
    {
      title: "Office Interiors",
      slug: "office-interiors",
      desc: "End-to-end turnkey office layout execution, spatial fitouts, and strategic employee desks architecture.",
      category: "infrastructure",
      icon: Layout,
      image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2070&auto=format&fit=crop"
    },
    {
      title: "Interiors & Decoration",
      slug: "interiors-decoration",
      desc: "Tailored brand styling elements, custom wall graphic claddings, ergonomic accents, and premium office artifacts.",
      category: "infrastructure",
      icon: Sparkles,
      image: "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?q=80&w=2070&auto=format&fit=crop"
    }
  ];

  const metrics = [
    { icon: Award, value: "10+", label: "Years Excellence" },
    { icon: Users, value: "500+", label: "Workspaces Delivered" },
    { icon: FileCheck, value: "100%", label: "Quality Assurance" },
    { icon: TrendingUp, value: "Zero", label: "Defect Handover" }
  ];

  const workflow = [
    {
      step: "01",
      title: "Layout Audit",
      desc: "Comprehensive space study & workflow optimization consult."
    },
    {
      step: "02",
      title: "CAD Blueprinting",
      desc: "3D architectural styling, material profiles & color grids."
    },
    {
      step: "03",
      title: "Precision Sourcing",
      desc: "Direct manufacturing of modular components under strict audits."
    },
    {
      step: "04",
      title: "Seamless Installation",
      desc: "On-site execution, safety integration, and certified handover."
    }
  ];

  const filteredServices = activeCategory === "all"
    ? services
    : services.filter(service => service.category === activeCategory);

  return (
    <main className="bg-white min-h-screen">
      {/* Hero Section */}
      <PageHeader
        bgImage="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2070&auto=format&fit=crop"
        badgeText="Turnkey Solutions"
        titlePrefix="Architectural"
        titleHighlight="Services."
        subtitle="From strategic spatial mapping to premium certified execution, we provide end-to-end commercial interior configurations that drive focus, collaboration, and spatial efficiency."
      />

      {/* Turnkey Capabilities & Trust Metrics */}
      <section className="py-24 relative overflow-hidden bg-neutral-50/50">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/2 rounded-full blur-[100px] -ml-64 -mt-64 pointer-events-none" />
        
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  <span className="text-primary font-bold uppercase tracking-[0.3em] text-[10px]">
                    Core Competencies
                  </span>
                  <div className="h-[1px] w-12 bg-primary/20" />
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-secondary leading-tight tracking-tight uppercase">
                  Complete <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-red-500 to-orange-500 font-extrabold relative inline-block">
                    Turnkey Expertise.
                    <span className="absolute left-0 bottom-1 w-full h-[3px] bg-gradient-to-r from-primary to-orange-500 rounded-full opacity-35" />
                  </span>
                </h2>
                <p className="text-sm md:text-base text-neutral-500 leading-relaxed font-normal max-w-xl pt-2">
                  We take single-point responsibility for your corporate space transformation. Our comprehensive, certified execution ecosystem integrates raw design, space planning, electrical networks, and modular installations under a single accountable workflow.
                </p>
              </div>

              {/* 2x2 Grid of Key Credentials */}
              <div className="grid sm:grid-cols-2 gap-4 max-w-xl">
                {metrics.map((metric, i) => (
                  <div key={i} className="p-5 bg-white border border-neutral-200/50 rounded-xl shadow-soft hover:shadow-premium transition-all duration-300 flex items-center gap-4 group">
                    <div className="w-11 h-11 rounded-lg bg-neutral-50 text-secondary group-hover:bg-primary group-hover:text-white flex items-center justify-center border border-neutral-100 transition-all duration-500 shrink-0">
                      <metric.icon size={18} strokeWidth={2} />
                    </div>
                    <div>
                      <div className="text-xl font-bold text-secondary tracking-tight group-hover:text-primary transition-colors">{metric.value}</div>
                      <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">{metric.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Checklist details */}
              <div className="grid sm:grid-cols-2 gap-4 pt-6 border-t border-neutral-200/60 max-w-xl">
                {["False Ceiling & Lighting", "Acoustic Insulation Systems", "Premium Partition Integration", "Certified Structured Cabling"].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-secondary font-semibold tracking-tight text-xs md:text-sm">
                    <div className="w-4.5 h-4.5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="text-primary" size={10} />
                    </div>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Media/Image Column with Overlapping Design */}
            <div className="lg:col-span-5 relative flex items-center justify-center w-full min-h-[450px] lg:min-h-[520px]">
              
              {/* Primary Image Container */}
              <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-2xl border-8 border-white bg-white group z-10">
                <Image 
                  src="https://images.unsplash.com/photo-1497215842964-222b430dc094?q=80&w=2070&auto=format&fit=crop"
                  alt="Corporate Turnkey Layout Execution"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-secondary/5 group-hover:bg-transparent transition-colors duration-1000" />
              </div>

              {/* Floating Overlay Badge (Bottom Left) */}
              <div className="absolute -bottom-6 -left-4 z-20 bg-white/95 backdrop-blur-md border border-neutral-150 p-4.5 rounded-xl shadow-premium flex items-center gap-3.5 max-w-[240px] hidden sm:flex animate-pulse hover:animate-none duration-1000">
                <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0 shadow-sm">
                  <Briefcase size={16} />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-secondary leading-none">Global Audits</h4>
                  <p className="text-[9px] text-neutral-400 font-semibold mt-1">Conforming to elite corporate safety guidelines.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Interactive Catalog Directory */}
      <section className="py-24 relative bg-white border-t border-neutral-100">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          
          {/* Section Heading */}
          <div className="text-center space-y-4 max-w-3xl mx-auto mb-14">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary bg-primary/5 px-4 py-1.5 rounded-lg inline-block">
              SPECIALIZED SOLUTIONS
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-secondary uppercase tracking-tight">
              Our Interior <span className="text-primary">Portfolio.</span>
            </h2>
            <p className="text-neutral-400 text-sm font-normal leading-relaxed max-w-xl mx-auto">
              Explore our range of customizable commercial space configurations. Every service is fully executed by certified teams to ensure absolute geometric compliance and quality assurance.
            </p>
          </div>

          {/* Interactive Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-2.5 mb-14">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "px-5 py-2.5 text-[10px] font-bold uppercase tracking-wider rounded-xl border transition-all duration-300 cursor-pointer active:scale-95",
                  activeCategory === cat.id
                    ? "bg-secondary text-white border-secondary shadow-sm"
                    : "bg-neutral-50 text-secondary/60 border-neutral-200/70 hover:bg-neutral-100 hover:text-secondary hover:border-neutral-300"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Dynamic Grid of Services */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {filteredServices.map((service, i) => (
              <Link 
                key={service.slug}
                href={`/services/${service.slug}`}
                className="bg-white border border-neutral-200/70 rounded-xl hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.06)] hover:border-primary/20 transition-all duration-500 group overflow-hidden flex flex-col justify-between shadow-soft animate-in fade-in slide-in-from-bottom-6 duration-700"
                style={{ animationDelay: `${i * 30}ms` }}
              >
                <div>
                  {/* Thumbnail Image Container */}
                  <div className="aspect-video relative overflow-hidden bg-neutral-50 border-b border-neutral-100">
                     <Image 
                       src={service.image}
                       alt={service.title}
                       fill
                       sizes="(max-w-768px) 100vw, (max-w-1200px) 50vw, 33vw"
                       className="object-cover transition-transform duration-1000 group-hover:scale-105 grayscale group-hover:grayscale-0"
                     />
                     {/* Dynamic Dark Gradient Overlay */}
                     <div className="absolute inset-0 bg-neutral-950/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                     
                     {/* Category Mini Badge */}
                     <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-neutral-200/40 shadow-sm text-[8px] font-bold uppercase tracking-widest text-secondary opacity-90">
                       {categories.find(c => c.id === service.category)?.label.split(" ")[0]}
                     </div>
                  </div>

                  {/* Details Container */}
                  <div className="p-8 space-y-5">
                    {/* Icon Container */}
                    <div className="w-12 h-12 bg-neutral-50 text-secondary group-hover:bg-primary group-hover:text-white flex items-center justify-center rounded-lg transition-all duration-500 border border-neutral-100 group-hover:shadow-md group-hover:shadow-primary/10 group-hover:rotate-3 shrink-0 shadow-inner">
                      <service.icon size={20} strokeWidth={1.5} />
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-lg md:text-xl font-bold tracking-tight text-secondary group-hover:text-primary transition-colors duration-300 leading-tight">
                        {service.title}
                      </h3>
                      <p className="text-neutral-500 font-normal leading-relaxed text-xs md:text-sm line-clamp-3">
                        {service.desc}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer Action Tag */}
                <div className="px-8 pb-8 pt-1">
                  <div className="w-full h-[1px] bg-neutral-100 group-hover:bg-neutral-200/50 transition-colors mb-5" />
                  <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-primary transition-all duration-500 group-hover:translate-x-1">
                    Explore Detailed Solution 
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Empty state if filtered results are 0 */}
          {filteredServices.length === 0 && (
            <div className="text-center py-16 bg-neutral-50 rounded-xl border border-dashed border-neutral-200">
              <span className="text-neutral-400 font-semibold uppercase tracking-wider text-xs">No services found in this category.</span>
            </div>
          )}

        </div>
      </section>

      {/* Turnkey 4-Step Process Section */}
      <section className="py-24 bg-neutral-950 text-white relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(237,28,39,0.06)_0%,transparent_75%)] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10">
          
          {/* Process Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Sovereign Standard</span>
            <h2 className="text-3xl lg:text-5xl font-bold tracking-tight leading-tight uppercase">
              Our 4-Step <span className="text-primary">Turnkey Flow.</span>
            </h2>
            <p className="text-neutral-400 text-sm leading-relaxed max-w-xl mx-auto">
              We leverage an integrated modular production schedule to transform layouts with minimum operational disturbance.
            </p>
          </div>

          {/* Workflow Timeline Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {workflow.map((item, i) => (
              <div 
                key={i} 
                className="p-8 rounded-xl bg-white/5 border border-white/10 hover:border-primary/40 hover:bg-white/10 transition-all duration-500 group relative z-10 shadow-2xl flex flex-col justify-between min-h-[250px]"
              >
                <div className="space-y-5">
                  {/* Step Code */}
                  <div className="flex justify-between items-center">
                    <span className="text-primary font-bold text-sm tracking-widest">{item.step}</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  </div>
                  
                  {/* Step details */}
                  <div className="space-y-2.5">
                    <h3 className="text-lg md:text-xl font-bold tracking-tight text-white group-hover:text-primary transition-colors leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-neutral-400 font-normal leading-relaxed text-xs md:text-[13px]">
                      {item.desc}
                    </p>
                  </div>
                </div>

                {/* Subtle bottom check indicator */}
                <div className="pt-5 flex items-center gap-2 text-[8px] font-bold tracking-widest text-primary uppercase opacity-60 group-hover:opacity-100 transition-opacity">
                  <CheckCircle2 size={12} strokeWidth={2.5} /> Phase Standardized
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* High-Impact Call to Action Banner */}
      <section className="py-24 bg-white relative overflow-hidden border-t border-neutral-100">
        {/* Glow Overlay */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] max-w-[800px] bg-[radial-gradient(circle,rgba(237,28,39,0.06)_0%,transparent_70%)] rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10">
          <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 rounded-xl border border-neutral-800 shadow-2xl relative overflow-hidden p-8 sm:p-12 lg:p-20 group">
            
            {/* Background image subtle overlay */}
            <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-1000">
              <Image 
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2070&auto=format&fit=crop"
                alt="Luxury office interiors setup consultation"
                fill
                className="object-cover grayscale"
              />
            </div>
            
            {/* Abstract geometric mesh layout */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

            <div className="relative z-10 grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              
              {/* Left Column: Heading and info */}
              <div className="lg:col-span-7 space-y-8 text-left">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-primary/10 border border-primary/20 rounded-full">
                    <Sparkles size={12} className="text-primary animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary">
                      Corporate Consultation
                    </span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold tracking-tight leading-[1.1] text-white uppercase">
                    Ready to <br className="hidden sm:inline" />
                    start <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-rose-500 font-extrabold relative inline-block">
                      planning?
                      <span className="absolute left-0 bottom-1 w-full h-[3px] bg-gradient-to-r from-primary to-rose-500 rounded-full opacity-35" />
                    </span>
                  </h2>
                  <p className="text-neutral-300 text-sm sm:text-base leading-relaxed max-w-xl font-normal">
                    Book a complimentary corporate layout audit. Consult with our leading design specialists to optimize floor ratios and brand density.
                  </p>
                </div>

                {/* Direct info list pills */}
                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-neutral-300 backdrop-blur-md">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <Phone size={14} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-500 leading-none">Call Us</p>
                      <a href={`tel:${siteContent.common.contact.phoneRaw}`} className="text-xs font-bold text-white leading-tight hover:text-primary transition-colors truncate">
                        {siteContent.common.contact.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-neutral-300 backdrop-blur-md">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <Mail size={14} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-500 leading-none">Email Us</p>
                      <a href={`mailto:${siteContent.common.contact.email}`} className="text-xs font-bold text-white leading-tight hover:text-primary transition-colors truncate">
                        {siteContent.common.contact.email}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Actions panel */}
              <div className="lg:col-span-5 flex flex-col gap-5 w-full bg-white/5 border border-white/10 rounded-xl p-6 sm:p-8 backdrop-blur-xl">
                <h3 className="text-lg font-bold text-white tracking-tight uppercase">REQUEST WORKSPACE AUDIT</h3>
                <p className="text-xs text-neutral-400 leading-relaxed font-normal">
                  Schedule a private tour of our Kadipur manufacturing facility or receive a personalized high-fidelity 2D/3D workspace layout consultation.
                </p>

                <div className="space-y-4 pt-2">
                  <button 
                    onClick={() => setIsQuoteOpen(true)}
                    className="w-full px-8 py-4 bg-primary text-white font-extrabold rounded-xl hover:bg-white hover:text-black transition-all duration-500 shadow-[0_20px_40px_-10px_rgba(237,28,39,0.3)] tracking-[0.2em] text-[10px] uppercase flex items-center justify-center gap-3 cursor-pointer active:scale-98 group"
                  >
                    <span>Request Workspace Audit</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>

                  <Link 
                    href={AppRoutes.Public.Contact} 
                    className="w-full px-8 py-4 bg-white/5 border border-white/15 text-white font-extrabold rounded-xl hover:bg-white/20 transition-all duration-500 tracking-[0.2em] text-[10px] uppercase flex items-center justify-center gap-2 cursor-pointer active:scale-98 text-center"
                  >
                    Contact Specialist
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Quote request popup */}
      <QuoteModal isOpen={isQuoteOpen} onClose={() => setIsQuoteOpen(false)} />
    </main>
  );
}
