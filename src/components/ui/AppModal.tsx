import React, { useEffect, useState } from 'react';
import { cn } from "@/lib/utils";

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'full';

interface AppModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: React.ReactNode;
    size?: ModalSize;
    children: React.ReactNode;
    footer?: React.ReactNode;
    closeOnOverlayClick?: boolean;
    hideHeader?: boolean;
    hideFooter?: boolean;
    bodyClassName?: string;
}

const AppModal: React.FC<AppModalProps> = ({
    isOpen,
    onClose,
    title,
    size = 'md',
    children,
    footer,
    closeOnOverlayClick = true,
    hideHeader = false,
    hideFooter = false,
    bodyClassName,
}) => {
    const [mounted, setMounted] = useState(false);
    const [show, setShow] = useState(false);
    const bodyRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            setMounted(true);
            document.body.style.overflow = 'hidden';
            const timer = setTimeout(() => {
                setShow(true);
                if (bodyRef.current) {
                    bodyRef.current.scrollTop = 0;
                }
            }, 10);
            return () => clearTimeout(timer);
        } else {
            setShow(false);
            const timer = setTimeout(() => {
                setMounted(false);
                document.body.style.overflow = 'auto';
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    useEffect(() => {
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    if (!mounted) return null;

    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
        xxl: 'max-w-7xl',
        full: 'max-w-[95%] h-[95vh]',
    };

    return (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ${show ? 'opacity-100' : 'opacity-0'}`}>
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
                onClick={() => closeOnOverlayClick && onClose()}
            />

            {/* Modal Content */}
            <div
                className={`relative bg-white w-full rounded-xl overflow-hidden shadow-2xl transition-all duration-300 transform flex flex-col ${sizeClasses[size]} ${show ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'}`}
            >
                {/* Header */}
                {!hideHeader && (
                    <div className="flex items-center justify-between p-5 border-b border-gray-100 flex-shrink-0">
                        {title && (typeof title === 'string' ? <h3 className="text-lg font-bold text-gray-900">{title}</h3> : title)}
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-gray-900 cursor-pointer ms-auto"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                )}

                {/* Body */}
                <div 
                    ref={bodyRef}
                    className={cn("p-5 overflow-y-auto flex-grow max-h-[90vh] text-gray-600", bodyClassName)}
                >
                    {children}
                </div>

                {/* Footer */}
                {footer && !hideFooter && (
                    <div className="p-5 border-t border-gray-50 flex justify-end space-x-4 flex-shrink-0">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AppModal;
