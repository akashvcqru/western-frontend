"use client";

import { useState, useEffect } from "react";
import { PhoneCall } from "lucide-react";

interface CallWidgetProps {
  phone?: string;
  phoneRaw?: string;
}

export default function CallWidget({
  phone = "+91-9540641111",
  phoneRaw = "+919540641111",
}: CallWidgetProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const mountTimer = setTimeout(() => {
      setIsMounted(true);
    }, 0);

    return () => {
      clearTimeout(mountTimer);
    };
  }, []);

  if (!isMounted) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 flex items-center select-none">
      {/* Floating Call Button Wrapper */}
      <div className="relative group">
        {/* Pulsating Glow Ring */}
        <span className="absolute -inset-1 rounded-full bg-primary/30 animate-ping opacity-75 group-hover:opacity-0 transition-opacity duration-300 pointer-events-none" />

        {/* Floating Call Link */}
        <a
          href={`tel:${phoneRaw}`}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          aria-label={`Call us now at ${phone}`}
          className="relative w-14 h-14 bg-gradient-to-tr from-primary to-[#ff424d] text-white rounded-full flex items-center justify-center shadow-[0_8px_30px_rgba(237,28,39,0.35)] hover:shadow-[0_12px_40px_rgba(237,28,39,0.55)] hover:scale-110 active:scale-95 transition-all duration-300 ease-out cursor-pointer"
        >
          <PhoneCall className="w-6 h-6 animate-pulse" strokeWidth={2.2} />
        </a>
      </div>

      {/* Premium Glassmorphic Tooltip */}
      <div
        className={`bg-white/95 backdrop-blur-xl border border-neutral-100 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.08)] text-secondary text-[10px] uppercase font-bold tracking-wider px-4 py-2.5 rounded-2xl ml-3 flex items-center gap-2 transform transition-all duration-300 ease-out origin-left ${
          showTooltip
            ? "opacity-100 translate-x-0 scale-100"
            : "opacity-0 -translate-x-3 scale-95 pointer-events-none"
        }`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
        Call Now: <span className="text-primary font-black tracking-widest">{phone}</span>
      </div>
    </div>
  );
}
