"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowRight, 
  CheckCircle2, 
  Layout, 
  PenTool, 
  Layers, 
  Maximize, 
  Settings, 
  ShieldCheck 
} from "lucide-react";
import QuoteModal from "@/components/common/QuoteModal";
import { AppRoutes } from "@/constants/routes";
import { PageHeader } from "@/components/ui";

export default function ServicesPage() {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);

  const services = [
    {
      title: "Workspace Planning",
      desc: "Comprehensive space analysis and CAD layouts to maximize your office efficiency and employee flow.",
      icon: Layout,
      image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2070&auto=format&fit=crop"
    },
    {
      title: "Modular Furniture Design",
      desc: "Custom-engineered workstations and cabin furniture tailored to your brand's aesthetic and functional needs.",
      icon: PenTool,
      image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop"
    },
    {
      title: "Turnkey Office Setup",
      desc: "End-to-end execution including false ceiling, flooring, electrical, and HVAC solutions for a ready-to-move office.",
      icon: Layers,
      image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=2070&auto=format&fit=crop"
    },
    {
      title: "Interior Refurbishment",
      desc: "Modernizing existing office spaces with minimal disruption to your daily business operations.",
      icon: Maximize,
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2070&auto=format&fit=crop"
    },
    {
      title: "Acoustic Solutions",
      desc: "Specialized soundproofing and acoustic treatments to create quiet zones and productive meeting environments.",
      icon: Settings,
      image: "https://images.unsplash.com/photo-1503387762-592dee58c460?q=80&w=2070&auto=format&fit=crop"
    },
    {
      title: "Project Management",
      desc: "Dedicated supervision to ensure your office project is delivered on time, within budget, and with zero defects.",
      icon: ShieldCheck,
      image: "https://images.unsplash.com/photo-1517502884422-41eaead166d4?q=80&w=2070&auto=format&fit=crop"
    }
  ];

  return (
    <main className="bg-white">
      {/* Hero Section */}
      <PageHeader
        bgImage="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2070&auto=format&fit=crop"
        badgeText="Our Solutions"
        titlePrefix="Elevating"
        titleHighlight="Workspaces."
        subtitle="From strategic planning to flawless execution, we provide comprehensive interior solutions that transform your office into a high-performance environment."
      />

      {/* Services Grid - Turnkey Expertise */}
      <section className="py-12 lg:py-16 bg-neutral-50/50 relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-24 lg:gap-32 items-stretch mb-32">
            <div className="space-y-8">
              <div className="space-y-6">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Capabilities</span>
                <h2 className="text-3xl lg:text-6xl font-bold text-secondary leading-tight tracking-tight">
                  Complete <span className="text-primary">Turnkey Expertise.</span>
                </h2>
              </div>
              <p className="text-base text-gray-500 leading-relaxed max-w-xl font-normal">
                We handle every aspect of your office interior project, allowing you to focus on what you do best—running your business. Our end-to-end approach ensures consistency, quality, and accountability.
              </p>
              <div className="grid sm:grid-cols-2 gap-6 pt-4">
                {["False Ceiling & Lighting", "Flooring & Carpeting", "Painting & Wall Finishes", "Glass Partitions & Blinds"].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 text-secondary font-bold tracking-tight text-lg">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <CheckCircle2 className="text-primary" size={14} />
                    </div>
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="relative group h-full min-h-[500px] rounded-[48px] overflow-hidden shadow-2xl shadow-neutral-200 border border-neutral-100">
              <Image 
                src="https://images.unsplash.com/photo-1497215842964-222b430dc094?q=80&w=2070&auto=format&fit=crop"
                alt="Turnkey Office"
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {services.map((service, i) => (
              <div key={i} className="bg-white border border-neutral-200 rounded-[32px] hover:shadow-2xl hover:shadow-neutral-950/5 transition-all duration-700 group overflow-hidden shadow-xl shadow-neutral-950/[0.02]">
                <div className="aspect-video relative overflow-hidden">
                   <Image 
                     src={service.image}
                     alt={service.title}
                     fill
                     className="object-cover transition-transform duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0"
                   />
                   <div className="absolute inset-0 bg-neutral-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                </div>
                <div className="p-8 space-y-6">
                  <div className="w-14 h-14 bg-neutral-50 text-secondary group-hover:bg-primary group-hover:text-white flex items-center justify-center rounded-2xl transition-all duration-500 border border-neutral-100 group-hover:shadow-primary/20 group-hover:rotate-6">
                    <service.icon size={24} strokeWidth={1.5} />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold tracking-tight group-hover:text-primary transition-colors">{service.title}</h3>
                    <p className="text-gray-500 font-medium leading-relaxed">{service.desc}</p>
                  </div>
                  <div className="pt-4 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-primary opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                    Learn More <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-12 lg:py-16 bg-neutral-950 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 z-0">
           <Image 
             src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2070&auto=format&fit=crop"
             alt="CTA Background"
             fill
             className="object-cover opacity-10 grayscale"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-neutral-950" />
        </div>
        
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10 space-y-10">
          <div className="space-y-6">
             <span className="text-[10px] font-black tracking-[0.5em] text-primary uppercase">Transform Your Office</span>
             <h2 className="text-3xl lg:text-5xl font-bold text-white leading-tight tracking-tight">
               Ready to <span className="text-primary">Start Planning?</span>
             </h2>
             <p className="text-gray-400 text-base font-normal tracking-wide max-w-xl mx-auto">Connect with our workspace designers for a free audit and layout consultation.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-8 pt-10">
             <button 
               onClick={() => setIsQuoteOpen(true)}
               className="w-full sm:w-auto px-12 py-6 bg-primary text-white font-bold rounded-2xl hover:bg-white hover:text-black transition-all duration-500 shadow-2xl shadow-primary/20 tracking-[0.2em] text-[11px] uppercase flex items-center justify-center gap-4 cursor-pointer active:scale-95 group"
             >
                Request Workspace Audit
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
             </button>
             <Link href={AppRoutes.Public.Contact} className="w-full sm:w-auto px-12 py-6 border-2 border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 hover:border-white transition-all duration-500 tracking-[0.2em] text-[11px] uppercase backdrop-blur-md">
                Contact Specialist
             </Link>
          </div>
        </div>
      </section>
      <QuoteModal isOpen={isQuoteOpen} onClose={() => setIsQuoteOpen(false)} />
    </main>
  );
}
