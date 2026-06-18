"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Edit, Trash2, AlertCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card, useAppToast, AdminPageHeader, Pagination, SearchInput } from "@/components/ui";
import { AppRoutes } from "@/constants/routes";
import { apiAuthGetPaginated, apiDelete, buildQuery } from "@/lib/api";
import type { Product, Category, PaginationMeta, SubCategory } from "@/types/api";

export default function AdminProductsPage() {
  const { addToast } = useAppToast();
  const router = useRouter();

  // Data state
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({ currentPage: 1, totalPages: 1, totalItems: 0, limit: 10 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // ── Fetch products ─────────────────────────────────────────────────────────
  const fetchProducts = useCallback(async (page: number, limit: number, search: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const query = buildQuery({ page, limit, search });
      const res = await apiAuthGetPaginated<Product>(`/api/products${query}`);
      setProducts(res.data);
      setPagination(res.pagination);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load products");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch categories (all, for name resolution)
  const fetchCategories = useCallback(async () => {
    try {
      const res = await apiAuthGetPaginated<Category>("/api/categories?limit=100");
      setCategories(res.data);
    } catch { /* non-critical */ }
    try {
      const res = await apiAuthGetPaginated<SubCategory>("/api/categories/subcategories?limit=100");
      setSubCategories(res.data);
    } catch { /* non-critical */ }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts(currentPage, itemsPerPage, searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [currentPage, itemsPerPage, searchTerm, fetchProducts]);

  useEffect(() => { setCurrentPage(1); }, [searchTerm, itemsPerPage]);

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDeleteClick = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await apiDelete(`/api/products/${id}`);
      addToast({ title: "Product Deleted", message: `"${name}" has been removed successfully.`, variant: "info" });
      fetchProducts(currentPage, itemsPerPage, searchTerm);
    } catch (err: unknown) {
      addToast({ title: "Error", message: err instanceof Error ? err.message : "Delete failed", variant: "error" });
    }
  };

  const getCategoryName = (catId: string) =>
    categories.find(c => c.id === catId || c.slug === catId)?.name || catId;

  const getSubCategoryName = (subCatId?: string) => {
    if (!subCatId) return "—";
    return subCategories.find(s => s.id === subCatId || s.slug === subCatId)?.name || subCatId;
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Products"
        breadcrumbs={[
          { label: "Admin", href: AppRoutes.Admin.Dashboard },
          { label: "Products" },
        ]}
      />

      <Card>
        <Card.Header>
          <SearchInput
            placeholder="Search products by name, brand or ID..."
            value={searchTerm}
            onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            wrapperClassName="max-w-sm"
          />
          <div className="flex items-center gap-3">
            <button
              id="add-product-btn"
              onClick={() => router.push(AppRoutes.Admin.NewProduct)}
              className="inline-flex items-center justify-center gap-2 bg-[#ed1c27] hover:bg-[#c5141e] text-white font-bold uppercase tracking-[0.12em] text-[10px] rounded-xl px-5 py-2 transition-all duration-300 cursor-pointer hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#ed1c27]/25"
            >
              <Plus size={14} /> Add Product
            </button>
          </div>
        </Card.Header>

        <Card.Body noPadding>
          {error && (
            <div className="flex items-center gap-3 p-6 text-red-600 bg-red-50 border-b border-red-100">
              <AlertCircle size={18} />
              <p className="text-sm font-semibold">{error}</p>
              <button onClick={() => fetchProducts(currentPage, itemsPerPage, searchTerm)} className="ml-auto text-xs underline cursor-pointer">Retry</button>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-400 w-16">Image</th>
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">Product</th>
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">Category</th>
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">Sub Category</th>
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</th>
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoading ? (
                  Array.from({ length: itemsPerPage }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="py-3 px-6"><div className="w-12 h-12 rounded-lg bg-gray-100" /></td>
                      <td className="py-3 px-6"><div className="h-3 bg-gray-100 rounded w-36 mb-1" /><div className="h-2 bg-gray-100 rounded w-20" /></td>
                      <td className="py-3 px-6"><div className="h-3 bg-gray-100 rounded w-24" /></td>
                      <td className="py-3 px-6"><div className="h-3 bg-gray-100 rounded w-24" /></td>
                      <td className="py-3 px-6"><div className="h-5 bg-gray-100 rounded-full w-16" /></td>
                      <td className="py-3 px-6" />
                    </tr>
                  ))
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">No products found</p>
                      <p className="text-[11px] text-gray-400 mt-1">{searchTerm ? "Try adjusting your search." : "Add your first product to get started."}</p>
                    </td>
                  </tr>
                ) : (
                  products.map(prod => (
                    <tr key={prod.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="py-3 px-6">
                        <div className="w-12 h-12 rounded-lg bg-white overflow-hidden relative border border-gray-100 p-1 flex items-center justify-center">
                          <Image
                            src={prod.images?.[0] || prod.image || "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=2070&auto=format&fit=crop"}
                            alt={prod.name} fill className="object-contain p-1"
                          />
                        </div>
                      </td>
                      <td className="py-3 px-6">
                        <p className="text-xs font-semibold text-gray-900">{prod.name}</p>
                        <p className="text-[10px] text-gray-400 font-medium mt-0.5">{prod.id}</p>
                      </td>
                      <td className="py-3 px-6">
                        <p className="text-xs font-medium text-gray-700">{getCategoryName(prod.category)}</p>
                      </td>
                      <td className="py-3 px-6">
                        <p className="text-xs font-medium text-gray-700">{getSubCategoryName(prod.subCategory)}</p>
                      </td>
                      <td className="py-3 px-6">
                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest ${prod.status === "Active" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>
                          {prod.status} ({prod.stock})
                        </span>
                      </td>
                      <td className="py-3 px-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => router.push(AppRoutes.Admin.EditProduct(prod.id))} className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer" title="Edit Product">
                            <Edit size={14} />
                          </button>
                          <button onClick={() => handleDeleteClick(prod.id, prod.name)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer" title="Delete Product">
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
            onPageSizeChange={size => { setItemsPerPage(size); setCurrentPage(1); }}
            totalItems={pagination.totalItems}
            pageSizeOptions={[5, 10, 20, 50]}
          />
        </Card.Footer>
      </Card>
    </div>
  );
}
