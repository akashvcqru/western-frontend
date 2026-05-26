"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Eye, X, Upload, AlertCircle } from "lucide-react";
import Image from "next/image";
import { Card, AppModal, useAppToast, AdminPageHeader, Pagination, SearchInput } from "@/components/ui";
import { AppRoutes } from "@/constants/routes";
import {
  useGetGalleryQuery,
  useCreateGalleryItemMutation,
  useDeleteGalleryItemMutation,
} from "@/redux/api/galleryApi";
import { useGetCategoriesQuery } from "@/redux/api/categoriesApi";
import type { GalleryItem } from "@/types/api";

export default function AdminGalleryPage() {
  const { addToast } = useAppToast();

  // Filter / pagination state
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  // Debounced search term for API call
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // RTK Query hooks
  const {
    data: galleryData,
    isLoading: isFetching,
    error: fetchError,
    refetch,
  } = useGetGalleryQuery({ limit: 1000 });

  const { data: categoriesResult } = useGetCategoriesQuery({ limit: 100 });
  const categories = categoriesResult?.data
    ?.filter(c => c.status === "Active")
    ?.map(c => c.name) || [];

  const [createGalleryItem] = useCreateGalleryItemMutation();
  const [deleteGalleryItem] = useDeleteGalleryItemMutation();

  // Group all gallery items by category
  const groupedGallery = React.useMemo(() => {
    const gallery = galleryData?.data || [];
    const groups: { [key: string]: GalleryItem[] } = {};
    gallery.forEach(item => {
      const cat = item.category || "Uncategorized";
      if (!groups[cat]) {
        groups[cat] = [];
      }
      groups[cat].push(item);
    });
    return Object.entries(groups).map(([category, items]) => ({
      category,
      items,
    }));
  }, [galleryData?.data]);

  // Client-side search and filtering
  const filteredGroups = React.useMemo(() => {
    if (!debouncedSearch.trim()) return groupedGallery;
    const searchLower = debouncedSearch.toLowerCase();
    return groupedGallery.filter(
      group =>
        group.category.toLowerCase().includes(searchLower) ||
        group.items.some(item => item.title.toLowerCase().includes(searchLower))
    );
  }, [groupedGallery, debouncedSearch]);

  // Client-side pagination
  const paginatedGroups = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredGroups.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredGroups, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredGroups.length / itemsPerPage) || 1;

  const pagination = {
    currentPage,
    totalPages,
    totalItems: filteredGroups.length,
    limit: itemsPerPage,
  };

  const isLoading = isFetching;
  const error = fetchError
    ? (fetchError as { data?: { message?: string } })?.data?.message || "Failed to load gallery"
    : null;

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, itemsPerPage]);

  // Modal state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  // Form state
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState("");
  const [formImages, setFormImages] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDeleteClick = async (id: number, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}" from the gallery?`)) return;
    try {
      await deleteGalleryItem(id).unwrap();
      addToast({ title: "Image Removed", message: `"${title}" has been deleted from your gallery.`, variant: "info" });
    } catch (err: unknown) {
      addToast({ title: "Error", message: err instanceof Error ? err.message : "Delete failed", variant: "error" });
    }
  };

  // ── Drag & Drop ───────────────────────────────────────────────────────────
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);

  const readFilesAsBase64 = (files: File[]) => {
    if (formImages.length + files.length > 5) {
      addToast({ title: "Limit Exceeded", message: "You can upload a maximum of 5 images.", variant: "error" });
      return;
    }
    files.forEach(file => {
      if (!file.type.startsWith("image/")) {
        addToast({ title: "Invalid File Type", message: `"${file.name}" is not an image.`, variant: "error" });
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        addToast({ title: "File Too Large", message: `"${file.name}" exceeds the 2MB limit.`, variant: "error" });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") setFormImages(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    readFilesAsBase64(Array.from(e.dataTransfer.files));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) readFilesAsBase64(Array.from(e.target.files));
  };

  // ── Upload submit ─────────────────────────────────────────────────────────
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      addToast({ title: "Validation Error", message: "Please enter a valid title.", variant: "error" });
      return;
    }
    if (!formCategory) {
      addToast({ title: "Validation Error", message: "Please select a category.", variant: "error" });
      return;
    }
    if (formImages.length === 0) {
      addToast({ title: "Validation Error", message: "Please upload at least one image.", variant: "error" });
      return;
    }

    setIsSubmitting(true);
    try {
      // Upload each image as a separate gallery item
      for (let i = 0; i < formImages.length; i++) {
        const suffix = formImages.length > 1 ? ` - ${i + 1}` : "";
        await createGalleryItem({
          title: `${formTitle.trim()}${suffix}`,
          category: formCategory,
          image: formImages[i],
        }).unwrap();
      }
      addToast({
        title: "Images Uploaded",
        message: `Successfully added ${formImages.length} image(s) to the showroom gallery.`,
        variant: "success",
      });
      setIsUploadOpen(false);
      setFormTitle(""); setFormCategory(""); setFormImages([]);
      setCurrentPage(1);
    } catch (err: unknown) {
      addToast({ title: "Error", message: err instanceof Error ? err.message : "Upload failed", variant: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUploadClick = () => {
    setFormTitle(""); setFormCategory(""); setFormImages([]);
    setIsUploadOpen(true);
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Gallery"
        breadcrumbs={[
          { label: "Admin", href: AppRoutes.Admin.Dashboard },
          { label: "Gallery" },
        ]}
      />

      <Card>
        <Card.Header>
          <SearchInput
            placeholder="Search gallery by title or category..."
            value={searchTerm}
            onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            wrapperClassName="max-w-sm"
          />
          <div className="flex items-center gap-3">
            <button
              id="upload-image-btn"
              onClick={handleUploadClick}
              className="inline-flex items-center justify-center gap-2 bg-[#ed1c27] hover:bg-[#c5141e] text-white font-bold uppercase tracking-[0.12em] text-[10px] rounded-xl px-5 py-2 transition-all duration-300 cursor-pointer hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#ed1c27]/25"
            >
              <Plus size={14} /> Upload Image
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
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-400 w-1/4">Category</th>
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">Showcase Images</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoading ? (
                  Array.from({ length: Math.min(itemsPerPage, 4) }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="py-5 px-6">
                        <div className="h-4 bg-gray-100 rounded w-32 mb-2" />
                        <div className="h-3 bg-gray-100 rounded w-16" />
                      </td>
                      <td className="py-5 px-6">
                        <div className="flex gap-2">
                          <div className="w-16 h-10 rounded-lg bg-gray-100" />
                          <div className="w-16 h-10 rounded-lg bg-gray-100" />
                          <div className="w-16 h-10 rounded-lg bg-gray-100" />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : filteredGroups.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="py-16 text-center">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">No gallery items found</p>
                      <p className="text-[11px] text-gray-400 mt-1">{searchTerm ? "Try adjusting your search." : "Upload your first showcase image to get started."}</p>
                    </td>
                  </tr>
                ) : (
                  paginatedGroups.map((group, groupIdx) => (
                    <tr key={groupIdx} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="py-4 px-6 align-top">
                        <p className="text-xs font-bold text-gray-900">{group.category}</p>
                        <span className="inline-flex items-center bg-gray-100 text-gray-600 rounded-lg px-2.5 py-1 text-[10px] font-semibold mt-2">
                          {group.items.length} Design{group.items.length !== 1 ? "s" : ""}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-wrap gap-2.5">
                          {group.items.map((item) => (
                            <div
                              key={item.id}
                              title={item.title}
                              className="relative w-16 h-10 rounded-lg bg-gray-100 overflow-hidden relative border border-gray-200 group/thumb"
                            >
                              <Image src={item.image} alt={item.title} fill className="object-cover" />
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center gap-2 z-10">
                                <button
                                  type="button"
                                  onClick={() => { setSelectedItem(item); setIsPreviewOpen(true); }}
                                  className="p-1 text-white hover:text-[#ed1c27] transition-colors cursor-pointer"
                                  title={`Preview: ${item.title}`}
                                >
                                  <Eye size={12} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteClick(item.id, item.title)}
                                  className="p-1 text-white hover:text-red-500 transition-colors cursor-pointer"
                                  title={`Delete: ${item.title}`}
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </div>
                          ))}
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
            pageSizeOptions={[6, 12, 24, 48]}
          />
        </Card.Footer>
      </Card>

      {/* Upload Modal */}
      <AppModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} title="Upload Showcase Image" size="md">
        <form onSubmit={handleUploadSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Showcase Title *</label>
            <input type="text" required value={formTitle} onChange={e => setFormTitle(e.target.value)} placeholder="e.g. Modern Office Workstations" className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#ed1c27]/40" />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Category *</label>
            <select required value={formCategory} onChange={e => setFormCategory(e.target.value)} className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#ed1c27]/40">
              <option value="" disabled>Select a Category</option>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Showcase Images (Up to 5) *</label>
            <div
              onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
              onClick={() => document.getElementById("gallery-file-input")?.click()}
              className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 cursor-pointer transition-all duration-300 ${isDragging ? "border-[#ed1c27] bg-[#ed1c27]/[0.05]" : "border-gray-200 bg-gray-50 hover:border-[#ed1c27]/40"}`}
            >
              <Upload size={24} className={`mb-2 transition-colors ${isDragging ? "text-[#ed1c27]" : "text-gray-400"}`} />
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 text-center">Drag &amp; Drop files or Click to Upload</span>
              <span className="text-[9px] text-gray-400 mt-1 text-center">Supports JPG, PNG, WEBP (Max 2MB per file, Max 5 images total)</span>
              <input id="gallery-file-input" type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
            </div>
            {formImages.length > 0 && (
              <div className="grid grid-cols-5 gap-2 mt-4">
                {formImages.map((img, index) => (
                  <div key={index} className="relative aspect-square rounded-lg border border-gray-100 overflow-hidden group">
                    <Image src={img} alt={`Preview ${index}`} fill className="object-cover" />
                    <button type="button" onClick={() => setFormImages(prev => prev.filter((_, i) => i !== index))} className="absolute top-1 right-1 bg-black/60 hover:bg-red-600 text-white rounded-full p-1 transition-colors z-10" title="Remove image">
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
            <button type="button" onClick={() => setIsUploadOpen(false)} className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-bold uppercase tracking-wider text-gray-500 hover:bg-gray-50 cursor-pointer">Cancel</button>
            <button type="submit" disabled={formImages.length === 0 || isSubmitting} className={`px-5 py-2 text-white font-bold uppercase tracking-wider text-xs rounded-xl cursor-pointer shadow-lg transition-all ${formImages.length === 0 || isSubmitting ? "bg-gray-300 cursor-not-allowed shadow-none" : "bg-[#ed1c27] hover:bg-[#c5141e]"}`}>
              {isSubmitting ? "Uploading..." : `Add ${formImages.length > 0 ? `(${formImages.length})` : ""} Image${formImages.length !== 1 ? "s" : ""}`}
            </button>
          </div>
        </form>
      </AppModal>

      {/* Full-Screen Preview Modal */}
      {selectedItem && (
        <AppModal isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} hideHeader hideFooter size="lg" bodyClassName="p-0 bg-neutral-950 flex flex-col items-center relative">
          <button onClick={() => setIsPreviewOpen(false)} className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors">
            <X size={18} />
          </button>
          <div className="w-full h-[60vh] sm:h-[70vh] relative">
            <Image src={selectedItem.image} alt={selectedItem.title} fill className="object-contain" />
          </div>
          <div className="w-full bg-neutral-900 px-6 py-4 flex flex-col gap-1 border-t border-neutral-800">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-primary text-white text-[9px] font-extrabold uppercase tracking-wider">{selectedItem.category}</span>
              <p className="text-white text-sm font-bold">{selectedItem.title}</p>
            </div>
            <p className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider mt-1">ID: {selectedItem.id}</p>
          </div>
        </AppModal>
      )}
    </div>
  );
}
