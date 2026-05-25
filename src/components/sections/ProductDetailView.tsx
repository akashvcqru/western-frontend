"use client";

import React, { useState } from "react";
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
  const [activeTab, setActiveTab] = useState("details");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [hoveredCoordinate, setHoveredCoordinate] = useState<string | null>(
    null,
  );

  // Custom dynamic selection state hook for admin swatches
  const contact = siteContent.common.contact;

  const handleGetQuote = () => {
    setIsQuoteModalOpen(true);
  };

  const tabs = [
    { id: "details", label: "Product Details" },
    { id: "specs", label: "Specification" },
    { id: "dimensions", label: "Dimension Blueprint" },
    { id: "resources", label: "Downloads & Resources" },
  ];

  const isChair =
    product.category.toLowerCase().includes("chair") ||
    product.name.toLowerCase().includes("chair");
  const isWorkstation =
    product.category.toLowerCase().includes("workstation") ||
    product.name.toLowerCase().includes("workstation");

  const renderProductDetails = () => {
    const featuresToShow =
      product.features ||
      (isChair
        ? [
          {
            title: "Dynamic Lumbar System",
            desc: "Contoured mechanical backrest with adjustable depth tension.",
          },
          {
            title: "Korea Grade-A Aero Mesh",
            desc: "High-elasticity double woven mesh with passive thermal cooling ventilation.",
          },
          {
            title: "Synchronous Multi-Lock",
            desc: "Locks in 4 distinct reclining angles for productive work or relaxed pause.",
          },
          {
            title: "3D Arm Adjustments",
            desc: "Soft PU padded arm supports configurable in height, angle, and depth.",
          },
        ]
        : isWorkstation
          ? [
            {
              title: "Modular Cluster Layouts",
              desc: "Easily scales from linear rows to L-shaped and 120° desk clusters.",
            },
            {
              title: "Dual Integrated Raceways",
              desc: "Separate aluminum channels internally separating power wiring and network lines.",
            },
            {
              title: "Acoustic Shielding Panels",
              desc: "Sound-dampening screen dividers wrapped in rich, durable fire-retardant fabric.",
            },
            {
              title: "Heavy Metal Leg Structure",
              desc: "Solid steel structural components finished in protective electrostatically applied powder coat.",
            },
          ]
          : [
            {
              title: "Veneer Melamine Top Finish",
              desc: "Stunning, high-fidelity wood patterns that are highly scratch and stain resistant.",
            },
            {
              title: "Seamless Soft-Close Rails",
              desc: "Industrial-grade drawer slides for ultra-smooth and silent desk operations.",
            },
            {
              title: "Integrated Cable Ports",
              desc: "Brushed aluminum flip grommets with integrated desk-level power sockets.",
            },
            {
              title: "Anti-Moisture Edgeband",
              desc: "High-pressure hot-melt banding sealing all sides, preventing moisture penetration.",
            },
          ]);

    const defaultQuickSpecs = [
      "100% Anti-Moisture Sealing",
      "High Tensile Frame Strength",
      "BIFMA Level-3 Hardware",
      "Fire-Retardant Upholstery",
    ];
    const quickSpecsToShow =
      product.quickSpecs && product.quickSpecs.length > 0
        ? product.quickSpecs
        : defaultQuickSpecs;

    const defaultText2 =
      "All Western Interio furniture is manufactured using premium grade MDF/PLPB, high-gauge structural steel leg understructures, and world-class certified hardware. We guarantee maximum resistance to heavy daily use, scratches, and liquid spills, making it a sound long-term asset for modern corporate offices.";

    const fallbackText1 = isChair
      ? "Engineered for high-intensity work environments, this premium chair integrates anatomical design principles to dynamically support natural spine alignment. Every curve and control has been carefully tailored to minimize fatigue, enhance thermal comfort, and promote active seating throughout long corporate shifts."
      : isWorkstation
        ? "Crafted for high-density, modern corporate environments, our modular workstations combine a sleek industrial footprint with customizable versatility. This series is engineered to support seamless collaboration while respecting private acoustics, giving teams the perfect foundation for focused productivity."
        : "Designed with clean modern aesthetics and heavy-duty structural engineering, our executive tables and lobby furniture represent the perfect blend of status, functionality, and lasting durability. Made using high-grade panels and hardware, they stand out in any boardroom or reception suite.";

    return (
      <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Visual Storytelling */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/5 text-primary text-[10px] font-semibold uppercase tracking-[0.2em] rounded-lg border border-primary/10">
              <Sparkles size={10} />
              Engineered Excellence
            </span>
            <h3 className="text-2xl lg:text-3xl font-bold text-secondary tracking-tight">
              {product.detailsTitle || "Elevating Workspace Productivity"}
            </h3>
          </div>

          <div className="space-y-4 text-neutral-500 leading-relaxed text-sm font-normal">
            <p>{product.detailsText1 || fallbackText1}</p>
            <p>{product.detailsText2 || defaultText2}</p>
          </div>

          {/* Quick Specifications Checklist */}
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
        </div>

        {/* Right Column: Visual Core Features list inside card */}
        <div className="lg:col-span-5">
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
      </div>
    );
  };

  const renderSpecifications = () => {
    const baseSpecs = product.specifications || [];
    const hasSpec = (label: string) =>
      baseSpecs.some((s) => s.label.toLowerCase() === label.toLowerCase());

    const defaultSpecs = [];
    if (isChair) {
      defaultSpecs.push(
        {
          label: "Seat Mechanism",
          value: "Synchro Tilt with 4 Locking Positions",
        },
        {
          label: "Armrests",
          value: "3D Adjustable (Height, Depth, Angle) with Soft PU pads",
        },
        {
          label: "Gas Lift Cylinder",
          value: "Class 4 Standard (DIN 4550 certified)",
        },
        {
          label: "Pedestal Base",
          value: "Polished Chrome / Heavy Duty Nylon 5-Star (700mm dia)",
        },
        {
          label: "Castor Type",
          value: "60mm Double Wheel Nylon Castors with PU coating",
        },
        {
          label: "Lumbar Assembly",
          value: "Dynamic Mechanical Height & Depth adjustable",
        },
        {
          label: "Upholstery Cover",
          value: "Breathable Korean Nylon Mesh / Fire-Retardant Fabric",
        },
      );
    } else if (isWorkstation) {
      defaultSpecs.push(
        {
          label: "Worktop Thickness",
          value: "25 mm Solid Particle Board (E1 Grade)",
        },
        {
          label: "Surface Finish",
          value: "Sleek Matt Melamine with Anti-Scratch coating",
        },
        {
          label: "Frame Metal",
          value: "Triangular / Rectangular Heavy Gauge Steel Leg",
        },
        {
          label: "Raceway System",
          value: "Integrated metal cable tray with flip-top wire cap",
        },
        {
          label: "Screen Partition",
          value: "Fabric pin-up acoustic partition, 300mm standard height",
        },
        {
          label: "Leg Supports",
          value: "Threaded leveling glides (+15mm height adjustable)",
        },
        {
          label: "Modular Clamping",
          value: "Heavy-duty steel brackets for quick configuration changes",
        },
      );
    } else {
      defaultSpecs.push(
        {
          label: "Main Material",
          value: "Premium Pre-laminated Engineered MDF / Particle Board",
        },
        {
          label: "Surface Finish",
          value: "High-grade scratch-resistant melamine wood coating",
        },
        {
          label: "Desk Legs",
          value: "Heavy architectural wood panels or metal legs",
        },
        {
          label: "Drawer Slides",
          value: "Premium soft-closing slides with 3-section extensions",
        },
        {
          label: "Grommet Cap",
          value: "Dual brush aluminum box with integrated wire slots",
        },
        {
          label: "Safety Lock",
          value: "Central lock for absolute pedestal safety",
        },
      );
    }

    const specsToShow = [...baseSpecs];
    if (baseSpecs.length === 0) {
      defaultSpecs.forEach((ds) => {
        if (!hasSpec(ds.label)) {
          specsToShow.push(ds);
        }
      });
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
    const dimensions =
      product.dimensions ||
      (isChair
        ? [
          {
            name: "Total Chair Height",
            range: "1180 - 1280 mm",
            coord: "height",
          },
          {
            name: "Seat Cushion Height",
            range: "450 - 550 mm",
            coord: "seat-h",
          },
          { name: "Seat Cushion Depth", range: "480 mm", coord: "depth" },
          { name: "Seat Cushion Width", range: "500 mm", coord: "width" },
          { name: "Backrest Mesh Width", range: "460 mm", coord: "mesh" },
          { name: "5-Star Base Diameter", range: "700 mm", coord: "base" },
        ]
        : isWorkstation
          ? [
            {
              name: "Standard Desk Height",
              range: "750 mm",
              coord: "height",
            },
            {
              name: "Desk Width Options",
              range: "1200 / 1400 / 1600 mm",
              coord: "width",
            },
            {
              name: "Desk Depth Options",
              range: "600 / 750 mm",
              coord: "depth",
            },
            {
              name: "Partition Screen Height",
              range: "350 mm / 450 mm",
              coord: "partition",
            },
            {
              name: "Mobile Pedestal Unit",
              range: "400 x 450 x 600 mm",
              coord: "pedestal",
            },
          ]
          : [
            {
              name: "Standard Cabinet Height",
              range: "750 mm",
              coord: "height",
            },
            {
              name: "Cabinet Width Options",
              range: "1500 / 1800 / 2100 mm",
              coord: "width",
            },
            {
              name: "Cabinet Depth Options",
              range: "450 / 500 mm",
              coord: "depth",
            },
            {
              name: "Drawer Storage Compartment",
              range: "400 x 450 x 600 mm",
              coord: "pedestal",
            },
          ]);

    return (
      <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Column: Blueprint Drafting Engine (Mockup Layout) */}
        <div className="lg:col-span-7 relative aspect-[4/3] bg-neutral-900 border border-neutral-800 rounded-xl flex flex-col items-center justify-center p-8 overflow-hidden select-none shadow-2xl">
          {/* Blueprint Grid Styling */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:30px_30px] opacity-15" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-neutral-900/40 to-neutral-900 pointer-events-none" />

          {/* Legend indicator overlay */}
          <div className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-[10px] font-mono text-white/70 uppercase tracking-widest">
              Interactive Hotspots
            </span>
          </div>

          {/* Render blueprint diagrams based on product category / properties */}
          {product.blueprintImage ? (
            <div className="relative w-full h-full flex items-center justify-center p-4">
              <Image
                src={product.blueprintImage}
                alt="Blueprint Layout"
                fill
                className="object-contain opacity-80 animate-in fade-in duration-300"
              />
            </div>
          ) : isChair ? (
            <div className="w-full h-full p-2 flex items-center justify-center">
              <svg
                viewBox="0 0 400 400"
                className="w-full h-full text-white/50"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                {/* Horizontal Top Dimensions */}
                {/* Backrest Width (430) */}
                <g
                  className={cn(
                    "stroke-white/30 text-white/50",
                    hoveredCoordinate === "mesh" &&
                    "stroke-primary text-primary font-bold",
                  )}
                >
                  <line
                    x1="140"
                    y1="40"
                    x2="260"
                    y2="40"
                    strokeDasharray="3,3"
                  />
                  <circle cx="140" cy="40" r="3" fill="currentColor" />
                  <circle cx="260" cy="40" r="3" fill="currentColor" />
                  <text
                    x="200"
                    y="32"
                    className="text-[10px] font-mono text-center fill-current"
                    textAnchor="middle"
                  >
                    430
                  </text>
                </g>

                {/* Total Width (640) */}
                <g
                  className={cn(
                    "stroke-white/30 text-white/50",
                    (hoveredCoordinate === "width" ||
                      hoveredCoordinate === "depth") &&
                    "stroke-primary text-primary font-bold",
                  )}
                >
                  <line
                    x1="100"
                    y1="20"
                    x2="300"
                    y2="20"
                    strokeDasharray="3,3"
                  />
                  <circle cx="100" cy="20" r="3" fill="currentColor" />
                  <circle cx="300" cy="20" r="3" fill="currentColor" />
                  <text
                    x="200"
                    y="12"
                    className="text-[10px] font-mono text-center fill-current"
                    textAnchor="middle"
                  >
                    640
                  </text>
                </g>

                {/* Vertical Side Dimensions */}
                {/* Arm Height (160-210) */}
                <g
                  className={cn(
                    "stroke-white/30 text-white/50",
                    hoveredCoordinate === "depth" &&
                    "stroke-primary text-primary font-bold",
                  )}
                >
                  <line
                    x1="60"
                    y1="160"
                    x2="60"
                    y2="210"
                    strokeDasharray="3,3"
                  />
                  <circle cx="60" cy="160" r="3" fill="currentColor" />
                  <circle cx="60" cy="210" r="3" fill="currentColor" />
                  <text
                    x="50"
                    y="190"
                    className="text-[9px] font-mono fill-current"
                    textAnchor="end"
                  >
                    160-210
                  </text>
                </g>

                {/* Seat Height (240-360) */}
                <g
                  className={cn(
                    "stroke-white/30 text-white/50",
                    hoveredCoordinate === "seat-h" &&
                    "stroke-primary text-primary font-bold",
                  )}
                >
                  <line
                    x1="60"
                    y1="210"
                    x2="60"
                    y2="310"
                    strokeDasharray="3,3"
                  />
                  <circle cx="60" cy="210" r="3" fill="currentColor" />
                  <circle cx="60" cy="310" r="3" fill="currentColor" />
                  <text
                    x="50"
                    y="265"
                    className="text-[9px] font-mono fill-current"
                    textAnchor="end"
                  >
                    240-360
                  </text>
                </g>

                {/* Base height (140) */}
                <g
                  className={cn(
                    "stroke-white/30 text-white/50",
                    hoveredCoordinate === "base" &&
                    "stroke-primary text-primary font-bold",
                  )}
                >
                  <line
                    x1="60"
                    y1="310"
                    x2="60"
                    y2="350"
                    strokeDasharray="3,3"
                  />
                  <circle cx="60" cy="310" r="3" fill="currentColor" />
                  <circle cx="60" cy="350" r="3" fill="currentColor" />
                  <text
                    x="50"
                    y="335"
                    className="text-[9px] font-mono fill-current"
                    textAnchor="end"
                  >
                    140
                  </text>
                </g>

                {/* Backrest mesh frame */}
                <path
                  d="M 140,80 Q 200,75 260,80 Q 285,120 280,180 Q 200,185 120,180 Q 115,120 140,80 Z"
                  className={cn(
                    "transition-colors fill-white/[0.02]",
                    hoveredCoordinate === "mesh"
                      ? "stroke-primary fill-primary/5"
                      : "stroke-white/40",
                  )}
                  strokeWidth={hoveredCoordinate === "mesh" ? 2.5 : 1.5}
                />
                {/* Backrest Inner grid lines */}
                <path
                  d="M 155,90 Q 200,85 245,90 M 150,115 Q 200,110 250,115 M 145,140 Q 200,135 255,140 M 140,165 Q 200,160 260,165"
                  className={cn(
                    "transition-colors",
                    hoveredCoordinate === "mesh"
                      ? "stroke-primary/50"
                      : "stroke-white/20",
                  )}
                />

                {/* Armrests left and right */}
                <path
                  d="M 100,150 Q 100,140 115,140 Q 120,140 120,175 Q 120,210 135,210"
                  className={cn(
                    "transition-colors",
                    hoveredCoordinate === "depth" ||
                      hoveredCoordinate === "width"
                      ? "stroke-primary"
                      : "stroke-white/40",
                  )}
                />
                <path
                  d="M 300,150 Q 300,140 285,140 Q 280,140 280,175 Q 280,210 265,210"
                  className={cn(
                    "transition-colors",
                    hoveredCoordinate === "depth" ||
                      hoveredCoordinate === "width"
                      ? "stroke-primary"
                      : "stroke-white/40",
                  )}
                />

                {/* Seat Cushion */}
                <path
                  d="M 115,200 Q 200,195 285,200 Q 295,225 285,230 Q 200,235 115,230 Q 105,225 115,200 Z"
                  className={cn(
                    "transition-colors fill-white/[0.04]",
                    hoveredCoordinate === "depth" ||
                      hoveredCoordinate === "width" ||
                      hoveredCoordinate === "seat-h"
                      ? "stroke-primary fill-primary/5"
                      : "stroke-white/50",
                  )}
                  strokeWidth={
                    hoveredCoordinate === "depth" ||
                      hoveredCoordinate === "width" ||
                      hoveredCoordinate === "seat-h"
                      ? 2.5
                      : 1.5
                  }
                />

                {/* Cylinder shaft */}
                <path
                  d="M 192,230 L 192,300 L 208,300 L 208,230 Z"
                  className={cn(
                    "transition-colors fill-white/10",
                    hoveredCoordinate === "height" ||
                      hoveredCoordinate === "seat-h"
                      ? "stroke-primary fill-primary/10"
                      : "stroke-white/30",
                  )}
                />
                {/* Hydraulic Collar rings */}
                <line
                  x1="190"
                  y1="250"
                  x2="210"
                  y2="250"
                  className={cn(
                    "transition-colors",
                    hoveredCoordinate === "height" ||
                      hoveredCoordinate === "seat-h"
                      ? "stroke-primary"
                      : "stroke-white/40",
                  )}
                />
                <line
                  x1="190"
                  y1="270"
                  x2="210"
                  y2="270"
                  className={cn(
                    "transition-colors",
                    hoveredCoordinate === "height" ||
                      hoveredCoordinate === "seat-h"
                      ? "stroke-primary"
                      : "stroke-white/40",
                  )}
                />

                {/* 5-Star Base Leg Structure */}
                <g
                  className={cn(
                    "transition-colors",
                    hoveredCoordinate === "base"
                      ? "stroke-primary"
                      : "stroke-white/45",
                  )}
                >
                  {/* Center base hub */}
                  <ellipse
                    cx="200"
                    cy="300"
                    rx="15"
                    ry="5"
                    className="fill-white/10"
                  />

                  {/* Star radiating legs */}
                  {/* Center front */}
                  <path d="M 200,305 Q 200,320 200,345" />
                  {/* Left front */}
                  <path d="M 190,302 Q 150,315 125,335" />
                  {/* Right front */}
                  <path d="M 210,302 Q 250,315 275,335" />
                  {/* Left back */}
                  <path d="M 188,298 Q 140,295 105,310" strokeOpacity={0.6} />
                  {/* Right back */}
                  <path d="M 212,298 Q 260,295 295,310" strokeOpacity={0.6} />

                  {/* Roller Castor wheels */}
                  <circle
                    cx="200"
                    cy="350"
                    r="6"
                    className="fill-neutral-900"
                  />
                  <circle
                    cx="120"
                    cy="338"
                    r="6"
                    className="fill-neutral-900"
                  />
                  <circle
                    cx="280"
                    cy="338"
                    r="6"
                    className="fill-neutral-900"
                  />
                  <circle
                    cx="102"
                    cy="312"
                    r="5"
                    className="fill-neutral-900"
                    strokeOpacity={0.6}
                  />
                  <circle
                    cx="298"
                    cy="312"
                    r="5"
                    className="fill-neutral-900"
                    strokeOpacity={0.6}
                  />
                </g>
              </svg>
            </div>
          ) : isWorkstation ? (
            <div className="w-full h-full p-2 flex items-center justify-center">
              <svg
                viewBox="0 0 400 400"
                className="w-full h-full text-white/50"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                {/* Horizontal top dimension: Width (1200 / 1400 / 1600) */}
                <g
                  className={cn(
                    "stroke-white/30 text-white/50",
                    (hoveredCoordinate === "width" ||
                      hoveredCoordinate === "depth") &&
                    "stroke-primary text-primary font-bold",
                  )}
                >
                  <line
                    x1="80"
                    y1="35"
                    x2="320"
                    y2="35"
                    strokeDasharray="3,3"
                  />
                  <circle cx="80" cy="35" r="3" fill="currentColor" />
                  <circle cx="320" cy="35" r="3" fill="currentColor" />
                  <text
                    x="200"
                    y="27"
                    className="text-[9px] font-mono fill-current"
                    textAnchor="middle"
                  >
                    1200 / 1400 / 1600 mm
                  </text>
                </g>

                {/* Vertical side dimension: Partition Screen (350/450) */}
                <g
                  className={cn(
                    "stroke-white/30 text-white/50",
                    hoveredCoordinate === "partition" &&
                    "stroke-primary text-primary font-bold",
                  )}
                >
                  <line
                    x1="340"
                    y1="90"
                    x2="340"
                    y2="150"
                    strokeDasharray="3,3"
                  />
                  <circle cx="340" cy="90" r="3" fill="currentColor" />
                  <circle cx="340" cy="150" r="3" fill="currentColor" />
                  <text
                    x="350"
                    y="125"
                    className="text-[8px] font-mono fill-current"
                    textAnchor="start"
                  >
                    350 / 450
                  </text>
                </g>

                {/* Vertical side dimension: Desk Height (750) */}
                <g
                  className={cn(
                    "stroke-white/30 text-white/50",
                    hoveredCoordinate === "height" &&
                    "stroke-primary text-primary font-bold",
                  )}
                >
                  <line
                    x1="50"
                    y1="150"
                    x2="50"
                    y2="330"
                    strokeDasharray="3,3"
                  />
                  <circle cx="50" cy="150" r="3" fill="currentColor" />
                  <circle cx="50" cy="330" r="3" fill="currentColor" />
                  <text
                    x="40"
                    y="245"
                    className="text-[9px] font-mono fill-current"
                    textAnchor="end"
                  >
                    750 mm
                  </text>
                </g>

                {/* Back Partition Screen */}
                <path
                  d="M 80,150 L 80,90 L 320,90 L 320,150 Z"
                  className={cn(
                    "transition-colors fill-white/[0.02]",
                    hoveredCoordinate === "partition"
                      ? "stroke-primary fill-primary/5"
                      : "stroke-white/45",
                  )}
                  strokeWidth={hoveredCoordinate === "partition" ? 2.5 : 1.5}
                />
                {/* Partition acoustic felt slot grids */}
                <line
                  x1="120"
                  y1="95"
                  x2="120"
                  y2="145"
                  className={cn(
                    "transition-colors",
                    hoveredCoordinate === "partition"
                      ? "stroke-primary/50"
                      : "stroke-white/20",
                  )}
                />
                <line
                  x1="160"
                  y1="95"
                  x2="160"
                  y2="145"
                  className={cn(
                    "transition-colors",
                    hoveredCoordinate === "partition"
                      ? "stroke-primary/50"
                      : "stroke-white/20",
                  )}
                />
                <line
                  x1="200"
                  y1="95"
                  x2="200"
                  y2="145"
                  className={cn(
                    "transition-colors",
                    hoveredCoordinate === "partition"
                      ? "stroke-primary/50"
                      : "stroke-white/20",
                  )}
                />
                <line
                  x1="240"
                  y1="95"
                  x2="240"
                  y2="145"
                  className={cn(
                    "transition-colors",
                    hoveredCoordinate === "partition"
                      ? "stroke-primary/50"
                      : "stroke-white/20",
                  )}
                />
                <line
                  x1="280"
                  y1="95"
                  x2="280"
                  y2="145"
                  className={cn(
                    "transition-colors",
                    hoveredCoordinate === "partition"
                      ? "stroke-primary/50"
                      : "stroke-white/20",
                  )}
                />

                {/* Main Desk Board Surface */}
                <path
                  d="M 60,150 L 340,150 L 340,175 L 60,175 Z"
                  className={cn(
                    "transition-colors fill-white/[0.04]",
                    hoveredCoordinate === "width" ||
                      hoveredCoordinate === "depth"
                      ? "stroke-primary fill-primary/5"
                      : "stroke-white/50",
                  )}
                  strokeWidth={
                    hoveredCoordinate === "width" ||
                      hoveredCoordinate === "depth"
                      ? 2.5
                      : 1.5
                  }
                />
                {/* Flip-top cable aluminum cap */}
                <rect
                  x="180"
                  y="155"
                  width="40"
                  height="10"
                  rx="1"
                  className={cn(
                    "transition-colors",
                    hoveredCoordinate === "width" ||
                      hoveredCoordinate === "depth"
                      ? "stroke-primary"
                      : "stroke-white/30",
                  )}
                />

                {/* Left metal leg frame */}
                <path
                  d="M 75,175 L 75,330 L 95,330 L 95,175 Z"
                  className={cn(
                    "transition-colors fill-white/5",
                    hoveredCoordinate === "height"
                      ? "stroke-primary fill-primary/10"
                      : "stroke-white/40",
                  )}
                />
                {/* Right metal leg frame */}
                <path
                  d="M 305,175 L 305,330 L 325,330 L 325,175 Z"
                  className={cn(
                    "transition-colors fill-white/5",
                    hoveredCoordinate === "height"
                      ? "stroke-primary fill-primary/10"
                      : "stroke-white/40",
                  )}
                />

                {/* Leveling Glides underneath legs */}
                <ellipse
                  cx="85"
                  cy="332"
                  rx="10"
                  ry="2"
                  className={cn(
                    "transition-colors",
                    hoveredCoordinate === "height"
                      ? "stroke-primary fill-primary"
                      : "stroke-white/30",
                  )}
                />
                <ellipse
                  cx="315"
                  cy="332"
                  rx="10"
                  ry="2"
                  className={cn(
                    "transition-colors",
                    hoveredCoordinate === "height"
                      ? "stroke-primary fill-primary"
                      : "stroke-white/30",
                  )}
                />

                {/* Mobile Pedestal Storage unit under desk */}
                <rect
                  x="130"
                  y="195"
                  width="60"
                  height="100"
                  rx="3"
                  className={cn(
                    "transition-colors fill-white/[0.02]",
                    hoveredCoordinate === "pedestal"
                      ? "stroke-primary fill-primary/5"
                      : "stroke-white/40",
                  )}
                  strokeWidth={hoveredCoordinate === "pedestal" ? 2.5 : 1.5}
                />
                {/* Pedestal drawers handle markers */}
                <line
                  x1="140"
                  y1="215"
                  x2="180"
                  y2="215"
                  className={cn(
                    "transition-colors",
                    hoveredCoordinate === "pedestal"
                      ? "stroke-primary"
                      : "stroke-white/30",
                  )}
                />
                <line
                  x1="140"
                  y1="245"
                  x2="180"
                  y2="245"
                  className={cn(
                    "transition-colors",
                    hoveredCoordinate === "pedestal"
                      ? "stroke-primary"
                      : "stroke-white/30",
                  )}
                />
                <line
                  x1="140"
                  y1="275"
                  x2="180"
                  y2="275"
                  className={cn(
                    "transition-colors",
                    hoveredCoordinate === "pedestal"
                      ? "stroke-primary"
                      : "stroke-white/30",
                  )}
                />
              </svg>
            </div>
          ) : (
            <div className="w-full h-full p-2 flex items-center justify-center">
              <svg
                viewBox="0 0 400 400"
                className="w-full h-full text-white/50"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                {/* Horizontal top dimension: Width (1500 / 1800 / 2100) */}
                <g
                  className={cn(
                    "stroke-white/30 text-white/50",
                    (hoveredCoordinate === "width" ||
                      hoveredCoordinate === "depth") &&
                    "stroke-primary text-primary font-bold",
                  )}
                >
                  <line
                    x1="60"
                    y1="35"
                    x2="340"
                    y2="35"
                    strokeDasharray="3,3"
                  />
                  <circle cx="60" cy="35" r="3" fill="currentColor" />
                  <circle cx="340" cy="35" r="3" fill="currentColor" />
                  <text
                    x="200"
                    y="27"
                    className="text-[9px] font-mono fill-current"
                    textAnchor="middle"
                  >
                    1500 / 1800 / 2100 mm
                  </text>
                </g>

                {/* Vertical side dimension: Cabinet Height (750) */}
                <g
                  className={cn(
                    "stroke-white/30 text-white/50",
                    hoveredCoordinate === "height" &&
                    "stroke-primary text-primary font-bold",
                  )}
                >
                  <line
                    x1="45"
                    y1="90"
                    x2="45"
                    y2="310"
                    strokeDasharray="3,3"
                  />
                  <circle cx="45" cy="90" r="3" fill="currentColor" />
                  <circle cx="45" cy="310" r="3" fill="currentColor" />
                  <text
                    x="35"
                    y="200"
                    className="text-[9px] font-mono fill-current"
                    textAnchor="end"
                  >
                    750 mm
                  </text>
                </g>

                {/* Side dimension: Cabinet Depth (450 / 500) */}
                <g
                  className={cn(
                    "stroke-white/30 text-white/50",
                    hoveredCoordinate === "depth" &&
                    "stroke-primary text-primary font-bold",
                  )}
                >
                  <line
                    x1="340"
                    y1="65"
                    x2="340"
                    y2="90"
                    strokeDasharray="3,3"
                  />
                  <circle cx="340" cy="65" r="3" fill="currentColor" />
                  <circle cx="340" cy="90" r="3" fill="currentColor" />
                  <text
                    x="350"
                    y="80"
                    className="text-[8px] font-mono fill-current"
                    textAnchor="start"
                  >
                    DEPTH: 450 / 500
                  </text>
                </g>

                {/* Marble/Veneer Top Surface board */}
                <path
                  d="M 60,90 L 340,90 L 340,110 L 60,110 Z"
                  className={cn(
                    "transition-colors fill-white/[0.04]",
                    hoveredCoordinate === "width" ||
                      hoveredCoordinate === "depth"
                      ? "stroke-primary fill-primary/5"
                      : "stroke-white/50",
                  )}
                  strokeWidth={
                    hoveredCoordinate === "width" ||
                      hoveredCoordinate === "depth"
                      ? 2.5
                      : 1.5
                  }
                />

                {/* Main Storage Cabinet Body Box */}
                <rect
                  x="60"
                  y="110"
                  width="280"
                  height="160"
                  rx="2"
                  className={cn(
                    "transition-colors fill-white/[0.02]",
                    hoveredCoordinate === "pedestal"
                      ? "stroke-primary fill-primary/5"
                      : "stroke-white/45",
                  )}
                  strokeWidth={hoveredCoordinate === "pedestal" ? 2.5 : 1.5}
                />

                {/* 3 Cupboard/Pedestal Doors */}
                {/* Door 1 */}
                <rect
                  x="65"
                  y="115"
                  width="86"
                  height="150"
                  rx="1"
                  className={cn(
                    "transition-colors",
                    hoveredCoordinate === "pedestal"
                      ? "stroke-primary"
                      : "stroke-white/35",
                  )}
                />
                {/* Door 2 */}
                <rect
                  x="157"
                  y="115"
                  width="86"
                  height="150"
                  rx="1"
                  className={cn(
                    "transition-colors",
                    hoveredCoordinate === "pedestal"
                      ? "stroke-primary"
                      : "stroke-white/35",
                  )}
                />
                {/* Door 3 */}
                <rect
                  x="249"
                  y="115"
                  width="86"
                  height="150"
                  rx="1"
                  className={cn(
                    "transition-colors",
                    hoveredCoordinate === "pedestal"
                      ? "stroke-primary"
                      : "stroke-white/35",
                  )}
                />

                {/* Cupboard door profile handles */}
                <line
                  x1="140"
                  y1="170"
                  x2="140"
                  y2="210"
                  className={cn(
                    "transition-colors",
                    hoveredCoordinate === "pedestal"
                      ? "stroke-primary"
                      : "stroke-white/40",
                  )}
                />
                <line
                  x1="168"
                  y1="170"
                  x2="168"
                  y2="210"
                  className={cn(
                    "transition-colors",
                    hoveredCoordinate === "pedestal"
                      ? "stroke-primary"
                      : "stroke-white/40",
                  )}
                />
                <line
                  x1="260"
                  y1="170"
                  x2="260"
                  y2="210"
                  className={cn(
                    "transition-colors",
                    hoveredCoordinate === "pedestal"
                      ? "stroke-primary"
                      : "stroke-white/40",
                  )}
                />

                {/* Support Legs base under cabinet */}
                {/* Left metal foot bracket */}
                <path
                  d="M 80,270 L 70,310 L 90,310 L 90,270"
                  className={cn(
                    "transition-colors fill-white/10",
                    hoveredCoordinate === "height"
                      ? "stroke-primary fill-primary/10"
                      : "stroke-white/40",
                  )}
                />
                {/* Right metal foot bracket */}
                <path
                  d="M 320,270 L 330,310 L 310,310 L 310,270"
                  className={cn(
                    "transition-colors fill-white/10",
                    hoveredCoordinate === "height"
                      ? "stroke-primary fill-primary/10"
                      : "stroke-white/40",
                  )}
                />
                {/* Center safety foot support */}
                <path
                  d="M 200,270 L 200,310"
                  className={cn(
                    "transition-colors",
                    hoveredCoordinate === "height"
                      ? "stroke-primary"
                      : "stroke-white/30",
                  )}
                />
              </svg>
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
        link.href = res.fileData;
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
    const resources = product.resources || [
      {
        id: "datasheet",
        title: "Technical Specification Sheet",
        desc: "Complete architectural catalog sheets, material compositions, and durability rankings.",
        format: "PDF",
        size: "1.8 MB",
        colorClass: "bg-red-50 text-red-600 border-red-100",
      },
      {
        id: "cad",
        title: "2D & 3D CAD Blocks (DWG / STEP)",
        desc: "Pre-modeled scale layouts for AutoCAD, SketchUp, and Revit interior spacing design.",
        format: "ZIP / DWG",
        size: "3.2 MB",
        colorClass: "bg-blue-50 text-blue-600 border-blue-100",
      },
      {
        id: "ergo",
        title: "Workspace Ergonomics Guide",
        desc: "Best practices, posture calibrations, and structural seat adjustment suggestions.",
        format: "PDF",
        size: "950 KB",
        colorClass: "bg-amber-50 text-amber-600 border-amber-100",
      },
      {
        id: "warranty",
        title: "5-Year Warranty Certificate",
        desc: "Full terms & conditions covering industrial steel parts, foam density, and structural integrity.",
        format: "PDF",
        size: "1.2 MB",
        colorClass: "bg-emerald-50 text-emerald-600 border-emerald-100",
      },
    ];

    return (
      <div className="space-y-10">
        {/* Cinema-Style Video Showcase Container */}
        <div className="bg-neutral-950 rounded-xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] p-6 lg:p-8 space-y-6 border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />

          <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-center relative z-10">
            <div className="lg:col-span-5 space-y-4">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-500/10 text-red-500 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-red-500/15">
                <Play size={10} className="fill-current" />
                Video Presentation
              </span>
              <h3 className="text-2xl font-bold text-white tracking-tight leading-tight">
                {isChair
                  ? "Ergonomic Seating In Action"
                  : "Modular Assembly & Quality Showcase"}
              </h3>
              <p className="text-xs text-neutral-400 font-normal leading-relaxed">
                Take a virtual tour and explore the advanced manufacturing,
                materials, modular flexibility, and aesthetic detailing that go
                into Western Interio products. See the components in action,
                demonstrating quick customization and long-term ergonomic
                capabilities.
              </p>
              <div className="flex flex-wrap gap-4 pt-3 text-[10px] font-mono text-neutral-500">
                <span className="inline-flex items-center gap-1.5 text-neutral-300 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  YouTube HD 1080p
                </span>
                <span className="text-neutral-700">|</span>
                <span>Duration: 3m 45s</span>
              </div>
            </div>
            {/* Embedded YouTube video with aspect-video */}
            <div className="lg:col-span-7 relative aspect-video rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-neutral-900 ring-4 ring-white/[0.02]">
              <iframe
                className="w-full h-full border-none"
                src={
                  isChair
                    ? "https://www.youtube.com/embed/ScMzIvxBSi4"
                    : "https://www.youtube.com/embed/7V-w0D0D1l0"
                }
                title="Western Interio Video Showcase"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        </div>

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
                      {res.fileData ? `Download ${res.format}` : (
                        <>
                          {res.id === "datasheet" && "Download Tech Spec PDF"}
                          {res.id === "cad" && "Download CAD Blocks ZIP"}
                          {res.id === "ergo" && "Download Ergonomics Guide"}
                          {res.id === "warranty" && "Download Warranty Certificate"}
                          {!["datasheet", "cad", "ergo", "warranty"].includes(res.id) && `Download ${res.format}`}
                        </>
                      )}
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
                <div className="grid grid-cols-2 gap-y-4 gap-x-8 pt-4 border-t border-neutral-100">
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
                    (window.location.href = `tel:${contact.phone}`)
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
