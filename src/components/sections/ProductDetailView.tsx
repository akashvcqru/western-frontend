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
  Check
} from "lucide-react";
import { cn } from "@/lib/utils";
import ImagePreview from "@/components/ui/ImagePreview";
import siteContent from "@/data/site-content.json";
import QuoteModal from "@/components/common/QuoteModal";

interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  price?: string;
  description?: string;
  images: string[];
  variants?: { label: string; options: string[] }[];
  specifications?: { label: string; value: string }[];
  catNo?: string;
}

interface ProductDetailViewProps {
  product: Product;
}

export default function ProductDetailView({ product }: ProductDetailViewProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>(
    (product.variants || []).reduce((acc: Record<string, string>, v) => ({ ...acc, [v.label]: v.options[0] }), {})
  );
  const [isExpanded, setIsExpanded] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  
  const [activeTab, setActiveTab] = useState("details");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const contact = siteContent.common.contact;
  
  const handleGetQuote = () => {
    setIsQuoteModalOpen(true);
  };

  const tabs = [
    { id: "details", label: "Product Details" },
    { id: "specs", label: "Specification" },
    { id: "dimensions", label: "Dimension" },
    { id: "options", label: "Options" },
    { id: "resources", label: "Resources" }
  ];

  const isChair = product.category.toLowerCase().includes("chair") || product.name.toLowerCase().includes("chair");
  const isWorkstation = product.category.toLowerCase().includes("workstation") || product.name.toLowerCase().includes("workstation");

  const renderProductDetails = () => {
    return (
      <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-start">
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-secondary tracking-tight">
            Elevating Workspace Productivity
          </h3>
          <p className="text-neutral-500 leading-relaxed text-sm font-normal">
            {isChair && (
              "Engineered for high-intensity work environments, this premium chair integrates anatomical design principles to dynamically support natural spine alignment. Every curve and control has been carefully tailored to minimize fatigue, enhance thermal comfort, and promote active seating throughout long corporate shifts."
            )}
            {isWorkstation && (
              "Crafted for high-density, modern corporate environments, our modular workstations combine a sleek industrial footprint with customizable versatility. This series is engineered to support seamless collaboration while respecting private acoustics, giving teams the perfect foundation for focused productivity."
            )}
            {!isChair && !isWorkstation && (
              "Designed with clean modern aesthetics and heavy-duty structural engineering, our executive tables and lobby furniture represent the perfect blend of status, functionality, and lasting durability. Made using high-grade panels and hardware, they stand out in any boardroom or reception suite."
            )}
          </p>
          <p className="text-neutral-500 leading-relaxed text-sm font-normal">
            All Western Interio furniture is manufactured using premium grade MDF/PLPB, high-gauge structural steel framing, and world-class hardware. We guarantee maximum resistance to heavy daily use, scratches, and liquid spills, making it a sound long-term asset for modern corporate offices.
          </p>
        </div>
        <div className="bg-white p-8 rounded-2xl border border-neutral-100 shadow-premium space-y-6">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-secondary/70">
            Core Features & Highlights
          </h4>
          <div className="space-y-4">
            {isChair && [
              { title: "Dynamic Lumbar System", desc: "Contoured backrest with adjustable tension and depth." },
              { title: "Korea Grade-A Aero Mesh", desc: "High-elasticity mesh with advanced cooling ventilation." },
              { title: "Synchronous Multi-Lock", desc: "Locks in 4 distinct reclining angles for work or relax modes." },
              { title: "3D Arm Adjustments", desc: "Configurable heights, angles, and slide options for elbow support." }
            ].map((f, i) => (
              <div key={i} className="flex gap-4">
                <CheckCircle2 className="text-primary shrink-0 w-5 h-5 mt-0.5" />
                <div>
                  <h5 className="text-sm font-semibold text-secondary">{f.title}</h5>
                  <p className="text-xs text-neutral-500 font-normal">{f.desc}</p>
                </div>
              </div>
            ))}

            {isWorkstation && [
              { title: "Modular Cluster Layouts", desc: "Easily scales from linear rows to L-shaped and 120° desk clusters." },
              { title: "Dual Integrated Raceways", desc: "Separate internal channels for electrical cables and network lines." },
              { title: "Acoustic Shielding Panels", desc: "Sound-dampening screen dividers wrapped in rich fire-retardant fabric." },
              { title: "Heavy Gauge Metal Understructure", desc: "Finished in protective electrostatically applied epoxy powder coat." }
            ].map((f, i) => (
              <div key={i} className="flex gap-4">
                <CheckCircle2 className="text-primary shrink-0 w-5 h-5 mt-0.5" />
                <div>
                  <h5 className="text-sm font-semibold text-secondary">{f.title}</h5>
                  <p className="text-xs text-neutral-500 font-normal">{f.desc}</p>
                </div>
              </div>
            ))}

            {!isChair && !isWorkstation && [
              { title: "Veneer Melamine Top Finish", desc: "Stunning wood patterns, highly scratch and stain resistant." },
              { title: "Seamless Soft-Close Rails", desc: "Industrial drawer glides for smooth, silent operations." },
              { title: "Integrated Cable Ports", desc: "Brushed aluminum flip grommets with integrated desk-level sockets." },
              { title: "Anti-Moisture Edgeband", desc: "High-pressure hot-melt banding prevents moisture penetration." }
            ].map((f, i) => (
              <div key={i} className="flex gap-4">
                <CheckCircle2 className="text-primary shrink-0 w-5 h-5 mt-0.5" />
                <div>
                  <h5 className="text-sm font-semibold text-secondary">{f.title}</h5>
                  <p className="text-xs text-neutral-500 font-normal">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderSpecifications = () => {
    const baseSpecs = product.specifications || [];
    const hasSpec = (label: string) => baseSpecs.some(s => s.label.toLowerCase() === label.toLowerCase());
    
    const defaultSpecs = [];
    if (isChair) {
      defaultSpecs.push(
        { label: "Seat Mechanism", value: "Synchro Tilt with 4 Locking Positions" },
        { label: "Armrests", value: "3D Adjustable (Height, Depth, Angle) with Soft PU pads" },
        { label: "Gas Lift Cylinder", value: "Class 4 Standard (DIN 4550 certified)" },
        { label: "Pedestal Base", value: "Polished Chrome / Heavy Duty Nylon 5-Star (700mm dia)" },
        { label: "Castor Type", value: "60mm Double Wheel Nylon Castors with PU coating" },
        { label: "Lumbar Assembly", value: "Dynamic Mechanical Height & Depth adjustable" },
        { label: "Upholstery Cover", value: "Breathable Korean Nylon Mesh / Fire-Retardant Fabric" }
      );
    } else if (isWorkstation) {
      defaultSpecs.push(
        { label: "Worktop Thickness", value: "25 mm Solid Particle Board (E1 Grade)" },
        { label: "Surface Finish", value: "Sleek Matt Melamine with Anti-Scratch coating" },
        { label: "Frame Metal", value: "Triangular / Rectangular Heavy Gauge Steel Leg" },
        { label: "Raceway System", value: "Integrated metal cable tray with flip-top wire cap" },
        { label: "Screen Partition", value: "Fabric pin-up acoustic partition, 300mm standard height" },
        { label: "Leg Supports", value: "Threaded leveling glides (+15mm height adjustable)" },
        { label: "Modular Clamping", value: "Heavy-duty steel brackets for quick configuration changes" }
      );
    } else {
      defaultSpecs.push(
        { label: "Main Material", value: "Premium Pre-laminated Engineered MDF / Particle Board" },
        { label: "Surface Finish", value: "High-grade scratch-resistant melamine wood coating" },
        { label: "Desk Legs", value: "Heavy architectural wood panels or metal legs" },
        { label: "Drawer Slides", value: "Premium soft-closing slides with 3-section extensions" },
        { label: "Grommet Cap", value: "Dual brush aluminum box with integrated wire slots" },
        { label: "Safety Lock", value: "Central lock for absolute pedestal safety" }
      );
    }

    const specsToShow = [...baseSpecs];
    defaultSpecs.forEach(ds => {
      if (!hasSpec(ds.label)) {
        specsToShow.push(ds);
      }
    });

    return (
      <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-neutral-100 shadow-premium overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-neutral-50 border-b border-neutral-100">
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-secondary/80">Technical Property</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-secondary/80">Factory Specification</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {specsToShow.map((spec, index) => (
              <tr key={index} className="hover:bg-neutral-50/50 transition-colors">
                <td className="px-6 py-4 text-xs font-medium text-neutral-500 tracking-wide uppercase">{spec.label}</td>
                <td className="px-6 py-4 text-xs font-normal text-secondary">{spec.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderDimensions = () => {
    const dimensions = isChair ? [
      { name: "Total Chair Height", range: "1180 - 1280 mm" },
      { name: "Seat Cushion Height", range: "450 - 550 mm" },
      { name: "Seat Depth Cushion", range: "480 mm" },
      { name: "Seat Width Cushion", range: "500 mm" },
      { name: "Backrest Mesh Width", range: "460 mm" },
      { name: "5-Star Base Diameter", range: "700 mm" }
    ] : isWorkstation ? [
      { name: "Standard Desk Height", range: "750 mm" },
      { name: "Desk Width Options", range: "1200 / 1400 / 1600 mm" },
      { name: "Desk Depth Options", range: "600 / 750 mm" },
      { name: "Partition Screen Height", range: "350 mm / 450 mm" },
      { name: "Mobile Pedestal Unit", range: "400 x 450 x 600 mm" }
    ] : [
      { name: "Standard Desk Height", range: "750 mm" },
      { name: "Desk Width Options", range: "1500 / 1800 / 2100 mm" },
      { name: "Desk Depth Options", range: "750 / 900 mm" },
      { name: "Drawer Storage Pedestal", range: "400 x 500 x 650 mm" }
    ];

    return (
      <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left: Schematic Mockup */}
        <div className="relative aspect-[4/3] bg-neutral-100 border border-neutral-200/60 rounded-2xl flex flex-col items-center justify-center p-8 overflow-hidden select-none">
          {/* Blueprint Background Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] bg-[size:24px_24px] opacity-30" />
          
          {/* technical layout */}
          {isChair ? (
            <div className="relative w-40 h-60 border border-dashed border-primary/20 flex flex-col items-center justify-between p-2">
              <div className="w-24 h-28 border-2 border-secondary rounded-2xl flex flex-col items-center justify-center bg-white shadow-premium relative">
                <span className="text-[10px] font-mono text-neutral-400 absolute top-2 font-normal">MESH BACK</span>
                <span className="text-[9px] font-mono text-primary font-medium">W: 460mm</span>
              </div>
              <div className="w-28 h-6 border-2 border-secondary rounded-lg bg-white shadow-sm flex items-center justify-center relative -mt-4">
                <span className="text-[9px] font-mono text-primary font-medium">D: 480mm</span>
                <div className="absolute top-1/2 left-full w-8 border-t border-dashed border-primary flex items-center">
                  <span className="text-[7px] font-mono text-primary ml-1 whitespace-nowrap">SEAT H: 450-550</span>
                </div>
              </div>
              <div className="w-1.5 h-12 bg-secondary relative">
                <div className="absolute top-1/2 left-full w-12 border-t border-dashed border-primary flex items-center">
                  <span className="text-[7px] font-mono text-primary ml-1 whitespace-nowrap">CYLINDER</span>
                </div>
              </div>
              <div className="w-32 h-6 border-2 border-secondary rounded-full bg-white flex items-center justify-center relative">
                <span className="text-[9px] font-mono text-primary font-medium">BASE: Ø 700mm</span>
              </div>
            </div>
          ) : (
            <div className="relative w-64 h-40 border border-dashed border-primary/20 flex flex-col items-center justify-between p-4">
              <div className="w-full h-8 border border-secondary/50 bg-neutral-200 rounded flex items-center justify-center relative">
                <span className="text-[8px] font-mono text-neutral-500 font-normal">ACOUSTIC PARTITION H: 350mm</span>
              </div>
              <div className="w-full h-16 border-2 border-secondary rounded bg-white shadow-premium flex items-center justify-center relative">
                <span className="text-[9px] font-mono text-primary font-medium">TOP WIDTH: 1200/1400/1600mm</span>
                <div className="absolute top-0 right-full h-full border-r border-dashed border-primary flex items-center">
                  <span className="text-[7px] font-mono text-primary mr-1 whitespace-nowrap -rotate-90">DESK H: 750</span>
                </div>
                <div className="absolute bottom-full left-1/4 h-8 border-l border-dashed border-primary flex items-center">
                  <span className="text-[7px] font-mono text-primary ml-1 whitespace-nowrap">DEPTH: 600/750</span>
                </div>
              </div>
              <div className="flex justify-between w-full px-4">
                <div className="w-4 h-12 bg-secondary/80 rounded-b" />
                <div className="w-12 h-12 border border-secondary bg-white rounded flex items-center justify-center relative">
                  <span className="text-[7px] font-mono text-neutral-400 font-normal">PEDESTAL</span>
                </div>
                <div className="w-4 h-12 bg-secondary/80 rounded-b" />
              </div>
            </div>
          )}
          
          <span className="absolute bottom-4 right-4 text-[9px] font-mono text-neutral-400 uppercase tracking-widest font-normal">Western Drafting Engine</span>
        </div>

        {/* Right: Dimensions Table */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-secondary tracking-tight">Ergonomically Standardized</h3>
            <p className="text-sm text-neutral-500 font-normal leading-relaxed">
              We design all modular structures and seating using standard corporate safety indices to prevent fatigue, back-pain, and repetitive strain.
            </p>
          </div>
          <div className="divide-y divide-neutral-100">
            {dimensions.map((dim, i) => (
              <div key={i} className="flex justify-between items-center py-4">
                <span className="text-xs font-medium text-neutral-500 tracking-wide uppercase">{dim.name}</span>
                <span className="text-sm font-mono font-medium text-secondary">{dim.range}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderOptions = () => {
    const tableTops = [
      { name: "Premium Oak", hex: "#d8b589", desc: "Warm natural oak woodgrain" },
      { name: "Bavarian Beech", hex: "#e5caab", desc: "Light warm clean beechwood" },
      { name: "Frosty White", hex: "#f8f9fa", desc: "Clean glossy corporate white" },
      { name: "Slate Grey", hex: "#6c757d", desc: "Modern architectural solid grey" }
    ];

    const metalFrames = [
      { name: "Matte Black", hex: "#212529", desc: "Deep textured protective coating" },
      { name: "Pearl White", hex: "#ffffff", border: true, desc: "Sleek modern white metal coating" },
      { name: "Satin Silver", hex: "#ced4da", desc: "Clean anodized brushed metal style" }
    ];

    const dividers = [
      { name: "Cobalt Blue Fabric", hex: "#0056b3", desc: "Soft acoustic felt board" },
      { name: "Charcoal Felt", hex: "#495057", desc: "Sound-dampening grey acoustic felt" },
      { name: "Frosted Glass", hex: "#e2e6ea", desc: "Semi-transparent modern privacy screen" }
    ];

    const chairUpholstery = [
      { name: "Executive Black Leatherette", hex: "#1e1e1e", desc: "Premium textured faux-leather" },
      { name: "Charcoal Aero Mesh", hex: "#343a40", desc: "Advanced tensile cooling grid mesh" },
      { name: "Steel Blue Cushion", hex: "#1d3557", desc: "High-density foam with micro-weave fabric" },
      { name: "Crimson Red Mesh", hex: "#c30010", desc: "Vibrant high-contrast nylon mesh" }
    ];

    const bases = [
      { name: "Reinforced Nylon Base", desc: "Extremely durable structural matte black base" },
      { name: "Polished Aluminium", desc: "Stunning mirror-finish metallic chrome base" }
    ];

    if (isChair) {
      return (
        <div className="space-y-12 animate-in fade-in duration-500">
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-secondary tracking-tight">Material & Customization Options</h3>
            <p className="text-sm text-neutral-500 font-normal leading-relaxed">Configure materials to match your corporate branding and floor design language.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-secondary/70">Mesh & Cushion Colorways</h4>
              <div className="grid gap-4">
                {chairUpholstery.map((u, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-neutral-100 bg-white shadow-premium">
                    <div 
                      className="w-12 h-12 rounded-lg shrink-0 border border-neutral-200/50 shadow-inner" 
                      style={{ backgroundColor: u.hex }}
                    />
                    <div>
                      <h5 className="text-sm font-semibold text-secondary">{u.name}</h5>
                      <p className="text-xs text-neutral-500 font-normal">{u.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-secondary/70">Structural Base Styles</h4>
              <div className="grid gap-4">
                {bases.map((b, i) => (
                  <div key={i} className="p-5 rounded-xl border border-neutral-100 bg-white shadow-premium space-y-2">
                    <h5 className="text-sm font-semibold text-secondary">{b.name}</h5>
                    <p className="text-xs text-neutral-500 font-normal">{b.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-16 animate-in fade-in duration-500">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-secondary tracking-tight">Material & Customization Options</h3>
          <p className="text-sm text-neutral-500 font-normal leading-relaxed">Choose from our selected premium finishes to match your corporate office palette perfectly.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {/* Tabletop */}
          <div className="space-y-6">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-secondary/70">Tabletop Wood Finishes</h4>
            <div className="space-y-4">
              {tableTops.map((t, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-neutral-100 bg-white shadow-premium">
                  <div 
                    className="w-10 h-10 rounded-lg shrink-0 border border-neutral-200/50 shadow-inner" 
                    style={{ backgroundColor: t.hex }}
                  />
                  <div>
                    <h5 className="text-xs font-semibold text-secondary">{t.name}</h5>
                    <p className="text-[10px] text-neutral-500 font-normal">{t.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Legs */}
          <div className="space-y-6">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-secondary/70">Metal Frame Coatings</h4>
            <div className="space-y-4">
              {metalFrames.map((m, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-neutral-100 bg-white shadow-premium">
                  <div 
                    className={cn(
                      "w-10 h-10 rounded-lg shrink-0 shadow-inner", 
                      m.border ? "border-2 border-neutral-200" : "border border-neutral-200/50"
                    )}
                    style={{ backgroundColor: m.hex }}
                  />
                  <div>
                    <h5 className="text-xs font-semibold text-secondary">{m.name}</h5>
                    <p className="text-[10px] text-neutral-500 font-normal">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="space-y-6">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-secondary/70">Acoustic Partition Screens</h4>
            <div className="space-y-4">
              {dividers.map((d, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-neutral-100 bg-white shadow-premium">
                  <div 
                    className="w-10 h-10 rounded-lg shrink-0 border border-neutral-200/50 shadow-inner" 
                    style={{ backgroundColor: d.hex }}
                  />
                  <div>
                    <h5 className="text-xs font-semibold text-secondary">{d.name}</h5>
                    <p className="text-[10px] text-neutral-500 font-normal">{d.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const simulateDownload = (id: string, name: string) => {
    setDownloadingId(id);
    setTimeout(() => {
      setDownloadingId(null);
      alert(`"${name}" is downloading successfully!`);
    }, 1500);
  };

  const renderResources = () => {
    const resources = [
      {
        id: "datasheet",
        title: "Technical Specification Sheet",
        desc: "Complete architectural catalog sheets, material compositions, and durability rankings.",
        format: "PDF",
        size: "1.8 MB"
      },
      {
        id: "cad",
        title: "2D & 3D CAD Blocks (DWG / STEP)",
        desc: "Pre-modeled scale layouts for AutoCAD, SketchUp, and Revit interior spacing design.",
        format: "ZIP / DWG",
        size: "3.2 MB"
      },
      {
        id: "ergo",
        title: "Workspace Ergonomics Guide",
        desc: "Best practices, posture calibrations, and structural seat adjustment suggestions.",
        format: "PDF",
        size: "950 KB"
      },
      {
        id: "warranty",
        title: "5-Year Warranty Certificate",
        desc: "Full terms & conditions covering industrial steel parts, foam density, and structural integrity.",
        format: "PDF",
        size: "1.2 MB"
      }
    ];

    return (
      <div className="space-y-12 animate-in fade-in duration-500">
        {/* YouTube Video Section */}
        <div className="bg-white border border-neutral-100 rounded-2xl shadow-premium p-8 lg:p-10 space-y-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-4">
              <span className="px-2.5 py-1 bg-primary/10 text-primary text-[10px] font-semibold uppercase tracking-wider rounded-lg">
                VIDEO PRESENTATION
              </span>
              <h3 className="text-2xl font-semibold text-secondary tracking-tight">
                {isChair ? "Ergonomic & Performance Showcase" : "Workspace Design & Installation Tour"}
              </h3>
              <p className="text-sm text-neutral-500 font-normal leading-relaxed">
                Take a virtual tour and explore the advanced manufacturing, materials, modular flexibility, and aesthetic detailing that go into Western Interio products. See the components in action, demonstrating quick customization and long-term ergonomic capabilities.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-secondary">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
                  YouTube HD 1080p
                </span>
                <span className="text-neutral-300">|</span>
                <span className="text-xs font-semibold text-neutral-400">Duration: 3m 45s</span>
              </div>
            </div>
            {/* Embedded YouTube video with aspect-video */}
            <div className="relative aspect-video rounded-xl overflow-hidden border border-neutral-100 shadow-lg bg-neutral-900">
              <iframe
                className="w-full h-full border-none"
                src={isChair ? "https://www.youtube.com/embed/ScMzIvxBSi4" : "https://www.youtube.com/embed/7V-w0D0D1l0"}
                title="Western Interio Video Showcase"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {resources.map((res) => (
            <div key={res.id} className="p-8 bg-white border border-neutral-100 rounded-2xl shadow-premium hover:border-primary/20 transition-all duration-500 flex flex-col justify-between space-y-6 group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 bg-neutral-100 text-neutral-500 text-[10px] font-semibold uppercase tracking-wider rounded-lg">
                    {res.format}
                  </span>
                  <span className="text-[10px] font-mono font-normal text-neutral-500">{res.size}</span>
                </div>
                <h4 className="text-lg font-semibold text-secondary group-hover:text-primary transition-colors duration-300">
                  {res.title}
                </h4>
                <p className="text-xs leading-relaxed text-neutral-500 font-normal">
                  {res.desc}
                </p>
              </div>
              
              <button
                onClick={() => simulateDownload(res.id, res.title)}
                disabled={downloadingId !== null}
                className={cn(
                  "w-full py-3.5 text-xs font-semibold uppercase tracking-wider rounded-xl border-2 flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 active:scale-98 disabled:opacity-50",
                  downloadingId === res.id
                    ? "bg-neutral-50 border-neutral-200 text-neutral-400"
                    : "bg-white border-primary text-primary hover:bg-primary hover:text-white hover:shadow-lg shadow-primary/10"
                )}
              >
                {downloadingId === res.id ? (
                  <>
                    <div className="w-4 h-4 border-2 border-neutral-300 border-t-neutral-500 rounded-full animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download size={14} />
                    Download File
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="bg-white min-h-screen">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-24">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Left: Image Gallery */}
            <div className="space-y-6">
              <div className="relative aspect-[4/3] bg-neutral-50 rounded-2xl overflow-hidden border border-neutral-100 group">
                <Image 
                  src={product.images[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <button 
                  onClick={() => setIsExpanded(true)}
                  className="absolute bottom-6 right-6 p-4 bg-white/90 backdrop-blur-md shadow-premium rounded-2xl text-secondary hover:text-primary hover:bg-white transition-all duration-500 transform hover:scale-110 active:scale-95 group/btn cursor-pointer"
                >
                  <Maximize2 size={24} className="transition-transform duration-500 group-hover/btn:rotate-12" />
                </button>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img: string, i: number) => (
                  <button 
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={cn(
                      "relative aspect-square rounded-xl overflow-hidden border-2 transition-all",
                      selectedImage === i ? "border-primary" : "border-transparent bg-neutral-50 hover:border-neutral-200"
                    )}
                  >
                    <Image src={img} alt={`${product.name} ${i}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Product Details */}
            <div className="space-y-10">
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-4">
                    <span className="px-4 py-1.5 bg-primary/10 text-primary text-[11px] font-black uppercase tracking-[0.2em] rounded-full">
                      Western Interio
                    </span>
                    <span className="text-neutral-300 text-xs">|</span>
                    <span className="text-neutral-500 text-[11px] font-bold uppercase tracking-[0.2em]">
                      ID: {product.id.toUpperCase()}
                    </span>
                  </div>
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold text-secondary leading-tight">
                  {product.name}
                </h1>
                <div className="flex flex-col gap-1">
                  <p className="text-3xl font-black text-primary">
                    {product.price === "Price on Request" || !product.price ? "Price on Request" : `₹${product.price}`}
                  </p>
                </div>
                <p className="text-neutral-500 leading-relaxed text-lg">
                  {product.description}
                </p>

                {/* Trust Bar */}
                <div className="flex items-center gap-8 py-6 border-y border-neutral-100">
                  <div className="flex items-center gap-3">
                    <ShieldCheck size={20} className="text-primary shrink-0" />
                    <span className="text-xs font-black uppercase tracking-[0.15em] text-secondary">Premium Quality</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={20} className="text-primary shrink-0" />
                    <span className="text-xs font-black uppercase tracking-[0.15em] text-secondary">Manufacturer Direct</span>
                  </div>
                </div>
              </div>

              {/* Variants */}
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-8 py-8 border-y border-neutral-100">
                  {product.variants.map((variant) => (
                    <div key={variant.label} className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-secondary/40">Select {variant.label}</h4>
                        <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{selectedVariants[variant.label]}</span>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {variant.options.map((option: string) => (
                          <button 
                            key={option}
                            onClick={() => setSelectedVariants(prev => ({ ...prev, [variant.label]: option }))}
                            className={cn(
                              "px-8 py-4 rounded-xl text-xs font-black uppercase tracking-widest border-2 transition-all duration-500 cursor-pointer",
                              selectedVariants[variant.label] === option 
                                ? "bg-secondary text-white border-secondary shadow-xl scale-105" 
                                : "bg-white text-neutral-400 border-neutral-100 hover:border-primary/50 hover:text-secondary hover:bg-primary/5"
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

              {/* Specs */}
              {product.specifications && product.specifications.length > 0 && (
                <div className="grid grid-cols-2 gap-y-6 gap-x-12">
                  {product.specifications.map((spec) => (
                    <div key={spec.label} className="space-y-1">
                      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{spec.label}</p>
                      <p className="text-sm font-bold text-secondary uppercase tracking-tight">{spec.value}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* CTAs */}
              <div className="grid sm:grid-cols-2 gap-4 pt-4">
                <button 
                  className="w-full inline-flex items-center justify-center gap-3 px-10 py-6 bg-primary text-white font-extrabold uppercase tracking-[0.15em] text-[12px] rounded-lg transition-all duration-500 hover:bg-secondary hover:-translate-y-1 shadow-xl shadow-primary/20 hover:shadow-secondary/20 cursor-pointer active:scale-95"
                  onClick={handleGetQuote}
                >
                  <FileText size={18} />
                  Get A Quote
                </button>
                <button 
                  className="inline-flex items-center justify-center gap-3 px-7 py-6 bg-primary text-white font-extrabold uppercase tracking-[0.15em] text-[11px] rounded-lg transition-all duration-500 hover:bg-secondary hover:-translate-y-1 shadow-xl shadow-primary/20 hover:shadow-secondary/20 cursor-pointer active:scale-95"
                  onClick={() => window.location.href = `tel:${contact.phone}`}
                >
                  <Phone size={16} />
                  Call Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="border-t border-neutral-100 bg-neutral-50/30 py-20">
          <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
            {/* Tab Headers - Centered with balanced standard layout */}
            <div className="flex justify-center border-b border-neutral-200 overflow-x-auto scrollbar-none gap-4 md:gap-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "px-4 md:px-8 py-4 text-xs md:text-sm font-semibold uppercase tracking-wider border-b-2 transition-all duration-300 whitespace-nowrap cursor-pointer",
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-neutral-400 hover:text-secondary hover:border-primary/20"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Panels */}
            <div className="py-12 animate-in fade-in duration-500">
              {activeTab === "details" && renderProductDetails()}
              {activeTab === "specs" && renderSpecifications()}
              {activeTab === "dimensions" && renderDimensions()}
              {activeTab === "options" && renderOptions()}
              {activeTab === "resources" && renderResources()}
            </div>
          </div>
        </div>
      </div>
      
      {/* Commitment Section */}
      <section className="py-24 bg-secondary text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 translate-x-1/2" />
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8 relative z-10 text-center space-y-16">
          <div className="space-y-4">
            <span className="text-primary font-black uppercase tracking-[0.3em] text-[10px]">The Western Commitment</span>
            <h2 className="text-4xl lg:text-5xl font-bold leading-tight tracking-tight">Workspace <span className="text-primary">Excellence.</span></h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            <div className="p-10 lg:p-12 bg-white/[0.03] border border-white/10 rounded-[32px] space-y-8 group hover:bg-white/[0.05] hover:border-primary/30 transition-all duration-500 hover:-translate-y-2">
               <div className="w-20 h-20 mx-auto bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                 <ShieldCheck size={32} />
               </div>
               <div className="space-y-4">
                 <h3 className="text-xl lg:text-2xl font-bold tracking-tight">Authentic Quality</h3>
                 <p className="text-gray-400 text-sm lg:text-base leading-relaxed">High-grade materials and ergonomic engineering for lasting comfort.</p>
               </div>
            </div>
 
            <div className="p-10 lg:p-12 bg-white/[0.03] border border-white/10 rounded-[32px] space-y-8 group hover:bg-white/[0.05] hover:border-primary/30 transition-all duration-500 hover:-translate-y-2">
               <div className="w-20 h-20 mx-auto bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                 <Maximize2 size={32} />
               </div>
               <div className="space-y-4">
                 <h3 className="text-xl lg:text-2xl font-bold tracking-tight">Custom Planning</h3>
                 <p className="text-gray-400 text-sm lg:text-base leading-relaxed">Tailored workspace solutions from planning to manufacturing.</p>
               </div>
            </div>
 
            <div className="p-10 lg:p-12 bg-white/[0.03] border border-white/10 rounded-[32px] space-y-8 group hover:bg-white/[0.05] hover:border-primary/30 transition-all duration-500 hover:-translate-y-2">
               <div className="w-20 h-20 mx-auto bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                 <CheckCircle2 size={32} />
               </div>
               <div className="space-y-4">
                 <h3 className="text-xl lg:text-2xl font-bold tracking-tight">End-to-End</h3>
                 <p className="text-gray-400 text-sm lg:text-base leading-relaxed">Turnkey interior execution with zero-defect delivery.</p>
               </div>
            </div>
          </div>
        </div>
      </section>

    {/* Full Screen Image Preview */}
    <ImagePreview 
      isOpen={isExpanded} 
      images={product.images.map((url: string) => ({ url, title: product.name }))}
      index={selectedImage}
      onClose={() => setIsExpanded(false)}
      onNext={() => setSelectedImage((prev) => (prev + 1) % product.images.length)}
      onPrev={() => setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length)}
    />

    <QuoteModal 
      isOpen={isQuoteModalOpen}
      onClose={() => setIsQuoteModalOpen(false)}
    />
    </>
  );
}
