"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Download,
  Eye,
  ArrowRight,
  Layers,
  Loader2,
} from "lucide-react";
import QuoteModal from "@/components/common/QuoteModal";
import { cn } from "@/lib/utils";
import { PageHeader, useAppToast } from "@/components/ui";
import {
  useGetCataloguesQuery,
  useLazyGetCatalogueByIdQuery,
} from "@/redux/api/cataloguesApi";

export default function DownloadCenterPage() {
  const { addToast } = useAppToast();
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [isQuoteOpen, setIsQuoteOpen] = useState<boolean>(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // RTK Query: Fetch all active catalogues (limit 100)
  const { data: apiResponse, isLoading } = useGetCataloguesQuery({
    limit: 100,
    status: "Active",
  });

  const [triggerGetCatalogue] = useLazyGetCatalogueByIdQuery();

  const cataloguesData = apiResponse?.data || [];

  // Extract unique categories for the filters
  const categories = [
    "All",
    ...Array.from(new Set(cataloguesData.map((item) => item.category))),
  ];

  // Filter catalogues by category
  const filteredCatalogues = cataloguesData.filter((item) => {
    return activeCategory === "All" || item.category === activeCategory;
  });

  const getStaticFallbackUrl = (title: string): string => {
    const t = title.toLowerCase();
    if (t.includes("workstation")) return "/catalogs/workstations-catalog.pdf";
    if (t.includes("executive desking") || t.includes("desking")) return "/catalogs/executive-desks-catalog.pdf";
    if (t.includes("seating") || t.includes("chair")) return "/catalogs/chairs-catalog.pdf";
    if (t.includes("partition") || t.includes("ceiling")) return "/catalogs/modular-partitions-catalog.pdf";
    return "";
  };

  const openPdfFromBase64 = (base64Data: string, fileName: string, action: "view" | "download") => {
    let cleanBase64 = base64Data;
    let mimeType = "application/pdf";

    if (base64Data.startsWith("data:")) {
      const parts = base64Data.split(";base64,");
      if (parts.length === 2) {
        mimeType = parts[0].substring(5);
        cleanBase64 = parts[1];
      }
    }

    try {
      const byteCharacters = atob(cleanBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mimeType });
      const blobUrl = URL.createObjectURL(blob);

      if (action === "view") {
        window.open(blobUrl, "_blank");
      } else {
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      // Revoke after a short delay
      setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
    } catch (e) {
      console.error("Error generating PDF Blob URL", e);
      addToast({
        title: "Error",
        message: "Failed to open or download the PDF document.",
        variant: "error",
      });
    }
  };

  const handleAction = async (id: string, title: string, action: "view" | "download") => {
    setLoadingId(id);
    try {
      const res = await triggerGetCatalogue(id).unwrap();
      const pdfData = res.data?.pdfData;
      const pdfFileName = res.data?.pdfFileName || `${title.replace(/\s+/g, "_")}.pdf`;

      if (pdfData && pdfData.startsWith("/uploads/")) {
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || `http://${window.location.hostname}:5073`;
        const fileUrl = `${backendUrl}${pdfData}`;
        if (action === "view") {
          window.open(fileUrl, "_blank");
        } else {
          const link = document.createElement("a");
          link.href = fileUrl;
          link.download = pdfFileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
        return;
      }

      if (!pdfData) {
        const fallbackUrl = getStaticFallbackUrl(title);
        if (fallbackUrl) {
          if (action === "view") {
            window.open(fallbackUrl, "_blank");
          } else {
            const link = document.createElement("a");
            link.href = fallbackUrl;
            link.download = pdfFileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
          return;
        }
        addToast({
          title: "PDF Not Available",
          message: "No PDF file is associated with this catalogue.",
          variant: "warning",
        });
        return;
      }

      openPdfFromBase64(pdfData, pdfFileName, action);
    } catch {
      addToast({
        title: "Action Failed",
        message: "Could not retrieve the PDF file from the server.",
        variant: "error",
      });
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <main className="bg-white overflow-hidden flex flex-col min-h-screen">
      {/* Hero Section */}
      <PageHeader
        bgImage="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2070&auto=format&fit=crop"
        badgeText="Western Catalogue Center"
        titlePrefix="DESIGN"
        titleHighlight="BROCHURES & CATALOGUES."
        subtitle="Explore and download our comprehensive design collections, ergonomic catalogs, and architectural false partition guides. Think to design beyond with Western Interio."
      />

      {/* Main Browse Section */}
      <section className="py-20 lg:py-28 relative bg-neutral-50/50">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          {/* Filter Bar */}
          <div className="flex justify-center items-center mb-16 pb-8 border-b border-neutral-200/60">
            {/* Category tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer whitespace-nowrap active:scale-95",
                    activeCategory === cat
                      ? "bg-secondary text-white shadow-md shadow-secondary/15"
                      : "bg-white text-secondary/70 hover:text-secondary border border-neutral-200/80 hover:border-neutral-300",
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid Layout of Catalogues */}
          {isLoading ? (
            <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-3xl border border-neutral-100 p-6 flex flex-col md:flex-row h-full min-h-[260px] animate-pulse"
                >
                  <div className="md:w-2/5 min-h-[200px] md:min-h-full bg-neutral-100 rounded-2xl" />
                  <div className="md:w-3/5 p-6 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="h-3 bg-neutral-200 rounded w-1/3" />
                      <div className="h-5 bg-neutral-200 rounded w-3/4" />
                      <div className="h-3 bg-neutral-200 rounded w-full" />
                      <div className="h-3 bg-neutral-200 rounded w-5/6" />
                    </div>
                    <div className="flex gap-3 pt-4 border-t border-neutral-50">
                      <div className="h-10 bg-neutral-200 rounded-xl flex-1" />
                      <div className="h-10 bg-neutral-200 rounded-xl flex-1" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredCatalogues.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
              {filteredCatalogues.map((catalog) => (
                <div
                  key={catalog.id}
                  className="group relative bg-white rounded-3xl border border-neutral-100 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.04)] hover:shadow-[0_30px_70px_-15px_rgba(0,0,0,0.1)] hover:border-primary/10 transition-all duration-500 overflow-hidden flex flex-col md:flex-row h-full min-h-[260px]"
                >
                  {/* Subtle gradient hover fill */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.01] to-transparent pointer-events-none rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Left Side: Dynamic Image */}
                  <div className="md:w-2/5 relative min-h-[200px] md:min-h-full bg-neutral-100 overflow-hidden">
                    {catalog.image && (
                      <Image
                        src={catalog.image}
                        alt={catalog.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 30vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    )}
                    {/* Badge Overlay */}
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest text-primary shadow-sm border border-neutral-100">
                      {catalog.category}
                    </div>
                  </div>

                  {/* Right Side: Details & Actions */}
                  <div className="md:w-3/5 p-6 lg:p-8 flex flex-col justify-between items-stretch">
                    <div className="space-y-4">


                      <h3 className="text-lg lg:text-xl font-bold text-secondary tracking-tight group-hover:text-primary transition-colors duration-300">
                        {catalog.title}
                      </h3>

                      <p className="text-neutral-500 text-xs lg:text-sm font-semibold leading-relaxed">
                        {catalog.description}
                      </p>
                    </div>

                    {/* Dual Action Buttons */}
                    <div className="flex items-center gap-3 mt-6 pt-4 border-t border-neutral-50">
                      <button
                        onClick={() => handleAction(catalog.id, catalog.title, "view")}
                        disabled={loadingId !== null}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-neutral-100 hover:bg-neutral-200 text-secondary font-bold text-[10px] tracking-wider uppercase rounded-xl transition-all duration-300 active:scale-95 disabled:opacity-50 cursor-pointer"
                      >
                        {loadingId === catalog.id ? (
                          <Loader2 size={13} className="animate-spin text-secondary" />
                        ) : (
                          <Eye size={13} />
                        )}
                        <span>View</span>
                      </button>

                      <button
                        onClick={() => handleAction(catalog.id, catalog.title, "download")}
                        disabled={loadingId !== null}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-secondary hover:bg-primary text-white font-bold text-[10px] tracking-wider uppercase rounded-xl transition-all duration-500 shadow-md hover:shadow-primary/20 active:scale-95 disabled:opacity-50 group/down cursor-pointer"
                      >
                        {loadingId === catalog.id ? (
                          <Loader2 size={13} className="animate-spin text-white" />
                        ) : (
                          <Download
                            size={13}
                            className="group-hover/down:translate-y-0.5 transition-transform"
                          />
                        )}
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center space-y-4 bg-white rounded-3xl border border-neutral-100 shadow-sm max-w-xl mx-auto">
              <Layers className="w-12 h-12 text-neutral-300 mx-auto" />
              <h3 className="text-lg font-bold text-secondary">
                No catalog found
              </h3>
              <p className="text-neutral-400 text-xs font-semibold leading-normal max-w-xs mx-auto">
                No catalogs match the active category filter.
              </p>
              <button
                onClick={() => {
                  setActiveCategory("All");
                }}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-secondary text-[10px] font-black uppercase tracking-widest rounded-xl transition-colors cursor-pointer"
              >
                Reset Filter
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Corporate consultation / Brochure request CTA */}
      <section className="py-24 bg-neutral-950 text-white text-center relative overflow-hidden">
        {/* Decorative Grid Overlay & radial blur */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=2070&auto=format&fit=crop"
            alt="Corporate Consultations"
            fill
            className="object-cover opacity-10 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-neutral-950" />
        </div>

        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10 space-y-8">
          <div className="space-y-4">
            <span className="text-[10px] font-black tracking-[0.4em] text-primary uppercase bg-white/5 px-4.5 py-1.5 rounded-full inline-block">
              Custom Proposals
            </span>
            <h2 className="text-3xl lg:text-5xl font-black tracking-tight leading-tight uppercase">
              Need a Custom Presentation <br className="hidden md:block" />
              Or Physical Catalogue?
            </h2>
            <p className="text-neutral-400 text-xs sm:text-sm font-semibold max-w-xl mx-auto leading-relaxed">
              Our professional project engineers can curate personalized
              catalogues, fabric swatches, and 3D workspace plans based on your
              office blueprint.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-6">
            <button
              onClick={() => setIsQuoteOpen(true)}
              className="w-full sm:w-auto px-10 py-4.5 bg-primary text-white font-bold rounded-xl hover:bg-white hover:text-black transition-all duration-500 shadow-[0_20px_40px_-10px_rgba(var(--primary-rgb),0.3)] tracking-[0.2em] text-[10px] uppercase flex items-center justify-center gap-3 cursor-pointer active:scale-95 group"
            >
              <span>Request Swatches / Catalogue</span>
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>

            <a
              href="tel:+919540641111"
              className="w-full sm:w-auto px-10 py-4.5 bg-white/5 backdrop-blur-xl border border-white/20 text-white font-bold rounded-xl hover:bg-white/20 transition-all duration-500 tracking-[0.2em] text-[10px] uppercase block"
            >
              Call Our Team
            </a>
          </div>
        </div>
      </section>

      {/* Global Quote Modal Hook */}
      <QuoteModal isOpen={isQuoteOpen} onClose={() => setIsQuoteOpen(false)} />
    </main>
  );
}
