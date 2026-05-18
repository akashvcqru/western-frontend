"use client";

import React from "react";
import HeroSection from "@/components/sections/home/HeroSection";
import BrandSlider from "@/components/sections/BrandSlider";
import AboutSection from "@/components/sections/home/AboutSection";
import CategorySection from "@/components/sections/home/CategorySection";
import SpaceSection from "@/components/sections/home/SpaceSection";
import FootprintSection from "@/components/sections/home/FootprintSection";
import TestimonialsSection from "@/components/sections/home/TestimonialsSection";
import CtaSection from "@/components/sections/home/CtaSection";
import QuoteModal from "@/components/common/QuoteModal";

export default function Home() {
  const [isQuoteOpen, setIsQuoteOpen] = React.useState(false);

  return (
    <div className="bg-white">
      {/* 1. Cinematic Hero Section */}
      <HeroSection onOpenQuote={() => setIsQuoteOpen(true)} />

      {/* 2. Seamless Global Partnerships Marquee */}
      <BrandSlider />

      {/* 3. Premium About Us Section */}
      <AboutSection />

      {/* 4. Shop by Category Section */}
      <CategorySection />

      {/* 5. Shop by Space Section */}
      <SpaceSection />

      {/* 6. Pan-India Footprint & Manufacturing Excellence */}
      <FootprintSection />

      {/* 7. Client Testimonials Section */}
      <TestimonialsSection />

      {/* 8. High-Impact CTA Banner */}
      <CtaSection onOpenQuote={() => setIsQuoteOpen(true)} />



      {/* Centered, Premium Quote Request Modal */}
      <QuoteModal isOpen={isQuoteOpen} onClose={() => setIsQuoteOpen(false)} />
    </div>
  );
}
