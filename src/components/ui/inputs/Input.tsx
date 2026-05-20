import React, { forwardRef } from 'react';
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
    rightElement?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, name, type = 'text', error, icon, rightElement, className, ...props }, ref) => {
        return (
            <div className="space-y-2 w-full">
                {label && (
                    <label htmlFor={name} className="text-[10px] font-semibold uppercase tracking-widest text-secondary/60">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {icon && (
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
                            {icon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        id={name}
                        name={name}
                        type={type}
                        className={cn(
                            "w-full bg-gray-50 border py-3 px-4 text-sm font-medium focus:outline-none focus:border-primary transition-all",
                            icon ? "pl-12" : "pl-4",
                            rightElement ? "pr-12" : "pr-4",
                            error ? "border-red-500" : "border-gray-100",
                            className
                        )}
                        {...props}
                    />
                    {rightElement && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center">
                            {rightElement}
                        </div>
                    )}
                </div>
                {error && <p className="text-[10px] font-semibold text-red-500 uppercase tracking-tight">{error}</p>}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;

