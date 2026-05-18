"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AccordionItem {
  title: React.ReactNode;
  content: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  className?: string;
  itemClassName?: string;
  triggerClassName?: string;
  contentClassName?: string;
  defaultOpenIndex?: number | number[];
}

const Accordion: React.FC<AccordionProps> = ({
  items,
  allowMultiple = false,
  className,
  itemClassName,
  triggerClassName,
  contentClassName,
  defaultOpenIndex,
}) => {
  const [openIndexes, setOpenIndexes] = useState<number[]>(() => {
    if (defaultOpenIndex !== undefined) {
      return Array.isArray(defaultOpenIndex) ? defaultOpenIndex : [defaultOpenIndex];
    }
    return [];
  });

  const handleToggle = (index: number) => {
    if (allowMultiple) {
      if (openIndexes.includes(index)) {
        setOpenIndexes(openIndexes.filter((i) => i !== index));
      } else {
        setOpenIndexes([...openIndexes, index]);
      }
    } else {
      if (openIndexes.includes(index)) {
        setOpenIndexes([]);
      } else {
        setOpenIndexes([index]);
      }
    }
  };

  return (
    <div className={cn("space-y-4 w-full", className)}>
      {items.map((item, index) => {
        const isOpen = openIndexes.includes(index);
        return (
          <div
            key={index}
            className={cn(
              "bg-white rounded-xl border border-neutral-100 overflow-hidden shadow-sm hover:border-neutral-200 transition-all duration-300",
              itemClassName
            )}
          >
            <button
              onClick={() => handleToggle(index)}
              type="button"
              className={cn(
                "w-full p-6 text-left flex justify-between items-center gap-4 cursor-pointer focus:outline-none",
                triggerClassName
              )}
            >
              <div className="font-bold text-neutral-800 text-sm md:text-base tracking-wide leading-snug">
                {item.title}
              </div>
              <ChevronDown
                size={18}
                className={cn(
                  "text-neutral-400 shrink-0 transition-transform duration-300",
                  isOpen && "rotate-180 text-primary"
                )}
              />
            </button>

            {/* Expandable panel wrapper */}
            <div
              className={cn(
                "transition-all duration-500 overflow-hidden",
                isOpen
                  ? "max-h-[500px] opacity-100 border-t border-neutral-50"
                  : "max-h-0 opacity-0 pointer-events-none"
              )}
            >
              <div className={cn("p-6 text-neutral-750 text-sm font-normal leading-relaxed", contentClassName)}>
                {item.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Accordion;
