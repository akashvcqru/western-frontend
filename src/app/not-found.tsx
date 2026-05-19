"use client";

import React from 'react';
import { Home, Search, ArrowLeft } from 'lucide-react';


/* ─── 404 Animated SVG Illustration ────────────────────────────────────── */
function NotFoundIllustration() {
    return (
        <svg
            viewBox="0 0 320 260"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full max-w-xs mx-auto"
            aria-hidden="true"
        >
            <style>{`
                @keyframes draw {
                    from { stroke-dashoffset: 1; }
                    to   { stroke-dashoffset: 0; }
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0);   }
                    50%       { transform: translateY(-10px); }
                }
                @keyframes spin-slow {
                    from { transform: rotate(0deg);   }
                    to   { transform: rotate(360deg); }
                }
                .dp  { stroke-dasharray:1; stroke-dashoffset:1; pathLength:1;
                       vector-effect:non-scaling-stroke;
                       animation: draw 1.5s cubic-bezier(.4,0,.2,1) forwards; }
                .fg  { animation: float 4s ease-in-out infinite; transform-origin: 160px 130px; }
                .sr  { animation: spin-slow 10s linear infinite; transform-origin: 160px 130px; }
                .blink { animation: blink 1.5s step-end infinite; }
                @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
            `}</style>

            <circle cx="160" cy="130" r="110" stroke="#ed1c27" strokeWidth="0.5" strokeDasharray="4 8" className="sr" opacity=".2" />
            
            <g className="fg">
                {/* 404 Text Stylized */}
                <text x="160" y="145" textAnchor="middle" fontSize="100" fontWeight="900" fill="none" stroke="#292F36" strokeWidth="1" opacity=".1">404</text>
                
                {/* Architectural Compass / Blueprint Tool */}
                <path d="M160 60 L160 200 M100 130 L220 130" stroke="#292F36" strokeWidth="1" strokeDasharray="5 5" opacity=".3" />
                <circle cx="160" cy="130" r="50" stroke="#ed1c27" strokeWidth="2" className="dp" />
                
                {/* Magnifying Glass Searching */}
                <g transform="translate(180, 150) rotate(-45)">
                    <circle cx="0" cy="0" r="15" stroke="#292F36" strokeWidth="2.5" fill="white" className="dp" />
                    <line x1="0" y1="15" x2="0" y2="30" stroke="#292F36" strokeWidth="2.5" strokeLinecap="round" />
                </g>
            </g>

            <circle cx="60" cy="80" r="3" fill="#ed1c27" className="blink" />
            <circle cx="260" cy="180" r="3" fill="#292F36" className="blink" style={{ animationDelay: '0.7s' }} />
        </svg>
    );
}

export default function NotFound() {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center py-10 px-6 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
                <div className="absolute -top-56 -right-56 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute -bottom-56 -left-56 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-3xl" />
                
                <svg className="absolute inset-0 w-full h-full opacity-[.03]" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="grid404" width="50" height="50" patternUnits="userSpaceOnUse">
                            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="1" className="text-secondary" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid404)" />
                </svg>
            </div>

            <div className="relative z-10 max-w-lg w-full flex flex-col items-center text-center">
                <div className="w-full max-w-[280px] mx-auto mb-4">
                    <NotFoundIllustration />
                </div>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary border border-primary/20 mb-6">
                    <Search className="w-3 h-3" />
                    Page Not Found
                </span>

                <h1 className="text-4xl sm:text-6xl font-black text-secondary uppercase tracking-tighter mb-4 leading-none">
                    Workspace <br /><span className="text-primary">Missing</span>
                </h1>
                
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest leading-relaxed max-w-sm mb-10">
                    The office section you are looking for has been moved or is currently being renovated. Let&apos;s get you back to headquarters.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                    <button
                        className="inline-flex items-center justify-center gap-3 px-10 py-4.5 bg-primary text-white font-extrabold uppercase tracking-[0.15em] text-[12px] rounded-lg transition-all duration-500 hover:bg-secondary shadow-xl shadow-primary/20 hover:shadow-secondary/20 cursor-pointer"
                        onClick={() => window.location.href = '/'}
                    >
                        <Home className="w-4 h-4" />
                        Back to Home
                    </button>
                    <button
                        className="inline-flex items-center justify-center gap-3 px-10 py-4.5 bg-transparent border-2 border-secondary text-secondary font-extrabold uppercase tracking-[0.15em] text-[12px] rounded-lg transition-all duration-500 hover:bg-secondary hover:text-white cursor-pointer"
                        onClick={() => window.history.back()}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Go Back
                    </button>
                </div>
            </div>

            <div className="absolute bottom-10 text-[9px] font-black uppercase tracking-[0.3em] text-gray-300">
                Western Interio &bull; Workspace Excellence
            </div>
        </div>
    );
}
