"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Plus, Edit, Trash2, Folder, Upload, AlertCircle } from "lucide-react";
import Image from "next/image";
import { Card, AppModal, useAppToast, AdminPageHeader, Pagination, RHFControl, SearchInput } from "@/components/ui";
import { AppRoutes } from "@/constants/routes";
import { useForm, FormProvider, Controller, Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "@/redux/api/categoriesApi";
import type { Category } from "@/types/api";

// Validation Schema
const categorySchema = yup.object().shape({
  id: yup.string(),
  name: yup.string().required("Category Name is required").min(3, "Category Name must be at least 3 characters"),
  description: yup.string().required("Description is required"),
  image: yup.string().required("Image is required"),
  status: yup.string().required("Status is required"),
});

type CategoryFormData = yup.InferType<typeof categorySchema>;

export default function AdminCategoriesPage() {
  const { addToast } = useAppToast();

  // Filter / pagination state
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  // Debounced search term for API call
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // RTK Query hooks
  const {
    data: categoriesData,
    isLoading: isFetching,
    error: fetchError,
    refetch,
  } = useGetCategoriesQuery({
    page: currentPage,
    limit: itemsPerPage,
    search: debouncedSearch,
  });

  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const categories = categoriesData?.data || [];
  const pagination = categoriesData?.pagination || {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: itemsPerPage,
  };
  const isLoading = isFetching;
  const error = fetchError
    ? (fetchError as any)?.data?.message || "Failed to load categories"
    : null;
  const isSubmitting = isCreating || isUpdating;

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, itemsPerPage]);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // React Hook Form
  const methods = useForm<CategoryFormData>({
    resolver: yupResolver(categorySchema) as Resolver<CategoryFormData>,
    defaultValues: { id: "", name: "", description: "", image: "", status: "Active" },
  });
  const { reset } = methods;

  useEffect(() => {
    if (isModalOpen) {
      if (editingCategory) {
        reset({ id: editingCategory.id, name: editingCategory.name, description: editingCategory.description, image: editingCategory.image, status: editingCategory.status });
      } else {
        reset({ id: "", name: "", description: "", image: "", status: "Active" });
      }
    }
  }, [isModalOpen, editingCategory, reset]);

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDeleteClick = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete category "${name}"?`)) return;
    try {
      await deleteCategory(id).unwrap();
      addToast({ title: "Category Deleted", message: `Category "${name}" has been deleted.`, variant: "info" });
    } catch (err: unknown) {
      addToast({ title: "Error", message: err instanceof Error ? err.message : "Delete failed", variant: "error" });
    }
  };

  // ── Form submit ────────────────────────────────────────────────────────────
  const onSubmit = async (data: CategoryFormData) => {
    try {
      const payload = { name: data.name, description: data.description, image: data.image, status: data.status };
      if (editingCategory) {
        await updateCategory({ id: editingCategory.id, body: payload }).unwrap();
        addToast({ title: "Category Updated", message: `"${data.name}" category was updated successfully.`, variant: "success" });
      } else {
        await createCategory(payload).unwrap();
        addToast({ title: "Category Created", message: `"${data.name}" category was added successfully.`, variant: "success" });
      }
      setIsModalOpen(false);
    } catch (err: unknown) {
      addToast({ title: "Error", message: err instanceof Error ? err.message : "Operation failed", variant: "error" });
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Categories"
        breadcrumbs={[
          { label: "Admin", href: AppRoutes.Admin.Dashboard },
          { label: "Categories" },
        ]}
      />

      <Card>
        <Card.Header>
          <SearchInput
            placeholder="Search categories by name or ID..."
            value={searchTerm}
            onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            wrapperClassName="max-w-sm"
          />
          <div className="flex items-center gap-3">
            <button
              id="add-category-btn"
              onClick={() => { setEditingCategory(null); setIsModalOpen(true); }}
              className="inline-flex items-center justify-center gap-2 bg-[#ed1c27] hover:bg-[#c5141e] text-white font-bold uppercase tracking-[0.12em] text-[10px] rounded-xl px-5 py-2 transition-all duration-300 cursor-pointer hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#ed1c27]/25"
            >
              <Plus size={14} /> Add Category
            </button>
          </div>
        </Card.Header>

        <Card.Body className="bg-gray-50/30 p-6">
          {error && (
            <div className="flex items-center gap-3 p-4 mb-4 text-red-600 bg-red-50 rounded-xl border border-red-100">
              <AlertCircle size={18} />
              <p className="text-sm font-semibold">{error}</p>
              <button onClick={() => refetch()} className="ml-auto text-xs underline cursor-pointer">Retry</button>
            </div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: itemsPerPage }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                  <div className="h-40 bg-gray-100" />
                  <div className="p-5 space-y-2">
                    <div className="h-3 bg-gray-100 rounded w-3/4" />
                    <div className="h-2 bg-gray-100 rounded w-1/2" />
                    <div className="h-2 bg-gray-100 rounded w-full mt-2" />
                  </div>
                </div>
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">No categories found</p>
              <p className="text-[11px] text-gray-400 mt-1">{searchTerm ? "Try adjusting your search." : "Add your first category to get started."}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categories.map(cat => (
                <div key={cat.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group hover:border-[#ed1c27]/30 transition-colors flex flex-col justify-between">
                  <div>
                    <div className="h-40 relative bg-gray-100 overflow-hidden">
                      <Image src={cat.image} alt={cat.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-3 right-3">
                        <span className={`px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-widest ${cat.status === "Active" ? "bg-emerald-500 text-white" : "bg-gray-500 text-white"}`}>
                          {cat.status}
                        </span>
                      </div>
                    </div>
                    <div className="p-5 pb-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <h3 className="text-sm font-bold text-gray-900 leading-tight">{cat.name}</h3>
                          <p className="text-[10px] text-gray-400 font-medium mt-1">{cat.id}</p>
                        </div>
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 rounded-lg text-gray-600 shrink-0">
                          <Folder size={12} />
                          <span className="text-[10px] font-bold">{cat.count}</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 font-medium leading-relaxed line-clamp-2">{cat.description}</p>
                    </div>
                  </div>
                  <div className="p-5 pt-4">
                    <div className="flex items-center gap-2 pt-4 border-t border-gray-50">
                      <button onClick={() => { setEditingCategory(cat); setIsModalOpen(true); }} className="flex-1 inline-flex items-center justify-center gap-2 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors cursor-pointer">
                        <Edit size={12} /> Edit
                      </button>
                      <button onClick={() => handleDeleteClick(cat.id, cat.name)} className="flex-1 inline-flex items-center justify-center gap-2 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors cursor-pointer">
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card.Body>

        <Card.Footer>
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={setCurrentPage}
            pageSize={itemsPerPage}
            onPageSizeChange={size => { setItemsPerPage(size); setCurrentPage(1); }}
            totalItems={pagination.totalItems}
            pageSizeOptions={[4, 8, 12, 24, 48]}
          />
        </Card.Footer>
      </Card>

      {/* Add/Edit Modal */}
      <AppModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? "Edit Category" : "Add New Category"}
        size="md"
        footer={
          <>
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-bold uppercase tracking-wider text-gray-500 hover:bg-gray-50 cursor-pointer">
              Cancel
            </button>
            <button type="submit" form="category-form" disabled={isSubmitting} className="px-5 py-2 bg-[#ed1c27] hover:bg-[#c5141e] text-white font-bold uppercase tracking-wider text-xs rounded-xl cursor-pointer shadow-lg shadow-[#ed1c27]/10 disabled:opacity-60">
              {isSubmitting ? "Saving..." : editingCategory ? "Save Changes" : "Create Category"}
            </button>
          </>
        }
      >
        <FormProvider {...methods}>
          <form id="category-form" onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
            <RHFControl control="select" name="status" label="Status *" options={[{ label: "Active", value: "Active" }, { label: "Inactive", value: "Inactive" }]} className="rounded-xl" />
            <RHFControl control="input" name="name" label="Category Name *" placeholder="e.g. Wall Cladding" className="rounded-xl" />
            <RHFControl control="textarea" name="description" label="Description *" placeholder="Provide a brief summary of what products this category includes..." className="rounded-xl" />

            {/* Image Upload */}
            <div className="space-y-2">
              <label className="text-[10px] font-semibold uppercase tracking-widest text-secondary/60">Category Image *</label>
              <Controller
                name="image"
                control={methods.control}
                render={({ field, fieldState: { error: fieldError } }) => (
                  <div className="space-y-2">
                    <div className="border-2 border-dashed border-gray-200 hover:border-[#ed1c27]/50 rounded-xl p-4 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center gap-2 bg-gray-50/50 relative group min-h-[140px]">
                      {field.value ? (
                        <div className="relative w-full h-32 rounded-lg overflow-hidden border border-gray-100">
                          <Image src={field.value} alt="Category preview" fill className="object-cover" />
                          <button type="button" onClick={e => { e.stopPropagation(); field.onChange(""); }} className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-md transition-colors cursor-pointer z-10">
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-gray-400 group-hover:text-[#ed1c27] transition-colors duration-300" />
                          <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Upload Image</span>
                          <span className="text-[9px] text-gray-400 font-semibold uppercase tracking-widest">Click or drag image file</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => field.onChange(reader.result as string);
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                    {fieldError?.message && <p className="text-[10px] font-semibold text-red-500 uppercase tracking-tight">{fieldError.message}</p>}
                  </div>
                )}
              />
            </div>
          </form>
        </FormProvider>
      </AppModal>
    </div>
  );
}
