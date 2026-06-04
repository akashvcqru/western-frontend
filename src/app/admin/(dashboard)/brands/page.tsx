"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Upload, AlertCircle } from "lucide-react";
import Image from "next/image";
import { Card, AppModal, useAppToast, AdminPageHeader, Pagination, SearchInput } from "@/components/ui";
import { AppRoutes } from "@/constants/routes";
import {
  useGetBrandsQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
} from "@/redux/api/brandsApi";
import type { Brand } from "@/types/api";

export default function AdminBrandsPage() {
  const { addToast } = useAppToast();

  // Filter / pagination state
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Debounced search term for API call
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // RTK Query hooks
  const {
    data: brandsData,
    isLoading: isFetching,
    error: fetchError,
    refetch,
  } = useGetBrandsQuery({
    page: currentPage,
    limit: itemsPerPage,
    search: debouncedSearch,
  });

  const [createBrand, { isLoading: isCreating }] = useCreateBrandMutation();
  const [updateBrand, { isLoading: isUpdating }] = useUpdateBrandMutation();
  const [deleteBrand] = useDeleteBrandMutation();

  const brands = brandsData?.data || [];
  const pagination = brandsData?.pagination || {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: itemsPerPage,
  };
  const isLoading = isFetching;
  const error = fetchError
    ? (fetchError as { data?: { message?: string } })?.data?.message || "Failed to load brands"
    : null;
  const isSubmitting = isCreating || isUpdating;

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, itemsPerPage]);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);

  // Form state
  const [formName, setFormName] = useState("");
  const [formUrl, setFormUrl] = useState("");
  const [formLink, setFormLink] = useState("");
  const [formLogo, setFormLogo] = useState("");

  // ── Logo upload ───────────────────────────────────────────────────────────
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 102400) {
      addToast({ title: "File Too Large", message: "Logo image must not exceed 100KB.", variant: "error" });
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setFormLogo(reader.result as string);
    reader.readAsDataURL(file);
  };

  // ── Open modal ────────────────────────────────────────────────────────────
  const handleAddClick = () => {
    setEditingBrand(null);
    setFormName(""); setFormUrl(""); setFormLink(""); setFormLogo("");
    setIsModalOpen(true);
  };

  const handleEditClick = (brd: Brand) => {
    setEditingBrand(brd);
    setFormName(brd.name);
    setFormUrl(brd.url || "");
    setFormLink(brd.link || "");
    setFormLogo(brd.url?.startsWith("data:") ? brd.url : "");
    setIsModalOpen(true);
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDeleteClick = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete brand "${name}"?`)) return;
    try {
      await deleteBrand(id).unwrap();
      addToast({ title: "Brand Deleted", message: `Brand "${name}" has been deleted.`, variant: "info" });
    } catch (err: unknown) {
      addToast({ title: "Error", message: err instanceof Error ? err.message : "Delete failed", variant: "error" });
    }
  };

  // ── Form submit ───────────────────────────────────────────────────────────
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName) {
      addToast({ title: "Validation Error", message: "Brand name is required.", variant: "error" });
      return;
    }

    try {
      const payload = { name: formName, url: formLogo || formUrl, link: formLink };
      if (editingBrand) {
        await updateBrand({ id: editingBrand.id, body: payload }).unwrap();
        addToast({ title: "Brand Updated", message: `Brand "${formName}" was updated successfully.`, variant: "success" });
      } else {
        await createBrand(payload).unwrap();
        addToast({ title: "Brand Created", message: `Brand "${formName}" was added successfully.`, variant: "success" });
      }
      setIsModalOpen(false);
    } catch (err: unknown) {
      addToast({ title: "Error", message: err instanceof Error ? err.message : "Operation failed", variant: "error" });
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Brands"
        breadcrumbs={[
          { label: "Admin", href: AppRoutes.Admin.Dashboard },
          { label: "Brands" },
        ]}
      />

      <Card>
        <Card.Header>
          <SearchInput
            placeholder="Search brands by name or ID..."
            value={searchTerm}
            onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            wrapperClassName="max-w-sm"
          />
          <div className="flex items-center gap-3">
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
          {error && (
            <div className="flex items-center gap-3 p-6 text-red-600 bg-red-50 border-b border-red-100">
              <AlertCircle size={18} />
              <p className="text-sm font-semibold">{error}</p>
              <button onClick={() => refetch()} className="ml-auto text-xs underline cursor-pointer">Retry</button>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-400 w-24">Logo</th>
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">Brand Name</th>
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">Logo URL</th>
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">Website Link</th>
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoading ? (
                  Array.from({ length: itemsPerPage }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="py-3 px-6"><div className="w-16 h-10 rounded-lg bg-gray-100" /></td>
                      <td className="py-3 px-6"><div className="h-3 bg-gray-100 rounded w-24 mb-1" /><div className="h-2 bg-gray-100 rounded w-16" /></td>
                      <td className="py-3 px-6"><div className="h-3 bg-gray-100 rounded w-32" /></td>
                      <td className="py-3 px-6"><div className="h-3 bg-gray-100 rounded w-24" /></td>
                      <td className="py-3 px-6" />
                    </tr>
                  ))
                ) : brands.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-16 text-center">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">No brands found</p>
                      <p className="text-[11px] text-gray-400 mt-1">{searchTerm ? "Try adjusting your search." : "Add your first brand to get started."}</p>
                    </td>
                  </tr>
                ) : (
                  brands.map(brand => (
                    <tr key={brand.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="py-3 px-6">
                        <div className="w-16 h-10 rounded-lg bg-gray-900 overflow-hidden relative flex items-center justify-center p-2 border border-gray-800">
                          {brand.url ? (
                            <Image src={brand.url} alt={brand.name} fill className="object-contain p-1 invert brightness-0" />
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
                        <p className="text-[10px] text-gray-500 font-medium truncate max-w-[200px]">{brand.url || "—"}</p>
                      </td>
                      <td className="py-3 px-6">
                        {brand.link ? (
                          <a href={brand.link} target="_blank" rel="noreferrer" className="text-[10px] text-[#ed1c27] font-semibold hover:underline truncate max-w-[160px] block">{brand.link}</a>
                        ) : (
                          <span className="text-[10px] text-gray-400">—</span>
                        )}
                      </td>
                      <td className="py-3 px-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleEditClick(brand)} className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer" title="Edit Brand">
                            <Edit size={14} />
                          </button>
                          <button onClick={() => handleDeleteClick(brand.id, brand.name)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer" title="Delete Brand">
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
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={setCurrentPage}
            pageSize={itemsPerPage}
            onPageSizeChange={size => { setItemsPerPage(size); setCurrentPage(1); }}
            totalItems={pagination.totalItems}
            pageSizeOptions={[5, 10, 20, 50]}
          />
        </Card.Footer>
      </Card>

      {/* Add/Edit Modal */}
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
              type="text" required value={formName} onChange={e => setFormName(e.target.value)}
              placeholder="e.g. Kajaria Ceramics"
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#ed1c27]/40"
            />
          </div>

          {/* Website Link */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Website Link</label>
            <input
              type="url" value={formLink} onChange={e => setFormLink(e.target.value)}
              placeholder="https://www.brand.com"
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#ed1c27]/40"
            />
          </div>

          {/* Logo Upload */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Brand Logo</label>
            <div className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-2 bg-gray-50/50 relative group cursor-pointer transition-all duration-300 min-h-[140px] ${!formLogo ? "border-gray-200 hover:border-[#ed1c27]/60" : "border-emerald-200 hover:border-emerald-400"}`}>
              <Upload className={`w-8 h-8 transition-colors duration-300 ${!formLogo ? "text-gray-300 group-hover:text-[#ed1c27]" : "text-emerald-400"}`} />
              <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                {formLogo ? "Logo Uploaded — Click to Replace" : "Upload Brand Logo"}
              </span>
              <span className="text-[9px] text-gray-400 font-semibold uppercase tracking-widest">Click or drag — PNG, JPG or SVG (Max 100KB)</span>
              <input id="brand-logo-upload" type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleLogoUpload} />
            </div>
            {formLogo && (
              <div className="relative h-16 w-32 rounded-lg overflow-hidden border border-gray-100 bg-gray-900 mx-auto p-2">
                <Image src={formLogo} alt="Logo preview" fill className="object-contain invert brightness-0" />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-bold uppercase tracking-wider text-gray-500 hover:bg-gray-50 cursor-pointer">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="px-5 py-2 bg-[#ed1c27] hover:bg-[#c5141e] text-white font-bold uppercase tracking-wider text-xs rounded-xl cursor-pointer shadow-lg transition-all duration-200 disabled:opacity-60">
              {isSubmitting ? "Saving..." : editingBrand ? "Save Changes" : "Create Brand"}
            </button>
          </div>
        </form>
      </AppModal>
    </div>
  );
}
