"use client";

import React, { useState, useEffect } from "react";
import { Quote, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useGetTestimonialsQuery } from "@/redux/api/testimonialsApi";

interface Testimonial {
  author: string;
  designation: string;
  company: string;
  quote: string;
  rating: number;
  category?: string;
  image?: string;
}

export default function TestimonialsSection() {
  const { data: testimonialsResult } = useGetTestimonialsQuery();

  const testimonials = React.useMemo(() => {
    return testimonialsResult?.data || [];
  }, [testimonialsResult]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleSlides, setVisibleSlides] = useState(3);
  const [isTransitioning, setIsTransitioning] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setVisibleSlides(1);
      } else if (window.innerWidth < 1024) {
        setVisibleSlides(2);
      } else {
        setVisibleSlides(3);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isInfinite = testimonials.length > visibleSlides;

  useEffect(() => {
    if (isInfinite) {
      setCurrentIndex(visibleSlides);
    } else {
      setCurrentIndex(0);
    }
  }, [isInfinite, visibleSlides]);

  const extendedTestimonials = React.useMemo(() => {
    if (!isInfinite || testimonials.length === 0) return testimonials;
    const before = testimonials.slice(-visibleSlides);
    const after = testimonials.slice(0, visibleSlides);
    return [...before, ...testimonials, ...after];
  }, [testimonials, isInfinite, visibleSlides]);

  const nextSlide = () => {
    if (!isInfinite) return;
    setCurrentIndex((prev) => prev + 1);
  };

  const prevSlide = () => {
    if (!isInfinite) return;
    setCurrentIndex((prev) => prev - 1);
  };

  useEffect(() => {
    if (!isInfinite || testimonials.length === 0) return;

    if (currentIndex >= testimonials.length + visibleSlides) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(visibleSlides);
      }, 500);
      return () => clearTimeout(timer);
    }

    if (currentIndex < visibleSlides) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(testimonials.length + currentIndex);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, testimonials.length, visibleSlides, isInfinite]);

  useEffect(() => {
    if (!isTransitioning) {
      const timer = setTimeout(() => {
        setIsTransitioning(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  useEffect(() => {
    if (!isInfinite) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [isInfinite, visibleSlides]);

  const activeDotIndex = isInfinite 
    ? (currentIndex - visibleSlides + testimonials.length) % testimonials.length 
    : currentIndex;

  const handleDotClick = (idx: number) => {
    if (isInfinite) {
      setCurrentIndex(idx + visibleSlides);
    } else {
      setCurrentIndex(idx);
    }
  };

  return (
    <section className="pt-12 pb-12 lg:pt-16 lg:pb-16 bg-neutral-50 relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shrink-0" />
            <span className="text-primary font-black tracking-[0.25em] text-[10px] uppercase">
              Client Appreciations
            </span>
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold text-secondary tracking-tight leading-tight">
            Client Testimonials.
          </h2>
        </div>
 
        {/* Carousel Container */}
        <div className="relative w-full overflow-hidden">
          <div 
            className="flex -mx-4"
            style={{
              transform: `translate3d(-${currentIndex * (100 / visibleSlides)}%, 0, 0)`,
              transition: isTransitioning ? "transform 500ms cubic-bezier(0.4, 0, 0.2, 1)" : "none"
            }}
          >
            {extendedTestimonials.map((t: Testimonial, i: number) => (
              <div 
                key={i}
                className="w-full md:w-1/2 lg:w-1/3 px-4 flex-shrink-0"
              >
                <div 
                  className="bg-white p-10 lg:p-12 rounded-[32px] border border-neutral-200 flex flex-col justify-between space-y-8 relative group hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] hover:-translate-y-2 transition-all duration-700 h-full min-h-[340px]"
                >
                  {/* Quote Icon */}
                  <div className="absolute top-10 right-10 text-primary/5 group-hover:text-primary/10 transition-colors duration-700 pointer-events-none">
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
                  <div className="pt-6 border-t border-neutral-200 flex items-center gap-4 relative z-10 shrink-0">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-neutral-900 text-white flex items-center justify-center font-extrabold shrink-0 group-hover:bg-primary transition-all duration-500 relative border border-neutral-200">
                      {t.image ? (
                        <img src={t.image} alt={t.author} className="w-full h-full object-cover rounded-full" />
                      ) : (
                        t.author.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-secondary uppercase tracking-tight text-sm leading-none">{t.author}</h4>
                      {t.designation && (
                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.1em]">{t.designation}</p>
                      )}
                      {t.company && (
                        <p className="text-[9px] font-bold text-neutral-350 uppercase tracking-widest">{t.company}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation & Progress indicators */}
        {testimonials.length > 0 && (
          <div className="flex justify-center items-center gap-6 pt-4">
            {isInfinite && (
              <button 
                onClick={prevSlide}
                className="w-12 h-12 rounded-full border border-neutral-200 bg-white text-secondary flex items-center justify-center hover:bg-primary hover:text-white hover:border-transparent transition-all duration-300 shadow-sm cursor-pointer active:scale-90"
                aria-label="Previous slide"
              >
                <ChevronLeft size={20} />
              </button>
            )}
            
            <div className="flex items-center gap-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handleDotClick(idx)}
                  className={`h-2.5 rounded-full transition-all duration-500 cursor-pointer ${
                    activeDotIndex === idx 
                      ? "w-12 bg-primary" 
                      : "w-4 bg-neutral-350 hover:bg-neutral-400"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {isInfinite && (
              <button 
                onClick={nextSlide}
                className="w-12 h-12 rounded-full border border-neutral-200 bg-white text-secondary flex items-center justify-center hover:bg-primary hover:text-white hover:border-transparent transition-all duration-300 shadow-sm cursor-pointer active:scale-90"
                aria-label="Next slide"
              >
                <ChevronRight size={20} />
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
