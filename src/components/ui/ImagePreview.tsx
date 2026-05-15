import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImagePreviewProps {
    isOpen: boolean;
    images: { url: string; title?: string }[];
    index: number;
    onClose: () => void;
    onNext: () => void;
    onPrev: () => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
    isOpen,
    images,
    index,
    onClose,
    onNext,
    onPrev
}) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;
            if (e.key === "ArrowRight") onNext();
            if (e.key === "ArrowLeft") onPrev();
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onNext, onPrev, onClose]);

    if (!isOpen || images.length === 0) return null;

    const currentImage = images[index];

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={onClose}
        >
            {/* Header/Counter */}
            <div className="absolute top-6 left-6 flex flex-col gap-1 z-[110]">
                <div className="text-white font-bold text-sm bg-black/50 px-4 py-2 rounded-full backdrop-blur-md border border-white/10 w-fit">
                    {index + 1} / {images.length}
                </div>
                {currentImage.title && (
                    <div className="text-white/80 text-xs font-medium px-1 drop-shadow-md">
                        {currentImage.title}
                    </div>
                )}
            </div>

            <button
                className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-[120] cursor-pointer"
                onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                }}
            >
                <X size={24} />
            </button>

            {/* Navigation Arrows */}
            {images.length > 1 && (
                <>
                    <button
                        className="absolute left-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all transform hover:scale-110 active:scale-95 z-[110] border border-white/10 cursor-pointer"
                        onClick={(e) => {
                            e.stopPropagation();
                            onPrev();
                        }}
                    >
                        <ChevronLeft size={32} />
                    </button>
                    <button
                        className="absolute right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all transform hover:scale-110 active:scale-95 z-[110] border border-white/10 cursor-pointer"
                        onClick={(e) => {
                            e.stopPropagation();
                            onNext();
                        }}
                    >
                        <ChevronRight size={32} />
                    </button>
                </>
            )}

            <div
                className="absolute inset-0 flex items-center justify-center animate-in zoom-in-95 duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                <img
                    src={currentImage.url}
                    alt={currentImage.title || "Preview"}
                    className="w-full h-full object-contain transition-all duration-300"
                />
            </div>
        </div>
    );
};

export default ImagePreview;
