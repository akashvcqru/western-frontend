"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search, Filter, Edit, Trash2, Folder, X } from "lucide-react";
import Image from "next/image";
import { Card, AppModal, useAppToast } from "@/components/ui";

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
  { id: "CAT-005", name: "Granite & Marble", description: "Natural stone slabs for countertops and floors.", count: 12, image: "https://bawadittamal.com/wp-content/uploads/2023/12/5.jpg", status: "Active" },
];

export default function AdminCategoriesPage() {
  const { addToast } = useAppToast();
  
  // State
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  
  // Form State
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formStatus, setFormStatus] = useState("Active");
  const [formImage, setFormImage] = useState("");
  const [formCount, setFormCount] = useState<number>(0);

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
    setFormName("");
    setFormDescription("");
    setFormStatus("Active");
    setFormImage("");
    setFormCount(0);
    setIsModalOpen(true);
  };

  const handleEditClick = (cat: Category) => {
    setEditingCategory(cat);
    setFormName(cat.name);
    setFormDescription(cat.description);
    setFormStatus(cat.status);
    setFormImage(cat.image);
    setFormCount(cat.count);
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

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formName || !formDescription) {
      addToast({
        title: "Validation Error",
        message: "Please fill in all required fields.",
        variant: "error",
      });
      return;
    }

    const defaultImage = "https://bawadittamal.com/wp-content/uploads/2023/12/3.jpg";
    const imageUrl = formImage.trim() || defaultImage;

    if (editingCategory) {
      const updated = categories.map((c) => {
        if (c.id === editingCategory.id) {
          return {
            ...c,
            name: formName,
            description: formDescription,
            status: formStatus,
            image: imageUrl,
            count: formCount,
          };
        }
        return c;
      });
      saveCategories(updated);
      addToast({
        title: "Category Updated",
        message: `"${formName}" category was updated successfully.`,
        variant: "success",
      });
    } else {
      const newId = `CAT-${String(categories.length + 1).padStart(3, "0")}`;
      const newCategory: Category = {
        id: newId,
        name: formName,
        description: formDescription,
        status: formStatus,
        image: imageUrl,
        count: formCount,
      };
      const updated = [...categories, newCategory];
      saveCategories(updated);
      addToast({
        title: "Category Created",
        message: `"${formName}" category was added successfully.`,
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">Categories</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">Organize products into distinct groupings</p>
        </div>
        <button
          id="add-category-btn"
          onClick={handleAddClick}
          className="inline-flex items-center justify-center gap-2 bg-[#ed1c27] hover:bg-[#c5141e] text-white font-bold uppercase tracking-[0.12em] text-[10px] rounded-xl px-5 py-3 transition-all duration-300 cursor-pointer hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#ed1c27]/25 flex-shrink-0"
        >
          <Plus size={14} /> Add Category
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search categories by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-medium focus:outline-none focus:border-[#ed1c27]/30 transition-colors"
          />
        </div>
      </div>

      {/* Grid View */}
      {filteredCategories.length === 0 ? (
        <Card className="py-12 text-center text-xs font-semibold text-gray-400">
          No categories found.
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCategories.map((cat) => (
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

      {/* Categories Add/Edit Modal */}
      <AppModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? "Edit Category" : "Add New Category"}
        size="md"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Category Name *</label>
            <input
              type="text"
              required
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="e.g. Wall Cladding"
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

            {/* Total Products (Initial) */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Total Products Count</label>
              <input
                type="number"
                min={0}
                value={formCount}
                onChange={(e) => setFormCount(Number(e.target.value))}
                placeholder="e.g. 10"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#ed1c27]/40"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Description *</label>
            <textarea
              required
              rows={3}
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="Provide a brief summary of what products this category includes..."
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#ed1c27]/40 resize-none"
            />
          </div>

          {/* Image URL */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Image URL</label>
            <input
              type="text"
              value={formImage}
              onChange={(e) => setFormImage(e.target.value)}
              placeholder="e.g. https://domain.com/path/to/category.jpg"
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#ed1c27]/40"
            />
            <p className="text-[9px] text-gray-400 mt-0.5">Leave blank to use a default category image.</p>
          </div>

          {/* Buttons */}
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
              {editingCategory ? "Save Changes" : "Create Category"}
            </button>
          </div>
        </form>
      </AppModal>
    </div>
  );
}
