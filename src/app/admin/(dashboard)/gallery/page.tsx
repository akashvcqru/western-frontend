"use client";

import React, { useState, useEffect } from "react";
import { Upload, Trash2, Eye, X } from "lucide-react";
import Image from "next/image";
import { Card, AppModal, useAppToast } from "@/components/ui";

interface GalleryItem {
  id: string;
  title: string;
  date: string;
  image: string;
}

const initialGallery: GalleryItem[] = [
  { id: "IMG-001", title: "Modern Bathroom Setup", date: "10 May 2026", image: "https://bawadittamal.com/wp-content/uploads/2023/12/1.jpg" },
  { id: "IMG-002", title: "Wooden Flooring Sample", date: "09 May 2026", image: "https://bawadittamal.com/wp-content/uploads/2023/12/2.jpg" },
  { id: "IMG-003", title: "Ceramic Wall Tiles", date: "08 May 2026", image: "https://bawadittamal.com/wp-content/uploads/2023/12/3.jpg" },
  { id: "IMG-004", title: "Luxury Faucets", date: "05 May 2026", image: "https://bawadittamal.com/wp-content/uploads/2023/12/4.jpg" },
  { id: "IMG-005", title: "Granite Slab", date: "02 May 2026", image: "https://bawadittamal.com/wp-content/uploads/2023/12/5.jpg" },
  { id: "IMG-006", title: "Kitchen Tiles", date: "01 May 2026", image: "https://bawadittamal.com/wp-content/uploads/2023/12/1.jpg" },
];

export default function AdminGalleryPage() {
  const { addToast } = useAppToast();

  // State
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  
  // Modals state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  // Form state
  const [formTitle, setFormTitle] = useState("");
  const [formImage, setFormImage] = useState("");

  // Load from sessionStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("bdm_gallery");
      if (stored) {
        try {
          setGallery(JSON.parse(stored));
        } catch {
          setGallery(initialGallery);
        }
      } else {
        setGallery(initialGallery);
        sessionStorage.setItem("bdm_gallery", JSON.stringify(initialGallery));
      }
    }
  }, []);

  // Save helper
  const saveGallery = (updated: GalleryItem[]) => {
    setGallery(updated);
    sessionStorage.setItem("bdm_gallery", JSON.stringify(updated));
  };

  const handleUploadClick = () => {
    setFormTitle("");
    setFormImage("");
    setIsUploadOpen(true);
  };

  const handlePreviewClick = (item: GalleryItem) => {
    setSelectedItem(item);
    setIsPreviewOpen(true);
  };

  const handleDeleteClick = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}" from the gallery?`)) {
      const updated = gallery.filter((item) => item.id !== id);
      saveGallery(updated);
      addToast({
        title: "Image Removed",
        message: `"${title}" has been deleted from your gallery.`,
        variant: "info",
      });
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formTitle) {
      addToast({
        title: "Validation Error",
        message: "Please enter a valid title.",
        variant: "error",
      });
      return;
    }

    const defaultImage = "https://bawadittamal.com/wp-content/uploads/2023/12/1.jpg";
    const imageUrl = formImage.trim() || defaultImage;

    const todayStr = new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const newId = `IMG-${String(gallery.length + 1).padStart(3, "0")}`;
    const newItem: GalleryItem = {
      id: newId,
      title: formTitle,
      date: todayStr,
      image: imageUrl,
    };

    const updated = [newItem, ...gallery];
    saveGallery(updated);
    addToast({
      title: "Image Uploaded",
      message: `"${formTitle}" has been added to the showroom gallery.`,
      variant: "success",
    });

    setIsUploadOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">Gallery</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">Upload and manage showroom catalog inspiration</p>
        </div>
        <button
          id="upload-image-btn"
          onClick={handleUploadClick}
          className="inline-flex items-center justify-center gap-2 bg-[#ed1c27] hover:bg-[#c5141e] text-white font-bold uppercase tracking-[0.12em] text-[10px] rounded-xl px-5 py-3 transition-all duration-300 cursor-pointer hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#ed1c27]/25 flex-shrink-0"
        >
          <Upload size={14} /> Upload Image
        </button>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* Upload Card */}
        <button
          onClick={handleUploadClick}
          className="flex flex-col items-center justify-center gap-3 bg-white rounded-2xl border-2 border-dashed border-gray-200 hover:border-[#ed1c27]/50 hover:bg-[#ed1c27]/[0.02] aspect-square transition-all cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-full bg-gray-50 group-hover:bg-[#ed1c27]/10 flex items-center justify-center transition-colors">
            <Upload size={20} className="text-gray-400 group-hover:text-[#ed1c27] transition-colors" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500 group-hover:text-[#ed1c27]">Upload Image</span>
        </button>

        {/* Image Cards */}
        {gallery.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group aspect-square relative">
            <Image src={item.image} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 z-10">
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => handlePreviewClick(item)}
                  className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/40 backdrop-blur-sm flex items-center justify-center text-white transition-colors cursor-pointer"
                  title="Preview"
                >
                  <Eye size={14} />
                </button>
                <button
                  onClick={() => handleDeleteClick(item.id, item.title)}
                  className="w-8 h-8 rounded-lg bg-red-500/80 hover:bg-red-500 backdrop-blur-sm flex items-center justify-center text-white transition-colors cursor-pointer"
                  title="Remove"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <div>
                <p className="text-white text-xs font-bold leading-tight">{item.title}</p>
                <p className="text-white/60 text-[10px] font-medium mt-1">{item.date}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Image Modal */}
      <AppModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        title="Upload Showcase Image"
        size="md"
      >
        <form onSubmit={handleUploadSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Showcase Title *</label>
            <input
              type="text"
              required
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="e.g. Modern Office Workstations"
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#ed1c27]/40"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Showcase Image URL</label>
            <input
              type="text"
              value={formImage}
              onChange={(e) => setFormImage(e.target.value)}
              placeholder="e.g. https://domain.com/path/to/image.jpg"
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#ed1c27]/40"
            />
            <p className="text-[9px] text-gray-400 mt-0.5">Leave blank to use a fallback interior mockup.</p>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsUploadOpen(false)}
              className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-bold uppercase tracking-wider text-gray-500 hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#ed1c27] hover:bg-[#c5141e] text-white font-bold uppercase tracking-wider text-xs rounded-xl cursor-pointer shadow-lg"
            >
              Add Image
            </button>
          </div>
        </form>
      </AppModal>

      {/* Full-Screen Image Preview Modal */}
      {selectedItem && (
        <AppModal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          hideHeader
          hideFooter
          size="lg"
          bodyClassName="p-0 bg-neutral-950 flex flex-col items-center relative"
        >
          {/* Close trigger overlay */}
          <button
            onClick={() => setIsPreviewOpen(false)}
            className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors"
          >
            <X size={18} />
          </button>
          
          <div className="w-full h-[60vh] sm:h-[70vh] relative">
            <Image src={selectedItem.image} alt={selectedItem.title} fill className="object-contain" />
          </div>
          
          <div className="w-full bg-neutral-900 px-6 py-4 flex flex-col gap-1 border-t border-neutral-800">
            <p className="text-white text-sm font-bold">{selectedItem.title}</p>
            <div className="flex justify-between items-center text-[10px] text-neutral-400 font-semibold uppercase tracking-wider mt-1">
              <span>{selectedItem.id}</span>
              <span>{selectedItem.date}</span>
            </div>
          </div>
        </AppModal>
      )}
    </div>
  );
}
