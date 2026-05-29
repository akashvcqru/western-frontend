"use client";

import { useState, useEffect, useRef } from "react";
import { useOffline } from '@/hooks/useOffline';
import { useAppToast } from './AppToast';
import { WifiOff, RefreshCw } from 'lucide-react';


/* ─── Offline Animated SVG Illustration ─────────────────────────────────── */
function OfflineIllustration() {
    return (
        <svg
            viewBox="0 0 340 280"
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
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(10px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0);   }
                    50%       { transform: translateY(-9px); }
                }
                @keyframes floatR {
                    0%, 100% { transform: translateY(0);  }
                    50%       { transform: translateY(7px); }
                }
                @keyframes spin-slow {
                    from { transform: rotate(0deg);   }
                    to   { transform: rotate(360deg); }
                }
                @keyframes pulse-dot {
                    0%, 100% { opacity: .3; r: 5; }
                    50%       { opacity: .8; r: 7; }
                }
                @keyframes signal-sweep {
                    0%   { stroke-dashoffset: 1; opacity: 0;  }
                    20%  { opacity: 1; }
                    70%  { stroke-dashoffset: 0; opacity: 1;  }
                    100% { stroke-dashoffset: 0; opacity: .25; }
                }
                @keyframes dash-march {
                    to { stroke-dashoffset: -24; }
                }
                @keyframes blink {
                    0%,100% { opacity: 1; } 50% { opacity: 0; }
                }

                .dp  { stroke-dasharray:1; stroke-dashoffset:1; pathLength:1;
                       vector-effect:non-scaling-stroke;
                       animation: draw 1.3s cubic-bezier(.4,0,.2,1) forwards; }
                .dp2 { animation-delay:.15s; }
                .dp3 { animation-delay:.30s; }

                .sig { stroke-dasharray:1; pathLength:1;
                       animation: signal-sweep 2.2s ease-in-out infinite; }
                .sig2 { animation-delay:.35s; }
                .sig3 { animation-delay:.70s; }

                .march { stroke-dasharray:8 6; animation: dash-march 1.4s linear infinite; }

                .fg  { animation: float  3.8s ease-in-out infinite; transform-origin:170px 130px; }
                .fg2 { animation: floatR 4.4s ease-in-out infinite .6s; }
                .fg3 { animation: float  5.1s ease-in-out infinite 1.1s; }

                .sr  { animation: spin-slow  9s linear infinite; transform-origin:170px 130px; }
                .sr2 { animation: spin-slow  6s linear infinite reverse; transform-origin:170px 130px; }

                .pu  { animation: pulse-dot 2.2s ease-in-out infinite; }
                .fu  { animation: fadeUp .5s ease forwards; opacity:0; }
                .fu1 { animation-delay:.9s;  }
                .fu2 { animation-delay:1.1s; }
                .blink { animation: blink 1.2s step-end infinite; }
            `}</style>

            <circle cx="170" cy="130" r="115" stroke="#ed1c27" strokeWidth="1"
                strokeDasharray="5 7" className="sr" strokeOpacity=".18" />
            <circle cx="170" cy="130" r="80" stroke="#292F36" strokeWidth="1"
                strokeDasharray="3 9" className="sr2" strokeOpacity=".14" />

            <g className="fg">
                <rect x="125" y="60" width="90" height="150" rx="16"
                    stroke="#292F36" strokeWidth="2.5" fill="none"
                    className="dp" pathLength="1" />
                <rect x="133" y="74" width="74" height="110" rx="8"
                    fill="#fcfcfc" opacity=".5" />
                <rect x="133" y="74" width="74" height="110" rx="8"
                    stroke="#292F36" strokeWidth="1" fill="none"
                    className="dp dp2" pathLength="1" />

                <path d="M158 220 L182 220" stroke="#292F36" strokeWidth="2.5"
                    strokeLinecap="round" className="dp dp3" pathLength="1" />

                <g className="fu fu1">
                    <path d="M148 128 Q170 106 192 128"
                        stroke="#ed1c27" strokeWidth="2.2" strokeLinecap="round" fill="none"
                        className="sig" />
                    <path d="M154 136 Q170 121 186 136"
                        stroke="#ed1c27" strokeWidth="2.2" strokeLinecap="round" fill="none"
                        className="sig sig2" />
                    <path d="M160 144 Q170 136 180 144"
                        stroke="#ed1c27" strokeWidth="2.2" strokeLinecap="round" fill="none"
                        className="sig sig3" />
                    <circle cx="170" cy="152" r="3" fill="#ed1c27" />

                    <line x1="145" y1="107" x2="195" y2="157"
                        stroke="#292F36" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="195" y1="107" x2="145" y2="157"
                        stroke="#292F36" strokeWidth="2.5" strokeLinecap="round" />
                </g>
            </g>

            <g className="fg2" style={{ transformOrigin: '52px 130px' }}>
                <rect x="28" y="106" width="48" height="62" rx="6"
                    stroke="#292F36" strokeWidth="1.8" fill="none"
                    className="dp" pathLength="1" />
                <text x="52" y="177" textAnchor="middle" fontSize="7"
                    fontFamily="monospace" fill="#292F36" fontWeight="bold">SERVER</text>
            </g>

            <g className="fg3" style={{ transformOrigin: '278px 100px' }}>
                <path d="M256 112 Q256 92 272 90 Q274 76 292 76 Q308 76 312 90 Q324 88 326 102 Q330 115 318 118 L260 118 Q250 118 256 112 Z"
                    stroke="#292F36" strokeWidth="2" fill="none"
                    className="dp" pathLength="1" />
                <text x="291" y="108" textAnchor="middle" fontSize="6.5"
                    fontFamily="monospace" fill="#292F36" opacity=".9" fontWeight="bold">NO SIGNAL</text>
            </g>

            <g className="fu fu1 text-primary">
                <circle cx="40"  cy="208" r="5" fill="currentColor" className="pu"  opacity=".35" />
                <circle cx="300" cy="180" r="5" fill="currentColor" className="pu" opacity=".35" />
            </g>
        </svg>
    );
}

export default function OfflineStatus() {
    const isOffline = useOffline();
    const { addToast } = useAppToast();
    const [showFullPageOffline, setShowFullPageOffline] = useState(false);
    const lastOfflineRef = useRef(false);

    useEffect(() => {
        // Initial state or transition to offline
        if (isOffline && !lastOfflineRef.current) {
            setShowFullPageOffline(true);
            addToast({
                title: 'Network Error',
                message: 'Your connection has been interrupted.',
                variant: 'error',
                duration: 5000,
            });
        } 
        // Transition back to online
        else if (!isOffline && lastOfflineRef.current) {
            setShowFullPageOffline(false);
            addToast({
                title: 'Back Online',
                message: 'Your connection has been restored.',
                variant: 'success',
                duration: 4000,
            });
        }

        lastOfflineRef.current = isOffline;
    }, [isOffline, addToast]);

    if (!showFullPageOffline) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center overflow-y-auto py-10 px-6">
            <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
                <div className="absolute -top-56 -right-56 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl" />
                <div className="absolute -bottom-56 -left-56 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl" />
                
                <svg className="absolute inset-0 w-full h-full opacity-[.025]" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="og" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" className="text-gray-900" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#og)" />
                </svg>
            </div>

            <div className="relative z-10 max-w-lg w-full flex flex-col items-center text-center mt-auto mb-auto">
                <div className="w-full max-w-[230px] mx-auto mb-1">
                    <OfflineIllustration />
                </div>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-secondary/10 text-secondary border border-secondary/20 mb-4">
                    <WifiOff className="w-3 h-3" />
                    No Internet Connection
                </span>

                <h1 className="text-3xl sm:text-4xl font-bold text-secondary uppercase tracking-tighter mb-3">
                    You&apos;re <span className="text-primary">Offline</span>
                </h1>
                <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest leading-relaxed max-w-sm">
                    Your connection was interrupted. Please check your network and try again.
                </p>

                <div className="mt-8">
                    <button
                        className="inline-flex items-center justify-center gap-3 px-7 py-3.5 bg-primary text-white font-extrabold uppercase tracking-[0.15em] text-[11px] rounded-lg transition-all duration-500 hover:bg-secondary shadow-xl shadow-primary/20 hover:shadow-secondary/20 cursor-pointer"
                        onClick={() => window.location.reload()}
                    >
                        <RefreshCw className="w-4 h-4" />
                        Try Again
                    </button>
                </div>
            </div>

            <p className="relative z-10 mt-6 text-[9px] font-bold uppercase tracking-[0.2em] text-gray-300 select-none pb-2">
                Waiting for the signal...
            </p>
        </div>
    );
}
