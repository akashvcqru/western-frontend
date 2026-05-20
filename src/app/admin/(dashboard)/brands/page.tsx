"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search, Filter, Edit, Trash2, ExternalLink, X } from "lucide-react";
import Image from "next/image";
import { Card, AppModal, useAppToast } from "@/components/ui";

interface Brand {
  id: string;
  name: string;
  products: number;
  status: string;
  logo: string;
}

const initialBrands: Brand[] = [
  { id: "BRD-001", name: "Kajaria", products: 145, status: "Active", logo: "https://bawadittamal.com/wp-content/uploads/2019/07/bdm-website-logo-Copy.png" },
  { id: "BRD-002", name: "Somany", products: 89, status: "Active", logo: "https://bawadittamal.com/wp-content/uploads/2019/07/bdm-website-logo-Copy.png" },
  { id: "BRD-003", name: "Jaquar", products: 56, status: "Active", logo: "https://bawadittamal.com/wp-content/uploads/2019/07/bdm-website-logo-Copy.png" },
  { id: "BRD-004", name: "Greenply", products: 34, status: "Inactive", logo: "https://bawadittamal.com/wp-content/uploads/2019/07/bdm-website-logo-Copy.png" },
  { id: "BRD-005", name: "Hindware", products: 42, status: "Active", logo: "https://bawadittamal.com/wp-content/uploads/2019/07/bdm-website-logo-Copy.png" },
];

export default function AdminBrandsPage() {
  const { addToast } = useAppToast();
  
  // State
  const [brands, setBrands] = useState<Brand[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  
  // Form State
  const [formName, setFormName] = useState("");
  const [formProducts, setFormProducts] = useState<number>(0);
  const [formStatus, setFormStatus] = useState("Active");
  const [formLogo, setFormLogo] = useState("");

  // Load from sessionStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("bdm_brands");
      if (stored) {
        try {
          setBrands(JSON.parse(stored));
        } catch {
          setBrands(initialBrands);
        }
      } else {
        setBrands(initialBrands);
        sessionStorage.setItem("bdm_brands", JSON.stringify(initialBrands));
      }
    }
  }, []);

  // Save helper
  const saveBrands = (updated: Brand[]) => {
    setBrands(updated);
    sessionStorage.setItem("bdm_brands", JSON.stringify(updated));
  };

  const handleAddClick = () => {
    setEditingBrand(null);
    setFormName("");
    setFormProducts(0);
    setFormStatus("Active");
    setFormLogo("");
    setIsModalOpen(true);
  };

  const handleEditClick = (brd: Brand) => {
    setEditingBrand(brd);
    setFormName(brd.name);
    setFormProducts(brd.products);
    setFormStatus(brd.status);
    setFormLogo(brd.logo);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete brand "${name}"?`)) {
      const updated = brands.filter((b) => b.id !== id);
      saveBrands(updated);
      addToast({
        title: "Brand Deleted",
        message: `Brand "${name}" has been deleted.`,
        variant: "info",
      });
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formName) {
      addToast({
        title: "Validation Error",
        message: "Please fill in all required fields.",
        variant: "error",
      });
      return;
    }

    const defaultLogo = "https://bawadittamal.com/wp-content/uploads/2019/07/bdm-website-logo-Copy.png";
    const logoUrl = formLogo.trim() || defaultLogo;

    if (editingBrand) {
      const updated = brands.map((b) => {
        if (b.id === editingBrand.id) {
          return {
            ...b,
            name: formName,
            products: formProducts,
            status: formStatus,
            logo: logoUrl,
          };
        }
        return b;
      });
      saveBrands(updated);
      addToast({
        title: "Brand Updated",
        message: `Brand "${formName}" was updated successfully.`,
        variant: "success",
      });
    } else {
      const newId = `BRD-${String(brands.length + 1).padStart(3, "0")}`;
      const newBrand: Brand = {
        id: newId,
        name: formName,
        products: formProducts,
        status: formStatus,
        logo: logoUrl,
      };
      const updated = [...brands, newBrand];
      saveBrands(updated);
      addToast({
        title: "Brand Created",
        message: `Brand "${formName}" was added successfully.`,
        variant: "success",
      });
    }

    setIsModalOpen(false);
  };

  // Filter brands
  const filteredBrands = brands.filter((brd) => {
    return brd.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">Brands</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">Manage brand listings, status, and partner logos</p>
        </div>
        <button
          id="add-brand-btn"
          onClick={handleAddClick}
          className="inline-flex items-center justify-center gap-2 bg-[#ed1c27] hover:bg-[#c5141e] text-white font-bold uppercase tracking-[0.12em] text-[10px] rounded-xl px-5 py-3 transition-all duration-300 cursor-pointer hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#ed1c27]/25 flex-shrink-0"
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
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-400 w-24">Logo</th>
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">Brand Name</th>
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">Total Products</th>
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</th>
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredBrands.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-xs font-semibold text-gray-400">
                      No brands found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredBrands.map((brand) => (
                    <tr key={brand.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="py-3 px-6">
                        <div className="w-16 h-10 rounded-lg bg-gray-900 overflow-hidden relative flex items-center justify-center p-2 border border-gray-800">
                          <Image src={brand.logo} alt={brand.name} fill className="object-contain p-1 invert brightness-0" />
                        </div>
                      </td>
                      <td className="py-3 px-6">
                        <p className="text-xs font-semibold text-gray-900">{brand.name}</p>
                        <p className="text-[10px] text-gray-400 font-medium mt-0.5">{brand.id}</p>
                      </td>
                      <td className="py-3 px-6">
                        <span className="inline-flex items-center justify-center bg-gray-100 text-gray-600 rounded-lg px-2.5 py-1 text-[10px] font-semibold">
                          {brand.products} Items
                        </span>
                      </td>
                      <td className="py-3 px-6">
                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest ${
                          brand.status === "Active" ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-500"
                        }`}>
                          {brand.status}
                        </span>
                      </td>
                      <td className="py-3 px-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEditClick(brand)}
                            className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit Brand"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(brand.id, brand.name)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Brand"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card.Body>
      </Card>

      {/* Brands Add/Edit Modal */}
      <AppModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingBrand ? "Edit Brand" : "Add New Brand"}
        size="md"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Brand Name *</label>
            <input
              type="text"
              required
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="e.g. Kajaria Ceramics"
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#ed1c27]/40"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Status */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Status *</label>
              <select
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            {/* Product Count */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Total Products</label>
              <input
                type="number"
                min={0}
                value={formProducts}
                onChange={(e) => setFormProducts(Number(e.target.value))}
                placeholder="e.g. 24"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#ed1c27]/40"
              />
            </div>
          </div>

          {/* Logo URL */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Logo Image URL</label>
            <input
              type="text"
              value={formLogo}
              onChange={(e) => setFormLogo(e.target.value)}
              placeholder="e.g. https://domain.com/path/to/logo.png"
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#ed1c27]/40"
            />
            <p className="text-[9px] text-gray-400 mt-0.5">Leave blank to use the default storefront logo.</p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-bold uppercase tracking-wider text-gray-500 hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#ed1c27] hover:bg-[#c5141e] text-white font-bold uppercase tracking-wider text-xs rounded-xl cursor-pointer shadow-lg"
            >
              {editingBrand ? "Save Changes" : "Create Brand"}
            </button>
          </div>
        </form>
      </AppModal>
    </div>
  );
}
