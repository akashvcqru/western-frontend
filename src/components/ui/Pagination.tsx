"use client";

import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { cn } from "@/lib/utils";

export interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    pageSize?: number;
    onPageSizeChange?: (size: number) => void;
    totalItems?: number;
    pageSizeOptions?: number[];
    className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    pageSize,
    onPageSizeChange,
    totalItems,
    pageSizeOptions = [10, 20, 50, 100],
    className,
}) => {
    const effectiveTotalPages = Math.max(1, totalPages);
    const pages = Array.from({ length: effectiveTotalPages }, (_, i) => i + 1);

    // Logic for showing a limited number of page buttons
    const getVisiblePages = () => {
        if (effectiveTotalPages <= 7) return pages;

        if (currentPage <= 4) return [...pages.slice(0, 5), '...', effectiveTotalPages];
        if (currentPage >= effectiveTotalPages - 3) return [1, '...', ...pages.slice(effectiveTotalPages - 5)];

        return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', effectiveTotalPages];
    };

    const visiblePages = getVisiblePages();

    return (
        <div className={cn('flex justify-between w-full items-center', className)}>
            <div className="flex items-center gap-4">
                {totalItems !== undefined && pageSize !== undefined && (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        Showing <span className="font-semibold text-gray-900 dark:text-white">{totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1}</span> to <span className="font-semibold text-gray-900 dark:text-white">{Math.min(currentPage * pageSize, totalItems)}</span> of <span className="font-semibold text-gray-900 dark:text-white">{totalItems}</span> results
                    </span>
                )}
                {onPageSizeChange && pageSize !== undefined && (
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Show</span>
                        <select
                            value={pageSize}
                            onChange={(e) => onPageSizeChange(Number(e.target.value))}
                            className="bg-white dark:bg-dark/50 border border-gray-200 dark:border-white/10 rounded-lg text-xs py-1 px-2 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                        >
                            {pageSizeOptions.map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>
                )}
            </div>
            <div className="flex items-center gap-1.5 font-medium">
                <button
                    onClick={() => onPageChange(1)}
                    disabled={currentPage <= 1}
                    className="rounded-lg border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all hover:shadow-sm h-8 w-8 flex justify-center items-center text-gray-600 dark:text-gray-400"
                    title="First Page"
                >
                    <ChevronsLeft className="w-3.5 h-3.5" />
                </button>

                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="flex items-center justify-center gap-1 rounded-lg border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all hover:shadow-sm group h-8 w-16 text-gray-600 dark:text-gray-400"
                    title="Previous Page"
                >
                    <ChevronLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
                    <span className="text-xs font-semibold hidden md:inline">Prev</span>
                </button>

                <div className="flex items-center gap-1 mx-0.5">
                    {visiblePages.map((page, index) => (
                        <React.Fragment key={index}>
                            {page === '...' ? (
                                <span className="px-1.5 text-gray-400 dark:text-gray-600 font-medium italic">...</span>
                            ) : (
                                <button
                                    onClick={() => onPageChange(page as number)}
                                    className={`min-w-[32px] h-8 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${currentPage === page
                                        ? 'bg-primary text-white shadow-md shadow-primary/30 scale-105 border-primary dark:bg-primary dark:shadow-primary/40'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 border border-transparent hover:border-gray-200 dark:hover:border-white/10'
                                        }`}
                                >
                                    {page}
                                </button>
                            )}
                        </React.Fragment>
                    ))}
                </div>

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= effectiveTotalPages}
                    className="flex items-center justify-center gap-1 rounded-lg border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all hover:shadow-sm group h-8 w-16 text-gray-600 dark:text-gray-400"
                    title="Next Page"
                >
                    <span className="text-xs font-semibold hidden md:inline">Next</span>
                    <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </button>

                <button
                    onClick={() => onPageChange(effectiveTotalPages)}
                    disabled={currentPage >= effectiveTotalPages}
                    className="rounded-lg border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 h-8 w-8 flex justify-center items-center disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all hover:shadow-sm text-gray-600 dark:text-gray-400"
                    title="Last Page"
                >
                    <ChevronsRight className="w-3.5 h-3.5" />
                </button>
            </div>
        </div>
    );
};

export default Pagination;
