"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { cn } from "@/lib/utils";

type ToastVariant = 'success' | 'error' | 'warning' | 'info';

interface ToastOptions {
    title?: string;
    message: string;
    variant?: ToastVariant;
    duration?: number;
}

interface Toast extends ToastOptions {
    id: string;
}

interface AppToastContextType {
    addToast: (options: ToastOptions) => void;
    removeToast: (id: string) => void;
}

const AppToastContext = createContext<AppToastContextType | undefined>(undefined);

export const useAppToast = (): AppToastContextType => {
    const context = useContext(AppToastContext);
    if (!context) {
        throw new Error('useAppToast must be used within an AppToastProvider');
    }
    return context;
};

interface AppToastProviderProps {
    children: ReactNode;
}

export const AppToastProvider: React.FC<AppToastProviderProps> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback(({ title, message, variant = 'info', duration = 4000 }: ToastOptions) => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, title, message, variant, duration }]);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    return (
        <AppToastContext.Provider value={{ addToast, removeToast }}>
            {children}
            <div className="fixed z-[110] flex flex-col gap-3 max-w-sm w-full top-6 right-6 items-end pointer-events-none">
                {toasts.map((toast) => (
                    <ToastItem key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
                ))}
            </div>
        </AppToastContext.Provider>
    );
};

interface ToastItemProps {
    toast: Toast;
    onRemove: () => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onRemove }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [progress, setProgress] = useState(100);

    const remainingTimeRef = useRef<number>(toast.duration || 4000);
    const animationFrameRef = useRef<number | null>(null);

    useEffect(() => {
        const enterTimer = setTimeout(() => setIsVisible(true), 10);
        return () => clearTimeout(enterTimer);
    }, []);

    const handleClose = useCallback(() => {
        setIsVisible(false);
        setTimeout(() => {
            onRemove();
        }, 300);
    }, [onRemove]);

    useEffect(() => {
        if (!toast.duration || toast.duration <= 0) return;

        let lastTime = performance.now();

        const updateProgress = (currentTime: number) => {
            if (!isHovered) {
                const deltaTime = currentTime - lastTime;
                remainingTimeRef.current = Math.max(0, remainingTimeRef.current - deltaTime);
                const currentProgress = (remainingTimeRef.current / (toast.duration as number)) * 100;
                setProgress(currentProgress);

                if (remainingTimeRef.current <= 0) {
                    handleClose();
                    return;
                }
            }

            lastTime = currentTime;
            animationFrameRef.current = requestAnimationFrame(updateProgress);
        };

        animationFrameRef.current = requestAnimationFrame(updateProgress);

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [isHovered, toast.duration, handleClose]);

    const variantStyles = {
        success: { iconBg: 'bg-emerald-500', progress: 'bg-emerald-500', text: 'text-emerald-500' },
        error: { iconBg: 'bg-primary', progress: 'bg-primary', text: 'text-primary' },
        warning: { iconBg: 'bg-amber-500', progress: 'bg-amber-500', text: 'text-amber-500' },
        info: { iconBg: 'bg-secondary', progress: 'bg-secondary', text: 'text-secondary' },
    };

    const styles = variantStyles[toast.variant || 'info'];

    const getIcon = () => {
        const iconClasses = "w-4 h-4 text-white";
        switch (toast.variant) {
            case 'success':
                return <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>;
            case 'error':
                return <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>;
            case 'warning':
                return <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;
            case 'info':
            default:
                return (
                    <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
        }
    };

    return (
        <div
            className={cn(
                "pointer-events-auto relative overflow-hidden bg-white min-w-[320px] rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 transition-all duration-500 transform",
                isVisible ? "translate-x-0 opacity-100" : "translate-x-12 opacity-0"
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="flex items-center p-5">
                <div className={cn("flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center", styles.iconBg)}>
                    {getIcon()}
                </div>

                <div className="ml-4 flex-1">
                    {toast.title && <h4 className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-0.5">{toast.title}</h4>}
                    <p className={cn(
                        "text-[11px] leading-relaxed font-medium tracking-tight",
                        toast.title ? "text-gray-400" : styles.text
                    )}>
                        {toast.message}
                    </p>
                </div>

                <button
                    onClick={handleClose}
                    className="ml-4 flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-gray-50 text-gray-400 hover:bg-secondary hover:text-white transition-all cursor-pointer"
                >
                    <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {toast.duration && toast.duration > 0 && (
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gray-50">
                    <div
                        className={cn("h-full transition-none", styles.progress)}
                        style={{ width: `${progress}%` }}
                    />
                </div>
            )}
        </div>
    );
};
