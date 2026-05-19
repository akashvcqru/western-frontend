"use client";
import React from "react";
import { Upload, Trash2, Eye } from "lucide-react";
import Image from "next/image";

const mockGallery = [
  { id: "IMG-001", title: "Modern Bathroom Setup", date: "10 May 2026", image: "https://bawadittamal.com/wp-content/uploads/2023/12/1.jpg" },
  { id: "IMG-002", title: "Wooden Flooring Sample", date: "09 May 2026", image: "https://bawadittamal.com/wp-content/uploads/2023/12/2.jpg" },
  { id: "IMG-003", title: "Ceramic Wall Tiles", date: "08 May 2026", image: "https://bawadittamal.com/wp-content/uploads/2023/12/3.jpg" },
  { id: "IMG-004", title: "Luxury Faucets", date: "05 May 2026", image: "https://bawadittamal.com/wp-content/uploads/2023/12/4.jpg" },
  { id: "IMG-005", title: "Granite Slab", date: "02 May 2026", image: "https://bawadittamal.com/wp-content/uploads/2023/12/5.jpg" },
  { id: "IMG-006", title: "Kitchen Tiles", date: "01 May 2026", image: "https://bawadittamal.com/wp-content/uploads/2023/12/1.jpg" },
];

export default function AdminGalleryPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Gallery</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">Upload and manage gallery images</p>
        </div>
        <button
          id="upload-image-btn"
          className="inline-flex items-center justify-center gap-2 bg-[#ed1c27] hover:bg-[#c5141e] text-white font-black uppercase tracking-[0.12em] text-[10px] rounded-xl px-5 py-3 transition-all duration-300 cursor-pointer hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#ed1c27]/25 flex-shrink-0"
        >
          <Upload size={14} /> Upload Image
        </button>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* Upload Card */}
        <button className="flex flex-col items-center justify-center gap-3 bg-white rounded-2xl border-2 border-dashed border-gray-200 hover:border-[#ed1c27]/50 hover:bg-[#ed1c27]/[0.02] aspect-square transition-all cursor-pointer group">
          <div className="w-12 h-12 rounded-full bg-gray-50 group-hover:bg-[#ed1c27]/10 flex items-center justify-center transition-colors">
            <Upload size={20} className="text-gray-400 group-hover:text-[#ed1c27] transition-colors" />
          </div>
          <span className="text-[11px] font-black uppercase tracking-widest text-gray-500 group-hover:text-[#ed1c27]">Drop Image Here</span>
        </button>

        {/* Image Cards */}
        {mockGallery.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group aspect-square relative">
            <Image src={item.image} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
              <div className="flex justify-end gap-2">
                <button className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/40 backdrop-blur-sm flex items-center justify-center text-white transition-colors cursor-pointer">
                  <Eye size={14} />
                </button>
                <button className="w-8 h-8 rounded-lg bg-red-500/80 hover:bg-red-500 backdrop-blur-sm flex items-center justify-center text-white transition-colors cursor-pointer">
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
    </div>
  );
}
