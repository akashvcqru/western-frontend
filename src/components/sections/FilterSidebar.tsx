"use client";

import React from "react";
import { Filter, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  category: string;
  brand?: string;
  type?: string;
  subcategory?: string;
  material?: string;
  finish?: string;
  size?: string;
  specifications?: { label: string; value: string }[];
  shortSpecs?: string[];
  images: string[];
  price?: string;
  description?: string;
}

interface FilterSidebarProps {
  products: Product[];
  selectedFilters: string[];
  onFilterChange: (option: string) => void;
  onClearAll: () => void;
  maxPrice?: number;
  onPriceChange?: (price: number) => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({ 
  products,
  selectedFilters, 
  onFilterChange, 
  onClearAll,
  maxPrice = 0,
  onPriceChange
}) => {
  // Calculate dynamic min and max prices from products
  const parsedPrices = React.useMemo(() => {
    if (!Array.isArray(products)) return [];
    return products
      .map(p => {
        if (!p.price) return 0;
        const cleaned = p.price.replace(/[^0-9]/g, "");
        return cleaned ? parseInt(cleaned, 10) : 0;
      })
      .filter(price => price > 0);
  }, [products]);

  const dynamicMinPrice = React.useMemo(() => {
    return parsedPrices.length > 0 ? Math.min(...parsedPrices) : 0;
  }, [parsedPrices]);

  const dynamicMaxPrice = React.useMemo(() => {
    return parsedPrices.length > 0 ? Math.max(...parsedPrices) : 20000;
  }, [parsedPrices]);

  const currentSliderValue = maxPrice || dynamicMaxPrice;

  const percentage = React.useMemo(() => {
    if (dynamicMaxPrice === dynamicMinPrice) return 100;
    return ((currentSliderValue - dynamicMinPrice) / (dynamicMaxPrice - dynamicMinPrice)) * 100;
  }, [currentSliderValue, dynamicMinPrice, dynamicMaxPrice]);

  // Dynamically generate filter groups based on products
  const filterGroupsData = React.useMemo(() => {
    if (!Array.isArray(products)) return [];
    const brands = Array.from(new Set(products.map(p => p.brand))).filter(Boolean) as string[];
    const types = Array.from(new Set(products.map(p => p.type))).filter(Boolean) as string[];
    const subcategories = Array.from(new Set(products.map(p => p.subcategory?.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())))).filter(Boolean) as string[];
    
    const getSpecOptions = (label: string) => {
      const options = new Set<string>();
      products.forEach(p => {
        const spec = p.specifications?.find((s: { label: string; value: string }) => s.label?.toLowerCase() === label?.toLowerCase());
        if (spec?.value) options.add(spec.value);
        p.shortSpecs?.forEach((ss: string) => {
          if (ss?.toLowerCase().includes(label?.toLowerCase()) || 
              (label === "Size" && ss?.match(/\d+mm/)) ||
              (label === "Finish" && (ss?.toLowerCase().includes("glossy") || ss?.toLowerCase().includes("matte")))) {
            options.add(ss);
          }
        });
      });
      return Array.from(options);
    };

    const materials = getSpecOptions("Material");
    const finishes = getSpecOptions("Finish");
    const sizes = getSpecOptions("Size");

    return [
      { id: "subcategory", title: "Subcategory", options: subcategories },
      { id: "type", title: "Product Type", options: types },
      { id: "brand", title: "Brand", options: brands },
      { id: "material", title: "Material", options: materials },
      { id: "finish", title: "Finish", options: finishes },
      { id: "size", title: "Size", options: sizes },
      { id: "availability", title: "Availability", options: ["In Stock", "Out of Stock"] }
    ].filter(group => group.options.length > 0);
  }, [products]);

  const [openSections, setOpenSections] = React.useState<string[]>(["subcategory", "type", "brand", "material", "finish"]);

  const toggleSection = (id: string) => {
    setOpenSections(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6 sticky top-32">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-primary" />
          <h3 className="font-bold uppercase tracking-widest text-[11px] text-secondary">Filters</h3>
        </div>
        {selectedFilters.length > 0 && (
          <button 
            onClick={onClearAll}
            className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Accordion Sections */}
      <div className="space-y-2">
        {filterGroupsData.map((group) => (
          <div key={group.id} className="border-b border-neutral-50 pb-4 last:border-0">
            <button 
              onClick={() => toggleSection(group.id)}
              className="w-full flex items-center justify-between py-2 group text-left"
            >
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary group-hover:text-primary transition-colors">
                {group.title}
              </span>
              {openSections.includes(group.id) ? (
                <ChevronUp size={14} className="text-neutral-400" />
              ) : (
                <ChevronDown size={14} className="text-neutral-400" />
              )}
            </button>
            
            {openSections.includes(group.id) && (
              <div className="space-y-2 mt-2 pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                {group.options.map((option) => {
                  const filterId = `filter-${group.id}-${option.toLowerCase().replace(/\s+/g, '-')}`;
                  return (
                    <div key={option} className="flex items-center gap-3 group py-1">
                      <input 
                        type="checkbox"
                        id={filterId}
                        className="sr-only"
                        checked={selectedFilters.includes(option)}
                        onChange={() => onFilterChange(option)}
                      />
                      <label 
                        htmlFor={filterId}
                        className="flex items-center gap-3 w-full cursor-pointer select-none"
                      >
                        <div 
                          className={cn(
                            "w-4 h-4 rounded border transition-all flex items-center justify-center shrink-0",
                            selectedFilters.includes(option) 
                              ? "bg-primary border-primary shadow-sm" 
                              : "bg-white border-neutral-200 group-hover:border-primary"
                          )}
                        >
                          {selectedFilters.includes(option) && (
                            <div className="w-1.5 h-1.5 bg-white rounded-full" />
                          )}
                        </div>
                        <span className={cn(
                          "text-[12px] font-medium transition-colors",
                          selectedFilters.includes(option) ? "text-secondary font-bold" : "text-neutral-500 group-hover:text-secondary"
                        )}>
                          {option}
                        </span>
                      </label>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}

        {/* Price Filter (Interactive Slider) */}
        <div className="border-b border-neutral-50 pb-6 pt-2">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary">
              Price Range
            </span>
            {dynamicMaxPrice > dynamicMinPrice && (
              <span className="text-[10px] font-bold text-primary tracking-wider">
                Up to ₹{currentSliderValue.toLocaleString('en-IN')}
              </span>
            )}
          </div>
          {dynamicMaxPrice > dynamicMinPrice ? (
            <div className="mt-6 px-2 relative select-none">
              {/* Visual track */}
              <div className="h-1 bg-neutral-100 rounded-full relative pointer-events-none">
                <div 
                  className="absolute h-full bg-primary left-0 rounded-full" 
                  style={{ width: `${percentage}%` }}
                />
                <div 
                  className="absolute w-4 h-4 bg-white border-2 border-primary rounded-full -top-1.5 -translate-x-1/2 shadow-sm transition-all"
                  style={{ left: `${percentage}%` }}
                />
              </div>
              {/* Invisible Range Input for Interaction */}
              <input
                type="range"
                min={dynamicMinPrice}
                max={dynamicMaxPrice}
                value={currentSliderValue}
                onChange={(e) => onPriceChange?.(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex items-center justify-between mt-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest pointer-events-none">
                <span>₹{dynamicMinPrice.toLocaleString('en-IN')}</span>
                <span>₹{dynamicMaxPrice.toLocaleString('en-IN')}</span>
              </div>
            </div>
          ) : (
            <div className="mt-4 text-[11px] text-neutral-400 font-medium italic">
              No price filter available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
