"use client";

import React, { useState, useEffect } from "react";
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
  useGetSubCategoriesQuery,
  useCreateSubCategoryMutation,
  useUpdateSubCategoryMutation,
  useDeleteSubCategoryMutation,
} from "@/redux/api/categoriesApi";
import type { Category, SubCategory } from "@/types/api";

// Validation Schemas
const categorySchema = yup.object().shape({
  id: yup.string(),
  name: yup.string().required("Category Name is required").min(3, "Category Name must be at least 3 characters"),
  description: yup.string().required("Description is required"),
  image: yup.string().required("Image is required"),
  status: yup.string().required("Status is required"),
});

const subCategorySchema = yup.object().shape({
  id: yup.string(),
  name: yup.string().required("Sub Category Name is required").min(3, "Sub Category Name must be at least 3 characters"),
  description: yup.string().required("Short Description is required"),
  image: yup.string().required("Image is required"),
  categoryId: yup.string().required("Parent Category is required"),
  status: yup.string().required("Status is required"),
});

type CategoryFormData = yup.InferType<typeof categorySchema>;
type SubCategoryFormData = yup.InferType<typeof subCategorySchema>;

export default function AdminCategoriesPage() {
  const { addToast } = useAppToast();
  const [activeTab, setActiveTab] = useState<"categories" | "subcategories">("categories");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingSubCategory, setEditingSubCategory] = useState<SubCategory | null>(null);

  // ─── Categories Queries & Mutations ──────────────────────────────────────────
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const {
    data: categoriesData,
    isLoading: isCatsFetching,
    error: catsFetchError,
    refetch: catsRefetch,
  } = useGetCategoriesQuery({
    page: currentPage,
    limit: itemsPerPage,
    search: debouncedSearch,
  });

  // Fetch all active categories to populate dropdowns (e.g. parent selection)
  const { data: allCategoriesData } = useGetCategoriesQuery({ limit: 100 });
  const allCategories = allCategoriesData?.data || [];

  const [createCategory, { isLoading: isCreatingCat }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdatingCat }] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const categories = categoriesData?.data || [];
  const catPagination = categoriesData?.pagination || {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: itemsPerPage,
  };

  // ─── Sub Categories Queries & Mutations ──────────────────────────────────────
  const [subSearchTerm, setSubSearchTerm] = useState("");
  const [currentSubPage, setCurrentSubPage] = useState(1);
  const [subItemsPerPage, setSubItemsPerPage] = useState(8);

  const [debouncedSubSearch, setDebouncedSubSearch] = useState(subSearchTerm);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSubSearch(subSearchTerm), 300);
    return () => clearTimeout(timer);
  }, [subSearchTerm]);

  const {
    data: subCategoriesData,
    isLoading: isSubsFetching,
    error: subsFetchError,
    refetch: subsRefetch,
  } = useGetSubCategoriesQuery({
    page: currentSubPage,
    limit: subItemsPerPage,
    search: debouncedSubSearch,
  });

  const [createSubCategory, { isLoading: isCreatingSub }] = useCreateSubCategoryMutation();
  const [updateSubCategory, { isLoading: isUpdatingSub }] = useUpdateSubCategoryMutation();
  const [deleteSubCategory] = useDeleteSubCategoryMutation();

  const subCategories = subCategoriesData?.data || [];
  const subPagination = subCategoriesData?.pagination || {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: subItemsPerPage,
  };

  // Reset page indices when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, itemsPerPage]);

  useEffect(() => {
    setCurrentSubPage(1);
  }, [debouncedSubSearch, subItemsPerPage]);

  // Form setups
  const categoryMethods = useForm<CategoryFormData>({
    resolver: yupResolver(categorySchema) as Resolver<CategoryFormData>,
    defaultValues: { id: "", name: "", description: "", image: "", status: "Active" },
  });

  const subCategoryMethods = useForm<SubCategoryFormData>({
    resolver: yupResolver(subCategorySchema) as Resolver<SubCategoryFormData>,
    defaultValues: { id: "", name: "", description: "", image: "", categoryId: "", status: "Active" },
  });

  useEffect(() => {
    if (isModalOpen) {
      if (activeTab === "categories") {
        if (editingCategory) {
          categoryMethods.reset({
            id: editingCategory.id,
            name: editingCategory.name,
            description: editingCategory.description,
            image: editingCategory.image,
            status: editingCategory.status,
          });
        } else {
          categoryMethods.reset({ id: "", name: "", description: "", image: "", status: "Active" });
        }
      } else {
        if (editingSubCategory) {
          subCategoryMethods.reset({
            id: editingSubCategory.id,
            name: editingSubCategory.name,
            description: editingSubCategory.description,
            image: editingSubCategory.image,
            categoryId: editingSubCategory.categoryId,
            status: editingSubCategory.status,
          });
        } else {
          subCategoryMethods.reset({ id: "", name: "", description: "", image: "", categoryId: "", status: "Active" });
        }
      }
    }
  }, [isModalOpen, activeTab, editingCategory, editingSubCategory, categoryMethods, subCategoryMethods]);

  // ─── Delete Actions ────────────────────────────────────────────────────────
  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete category "${name}"?`)) return;
    try {
      await deleteCategory(id).unwrap();
      addToast({ title: "Category Deleted", message: `Category "${name}" has been deleted.`, variant: "info" });
    } catch (err: unknown) {
      addToast({ title: "Error", message: err instanceof Error ? err.message : "Delete failed", variant: "error" });
    }
  };

  const handleDeleteSubCategory = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete sub category "${name}"?`)) return;
    try {
      await deleteSubCategory(id).unwrap();
      addToast({ title: "Sub Category Deleted", message: `Sub Category "${name}" has been deleted.`, variant: "info" });
    } catch (err: unknown) {
      addToast({ title: "Error", message: err instanceof Error ? err.message : "Delete failed", variant: "error" });
    }
  };

  // ─── Form Submission ───────────────────────────────────────────────────────
  const onSubmitCategory = async (data: CategoryFormData) => {
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

  const onSubmitSubCategory = async (data: SubCategoryFormData) => {
    try {
      const payload = {
        name: data.name,
        description: data.description,
        image: data.image,
        categoryId: data.categoryId,
        status: data.status,
      };
      if (editingSubCategory) {
        await updateSubCategory({ id: editingSubCategory.id, body: payload }).unwrap();
        addToast({ title: "Sub Category Updated", message: `"${data.name}" sub category was updated successfully.`, variant: "success" });
      } else {
        await createSubCategory(payload).unwrap();
        addToast({ title: "Sub Category Created", message: `"${data.name}" sub category was added successfully.`, variant: "success" });
      }
      setIsModalOpen(false);
    } catch (err: unknown) {
      addToast({ title: "Error", message: err instanceof Error ? err.message : "Operation failed", variant: "error" });
    }
  };

  const parentOptions = allCategories
    .filter((c) => c.status === "Active")
    .map((c) => ({ label: c.name, value: c.id || c.slug || "" }));

  const currentSearch = activeTab === "categories" ? searchTerm : subSearchTerm;
  const currentSetSearch = activeTab === "categories" ? setSearchTerm : setSubSearchTerm;
  const currentSetPage = activeTab === "categories" ? setCurrentPage : setCurrentSubPage;
  const currentIsLoading = activeTab === "categories" ? isCatsFetching : isSubsFetching;
  const currentError = activeTab === "categories"
    ? (catsFetchError ? (catsFetchError as any)?.data?.message || "Failed to load categories" : null)
    : (subsFetchError ? (subsFetchError as any)?.data?.message || "Failed to load subcategories" : null);

  const isSubmitting = isCreatingCat || isUpdatingCat || isCreatingSub || isUpdatingSub;

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
        {/* Horizontal tabs */}
        <div className="flex border-b border-gray-100 overflow-x-auto scrollbar-none gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("categories")}
            className={`flex-shrink-0 py-3.5 px-6 text-[10px] font-bold uppercase tracking-wider border-b-2 whitespace-nowrap transition-all duration-300 ${
              activeTab === "categories"
                ? "border-[#ed1c27] text-[#ed1c27]"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            Categories
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("subcategories")}
            className={`flex-shrink-0 py-3.5 px-6 text-[10px] font-bold uppercase tracking-wider border-b-2 whitespace-nowrap transition-all duration-300 ${
              activeTab === "subcategories"
                ? "border-[#ed1c27] text-[#ed1c27]"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            Sub Categories
          </button>
        </div>

        <Card.Header>
          <SearchInput
            placeholder={activeTab === "categories" ? "Search categories by name or ID..." : "Search sub categories..."}
            value={currentSearch}
            onChange={(e) => {
              currentSetSearch(e.target.value);
              currentSetPage(1);
            }}
            wrapperClassName="max-w-sm"
          />
          <div className="flex items-center gap-3">
            <button
              id="add-category-btn"
              onClick={() => {
                if (activeTab === "categories") {
                  setEditingCategory(null);
                } else {
                  setEditingSubCategory(null);
                }
                setIsModalOpen(true);
              }}
              className="inline-flex items-center justify-center gap-2 bg-[#ed1c27] hover:bg-[#c5141e] text-white font-bold uppercase tracking-[0.12em] text-[10px] rounded-xl px-5 py-2 transition-all duration-300 cursor-pointer hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#ed1c27]/25"
            >
              <Plus size={14} /> Add {activeTab === "categories" ? "Category" : "Sub Category"}
            </button>
          </div>
        </Card.Header>

        <Card.Body className="bg-gray-50/30 p-6">
          {currentError && (
            <div className="flex items-center gap-3 p-4 mb-4 text-red-600 bg-red-50 rounded-xl border border-red-100">
              <AlertCircle size={18} />
              <p className="text-sm font-semibold">{currentError}</p>
              <button
                onClick={() => (activeTab === "categories" ? catsRefetch() : subsRefetch())}
                className="ml-auto text-xs underline cursor-pointer"
              >
                Retry
              </button>
            </div>
          )}

          {currentIsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
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
          ) : activeTab === "categories" ? (
            /* CATEGORIES GRID */
            categories.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">No categories found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group hover:border-[#ed1c27]/30 transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <div className="h-40 relative bg-gray-100 overflow-hidden">
                        <Image
                          src={cat.image || "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=400&auto=format&fit=crop"}
                          alt={cat.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 right-3">
                          <span
                            className={`px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-widest ${
                              cat.status === "Active" ? "bg-emerald-500 text-white" : "bg-gray-500 text-white"
                            }`}
                          >
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
                        <p className="text-xs text-gray-500 font-medium leading-relaxed line-clamp-2">
                          {cat.description}
                        </p>
                      </div>
                    </div>
                    <div className="p-5 pt-4">
                      <div className="flex items-center gap-2 pt-4 border-t border-gray-50">
                        <button
                          onClick={() => {
                            setEditingCategory(cat);
                            setIsModalOpen(true);
                          }}
                          className="flex-1 inline-flex items-center justify-center gap-2 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors cursor-pointer"
                        >
                          <Edit size={12} /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat.id, cat.name)}
                          className="flex-1 inline-flex items-center justify-center gap-2 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors cursor-pointer"
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            /* SUB CATEGORIES GRID */
            subCategories.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                  No sub categories found
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {subCategories.map((sub) => {
                  const parentName = allCategories.find((c) => c.id === sub.categoryId)?.name || "Unknown Category";
                  return (
                    <div
                      key={sub.id}
                      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group hover:border-[#ed1c27]/30 transition-colors flex flex-col justify-between"
                    >
                      <div>
                        <div className="h-40 relative bg-gray-100 overflow-hidden">
                          <Image
                            src={sub.image || "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=400&auto=format&fit=crop"}
                            alt={sub.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-3 right-3">
                            <span
                              className={`px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-widest ${
                                sub.status === "Active" ? "bg-emerald-500 text-white" : "bg-gray-500 text-white"
                              }`}
                            >
                                {sub.status}
                            </span>
                          </div>
                        </div>
                        <div className="p-5 pb-0">
                          <div>
                            <h3 className="text-sm font-bold text-gray-900 leading-tight">{sub.name}</h3>
                            <p className="text-[10px] text-gray-400 font-medium mt-1">{sub.id}</p>
                            <span className="inline-block mt-2 px-2.5 py-0.5 bg-neutral-100 text-neutral-600 rounded-md text-[9px] font-bold uppercase tracking-widest">
                              Category: {parentName}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 font-medium leading-relaxed line-clamp-2 mt-3">
                            {sub.description}
                          </p>
                        </div>
                      </div>
                      <div className="p-5 pt-4">
                        <div className="flex items-center gap-2 pt-4 border-t border-gray-50">
                          <button
                            onClick={() => {
                              setEditingSubCategory(sub);
                              setIsModalOpen(true);
                            }}
                            className="flex-1 inline-flex items-center justify-center gap-2 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors cursor-pointer"
                          >
                            <Edit size={12} /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteSubCategory(sub.id, sub.name)}
                            className="flex-1 inline-flex items-center justify-center gap-2 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors cursor-pointer"
                          >
                            <Trash2 size={12} /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          )}
        </Card.Body>

        <Card.Footer>
          {activeTab === "categories" ? (
            <Pagination
              currentPage={catPagination.currentPage}
              totalPages={catPagination.totalPages}
              onPageChange={setCurrentPage}
              pageSize={itemsPerPage}
              onPageSizeChange={(size) => {
                setItemsPerPage(size);
                setCurrentPage(1);
              }}
              totalItems={catPagination.totalItems}
              pageSizeOptions={[4, 8, 12, 24, 48]}
            />
          ) : (
            <Pagination
              currentPage={subPagination.currentPage}
              totalPages={subPagination.totalPages}
              onPageChange={setCurrentSubPage}
              pageSize={subItemsPerPage}
              onPageSizeChange={(size) => {
                setSubItemsPerPage(size);
                setCurrentSubPage(1);
              }}
              totalItems={subPagination.totalItems}
              pageSizeOptions={[4, 8, 12, 24, 48]}
            />
          )}
        </Card.Footer>
      </Card>

      {/* Add/Edit Modal */}
      <AppModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          activeTab === "categories"
            ? editingCategory
              ? "Edit Category"
              : "Add New Category"
            : editingSubCategory
            ? "Edit Sub Category"
            : "Add New Sub Category"
        }
        size="md"
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-bold uppercase tracking-wider text-gray-500 hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              form={activeTab === "categories" ? "category-form" : "subcategory-form"}
              disabled={isSubmitting}
              className="px-5 py-2 bg-[#ed1c27] hover:bg-[#c5141e] text-white font-bold uppercase tracking-wider text-xs rounded-xl cursor-pointer shadow-lg shadow-[#ed1c27]/10 disabled:opacity-60"
            >
              {isSubmitting
                ? "Saving..."
                : activeTab === "categories"
                ? editingCategory
                  ? "Save Changes"
                  : "Create Category"
                : editingSubCategory
                ? "Save Changes"
                : "Create Sub Category"}
            </button>
          </>
        }
      >
        {activeTab === "categories" ? (
          /* CATEGORY FORM */
          <FormProvider {...categoryMethods}>
            <form id="category-form" onSubmit={categoryMethods.handleSubmit(onSubmitCategory)} className="space-y-4">
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
              <RHFControl
                control="input"
                name="name"
                label="Category Name *"
                placeholder="e.g. Office Furniture"
                className="rounded-xl"
              />
              <RHFControl
                control="textarea"
                name="description"
                label="Description *"
                placeholder="Provide a brief summary of what products this category includes..."
                className="rounded-xl"
              />

              {/* Image Upload */}
              <div className="space-y-2">
                <label className="text-[10px] font-semibold uppercase tracking-widest text-secondary/60">
                  Category Image *
                </label>
                <Controller
                  name="image"
                  control={categoryMethods.control}
                  render={({ field, fieldState: { error: fieldError } }) => (
                    <div className="space-y-2">
                      <div className="border-2 border-dashed border-gray-200 hover:border-[#ed1c27]/50 rounded-xl p-4 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center gap-2 bg-gray-50/50 relative group min-h-[140px]">
                        {field.value ? (
                          <div className="relative w-full h-32 rounded-lg overflow-hidden border border-gray-100">
                            <Image src={field.value} alt="Category preview" fill className="object-cover" />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                field.onChange("");
                              }}
                              className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-md transition-colors cursor-pointer z-10"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        ) : (
                          <>
                            <Upload className="w-8 h-8 text-gray-400 group-hover:text-[#ed1c27] transition-colors duration-300" />
                            <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                              Upload Image
                            </span>
                            <span className="text-[9px] text-gray-400 font-semibold uppercase tracking-widest">
                              Click or drag image file
                            </span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
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
                      {fieldError?.message && (
                        <p className="text-[10px] font-semibold text-red-500 uppercase tracking-tight">
                          {fieldError.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>
            </form>
          </FormProvider>
        ) : (
          /* SUB CATEGORY FORM */
          <FormProvider {...subCategoryMethods}>
            <form
              id="subcategory-form"
              onSubmit={subCategoryMethods.handleSubmit(onSubmitSubCategory)}
              className="space-y-4"
            >
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
              <RHFControl
                control="select"
                name="categoryId"
                label="Parent Category *"
                options={parentOptions}
                className="rounded-xl"
              />
              <RHFControl
                control="input"
                name="name"
                label="Sub Category Name *"
                placeholder="e.g. Executive Chairs"
                className="rounded-xl"
              />
              <RHFControl
                control="textarea"
                name="description"
                label="Short Description *"
                placeholder="Provide a brief summary of what products this subcategory includes..."
                className="rounded-xl"
              />

              {/* Image Upload */}
              <div className="space-y-2">
                <label className="text-[10px] font-semibold uppercase tracking-widest text-secondary/60">
                  Sub Category Image *
                </label>
                <Controller
                  name="image"
                  control={subCategoryMethods.control}
                  render={({ field, fieldState: { error: fieldError } }) => (
                    <div className="space-y-2">
                      <div className="border-2 border-dashed border-gray-200 hover:border-[#ed1c27]/50 rounded-xl p-4 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center gap-2 bg-gray-50/50 relative group min-h-[140px]">
                        {field.value ? (
                          <div className="relative w-full h-32 rounded-lg overflow-hidden border border-gray-100">
                            <Image src={field.value} alt="Sub category preview" fill className="object-cover" />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                field.onChange("");
                              }}
                              className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-md transition-colors cursor-pointer z-10"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        ) : (
                          <>
                            <Upload className="w-8 h-8 text-gray-400 group-hover:text-[#ed1c27] transition-colors duration-300" />
                            <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                              Upload Image
                            </span>
                            <span className="text-[9px] text-gray-400 font-semibold uppercase tracking-widest">
                              Click or drag image file
                            </span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
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
                      {fieldError?.message && (
                        <p className="text-[10px] font-semibold text-red-500 uppercase tracking-tight">
                          {fieldError.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>
            </form>
          </FormProvider>
        )}
      </AppModal>
    </div>
  );
}
