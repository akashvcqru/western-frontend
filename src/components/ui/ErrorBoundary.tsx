"use client";

import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { RefreshCw, Home, ChevronDown, ChevronUp } from 'lucide-react';


interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    showDetails: boolean;
}

/* ─── Animated SVG Illustration ──────────────────────────────────────────── */
function ErrorIllustration() {
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
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(12px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes pulse-slow {
                    0%, 100% { opacity: .35; r: 6; }
                    50%       { opacity: .7;  r: 8; }
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50%       { transform: translateY(-8px); }
                }
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to   { transform: rotate(360deg); }
                }
                @keyframes blink {
                    0%,100% { opacity:1; } 50% { opacity:0; }
                }
                .draw-path {
                    stroke-dasharray: 1;
                    stroke-dashoffset: 1;
                    pathLength: 1;
                    vector-effect: non-scaling-stroke;
                    animation: draw 1.4s cubic-bezier(.4,0,.2,1) forwards;
                }
                .draw-path-2 { animation-delay: .2s; }
                .draw-path-3 { animation-delay: .4s; }
                .draw-path-4 { animation-delay: .6s; }
                .draw-path-5 { animation-delay: .8s; }
                .fade-up-1 { animation: fadeUp .6s ease forwards .9s; opacity:0; }
                .fade-up-2 { animation: fadeUp .6s ease forwards 1.1s; opacity:0; }
                .fade-up-3 { animation: fadeUp .6s ease forwards 1.3s; opacity:0; }
                .float-group { animation: float 3.6s ease-in-out infinite; transform-origin: 160px 120px; }
                .spin-ring   { animation: spin-slow 8s linear infinite; transform-origin: 160px 120px; }
                .dot-pulse   { animation: pulse-slow 2s ease-in-out infinite; }
                .dot-pulse-2 { animation: pulse-slow 2s ease-in-out infinite .7s; }
                .dot-pulse-3 { animation: pulse-slow 2s ease-in-out infinite 1.4s; }
                .cursor-blink { animation: blink 1.1s step-end infinite; }
            `}</style>

            <circle
                cx="160" cy="120" r="100"
                stroke="currentColor"
                strokeWidth="1"
                strokeDasharray="6 6"
                className="spin-ring text-primary/20"
            />

            <circle
                cx="160" cy="120" r="70"
                stroke="currentColor"
                strokeWidth="1"
                strokeDasharray="4 8"
                className="spin-ring text-secondary/15"
                style={{ animationDirection: 'reverse', animationDuration: '5s' }}
            />

            <g className="float-group">
                <rect
                    x="80" y="70" width="160" height="110" rx="12"
                    className="draw-path text-gray-200"
                    stroke="currentColor" strokeWidth="2.5"
                    pathLength="1"
                />
                <rect
                    x="92" y="82" width="136" height="80" rx="6"
                    className="draw-path draw-path-2"
                    stroke="currentColor" strokeWidth="1.5"
                    fill="currentColor"
                    style={{ color: 'transparent' }}
                    pathLength="1"
                />
                <rect x="92" y="82" width="136" height="80" rx="6"
                    className="text-primary/5"
                    fill="currentColor" opacity=".6"
                />

                <path
                    d="M148 180 L160 198 L172 180"
                    className="draw-path draw-path-3 text-gray-300"
                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                    pathLength="1"
                />
                <path
                    d="M138 198 L182 198"
                    className="draw-path draw-path-4 text-gray-300"
                    stroke="currentColor" strokeWidth="3" strokeLinecap="round"
                    pathLength="1"
                />

                <g className="fade-up-1">
                    <path
                        d="M160 98 L177 128 L143 128 Z"
                        fill="none"
                        stroke="#ed1c27"
                        strokeWidth="2"
                        strokeLinejoin="round"
                        className="draw-path"
                        pathLength="1"
                    />
                    <path d="M160 98 L177 128 L143 128 Z" fill="#ed1c27" opacity=".15" />
                    <line x1="160" y1="108" x2="160" y2="120" stroke="#ed1c27" strokeWidth="2.5" strokeLinecap="round" />
                    <circle cx="160" cy="124.5" r="1.5" fill="#ed1c27" />
                </g>

                <g className="fade-up-2">
                    <rect x="100" y="150" width="52" height="4" rx="2" fill="#ed1c27" opacity=".5" />
                    <rect x="100" y="158" width="36" height="4" rx="2" fill="#292F36" opacity=".35" />
                    <rect x="138" y="158" width="3" height="4" rx="1" fill="#292F36" className="cursor-blink" />
                    <rect x="100" y="166" width="62" height="4" rx="2" fill="#ed1c27" opacity=".25" />
                </g>
            </g>

            <g className="fade-up-3">
                <g style={{ animation: 'float 4.2s ease-in-out infinite .5s' }}>
                    <rect x="28" y="48" width="52" height="22" rx="11"
                        fill="currentColor" className="text-primary/10"
                        stroke="#ed1c27" strokeWidth="1" strokeOpacity=".4"
                    />
                    <text x="54" y="63.5" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#ed1c27" fontWeight="600">
                        ERR
                    </text>
                </g>
                <g style={{ animation: 'float 3.8s ease-in-out infinite 1s' }}>
                    <rect x="242" y="44" width="56" height="22" rx="11"
                        fill="currentColor" className="text-secondary/10"
                        stroke="#292F36" strokeWidth="1" strokeOpacity=".4"
                    />
                    <text x="270" y="59.5" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#292F36" fontWeight="600">
                        500
                    </text>
                </g>
            </g>

            <circle cx="58"  cy="160" r="6" fill="#ed1c27" className="dot-pulse"   opacity=".4" />
            <circle cx="262" cy="100" r="6" fill="#292F36" className="dot-pulse-2" opacity=".4" />
            <circle cx="240" cy="220" r="6" fill="#ed1c27" className="dot-pulse-3" opacity=".4" />
        </svg>
    );
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null, showDetails: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error, showDetails: false };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            const { error, showDetails } = this.state;

            return (
                <div className="min-h-screen bg-white flex flex-col items-center overflow-y-auto py-10 px-6 relative">
                    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
                        <div className="absolute -top-56 -right-56 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
                        <div className="absolute -bottom-56 -left-56 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl" />
                        
                        <svg className="absolute inset-0 w-full h-full opacity-[.025]" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" className="text-gray-900" />
                                </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#grid)" />
                        </svg>
                    </div>

                    <div className="relative z-10 max-w-lg w-full flex flex-col items-center text-center mt-auto mb-auto">
                        <div className="w-full max-w-[230px] mx-auto mb-1">
                            <ErrorIllustration />
                        </div>

                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary border border-primary/20 mb-4">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                            Application Error
                        </span>

                        <h1 className="text-3xl sm:text-4xl font-black text-secondary uppercase tracking-tighter mb-3">
                            Something went <span className="text-primary">wrong</span>
                        </h1>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest leading-relaxed max-w-sm">
                            We hit an unexpected snag. Your data is safe — try refreshing the
                            page or head back to the home screen.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
                            <button
                                className="inline-flex items-center justify-center gap-3 px-7 py-3.5 bg-primary text-white font-extrabold uppercase tracking-[0.15em] text-[11px] rounded-lg transition-all duration-500 hover:bg-secondary shadow-xl shadow-primary/20 hover:shadow-secondary/20 cursor-pointer"
                                onClick={() => window.location.reload()}
                            >
                                <RefreshCw className="w-4 h-4" />
                                Refresh Page
                            </button>
                            <button
                                className="inline-flex items-center justify-center gap-3 px-7 py-3.5 bg-transparent border-2 border-secondary text-secondary font-extrabold uppercase tracking-[0.15em] text-[11px] rounded-lg transition-all duration-500 hover:bg-secondary hover:text-white cursor-pointer"
                                onClick={() => { window.location.href = '/'; }}
                            >
                                <Home className="w-4 h-4" />
                                Go to Home
                            </button>
                        </div>

                        {error && (
                            <div className="mt-8 w-full">
                                <button
                                    onClick={() => this.setState(s => ({ showDetails: !s.showDetails }))}
                                    className="mx-auto flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-gray-300 hover:text-primary transition-colors cursor-pointer select-none"
                                >
                                    {showDetails
                                        ? <ChevronUp className="w-3.5 h-3.5" />
                                        : <ChevronDown className="w-3.5 h-3.5" />}
                                    {showDetails ? 'Hide' : 'Show'} technical details
                                </button>

                                {showDetails && (
                                    <div className="mt-3 p-4 bg-gray-50 border border-gray-200 rounded-sm text-left">
                                        <div className="flex items-start gap-2">
                                            <span className="shrink-0 mt-0.5 w-1.5 h-1.5 rounded-full bg-primary" />
                                            <p className="text-xs font-mono text-primary break-all leading-relaxed font-bold">
                                                {error.message}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <p className="relative z-10 mt-6 pb-2 text-[9px] font-black uppercase tracking-[0.2em] text-gray-300 select-none">
                        Legacy of Trust Since 1971
                    </p>
                </div>
            );
        }

        return this.props.children;
    }
}
