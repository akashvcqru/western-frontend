"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Phone,
  Mail,
  MapPin,
  ArrowUp,
  MessageSquare,
  Camera,
  Briefcase,
  Send
} from "lucide-react";
import siteContent from "@/data/site-content.json";
import { cn } from "@/lib/utils";
import QuoteModal from "@/components/common/QuoteModal";
import { AppRoutes } from "@/constants/routes";

export default function Footer() {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const currentYear = new Date().getFullYear();
  const { common, footer } = siteContent;

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#0A0A0A] text-white pt-32 pb-16 relative overflow-hidden border-t border-white/5">
      {/* Subtle top gradient line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-30" />
      
      {/* Ambient background glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -mr-64 -mt-64 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[100px] -ml-32 -mb-32 pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 mb-24">
          {/* Brand & Address Section */}
          <div className="lg:col-span-4 space-y-8">
            <Link href={AppRoutes.Public.Home} className="flex items-center gap-4 transition-transform hover:scale-[1.02] active:scale-95 group">
              <Image 
                src="/logo-v3.png" 
                alt="Western Interio" 
                width={180} 
                height={55} 
                className="w-auto h-14 brightness-110 transition-all duration-500" 
              />
            </Link>
            
            <address className="not-italic space-y-6">
              <p className="text-gray-400 text-base font-medium leading-relaxed max-w-md">
                {footer.brandStatement.desc}
              </p>
              
              <div className="space-y-4 pt-4">
                <div className="flex items-start gap-4 text-gray-400 hover:text-white transition-colors group">
                  <MapPin size={20} className="text-primary mt-1 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium leading-relaxed">
                    {common.contact.address}
                  </span>
                </div>
                
                <div className="flex items-center gap-4 text-gray-400 hover:text-white transition-colors group">
                  <Phone size={18} className="text-primary shrink-0 group-hover:scale-110 transition-transform" />
                  <div className="flex flex-col">
                    <a href={`tel:${common.contact.phoneRaw}`} className="text-sm font-bold tracking-wider">
                      {common.contact.phone}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-gray-400 hover:text-white transition-colors group">
                  <Mail size={18} className="text-primary shrink-0 group-hover:scale-110 transition-transform" />
                  <a href={`mailto:${common.contact.email}`} className="text-sm font-medium">
                    {common.contact.email}
                  </a>
                </div>
              </div>
            </address>

            <div className="flex items-center gap-4 pt-4">
              {footer.socialLinks.map((social: any) => {
                const IconMap: any = { MessageSquare, Camera, Briefcase };
                const Icon = IconMap[social.icon] || MessageSquare;
                return (
                  <a 
                    key={social.platform} 
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Follow us on ${social.platform}`}
                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-primary hover:bg-white/10 hover:border-primary/30 transition-all duration-300 group"
                  >
                    <Icon size={16} className="group-hover:scale-110 transition-transform" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Navigation Grid */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-12">
            {/* Quick Links */}
            <nav aria-label="Company Links">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-10">Company</h4>
              <ul className="space-y-4">
                {footer.companyLinks.map((link: any) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href} 
                      className="text-[13px] font-semibold text-gray-400 hover:text-white transition-colors flex items-center group gap-2"
                    >
                      <span className="w-1.5 h-[1px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Products/Services */}
            <nav aria-label="Product Categories">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-10">Products</h4>
              <ul className="space-y-4">
                {[
                  { name: "Office Chairs", href: "/products/office-chairs" },
                  { name: "Workstations", href: "/products/desking-workstation" },
                  { name: "Office Tables", href: "/products/office-tables" },
                  { name: "Storage Solutions", href: "/products/office-storage" },
                  { name: "Modular Kitchen", href: "/products/modular-kitchen-series" }
                ].map((link: any) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href} 
                      className="text-[13px] font-semibold text-gray-400 hover:text-white transition-colors flex items-center group gap-2"
                    >
                      <span className="w-1.5 h-[1px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Newsletter Section */}
          <div className="lg:col-span-3 space-y-10">
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Newsletter</h4>
              <p className="text-gray-400 text-sm font-medium leading-relaxed">{footer.newsletter.desc}</p>
              <form className="relative group">
                <input 
                  type="email" 
                  placeholder={footer.newsletter.placeholder}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-4 px-5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 focus:bg-white/[0.05] transition-all"
                  aria-label="Email for newsletter"
                />
                <button type="submit" className="absolute right-2 top-2 bottom-2 px-6 bg-white text-black font-black text-[10px] uppercase tracking-widest rounded-lg hover:bg-primary hover:text-white transition-all cursor-pointer active:scale-95">
                  Join
                </button>
              </form>
            </div>
            
            <div className="pt-8 border-t border-white/5">
               <div className="flex items-center gap-4 text-gray-400 text-[11px] font-bold tracking-[0.1em]">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Accepting premium projects
               </div>
            </div>
          </div>
        </div>

        {/* Delivery Locations & SEO Terms */}
        <div className="py-16 border-t border-white/5 space-y-12">
          {/* Areas We Serve */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/60">Major Delivery Locations</h4>
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              {footer.deliveryLocations.map((location: string, i: number) => (
                <span key={i} className="text-[11px] font-bold text-gray-500 hover:text-primary transition-colors cursor-default uppercase tracking-wider">
                  {location}
                </span>
              ))}
            </div>
          </div>

          {/* Search Terms Tag Cloud */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/60">Services & Solutions</h4>
            <div className="flex flex-wrap gap-2.5">
              {footer.popularSearchTerms.map((term: string, i: number) => (
                <span 
                  key={i} 
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[9px] font-bold text-gray-500 tracking-widest hover:border-primary/30 hover:text-primary transition-all cursor-default uppercase"
                >
                  {term}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-bold tracking-[0.2em] text-gray-600 uppercase">
          <div className="flex items-center gap-8">
            <span>&copy; {currentYear} {footer.brandStatement.title}.</span>
            <span className="hidden md:block w-1 h-1 rounded-full bg-gray-800" />
            <Link href={footer.legal.privacyHref} className="hover:text-white transition-colors">{footer.legal.privacyPolicy}</Link>
            <Link href={footer.legal.termsHref} className="hover:text-white transition-colors">{footer.legal.termsOfService}</Link>
          </div>
          <button 
            onClick={scrollToTop}
            className={cn(
              "fixed bottom-8 right-8 z-[60] flex items-center gap-4 bg-secondary/90 backdrop-blur-xl p-2 pl-6 pr-2 rounded-full border border-white/10 shadow-2xl transition-all duration-500 group",
              isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0 pointer-events-none"
            )}
          >
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/70 group-hover:text-white transition-colors">Back to Top</span>
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
              <ArrowUp size={20} className="text-white group-hover:-translate-y-1 transition-transform duration-300" />
            </div>
          </button>
        </div>
      </div>

      <QuoteModal isOpen={isQuoteOpen} onClose={() => setIsQuoteOpen(false)} />
    </footer>
  );
}
