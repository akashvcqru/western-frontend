import React, { forwardRef } from 'react';
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
    options: { label: string; value: string | number }[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ label, name, error, icon, options, className, ...props }, ref) => {
        return (
            <div className="space-y-2 w-full">
                {label && (
                    <label htmlFor={name} className="text-[10px] font-semibold uppercase tracking-widest text-secondary/60">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {icon && (
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none">
                            {icon}
                        </div>
                    )}
                    <select
                        ref={ref}
                        id={name}
                        name={name}
                        className={cn(
                            "w-full bg-gray-50 border py-3 px-4 text-sm font-medium focus:outline-none focus:border-primary transition-all appearance-none cursor-pointer",
                            icon ? "pl-12" : "pl-4",
                            error ? "border-red-500" : "border-gray-100",
                            className
                        )}
                        {...props}
                    >
                        {options.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        <ChevronDown size={16} />
                    </div>
                </div>
                {error && <p className="text-[10px] font-semibold text-red-500 uppercase tracking-tight">{error}</p>}
            </div>
        );
    }
);

Select.displayName = 'Select';

export default Select;
