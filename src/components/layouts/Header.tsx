"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Menu,
  X,
  Search,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  ChevronDown,
} from "lucide-react";

import { cn } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import QuoteModal from "@/components/common/QuoteModal";
import siteContent from "@/data/site-content.json";
import navigation from "@/data/navigation.json";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  const { common, header } = siteContent;

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "w-full bg-white/95 backdrop-blur-xl fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          isScrolled
            ? "shadow-soft border-b border-neutral-100"
            : "border-b border-transparent",
        )}
      >
        {/* Top Bar - Refined & Sticky */}
        <div
          className={cn(
            "bg-neutral-950/95 backdrop-blur-md text-neutral-300 px-6 hidden lg:block border-b border-white/5 transition-all duration-500 origin-top overflow-hidden",
            isScrolled
              ? "max-h-0 py-0 opacity-0 border-none"
              : "max-h-12 py-2.5 opacity-100",
          )}
        >
          <div className="max-w-[1440px] mx-auto flex justify-between items-center text-[10px] font-bold tracking-[0.1em] xl:tracking-[0.2em] uppercase transition-all duration-300">
            <div className="flex items-center gap-5 xl:gap-10">
              <a
                href={`mailto:${common.contact.email}`}
                className="flex items-center gap-2 lg:gap-2.5 group cursor-pointer transition-all hover:text-white"
              >
                <Mail
                  size={12}
                  className="text-primary group-hover:scale-110 group-hover:rotate-3 transition-transform filter group-hover:drop-shadow-[0_0_4px_rgba(237,28,39,0.5)]"
                />
                <span className="transition-colors duration-300">{common.contact.email}</span>
              </a>
              {common.contact.phones.map((p: string, i: number) => (
                <a
                  key={i}
                  href={`tel:${p.replace(/-/g, "")}`}
                  className="flex items-center gap-2 lg:gap-2.5 group cursor-pointer transition-all hover:text-white"
                >
                  <Phone
                    size={12}
                    className="text-primary group-hover:scale-110 group-hover:rotate-12 transition-transform filter group-hover:drop-shadow-[0_0_4px_rgba(237,28,39,0.5)]"
                  />
                  <span className="transition-colors duration-300">{p}</span>
                </a>
              ))}
            </div>
            <div className="flex items-center gap-2 lg:gap-2.5 group cursor-pointer transition-all hover:text-white">
              <MapPin
                size={12}
                className="text-primary group-hover:scale-110 group-hover:-translate-y-0.5 transition-all filter group-hover:drop-shadow-[0_0_4px_rgba(237,28,39,0.5)]"
              />
              <span className="transition-colors duration-300">{common.contact.locationShort}</span>
            </div>
          </div>
        </div>

        {/* Main Header Container */}
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative">
          <div
            className={cn(
              "flex justify-between items-center transition-all duration-500",
              isScrolled ? "h-14 lg:h-16" : "h-16 lg:h-20",
            )}
          >
            {/* Logo */}
            <a href={header.homeHref} className="flex items-center gap-4 group">
              <Image
                src="/logo-v3.png"
                alt="Western Interio"
                width={200}
                height={56}
                className={cn(
                  "w-auto transition-all duration-500 brightness-110",
                  isScrolled ? "h-10 lg:h-10" : "h-12 lg:h-12",
                )}
                priority
              />
            </a>

            {/* Desktop Navigation - SaaS Style */}
            <nav className="hidden xl:flex items-center gap-2 h-full">
              {header.navigation.map((link: any) => {
                const navItem = Array.isArray(navigation)
                  ? navigation.find((item) => item.title === link.name)
                  : null;
                return (
                  <div
                    key={link.name}
                    className="px-3.5 h-full relative group flex items-center"
                    onMouseEnter={() => navItem && setActiveMenu(link.name)}
                    onMouseLeave={() => setActiveMenu(null)}
                  >
                    <a
                      href={link.href}
                      className={cn(
                        "text-[11px] font-bold text-secondary/70 hover:text-secondary transition-all duration-300 tracking-[0.15em] uppercase relative inline-flex items-center",
                        activeMenu === link.name && "text-secondary",
                      )}
                    >
                      {link.name}
                      {navItem && (
                        <ChevronDown
                          size={12}
                          className={cn(
                            "ml-2 opacity-40 transition-transform duration-300",
                            activeMenu === link.name &&
                              "rotate-180 opacity-100",
                          )}
                        />
                      )}
                      {/* Hover indicator */}
                      <span
                        className={cn(
                          "absolute -bottom-1 left-0 w-full h-0.5 bg-primary transform scale-x-0 transition-transform duration-300 origin-left",
                          activeMenu === link.name && "scale-x-100",
                        )}
                      />
                    </a>

                    {/* Mega Menu Dropdown - Premium Glassmorphism */}
                    {navItem && navItem.columns && (
                      <div
                        className={cn(
                          "fixed top-full left-0 right-0 bg-white/95 backdrop-blur-2xl shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] border-t border-neutral-100 transition-all duration-500 overflow-hidden z-50",
                          activeMenu === link.name
                            ? "max-h-[600px] opacity-100"
                            : "max-h-0 opacity-0 invisible",
                        )}
                      >
                        <div className="max-w-[1440px] mx-auto px-12 py-16 grid grid-cols-4 gap-16">
                          {navItem.columns.map((column: any, i: number) => (
                            <div
                              key={i}
                              className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500"
                              style={{ animationDelay: `${i * 50}ms` }}
                            >
                              <h4 className="text-[10px] font-black tracking-[0.4em] text-primary uppercase">
                                {column.title}
                              </h4>
                              <ul className="space-y-5">
                                {column.items.map((item: any, idx: number) => (
                                  <li key={idx}>
                                    <a
                                      href={`${navItem.href}/${item.slug}`}
                                      className="text-[13px] font-semibold text-secondary/80 hover:text-primary transition-all flex items-center justify-start group/item relative"
                                      onClick={() => setActiveMenu(null)}
                                    >
                                      <span className="absolute -left-5 w-1.5 h-1.5 rounded-full bg-primary transform scale-0 group-hover/item:scale-100 transition-transform duration-300" />
                                      {item.name}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Action Icons & CTA */}
            <div className="flex items-center gap-6">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2.5 text-secondary/40 hover:text-primary transition-all duration-300 hover:bg-neutral-50 rounded-xl cursor-pointer active:scale-90"
              >
                <Search size={20} strokeWidth={2.5} />
              </button>

              <button
                onClick={() => setIsQuoteOpen(true)}
                className="hidden md:inline-flex items-center justify-center gap-3 px-6 py-3 bg-secondary text-white font-bold tracking-widest text-[10px] uppercase rounded-xl transition-all duration-500 hover:bg-primary hover:-translate-y-1 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_40px_-10px_rgba(var(--primary-rgb),0.3)] cursor-pointer group active:scale-95"
              >
                {header.cta}
                <ArrowRight
                  size={14}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>

              <button
                className="xl:hidden p-2 text-secondary cursor-pointer hover:bg-neutral-50 rounded-xl transition-all"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Overlays - Outside of Header to prevent clipping */}
      {typeof window !== "undefined" && (
        <>
          <QuoteModal
            isOpen={isQuoteOpen}
            onClose={() => setIsQuoteOpen(false)}
          />

          {/* Full Screen Search Overlay */}
          {isSearchOpen && (
            <div className="fixed inset-0 bg-secondary/95 backdrop-blur-xl z-[100] flex flex-col items-center justify-center p-6 animate-in fade-in duration-300">
              <button
                onClick={() => setIsSearchOpen(false)}
                className="absolute top-10 right-10 p-4 text-white/50 hover:text-white transition-colors cursor-pointer"
              >
                <X size={40} strokeWidth={1} />
              </button>

              <div className="w-full max-w-4xl space-y-12 text-center">
                <h2 className="text-white/30 text-[10px] font-black tracking-[0.5em] uppercase">
                  What are you looking for?
                </h2>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Type to search products, brands or categories..."
                    className="w-full bg-transparent border-b-2 border-white/10 text-white text-3xl lg:text-5xl font-light py-8 px-4 focus:outline-none focus:border-primary transition-all placeholder:text-white/10"
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search
                    size={40}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-primary"
                  />
                </div>
                <div className="flex flex-wrap justify-center gap-4">
                  {header.searchTags.map((tag: any) => (
                    <Link
                      key={tag.label}
                      href={`/products/${tag.slug}`}
                      onClick={() => setIsSearchOpen(false)}
                    >
                      <Badge
                        variant="dark"
                        className="px-6 py-2 cursor-pointer"
                      >
                        {tag.label}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Mobile Navigation Menu Overlay */}
          {isOpen && (
            <div
              className={cn(
                "fixed inset-0 bg-white z-[90] xl:hidden overflow-y-auto border-t border-neutral-100 animate-in slide-in-from-top-4 duration-500 transition-all duration-500",
                isScrolled ? "top-[56px]" : "top-[64px]",
              )}
            >
              <div className="p-8 space-y-8 pb-32 bg-white min-h-full">
                {/* Menu Breadcrumbs */}
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-4">
                  <button
                    onClick={() => setActiveMenu(null)}
                    className={cn(
                      "hover:text-primary transition-colors",
                      !activeMenu && "text-primary",
                    )}
                  >
                    Home
                  </button>
                  {activeMenu && (
                    <>
                      <ChevronDown
                        size={10}
                        className="-rotate-90 opacity-30"
                      />
                      <span className="text-secondary">{activeMenu}</span>
                    </>
                  )}
                </div>

                {!activeMenu ? (
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">
                        Explore Categories
                      </span>
                      <div className="grid gap-2">
                        {header.navigation.map((link: any) => {
                          const hasSubMenu =
                            Array.isArray(navigation) &&
                            navigation.find((n) => n.title === link.name)
                              ?.columns;
                          return (
                            <div
                              key={link.name}
                              className="border-b border-neutral-50 flex justify-between items-center"
                            >
                              {hasSubMenu ? (
                                <button
                                  onClick={() => setActiveMenu(link.name)}
                                  className="text-2xl font-bold text-secondary tracking-tighter active:text-primary transition-colors flex items-center justify-between w-full group py-5"
                                >
                                  {link.name}
                                  <ArrowRight
                                    size={20}
                                    className="text-primary/30 group-active:text-primary transition-transform"
                                  />
                                </button>
                              ) : (
                                <a
                                  href={link.href}
                                  className="text-2xl font-bold text-secondary tracking-tighter active:text-primary transition-colors flex items-center justify-between w-full group py-5"
                                  onClick={() => setIsOpen(false)}
                                >
                                  {link.name}
                                  <ArrowRight
                                    size={20}
                                    className="text-primary/30 group-active:text-primary transition-transform"
                                  />
                                </a>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="pt-8 space-y-6">
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">
                        Direct Contact
                      </span>
                      <div className="grid gap-4">
                        <a
                          href={`tel:${common.contact.phoneRaw}`}
                          className="flex items-center gap-4 p-5 bg-neutral-50 rounded-2xl border border-neutral-100"
                        >
                          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                            <Phone size={18} />
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">
                              Call Us
                            </p>
                            <p className="font-bold text-secondary">
                              {common.contact.phone}
                            </p>
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-12">
                    {Array.isArray(navigation) &&
                      navigation
                        .find((n) => n.title === activeMenu)
                        ?.columns?.map((col: any, i: number) => (
                          <div key={i} className="space-y-6">
                            <h4 className="text-[10px] font-black tracking-[0.4em] text-primary uppercase border-l-2 border-primary pl-4">
                              {col.title}
                            </h4>
                            <div className="grid gap-4 pl-4">
                              {col.items.map((item: any, idx: number) => (
                                <a
                                  key={idx}
                                  href={`/${activeMenu.toLowerCase()}/${item.slug}`}
                                  className="text-lg font-bold text-secondary hover:text-primary transition-colors block active:translate-x-2 duration-300"
                                  onClick={() => {
                                    setIsOpen(false);
                                    setActiveMenu(null);
                                  }}
                                >
                                  {item.name}
                                </a>
                              ))}
                            </div>
                          </div>
                        ))}

                    <button
                      onClick={() => setActiveMenu(null)}
                      className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400 pt-8 border-t border-neutral-100"
                    >
                      <ArrowRight size={14} className="rotate-180" />
                      Back to Main Menu
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
