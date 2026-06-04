"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Phone,
  FileText,
  CheckCircle2,
  ShieldCheck,
  Maximize2,
  Download,
  Check,
  Award,
  Zap,
  Sparkles,
  Play,
} from "lucide-react";
import { cn } from "@/lib/utils";
import ImagePreview from "@/components/ui/ImagePreview";
import siteContent from "@/data/site-content.json";
import { useSettings } from "@/hooks/useSettings";
import QuoteModal from "@/components/common/QuoteModal";

interface Product {
  id: string;
  name: string;
  category: string;
  brand?: string;
  price?: string;
  description?: string;
  images: string[];
  variants?: { label: string; options: string[] }[];
  specifications?: { label: string; value: string }[];
  catNo?: string;

  material?: string;
  finish?: string;
  size?: string;

  // Dynamic admin/editor editable properties:
  features?: { title: string; desc: string }[];
  blueprintImage?: string;
  dimensions?: { name: string; range: string; coord: string }[];
  swatches?: {
    category: string;
    options: { name: string; hex: string; desc: string; border?: boolean }[];
  }[];
  resources?: {
    id: string;
    title: string;
    desc: string;
    format: string;
    size: string;
    fileData?: string;
    fileName?: string;
    colorClass?: string;
  }[];
  detailsTitle?: string;
  detailsText1?: string;
  detailsText2?: string;
  quickSpecs?: string[];
}

interface ProductDetailViewProps {
  product: Product;
}
export default function ProductDetailView({ product }: ProductDetailViewProps) {
  const { contact } = useSettings();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState<
    Record<string, string>
  >(
    (product.variants || []).reduce(
      (acc: Record<string, string>, v) => ({ ...acc, [v.label]: v.options[0] }),
      {},
    ),
  );
  const [isExpanded, setIsExpanded] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [hoveredCoordinate, setHoveredCoordinate] = useState<string | null>(
    null,
  );

  const tabs = [
    { id: "details", label: "Product Details" },
    { id: "specs", label: "Specification" },
    { id: "dimensions", label: "Dimension Blueprint" },
    { id: "resources", label: "Downloads & Resources" },
  ];

  const [activeTab, setActiveTab] = useState("details");

  const handleGetQuote = () => {
    setIsQuoteModalOpen(true);
  };

  const renderProductDetails = () => {
    const featuresToShow = product.features || [];
    const quickSpecsToShow = product.quickSpecs || [];
    const detailsTitle = product.detailsTitle;
    const detailsText1 = product.detailsText1;
    const detailsText2 = product.detailsText2;

    if (!detailsTitle && !detailsText1 && !detailsText2 && quickSpecsToShow.length === 0 && featuresToShow.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white rounded-xl border border-neutral-100 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.06)]">
          <Sparkles className="w-10 h-10 text-neutral-300 mb-3 animate-pulse" />
          <h4 className="text-sm font-bold text-secondary tracking-tight mb-1">Product Details</h4>
          <p className="text-xs text-neutral-400 font-normal">
            No detailed description or features are currently available for this product.
          </p>
        </div>
      );
    }

    return (
      <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Visual Storytelling */}
        {(detailsTitle || detailsText1 || detailsText2 || quickSpecsToShow.length > 0) && (
          <div className={cn(
            "space-y-6",
            featuresToShow.length > 0 ? "lg:col-span-7" : "lg:col-span-12"
          )}>
            {(detailsTitle || detailsText1 || detailsText2) && (
              <div className="space-y-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/5 text-primary text-[10px] font-semibold uppercase tracking-[0.2em] rounded-lg border border-primary/10">
                  <Sparkles size={10} />
                  Engineered Excellence
                </span>
                <h3 className="text-2xl lg:text-3xl font-bold text-secondary tracking-tight">
                  {detailsTitle}
                </h3>
              </div>
            )}

            <div className="space-y-4 text-neutral-500 leading-relaxed text-sm font-normal">
              {detailsText1 && <p>{detailsText1}</p>}
              {detailsText2 && <p>{detailsText2}</p>}
            </div>

            {/* Quick Specifications Checklist */}
            {quickSpecsToShow.length > 0 && (
              <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-neutral-100">
                {quickSpecsToShow.map((spec, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span className="text-xs text-secondary font-bold">
                      {spec}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Right Column: Visual Core Features list inside card */}
        {featuresToShow.length > 0 && (
          <div className={cn(
            "lg:col-span-5",
            !(detailsTitle || detailsText1 || detailsText2 || quickSpecsToShow.length > 0) && "lg:col-span-12"
          )}>
            <div className="bg-white p-6 rounded-xl border border-neutral-100/80 shadow-[0_15px_40px_-20px_rgba(0,0,0,0.06)] space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
              <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary/50 border-b border-neutral-50 pb-3">
                Core Technical Features
              </h4>

              <div className="space-y-4">
                {featuresToShow.map((f, i) => (
                  <div key={i} className="flex gap-4 group">
                    <div className="w-9 h-9 rounded-xl bg-primary/5 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white">
                      <CheckCircle2 size={16} />
                    </div>
                    <div>
                      <h5 className="text-sm font-semibold text-secondary">
                        {f.title}
                      </h5>
                      <p className="text-[11px] text-neutral-400 font-normal leading-relaxed mt-0.5">
                        {f.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderSpecifications = () => {
    const specsToShow = product.specifications || [];

    if (specsToShow.length === 0) {
      return (
        <div className="w-full bg-white rounded-xl border border-neutral-100 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.06)] p-16 text-center flex flex-col items-center justify-center">
          <FileText className="w-10 h-10 text-neutral-300 mb-3" />
          <h4 className="text-sm font-bold text-secondary tracking-tight mb-1">
            Factory Specifications
          </h4>
          <p className="text-xs text-neutral-400 font-normal">
            No specifications are currently available for this product.
          </p>
        </div>
      );
    }

    return (
      <div className="w-full bg-white rounded-xl border border-neutral-100 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.06)] overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-100/80 bg-neutral-50/40 flex items-center justify-between">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-secondary tracking-tight">
              Factory Specifications
            </h4>
            <p className="text-[11px] text-neutral-400 font-normal">
              Standard structural property limits verified under ISO 9001
              certifications
            </p>
          </div>
          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-semibold rounded-lg uppercase tracking-wider">
            Verified Build
          </span>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-neutral-50/30 border-b border-neutral-100">
              <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">
                Technical Property
              </th>
              <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">
                Factory Specification
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {specsToShow.map((spec, index) => (
              <tr
                key={index}
                className="hover:bg-neutral-50/30 transition-colors duration-200"
              >
                <td className="px-6 py-3.5 text-xs font-semibold text-neutral-500 tracking-wide uppercase">
                  {spec.label}
                </td>
                <td className="px-6 py-3.5 text-xs font-normal text-secondary">
                  {spec.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderDimensions = () => {
    const dimensions = product.dimensions || [];

    if (!product.blueprintImage && dimensions.length === 0) {
      return (
        <div className="w-full bg-white rounded-xl border border-neutral-100 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.06)] p-16 text-center flex flex-col items-center justify-center">
          <Maximize2 className="w-10 h-10 text-neutral-300 mb-3" />
          <h4 className="text-sm font-bold text-secondary tracking-tight mb-1">
            Dimension Blueprint
          </h4>
          <p className="text-xs text-neutral-400 font-normal">
            No dimension details or blueprints are currently available for this product.
          </p>
        </div>
      );
    }

    return (
      <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Column: Blueprint Drafting Engine */}
        <div className="lg:col-span-7 relative aspect-[4/3] bg-neutral-900 border border-neutral-800 rounded-xl flex flex-col items-center justify-center p-8 overflow-hidden select-none shadow-2xl">
          {/* Blueprint Grid Styling */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:30px_30px] opacity-15" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-neutral-900/40 to-neutral-900 pointer-events-none" />

          {product.blueprintImage ? (
            <div className="relative w-full h-full flex items-center justify-center p-4">
              <Image
                src={product.blueprintImage}
                alt="Blueprint Layout"
                fill
                className="object-contain opacity-80 animate-in fade-in duration-300"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-6 text-white/40">
              <Maximize2 className="w-10 h-10 mb-3 text-white/20" />
              <p className="text-xs font-mono uppercase tracking-wider">No blueprint image available</p>
            </div>
          )}

          <span className="absolute bottom-5 right-6 text-[8px] font-mono text-white/30 uppercase tracking-[0.2em] font-normal">
            Western Technical Design Lab // v4.2
          </span>
        </div>

        {/* Right Column: Dimensions range list table */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
              Ergonomics First
            </span>
            <h3 className="text-2xl font-bold text-secondary tracking-tight">
              Ergonomically Standardized
            </h3>
            <p className="text-xs text-neutral-400 font-normal leading-relaxed">
              We design all modular structures and seating using standard
              corporate safety indices to prevent fatigue, posture defects, and
              physical strain. Hover over key values to locate them.
            </p>
          </div>

          <div className="divide-y divide-neutral-100/80 border-y border-neutral-100">
            {dimensions.map((dim, i) => (
              <div
                key={i}
                className={cn(
                  "flex justify-between items-center py-3 cursor-pointer px-3 rounded-xl transition-all duration-300",
                  hoveredCoordinate === dim.coord
                    ? "bg-primary/5 -translate-x-1"
                    : "hover:bg-neutral-50/40",
                )}
                onMouseEnter={() => setHoveredCoordinate(dim.coord)}
                onMouseLeave={() => setHoveredCoordinate(null)}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "w-1.5 h-1.5 rounded-full ",
                      hoveredCoordinate === dim.coord
                        ? "bg-primary scale-125"
                        : "bg-neutral-300",
                    )}
                  />
                  <span className="text-xs font-semibold text-neutral-500 tracking-wide uppercase">
                    {dim.name}
                  </span>
                </div>
                <span className="text-xs font-mono font-semibold text-secondary">
                  {dim.range}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const handleDownload = (res: { id: string; title: string; fileData?: string; fileName?: string; format: string }) => {
    setDownloadingId(res.id);
    setTimeout(() => {
      setDownloadingId(null);
      if (res.fileData) {
        const link = document.createElement("a");
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || `http://${window.location.hostname}:5073`;
        link.href = res.fileData.startsWith("/uploads/") ? `${backendUrl}${res.fileData}` : res.fileData;
        link.download = res.fileName || `${res.title.replace(/\s+/g, "_")}.${res.format.toLowerCase()}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        alert(`"${res.title}" is downloading successfully!`);
      }
    }, 1200);
  };

  const renderResources = () => {
    const resources = product.resources || [];

    if (resources.length === 0) {
      return (
        <div className="w-full bg-white rounded-xl border border-neutral-100 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.06)] p-16 text-center flex flex-col items-center justify-center">
          <Download className="w-10 h-10 text-neutral-300 mb-3" />
          <h4 className="text-sm font-bold text-secondary tracking-tight mb-1">
            Downloads & Resources
          </h4>
          <p className="text-xs text-neutral-400 font-normal">
            No downloadable resources or catalog sheets are currently available for this product.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-10">
        {/* Resources Document Grid */}
        <div className="space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
              Technical library
            </span>
            <h3 className="text-xl font-bold text-secondary tracking-tight">
              Downloads & Spec Sheets
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-5 lg:gap-6">
            {resources.map((res) => (
              <div
                key={res.id}
                className="p-5 bg-white border border-neutral-100 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.06)] hover:border-neutral-200/80 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-6 group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span
                      className={cn(
                        "px-2.5 py-1 text-[9px] font-bold tracking-widest uppercase rounded-lg border",
                        res.colorClass ||
                        "bg-neutral-50 text-neutral-600 border-neutral-100",
                      )}
                    >
                      {res.format}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-neutral-400">
                      {res.size}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="text-sm font-bold text-secondary group-hover:text-primary transition-colors duration-200">
                      {res.title}
                    </h4>
                    <p className="text-xs leading-relaxed text-neutral-400 font-normal">
                      {res.desc}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleDownload(res)}
                  disabled={downloadingId !== null}
                  className={cn(
                    "w-full py-3 text-[10px] font-bold uppercase tracking-widest rounded-lg border flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 active:scale-[0.98] disabled:opacity-50",
                    downloadingId === res.id
                      ? "bg-neutral-50 border-neutral-200 text-neutral-400"
                      : "bg-neutral-50/50 border-neutral-100 text-secondary hover:bg-primary hover:text-white hover:border-primary hover:shadow-[0_10px_20px_-10px_rgba(237,28,39,0.2)]",
                  )}
                >
                  {downloadingId === res.id ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-neutral-300 border-t-neutral-500 rounded-full animate-spin" />
                      Downloading Spec Assets...
                    </>
                  ) : (
                    <>
                      <Download
                        size={12}
                        strokeWidth={2.5}
                        className="group-hover:translate-y-0.5 transition-transform duration-200"
                      />
                      {res.fileData ? `Download ${res.format}` : `Download ${res.format}`}
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="bg-white min-h-screen">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-10 lg:py-16">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Left: Product Media Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-[4/3] bg-neutral-50/50 rounded-xl overflow-hidden border border-neutral-100 shadow-[0_15px_45px_-20px_rgba(0,0,0,0.08)] group">
                <Image
                  src={product.images[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  priority
                />

                {/* Maximize expand image option */}
                <button
                  onClick={() => setIsExpanded(true)}
                  className="absolute bottom-6 right-6 p-3.5 bg-white/95 backdrop-blur-md shadow-premium rounded-xl text-secondary hover:text-primary hover:bg-white hover:scale-110 active:scale-95 group/btn cursor-pointer transition-all duration-300"
                >
                  <Maximize2
                    size={18}
                    className="group-hover/btn:rotate-12 transition-transform duration-300"
                  />
                </button>
              </div>

              {/* Thumbnail Gallery indicators */}
              {product.images.length > 1 ? (
                <div className="grid grid-cols-4 gap-4">
                  {product.images.map((img: string, i: number) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={cn(
                        "relative aspect-square rounded-xl overflow-hidden border-2 hover:scale-[1.03] active:scale-95 transition-all duration-300",
                        selectedImage === i
                          ? "border-primary shadow-lg shadow-primary/5"
                          : "border-transparent bg-neutral-50/70 hover:border-neutral-200",
                      )}
                    >
                      <Image
                        src={img}
                        alt={`${product.name} thumbnail ${i}`}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex gap-4 p-4.5 rounded-xl bg-neutral-50/40 border border-neutral-100/50 items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                      <Sparkles size={14} />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-[10px] font-bold text-secondary uppercase tracking-widest">
                        Original Angle View
                      </h4>
                      <p className="text-[9px] text-neutral-400 font-normal">
                        Original studio layout shot of model series.
                      </p>
                    </div>
                  </div>
                  <span className="text-[8px] font-mono text-neutral-400 uppercase tracking-widest">
                    Western Studio
                  </span>
                </div>
              )}
            </div>

            {/* Right: Product summary card configurations */}
            <div className="space-y-6">
              <div className="space-y-3">
                <h1 className="text-3xl lg:text-4xl font-bold text-secondary leading-tight tracking-tight">
                  {product.name}
                </h1>

                {/* Modern Price Display */}
                <div className="flex items-baseline gap-4 py-2 border-y border-neutral-100/50">
                  <span className="text-[9px] font-semibold text-neutral-400 uppercase tracking-[0.2em] self-center">
                    Est. Investment
                  </span>
                  <p className="text-3xl font-extrabold text-primary tracking-tight">
                    {product.price === "Price on Request" || !product.price
                      ? "Price on Request"
                      : `₹${product.price}`}
                  </p>
                  {product.price !== "Price on Request" && (
                    <span className="text-[9px] font-semibold text-neutral-400 uppercase tracking-widest leading-none">
                      Starting Rate
                    </span>
                  )}
                </div>

                <p className="text-neutral-500 leading-relaxed text-sm font-normal pt-1">
                  {product.description}
                </p>
              </div>

              {/* Modern Trust bar props cards grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4">
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-neutral-50/30 border border-neutral-100 hover:bg-neutral-50/60 hover:-translate-y-0.5 transition-all duration-300 group">
                  <div className="w-8.5 h-8.5 rounded-xl bg-primary/5 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <ShieldCheck size={16} />
                  </div>
                  <div>
                    <h5 className="text-[10px] font-semibold text-secondary uppercase tracking-widest">
                      BIFMA Quality
                    </h5>
                    <p className="text-[9px] text-neutral-400 font-normal leading-tight mt-0.5">
                      Heavy industrial standards
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-neutral-50/30 border border-neutral-100 hover:bg-neutral-50/60 hover:-translate-y-0.5 transition-all duration-300 group">
                  <div className="w-8.5 h-8.5 rounded-xl bg-primary/5 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <Award size={16} />
                  </div>
                  <div>
                    <h5 className="text-[10px] font-semibold text-secondary uppercase tracking-widest">
                      Direct Factory
                    </h5>
                    <p className="text-[9px] text-neutral-400 font-normal leading-tight mt-0.5">
                      Zero intermediary markups
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-neutral-50/30 border border-neutral-100 hover:bg-neutral-50/60 hover:-translate-y-0.5 transition-all duration-300 group">
                  <div className="w-8.5 h-8.5 rounded-xl bg-primary/5 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <Zap size={16} />
                  </div>
                  <div>
                    <h5 className="text-[10px] font-semibold text-secondary uppercase tracking-widest">
                      5Y Warranty
                    </h5>
                    <p className="text-[9px] text-neutral-400 font-normal leading-tight mt-0.5">
                      Assured structural coverage
                    </p>
                  </div>
                </div>
              </div>

              {/* Dynamic Interactive Variants customizer options */}
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-4 py-4 border-t border-neutral-100">
                  {product.variants.map((variant) => (
                    <div key={variant.label} className="space-y-3">
                      <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest">
                        <span className="text-secondary/40">
                          Choose {variant.label}
                        </span>
                        <span className="text-primary font-bold">
                          {selectedVariants[variant.label]}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {variant.options.map((option: string) => (
                          <button
                            key={option}
                            onClick={() =>
                              setSelectedVariants((prev) => ({
                                ...prev,
                                [variant.label]: option,
                              }))
                            }
                            className={cn(
                              "px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest border cursor-pointer active:scale-95 transition-all duration-300",
                              selectedVariants[variant.label] === option
                                ? "bg-secondary text-white border-secondary shadow-[0_10px_20px_-10px_rgba(0,0,0,0.2)] scale-[1.02]"
                                : "bg-white text-neutral-400 border-neutral-100 hover:border-neutral-300 hover:text-secondary",
                            )}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Key specification markers display */}
              {product.specifications && product.specifications.length > 0 && (
                <div className="grid grid-cols-3 gap-y-4 gap-x-8 pt-4 border-t border-neutral-100">
                  {product.specifications.map((spec) => (
                    <div key={spec.label} className="space-y-1 group">
                      <span className="text-[9px] font-semibold text-neutral-400 uppercase tracking-widest block">
                        {spec.label}
                      </span>
                      <span className="text-xs font-semibold text-secondary uppercase tracking-tight block group-hover:text-primary">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Responsive CTA Buttons Grid */}
              <div className="grid sm:grid-cols-3 gap-3.5 pt-4">
                <button
                  className="inline-flex items-center justify-center gap-2 px-4 py-4.5 bg-gradient-to-r from-primary to-[#ff3b45] text-white font-bold uppercase tracking-widest text-[10px] rounded-xl hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/20 shadow-md shadow-primary/10 cursor-pointer active:scale-[0.98] transition-all duration-300"
                  onClick={handleGetQuote}
                >
                  <FileText size={14} strokeWidth={2.5} />
                  Get A Quote
                </button>

                <button
                  className="inline-flex items-center justify-center gap-2 px-4 py-4.5 bg-secondary text-white font-bold uppercase tracking-widest text-[10px] rounded-xl hover:bg-neutral-800 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-secondary/20 shadow-md shadow-secondary/10 cursor-pointer active:scale-[0.98] transition-all duration-300"
                  onClick={() =>
                    (window.location.href = `tel:${contact.phoneRaw}`)
                  }
                >
                  <Phone size={13} strokeWidth={2.5} />
                  Call Direct
                </button>

                <button
                  className="inline-flex items-center justify-center gap-2 px-4 py-4.5 bg-emerald-600 text-white font-bold uppercase tracking-widest text-[10px] rounded-xl hover:bg-emerald-700 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-600/20 shadow-md shadow-emerald-600/10 cursor-pointer active:scale-[0.98] transition-all duration-300"
                  onClick={() =>
                    window.open(
                      `https://wa.me/${contact.phones[0].replace(/[^0-9]/g, "")}?text=Hi, I am interested in ${product.name} (SKU ID: ${product.id}). Please share customized layouts.`,
                      "_blank",
                    )
                  }
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.588 1.485 5.407 1.486 5.417 0 9.822-4.36 9.825-9.711.002-2.592-1.002-5.029-2.828-6.858C17.227 2.241 14.801 1.24 12.01 1.24c-5.42 0-9.827 4.36-9.831 9.713a9.58 9.58 0 0 0 1.464 5.093L2.6 21.43l5.524-1.437l-.477-.282zm9.954-6.83c-.274-.137-1.62-.796-1.87-.887-.252-.09-.435-.137-.617.137-.182.274-.708.887-.868 1.066-.16.182-.32.203-.594.067-.274-.137-1.162-.426-2.214-1.36c-.82-.727-1.374-1.625-1.535-1.897-.16-.273-.017-.42.12-.557.123-.122.274-.32.411-.478.137-.16.182-.273.274-.455.092-.182.046-.341-.023-.478-.069-.137-.618-1.483-.846-2.03c-.22-.53-.446-.458-.618-.467-.16-.008-.343-.01-.525-.01a1.01 1.01 0 0 0-.73.34c-.252.274-.96.938-.96 2.287s.983 2.65 1.12 2.83c.137.182 1.935 2.923 4.69 4.103c.655.282 1.167.45 1.567.576.66.21 1.26.162 1.735.092.53-.078 1.62-.66 1.85-1.294.228-.636.228-1.183.16-1.295-.069-.113-.252-.204-.526-.341z" />
                  </svg>
                  WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Detail Tabs Section with Glassmorphic design */}
        {tabs.length > 0 && (
          <div className="border-t border-neutral-100 bg-neutral-50/20 py-16 relative">
            <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
              {/* Sticky Tab headers row */}
              <div className="sticky top-14 lg:top-16 z-40 backdrop-blur-md bg-white/95 border-b border-neutral-200/60 shadow-[0_4px_25px_-12px_rgba(0,0,0,0.03)] -mx-6 lg:-mx-12 px-6 lg:px-12 py-0 flex items-center justify-center overflow-x-auto scrollbar-none gap-2 md:gap-4 mb-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "px-4 md:px-6 py-3 text-[10px] md:text-xs font-bold uppercase tracking-widest border-b-2 whitespace-nowrap cursor-pointer relative transition-all duration-300",
                      activeTab === tab.id
                        ? "border-primary text-primary"
                        : "border-transparent text-neutral-400 hover:text-secondary hover:border-neutral-200",
                    )}
                  >
                    {tab.label}
                    {activeTab === tab.id && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                    )}
                  </button>
                ))}
              </div>

              {/* Tab content panel views */}
              <div className="py-2">
                {activeTab === "details" && renderProductDetails()}
                {activeTab === "specs" && renderSpecifications()}
                {activeTab === "dimensions" && renderDimensions()}
                {activeTab === "resources" && renderResources()}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Full Screen Image Preview Overlay */}
      <ImagePreview
        isOpen={isExpanded}
        images={product.images.map((url: string) => ({
          url,
          title: product.name,
        }))}
        index={selectedImage}
        onClose={() => setIsExpanded(false)}
        onNext={() =>
          setSelectedImage((prev) => (prev + 1) % product.images.length)
        }
        onPrev={() =>
          setSelectedImage(
            (prev) =>
              (prev - 1 + product.images.length) % product.images.length,
          )
        }
      />

      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
      />
    </>
  );
}
