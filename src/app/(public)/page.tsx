"use client";

import React from "react";
import HeroSection from "@/components/sections/home/HeroSection";
import AboutSection from "@/components/sections/home/AboutSection";
import CategorySection from "@/components/sections/home/CategorySection";
import SpaceSection from "@/components/sections/home/SpaceSection";
import TestimonialsSection from "@/components/sections/home/TestimonialsSection";
import CtaSection from "@/components/sections/home/CtaSection";
import FootprintSection from "@/components/sections/home/FootprintSection";
import ContactInfoSection from "@/components/sections/home/ContactInfoSection";
import QuoteModal from "@/components/common/QuoteModal";

export default function Home() {
  const [isQuoteOpen, setIsQuoteOpen] = React.useState(false);

  return (
    <div className="bg-white">
      {/* 1. Cinematic Hero Section */}
      <HeroSection onOpenQuote={() => setIsQuoteOpen(true)} />

      {/* 2. Premium About Us Section */}
      <AboutSection />

      {/* 3. Shop by Category Section */}
      <CategorySection />

      {/* 4. Shop by Space Section */}
      <SpaceSection />

      {/* 5. Client Testimonials Section */}
      <TestimonialsSection />

      {/* 6. High-Impact CTA Banner */}
      <CtaSection onOpenQuote={() => setIsQuoteOpen(true)} />

      {/* 7. Pan India Presence */}
      <FootprintSection />

      {/* 8. Corporate Contact Information */}
      <ContactInfoSection />

      {/* Centered, Premium Quote Request Modal */}
      <QuoteModal isOpen={isQuoteOpen} onClose={() => setIsQuoteOpen(false)} />
    </div>
  );
}
