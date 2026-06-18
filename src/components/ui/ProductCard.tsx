"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

interface ProductCardProps {
  id: string;
  name: string;
  category: string;
  image: string;
  slug: string;
  price?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  name,
  category,
  image,
  slug,
  price,
}) => {
  const slugify = (str?: string) => 
    str?.toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const catSlug = slugify(category);
  const productUrl = `/products/${catSlug}/${slug}`;

  return (
    <Link href={productUrl} className="group block space-y-3.5">
      {/* Premium Framed Image Container with Hover Action */}
      <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-white border border-neutral-100">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="transition-transform duration-700 group-hover:scale-105 p-3"
          style={{ objectFit: "contain" }}
        />
        {/* Subtle Hover Action Button Reveal */}
        <div className="absolute inset-0 bg-neutral-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg transform translate-y-3 group-hover:translate-y-0 transition-all duration-500">
            <ArrowRight size={16} className="text-primary" />
          </div>
        </div>
      </div>

      {/* Details Container underneath the image */}
      <div className="space-y-1 px-1">
        <p className="text-[9px] font-black text-neutral-400 uppercase tracking-[0.25em]">
          {category?.replace(/-/g, " ")}
        </p>
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-[13px] font-bold text-secondary group-hover:text-primary transition-colors line-clamp-2 leading-snug">
            {name}
          </h3>
          {price && (
            <span className="text-[12px] font-black text-secondary shrink-0 mt-0.5">
              ₹{price}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};
