"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { AppRoutes } from "@/constants/routes";

export default function Breadcrumbs() {
  const pathname = usePathname();
  
  // Don't show breadcrumbs on the home page
  const isHome = pathname === "/" || pathname === AppRoutes.Public.Home;
  if (isHome) return null;

  const pathSegments = pathname.split("/").filter((segment) => segment !== "");
  
  return (
    <div className="pt-14 lg:pt-[120px]">
      <nav className="bg-neutral-100 border-b border-neutral-200 py-4 lg:py-3.5 overflow-hidden sticky top-[56px] lg:static z-40 shadow-sm lg:shadow-none">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <ul className="flex items-center gap-3 text-[10px] lg:text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500 overflow-x-auto whitespace-nowrap no-scrollbar">
            <li>
              <Link 
                href={AppRoutes.Public.Home} 
                className="flex items-center gap-2 hover:text-primary transition-colors group"
              >
                <Home size={13} className="group-hover:scale-110 transition-transform stroke-[1.8px]" />
                <span>Home</span>
              </Link>
            </li>
            
            {pathSegments.map((segment, index) => {
              const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
              const isLast = index === pathSegments.length - 1;
              const label = segment.replace(/-/g, " ");
 
              return (
                <li key={href} className="flex items-center gap-3">
                  <ChevronRight size={12} className="text-neutral-300 stroke-[2px]" />
                  {isLast ? (
                    <span className="text-primary font-bold">
                      {label}
                    </span>
                  ) : (
                    <Link href={href} className="hover:text-primary transition-colors">
                      {label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </div>
  );
}
