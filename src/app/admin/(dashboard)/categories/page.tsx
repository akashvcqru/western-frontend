"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, Folder } from "lucide-react";
import Image from "next/image";
import { Card, AppModal, useAppToast, AdminPageHeader, Pagination, RHFControl, SearchInput } from "@/components/ui";
import { AppRoutes } from "@/constants/routes";
import { useForm, FormProvider } from "react-hook-form";
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

const initialCategories: Category[] = [
  { id: "CAT-001", name: "Floor Tiles", description: "Premium vitrified and ceramic tiles for flooring.", count: 45, image: "https://bawadittamal.com/wp-content/uploads/2023/12/1.jpg", status: "Active" },
  { id: "CAT-002", name: "Wall Tiles", description: "Designer wall tiles for kitchens and bathrooms.", count: 32, image: "https://bawadittamal.com/wp-content/uploads/2023/12/3.jpg", status: "Active" },
  { id: "CAT-003", name: "Wooden Flooring", description: "High-quality laminate and engineered wood.", count: 18, image: "https://bawadittamal.com/wp-content/uploads/2023/12/2.jpg", status: "Active" },
  { id: "CAT-004", name: "Bathroom Fittings", description: "Faucets, showers, and luxury bath accessories.", count: 24, image: "https://bawadittamal.com/wp-content/uploads/2023/12/4.jpg", status: "Inactive" },
  { id: "CAT-005", name: "Granite & Marble", description: "Natural stone slabs for countertop and floors.", count: 12, image: "https://bawadittamal.com/wp-content/uploads/2023/12/5.jpg", status: "Active" },
];

// Validation Schema
const categorySchema = yup.object().shape({
  name: yup
    .string()
    .required("Category Name is required")
    .min(3, "Category Name must be at least 3 characters"),
  status: yup
    .string()
    .required("Status is required")
    .oneOf(["Active", "Inactive"], "Status must be either Active or Inactive"),
  count: yup
    .number()
    .typeError("Count must be a number")
    .integer("Count must be an integer")
    .min(0, "Count cannot be negative")
    .optional()
    .default(0),
  description: yup
    .string()
    .required("Description is required"),
  image: yup
    .string()
    .optional()
    .test("is-url", "Must be a valid URL", (value) => {
      if (!value) return true;
      try {
        const url = new URL(value);
        return url.protocol === "http:" || url.protocol === "https:";
      } catch {
        return false;
      }
    }),
});

type CategoryFormData = yup.InferType<typeof categorySchema>;

export default function AdminCategoriesPage() {
  const { addToast } = useAppToast();
  
  // State
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  // Reset page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // React Hook Form Configuration
  const methods = useForm<CategoryFormData>({
    resolver: yupResolver(categorySchema) as any,
    defaultValues: {
      name: "",
      description: "",
      status: "Active",
      count: 0,
      image: "",
    },
  });

  const { reset } = methods;

  // Reset form when modal opens or editingCategory changes
  useEffect(() => {
    if (isModalOpen) {
      if (editingCategory) {
        reset({
          name: editingCategory.name,
          description: editingCategory.description,
          status: editingCategory.status,
          count: editingCategory.count,
          image: editingCategory.image === "https://bawadittamal.com/wp-content/uploads/2023/12/3.jpg" ? "" : editingCategory.image,
        });
      } else {
        reset({
          name: "",
          description: "",
          status: "Active",
          count: 0,
          image: "",
        });
      }
    }
  }, [isModalOpen, editingCategory, reset]);

  // Load from sessionStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
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
    const defaultImage = "https://bawadittamal.com/wp-content/uploads/2023/12/3.jpg";
    const imageUrl = data.image?.trim() || defaultImage;

    if (editingCategory) {
      const updated = categories.map((c) => {
        if (c.id === editingCategory.id) {
          return {
            ...c,
            name: data.name,
            description: data.description,
            status: data.status,
            image: imageUrl,
            count: data.count ?? 0,
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
      const newId = `CAT-${String(categories.length + 1).padStart(3, "0")}`;
      const newCategory: Category = {
        id: newId,
        name: data.name,
        description: data.description,
        status: data.status,
        image: imageUrl,
        count: data.count ?? 0,
      };
      const updated = [...categories, newCategory];
      saveCategories(updated);
      addToast({
        title: "Category Created",
        message: `"${data.name}" category was added successfully.`,
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
            onChange={(e) => setSearchTerm(e.target.value)}
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
            {/* Name */}
            <RHFControl
              control="input"
              name="name"
              label="Category Name *"
              placeholder="e.g. Wall Cladding"
              className="rounded-xl"
            />

            <div className="grid grid-cols-2 gap-4">
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

              {/* Total Products (Initial) */}
              <RHFControl
                control="input"
                type="number"
                name="count"
                label="Total Products Count"
                placeholder="e.g. 10"
                className="rounded-xl"
              />
            </div>

            {/* Description */}
            <RHFControl
              control="textarea"
              name="description"
              label="Description *"
              placeholder="Provide a brief summary of what products this category includes..."
              className="rounded-xl"
            />

            {/* Image URL */}
            <div className="space-y-1">
              <RHFControl
                control="input"
                name="image"
                label="Image URL"
                placeholder="e.g. https://domain.com/path/to/category.jpg"
                className="rounded-xl"
              />
              <p className="text-[9px] text-gray-400 mt-0.5">Leave blank to use a default category image.</p>
            </div>
          </form>
        </FormProvider>
      </AppModal>
    </div>
  );
}
