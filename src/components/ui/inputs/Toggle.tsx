import React from 'react';
import { cn } from "@/lib/utils";

interface ToggleProps {
    enabled: boolean;
    setEnabled: (enabled: boolean) => void;
    label?: string;
    description?: string;
}

const Toggle: React.FC<ToggleProps> = ({ enabled, setEnabled, label, description }) => {
    return (
        <div className="flex items-center justify-between gap-4">
            {(label || description) && (
                <div className="flex flex-col">
                    {label && <span className="text-[10px] font-black uppercase tracking-widest text-secondary">{label}</span>}
                    {description && <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">{description}</span>}
                </div>
            )}
            <button
                type="button"
                className={cn(
                    "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                    enabled ? "bg-primary" : "bg-gray-200"
                )}
                onClick={() => setEnabled(!enabled)}
            >
                <span
                    aria-hidden="true"
                    className={cn(
                        "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                        enabled ? "translate-x-5" : "translate-x-0"
                    )}
                />
            </button>
        </div>
    );
};

export default Toggle;
