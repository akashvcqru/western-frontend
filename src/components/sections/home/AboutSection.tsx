"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight
} from "lucide-react";
import siteContent from "@/data/site-content.json";
import { AppRoutes } from "@/constants/routes";

export default function AboutSection() {
  const { homePage } = siteContent;

  return (
    <section className="pt-20 pb-10 lg:pt-28 lg:pb-14 bg-white overflow-hidden relative">
      {/* Background Architectural Grid Accent & Glows */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent skew-x-12 translate-x-1/3 pointer-events-none" />
      <div className="absolute top-1/2 left-2/3 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-center">

          {/* Left Column: Narrative & Values Grid */}
          <div className="lg:col-span-6 space-y-8 flex flex-col justify-center animate-in fade-in slide-in-from-left duration-700">

            {/* Header / Badging */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 shadow-sm animate-fade-in">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shrink-0" />
                <span className="text-primary font-black tracking-[0.25em] text-[10px] uppercase">
                  01 / About the Brand
                </span>
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
                  Years of Industry Expertise
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-4xl lg:text-5xl font-bold tracking-tighter text-secondary flex items-baseline">
                  1000<span className="text-primary font-bold text-2xl ml-0.5">+</span>
                </span>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
                  Corporate Projects Delivered
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-4xl lg:text-5xl font-bold tracking-tighter text-secondary flex items-baseline">
                  30<span className="text-primary font-bold text-2xl ml-0.5">+</span>
                </span>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
                  Cities Served Across India
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-4xl lg:text-5xl font-bold tracking-tighter text-secondary flex items-baseline">
                  5000<span className="text-primary font-bold text-2xl ml-0.5">+</span>
                </span>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
                  Workstations Installed
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-2">
              <Link
                href={AppRoutes.Public.About}
                className="inline-flex items-center gap-3 px-8 py-4 bg-secondary text-white font-semibold tracking-[0.2em] text-[10px] uppercase rounded-xl transition-all duration-500 hover:bg-primary hover:-translate-y-0.5 shadow-lg shadow-neutral-200 hover:shadow-primary/20 group cursor-pointer active:scale-95"
              >
                Learn More
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>

          </div>

          {/* Right Column: Premium Video Section */}
          <div className="lg:col-span-6 relative flex items-center justify-center w-full mt-12 lg:mt-0 animate-in fade-in slide-in-from-right duration-700">

            {/* Interactive Custom Video Player */}
            <a
              href="https://youtu.be/NZIjz-gqm_s?si=jYKo6IMGfQ7i8Oe7"
              target="_blank"
              rel="noopener noreferrer"
              className="relative w-full aspect-video overflow-hidden shadow-2xl shadow-neutral-200 border-2 border-neutral-300 bg-white group z-10 cursor-pointer block"
            >
              <iframe
                src="https://www.youtube.com/embed/NZIjz-gqm_s?autoplay=1&mute=1&loop=1&playlist=NZIjz-gqm_s&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&playsinline=1"
                title="Western Interio"
                className="absolute inset-0 w-full h-full border-none pointer-events-none scale-[1.03] z-0"
                allow="autoplay; encrypted-media"
                frameBorder="0"
              />

              {/* Dark Overlay Gradient (Physical Touch Shield) */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-40 z-10" />
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
