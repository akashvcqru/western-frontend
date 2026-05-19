"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowRight,
  Award,
  Sparkle,
  Play,
  Pause,
  Volume2,
  VolumeX
} from "lucide-react";
import siteContent from "@/data/site-content.json";
import { AppRoutes } from "@/constants/routes";

export default function AboutSection() {
  const { homePage } = siteContent;
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isMuted, setIsMuted] = React.useState(true);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(err => console.log("Video playback error: ", err));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section className="pt-20 pb-10 lg:pt-28 lg:pb-14 bg-white overflow-hidden relative">
      {/* Background Architectural Grid Accent & Glows */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent skew-x-12 translate-x-1/3 pointer-events-none" />
      <div className="absolute top-1/2 left-2/3 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          
          {/* Left Column: Narrative & Values Grid */}
          <div className="lg:col-span-7 space-y-8 flex flex-col justify-center animate-in fade-in slide-in-from-left duration-700">
            
            {/* Header / Badging */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-primary font-bold uppercase tracking-[0.3em] text-[10px]">
                  01 / About the Brand
                </span>
                <div className="h-[1px] w-12 bg-primary/20" />
              </div>
              <h2 className="text-3xl lg:text-5xl font-extrabold text-secondary tracking-tight leading-[1.15]">
                Crafting workspaces <br />
                that inspire <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-red-500 to-orange-500 font-bold relative inline-block">
                  beyond.
                  <span className="absolute left-0 bottom-1 w-full h-[3px] bg-gradient-to-r from-primary to-orange-500 rounded-full opacity-35" />
                </span>
              </h2>
            </div>

            {/* Description */}
            <p className="text-sm lg:text-base text-neutral-500 leading-relaxed font-normal max-w-2xl">
              {homePage.whatWeAre.desc}
            </p>

            {/* Premium Stats Strip with elegant typography weight */}
            <div className="grid grid-cols-2 gap-8 border-y border-neutral-200/60 py-6 max-w-xl">
              <div className="space-y-1">
                <span className="text-4xl lg:text-5xl font-bold tracking-tighter text-secondary flex items-baseline">
                  20<span className="text-primary font-bold text-2xl ml-0.5">+</span>
                </span>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
                  Years of Craftsmanship
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-4xl lg:text-5xl font-bold tracking-tighter text-secondary flex items-baseline">
                  1000<span className="text-primary font-bold text-2xl ml-0.5">+</span>
                </span>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
                  Corporate Spaces Executed
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-2">
              <Link 
                href={AppRoutes.Public.About} 
                className="inline-flex items-center gap-3 px-8 py-4 bg-secondary text-white font-semibold tracking-[0.2em] text-[10px] uppercase rounded-xl transition-all duration-500 hover:bg-primary hover:-translate-y-0.5 shadow-lg shadow-neutral-200 hover:shadow-primary/20 group cursor-pointer active:scale-95"
              >
                Discover Our Journey
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>

          </div>
          
          {/* Right Column: Premium Video Section */}
          <div className="lg:col-span-5 relative flex items-center justify-center w-full min-h-[420px] lg:min-h-[500px] mt-12 lg:mt-0 animate-in fade-in slide-in-from-right duration-700">
            
            {/* Interactive Custom Video Player */}
            <div 
              onClick={togglePlay}
              className="relative w-full aspect-[4/3] rounded-[36px] overflow-hidden shadow-2xl shadow-neutral-200 border-8 border-white bg-neutral-900 group z-10 cursor-pointer transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(237,28,39,0.15)]"
            >
              <video
                ref={videoRef}
                src="https://assets.mixkit.co/videos/preview/mixkit-modern-office-space-with-employees-40479-large.mp4"
                loop
                muted={isMuted}
                playsInline
                className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-102"
              />

              {/* Dark Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-40" />

              {/* Glassmorphic Play/Pause Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white/25 backdrop-blur-md border border-white/40 flex items-center justify-center text-white shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:bg-primary group-hover:border-primary group-hover:text-white">
                  {isPlaying ? (
                    <Pause size={24} className="fill-current" />
                  ) : (
                    <Play size={24} className="fill-current translate-x-0.5" />
                  )}
                </div>
              </div>

              {/* Floating Bottom Video Bar */}
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-white z-20">
                <span className="text-[10px] font-semibold tracking-wider bg-black/35 backdrop-blur-sm px-3 py-1 rounded-full uppercase border border-white/10">
                  Virtual Tour
                </span>
                
                {/* Custom Mute Control */}
                <button 
                  onClick={toggleMute}
                  className="w-8 h-8 rounded-full bg-black/35 backdrop-blur-sm border border-white/10 hover:bg-primary hover:border-primary flex items-center justify-center transition-colors"
                >
                  {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                </button>
              </div>
            </div>

            {/* Top-Right Floating Quality Badge */}
            <div className="absolute -top-6 -right-4 z-30 bg-white/90 backdrop-blur-md px-5 py-3 rounded-2xl border border-neutral-100 shadow-premium flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Award size={18} />
              </div>
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-wider text-neutral-400">Quality Assured</p>
                <p className="text-[11px] font-bold text-secondary">ISO 9001:2015 Firm</p>
              </div>
            </div>

            {/* Bottom-Left Floating Micro Card */}
            <div className="absolute -bottom-6 -left-4 z-30 bg-secondary/95 backdrop-blur-md text-white p-5 rounded-[24px] border border-neutral-800 shadow-2xl max-w-[190px] hidden sm:block">
              <div className="flex items-center gap-2 text-primary mb-1.5">
                <Sparkle size={10} className="fill-primary" />
                <span className="text-[8px] font-semibold uppercase tracking-[0.2em]">Execution</span>
              </div>
              <h4 className="text-[11px] font-bold text-white mb-1 leading-snug">Turnkey Interiors</h4>
              <p className="text-[9px] text-neutral-400 leading-normal font-normal">
                Bespoke layouts, acoustic panels, ceiling designs, and workspace seating solutions.
              </p>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
