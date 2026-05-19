"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
  ArrowRight, 
  Layout, 
  Maximize, 
  ShieldCheck, 
  Palette,
  Compass,
  Hammer,
  Sparkles
} from "lucide-react";
import categoriesData from "@/data/categories.json";
import QuoteModal from "@/components/common/QuoteModal";

interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
}

export default function DynamicServicePage() {
  const params = useParams();
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  
  const slug = params?.slug as string;
  const serviceDetail = (categoriesData as ServiceCategory[]).find(c => c.slug === slug);

  // Fallback to main services directory if the slug is invalid
  if (!serviceDetail) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center space-y-6">
        <h2 className="text-2xl font-bold text-secondary">Service layout not found</h2>
        <Link href="/services" className="px-6 py-3 bg-primary text-white rounded-xl font-bold">
          Back to Services
        </Link>
      </div>
    );
  }

  const serviceName = serviceDetail.name;
  const serviceDescription = serviceDetail.description || "Complete space planning, 3D corporate interior blueprints, and end-to-end office setup execution.";
  const serviceImage = serviceDetail.image || "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2070&auto=format&fit=crop";

  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="relative h-[45vh] flex items-center justify-center overflow-hidden bg-neutral-900">
        <Image 
          src={serviceImage}
          alt={serviceName}
          fill
          priority
          className="object-cover opacity-40 grayscale-[10%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />
        
        <div className="relative z-10 text-center space-y-8 max-w-5xl px-6">
          <div className="inline-flex items-center gap-3 px-6 py-2 bg-primary/10 backdrop-blur-md border border-primary/20 rounded-full animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Sparkles size={14} className="text-primary" />
            <span className="text-[10px] font-black tracking-[0.4em] text-white uppercase">Service Excellence</span>
          </div>
          <h1 className="text-3xl lg:text-5xl font-bold text-white leading-tight tracking-tight animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            {serviceName.split(" ").map((word, idx) => (
              <span key={idx}>
                {idx === serviceName.split(" ").length - 1 ? (
                  <span className="text-primary">{word}</span>
                ) : (
                  word + " "
                )}
              </span>
            ))}
          </h1>
          <p className="text-base lg:text-lg text-gray-300 max-w-xl mx-auto leading-relaxed font-normal animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
            {serviceDescription}
          </p>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-16 lg:py-24 bg-neutral-50/50 overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-24 lg:gap-32 items-stretch">
            <div className="space-y-8">
              <div className="space-y-6">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Design Philosophy</span>
                <h2 className="text-2xl lg:text-4xl font-bold text-secondary tracking-tight leading-tight">
                  Think to design <span className="text-primary">beyond.</span>
                </h2>
              </div>
              <p className="text-base text-neutral-600 leading-relaxed font-normal">
                We believe that every interior structure is a functional tool for your workflow. Our bespoke design and execution processes are engineered to enhance brand identity, optimize workspace density, and deliver absolute premium quality.
              </p>
              <div className="grid sm:grid-cols-2 gap-8">
                {[
                  { icon: Maximize, title: "Space Optimization", desc: "Maximizing structural utility without compromising visual flow." },
                  { icon: Palette, title: "Modern Aesthetics", desc: "Curating high-end materials that inspire corporate confidence." },
                  { icon: ShieldCheck, title: "Turnkey Accountability", desc: "Supervising every stage from initial grid plans to final execution." },
                  { icon: Layout, title: "Future Scalability", desc: "Tailoring designs that naturally adapt to your organizational growth." }
                ].map((item, i) => (
                  <div key={i} className="p-6 rounded-[24px] bg-white border border-neutral-200 shadow-xl shadow-neutral-900/[0.03] hover:border-primary/40 hover:shadow-2xl hover:shadow-neutral-900/[0.06] transition-all duration-500 group">
                    <div className="w-12 h-12 bg-neutral-50 rounded-xl flex items-center justify-center text-primary border border-neutral-200 group-hover:bg-primary group-hover:text-white transition-all duration-500 mb-4">
                      <item.icon size={22} />
                    </div>
                    <h4 className="font-bold text-secondary text-lg mb-2 tracking-tight">{item.title}</h4>
                    <p className="text-[13px] text-neutral-500 leading-relaxed font-medium">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative h-full min-h-[600px] rounded-[48px] overflow-hidden shadow-2xl shadow-neutral-200 border border-neutral-100/50">
              <Image 
                src={serviceImage}
                alt={`${serviceName} Design Preview`}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 lg:py-24 bg-neutral-950 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -mr-96 -mt-96 pointer-events-none" />
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6 mb-20">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Execution Strategy</span>
            <h2 className="text-2xl lg:text-4xl font-bold tracking-tight">Our <span className="text-primary">Workflow.</span></h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-10 relative">
            {[
              { icon: Compass, step: "01", title: "Strategic Planning", desc: "Detailed structural mapping and aesthetic brief analysis." },
              { icon: Layout, step: "02", title: "Creative CAD Blueprints", desc: "Crafting customized material profiles and 3D architectural grids." },
              { icon: Hammer, step: "03", title: "Precision Buildout", desc: "Seamless project execution and certified delivery with zero defects." }
            ].map((item, i) => (
              <div key={i} className="p-8 rounded-[32px] bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-white/10 transition-all duration-500 group relative z-10 shadow-2xl shadow-black/20">
                <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 mb-8">
                  <item.icon size={28} />
                </div>
                <div className="space-y-4">
                  <span className="text-primary font-black text-sm tracking-widest">{item.step}</span>
                  <h3 className="text-2xl font-bold tracking-tight">{item.title}</h3>
                  <p className="text-gray-400 font-medium leading-relaxed text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="bg-neutral-50 rounded-[64px] p-12 lg:p-24 flex flex-col items-center text-center space-y-10 border border-neutral-100 shadow-premium">
            <div className="space-y-6">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Start Your Transformation</span>
              <h2 className="text-3xl lg:text-5xl font-bold text-secondary tracking-tight">
                Ready to elevate your <br />
                <span className="text-primary">{serviceName}?</span>
              </h2>
              <p className="text-gray-500 text-base lg:text-lg font-normal max-w-xl mx-auto">
                Consult with our expert space decorators today and receive a detailed spatial layout audit.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-6">
               <button 
                onClick={() => setIsQuoteOpen(true)}
                className="px-12 py-6 bg-primary text-white font-black uppercase tracking-[0.2em] text-[11px] rounded-2xl hover:bg-secondary transition-all duration-500 shadow-2xl shadow-primary/20 flex items-center gap-4 cursor-pointer"
               >
                 Get A Free Quote
                 <ArrowRight size={16} />
               </button>
               <Link 
                href="tel:+911242305657"
                className="px-12 py-6 bg-white text-secondary border-2 border-secondary/10 font-black uppercase tracking-[0.2em] text-[11px] rounded-2xl hover:border-primary transition-all duration-500 flex items-center justify-center gap-4"
               >
                 Call Us Now
               </Link>
            </div>
          </div>
        </div>
      </section>
      <QuoteModal isOpen={isQuoteOpen} onClose={() => setIsQuoteOpen(false)} />
    </main>
  );
}
