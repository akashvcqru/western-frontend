"use client";

import React from "react";
import { Filter, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterGroup {
  id: string;
  title: string;
  options: string[];
}

interface FilterSidebarProps {
  products: any[];
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
  onClearAll 
}) => {
  // Dynamically generate filter groups based on products
  const filterGroupsData = React.useMemo(() => {
    if (!Array.isArray(products)) return [];
    const brands = Array.from(new Set(products.map(p => p.brand))).filter(Boolean) as string[];
    const types = Array.from(new Set(products.map(p => p.type))).filter(Boolean) as string[];
    const subcategories = Array.from(new Set(products.map(p => p.subcategory?.replace(/-/g, " ").replace(/\b\w/g, (l: any) => l.toUpperCase())))).filter(Boolean) as string[];
    
    const getSpecOptions = (label: string) => {
      const options = new Set<string>();
      products.forEach(p => {
        const spec = p.specifications?.find((s: any) => s.label?.toLowerCase() === label?.toLowerCase());
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
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-secondary group-hover:text-primary transition-colors">
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

        {/* Price Filter (Mock Slider) */}
        <div className="border-b border-neutral-50 pb-6 pt-2">
          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-secondary">
            Price Range
          </span>
          <div className="mt-6 px-2">
            <div className="h-1 bg-neutral-100 rounded-full relative">
              <div className="absolute h-full bg-primary left-0 right-[40%] rounded-full" />
              <div className="absolute w-4 h-4 bg-white border-2 border-primary rounded-full -top-1.5 left-0 shadow-sm" />
              <div className="absolute w-4 h-4 bg-white border-2 border-primary rounded-full -top-1.5 right-[40%] shadow-sm" />
            </div>
            <div className="flex items-center justify-between mt-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
              <span>₹1,000</span>
              <span>₹20,000</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
