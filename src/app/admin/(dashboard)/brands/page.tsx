"use client";
import React, { useState } from "react";
import { Tag, Plus, Search, Filter, Edit, Trash2, ExternalLink } from "lucide-react";
import Image from "next/image";
import { Card } from "@/components/ui";

const mockBrands = [
  { id: "BRD-001", name: "Kajaria", products: 145, status: "Active", logo: "https://bawadittamal.com/wp-content/uploads/2019/07/bdm-website-logo-Copy.png" }, // reusing logo for demo
  { id: "BRD-002", name: "Somany", products: 89, status: "Active", logo: "https://bawadittamal.com/wp-content/uploads/2019/07/bdm-website-logo-Copy.png" },
  { id: "BRD-003", name: "Jaquar", products: 56, status: "Active", logo: "https://bawadittamal.com/wp-content/uploads/2019/07/bdm-website-logo-Copy.png" },
  { id: "BRD-004", name: "Greenply", products: 34, status: "Inactive", logo: "https://bawadittamal.com/wp-content/uploads/2019/07/bdm-website-logo-Copy.png" },
  { id: "BRD-005", name: "Hindware", products: 42, status: "Active", logo: "https://bawadittamal.com/wp-content/uploads/2019/07/bdm-website-logo-Copy.png" },
];

export default function AdminBrandsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Brands</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">Manage brand listings and logos</p>
        </div>
        <button
          id="add-brand-btn"
          className="inline-flex items-center justify-center gap-2 bg-[#ed1c27] hover:bg-[#c5141e] text-white font-black uppercase tracking-[0.12em] text-[10px] rounded-xl px-5 py-3 transition-all duration-300 cursor-pointer hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#ed1c27]/25 flex-shrink-0"
        >
          <Plus size={14} /> Add Brand
        </button>
      </div>

      {/* Toolbar */}
      <Card>
        <Card.Body>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search brands by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-medium focus:outline-none focus:border-[#ed1c27]/30 transition-colors"
            />
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-xs font-bold uppercase tracking-widest text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">
            <Filter size={14} /> Filter
          </button>
          </div>
        </Card.Body>
      </Card>

      {/* Data Table */}
      <Card>
        <Card.Body noPadding>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-gray-400 w-24">Logo</th>
                  <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Brand Name</th>
                  <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Total Products</th>
                  <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                  <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {mockBrands.map((brand) => (
                  <tr key={brand.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="py-3 px-6">
                      <div className="w-16 h-10 rounded-lg bg-gray-900 overflow-hidden relative flex items-center justify-center p-2">
                        <Image src={brand.logo} alt={brand.name} fill className="object-contain p-1 invert brightness-0" />
                      </div>
                    </td>
                    <td className="py-3 px-6">
                      <p className="text-xs font-bold text-gray-900">{brand.name}</p>
                      <p className="text-[10px] text-gray-400 font-medium mt-0.5">{brand.id}</p>
                    </td>
                    <td className="py-3 px-6">
                      <span className="inline-flex items-center justify-center bg-gray-100 text-gray-600 rounded-lg px-3 py-1 text-[10px] font-black">
                        {brand.products} Items
                      </span>
                    </td>
                    <td className="py-3 px-6">
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${
                        brand.status === "Active" ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-500"
                      }`}>
                        {brand.status}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer" title="View Products">
                          <ExternalLink size={14} />
                        </button>
                        <button className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer">
                          <Edit size={14} />
                        </button>
                        <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
