"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Eye, X, Upload } from "lucide-react";
import Image from "next/image";
import { Card, AppModal, useAppToast, AdminPageHeader, Pagination, SearchInput } from "@/components/ui";
import { AppRoutes } from "@/constants/routes";

import initialGalleryData from "@/data/gallery.json";
import initialCategoriesData from "@/data/categories.json";

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  date: string;
  image: string;
}

const initialGallery: GalleryItem[] = initialGalleryData.map((item: any, index: number) => ({
  id: `IMG-${String(index + 1).padStart(3, "0")}`,
  title: item.title,
  category: item.category || "Interiors",
  date: `${String(10 - index).padStart(2, "0")} May 2026`,
  image: item.image,
}));

export default function AdminGalleryPage() {
  const { addToast } = useAppToast();

  // State
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  // Modals state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  // Form state
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState("");
  const [formImages, setFormImages] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  // Load from sessionStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Load Categories
      const storedCats = sessionStorage.getItem("bdm_categories");
      if (storedCats) {
        try {
          const parsed = JSON.parse(storedCats);
          const activeCats = parsed
            .filter((c: any) => c.status === "Active")
            .map((c: any) => c.name);
          setCategories(activeCats);
        } catch {
          const defaultCats = Array.from(new Set(initialCategoriesData.map((c: any) => c.name)));
          setCategories(defaultCats);
        }
      } else {
        const defaultCats = Array.from(new Set(initialCategoriesData.map((c: any) => c.name)));
        setCategories(defaultCats);
      }

      // Load Gallery
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
    setFormCategory("");
    setFormImages([]);
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

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (!e.dataTransfer.files) return;
    const files = Array.from(e.dataTransfer.files);

    if (formImages.length + files.length > 5) {
      addToast({
        title: "Limit Exceeded",
        message: "You can upload a maximum of 5 images.",
        variant: "error",
      });
      return;
    }

    files.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        addToast({
          title: "Invalid File Type",
          message: `"${file.name}" is not an image.`,
          variant: "error",
        });
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        addToast({
          title: "File Too Large",
          message: `"${file.name}" exceeds the 2MB size limit.`,
          variant: "error",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setFormImages((prev) => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // File select handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);

    if (formImages.length + files.length > 5) {
      addToast({
        title: "Limit Exceeded",
        message: "You can upload a maximum of 5 images.",
        variant: "error",
      });
      return;
    }

    files.forEach((file) => {
      if (file.size > 2 * 1024 * 1024) {
        addToast({
          title: "File Too Large",
          message: `"${file.name}" exceeds the 2MB size limit.`,
          variant: "error",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setFormImages((prev) => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveFormImage = (index: number) => {
    setFormImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formTitle.trim()) {
      addToast({
        title: "Validation Error",
        message: "Please enter a valid title.",
        variant: "error",
      });
      return;
    }

    if (!formCategory) {
      addToast({
        title: "Validation Error",
        message: "Please select a category.",
        variant: "error",
      });
      return;
    }

    if (formImages.length === 0) {
      addToast({
        title: "Validation Error",
        message: "Please upload at least one image.",
        variant: "error",
      });
      return;
    }

    const todayStr = new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const newItems: GalleryItem[] = formImages.map((base64Image, index) => {
      const timestamp = Date.now() + index;
      const newId = `IMG-${timestamp.toString().slice(-6)}`;
      const titleSuffix = formImages.length > 1 ? ` - ${index + 1}` : "";
      
      return {
        id: newId,
        title: `${formTitle.trim()}${titleSuffix}`,
        category: formCategory,
        date: todayStr,
        image: base64Image,
      };
    });

    const updated = [...newItems, ...gallery];
    saveGallery(updated);
    
    addToast({
      title: "Images Uploaded",
      message: `Successfully added ${newItems.length} image(s) to the showroom gallery.`,
      variant: "success",
    });

    setIsUploadOpen(false);
  };

  // Filter gallery
  const filteredGallery = gallery.filter((item) => {
    return (
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredGallery.length / itemsPerPage);
  const paginatedGallery = filteredGallery.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      {/* Admin Page Header with Breadcrumb */}
      <AdminPageHeader
        title="Gallery"
        breadcrumbs={[
          { label: "Admin", href: AppRoutes.Admin.Dashboard },
          { label: "Gallery" },
        ]}
      />

      {/* Data Table with Integrated Toolbar */}
      <Card>
        <Card.Header>
          {/* Left: Search input */}
          <SearchInput
            placeholder="Search gallery by title, category or ID..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            wrapperClassName="max-w-sm"
          />

          {/* Right: Actions */}
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
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-400 w-24">Image</th>
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">Showcase Title</th>
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">Category</th>
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">Upload Date</th>
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginatedGallery.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-xs font-semibold text-gray-400">
                      No gallery items found matching your search.
                    </td>
                  </tr>
                ) : (
                  paginatedGallery.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="py-3 px-6">
                        <div 
                          onClick={() => handlePreviewClick(item)}
                          className="w-16 h-10 rounded-lg bg-gray-100 overflow-hidden relative border border-gray-200 cursor-pointer hover:border-[#ed1c27]/40 transition-colors"
                        >
                          <Image src={item.image} alt={item.title} fill className="object-cover" />
                        </div>
                      </td>
                      <td className="py-3 px-6">
                        <p className="text-xs font-semibold text-gray-900">{item.title}</p>
                        <p className="text-[10px] text-gray-400 font-medium mt-0.5">{item.id}</p>
                      </td>
                      <td className="py-3 px-6">
                        <span className="inline-flex items-center bg-gray-100 text-gray-600 rounded-lg px-2.5 py-1 text-[10px] font-semibold">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-3 px-6">
                        <p className="text-xs text-gray-500 font-medium">{item.date}</p>
                      </td>
                      <td className="py-3 px-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handlePreviewClick(item)}
                            className="p-1.5 text-gray-400 hover:text-[#ed1c27] hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Preview Image"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(item.id, item.title)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Image"
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
            totalItems={filteredGallery.length}
            pageSizeOptions={[6, 12, 24, 48]}
          />
        </Card.Footer>
      </Card>

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
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Category *</label>
            <select
              required
              value={formCategory}
              onChange={(e) => setFormCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#ed1c27]/40"
            >
              <option value="" disabled>Select a Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Showcase Images (Up to 5) *</label>
            
            {/* Drag & Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById("gallery-file-input")?.click()}
              className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 cursor-pointer transition-all duration-300 ${
                isDragging
                  ? "border-[#ed1c27] bg-[#ed1c27]/[0.05]"
                  : "border-gray-200 bg-gray-50 hover:border-[#ed1c27]/40 hover:bg-[#ed1c27]/[0.01]"
              }`}
            >
              <Upload size={24} className={`mb-2 transition-colors ${isDragging ? "text-[#ed1c27]" : "text-gray-400"}`} />
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 text-center">
                Drag & Drop files or Click to Upload
              </span>
              <span className="text-[9px] text-gray-400 mt-1 text-center">
                Supports JPG, PNG, WEBP (Max 2MB per file, Max 5 images total)
              </span>
              <input
                id="gallery-file-input"
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Preview Grid */}
            {formImages.length > 0 && (
              <div className="grid grid-cols-5 gap-2 mt-4">
                {formImages.map((img, index) => (
                  <div key={index} className="relative aspect-square rounded-lg border border-gray-100 overflow-hidden group">
                    <Image src={img} alt={`Preview ${index}`} fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveFormImage(index)}
                      className="absolute top-1 right-1 bg-black/60 hover:bg-red-600 text-white rounded-full p-1 transition-colors z-10"
                      title="Remove image"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}
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
              disabled={formImages.length === 0}
              className={`px-5 py-2 text-white font-bold uppercase tracking-wider text-xs rounded-xl cursor-pointer shadow-lg transition-all ${
                formImages.length === 0
                  ? "bg-gray-300 cursor-not-allowed shadow-none"
                  : "bg-[#ed1c27] hover:bg-[#c5141e]"
              }`}
            >
              Add {formImages.length > 0 ? `(${formImages.length})` : ""} Image{formImages.length > 1 ? "s" : ""}
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
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-primary text-white text-[9px] font-extrabold uppercase tracking-wider">
                {selectedItem.category}
              </span>
              <p className="text-white text-sm font-bold">{selectedItem.title}</p>
            </div>
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
