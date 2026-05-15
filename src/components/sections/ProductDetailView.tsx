"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Phone, 
  FileText, 
  CheckCircle2, 
  ShieldCheck, 
  Droplets,
  ArrowRight,
  Maximize2,
  Sparkles,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import ImagePreview from "@/components/ui/ImagePreview";
import siteContent from "@/data/site-content.json";
import QuoteModal from "@/components/common/QuoteModal";

interface ProductDetailViewProps {
  product: any;
}

export default function ProductDetailView({ product }: ProductDetailViewProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>(
    (product.variants || []).reduce((acc: any, v: any) => ({ ...acc, [v.label]: v.options[0] }), {})
  );
  const [isExpanded, setIsExpanded] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  const contact = siteContent.common.contact;
  
  const handleGetQuote = () => {
    setIsQuoteModalOpen(true);
  };



  return (
    <>
      <div className="bg-white min-h-screen">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-24">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Left: Image Gallery */}
            <div className="space-y-6">
              <div className="relative aspect-[4/3] bg-neutral-50 rounded-2xl overflow-hidden border border-neutral-100 group">
                <Image 
                  src={product.images[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <button 
                  onClick={() => setIsExpanded(true)}
                  className="absolute bottom-6 right-6 p-4 bg-white/90 backdrop-blur-md shadow-premium rounded-2xl text-secondary hover:text-primary hover:bg-white transition-all duration-500 transform hover:scale-110 active:scale-95 group/btn cursor-pointer"
                >
                  <Maximize2 size={24} className="transition-transform duration-500 group-hover/btn:rotate-12" />
                </button>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img: string, i: number) => (
                  <button 
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={cn(
                      "relative aspect-square rounded-xl overflow-hidden border-2 transition-all",
                      selectedImage === i ? "border-primary" : "border-transparent bg-neutral-50 hover:border-neutral-200"
                    )}
                  >
                    <Image src={img} alt={`${product.name} ${i}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Product Details */}
            <div className="space-y-10">
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-4">
                    <span className="px-4 py-1.5 bg-primary/10 text-primary text-[11px] font-black uppercase tracking-[0.2em] rounded-full">
                      Western Interio
                    </span>
                    <span className="text-neutral-300 text-xs">|</span>
                    <span className="text-neutral-500 text-[11px] font-bold uppercase tracking-[0.2em]">
                      ID: {product.id.toUpperCase()}
                    </span>
                  </div>
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold text-secondary leading-tight">
                  {product.name}
                </h1>
                <div className="flex flex-col gap-1">
                  <p className="text-3xl font-black text-primary">
                    {product.price === "Price on Request" || !product.price ? "Price on Request" : `₹${product.price}`}
                  </p>
                </div>
                <p className="text-neutral-500 leading-relaxed text-lg">
                  {product.description}
                </p>

                {/* Trust Bar */}
                <div className="flex items-center gap-8 py-6 border-y border-neutral-100">
                  <div className="flex items-center gap-3">
                    <ShieldCheck size={20} className="text-primary shrink-0" />
                    <span className="text-xs font-black uppercase tracking-[0.15em] text-secondary">Premium Quality</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={20} className="text-primary shrink-0" />
                    <span className="text-xs font-black uppercase tracking-[0.15em] text-secondary">Manufacturer Direct</span>
                  </div>
                </div>
              </div>

              {/* Variants */}
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-8 py-8 border-y border-neutral-100">
                  {product.variants.map((variant: any) => (
                    <div key={variant.label} className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-secondary/40">Select {variant.label}</h4>
                        <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{selectedVariants[variant.label]}</span>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {variant.options.map((option: string) => (
                          <button 
                            key={option}
                            onClick={() => setSelectedVariants(prev => ({ ...prev, [variant.label]: option }))}
                            className={cn(
                              "px-8 py-4 rounded-xl text-xs font-black uppercase tracking-widest border-2 transition-all duration-500 cursor-pointer",
                              selectedVariants[variant.label] === option 
                                ? "bg-secondary text-white border-secondary shadow-xl scale-105" 
                                : "bg-white text-neutral-400 border-neutral-100 hover:border-primary/50 hover:text-secondary hover:bg-primary/5"
                            )}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Specs */}
              {product.specifications && product.specifications.length > 0 && (
                <div className="grid grid-cols-2 gap-y-6 gap-x-12">
                  {product.specifications.map((spec: any) => (
                    <div key={spec.label} className="space-y-1">
                      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{spec.label}</p>
                      <p className="text-sm font-bold text-secondary uppercase tracking-tight">{spec.value}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* CTAs */}
              <div className="grid sm:grid-cols-2 gap-4 pt-4">
                <button 
                  className="w-full inline-flex items-center justify-center gap-3 px-10 py-6 bg-primary text-white font-extrabold uppercase tracking-[0.15em] text-[12px] rounded-lg transition-all duration-500 hover:bg-secondary hover:-translate-y-1 shadow-xl shadow-primary/20 hover:shadow-secondary/20 cursor-pointer active:scale-95"
                  onClick={handleGetQuote}
                >
                  <FileText size={18} />
                  Get A Quote
                </button>
                <button 
                  className="inline-flex items-center justify-center gap-3 px-7 py-6 bg-primary text-white font-extrabold uppercase tracking-[0.15em] text-[11px] rounded-lg transition-all duration-500 hover:bg-secondary hover:-translate-y-1 shadow-xl shadow-primary/20 hover:shadow-secondary/20 cursor-pointer active:scale-95"
                  onClick={() => window.location.href = `tel:${contact.phone}`}
                >
                  <Phone size={16} />
                  Call Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Commitment Section */}
      <section className="py-24 bg-secondary text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 translate-x-1/2" />
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8 relative z-10 text-center space-y-16">
          <div className="space-y-4">
            <span className="text-primary font-black uppercase tracking-[0.3em] text-[10px]">The Western Commitment</span>
            <h2 className="text-4xl lg:text-5xl font-bold leading-tight tracking-tight">Workspace <span className="text-primary">Excellence.</span></h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            <div className="p-10 lg:p-12 bg-white/[0.03] border border-white/10 rounded-[32px] space-y-8 group hover:bg-white/[0.05] hover:border-primary/30 transition-all duration-500 hover:-translate-y-2">
               <div className="w-20 h-20 mx-auto bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                 <ShieldCheck size={32} />
               </div>
               <div className="space-y-4">
                 <h3 className="text-xl lg:text-2xl font-bold tracking-tight">Authentic Quality</h3>
                 <p className="text-gray-400 text-sm lg:text-base leading-relaxed">High-grade materials and ergonomic engineering for lasting comfort.</p>
               </div>
            </div>
 
            <div className="p-10 lg:p-12 bg-white/[0.03] border border-white/10 rounded-[32px] space-y-8 group hover:bg-white/[0.05] hover:border-primary/30 transition-all duration-500 hover:-translate-y-2">
               <div className="w-20 h-20 mx-auto bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                 <Maximize2 size={32} />
               </div>
               <div className="space-y-4">
                 <h3 className="text-xl lg:text-2xl font-bold tracking-tight">Custom Planning</h3>
                 <p className="text-gray-400 text-sm lg:text-base leading-relaxed">Tailored workspace solutions from planning to manufacturing.</p>
               </div>
            </div>
 
            <div className="p-10 lg:p-12 bg-white/[0.03] border border-white/10 rounded-[32px] space-y-8 group hover:bg-white/[0.05] hover:border-primary/30 transition-all duration-500 hover:-translate-y-2">
               <div className="w-20 h-20 mx-auto bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                 <CheckCircle2 size={32} />
               </div>
               <div className="space-y-4">
                 <h3 className="text-xl lg:text-2xl font-bold tracking-tight">End-to-End</h3>
                 <p className="text-gray-400 text-sm lg:text-base leading-relaxed">Turnkey interior execution with zero-defect delivery.</p>
               </div>
            </div>
          </div>
        </div>
      </section>

    {/* Full Screen Image Preview */}
    <ImagePreview 
      isOpen={isExpanded} 
      images={product.images.map((url: string) => ({ url, title: product.name }))}
      index={selectedImage}
      onClose={() => setIsExpanded(false)}
      onNext={() => setSelectedImage((prev) => (prev + 1) % product.images.length)}
      onPrev={() => setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length)}
    />

    <QuoteModal 
      isOpen={isQuoteModalOpen}
      onClose={() => setIsQuoteModalOpen(false)}
    />
    </>
  );
}
