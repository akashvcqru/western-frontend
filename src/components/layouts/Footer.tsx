"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  Check,
  Copy,
} from "lucide-react";
import siteContent from "@/data/site-content.json";
import { cn } from "@/lib/utils";
import QuoteModal from "@/components/common/QuoteModal";
import { AppRoutes } from "@/constants/routes";

export default function Footer() {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const currentYear = new Date().getFullYear();
  const { common, footer } = siteContent;

  const [isMounted, setIsMounted] = useState(false);

  // Dynamic business status
  const [businessStatus, setBusinessStatus] = useState({
    open: false,
    text: "Closed Now",
  });

  // Clipboard copy feedback
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Newsletter states
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscribeStatus, setSubscribeStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  useEffect(() => {
    setIsMounted(true);

    const checkStatus = () => {
      const now = new Date();
      const day = now.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
      const hour = now.getHours();
      const minute = now.getMinutes();
      const timeInMinutes = hour * 60 + minute;

      const startMinutes = 9 * 60 + 30; // 09:30 AM
      const endMinutes = 18 * 60 + 30; // 06:30 PM

      if (
        day >= 1 &&
        day <= 6 &&
        timeInMinutes >= startMinutes &&
        timeInMinutes < endMinutes
      ) {
        setBusinessStatus({
          open: true,
          text: "Open Now • Mon-Sat 9:30 AM - 6:30 PM",
        });
      } else {
        setBusinessStatus({
          open: false,
          text: "Closed • Opens Mon-Sat 9:30 AM",
        });
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 60000);

    return () => {
      clearInterval(interval);
    };
  }, []);



  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    });
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setSubscribeStatus("error");
      setTimeout(() => setSubscribeStatus("idle"), 3000);
      return;
    }

    setIsSubmitting(true);
    // Simulate premium API subscription request
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setSubscribeStatus("success");
    setEmail("");
  };

  return (
    <footer className="bg-[#070707] text-white pt-16 pb-12 relative overflow-hidden border-t border-white/5">
      {/* Premium subtle grid backdrop */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35 pointer-events-none" />

      {/* Subtle top gradient line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-40" />

      {/* Ambient background glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[140px] -mr-64 -mt-64 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[100px] -ml-32 -mb-32 pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 mb-12">
          {/* Column 1: Brand & Socials (lg:col-span-3) */}
          <div className="lg:col-span-3 space-y-6">
            <div className="space-y-4">
              <Link
                href={AppRoutes.Public.Home}
                className="inline-block transition-transform hover:scale-[1.02] active:scale-95 group"
              >
                <Image
                  src="/logo-v3.png"
                  alt="Western Interio"
                  width={160}
                  height={50}
                  className="w-auto h-11 brightness-110 transition-all duration-500"
                />
              </Link>

              {isMounted && (
                <div className="pt-1">
                  <span
                    className={cn(
                      "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border backdrop-blur-sm transition-all duration-500",
                      businessStatus.open
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                        : "bg-amber-500/10 border-amber-500/20 text-amber-400",
                    )}
                  >
                    <span
                      className={cn(
                        "w-1 h-1 rounded-full",
                        businessStatus.open ? "bg-emerald-400" : "bg-amber-400",
                      )}
                    />
                    {businessStatus.text}
                  </span>
                </div>
              )}
            </div>

            <p className="text-gray-400 text-xs font-medium leading-relaxed">
              {footer.brandStatement.desc}
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              {footer.socialLinks.map((social: any) => {
                const getIcon = () => {
                  switch (social.platform.toLowerCase()) {
                    case "facebook":
                      return (
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                          <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                        </svg>
                      );
                    case "instagram":
                      return (
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                        </svg>
                      );
                    case "linkedin":
                      return (
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                      );
                    case "twitter":
                      return (
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      );
                    default:
                      return <MessageSquare size={14} />;
                  }
                };

                const getHoverClasses = () => {
                  switch (social.platform.toLowerCase()) {
                    case "facebook":
                      return "hover:text-[#1877F2] hover:bg-[#1877F2]/10 hover:border-[#1877F2]/30";
                    case "instagram":
                      return "hover:text-[#E4405F] hover:bg-[#E4405F]/10 hover:border-[#E4405F]/30";
                    case "linkedin":
                      return "hover:text-[#0077B5] hover:bg-[#0077B5]/10 hover:border-[#0077B5]/30";
                    case "twitter":
                      return "hover:text-white hover:bg-white/10 hover:border-white/30";
                    default:
                      return "hover:text-primary hover:bg-primary/10 hover:border-primary/30";
                  }
                };

                return (
                  <a
                    key={social.platform}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Follow us on ${social.platform}`}
                    className={cn(
                      "w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:scale-105 transition-all duration-300 group",
                      getHoverClasses(),
                    )}
                  >
                    <div className="group-hover:scale-110 transition-transform duration-300">
                      {getIcon()}
                    </div>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Column 2: Quick Links (lg:col-span-2) */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <span className="w-1 h-1 rounded-full bg-primary" />
              <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-white">Company</h4>
            </div>
            <ul className="space-y-3">
              {footer.companyLinks.map((link: any) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-[12px] font-semibold text-gray-400 hover:text-white transition-all duration-300 flex items-center group gap-2 hover:translate-x-1"
                  >
                    <span className="w-1 h-[1px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Products Links (lg:col-span-2) */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <span className="w-1 h-1 rounded-full bg-primary" />
              <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-white">Products</h4>
            </div>
            <ul className="space-y-3">
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
                    className="text-[12px] font-semibold text-gray-400 hover:text-white transition-all duration-300 flex items-center group gap-2 hover:translate-x-1"
                  >
                    <span className="w-1 h-[1px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact details (lg:col-span-2) */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <span className="w-1 h-1 rounded-full bg-primary" />
              <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-white">Get in Touch</h4>
            </div>
            <div className="space-y-4 text-gray-400 text-xs">
              {/* Address */}
              <div 
                onClick={() => handleCopy(common.contact.address, "address")}
                className="relative flex items-start gap-3 hover:text-white cursor-pointer transition-all duration-300 group py-1 rounded hover:bg-white/[0.01]"
              >
                <MapPin size={15} className="text-primary mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
                <span className="text-[12px] font-medium leading-snug">
                  {common.contact.address}
                </span>
                {copiedField === "address" && (
                  <span className="absolute -top-7 left-0 px-2 py-0.5 bg-emerald-500 text-white text-[9px] font-bold rounded shadow-lg">
                    Copied!
                  </span>
                )}
              </div>

              {/* Phones */}
              <div 
                onClick={() => handleCopy(common.contact.phones.join(", "), "phone")}
                className="relative flex items-start gap-3 hover:text-white cursor-pointer transition-all duration-300 group py-1 rounded hover:bg-white/[0.01]"
              >
                <Phone size={14} className="text-primary mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
                <div className="flex flex-col gap-0.5 text-[12px] font-semibold tracking-wider">
                  {common.contact.phones.map((phone: string, i: number) => (
                    <span key={i}>{phone}</span>
                  ))}
                </div>
                {copiedField === "phone" && (
                  <span className="absolute -top-7 left-0 px-2 py-0.5 bg-emerald-500 text-white text-[9px] font-bold rounded shadow-lg">
                    Copied!
                  </span>
                )}
              </div>

              {/* Email */}
              <div 
                onClick={() => handleCopy(common.contact.email, "email")}
                className="relative flex items-center gap-3 hover:text-white cursor-pointer transition-all duration-300 group py-1 rounded hover:bg-white/[0.01]"
              >
                <Mail size={14} className="text-primary shrink-0 group-hover:scale-110 transition-transform" />
                <span className="text-[12px] font-medium break-all">
                  {common.contact.email}
                </span>
                {copiedField === "email" && (
                  <span className="absolute -top-7 left-0 px-2 py-0.5 bg-emerald-500 text-white text-[9px] font-bold rounded shadow-lg">
                    Copied!
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Column 5: Newsletter (lg:col-span-3) */}
          <div className="lg:col-span-3 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-primary" />
                <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-white">Newsletter</h4>
              </div>
              <p className="text-gray-400 text-xs font-medium leading-relaxed">
                {footer.newsletter.desc}
              </p>

              {subscribeStatus === "success" ? (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 text-center space-y-2">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <Check size={12} strokeWidth={3} />
                  </div>
                  <p className="text-[10px] font-black text-white uppercase tracking-widest">Subscribed!</p>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-2">
                  <div className="relative flex items-center group">
                    <Mail size={14} className="absolute left-3.5 text-gray-600 group-focus-within:text-primary transition-colors" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={footer.newsletter.placeholder}
                      className={cn(
                        "w-full bg-white/[0.02] border rounded-lg py-2.5 pl-9 pr-4 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:bg-white/[0.04] transition-all",
                        subscribeStatus === "error" ? "border-red-500/40" : "border-white/10 focus:border-primary/50"
                      )}
                      aria-label="Email for newsletter"
                      disabled={isSubmitting}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 bg-white text-black font-black text-[9px] uppercase tracking-widest rounded-lg hover:bg-primary hover:text-white transition-all cursor-pointer shadow-lg active:scale-95"
                  >
                    {isSubmitting ? "Joining..." : "Join Inner Circle"}
                  </button>
                </form>
              )}
            </div>

            <div className="pt-2">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/5 border border-emerald-500/10 text-emerald-400 text-[9px] font-black tracking-wider uppercase">
                <span className="w-1 h-1 rounded-full bg-emerald-400" />
                Accepting Premium Projects
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Locations & SEO Terms */}
        <div className="py-14 border-t border-white/5 space-y-10">
          {/* Popular Search Terms */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white">
                Popular Search Terms
              </h4>
            </div>
            <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
              {footer.popularSearchTerms.map((term: string, i: number) => (
                <span key={i} className="inline-block">
                  <span className="hover:text-primary transition-colors cursor-pointer">{term}</span>
                  {i < footer.popularSearchTerms.length - 1 && (
                    <span className="mx-2.5 text-neutral-800">|</span>
                  )}
                </span>
              ))}
            </p>
          </div>

          {/* We Deliver To */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white">
                We Deliver To
              </h4>
            </div>
            <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
              {footer.deliveryLocations.map((location: string, i: number) => (
                <span key={i} className="inline-block">
                  <span className="hover:text-primary transition-colors cursor-pointer">{location}</span>
                  {i < footer.deliveryLocations.length - 1 && (
                    <span className="mx-2.5 text-neutral-800">|</span>
                  )}
                </span>
              ))}
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold tracking-[0.2em] text-gray-600 uppercase border-t border-white/5">
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-8 gap-y-4">
            <span>
              &copy; {currentYear} {footer.brandStatement.title}.
            </span>
            <span className="hidden md:block w-1.5 h-1.5 rounded-full bg-gray-800" />
            <Link
              href={footer.legal.privacyHref}
              className="hover:text-white transition-colors"
            >
              {footer.legal.privacyPolicy}
            </Link>
            <Link
              href={footer.legal.termsHref}
              className="hover:text-white transition-colors"
            >
              {footer.legal.termsOfService}
            </Link>
          </div>

        </div>
      </div>

      <QuoteModal isOpen={isQuoteOpen} onClose={() => setIsQuoteOpen(false)} />
    </footer>
  );
}
