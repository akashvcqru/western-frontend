import React, { forwardRef } from 'react';
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ label, name, error, icon, className, ...props }, ref) => {
        return (
            <div className="space-y-2 w-full">
                {label && (
                    <label htmlFor={name} className="text-[10px] font-semibold uppercase tracking-widest text-secondary/60">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {icon && (
                        <div className="absolute left-4 top-4 text-gray-300">
                            {icon}
                        </div>
                    )}
                    <textarea
                        ref={ref}
                        id={name}
                        name={name}
                        className={cn(
                            "w-full bg-gray-50 border py-3 px-4 text-sm font-medium focus:outline-none focus:border-primary transition-all resize-none min-h-[100px]",
                            icon ? "pl-12" : "pl-4",
                            error ? "border-red-500" : "border-gray-100",
                            className
                        )}
                        {...props}
                    />
                </div>
                {error && <p className="text-[10px] font-semibold text-red-500 uppercase tracking-tight">{error}</p>}
            </div>
        );
    }
);

Textarea.displayName = 'Textarea';

export default Textarea;
