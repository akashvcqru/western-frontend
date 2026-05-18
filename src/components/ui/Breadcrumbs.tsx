"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home, ChevronDown, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { AppRoutes } from "@/constants/routes";
import navigation from "@/data/navigation.json";

export default function Breadcrumbs() {
  const pathname = usePathname();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  // Don't show breadcrumbs on the home page
  const isHome = pathname === "/" || pathname === AppRoutes.Public.Home;
  if (isHome) return null;

  const pathSegments = pathname.split("/").filter((segment) => segment !== "");
  
  const getSubItems = (segment: string) => {
    const navItem = Array.isArray(navigation) ? navigation.find(n => n.id === segment.toLowerCase()) : null;
    if (!navItem) return null;
    return navItem.columns.flatMap(col => col.items);
  };
  
  return (
    <div className="pt-14 lg:pt-[120px]">
      <nav className="bg-neutral-100 border-b border-neutral-200 py-4 lg:py-3.5 overflow-hidden sticky top-[56px] lg:static z-40 shadow-sm lg:shadow-none">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <ul className="flex items-center gap-3 text-[10px] lg:text-[11px] font-black uppercase tracking-[0.2em] text-neutral-500 overflow-x-auto whitespace-nowrap no-scrollbar">
            <li>
              <a 
                href={AppRoutes.Public.Home} 
                className="flex items-center gap-2 hover:text-primary transition-colors group"
              >
                <Home size={14} className="group-hover:scale-110 transition-transform" />
                <span>Home</span>
              </a>
            </li>
            
            {pathSegments.map((segment, index) => {
              const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
              const isLast = index === pathSegments.length - 1;
              const label = segment.replace(/-/g, " ");
              const subItems = getSubItems(segment);

              return (
                <li key={href} className="flex items-center gap-3">
                  <ChevronRight size={12} className="text-gray-300 stroke-[3px]" />
                  {subItems && !isLast ? (
                    <div className="relative">
                      <button 
                        onClick={() => setActiveDropdown(activeDropdown === segment ? null : segment)}
                        className={cn(
                          "flex items-center gap-1.5 hover:text-primary transition-colors cursor-pointer uppercase",
                          activeDropdown === segment && "text-primary"
                        )}
                      >
                        {label}
                        <ChevronDown size={12} className={cn("transition-transform duration-300", activeDropdown === segment && "rotate-180")} />
                      </button>
                    </div>
                  ) : (
                    <span className={cn(isLast ? "text-primary font-black" : "hover:text-primary transition-colors")}>
                      {label}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Interactive Dropdown Overlay - Accordion Style */}
      {activeDropdown && (
        <div className="bg-white border-b border-neutral-200 shadow-2xl animate-in slide-in-from-top-4 duration-500 z-[35] relative">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-10 lg:py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
              {Array.isArray(navigation) && navigation.find(n => n.id === activeDropdown.toLowerCase())?.columns.map((col, i) => (
                <div key={i} className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-primary rounded-full" />
                    <h4 className="text-[10px] font-black tracking-[0.4em] text-secondary uppercase">
                      {col.title}
                    </h4>
                  </div>
                  <div className="grid gap-3 pl-4">
                    {col.items.map((item, idx) => (
                      <a
                        key={idx}
                        href={`/${activeDropdown.toLowerCase()}/${item.slug}`}
                        className="text-sm lg:text-base font-bold text-neutral-500 hover:text-primary transition-all hover:translate-x-2 block"
                        onClick={() => setActiveDropdown(null)}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-12 pt-8 border-t border-neutral-100 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <Sparkles size={16} className="text-primary animate-pulse" />
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                  Quick Access to {activeDropdown} Solutions
                </p>
              </div>
              <button 
                onClick={() => setActiveDropdown(null)}
                className="text-[10px] font-black uppercase tracking-widest text-secondary hover:text-primary transition-colors"
              >
                Close Menu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
