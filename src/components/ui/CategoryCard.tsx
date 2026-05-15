import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

interface CategoryCardProps {
  title: string;
  image: string;
  href: string;
  itemCount?: number;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ title, image, href, itemCount }) => {
  return (
    <Link href={href} className="group relative overflow-hidden rounded-xl bg-neutral-100 aspect-[4/5] shadow-soft hover:shadow-premium transition-all duration-500 block">
      <Image
        src={image}
        alt={title}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        className="object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />
      
      {/* Category Content */}
      <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
        <div className="space-y-4">
          <div className="space-y-1">
            {itemCount !== undefined && (
              <span className="text-[10px] font-bold tracking-widest text-primary/80 mb-1 block">
                {itemCount}+ Products
              </span>
            )}
            <h3 className="text-3xl font-extrabold leading-none tracking-tighter">
              {title}
            </h3>
          </div>

          <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500">
            <span className="text-[10px] font-black tracking-widest border-b-2 border-primary pb-1">
              View Collection
            </span>
            <ArrowUpRight size={16} className="text-primary" />
          </div>
        </div>
      </div>
    </Link>
  );
};
