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

  const [isVisible, setIsVisible] = useState(false);
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

    const toggleVisibility = () => {
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
      clearInterval(interval);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
    <footer className="bg-[#070707] text-white pt-28 pb-12 relative overflow-hidden border-t border-white/5">
      {/* Premium subtle grid backdrop */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35 pointer-events-none" />

      {/* Subtle top gradient line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-40" />

      {/* Ambient background glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[140px] -mr-64 -mt-64 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[100px] -ml-32 -mb-32 pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 mb-20">
          {/* Brand & Address Section */}
          <div className="lg:col-span-4 space-y-8">
            <div className="space-y-6">
              <Link
                href={AppRoutes.Public.Home}
                className="inline-block transition-transform hover:scale-[1.02] active:scale-95 group"
              >
                <Image
                  src="/logo-v3.png"
                  alt="Western Interio"
                  width={180}
                  height={55}
                  className="w-auto h-14 brightness-110 transition-all duration-500"
                />
              </Link>

              {/* Dynamic open/closed badge to wow the user */}
              {isMounted && (
                <div className="pt-1">
                  <span
                    className={cn(
                      "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border backdrop-blur-sm transition-all duration-500",
                      businessStatus.open
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.05)]"
                        : "bg-amber-500/10 border-amber-500/20 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.05)]",
                    )}
                  >
                    <span
                      className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        businessStatus.open
                          ? "bg-emerald-400 shadow-[0_0_8px_#10b981]"
                          : "bg-amber-400 shadow-[0_0_8px_#f59e0b]",
                      )}
                    />
                    {businessStatus.text}
                  </span>
                </div>
              )}
            </div>

            <address className="not-italic space-y-5">
              <p className="text-gray-400 text-sm font-medium leading-relaxed max-w-md">
                {footer.brandStatement.desc}
              </p>

              <div className="space-y-3.5 pt-2">
                {/* Address Item */}
                <div
                  onClick={() => handleCopy(common.contact.address, "address")}
                  className="relative flex items-start gap-4 text-gray-400 hover:text-white cursor-pointer transition-all duration-300 group py-1.5 px-2.5 -mx-2.5 rounded-lg hover:bg-white/[0.02] border border-transparent hover:border-white/5"
                >
                  <MapPin
                    size={18}
                    className="text-primary mt-0.5 shrink-0 group-hover:scale-110 transition-transform duration-300"
                  />
                  <span className="text-[13px] font-medium leading-relaxed flex-1">
                    {common.contact.address}
                  </span>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 self-center text-gray-600 hover:text-primary pr-1">
                    <Copy size={13} />
                  </div>
                  {copiedField === "address" && (
                    <span className="absolute -top-8 left-4 px-2.5 py-1 bg-emerald-500 text-white text-[10px] font-bold rounded shadow-lg">
                      Copied Address!
                    </span>
                  )}
                </div>

                {/* Phone Item */}
                <div
                  onClick={() =>
                    handleCopy(common.contact.phones.join(", "), "phone")
                  }
                  className="relative flex items-start gap-4 text-gray-400 hover:text-white cursor-pointer transition-all duration-300 group py-1.5 px-2.5 -mx-2.5 rounded-lg hover:bg-white/[0.02] border border-transparent hover:border-white/5"
                >
                  <Phone
                    size={16}
                    className="text-primary mt-1 shrink-0 group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="flex-1 flex flex-col gap-1">
                    {common.contact.phones.map((phone: string, i: number) => (
                      <span
                        key={i}
                        className="text-[13px] font-semibold tracking-wider"
                      >
                        {phone}
                      </span>
                    ))}
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 self-center text-gray-600 hover:text-primary pr-1">
                    <Copy size={13} />
                  </div>
                  {copiedField === "phone" && (
                    <span className="absolute -top-8 left-4 px-2.5 py-1 bg-emerald-500 text-white text-[10px] font-bold rounded shadow-lg">
                      Copied Phones!
                    </span>
                  )}
                </div>

                {/* Email Item */}
                <div
                  onClick={() => handleCopy(common.contact.email, "email")}
                  className="relative flex items-center gap-4 text-gray-400 hover:text-white cursor-pointer transition-all duration-300 group py-1.5 px-2.5 -mx-2.5 rounded-lg hover:bg-white/[0.02] border border-transparent hover:border-white/5"
                >
                  <Mail
                    size={16}
                    className="text-primary shrink-0 group-hover:scale-110 transition-transform duration-300"
                  />
                  <span className="text-[13px] font-medium flex-1">
                    {common.contact.email}
                  </span>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-gray-600 hover:text-primary pr-1">
                    <Copy size={13} />
                  </div>
                  {copiedField === "email" && (
                    <span className="absolute -top-8 left-4 px-2.5 py-1 bg-emerald-500 text-white text-[10px] font-bold rounded shadow-lg">
                      Copied Email!
                    </span>
                  )}
                </div>
              </div>
            </address>

            {/* Premium Social Links */}
            <div className="flex items-center gap-4 pt-2">
              {footer.socialLinks.map((social: any) => {
                const getIcon = () => {
                  switch (social.platform.toLowerCase()) {
                    case "facebook":
                      return (
                        <svg
                          className="w-4 h-4 fill-current"
                          viewBox="0 0 24 24"
                          stroke="none"
                        >
                          <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                        </svg>
                      );
                    case "instagram":
                      return (
                        <svg
                          className="w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect
                            x="2"
                            y="2"
                            width="20"
                            height="20"
                            rx="5"
                            ry="5"
                          ></rect>
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                        </svg>
                      );
                    case "linkedin":
                      return (
                        <svg
                          className="w-4 h-4 fill-current"
                          viewBox="0 0 24 24"
                          stroke="none"
                        >
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                      );
                    case "twitter":
                      return (
                        <svg
                          className="w-4 h-4 fill-current"
                          viewBox="0 0 24 24"
                          stroke="none"
                        >
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      );
                    default:
                      return <MessageSquare size={16} />;
                  }
                };

                const getHoverClasses = () => {
                  switch (social.platform.toLowerCase()) {
                    case "facebook":
                      return "hover:text-[#1877F2] hover:bg-[#1877F2]/10 hover:border-[#1877F2]/30 shadow-[#1877F2]/5 hover:shadow-lg";
                    case "instagram":
                      return "hover:text-[#E4405F] hover:bg-[#E4405F]/10 hover:border-[#E4405F]/30 shadow-[#E4405F]/5 hover:shadow-lg";
                    case "linkedin":
                      return "hover:text-[#0077B5] hover:bg-[#0077B5]/10 hover:border-[#0077B5]/30 shadow-[#0077B5]/5 hover:shadow-lg";
                    case "twitter":
                      return "hover:text-white hover:bg-white/10 hover:border-white/30 shadow-white/5 hover:shadow-lg";
                    default:
                      return "hover:text-primary hover:bg-primary/10 hover:border-primary/30 shadow-primary/5 hover:shadow-lg";
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
                      "w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:scale-105 transition-all duration-300 group",
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

          {/* Navigation Grid */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-12">
            {/* Quick Links */}
            <nav aria-label="Company Links">
              <div className="flex items-center gap-2 mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white">
                  Company
                </h4>
              </div>
              <ul className="space-y-4">
                {footer.companyLinks.map((link: any) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-[13px] font-semibold text-gray-400 hover:text-white transition-all duration-300 flex items-center group gap-2 hover:translate-x-1.5"
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
              <div className="flex items-center gap-2 mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white">
                  Products
                </h4>
              </div>
              <ul className="space-y-4">
                {[
                  { name: "Office Chairs", href: "/products/office-chairs" },
                  {
                    name: "Workstations",
                    href: "/products/desking-workstation",
                  },
                  { name: "Office Tables", href: "/products/office-tables" },
                  {
                    name: "Storage Solutions",
                    href: "/products/office-storage",
                  },
                  {
                    name: "Modular Kitchen",
                    href: "/products/modular-kitchen-series",
                  },
                ].map((link: any) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-[13px] font-semibold text-gray-400 hover:text-white transition-all duration-300 flex items-center group gap-2 hover:translate-x-1.5"
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
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white">
                  Newsletter
                </h4>
              </div>
              <p className="text-gray-400 text-sm font-medium leading-relaxed">
                {footer.newsletter.desc}
              </p>

              {subscribeStatus === "success" ? (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-5 text-center space-y-2.5 shadow-lg shadow-emerald-500/5 transition-all">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
                    <Check size={16} strokeWidth={3} />
                  </div>
                  <p className="text-[11px] font-black text-white uppercase tracking-widest">
                    Subscribed!
                  </p>
                  <p className="text-[11px] text-gray-400 font-medium">
                    Thank you for joining our inner circle.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-3">
                  <div className="relative group">
                    <div className="relative flex items-center">
                      <Mail
                        size={16}
                        className="absolute left-4 text-gray-600 group-focus-within:text-primary transition-colors duration-300"
                      />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={footer.newsletter.placeholder}
                        className={cn(
                          "w-full bg-white/[0.03] border rounded-xl py-4 pl-11 pr-5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:bg-white/[0.05] transition-all duration-300",
                          subscribeStatus === "error"
                            ? "border-red-500/40 focus:border-red-500/60 shadow-[0_0_15px_rgba(239,68,68,0.05)]"
                            : "border-white/10 focus:border-primary/50 focus:shadow-[0_0_15px_rgba(237,28,39,0.05)]",
                        )}
                        aria-label="Email for newsletter"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-white text-black font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
                  >
                    {isSubmitting ? "Joining..." : "Join Inner Circle"}
                  </button>
                  {subscribeStatus === "error" && (
                    <p className="text-[10px] text-red-400 font-bold tracking-wider uppercase">
                      Please enter a valid email.
                    </p>
                  )}
                </form>
              )}
            </div>

            <div className="pt-6 border-t border-white/5">
              <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-emerald-500/5 border border-emerald-500/10 text-emerald-400 text-[10px] font-black tracking-wider uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                Accepting Premium Projects
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Locations & SEO Terms */}
        <div className="py-14 border-t border-white/5 space-y-10">
          {/* Areas We Serve */}
          <div className="space-y-5">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/50">
              Major Delivery Locations
            </h4>
            <div className="flex flex-wrap gap-2">
              {footer.deliveryLocations.map((location: string, i: number) => (
                <span
                  key={i}
                  className="px-3 py-1.5 bg-white/[0.02] border border-white/5 hover:border-primary/20 rounded-lg text-[10px] font-bold text-gray-500 hover:text-primary transition-all duration-300 cursor-default uppercase tracking-wider"
                >
                  {location}
                </span>
              ))}
            </div>
          </div>

          {/* Search Terms Tag Cloud */}
          <div className="space-y-5">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/50">
              Services & Solutions
            </h4>
            <div className="flex flex-wrap gap-2">
              {footer.popularSearchTerms.map((term: string, i: number) => (
                <span
                  key={i}
                  className="px-4 py-2 bg-white/[0.02] border border-white/5 hover:border-primary/20 rounded-full text-[9px] font-bold text-gray-500 tracking-widest hover:text-white hover:bg-white/[0.04] transition-all duration-300 cursor-default uppercase"
                >
                  {term}
                </span>
              ))}
            </div>
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

          {/* Enhanced Glassmorphic Back to Top Button */}
          <button
            onClick={scrollToTop}
            className={cn(
              "fixed bottom-8 right-8 z-[60] flex items-center gap-4 bg-black/60 backdrop-blur-xl p-2 pl-6 pr-2 rounded-full border border-white/10 shadow-2xl transition-all duration-500 group hover:scale-[1.05] hover:border-white/20 active:scale-95",
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-16 opacity-0 pointer-events-none",
            )}
          >
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/70 group-hover:text-white transition-colors duration-300">
              Back to Top
            </span>
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:bg-primary/90 transition-all duration-300">
              <ArrowUp
                size={18}
                className="text-white group-hover:-translate-y-1 transition-transform duration-300"
              />
            </div>
          </button>
        </div>
      </div>

      <QuoteModal isOpen={isQuoteOpen} onClose={() => setIsQuoteOpen(false)} />
    </footer>
  );
}
