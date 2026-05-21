"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Folder, Upload } from "lucide-react";
import Image from "next/image";
import { Card, AppModal, useAppToast, AdminPageHeader, Pagination, RHFControl, SearchInput } from "@/components/ui";
import { AppRoutes } from "@/constants/routes";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

interface Category {
  id: string;
  name: string;
  description: string;
  count: number;
  image: string;
  status: string;
}

interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  price: string;
  status: string;
  stock: number;
  image: string;
}

const initialCategories: Category[] = [
  { id: "CAT-001", name: "Floor Tiles", description: "Premium vitrified and ceramic tiles for flooring.", count: 45, image: "https://bawadittamal.com/wp-content/uploads/2023/12/1.jpg", status: "Active" },
  { id: "CAT-002", name: "Wall Tiles", description: "Designer wall tiles for kitchens and bathrooms.", count: 32, image: "https://bawadittamal.com/wp-content/uploads/2023/12/3.jpg", status: "Active" },
  { id: "CAT-003", name: "Wooden Flooring", description: "High-quality laminate and engineered wood.", count: 18, image: "https://bawadittamal.com/wp-content/uploads/2023/12/2.jpg", status: "Active" },
  { id: "CAT-004", name: "Bathroom Fittings", description: "Faucets, showers, and luxury bath accessories.", count: 24, image: "https://bawadittamal.com/wp-content/uploads/2023/12/4.jpg", status: "Inactive" },
  { id: "CAT-005", name: "Granite & Marble", description: "Natural stone slabs for countertop and floors.", count: 12, image: "https://bawadittamal.com/wp-content/uploads/2023/12/5.jpg", status: "Active" },
];

// Validation Schema
const categorySchema = yup.object().shape({
  id: yup
    .string(),
  name: yup
    .string()
    .required("Category Name is required")
    .min(3, "Category Name must be at least 3 characters"),
  description: yup
    .string()
    .required("Description is required"),
  image: yup
    .string()
    .required("Image is required"),
  status: yup
    .string()
    .required("Status is required"),
});

type CategoryFormData = yup.InferType<typeof categorySchema>;

export default function AdminCategoriesPage() {
  const { addToast } = useAppToast();
  
  // State
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // React Hook Form Configuration
  const methods = useForm<CategoryFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(categorySchema) as any,
    defaultValues: {
      id: "",
      name: "",
      description: "",
      image: "",
      status: "Active",
    },
  });

  const { reset } = methods;

  // Reset form when modal opens or editingCategory changes
  useEffect(() => {
    if (isModalOpen) {
      if (editingCategory) {
        reset({
          id: editingCategory.id,
          name: editingCategory.name,
          description: editingCategory.description,
          image: editingCategory.image,
          status: editingCategory.status,
        });
      } else {
        reset({
          id: "",
          name: "",
          description: "",
          image: "",
          status: "Active",
        });
      }
    }
  }, [isModalOpen, editingCategory, reset]);

  // Load from sessionStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedProds = sessionStorage.getItem("bdm_products");
      if (storedProds) {
        try {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setProducts(JSON.parse(storedProds));
        } catch {}
      }

      const stored = sessionStorage.getItem("bdm_categories");
      if (stored) {
        try {
          setCategories(JSON.parse(stored));
        } catch {
          setCategories(initialCategories);
        }
      } else {
        setCategories(initialCategories);
        sessionStorage.setItem("bdm_categories", JSON.stringify(initialCategories));
      }
    }
  }, []);

  // Save helper
  const saveCategories = (updated: Category[]) => {
    setCategories(updated);
    sessionStorage.setItem("bdm_categories", JSON.stringify(updated));
  };

  const handleAddClick = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (cat: Category) => {
    setEditingCategory(cat);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete category "${name}"?`)) {
      const updated = categories.filter((c) => c.id !== id);
      saveCategories(updated);
      addToast({
        title: "Category Deleted",
        message: `Category "${name}" has been deleted.`,
        variant: "info",
      });
    }
  };

  const onSubmit = (data: CategoryFormData) => {
    if (editingCategory) {
      const updated = categories.map((c) => {
        if (c.id === editingCategory.id) {
          return {
            ...c,
            name: data.name,
            description: data.description,
            image: data.image,
            status: data.status,
          };
        }
        return c;
      });
      saveCategories(updated);
      addToast({
        title: "Category Updated",
        message: `"${data.name}" category was updated successfully.`,
        variant: "success",
      });
    } else {
      // Generate Category ID dynamically
      const newId = `CAT-${String(categories.length + 1).padStart(3, "0")}`;
      let uniqueId = newId;
      let counter = categories.length + 1;
      while (categories.some((c) => c.id === uniqueId)) {
        counter++;
        uniqueId = `CAT-${String(counter).padStart(3, "0")}`;
      }

      const newCategory: Category = {
        id: uniqueId,
        name: data.name,
        description: data.description,
        status: data.status,
        image: data.image,
        count: 0,
      };
      const updated = [...categories, newCategory];
      saveCategories(updated);
      addToast({
        title: "Category Created",
        message: `"${data.name}" category was added successfully with ID "${uniqueId}".`,
        variant: "success",
      });
    }

    setIsModalOpen(false);
  };

  // Filter Categories
  const filteredCategories = categories.filter((cat) => {
    return (
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      {/* Admin Page Header with Breadcrumb */}
      <AdminPageHeader
        title="Categories"
        breadcrumbs={[
          { label: "Admin", href: AppRoutes.Admin.Dashboard },
          { label: "Categories" },
        ]}
      />

      {/* Card with Integrated Search Header & Grid Body */}
      <Card>
        <Card.Header>
          {/* Left: Search input */}
          <SearchInput
            placeholder="Search categories by name or ID..."
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
              id="add-category-btn"
              onClick={handleAddClick}
              className="inline-flex items-center justify-center gap-2 bg-[#ed1c27] hover:bg-[#c5141e] text-white font-bold uppercase tracking-[0.12em] text-[10px] rounded-xl px-5 py-2 transition-all duration-300 cursor-pointer hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#ed1c27]/25"
            >
              <Plus size={14} /> Add Category
            </button>
          </div>
        </Card.Header>

        <Card.Body className="bg-gray-50/30 p-6">
          {paginatedCategories.length === 0 ? (
            <div className="py-12 text-center text-xs font-semibold text-gray-400">
              No categories found matching your search.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedCategories.map((cat) => (
                <div key={cat.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group hover:border-[#ed1c27]/30 transition-colors flex flex-col justify-between">
                  <div>
                    <div className="h-40 relative bg-gray-100 overflow-hidden">
                      <Image src={cat.image} alt={cat.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-3 right-3 flex gap-2">
                        <span className={`px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-widest ${
                          cat.status === "Active" ? "bg-emerald-500 text-white" : "bg-gray-500 text-white"
                        }`}>
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
                          <span className="text-[10px] font-bold">
                            {products.filter((p) => p.category.toLowerCase() === cat.name.toLowerCase()).length}
                          </span>
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
                        onClick={() => handleEditClick(cat)}
                        className="flex-1 inline-flex items-center justify-center gap-2 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors cursor-pointer"
                      >
                        <Edit size={12} /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(cat.id, cat.name)}
                        className="flex-1 inline-flex items-center justify-center gap-2 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors cursor-pointer"
                      >
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
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            pageSize={itemsPerPage}
            onPageSizeChange={(size) => {
              setItemsPerPage(size);
              setCurrentPage(1);
            }}
            totalItems={filteredCategories.length}
            pageSizeOptions={[4, 8, 12, 24, 48]}
          />
        </Card.Footer>
      </Card>

      {/* Categories Add/Edit Modal */}
      <AppModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? "Edit Category" : "Add New Category"}
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
              form="category-form"
              className="px-5 py-2 bg-[#ed1c27] hover:bg-[#c5141e] text-white font-bold uppercase tracking-wider text-xs rounded-xl cursor-pointer shadow-lg shadow-[#ed1c27]/10"
            >
              {editingCategory ? "Save Changes" : "Create Category"}
            </button>
          </>
        }
      >
        <FormProvider {...methods}>
          <form id="category-form" onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
            {/* Status */}
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

            {/* Name */}
            <RHFControl
              control="input"
              name="name"
              label="Category Name *"
              placeholder="e.g. Wall Cladding"
              className="rounded-xl"
            />

            {/* Description */}
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
                control={methods.control}
                render={({ field, fieldState: { error } }) => {
                  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        field.onChange(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  };

                  return (
                    <div className="space-y-2">
                      <div className="border-2 border-dashed border-gray-200 hover:border-[#ed1c27]/50 rounded-xl p-4 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center gap-2 bg-gray-50/50 relative group min-h-[140px]">
                        {field.value ? (
                          <div className="relative w-full h-32 rounded-lg overflow-hidden border border-gray-100">
                            <Image
                              src={field.value}
                              alt="Category preview"
                              fill
                              className="object-cover"
                            />
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
                            <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Upload Image</span>
                            <span className="text-[9px] text-gray-400 font-semibold uppercase tracking-widest">Click or drag image file</span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                      </div>
                      {error?.message && (
                        <p className="text-[10px] font-semibold text-red-500 uppercase tracking-tight">{error.message}</p>
                      )}
                    </div>
                  );
                }}
              />
            </div>
          </form>
        </FormProvider>
      </AppModal>
    </div>
  );
}
