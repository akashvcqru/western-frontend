"use client";

import React from "react";
import Link from "next/link";
import { House, ChevronRight } from "lucide-react";
import { AppRoutes } from "@/constants/routes";

export interface BreadcrumbItem {
  /** The label shown in the breadcrumb */
  label: string;
  /** If provided, renders as a clickable link. Last crumb should have no href. */
  href?: string;
}

export interface AdminPageHeaderProps {
  /** Main page title shown on the left (renders as h5) */
  title: string;
  /**
   * Breadcrumb items after the static "Home" crumb.
   * The last item is treated as the current page (darker text, no link).
   */
  breadcrumbs: BreadcrumbItem[];
}

/**
 * AdminPageHeader
 *
 * Consistent admin page header — title on the left, pill breadcrumb nav on the right.
 * Matches the reference design exactly.
 *
 * Usage:
 * ```tsx
 * <AdminPageHeader
 *   title="Products"
 *   breadcrumbs={[
 *     { label: "Admin", href: AppRoutes.Admin.Dashboard },
 *     { label: "Products" },
 *   ]}
 * />
 * ```
 */
export default function AdminPageHeader({ title, breadcrumbs }: AdminPageHeaderProps) {
  return (
    <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between border-b border-gray-100 dark:border-gray-800/50 pb-4">
      {/* Page Title */}
      <h5 className="text-lg font-semibold text-gray-900 dark:text-white tracking-tight">
        {title}
      </h5>

      {/* Breadcrumb Nav */}
      <nav aria-label="Breadcrumb" className="bg-gray-50/50 dark:bg-gray-800/50 px-3 py-1.5 rounded-full border border-gray-100 dark:border-gray-800">
        <ol className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">

          {/* Static Home crumb */}
          <li className="flex items-center">
            <Link
              href={AppRoutes.Admin.Dashboard}
              className="flex items-center font-semibold gap-1.5 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-all duration-200"
            >
              <House size={14} aria-hidden="true" />
              <span>Home</span>
            </Link>
          </li>

          {/* Dynamic crumbs */}
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return (
              <li key={`${crumb.label}-${index}`} className="flex items-center gap-2">
                <ChevronRight
                  size={12}
                  aria-hidden="true"
                  className="text-gray-300 dark:text-gray-600"
                />
                {!isLast && crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="text-gray-500 dark:text-gray-400 font-semibold hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span
                    className={
                      isLast
                        ? "text-gray-900 dark:text-gray-200 font-semibold"
                        : "text-gray-500 dark:text-gray-400 font-semibold"
                    }
                  >
                    {crumb.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}
