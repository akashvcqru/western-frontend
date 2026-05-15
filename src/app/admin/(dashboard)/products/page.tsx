"use client";
import React, { useState } from "react";
import { Package, Plus, Search, Filter, MoreVertical, Edit, Trash2, Eye } from "lucide-react";
import Image from "next/image";
import { Card } from "@/components/ui";

const mockProducts = [
  { id: "PROD-001", name: "Premium Vitrified Tiles", category: "Tiles", brand: "Kajaria", price: "₹850/box", status: "In Stock", stock: 145, image: "https://bawadittamal.com/wp-content/uploads/2023/12/1.jpg" },
  { id: "PROD-002", name: "Wooden Finish Flooring", category: "Flooring", brand: "Greenply", price: "₹1,200/sqft", status: "Low Stock", stock: 12, image: "https://bawadittamal.com/wp-content/uploads/2023/12/2.jpg" },
  { id: "PROD-003", name: "Ceramic Wall Tiles", category: "Tiles", brand: "Somany", price: "₹650/box", status: "In Stock", stock: 89, image: "https://bawadittamal.com/wp-content/uploads/2023/12/3.jpg" },
  { id: "PROD-004", name: "Luxury Bathroom Fittings", category: "Fittings", brand: "Jaquar", price: "₹4,500/set", status: "Out of Stock", stock: 0, image: "https://bawadittamal.com/wp-content/uploads/2023/12/4.jpg" },
  { id: "PROD-005", name: "Granite Countertop", category: "Stones", brand: "Local", price: "₹3,200/slab", status: "In Stock", stock: 34, image: "https://bawadittamal.com/wp-content/uploads/2023/12/5.jpg" },
];

export default function AdminProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Products</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">Manage your product catalogue</p>
        </div>
        <button
          id="add-product-btn"
          className="inline-flex items-center justify-center gap-2 bg-[#ed1c27] hover:bg-[#c5141e] text-white font-black uppercase tracking-[0.12em] text-[10px] rounded-xl px-5 py-3 transition-all duration-300 cursor-pointer hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#ed1c27]/25 flex-shrink-0"
        >
          <Plus size={14} /> Add Product
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
              placeholder="Search products by name, ID or brand..."
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
                  <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-gray-400 w-16">Image</th>
                  <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Product</th>
                  <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Category & Brand</th>
                  <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Price</th>
                  <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                  <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {mockProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="py-3 px-6">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden relative">
                        <Image src={prod.image} alt={prod.name} fill className="object-cover" />
                      </div>
                    </td>
                    <td className="py-3 px-6">
                      <p className="text-xs font-bold text-gray-900">{prod.name}</p>
                      <p className="text-[10px] text-gray-400 font-medium mt-0.5">{prod.id}</p>
                    </td>
                    <td className="py-3 px-6">
                      <p className="text-xs font-semibold text-gray-700">{prod.category}</p>
                      <p className="text-[10px] text-gray-400 font-medium mt-0.5">{prod.brand}</p>
                    </td>
                    <td className="py-3 px-6 text-xs font-bold text-gray-900">
                      {prod.price}
                    </td>
                    <td className="py-3 px-6">
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${
                        prod.status === "In Stock" ? "bg-emerald-50 text-emerald-600" :
                        prod.status === "Low Stock" ? "bg-amber-50 text-amber-600" :
                        "bg-red-50 text-red-600"
                      }`}>
                        {prod.status} ({prod.stock})
                      </span>
                    </td>
                    <td className="py-3 px-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer">
                          <Eye size={14} />
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
        {/* Pagination placeholder */}
        <Card.Footer mutedBackground>
          <div className="w-full flex items-center justify-between">
            <p className="text-xs text-gray-500 font-medium">Showing 1 to 5 of 124 products</p>
          <div className="flex gap-1">
            <button className="px-3 py-1.5 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 text-xs font-medium cursor-pointer disabled:opacity-50" disabled>Prev</button>
            <button className="px-3 py-1.5 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 text-xs font-medium cursor-pointer">Next</button>
          </div>
          </div>
        </Card.Footer>
      </Card>
    </div>
  );
}
