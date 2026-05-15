"use client";

import React, { useEffect } from "react";
import { cn } from "@/lib/utils";

interface OffcanvasProps {
  isOpen: boolean;
  onClose: () => void;
  position?: "left" | "right" | "top" | "bottom";
  className?: string;
  children: React.ReactNode;
}

export default function Offcanvas({
  isOpen,
  onClose,
  position = "right",
  className,
  children,
}: OffcanvasProps) {
  // Disable scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const positionClasses = {
    left: "inset-y-0 left-0 w-full max-w-sm",
    right: "inset-y-0 right-0 w-full max-w-sm",
    top: "inset-x-0 top-0 h-auto max-h-[90vh]",
    bottom: "inset-x-0 bottom-0 h-auto max-h-[90vh]",
  };

  const translateClasses = {
    left: isOpen ? "translate-x-0" : "-translate-x-full",
    right: isOpen ? "translate-x-0" : "translate-x-full",
    top: isOpen ? "translate-y-0" : "-translate-y-full",
    bottom: isOpen ? "translate-y-0" : "translate-y-full",
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          position === "right" && "lg:block", // Always show backdrop for right offcanvas (notifications)
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Offcanvas Panel */}
      <aside
        className={cn(
          "fixed z-50 bg-white flex flex-col shadow-2xl transform transition-transform duration-300 ease-in-out",
          positionClasses[position],
          translateClasses[position],
          className
        )}
      >
        {children}
      </aside>
    </>
  );
}
