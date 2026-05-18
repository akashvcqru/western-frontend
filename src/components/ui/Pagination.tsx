"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 pt-10 border-t border-neutral-100 mt-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Prev Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          "flex items-center justify-center w-10 h-10 rounded-xl border border-neutral-100 bg-white text-secondary transition-all hover:border-primary/20 hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-secondary disabled:hover:border-neutral-100 cursor-pointer active:scale-95",
        )}
      >
        <ChevronLeft size={16} />
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1.5">
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={cn(
              "w-10 h-10 rounded-xl text-xs font-black tracking-wider transition-all cursor-pointer flex items-center justify-center",
              currentPage === page
                ? "bg-primary text-white shadow-lg shadow-primary/25 scale-105"
                : "border border-neutral-100 bg-white text-secondary hover:border-primary/20 hover:text-primary active:scale-95"
            )}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          "flex items-center justify-center w-10 h-10 rounded-xl border border-neutral-100 bg-white text-secondary transition-all hover:border-primary/20 hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-secondary disabled:hover:border-neutral-100 cursor-pointer active:scale-95",
        )}
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};
