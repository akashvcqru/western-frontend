"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Upload, X } from "lucide-react";
import Image from "next/image";
import { Card, AppModal, useAppToast, AdminPageHeader, Pagination, SearchInput } from "@/components/ui";
import { AppRoutes } from "@/constants/routes";

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

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);

  // Form State
  const [formName, setFormName] = useState("");
  const [formProducts, setFormProducts] = useState("");
  const [formStatus, setFormStatus] = useState("Active");
  const [formLogo, setFormLogo] = useState("");

  // Count products belonging to a brand from sessionStorage
  const getProductCount = (brandName: string): number => {
    try {
      const stored = sessionStorage.getItem("bdm_products");
      if (!stored) return 0;
      const products: { brand?: string }[] = JSON.parse(stored);
      return products.filter(
        (p) => p.brand?.toLowerCase() === brandName.toLowerCase()
      ).length;
    } catch {
      return 0;
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      addToast({ title: "File Too Large", message: "Please choose an image smaller than 2 MB.", variant: "warning" });
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setFormLogo(reader.result as string);
    reader.readAsDataURL(file);
  };

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
    setFormProducts("");
    setFormStatus("Active");
    setFormLogo("");
    setIsModalOpen(true);
  };

  const handleEditClick = (brd: Brand) => {
    setEditingBrand(brd);
    setFormName(brd.name);
    setFormProducts(String(getProductCount(brd.name) || brd.products));
    setFormStatus(brd.status);
    // Only restore logo if it's a real uploaded image (base64 data URL)
    setFormLogo(brd.logo?.startsWith("data:") ? brd.logo : "");
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

    if (!formName || !formLogo) {
      addToast({
        title: "Validation Error",
        message: !formName ? "Brand name is required." : "Please upload a brand logo image.",
        variant: "error",
      });
      return;
    }

    const logoUrl = formLogo;

    // Use manually entered count if provided, otherwise fall back to dynamic count
    const productCount = formProducts.trim() !== "" ? parseInt(formProducts, 10) || 0 : getProductCount(formName);

    if (editingBrand) {
      const updated = brands.map((b) => {
        if (b.id === editingBrand.id) {
          return {
            ...b,
            name: formName,
            products: productCount,
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
        products: productCount,
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
    return (
      brd.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      brd.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredBrands.length / itemsPerPage);
  const paginatedBrands = filteredBrands.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      {/* Admin Page Header with Breadcrumb */}
      <AdminPageHeader
        title="Brands"
        breadcrumbs={[
          { label: "Admin", href: AppRoutes.Admin.Dashboard },
          { label: "Brands" },
        ]}
      />

      {/* Data Table with Integrated Toolbar */}
      <Card>
        <Card.Header>
          {/* Left: Search input */}
          <SearchInput
            placeholder="Search brands by name or ID..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            wrapperClassName="max-w-sm"
          />

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            {/* Add Brand button */}
            <button
              id="add-brand-btn"
              onClick={handleAddClick}
              className="inline-flex items-center justify-center gap-2 bg-[#ed1c27] hover:bg-[#c5141e] text-white font-bold uppercase tracking-[0.12em] text-[10px] rounded-xl px-5 py-2 transition-all duration-300 cursor-pointer hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#ed1c27]/25"
            >
              <Plus size={14} /> Add Brand
            </button>
          </div>
        </Card.Header>

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
                {paginatedBrands.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-xs font-semibold text-gray-400">
                      No brands found matching your search.
                    </td>
                  </tr>
                ) : (
                  paginatedBrands.map((brand) => (
                    <tr key={brand.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="py-3 px-6">
                        <div className="w-16 h-10 rounded-lg bg-gray-900 overflow-hidden relative flex items-center justify-center p-2 border border-gray-800">
                          {brand.logo ? (
                            <Image src={brand.logo} alt={brand.name} fill className="object-contain p-1 invert brightness-0" />
                          ) : (
                            <span className="text-[8px] text-gray-500 font-bold uppercase tracking-wider text-center leading-tight">No Logo</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-6">
                        <p className="text-xs font-semibold text-gray-900">{brand.name}</p>
                        <p className="text-[10px] text-gray-400 font-medium mt-0.5">{brand.id}</p>
                      </td>
                      <td className="py-3 px-6">
                        <span className="inline-flex items-center justify-center bg-gray-100 text-gray-600 rounded-lg px-2.5 py-1 text-[10px] font-semibold">
                          {getProductCount(brand.name) || brand.products} Items
                        </span>
                      </td>
                      <td className="py-3 px-6">
                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest ${
                          brand.status === "Active" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
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
        <Card.Footer>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            pageSize={itemsPerPage}
            onPageSizeChange={(size) => {
              setItemsPerPage(size);
              setCurrentPage(1);
            }}
            totalItems={filteredBrands.length}
            pageSizeOptions={[5, 10, 20, 50]}
          />
        </Card.Footer>
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

          {/* Total Products */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Total Products</label>
            <div className="relative">
              <input
                type="number"
                min="0"
                value={formProducts}
                onChange={(e) => setFormProducts(e.target.value)}
                placeholder={String(getProductCount(formName) || 0)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#ed1c27]/40"
              />
              <p className="text-[9px] text-gray-400 font-semibold mt-1">
                Auto-filled from products list. Override manually if needed.
              </p>
            </div>
          </div>

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

          {/* Logo Upload */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Brand Logo *</label>

            {/* Dropzone */}
            <div className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-2 bg-gray-50/50 relative group cursor-pointer transition-all duration-300 min-h-[140px] ${!formLogo ? "border-red-200 hover:border-[#ed1c27]/60" : "border-emerald-200 hover:border-emerald-400"
              }`}>
              <Upload className={`w-8 h-8 transition-colors duration-300 ${!formLogo ? "text-gray-300 group-hover:text-[#ed1c27]" : "text-emerald-400"
                }`} />
              <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                {formLogo ? "Logo Uploaded — Click to Replace" : "Upload Brand Logo"}
              </span>
              <span className="text-[9px] text-gray-400 font-semibold uppercase tracking-widest">Click or drag — PNG, JPG or SVG</span>
              <input
                id="brand-logo-upload"
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleLogoUpload}
              />
            </div>

            <p className={`text-[9px] font-semibold ${!formLogo ? "text-red-400" : "text-gray-400"}`}>
              {!formLogo ? "Required — please upload a brand logo." : "Max 2 MB. Click the dropzone above to replace."}
            </p>
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
              disabled={!formLogo}
              className={`px-5 py-2 text-white font-bold uppercase tracking-wider text-xs rounded-xl shadow-lg transition-all duration-200 ${
                formLogo
                  ? "bg-[#ed1c27] hover:bg-[#c5141e] cursor-pointer"
                  : "bg-gray-300 cursor-not-allowed opacity-60"
              }`}
              title={!formLogo ? "Upload a brand logo to continue" : undefined}
            >
              {editingBrand ? "Save Changes" : "Create Brand"}
            </button>
          </div>
        </form>
      </AppModal>
    </div>
  );
}
