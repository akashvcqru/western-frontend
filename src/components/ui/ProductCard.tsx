import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import siteContent from "@/data/site-content.json";

interface ProductCardProps {
  id: string;
  name: string;
  brand?: string;
  category: string;
  subcategory?: string;
  group?: string;
  image: string;
  specs?: string[];
  slug: string;
  type?: string;
  price?: string;
  mrp?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  brand = "Western Interio",
  category = "furniture",
  subcategory,
  group,
  image,
  specs = [],
  slug,
  type,
  price,
  mrp,
}) => {
  const contact = siteContent.common.contact;

  const slugify = (str?: string) => 
    str?.toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const catSlug = slugify(category);
  const subCatSlug = slugify(subcategory);
  const typeSlug = slugify(type);

  const segments = [catSlug, subCatSlug, typeSlug].filter(Boolean);
  const uniqueSegments = segments.filter(
    (item, index) => segments.indexOf(item) === index,
  );
  const productUrl = `/products/${uniqueSegments.join("/")}/${slug}`;

  return (
    <div className="group bg-white rounded-xl overflow-hidden border border-neutral-100 hover:border-primary/20 hover:shadow-premium transition-all duration-500 flex flex-col h-full relative">
      <div className="relative aspect-square overflow-hidden bg-neutral-50">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="transition-transform duration-700 group-hover:scale-110"
          style={{ objectFit: "cover" }}
        />


      </div>

      <div className="p-6 flex flex-col flex-grow space-y-4">
        <div>
          <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] mb-1">
            {category?.replace(/-/g, " ")}{" "}
            {subcategory && `• ${subcategory.replace(/-/g, " ")}`}
          </p>
          <h3 className="text-lg font-bold text-secondary group-hover:text-primary transition-colors line-clamp-1">
            {name}
          </h3>
          {type && (
            <p className="text-[10px] text-neutral-400 font-bold tracking-wider mt-0.5">
              {type}
            </p>
          )}
        </div>

        {price && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-black text-secondary">
              {price === "Price on Request" ? price : `₹${price}`}
            </span>
            {mrp && price !== "Price on Request" && (
              <span className="text-[10px] text-neutral-400 line-through font-medium">
                ₹{mrp}
              </span>
            )}
          </div>
        )}

        <div className="flex flex-wrap gap-2 flex-grow items-start">
          {(specs || []).map((spec, i) => (
            <span
              key={i}
              className="text-[10px] bg-neutral-100 text-neutral-600 px-2.5 py-1.5 rounded-md font-medium tracking-wider"
            >
              {spec}
            </span>
          ))}
        </div>

        <div className="pt-4 border-t border-neutral-50 flex items-center justify-between gap-3">
          <Link href={productUrl} className="flex-grow">
            <button
              className="w-full inline-flex items-center justify-center gap-3 px-5 py-2.5 bg-secondary text-white font-extrabold tracking-[0.15em] text-[10px] rounded-lg transition-all duration-500 hover:bg-primary hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/20 cursor-pointer active:scale-95"
            >
              Details
              <ArrowUpRight size={14} />
            </button>
          </Link>

        </div>
      </div>
    </div>
  );
};
