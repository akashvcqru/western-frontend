"use client";
import React, { useState } from "react";
import { Plus, Search, Filter, Edit, Trash2, Folder } from "lucide-react";
import Image from "next/image";

const mockCategories = [
  { id: "CAT-001", name: "Floor Tiles", description: "Premium vitrified and ceramic tiles for flooring.", count: 45, image: "https://bawadittamal.com/wp-content/uploads/2023/12/1.jpg", status: "Active" },
  { id: "CAT-002", name: "Wall Tiles", description: "Designer wall tiles for kitchens and bathrooms.", count: 32, image: "https://bawadittamal.com/wp-content/uploads/2023/12/3.jpg", status: "Active" },
  { id: "CAT-003", name: "Wooden Flooring", description: "High-quality laminate and engineered wood.", count: 18, image: "https://bawadittamal.com/wp-content/uploads/2023/12/2.jpg", status: "Active" },
  { id: "CAT-004", name: "Bathroom Fittings", description: "Faucets, showers, and luxury bath accessories.", count: 24, image: "https://bawadittamal.com/wp-content/uploads/2023/12/4.jpg", status: "Inactive" },
  { id: "CAT-005", name: "Granite & Marble", description: "Natural stone slabs for countertops and floors.", count: 12, image: "https://bawadittamal.com/wp-content/uploads/2023/12/5.jpg", status: "Active" },
];

export default function AdminCategoriesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Categories</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">Organise products into categories</p>
        </div>
        <button
          id="add-category-btn"
          className="inline-flex items-center justify-center gap-2 bg-[#ed1c27] hover:bg-[#c5141e] text-white font-black uppercase tracking-[0.12em] text-[10px] rounded-xl px-5 py-3 transition-all duration-300 cursor-pointer hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#ed1c27]/25 flex-shrink-0"
        >
          <Plus size={14} /> Add Category
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search categories by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-medium focus:outline-none focus:border-[#ed1c27]/30 transition-colors"
          />
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-xs font-bold uppercase tracking-widest text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">
          <Filter size={14} /> Filter
        </button>
      </div>

      {/* Grid View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mockCategories.map((cat) => (
          <div key={cat.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group hover:border-[#ed1c27]/30 transition-colors">
            <div className="h-40 relative bg-gray-100 overflow-hidden">
              <Image src={cat.image} alt={cat.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-3 right-3 flex gap-2">
                <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest ${
                  cat.status === "Active" ? "bg-emerald-500 text-white" : "bg-gray-500 text-white"
                }`}>
                  {cat.status}
                </span>
              </div>
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <h3 className="text-sm font-black text-gray-900 leading-tight">{cat.name}</h3>
                  <p className="text-[10px] text-gray-400 font-medium mt-1">{cat.id}</p>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-lg text-gray-600">
                  <Folder size={12} />
                  <span className="text-[10px] font-bold">{cat.count}</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 font-medium leading-relaxed mb-5 line-clamp-2">
                {cat.description}
              </p>
              <div className="flex items-center gap-2 pt-4 border-t border-gray-50">
                <button className="flex-1 inline-flex items-center justify-center gap-2 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors cursor-pointer">
                  <Edit size={12} /> Edit
                </button>
                <button className="flex-1 inline-flex items-center justify-center gap-2 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors cursor-pointer">
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
