"use client";

import React from "react";
import { Quote, Star } from "lucide-react";
import siteContent from "@/data/site-content.json";
import { useGetTestimonialsQuery } from "@/redux/api/testimonialsApi";

interface Testimonial {
  author: string;
  designation: string;
  company: string;
  quote: string;
  rating: number;
  category?: string;
}

export default function TestimonialsSection() {
  const { data: testimonialsResult } = useGetTestimonialsQuery();

  const testimonials = React.useMemo(() => {
    return testimonialsResult?.data || [];
  }, [testimonialsResult]);

  return (
    <section className="pt-12 pb-12 lg:pt-16 lg:pb-16 bg-neutral-50 relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 space-y-16">
        <div className="text-center space-y-4">
          <span className="text-primary font-extrabold uppercase tracking-[0.2em] text-xs">
            Client Appreciations
          </span>
          <h2 className="text-3xl lg:text-5xl font-bold text-secondary tracking-tight leading-tight">
            Client Testimonials.
          </h2>
        </div>
 
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {testimonials.slice(0, 3).map((t: Testimonial, i: number) => (
            <div 
              key={i} 
              className="bg-white p-10 lg:p-12 rounded-[32px] border border-neutral-100 flex flex-col justify-between space-y-8 relative group hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] hover:-translate-y-2 transition-all duration-700 h-full"
            >
              {/* Quote Icon */}
              <div className="absolute top-10 right-10 text-primary/5 group-hover:text-primary/10 transition-colors duration-700">
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
                <p className="text-base text-secondary/90 font-normal leading-relaxed italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              {/* Author Info */}
              <div className="pt-6 border-t border-neutral-100 flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 rounded-xl bg-secondary text-white flex items-center justify-center font-black shrink-0 group-hover:bg-primary transition-all duration-500">
                  {t.author.charAt(0)}
                </div>
                <div className="space-y-0.5">
                  <h4 className="font-bold text-secondary uppercase tracking-tight text-sm leading-none">{t.author}</h4>
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.1em]">{t.designation}</p>
                  <p className="text-[9px] font-bold text-neutral-300 uppercase tracking-widest">{t.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
