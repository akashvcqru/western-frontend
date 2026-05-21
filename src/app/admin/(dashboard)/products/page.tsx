"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import { Card, AppModal, useAppToast, AdminPageHeader } from "@/components/ui";
import { AppRoutes } from "@/constants/routes";

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

const initialProducts: Product[] = [
  { id: "PROD-001", name: "Premium Vitrified Tiles", category: "Tiles", brand: "Kajaria", price: "₹850/box", status: "In Stock", stock: 145, image: "https://bawadittamal.com/wp-content/uploads/2023/12/1.jpg" },
  { id: "PROD-002", name: "Wooden Finish Flooring", category: "Flooring", brand: "Greenply", price: "₹1,200/sqft", status: "Low Stock", stock: 12, image: "https://bawadittamal.com/wp-content/uploads/2023/12/2.jpg" },
  { id: "PROD-003", name: "Ceramic Wall Tiles", category: "Tiles", brand: "Somany", price: "₹650/box", status: "In Stock", stock: 89, image: "https://bawadittamal.com/wp-content/uploads/2023/12/3.jpg" },
  { id: "PROD-004", name: "Luxury Bathroom Fittings", category: "Fittings", brand: "Jaquar", price: "₹4,500/set", status: "Out of Stock", stock: 0, image: "https://bawadittamal.com/wp-content/uploads/2023/12/4.jpg" },
  { id: "PROD-005", name: "Granite Countertop", category: "Stones", brand: "Local", price: "₹3,200/slab", status: "In Stock", stock: 34, image: "https://bawadittamal.com/wp-content/uploads/2023/12/5.jpg" },
];

export default function AdminProductsPage() {
  const { addToast } = useAppToast();
  
  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, categoryFilter]);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Form State
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState("Tiles");
  const [formBrand, setFormBrand] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formStock, setFormStock] = useState<number>(10);
  const [formStatus, setFormStatus] = useState("In Stock");
  const [formImage, setFormImage] = useState("");

  // Load from sessionStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("bdm_products");
      if (stored) {
        try {
          setProducts(JSON.parse(stored));
        } catch {
          setProducts(initialProducts);
        }
      } else {
        setProducts(initialProducts);
        sessionStorage.setItem("bdm_products", JSON.stringify(initialProducts));
      }
    }
  }, []);

  // Save to sessionStorage helper
  const saveProducts = (updatedList: Product[]) => {
    setProducts(updatedList);
    sessionStorage.setItem("bdm_products", JSON.stringify(updatedList));
  };

  // Open Modal for Create
  const handleAddClick = () => {
    setEditingProduct(null);
    setFormName("");
    setFormCategory("Tiles");
    setFormBrand("");
    setFormPrice("");
    setFormStock(10);
    setFormStatus("In Stock");
    setFormImage("");
    setIsModalOpen(true);
  };

  // Open Modal for Edit
  const handleEditClick = (prod: Product) => {
    setEditingProduct(prod);
    setFormName(prod.name);
    setFormCategory(prod.category);
    setFormBrand(prod.brand);
    setFormPrice(prod.price);
    setFormStock(prod.stock);
    setFormStatus(prod.status);
    setFormImage(prod.image);
    setIsModalOpen(true);
  };

  // Handle Delete
  const handleDeleteClick = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      const updated = products.filter((p) => p.id !== id);
      saveProducts(updated);
      addToast({
        title: "Product Deleted",
        message: `"${name}" has been removed successfully.`,
        variant: "info",
      });
    }
  };

  // Handle Form Submit
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formName || !formBrand || !formPrice) {
      addToast({
        title: "Validation Error",
        message: "Please fill in all required fields.",
        variant: "error",
      });
      return;
    }

    // Auto determine status based on stock count
    let computedStatus = formStatus;
    if (formStock <= 0) {
      computedStatus = "Out of Stock";
    } else if (formStock <= 15) {
      computedStatus = "Low Stock";
    } else {
      computedStatus = "In Stock";
    }

    const defaultImage = "https://bawadittamal.com/wp-content/uploads/2023/12/1.jpg";
    const imageUrl = formImage.trim() || defaultImage;

    if (editingProduct) {
      // Edit mode
      const updated = products.map((p) => {
        if (p.id === editingProduct.id) {
          return {
            ...p,
            name: formName,
            category: formCategory,
            brand: formBrand,
            price: formPrice,
            stock: formStock,
            status: computedStatus,
            image: imageUrl,
          };
        }
        return p;
      });
      saveProducts(updated);
      addToast({
        title: "Product Updated",
        message: `"${formName}" has been updated successfully.`,
        variant: "success",
      });
    } else {
      // Create mode
      const newId = `PROD-${String(products.length + 1).padStart(3, "0")}`;
      const newProduct: Product = {
        id: newId,
        name: formName,
        category: formCategory,
        brand: formBrand,
        price: formPrice,
        stock: formStock,
        status: computedStatus,
        image: imageUrl,
      };
      const updated = [newProduct, ...products];
      saveProducts(updated);
      addToast({
        title: "Product Created",
        message: `"${formName}" was successfully added to the catalog.`,
        variant: "success",
      });
    }

    setIsModalOpen(false);
  };

  // Filter products based on search and selected options
  const filteredProducts = products.filter((prod) => {
    const matchesSearch =
      prod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prod.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prod.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || prod.status === statusFilter;

    const matchesCategory =
      categoryFilter === "All" || prod.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Unique categories for filtering
  const categoriesList = ["All", ...Array.from(new Set(products.map((p) => p.category)))];

  return (
    <div className="space-y-6">
      {/* Admin Page Header with Breadcrumb */}
      <AdminPageHeader
        title="Products"
        breadcrumbs={[
          { label: "Admin", href: AppRoutes.Admin.Dashboard },
          { label: "Products" },
        ]}
      />

      {/* Data Table with Integrated Toolbar */}
      <Card className="!overflow-visible">
        <Card.Header>
          {/* Left: Search input */}
          <div className="relative w-full max-w-sm">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by Consumer, Mobile or Code"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-card border border-gray-200 dark:border-white/10 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            {/* Add Product button */}
            <button
              id="add-product-btn"
              onClick={handleAddClick}
              className="inline-flex items-center justify-center gap-2 bg-[#ed1c27] hover:bg-[#c5141e] text-white font-bold uppercase tracking-[0.12em] text-[10px] rounded-xl px-5 py-2 transition-all duration-300 cursor-pointer hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#ed1c27]/25"
            >
              <Plus size={14} /> Add Product
            </button>
          </div>
        </Card.Header>

        <Card.Body noPadding>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-400 w-16">Image</th>
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">Product</th>
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">Category & Brand</th>
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">Price</th>
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</th>
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginatedProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-xs font-medium text-gray-400">
                      No products found matching your search.
                    </td>
                  </tr>
                ) : (
                  paginatedProducts.map((prod) => (
                    <tr key={prod.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="py-3 px-6">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden relative border border-gray-100">
                          <Image src={prod.image} alt={prod.name} fill className="object-cover" />
                        </div>
                      </td>
                      <td className="py-3 px-6">
                        <p className="text-xs font-semibold text-gray-900">{prod.name}</p>
                        <p className="text-[10px] text-gray-400 font-medium mt-0.5">{prod.id}</p>
                      </td>
                      <td className="py-3 px-6">
                        <p className="text-xs font-medium text-gray-700">{prod.category}</p>
                        <p className="text-[10px] text-gray-400 font-medium mt-0.5">{prod.brand}</p>
                      </td>
                      <td className="py-3 px-6 text-xs font-semibold text-gray-900">
                        {prod.price}
                      </td>
                      <td className="py-3 px-6">
                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest ${
                          prod.status === "In Stock" ? "bg-emerald-50 text-emerald-600" :
                          prod.status === "Low Stock" ? "bg-amber-50 text-amber-600" :
                          "bg-red-50 text-red-600"
                        }`}>
                          {prod.status} ({prod.stock})
                        </span>
                      </td>
                      <td className="py-3 px-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEditClick(prod)}
                            className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit Product"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(prod.id, prod.name)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Product"
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
        <Card.Footer mutedBackground>
          <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4">
            {/* Left portion: Showing info and Page size select */}
            <div className="flex flex-col sm:flex-row items-center gap-4 text-xs font-semibold text-gray-500">
              <span>
                Showing {filteredProducts.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{" "}
                {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} results
              </span>
              <div className="flex items-center gap-2">
                <span>Show</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="border border-gray-200 dark:border-white/10 rounded-lg px-2.5 py-1 bg-white dark:bg-card text-xs font-semibold outline-none cursor-pointer focus:border-indigo-500"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>

            {/* Right portion: Custom purple styled pagination buttons */}
            <div className="flex items-center gap-1.5 shrink-0 select-none">
              {/* First button: « */}
              <button
                type="button"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="w-8 h-8 rounded-lg border border-gray-100 dark:border-white/5 bg-white dark:bg-card text-gray-400 dark:text-gray-500 transition-all hover:bg-gray-50 dark:hover:bg-white/5 flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium"
              >
                &laquo;
              </button>
              {/* Prev button */}
              <button
                type="button"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 h-8 rounded-lg border border-gray-100 dark:border-white/5 bg-white dark:bg-card text-gray-500 dark:text-gray-400 transition-all hover:bg-gray-50 dark:hover:bg-white/5 flex items-center justify-center gap-1 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium"
              >
                &lt; Prev
              </button>
              {/* Page number buttons */}
              {(totalPages > 0 ? Array.from({ length: totalPages }, (_, i) => i + 1) : [1]).map((page) => (
                <button
                  type="button"
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all cursor-pointer ${
                    currentPage === page
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "border border-gray-100 dark:border-white/5 bg-white dark:bg-card text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
                  }`}
                >
                  {page}
                </button>
              ))}
              {/* Next button */}
              <button
                type="button"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-3 h-8 rounded-lg border border-gray-100 dark:border-white/5 bg-white dark:bg-card text-gray-500 dark:text-gray-400 transition-all hover:bg-gray-50 dark:hover:bg-white/5 flex items-center justify-center gap-1 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium"
              >
                Next &gt;
              </button>
            </div>
          </div>
        </Card.Footer>
      </Card>

      {/* App Modal for Add/Edit */}
      <AppModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? "Edit Product" : "Add New Product"}
        size="md"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Product Name *</label>
            <input
              type="text"
              required
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="e.g. Designer Vitrified Tile"
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#ed1c27]/40"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Category */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Category *</label>
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none"
              >
                <option value="Tiles">Tiles</option>
                <option value="Flooring">Flooring</option>
                <option value="Fittings">Fittings</option>
                <option value="Stones">Stones</option>
              </select>
            </div>

            {/* Brand */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Brand *</label>
              <input
                type="text"
                required
                value={formBrand}
                onChange={(e) => setFormBrand(e.target.value)}
                placeholder="e.g. Kajaria"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#ed1c27]/40"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Price */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Price *</label>
              <input
                type="text"
                required
                value={formPrice}
                onChange={(e) => setFormPrice(e.target.value)}
                placeholder="e.g. ₹950/box"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#ed1c27]/40"
              />
            </div>

            {/* Stock */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Stock Quantity *</label>
              <input
                type="number"
                required
                min={0}
                value={formStock}
                onChange={(e) => setFormStock(Number(e.target.value))}
                placeholder="e.g. 50"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#ed1c27]/40"
              />
            </div>
          </div>

          {/* Image URL */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Image URL</label>
            <input
              type="text"
              value={formImage}
              onChange={(e) => setFormImage(e.target.value)}
              placeholder="e.g. https://domain.com/path/to/image.jpg"
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#ed1c27]/40"
            />
            <p className="text-[9px] text-gray-400 mt-0.5">Leave blank to use a default mock illustration.</p>
          </div>

          {/* Submit */}
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
              className="px-5 py-2 bg-[#ed1c27] hover:bg-[#c5141e] text-white font-bold uppercase tracking-wider text-xs rounded-xl cursor-pointer shadow-lg shadow-[#ed1c27]/10"
            >
              {editingProduct ? "Save Changes" : "Create Product"}
            </button>
          </div>
        </form>
      </AppModal>
    </div>
  );
}
