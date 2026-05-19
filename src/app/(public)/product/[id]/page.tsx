"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Phone, 
  MessageSquare, 
  FileText, 
  CheckCircle2, 
  ShieldCheck, 
  Droplets,
  ArrowRight,
  ArrowUpRight,
  Maximize2
} from "lucide-react";
import { cn } from "@/lib/utils";
import ImagePreview from "@/components/ui/ImagePreview";


import { useParams, notFound } from "next/navigation";
import productsData from "@/data/products.json";

interface Product {
  id: string;
  name: string;
  category: string;
  images: string[];
  slug: string;
  price: string;
  description: string;
  brand?: string;
  catNo?: string;
  mrp?: string;
  variants?: Array<{ label: string; options: string[] }>;
  specifications?: Array<{ label: string; value: string }>;
  features?: Array<{ title: string; desc: string }>;
}

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;
  
  const product = productsData.find(p => p.id === id || p.slug === id) as Product | undefined;

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>(() => {
    if (!product) return {};
    return product.variants?.reduce((acc, v) => ({ ...acc, [v.label]: v.options[0] }), {} as Record<string, string>) || {};
  });
  const [isExpanded, setIsExpanded] = useState(false);

  if (!product) {
    notFound();
    return null;
  }

  const handleWhatsApp = () => {
    const phone = "917837737373";
    const message = `Hi, I'm interested in learning more about the product: ${product.name}.`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");
  };

  const handleCall = () => {
    window.location.href = "tel:+917837737373";
  };

  return (
    <main className="bg-white min-h-screen pt-32 lg:pt-48 pb-32">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-20 lg:gap-32 items-start">
          {/* Left: Image Gallery - Premium Presentation */}
          <div className="space-y-10 sticky top-48">
            <div className="relative aspect-square bg-neutral-50 rounded-[48px] overflow-hidden border border-neutral-100 group shadow-[0_20px_60px_-15px_rgba(0,0,0,0.03)] transition-all duration-700 hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)]">
              <Image 
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-contain p-16 lg:p-24 transition-transform duration-1000 group-hover:scale-105"
              />
              <button 
                onClick={() => setIsExpanded(true)}
                className="absolute top-8 right-8 p-4 bg-white/80 backdrop-blur-xl shadow-2xl rounded-2xl text-neutral-400 hover:text-primary hover:scale-110 transition-all cursor-pointer active:scale-90"
              >
                <Maximize2 size={24} />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-6">
              {product.images.map((img, i) => (
                <button 
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={cn(
                    "relative aspect-square rounded-3xl overflow-hidden border-2 transition-all duration-500 active:scale-95",
                    selectedImage === i 
                      ? "border-primary shadow-xl shadow-primary/10 scale-105" 
                      : "border-neutral-100 bg-neutral-50 hover:border-primary/30"
                  )}
                >
                  <Image src={img} alt={`${product.name} ${i}`} fill className="object-contain p-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Details - High End Typography */}
          <div className="space-y-16">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="px-5 py-2 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.3em] rounded-full border border-primary/20">
                    {product.brand || "Western Interio"}
                  </span>
                  <span className="w-1 h-1 bg-neutral-200 rounded-full"></span>
                  <span className="text-neutral-400 text-[10px] font-black uppercase tracking-[0.3em]">
                    {product.catNo ? `Model: ${product.catNo}` : `SKU: ${product.id.slice(0, 8).toUpperCase()}`}
                  </span>
                </div>
                
                <h1 className="text-3xl lg:text-5xl font-bold text-secondary leading-tight tracking-tight">
                  {product.name}
                </h1>

                {/* Path Display */}
                <div className="text-[10px] font-black text-neutral-300 uppercase tracking-[0.4em] pt-2">
                  {[
                    product.category?.replace(/-/g, " "),
                    product.name
                  ].filter(Boolean).map((s: string) => s.toUpperCase()).join(" / ")}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-6">
                  <p className="text-4xl font-bold text-primary tracking-tighter">
                    {product.price === "Price on Request" ? product.price : `₹${product.price}`}
                  </p>
                  {product.mrp && product.price !== "Price on Request" && (
                    <p className="text-xl text-neutral-300 line-through font-medium">₹{product.mrp}</p>
                  )}
                </div>
                {product.mrp && product.price !== "Price on Request" && (
                  <span className="inline-flex items-center px-3 py-1 bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-widest rounded-md w-fit">
                    Exclusive {Math.round(((parseFloat(product.mrp.replace(/,/g, '')) - parseFloat(product.price.replace(/,/g, ''))) / parseFloat(product.mrp.replace(/,/g, ''))) * 100)}% Discount
                  </span>
                )}
              </div>

              <p className="text-neutral-500 leading-relaxed text-base font-normal max-w-xl">
                {product.description}
              </p>
            </div>

            {/* Variants - Modern Selection */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-10 py-12 border-y border-neutral-100">
                {product.variants.map((variant) => (
                  <div key={variant.label} className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-400">Select {variant.label}</h4>
                      <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] bg-primary/5 px-3 py-1 rounded-lg">{selectedVariants[variant.label]}</span>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      {variant.options.map((option) => (
                        <button 
                          key={option}
                          onClick={() => setSelectedVariants(prev => ({ ...prev, [variant.label]: option }))}
                          className={cn(
                            "px-10 py-5 rounded-2xl text-[11px] font-bold uppercase tracking-[0.2em] border-2 transition-all duration-500 active:scale-95",
                            selectedVariants[variant.label] === option 
                              ? "bg-secondary text-white border-secondary shadow-2xl shadow-secondary/20 scale-105" 
                              : "bg-white text-neutral-400 border-neutral-100 hover:border-primary/20 hover:text-secondary"
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

            {/* Specs - Minimalist Grid */}
            {product.specifications && (
              <div className="grid grid-cols-2 gap-12">
                {product.specifications.map((spec) => (
                  <div key={spec.label} className="space-y-2 group">
                    <p className="text-[10px] font-black text-neutral-300 uppercase tracking-[0.4em] group-hover:text-primary transition-colors">{spec.label}</p>
                    <p className="text-xl font-bold text-secondary tracking-tight">{spec.value}</p>
                  </div>
                ))}
              </div>
            )}

            {/* CTAs - World Class Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 pt-10">
              <button className="flex-1 inline-flex items-center justify-center gap-4 px-12 py-7 bg-primary text-white font-bold uppercase tracking-[0.2em] text-[11px] rounded-2xl transition-all duration-500 hover:bg-secondary shadow-2xl shadow-primary/20 hover:shadow-secondary/30 cursor-pointer active:scale-[0.98] group">
                <FileText size={18} />
                Get Expert Quote
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <div className="flex gap-4">
                <button 
                  className="w-20 h-20 flex items-center justify-center bg-neutral-50 text-secondary rounded-2xl transition-all duration-500 hover:bg-green-500 hover:text-white hover:shadow-2xl hover:shadow-green-500/20 cursor-pointer active:scale-90"
                  onClick={handleWhatsApp}
                >
                  <MessageSquare size={24} />
                </button>
                <button 
                  className="w-20 h-20 flex items-center justify-center bg-neutral-50 text-secondary rounded-2xl transition-all duration-500 hover:bg-secondary hover:text-white hover:shadow-2xl hover:shadow-secondary/20 cursor-pointer active:scale-90"
                  onClick={handleCall}
                >
                  <Phone size={24} />
                </button>
              </div>
            </div>

            {/* Features - Premium Icons */}
            {product.features && (
              <div className="grid grid-cols-3 gap-10 pt-16 border-t border-neutral-100">
                {product.features.map((feature, i: number) => {
                  const IconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
                    "Water Saving": Droplets,
                    "Easy Clean": CheckCircle2,
                    "Durable": ShieldCheck,
                  };
                  const FeatureIcon = IconMap[feature.title] || CheckCircle2;
                  
                  return (
                    <div key={i} className="flex flex-col items-center text-center space-y-4 group">
                      <div className="w-16 h-16 flex items-center justify-center bg-neutral-50 text-primary rounded-3xl group-hover:scale-110 transition-transform duration-500 shadow-sm">
                        <FeatureIcon size={24} />
                      </div>
                      <div className="space-y-1">
                        <h5 className="text-[11px] font-black uppercase tracking-[0.1em] text-secondary">{feature.title}</h5>
                        <p className="text-[9px] text-neutral-400 uppercase font-black tracking-[0.2em]"> {feature.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Related Products - Premium Grid */}
        <section className="mt-48 pt-32 border-t border-neutral-100">
          <div className="flex items-end justify-between mb-20">
            <div className="space-y-4">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Recommendations</span>
              <h2 className="text-3xl lg:text-5xl font-bold text-secondary tracking-tight">Related <span className="text-primary">Items.</span></h2>
            </div>
            <Link href="/products" className="group flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] hover:text-primary transition-all">
              View All Collection
              <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform text-primary" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {["Camper", "Clayton", "Perla", "Aura"].map((name, i) => (
              <div key={i} className="group bg-neutral-50 rounded-[48px] overflow-hidden border border-neutral-100 p-10 space-y-6 hover:bg-white hover:shadow-2xl transition-all duration-700 cursor-pointer">
                <div className="relative aspect-square">
                  <Image src={product.images[0]} alt={name} fill className="object-contain p-6 group-hover:scale-110 transition-all duration-1000" />
                </div>
                <div className="space-y-3">
                  <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">{product.brand || "Western Interio"}</span>
                  <h3 className="text-xl font-bold text-secondary tracking-tight group-hover:text-primary transition-colors">{name}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <ImagePreview 
        isOpen={isExpanded} 
        images={product.images.map((url: string) => ({ url, title: product.name }))}
        index={selectedImage}
        onClose={() => setIsExpanded(false)}
        onNext={() => setSelectedImage((prev) => (prev + 1) % product.images.length)}
        onPrev={() => setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length)}
      />
    </main>
  );
}
