"use client";

import React, { useState, useEffect } from "react";
import { Edit, Trash2, AlertCircle, Plus, Upload, X, FileText } from "lucide-react";
import Image from "next/image";
import { useForm, FormProvider, Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { Card, AppModal, useAppToast, AdminPageHeader, Pagination, SearchInput, RHFControl } from "@/components/ui";
import { AppRoutes } from "@/constants/routes";
import {
  useGetCataloguesQuery,
  useCreateCatalogueMutation,
  useUpdateCatalogueMutation,
  useDeleteCatalogueMutation,
} from "@/redux/api/cataloguesApi";
import { useGetCategoriesQuery } from "@/redux/api/categoriesApi";
import type { Catalogue } from "@/types/api";


const catalogueValidationSchema = yup.object().shape({
  title: yup.string().required("Title is required").min(3, "Must be at least 3 characters"),
  description: yup.string().required("Description is required").min(10, "Must be at least 10 characters"),
  category: yup.string().required("Category is required"),
  customCategory: yup.string().when("category", {
    is: "Other",
    then: (schema) => schema.required("Custom category name is required").min(2, "Must be at least 2 characters"),
    otherwise: (schema) => schema.notRequired(),
  }),
  status: yup.string().required("Status is required"),
});

type CatalogueFormData = yup.InferType<typeof catalogueValidationSchema>;

export default function AdminCataloguesPage() {
  const { addToast } = useAppToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const {
    data: cataloguesData,
    isLoading: isFetching,
    error: fetchError,
    refetch,
  } = useGetCataloguesQuery({
    page: currentPage,
    limit: itemsPerPage,
    search: debouncedSearch,
  });

  const { data: categoriesResult } = useGetCategoriesQuery({ limit: 100 });

  const categoryOptions = React.useMemo(() => {
    const list = [{ label: "Select", value: "" }];

    // Add main categories
    if (categoriesResult?.data) {
      categoriesResult.data.forEach((c) => {
        if (!list.some(item => item.value === c.name)) {
          list.push({ label: c.name, value: c.name });
        }
      });
    }

    list.push({ label: "Other", value: "Other" });
    return list;
  }, [categoriesResult]);

  const [createCatalogue, { isLoading: isCreating }] = useCreateCatalogueMutation();
  const [updateCatalogue, { isLoading: isUpdating }] = useUpdateCatalogueMutation();
  const [deleteCatalogue] = useDeleteCatalogueMutation();

  const isSubmitting = isCreating || isUpdating;

  const catalogues = cataloguesData?.data || [];
  const pagination = cataloguesData?.pagination || {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: itemsPerPage,
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCatalogue, setEditingCatalogue] = useState<Catalogue | null>(null);

  // File Upload State
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [pdfData, setPdfData] = useState<string | null>(null);
  const [pdfFileName, setPdfFileName] = useState("");
  const [isImageDragging, setIsImageDragging] = useState(false);
  const [isPdfDragging, setIsPdfDragging] = useState(false);

  const methods = useForm<CatalogueFormData>({
    resolver: yupResolver(catalogueValidationSchema) as Resolver<CatalogueFormData>,
    defaultValues: {
      title: "",
      description: "",
      category: "",
      customCategory: "",
      status: "Active",
    },
  });

  const categoryValue = methods.watch("category");

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, itemsPerPage]);

  // Handle modal open/close states
  useEffect(() => {
    if (isModalOpen && editingCatalogue) {
      const availableCategories = categoryOptions
        .map(o => o.value)
        .filter(v => v !== "" && v !== "Other");

      const isCustom = !availableCategories.includes(editingCatalogue.category);
      methods.reset({
        title: editingCatalogue.title,
        description: editingCatalogue.description,
        category: isCustom ? "Other" : editingCatalogue.category,
        customCategory: isCustom ? editingCatalogue.category : "",
        status: editingCatalogue.status,
      });
      setCoverImage(editingCatalogue.image);
      setPdfFileName(editingCatalogue.pdfFileName || "");
      setPdfData(null); // Keep null to not overwrite on update unless a new one is selected
    } else if (!isModalOpen) {
      methods.reset({
        title: "",
        description: "",
        category: "",
        customCategory: "",
        status: "Active",
      });
      setCoverImage(null);
      setPdfFileName("");
      setPdfData(null);
    }
  }, [isModalOpen, editingCatalogue, methods, categoryOptions]);

  const handleEditClick = (c: Catalogue) => {
    setEditingCatalogue(c);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete the catalogue "${title}"?`)) return;
    try {
      await deleteCatalogue(id).unwrap();
      addToast({ title: "Catalogue Deleted", message: `"${title}" has been deleted.`, variant: "info" });
    } catch (err) {
      const errMsg = (err as { data?: { message?: string } })?.data?.message || "Delete failed";
      addToast({ title: "Error", message: errMsg, variant: "error" });
    }
  };

  const handleStatusToggle = async (c: Catalogue) => {
    const nextStatus = c.status === "Active" ? "Inactive" : "Active";
    try {
      await updateCatalogue({
        id: c.id,
        body: { status: nextStatus },
      }).unwrap();
      addToast({ title: "Status Updated", message: `Status is now ${nextStatus}.`, variant: "success" });
    } catch (err) {
      const errMsg = (err as { data?: { message?: string } })?.data?.message || "Update failed";
      addToast({ title: "Error", message: errMsg, variant: "error" });
    }
  };

  // Image Drag & Drop handlers
  const handleImageDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsImageDragging(true); };
  const handleImageDragLeave = () => setIsImageDragging(false);
  const handleImageDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsImageDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleImageFile(file);
  };
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageFile(file);
  };
  const handleImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      addToast({ title: "Invalid File Type", message: "Please select an image file.", variant: "error" });
      return;
    }
    if (file.size > 102400) {
      addToast({ title: "File Too Large", message: "Cover image exceeds the 100KB limit.", variant: "error" });
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setCoverImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // PDF Drag & Drop handlers
  const handlePdfDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsPdfDragging(true); };
  const handlePdfDragLeave = () => setIsPdfDragging(false);
  const handlePdfDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsPdfDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handlePdfFile(file);
  };
  const handlePdfFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handlePdfFile(file);
  };
  const handlePdfFile = (file: File) => {
    if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
      addToast({ title: "Invalid File Type", message: "Please select a PDF file.", variant: "error" });
      return;
    }
    if (file.size > 10 * 1024) {
      addToast({ title: "File Too Large", message: "PDF brochure exceeds the 10KB limit.", variant: "error" });
      return;
    }    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setPdfData(reader.result);
        setPdfFileName(file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFormSubmit = async (data: CatalogueFormData) => {
    if (!coverImage) {
      addToast({ title: "Validation Error", message: "Cover image is required.", variant: "error" });
      return;
    }

    if (!editingCatalogue && (!pdfData || !pdfFileName)) {
      addToast({ title: "Validation Error", message: "PDF catalog file is required for new entries.", variant: "error" });
      return;
    }

    const finalCategory = data.category === "Other" ? data.customCategory : data.category;

    try {
      if (editingCatalogue) {
        await updateCatalogue({
          id: editingCatalogue.id,
          body: {
            title: data.title,
            description: data.description,
            category: finalCategory || "",
            image: coverImage,
            status: data.status,
            ...(pdfData ? { pdfData, pdfFileName } : {}),
          },
        }).unwrap();
        addToast({ title: "Catalogue Updated", message: "Catalogue was updated successfully.", variant: "success" });
      } else {
        await createCatalogue({
          title: data.title,
          description: data.description,
          category: finalCategory || "",
          image: coverImage,
          status: data.status,
          pdfData: pdfData || "",
          pdfFileName: pdfFileName,
        }).unwrap();
        addToast({ title: "Catalogue Created", message: "Catalogue was created successfully.", variant: "success" });
      }
      setIsModalOpen(false);
    } catch (err) {
      const errMsg = (err as { data?: { message?: string } })?.data?.message || "Operation failed";
      addToast({ title: "Error", message: errMsg, variant: "error" });
    }
  };

  const error = fetchError
    ? (fetchError as { data?: { message?: string } })?.data?.message || "Failed to load catalogues"
    : null;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Catalogues"
        breadcrumbs={[
          { label: "Admin", href: AppRoutes.Admin.Dashboard },
          { label: "Catalogues" },
        ]}
      />

      <Card>
        <Card.Header>
          <SearchInput
            placeholder="Search catalogues by title or category..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            wrapperClassName="max-w-sm"
          />
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setEditingCatalogue(null);
                setIsModalOpen(true);
              }}
              className="inline-flex items-center justify-center gap-2 bg-[#ed1c27] hover:bg-[#c5141e] text-white font-bold uppercase tracking-[0.12em] text-[10px] rounded-xl px-5 py-2 transition-all duration-300 cursor-pointer hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#ed1c27]/25"
            >
              <Plus size={14} /> Add Catalogue
            </button>
          </div>
        </Card.Header>

        <Card.Body noPadding>
          {error && (
            <div className="flex items-center gap-3 p-6 text-red-600 bg-red-50 border-b border-red-100">
              <AlertCircle size={18} />
              <p className="text-sm font-semibold">{error}</p>
              <button onClick={() => refetch()} className="ml-auto text-xs underline cursor-pointer">
                Retry
              </button>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-400 w-24">Cover</th>
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">Catalogue Title</th>
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">Category</th>
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">PDF File</th>
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</th>
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isFetching ? (
                  Array.from({ length: itemsPerPage }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="py-4 px-6">
                        <div className="w-12 h-16 bg-gray-100 rounded-lg" />
                      </td>
                      <td className="py-4 px-6">
                        <div className="h-3 bg-gray-100 rounded w-48 mb-1" />
                        <div className="h-2 bg-gray-100 rounded w-64" />
                      </td>
                      <td className="py-4 px-6">
                        <div className="h-3 bg-gray-100 rounded w-32" />
                      </td>
                      <td className="py-4 px-6">
                        <div className="h-5 bg-gray-100 rounded w-14" />
                      </td>
                      <td className="py-4 px-6" />
                    </tr>
                  ))
                ) : catalogues.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center">
                      <FileText className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">No catalogues found</p>
                      <p className="text-[11px] text-gray-400 mt-1">
                        {searchTerm ? "Try adjusting your search query." : "Uploaded catalogues will appear here."}
                      </p>
                    </td>
                  </tr>
                ) : (
                  catalogues.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="py-3 px-6">
                        <div className="w-12 h-16 rounded-lg bg-gray-100 overflow-hidden relative border border-gray-200 shadow-sm">
                          {c.image && (
                            <Image
                              src={c.image}
                              alt={c.title}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-6">
                        <p className="text-xs font-bold text-gray-900">{c.title}</p>
                        <p className="text-[10px] text-gray-400 font-medium mt-0.5 max-w-sm line-clamp-2">
                          {c.description}
                        </p>
                      </td>
                      <td className="py-3 px-6">
                        <span className="px-2.5 py-0.5 bg-neutral-100 text-neutral-600 rounded-md text-[9px] font-bold uppercase tracking-widest">
                          {c.category}
                        </span>
                      </td>
                      <td className="py-3 px-6">
                        {c.pdfFileName ? (
                          <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium max-w-[200px] truncate" title={c.pdfFileName}>
                            <FileText size={14} className="text-[#ed1c27] flex-shrink-0" />
                            <span className="truncate">{c.pdfFileName}</span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-gray-300 font-bold uppercase tracking-wider">No PDF File</span>
                        )}
                      </td>
                      <td className="py-3 px-6">
                        <button
                          onClick={() => handleStatusToggle(c)}
                          className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest cursor-pointer transition-all duration-300 ${
                            c.status === "Active"
                              ? "bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100"
                              : "bg-neutral-50 text-neutral-400 border border-neutral-200 hover:bg-neutral-100"
                          }`}
                          title="Click to toggle status"
                        >
                          {c.status}
                        </button>
                      </td>
                      <td className="py-3 px-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEditClick(c)}
                            className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit Catalogue"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(c.id, c.title)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Catalogue"
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
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={setCurrentPage}
            pageSize={itemsPerPage}
            onPageSizeChange={(size) => {
              setItemsPerPage(size);
              setCurrentPage(1);
            }}
            totalItems={pagination.totalItems}
            pageSizeOptions={[5, 10, 20, 50]}
          />
        </Card.Footer>
      </Card>

      <AppModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCatalogue ? "Edit Catalogue Brochure" : "Add New Catalogue"}
        size="md"
      >
        <FormProvider {...methods}>
          <form id="edit-catalogue-form" onSubmit={methods.handleSubmit(handleFormSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <RHFControl
                control="input"
                name="title"
                label="Catalogue Title *"
                placeholder="e.g. Ergonomic Office Chairs Collection"
                className="rounded-xl"
              />
              <RHFControl
                control="select"
                name="status"
                label="Status *"
                options={[
                  { label: "Active", value: "Active" },
                  { label: "Inactive", value: "Inactive" },
                ]}
                className="rounded-xl"
              />
            </div>

            <RHFControl
              control="textarea"
              name="description"
              label="Description *"
              placeholder="Provide a detailed description of the brochure..."
              className="rounded-xl"
            />

            <RHFControl
              control="select"
              name="category"
              label="Category *"
              options={categoryOptions}
              placeholder="Select"
              className="rounded-xl"
            />

            {/* Custom Category Input if "Other" selected */}
            {categoryValue === "Other" && (
              <div className="animate-in slide-in-from-top-2 duration-200">
                <RHFControl
                  control="input"
                  name="customCategory"
                  label="Custom Category Name *"
                  placeholder="Enter custom category..."
                  className="rounded-xl"
                />
              </div>
            )}

            {/* Cover Image Upload */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Cover Image *</label>
              <div
                onDragOver={handleImageDragOver}
                onDragLeave={handleImageDragLeave}
                onDrop={handleImageDrop}
                onClick={() => document.getElementById("cover-file-input")?.click()}
                className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 cursor-pointer transition-all duration-300 min-h-[120px] ${
                  isImageDragging ? "border-[#ed1c27] bg-[#ed1c27]/[0.05]" : "border-gray-200 bg-gray-50 hover:border-[#ed1c27]/40"
                }`}
              >
                <Upload size={20} className={`mb-1.5 transition-colors ${isImageDragging ? "text-[#ed1c27]" : "text-gray-400"}`} />
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 text-center">Drag &amp; Drop cover image or Click to Upload</span>
                <span className="text-[8px] text-gray-400 mt-0.5 text-center">Supports JPG, PNG, WEBP (Max 100KB)</span>
                <input id="cover-file-input" type="file" accept="image/*" onChange={handleImageFileChange} className="hidden" />
              </div>
              {coverImage && (
                <div className="relative w-20 h-28 rounded-lg border border-gray-100 overflow-hidden shadow-sm mt-2 group">
                  <Image src={coverImage} alt="Cover Preview" fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => setCoverImage(null)}
                    className="absolute top-1 right-1 bg-black/60 hover:bg-red-650 text-white rounded-full p-1 transition-colors z-10"
                    title="Remove Cover Image"
                  >
                    <X size={10} />
                  </button>
                </div>
              )}
            </div>

            {/* PDF File Upload */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">PDF Catalogue File *</label>
              <div
                onDragOver={handlePdfDragOver}
                onDragLeave={handlePdfDragLeave}
                onDrop={handlePdfDrop}
                onClick={() => document.getElementById("pdf-file-input")?.click()}
                className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 cursor-pointer transition-all duration-300 min-h-[120px] ${
                  isPdfDragging ? "border-[#ed1c27] bg-[#ed1c27]/[0.05]" : "border-gray-200 bg-gray-50 hover:border-[#ed1c27]/40"
                }`}
              >
                <FileText size={20} className={`mb-1.5 transition-colors ${isPdfDragging ? "text-[#ed1c27]" : "text-gray-400"}`} />
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 text-center">Drag &amp; Drop PDF brochure or Click to Upload</span>
                <span className="text-[8px] text-gray-400 mt-0.5 text-center">Only PDF files (Max 10KB)</span>
                <input id="pdf-file-input" type="file" accept="application/pdf" onChange={handlePdfFileChange} className="hidden" />
              </div>
              {pdfFileName && (
                <div className="flex items-center justify-between bg-neutral-50 border border-neutral-100 rounded-xl p-3 mt-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText size={16} className="text-[#ed1c27] flex-shrink-0" />
                    <span className="text-xs font-semibold text-gray-600 truncate">{pdfFileName}</span>
                    {editingCatalogue && !pdfData && (
                      <span className="text-[8px] font-black uppercase tracking-widest bg-neutral-200 text-neutral-500 rounded px-1 flex-shrink-0">Existing</span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setPdfFileName("");
                      setPdfData(null);
                    }}
                    className="p-1 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
                    title="Remove PDF"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>

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
                disabled={isSubmitting}
                className="px-5 py-2 bg-[#ed1c27] hover:bg-[#c5141e] text-white font-bold uppercase tracking-wider text-xs rounded-xl cursor-pointer shadow-lg disabled:opacity-60"
              >
                {isSubmitting ? "Saving..." : editingCatalogue ? "Save Changes" : "Create Catalogue"}
              </button>
            </div>
          </form>
        </FormProvider>
      </AppModal>
    </div>
  );
}
