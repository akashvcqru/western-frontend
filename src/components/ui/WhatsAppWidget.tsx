"use client";

import React, { useState, useEffect } from "react";
import siteContent from "@/data/site-content.json";

export default function WhatsAppWidget() {
  const [isMounted, setIsMounted] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const mountTimer = setTimeout(() => {
      setIsMounted(true);
    }, 0);
    // Show tooltip after a short delay, then hide it
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 3000);

    const hideTimer = setTimeout(() => {
      setShowTooltip(false);
    }, 8000);

    return () => {
      clearTimeout(mountTimer);
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!isMounted) return null;

  const contact = siteContent.common.contact;
  const rawPhone = contact.phones[0];
  const cleanedPhone = rawPhone.replace(/[^0-9]/g, ""); // "919540641111"

  const handleChat = () => {
    const greeting = "Hi Western Interio, I am visiting your website and would like to learn more about your premium workspace interior designs and modular furniture.";
    window.open(`https://wa.me/${cleanedPhone}?text=${encodeURIComponent(greeting)}`, "_blank");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center select-none">
      {/* Premium Glassmorphic Tooltip */}
      <div
        className={`bg-white/90 backdrop-blur-xl border border-neutral-100 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.08)] text-secondary text-[10px] uppercase font-semibold tracking-widest px-5 py-3 rounded-2xl mr-3 flex items-center gap-2 transform transition-all duration-500 ease-out origin-right ${
          showTooltip
            ? "opacity-100 translate-x-0 scale-100"
            : "opacity-0 translate-x-4 scale-95 pointer-events-none"
        }`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        Need Expert Help? Chat Now
      </div>

      {/* Floating WhatsApp Button Wrapper */}
      <div className="relative group">
        {/* Pulsating Glow Ring */}
        <span className="absolute -inset-1 rounded-full bg-emerald-500/30 animate-ping opacity-75 group-hover:opacity-0 transition-opacity duration-300 pointer-events-none" />

        {/* Floating Button */}
        <button
          onClick={handleChat}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          aria-label="Chat with us on WhatsApp"
          className="relative w-14 h-14 bg-gradient-to-tr from-emerald-500 to-green-400 text-white rounded-full flex items-center justify-center shadow-[0_8px_30px_rgba(16,185,129,0.4)] hover:shadow-[0_12px_40px_rgba(16,185,129,0.6)] hover:scale-110 active:scale-95 transition-all duration-300 ease-out cursor-pointer"
        >
          <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.588 1.485 5.407 1.486 5.417 0 9.822-4.36 9.825-9.711.002-2.592-1.002-5.029-2.828-6.858C17.227 2.241 14.801 1.24 12.01 1.24c-5.42 0-9.827 4.36-9.831 9.713a9.58 9.58 0 0 0 1.464 5.093L2.6 21.43l5.524-1.437l-.477-.282zm9.954-6.83c-.274-.137-1.62-.796-1.87-.887-.252-.09-.435-.137-.617.137-.182.274-.708.887-.868 1.066-.16.182-.32.203-.594.067-.274-.137-1.162-.426-2.214-1.36c-.82-.727-1.374-1.625-1.535-1.897-.16-.273-.017-.42.12-.557.123-.122.274-.32.411-.478.137-.16.182-.273.274-.455.092-.182.046-.341-.023-.478-.069-.137-.618-1.483-.846-2.03c-.22-.53-.446-.458-.618-.467-.16-.008-.343-.01-.525-.01a1.01 1.01 0 0 0-.73.34c-.252.274-.96.938-.96 2.287s.983 2.65 1.12 2.83c.137.182 1.935 2.923 4.69 4.103c.655.282 1.167.45 1.567.576.66.21 1.26.162 1.735.092.53-.078 1.62-.66 1.85-1.294.228-.636.228-1.183.16-1.295-.069-.113-.252-.204-.526-.341z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
