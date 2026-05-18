"use client";

import React from "react";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import siteContent from "@/data/site-content.json";

export default function AboutSection() {
  const { homePage } = siteContent;

  return (
    <section className="py-24 lg:py-32 bg-white overflow-hidden relative">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 translate-x-1/2 pointer-events-none" />
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-24 lg:gap-32 items-stretch">
          <div className="space-y-8 flex flex-col justify-center">
            <div className="space-y-6">
              <span className="text-primary font-extrabold uppercase tracking-[0.2em] text-xs">About Western Interio</span>
              <h2 className="text-3xl lg:text-5xl font-bold text-secondary tracking-tight leading-tight">
                Think to design <br /><span className="text-primary">beyond.</span>
              </h2>
            </div>
            <p className="text-base text-neutral-600 leading-relaxed font-normal max-w-xl">
              {homePage.whatWeAre.desc}
            </p>
            <div className="grid sm:grid-cols-2 gap-6 pt-4">
              {homePage.whatWeAre.list.map((item: string, i: number) => (
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
  );
}
