"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface CtaSectionProps {
  onOpenQuote: () => void;
}

export default function CtaSection({ onOpenQuote }: CtaSectionProps) {
  return (
    <section className="py-24 lg:py-32 bg-neutral-950 text-white relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image 
          src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop"
          alt="Corporate Environment background"
          fill
          className="object-cover opacity-45 grayscale scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent" />
      </div>
      
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10">
        <div className="max-w-3xl space-y-6">
          <span className="text-primary font-extrabold uppercase tracking-[0.2em] text-xs">Transform Your Space</span>
          <h2 className="text-3xl lg:text-5xl font-bold tracking-tight leading-tight">
            Ready to Craft <br />Your <span className="text-primary">Masterpiece?</span>
          </h2>
          <p className="text-gray-400 text-base lg:text-lg font-normal leading-relaxed">
            Whether you are designing a high-end corporate office or upgrading premium material finishes, our consultants are here to bring your vision to life.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
            <button 
              onClick={onOpenQuote}
              className="w-full sm:w-auto px-10 py-4 bg-primary text-white font-bold tracking-[0.2em] text-[11px] uppercase rounded-lg hover:bg-white hover:text-black transition-all duration-500 shadow-xl shadow-primary/10 active:scale-95 flex items-center justify-center gap-3 group cursor-pointer"
            >
              Get A Premium Quote
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <Link 
              href="/contact"
              className="w-full sm:w-auto px-10 py-4 bg-white/5 backdrop-blur-xl border border-white/20 text-white font-bold tracking-[0.2em] text-[11px] uppercase rounded-lg hover:bg-white hover:text-black transition-all duration-500 text-center active:scale-95"
            >
              Contact Our Experts
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
