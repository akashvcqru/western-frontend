"use client";

import { useState, useEffect } from "react";
import { MapPin, Factory, Truck, ShieldCheck, Award } from "lucide-react";
import siteContent from "@/data/site-content.json";

interface Hub {
  id: string;
  name: string;
  type: string;
  x: number; // percentage coordinate
  y: number; // percentage coordinate
  deliveryTime: string;
  stats: string;
  projectsCount: string;
  details: string;
}

// Regional hubs data with normalized coordinates for the SVG canvas
const hubs: Hub[] = [
  {
    id: "haryana",
    name: "Haryana (HQ & Plant)",
    type: "Manufacturing Base & Headquarters",
    x: 46,
    y: 28,
    deliveryTime: "1-2 Days (Immediate)",
    stats: "15,000+ Sq.Ft. Facility",
    projectsCount: "650+ Corporate Spaces",
    details: "Our fully integrated manufacturing unit in Kadipur Industrial Area, Gurugram houses automatic powder coating lines and precision CNC routing for desking fabrication."
  },
  {
    id: "maharashtra",
    name: "Maharashtra Hub",
    type: "Western Distribution Center",
    x: 30,
    y: 60,
    deliveryTime: "3-4 Days",
    stats: "4,500+ Sq.Ft. Node",
    projectsCount: "380+ Spaces",
    details: "Strategically serving Mumbai, Pune, and Nagpur corporate corridors with premium executive desk series, ergonomic chairs, and partition systems."
  },
  {
    id: "karnataka",
    name: "Karnataka Hub",
    type: "Southern Distribution Node",
    x: 38,
    y: 78,
    deliveryTime: "4-5 Days",
    stats: "3,500+ Sq.Ft. Node",
    projectsCount: "290+ Spaces",
    details: "Supplying tech corridors in Bengaluru and Mysuru with modern collaborative desking configurations, linear workstations, and acoustic solutions."
  },
  {
    id: "telangana",
    name: "Telangana Hub",
    type: "Deccan Distribution Node",
    x: 46,
    y: 65,
    deliveryTime: "4 Days",
    stats: "3,000+ Sq.Ft. Node",
    projectsCount: "210+ Spaces",
    details: "Catering to the rapid IT and commercial office expansions in Hyderabad and Warangal, providing turnkey modular furniture layouts."
  },
  {
    id: "tamilnadu",
    name: "Tamil Nadu Hub",
    type: "Industrial & IT Logistics Node",
    x: 48,
    y: 82,
    deliveryTime: "5 Days",
    stats: "2,800+ Sq.Ft. Node",
    projectsCount: "180+ Spaces",
    details: "Direct distribution support across Chennai and Coimbatore, powering manufacturing offices, automotive design studios, and IT parks."
  }
];


export default function FootprintSection() {
  const { footer } = siteContent;
  const deliveryCities = footer.deliveryLocations || [];

  const [activeHub, setActiveHub] = useState<Hub>(hubs[0]);
  const animateBeams = true;

  // Auto-cycles highlight every few seconds if user is not interacting
  useEffect(() => {
    // Reset active hub if the stored activeHub ID is invalid/stale (e.g. from hot-reload cache)
    if (!hubs.some((h) => h.id === activeHub.id)) {
      setActiveHub(hubs[0]);
    }

    const interval = setInterval(() => {
      setActiveHub((prev) => {
        const currentIndex = hubs.findIndex((h) => h.id === prev.id);
        const nextIndex = (currentIndex + 1) % hubs.length;
        return hubs[nextIndex];
      });
    }, 6000);
    return () => clearInterval(interval);
  }, [activeHub.id]);

  return (
    <section className="py-24 bg-neutral-950 text-white overflow-hidden relative">
      {/* Premium Technical Grid & Architectural Background Elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-600/5 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Header Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-end mb-16 lg:mb-20">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 shadow-sm animate-fade-in">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shrink-0" />
              <span className="text-primary font-black tracking-[0.25em] text-[10px] uppercase">
                Manufacturing & Footprint
              </span>
            </div>
            <h2 className="text-3xl lg:text-5xl font-black tracking-tight leading-none">
              State-of-the-Art Production. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500 font-extrabold">
                Delivered Nationwide.
              </span>
            </h2>
          </div>
          <div className="lg:col-span-4">
            <p className="text-neutral-400 text-sm leading-relaxed font-normal">
              From our fully integrated production facility in Haryana, we engineer high-performance modular desking and executive furniture, shipped directly to tier-1 corporate hubs pan-India.
            </p>
          </div>
        </div>

        {/* Main Columns */}
        <div className="grid lg:grid-cols-12 gap-10 xl:gap-16 items-center">
          
          {/* Left Column: Industrial Capability & Realtime Hub Detail */}
          <div className="lg:col-span-6 space-y-8">
            
            {/* Plant Spotlight Details Card */}
            <div className="p-8 rounded-xl bg-neutral-900/80 border border-neutral-800 shadow-2xl backdrop-blur-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full pointer-events-none" />
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Factory size={22} />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Haryana Factory</span>
                  <h3 className="text-lg font-black text-white leading-tight">Kadipur Industrial Facility</h3>
                </div>
              </div>

              <div className="space-y-4 text-xs text-neutral-300 leading-relaxed font-normal">
                <p>
                  Equipped with heavy-duty multi-boring machineries, automatic edge-banders, and electrostatic powder coating chambers. We control 100% of the desking and seating production workflow to guarantee unmatched durability.
                </p>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-855">
                  <div className="space-y-1">
                    <span className="text-xs text-neutral-500 block uppercase tracking-wider">Quality Standard</span>
                    <span className="text-white font-bold flex items-center gap-1.5">
                      <ShieldCheck size={14} className="text-primary" /> ISO 9001 Approved
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-neutral-500 block uppercase tracking-wider">Material Grade</span>
                    <span className="text-white font-bold flex items-center gap-1.5">
                      <Award size={14} className="text-primary" /> E1 Green Board
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Interactive Hub Details Display */}
            <div className="p-8 rounded-xl bg-gradient-to-br from-neutral-900 to-neutral-950 border border-primary/20 shadow-premium relative overflow-hidden transition-all duration-500">
              <div className="absolute top-4 right-4 text-[9px] font-black tracking-widest uppercase px-2 py-1 rounded bg-primary/15 text-primary">
                Active Node
              </div>

              <div className="space-y-6">
                <div>
                  <span className="text-xs font-black tracking-widest text-primary uppercase block mb-1">
                    {activeHub.type}
                  </span>
                  <h4 className="text-2xl font-black text-white">{activeHub.name}</h4>
                </div>

                <p className="text-xs text-neutral-400 leading-relaxed font-normal min-h-[60px]">
                  {activeHub.details}
                </p>

                {/* Hub Metrics */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-neutral-800 text-center">
                  <div className="space-y-1">
                    <span className="text-[10px] text-neutral-500 block uppercase font-bold tracking-wider">Transit</span>
                    <span className="text-white font-black text-xs leading-none flex items-center justify-center gap-1">
                      <Truck size={12} className="text-primary shrink-0" /> {activeHub.deliveryTime}
                    </span>
                  </div>
                  <div className="space-y-1 border-x border-neutral-800 px-2">
                    <span className="text-[10px] text-neutral-500 block uppercase font-bold tracking-wider">Volume</span>
                    <span className="text-white font-black text-xs leading-none block">
                      {activeHub.projectsCount.split(' ')[0]}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-neutral-500 block uppercase font-bold tracking-wider">Scale</span>
                    <span className="text-white font-black text-[10px] leading-tight block">
                      {activeHub.stats.split(' ')[0]}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Hub Selection Pill Buttons */}
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Quick Hub Selector</p>
              <div className="flex flex-nowrap overflow-x-auto no-scrollbar gap-1.5 pb-1">
                {hubs.map((hub) => (
                  <button
                    key={hub.id}
                    onClick={() => setActiveHub(hub)}
                    className={`px-2 py-1.5 sm:px-2.5 sm:py-2 xl:px-3 xl:py-2 rounded-xl font-bold text-[10px] sm:text-[11px] xl:text-xs shrink-0 uppercase tracking-wider transition-all duration-300 ${
                      activeHub.id === hub.id
                        ? "bg-primary text-white shadow-md shadow-primary/20 scale-105"
                        : "bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-850"
                    }`}
                  >
                    {hub.name.split(' (')[0].split(' Hub')[0]}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Architectural SVG India Network Canvas */}
          <div className="lg:col-span-6 flex items-center justify-center relative w-full aspect-[4/5] sm:aspect-square bg-neutral-900/30 rounded-xl border border-neutral-800/80 p-4 sm:p-8 overflow-hidden">
            
            {/* Inside Canvas HUD Overlay */}
            <div className="absolute top-6 left-6 text-left z-20 pointer-events-none">
              <span className="text-[9px] font-black tracking-widest uppercase text-neutral-500 block">System Mapping</span>
              <span className="text-xs font-black text-white flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
                Live Logistics Lanes
              </span>
            </div>



            {/* Interactive Network Map (SVG Canvas) */}
            <div className="w-full h-full relative flex items-center justify-center">
              
              <svg 
                viewBox="0 0 100 100" 
                className="w-full h-full text-neutral-800 select-none relative z-10"
                fill="none" 
                stroke="currentColor" 
                strokeWidth="0.5"
              >
                {/* SVG Decorative Blueprint Grid Lines */}
                <circle cx="50" cy="50" r="45" stroke="#ffffff" strokeOpacity="0.02" strokeDasharray="2,2" />
                <circle cx="50" cy="50" r="30" stroke="#ffffff" strokeOpacity="0.02" strokeDasharray="2,2" />
                <line x1="50" y1="5" x2="50" y2="95" stroke="#ffffff" strokeOpacity="0.02" strokeDasharray="2,2" />
                <line x1="5" y1="50" x2="95" y2="50" stroke="#ffffff" strokeOpacity="0.02" strokeDasharray="2,2" />

                {/* Stylized Network Connective Beams from HQ (Gurgaon) to Hubs */}
                {hubs.slice(1).map((hub) => {
                  const hq = hubs[0];
                  return (
                    <g key={`beam-${hub.id}`}>
                      {/* Interactive Line Shadow Glow */}
                      <line
                        x1={hq.x}
                        y1={hq.y}
                        x2={hub.x}
                        y2={hub.y}
                        stroke="#ed1c27"
                        strokeOpacity={activeHub.id === hub.id || activeHub.id === "haryana" ? "0.35" : "0.08"}
                        strokeWidth={activeHub.id === hub.id ? "1.5" : "0.75"}
                        className="transition-all duration-550"
                      />
                      
                      {/* Animated Pulse Beam traveling along the line */}
                      {animateBeams && (
                        <line
                          x1={hq.x}
                          y1={hq.y}
                          x2={hub.x}
                          y2={hub.y}
                          stroke="url(#beamGradient)"
                          strokeWidth={activeHub.id === hub.id ? "2" : "1"}
                          strokeDasharray="10 80"
                          strokeDashoffset="100"
                          className="animate-pulse"
                          style={{
                            animation: "marquee 4s linear infinite",
                            animationDelay: `${(hub.id.charCodeAt(0) % 5) * 0.5}s`
                          }}
                        />
                      )}
                    </g>
                  );
                })}

                {/* Gradients definitions */}
                <defs>
                  <linearGradient id="beamGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ed1c27" stopOpacity="0" />
                    <stop offset="50%" stopColor="#ed1c27" stopOpacity="1" />
                    <stop offset="100%" stopColor="#orange" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Highly Simplified Stylized Map of India Constellation Lines (Connecting major border anchors) */}
                <g stroke="#ffffff" strokeOpacity="0.08" strokeWidth="0.4" fill="none">
                  {/* Outer boundaries in modern abstract geometric form */}
                  <polygon points="46,12 52,14 55,20 60,25 72,25 78,35 83,43 78,48 76,55 70,52 64,55 58,62 55,67 47,82 45,90 38,82 35,74 25,65 20,58 22,50 25,45 35,42 38,36 34,26 40,24 46,12" />
                </g>

                {/* Hub Pulsing Ring & Node Interactions */}
                {hubs.map((hub) => {
                  const isActive = activeHub.id === hub.id;
                  const isHQ = hub.id === "haryana";

                  return (
                    <g 
                      key={hub.id}
                      className="cursor-pointer group/node"
                      onClick={() => setActiveHub(hub)}
                    >
                      {/* Interactive Transparent Hover Circle */}
                      <circle 
                        cx={hub.x} 
                        cy={hub.y} 
                        r="6" 
                        fill="transparent" 
                        className="pointer-events-auto"
                      />

                      {/* Outer pulsing ring */}
                      <circle
                        cx={hub.x}
                        cy={hub.y}
                        r={isActive ? "4" : isHQ ? "2.5" : "2"}
                        fill="none"
                        stroke={isHQ ? "#ed1c27" : "#ffffff"}
                        strokeWidth="0.5"
                        className={isActive ? "animate-ping origin-center" : "group-hover/node:scale-125 transition-transform duration-300"}
                        style={{
                          transformOrigin: `${hub.x}px ${hub.y}px`,
                          animationDuration: "2s"
                        }}
                      />

                      {/* Inner solid node */}
                      <circle
                        cx={hub.x}
                        cy={hub.y}
                        r={isHQ ? "1.8" : "1.2"}
                        fill={isHQ || isActive ? "#ed1c27" : "#ffffff"}
                        className="transition-colors duration-300"
                      />

                      {/* Node Label Tooltip on Map */}
                      {isActive && (
                        <foreignObject
                          x={hub.x - 15}
                          y={hub.y - 10}
                          width="30"
                          height="8"
                          className="overflow-visible"
                        >
                          <div 
                            className="flex items-center justify-center w-full h-full pointer-events-none"
                            style={{ width: "100%", height: "100%" }}
                          >
                            <div 
                              className="bg-neutral-950 text-white font-bold flex items-center justify-center relative select-none"
                              style={{ 
                                fontSize: "2.4px",
                                border: "0.3px solid #ed1c27",
                                padding: "1px 2px",
                                borderRadius: "0.8px",
                                boxShadow: "0 1px 2px rgba(0,0,0,0.5)",
                                letterSpacing: "0.02em",
                                whiteSpace: "nowrap"
                              }}
                            >
                              {hub.name.split(' (')[0].split(' Hub')[0]}
                              
                              {/* Tooltip Arrow */}
                              <div 
                                style={{
                                  position: "absolute",
                                  bottom: "-0.5px",
                                  left: "50%",
                                  transform: "translateX(-50%) rotate(45deg)",
                                  width: "0.8px",
                                  height: "0.8px",
                                  backgroundColor: "#0a0a0a",
                                  borderRight: "0.3px solid #ed1c27",
                                  borderBottom: "0.3px solid #ed1c27"
                                }}
                              />
                            </div>
                          </div>
                        </foreignObject>
                      )}
                    </g>
                  );
                })}
              </svg>

              {/* Glowing Ambient Spot behind HQ */}
              <div 
                className="absolute w-24 h-24 bg-primary/20 rounded-full blur-2xl pointer-events-none transition-all duration-700"
                style={{
                  left: `${hubs[0].x}%`,
                  top: `${hubs[0].y}%`,
                  transform: "translate(-50%, -50%)"
                }}
              />
            </div>

          </div>

        </div>

        {/* Dynamic Pan-India Logistics Cities Marquee */}
        <div className="mt-24 pt-12 border-t border-neutral-900 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-primary">Direct Delivery Services</p>
              <h4 className="text-lg font-black text-white tracking-tight">We Deliver to</h4>
            </div>
            <div className="px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-[10px] font-black uppercase tracking-wider text-neutral-400">
              Pan Indian Coverage
            </div>
          </div>

          {/* Autoscrolling City Marquee Banner */}
          <div className="relative w-full overflow-hidden py-3 mask-fade">
            <div className="flex gap-4 items-center whitespace-nowrap animate-marquee">
              {[...deliveryCities, ...deliveryCities].map((city, idx) => (
                <div 
                  key={`${city}-${idx}`}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-neutral-900/60 border border-neutral-850 hover:border-primary/30 transition-all duration-300 group"
                >
                  <MapPin size={12} className="text-neutral-500 group-hover:text-primary transition-colors" />
                  <span className="text-neutral-300 font-bold text-xs uppercase tracking-wider">
                    {city}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
