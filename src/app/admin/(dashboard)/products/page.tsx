"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card, useAppToast, AdminPageHeader, Pagination, SearchInput } from "@/components/ui";
import { AppRoutes } from "@/constants/routes";

import initialProductsData from "@/data/products.json";

interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  brand: string;
  price: string;
  status: string;
  stock: number;
  description: string;
  images: string[];
  image?: string;
  catNo?: string;
  blueprintImage?: string;
  features?: { title: string; desc: string }[];
  specifications?: { label: string; value: string }[];
  dimensions?: { name: string; range: string; coord: string }[];
  resources?: { id: string; title: string; desc: string; format: string; size: string }[];
  variants?: { label: string; options: string[] }[];
  swatches?: {
    category: string;
    options: { name: string; hex: string; desc: string; border?: boolean }[];
  }[];
}

interface Category {
  id: string;
  name: string;
  description: string;
  count: number;
  image: string;
  status: string;
  slug?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const initialProducts: Product[] = initialProductsData.map((p: any) => ({
  id: p.id || p.slug || "",
  slug: p.slug || p.id || "",
  name: p.name || "",
  category: p.category || "",
  brand: p.brand || "Western",
  price: p.price || "",
  status: p.status || "Active",
  stock: p.stock !== undefined ? p.stock : 10,
  description: p.description || "",
  images: Array.isArray(p.images) ? p.images : (p.image ? [p.image] : []),
  catNo: p.catNo || "",
  blueprintImage: p.blueprintImage || "",
  features: Array.isArray(p.features) ? p.features : [],
  specifications: Array.isArray(p.specifications) ? p.specifications : [],
  dimensions: Array.isArray(p.dimensions) ? p.dimensions : [],
  resources: Array.isArray(p.resources) ? p.resources : [],
  variants: Array.isArray(p.variants) ? p.variants : [],
  swatches: Array.isArray(p.swatches) ? p.swatches : [],
}));

export default function AdminProductsPage() {
  const { addToast } = useAppToast();
  const router = useRouter();

  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Load from sessionStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("bdm_products");
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as Product[];
          const migrated = parsed.map((p) => ({
            ...p,
            status: p.status || (p.stock > 0 ? "Active" : "Inactive"),
            stock: p.stock !== undefined ? p.stock : 10,
            images: Array.isArray(p.images) ? p.images : (p.image ? [p.image] : []),
            features: Array.isArray(p.features) ? p.features : [],
            specifications: Array.isArray(p.specifications) ? p.specifications : [],
            dimensions: Array.isArray(p.dimensions) ? p.dimensions : [],
            resources: Array.isArray(p.resources) ? p.resources : [],
            variants: Array.isArray(p.variants) ? p.variants : [],
            swatches: Array.isArray(p.swatches) ? p.swatches : [],
          }));
          setProducts(migrated);
        } catch {
          setProducts(initialProducts);
        }
      } else {
        setProducts(initialProducts);
        sessionStorage.setItem("bdm_products", JSON.stringify(initialProducts));
      }

      const storedCats = sessionStorage.getItem("bdm_categories");
      if (storedCats) {
        try { setCategories(JSON.parse(storedCats)); } catch { setCategories([]); }
      }
    }
  }, []);

  // Save to sessionStorage helper
  const saveProducts = (updatedList: Product[]) => {
    setProducts(updatedList);
    sessionStorage.setItem("bdm_products", JSON.stringify(updatedList));
  };

  // Navigate to New Product page
  const handleAddClick = () => {
    router.push(AppRoutes.Admin.NewProduct);
  };

  // Navigate to Edit Product page
  const handleEditClick = (prod: Product) => {
    router.push(AppRoutes.Admin.EditProduct(prod.id));
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

  // Filter products based on search
  const filteredProducts = products.filter((prod) => {
    return (
      prod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prod.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prod.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const defaultCategoryOptions = [
    { label: "Floor Tiles", value: "floor-tiles" },
    { label: "Wall Tiles", value: "wall-tiles" },
    { label: "Wooden Flooring", value: "wooden-flooring" },
    { label: "Bathroom Fittings", value: "bathroom-fittings" },
    { label: "Granite & Marble", value: "granite-marble" },
  ];
  const categoryOptions = categories.length > 0
    ? categories.map((c) => ({ label: c.name, value: c.id || c.slug || "" }))
    : defaultCategoryOptions;

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
      <Card>
        <Card.Header>
          {/* Left: Search input */}
          <SearchInput
            placeholder="Search products by name, brand or ID..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            wrapperClassName="max-w-sm"
          />

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
                          <Image src={prod.images?.[0] || prod.image || "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=2070&auto=format&fit=crop"} alt={prod.name} fill className="object-cover" />
                        </div>
                      </td>
                      <td className="py-3 px-6">
                        <p className="text-xs font-semibold text-gray-900">{prod.name}</p>
                        <p className="text-[10px] text-gray-400 font-medium mt-0.5">{prod.id}</p>
                      </td>
                      <td className="py-3 px-6">
                        <p className="text-xs font-medium text-gray-700">
                          {categories.find((c) => c.id === prod.category || c.slug === prod.category)?.name || prod.category}
                        </p>
                        <p className="text-[10px] text-gray-400 font-medium mt-0.5">{prod.brand}</p>
                      </td>
                      <td className="py-3 px-6 text-xs font-semibold text-gray-900">
                        {prod.price}
                      </td>
                      <td className="py-3 px-6">
                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest ${
                          prod.status === "Active" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
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
            totalItems={filteredProducts.length}
            pageSizeOptions={[5, 10, 20, 50]}
          />
        </Card.Footer>
      </Card>
    </div>
  );
}
