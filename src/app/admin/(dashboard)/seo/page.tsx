"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Search,
  Globe,
  Package,
  Layers,
  Newspaper,
  Edit,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Save,
  X,
  Sparkles,
  Info,
} from "lucide-react";
import {
  Card,
  AppModal,
  useAppToast,
  AdminPageHeader,
  Pagination,
} from "@/components/ui";
import { apiGet, apiPut } from "@/lib/api";

type TabKey = "pages" | "products" | "categories" | "blogs";

interface PageSeoItem {
  id: string;
  path: string;
  name: string;
  metaTitle: string;
  metaDescription: string;
  defaultMetaTitle: string;
  defaultMetaDescription: string;
  isCustom: boolean;
  updatedAt?: string;
}

interface ProductItem {
  id: string;
  slug: string;
  name: string;
  category: string;
  metaTitle?: string;
  metaDescription?: string;
  description?: string;
}

interface CategoryItem {
  id: string;
  slug?: string;
  name: string;
  metaTitle?: string;
  metaDescription?: string;
  description?: string;
  isSubCategory?: boolean;
}

interface BlogItem {
  id: string;
  title: string;
  category: string;
  metaTitle?: string;
  metaDescription?: string;
  excerpt?: string;
}

export default function SeoManagementPage() {
  const { addToast } = useAppToast();
  const [activeTab, setActiveTab] = useState<TabKey>("pages");

  // Data states
  const [pages, setPages] = useState<PageSeoItem[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [blogs, setBlogs] = useState<BlogItem[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<{
    type: TabKey;
    id: string;
    name: string;
    pathOrUrl: string;
    defaultTitle: string;
    defaultDesc: string;
    metaTitle: string;
    metaDescription: string;
  } | null>(null);

  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Fetch Pages SEO ──────────────────────────────────────────────────────────
  const fetchPages = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await apiGet<PageSeoItem[]>("/api/seo/pages");
      if (res.data) {
        setPages(res.data);
      }
    } catch {
      addToast({
        title: "Error",
        message: "Failed to load pages SEO metadata",
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  // ── Fetch Products ───────────────────────────────────────────────────────────
  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await apiGet<ProductItem[]>("/api/products?limit=1000");
      if (res.data) {
        setProducts(res.data);
      }
    } catch {
      addToast({
        title: "Error",
        message: "Failed to load products for SEO",
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  // ── Fetch Categories & Subcategories ─────────────────────────────────────────
  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      const [catRes, subRes] = await Promise.all([
        apiGet<CategoryItem[]>("/api/categories?limit=100"),
        apiGet<CategoryItem[]>("/api/categories/subcategories?limit=100"),
      ]);

      const list: CategoryItem[] = [];
      if (catRes.data) {
        list.push(...catRes.data.map((c) => ({ ...c, isSubCategory: false })));
      }
      if (subRes.data) {
        list.push(...subRes.data.map((s) => ({ ...s, isSubCategory: true })));
      }
      setCategories(list);
    } catch {
      addToast({
        title: "Error",
        message: "Failed to load categories for SEO",
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  // ── Fetch Blogs ──────────────────────────────────────────────────────────────
  const fetchBlogs = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await apiGet<BlogItem[]>("/api/blogs?limit=100");
      if (res.data) {
        setBlogs(res.data);
      }
    } catch {
      addToast({
        title: "Error",
        message: "Failed to load blogs for SEO",
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  // Load data when activeTab changes
  useEffect(() => {
    setSearchTerm("");
    setCurrentPage(1);
    if (activeTab === "pages") fetchPages();
    else if (activeTab === "products") fetchProducts();
    else if (activeTab === "categories") fetchCategories();
    else if (activeTab === "blogs") fetchBlogs();
  }, [activeTab, fetchPages, fetchProducts, fetchCategories, fetchBlogs]);

  // ── Modal Handlers ───────────────────────────────────────────────────────────
  const handleOpenEdit = (
    type: TabKey,
    id: string,
    name: string,
    pathOrUrl: string,
    metaTitle: string,
    metaDescription: string,
    defaultTitle: string,
    defaultDesc: string
  ) => {
    setEditingItem({
      type,
      id,
      name,
      pathOrUrl,
      defaultTitle,
      defaultDesc,
      metaTitle,
      metaDescription,
    });
    setFormTitle(metaTitle || "");
    setFormDescription(metaDescription || "");
    setIsModalOpen(true);
  };

  const handleSaveSeo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setIsSubmitting(true);
    try {
      const trimmedTitle = formTitle.trim() || null;
      const trimmedDesc = formDescription.trim() || null;

      if (editingItem.type === "pages") {
        await apiPut("/api/seo/pages", {
          id: editingItem.id,
          path: editingItem.pathOrUrl,
          name: editingItem.name,
          metaTitle: trimmedTitle,
          metaDescription: trimmedDesc,
        });
        await fetchPages();
      } else if (editingItem.type === "products") {
        await apiPut(`/api/seo/product/${editingItem.id}`, {
          metaTitle: trimmedTitle,
          metaDescription: trimmedDesc,
        });
        await fetchProducts();
      } else if (editingItem.type === "categories") {
        const cat = categories.find((c) => c.id === editingItem.id);
        const endpoint = cat?.isSubCategory
          ? `/api/seo/subcategory/${editingItem.id}`
          : `/api/seo/category/${editingItem.id}`;
        await apiPut(endpoint, {
          metaTitle: trimmedTitle,
          metaDescription: trimmedDesc,
        });
        await fetchCategories();
      } else if (editingItem.type === "blogs") {
        await apiPut(`/api/seo/blog/${editingItem.id}`, {
          metaTitle: trimmedTitle,
          metaDescription: trimmedDesc,
        });
        await fetchBlogs();
      }

      addToast({
        title: "SEO Saved",
        message: `SEO metadata for "${editingItem.name}" updated successfully.`,
        variant: "success",
      });
      setIsModalOpen(false);
    } catch {
      addToast({
        title: "Error",
        message: "Failed to update SEO metadata",
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetOrClear = async (
    type: TabKey,
    id: string,
    name: string,
    pathOrUrl: string
  ) => {
    if (
      !confirm(
        `Are you sure you want to reset/delete custom SEO for "${name}"? It will revert to system defaults.`
      )
    ) {
      return;
    }

    try {
      if (type === "pages") {
        await apiPut("/api/seo/pages", {
          id,
          path: pathOrUrl,
          name,
          metaTitle: null,
          metaDescription: null,
        });
        await fetchPages();
      } else if (type === "products") {
        await apiPut(`/api/seo/product/${id}`, {
          metaTitle: null,
          metaDescription: null,
        });
        await fetchProducts();
      } else if (type === "categories") {
        const cat = categories.find((c) => c.id === id);
        const endpoint = cat?.isSubCategory
          ? `/api/seo/subcategory/${id}`
          : `/api/seo/category/${id}`;
        await apiPut(endpoint, {
          metaTitle: null,
          metaDescription: null,
        });
        await fetchCategories();
      } else if (type === "blogs") {
        await apiPut(`/api/seo/blog/${id}`, {
          metaTitle: null,
          metaDescription: null,
        });
        await fetchBlogs();
      }

      addToast({
        title: "SEO Reset",
        message: `Custom SEO for "${name}" was cleared and reverted to defaults.`,
        variant: "info",
      });
      if (isModalOpen) setIsModalOpen(false);
    } catch {
      addToast({
        title: "Error",
        message: "Failed to reset SEO metadata",
        variant: "error",
      });
    }
  };

  // ── Filtered Data Lists ──────────────────────────────────────────────────────
  const filteredPages = useMemo(() => {
    if (!searchTerm.trim()) return pages;
    const s = searchTerm.toLowerCase();
    return pages.filter(
      (p) =>
        p.name.toLowerCase().includes(s) ||
        p.path.toLowerCase().includes(s) ||
        p.metaTitle.toLowerCase().includes(s) ||
        p.metaDescription.toLowerCase().includes(s)
    );
  }, [pages, searchTerm]);

  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return products;
    const s = searchTerm.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(s) ||
        p.slug.toLowerCase().includes(s) ||
        p.category.toLowerCase().includes(s) ||
        (p.metaTitle && p.metaTitle.toLowerCase().includes(s))
    );
  }, [products, searchTerm]);

  const filteredCategories = useMemo(() => {
    if (!searchTerm.trim()) return categories;
    const s = searchTerm.toLowerCase();
    return categories.filter(
      (c) =>
        c.name.toLowerCase().includes(s) ||
        (c.slug && c.slug.toLowerCase().includes(s)) ||
        (c.metaTitle && c.metaTitle.toLowerCase().includes(s))
    );
  }, [categories, searchTerm]);

  const filteredBlogs = useMemo(() => {
    if (!searchTerm.trim()) return blogs;
    const s = searchTerm.toLowerCase();
    return blogs.filter(
      (b) =>
        b.title.toLowerCase().includes(s) ||
        b.id.toLowerCase().includes(s) ||
        (b.metaTitle && b.metaTitle.toLowerCase().includes(s))
    );
  }, [blogs, searchTerm]);

  // Paginated data slices for each tab
  const paginatedPages = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredPages.slice(start, start + pageSize);
  }, [filteredPages, currentPage, pageSize]);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage, pageSize]);

  const paginatedCategories = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCategories.slice(start, start + pageSize);
  }, [filteredCategories, currentPage, pageSize]);

  const paginatedBlogs = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredBlogs.slice(start, start + pageSize);
  }, [filteredBlogs, currentPage, pageSize]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <AdminPageHeader
        title="SEO Management"
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "SEO Management" },
        ]}
      />

      {/* Tabs Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-3">
        <div className="flex gap-2">
          {[
            { key: "pages", label: "Pages", icon: Globe, count: pages.length },
            {
              key: "products",
              label: "Products",
              icon: Package,
              count: products.length,
            },
            {
              key: "categories",
              label: "Categories",
              icon: Layers,
              count: categories.length,
            },
            { key: "blogs", label: "Blog Posts", icon: Newspaper, count: blogs.length },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key as TabKey);
                  setCurrentPage(1);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#ed1c27] text-white shadow-md shadow-[#ed1c27]/20"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:text-black"
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                    isActive ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[260px]">
          <Search
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={`Search ${activeTab}...`}
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium text-black focus:outline-none focus:border-[#ed1c27]/40 shadow-sm"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black cursor-pointer text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* SEO Info Callout */}
      <div className="bg-gradient-to-r from-red-500/10 via-red-500/5 to-transparent border border-[#ed1c27]/20 p-4 rounded-2xl flex items-start gap-3">
        <Sparkles size={18} className="text-[#ed1c27] mt-0.5 flex-shrink-0" />
        <div className="text-xs text-gray-700 leading-relaxed">
          <strong className="text-black font-semibold">
            Real-time SSR Synchronization Active:
          </strong>{" "}
          When you update a meta title and description here, Next.js generates the
          new values on the server. Viewing page source with{" "}
          <code className="bg-white px-1.5 py-0.5 rounded border border-gray-200 text-[#ed1c27] font-bold">
            Ctrl + U
          </code>{" "}
          and Google search bots will immediately read your exact custom SEO tags.
        </div>
      </div>

      {/* ── Tab 1: Pages Table ──────────────────────────────────────────────── */}
      {activeTab === "pages" && (
        <Card className="p-0 overflow-hidden border border-gray-200/80 shadow-sm rounded-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/70 border-b border-gray-200/80 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                  <th className="py-3 px-4">Page Name</th>
                  <th className="py-3 px-4">URL Route</th>
                  <th className="py-3 px-4">Meta Title</th>
                  <th className="py-3 px-4">Meta Description</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-400">
                      Loading pages SEO...
                    </td>
                  </tr>
                ) : filteredPages.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-400">
                      No pages matched your search.
                    </td>
                  </tr>
                ) : (
                  paginatedPages.map((page) => (
                    <tr key={page.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 px-4 font-bold text-gray-900">
                        {page.name}
                      </td>
                      <td className="py-3 px-4 text-gray-500 font-mono text-[11px]">
                        <a
                          href={page.path}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:text-[#ed1c27] inline-flex items-center gap-1"
                        >
                          {page.path}
                          <ExternalLink size={10} />
                        </a>
                      </td>
                      <td className="py-3 px-4 max-w-xs truncate text-gray-800" title={page.metaTitle}>
                        {page.metaTitle}
                      </td>
                      <td className="py-3 px-4 max-w-sm truncate text-gray-500" title={page.metaDescription}>
                        {page.metaDescription}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {page.isCustom ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                            <CheckCircle2 size={10} /> Custom
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-500 border border-gray-200">
                            Default
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() =>
                              handleOpenEdit(
                                "pages",
                                page.id,
                                page.name,
                                page.path,
                                page.isCustom ? page.metaTitle : "",
                                page.isCustom ? page.metaDescription : "",
                                page.defaultMetaTitle,
                                page.defaultMetaDescription
                              )
                            }
                            className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:text-black hover:border-gray-400 bg-white cursor-pointer transition-colors"
                            title="Edit SEO"
                          >
                            <Edit size={13} />
                          </button>
                          {page.isCustom && (
                            <button
                              onClick={() =>
                                handleResetOrClear("pages", page.id, page.name, page.path)
                              }
                              className="p-1.5 rounded-lg border border-amber-200 text-amber-600 hover:bg-amber-50 bg-white cursor-pointer transition-colors"
                              title="Reset to Default"
                            >
                              <RotateCcw size={13} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {filteredPages.length > 0 && (
            <div className="p-4 border-t border-gray-100 bg-gray-50/30">
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(filteredPages.length / pageSize) || 1}
                totalItems={filteredPages.length}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
                onPageSizeChange={(newSize) => {
                  setPageSize(newSize);
                  setCurrentPage(1);
                }}
              />
            </div>
          )}
        </Card>
      )}

      {/* ── Tab 2: Products Table ───────────────────────────────────────────── */}
      {activeTab === "products" && (
        <Card className="p-0 overflow-hidden border border-gray-200/80 shadow-sm rounded-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/70 border-b border-gray-200/80 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                  <th className="py-3 px-4">Product Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Meta Title (SEO)</th>
                  <th className="py-3 px-4">Meta Description</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-400">
                      Loading products SEO...
                    </td>
                  </tr>
                ) : paginatedProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-400">
                      No products found.
                    </td>
                  </tr>
                ) : (
                  paginatedProducts.map((prod) => {
                    const hasCustom =
                      !!prod.metaTitle?.trim() || !!prod.metaDescription?.trim();
                    const displayTitle = prod.metaTitle || prod.name;
                    const displayDesc =
                      prod.metaDescription ||
                      prod.description?.replace(/<[^>]*>?/gm, "").slice(0, 160) ||
                      "";

                    return (
                      <tr key={prod.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-3 px-4 font-bold text-gray-900">
                          {prod.name}
                        </td>
                        <td className="py-3 px-4 text-gray-500">
                          <span className="px-2 py-0.5 rounded-md text-[10px] bg-gray-100 text-gray-700">
                            {prod.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 max-w-xs truncate text-gray-800" title={displayTitle}>
                          {displayTitle}
                        </td>
                        <td className="py-3 px-4 max-w-sm truncate text-gray-500" title={displayDesc}>
                          {displayDesc}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {hasCustom ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                              <CheckCircle2 size={10} /> Custom
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-500 border border-gray-200">
                              Auto
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() =>
                                handleOpenEdit(
                                  "products",
                                  prod.id,
                                  prod.name,
                                  `/product/${prod.slug || prod.id}`,
                                  prod.metaTitle || "",
                                  prod.metaDescription || "",
                                  prod.name,
                                  prod.description?.replace(/<[^>]*>?/gm, "").slice(0, 160) || ""
                                )
                              }
                              className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:text-black hover:border-gray-400 bg-white cursor-pointer transition-colors"
                              title="Edit SEO"
                            >
                              <Edit size={13} />
                            </button>
                            {hasCustom && (
                              <button
                                onClick={() =>
                                  handleResetOrClear(
                                    "products",
                                    prod.id,
                                    prod.name,
                                    `/product/${prod.slug || prod.id}`
                                  )
                                }
                                className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 bg-white cursor-pointer transition-colors"
                                title="Clear Custom SEO"
                              >
                                <RotateCcw size={13} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredProducts.length > 0 && (
            <div className="p-4 border-t border-gray-100 bg-gray-50/30">
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(filteredProducts.length / pageSize) || 1}
                totalItems={filteredProducts.length}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
                onPageSizeChange={(newSize) => {
                  setPageSize(newSize);
                  setCurrentPage(1);
                }}
              />
            </div>
          )}
        </Card>
      )}

      {/* ── Tab 3: Categories & Subcategories Table ─────────────────────────── */}
      {activeTab === "categories" && (
        <Card className="p-0 overflow-hidden border border-gray-200/80 shadow-sm rounded-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/70 border-b border-gray-200/80 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                  <th className="py-3 px-4">Category Name</th>
                  <th className="py-3 px-4">Level</th>
                  <th className="py-3 px-4">Meta Title (SEO)</th>
                  <th className="py-3 px-4">Meta Description</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-400">
                      Loading categories SEO...
                    </td>
                  </tr>
                ) : paginatedCategories.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-400">
                      No categories found.
                    </td>
                  </tr>
                ) : (
                  paginatedCategories.map((cat) => {
                    const hasCustom =
                      !!cat.metaTitle?.trim() || !!cat.metaDescription?.trim();
                    const displayTitle = cat.metaTitle || cat.name;
                    const displayDesc = cat.metaDescription || cat.description || "";

                    return (
                      <tr key={cat.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-3 px-4 font-bold text-gray-900">
                          {cat.name}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              cat.isSubCategory
                                ? "bg-purple-50 text-purple-700 border border-purple-200"
                                : "bg-blue-50 text-blue-700 border border-blue-200"
                            }`}
                          >
                            {cat.isSubCategory ? "SubCategory" : "Main Category"}
                          </span>
                        </td>
                        <td className="py-3 px-4 max-w-xs truncate text-gray-800" title={displayTitle}>
                          {displayTitle}
                        </td>
                        <td className="py-3 px-4 max-w-sm truncate text-gray-500" title={displayDesc}>
                          {displayDesc}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {hasCustom ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                              <CheckCircle2 size={10} /> Custom
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-500 border border-gray-200">
                              Auto
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() =>
                                handleOpenEdit(
                                  "categories",
                                  cat.id,
                                  cat.name,
                                  `/products/${cat.slug || cat.id}`,
                                  cat.metaTitle || "",
                                  cat.metaDescription || "",
                                  cat.name,
                                  cat.description || ""
                                )
                              }
                              className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:text-black hover:border-gray-400 bg-white cursor-pointer transition-colors"
                              title="Edit SEO"
                            >
                              <Edit size={13} />
                            </button>
                            {hasCustom && (
                              <button
                                onClick={() =>
                                  handleResetOrClear(
                                    "categories",
                                    cat.id,
                                    cat.name,
                                    `/products/${cat.slug || cat.id}`
                                  )
                                }
                                className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 bg-white cursor-pointer transition-colors"
                                title="Clear Custom SEO"
                              >
                                <RotateCcw size={13} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredCategories.length > 0 && (
            <div className="p-4 border-t border-gray-100 bg-gray-50/30">
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(filteredCategories.length / pageSize) || 1}
                totalItems={filteredCategories.length}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
                onPageSizeChange={(newSize) => {
                  setPageSize(newSize);
                  setCurrentPage(1);
                }}
              />
            </div>
          )}
        </Card>
      )}

      {/* ── Tab 4: Blog Posts Table ─────────────────────────────────────────── */}
      {activeTab === "blogs" && (
        <Card className="p-0 overflow-hidden border border-gray-200/80 shadow-sm rounded-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/70 border-b border-gray-200/80 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                  <th className="py-3 px-4">Blog Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Meta Title (SEO)</th>
                  <th className="py-3 px-4">Meta Description</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-400">
                      Loading blogs SEO...
                    </td>
                  </tr>
                ) : paginatedBlogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-400">
                      No blog posts found.
                    </td>
                  </tr>
                ) : (
                  paginatedBlogs.map((blog) => {
                    const hasCustom =
                      !!blog.metaTitle?.trim() || !!blog.metaDescription?.trim();
                    const displayTitle = blog.metaTitle || blog.title;
                    const displayDesc = blog.metaDescription || blog.excerpt || "";

                    return (
                      <tr key={blog.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-3 px-4 font-bold text-gray-900">
                          {blog.title}
                        </td>
                        <td className="py-3 px-4 text-gray-500">
                          <span className="px-2 py-0.5 rounded-md text-[10px] bg-gray-100 text-gray-700">
                            {blog.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 max-w-xs truncate text-gray-800" title={displayTitle}>
                          {displayTitle}
                        </td>
                        <td className="py-3 px-4 max-w-sm truncate text-gray-500" title={displayDesc}>
                          {displayDesc}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {hasCustom ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                              <CheckCircle2 size={10} /> Custom
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-500 border border-gray-200">
                              Auto
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() =>
                                handleOpenEdit(
                                  "blogs",
                                  blog.id,
                                  blog.title,
                                  `/blog/${blog.id}`,
                                  blog.metaTitle || "",
                                  blog.metaDescription || "",
                                  blog.title,
                                  blog.excerpt || ""
                                )
                              }
                              className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:text-black hover:border-gray-400 bg-white cursor-pointer transition-colors"
                              title="Edit SEO"
                            >
                              <Edit size={13} />
                            </button>
                            {hasCustom && (
                              <button
                                onClick={() =>
                                  handleResetOrClear(
                                    "blogs",
                                    blog.id,
                                    blog.title,
                                    `/blog/${blog.id}`
                                  )
                                }
                                className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 bg-white cursor-pointer transition-colors"
                                title="Clear Custom SEO"
                              >
                                <RotateCcw size={13} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredBlogs.length > 0 && (
            <div className="p-4 border-t border-gray-100 bg-gray-50/30">
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(filteredBlogs.length / pageSize) || 1}
                totalItems={filteredBlogs.length}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
                onPageSizeChange={(newSize) => {
                  setPageSize(newSize);
                  setCurrentPage(1);
                }}
              />
            </div>
          )}
        </Card>
      )}

      {/* ── Edit SEO Modal with Google SERP Preview ────────────────────────── */}
      <AppModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Edit SEO: ${editingItem?.name || ""}`}
        size="lg"
      >
        {editingItem && (
          <form onSubmit={handleSaveSeo} className="space-y-5">
            {/* Google SERP Preview Card */}
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                  <Globe size={12} className="text-[#ed1c27]" /> Google Search Result
                  Preview
                </span>
                <span className="text-[10px] text-gray-400">Desktop / Mobile Snippet</span>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm space-y-1 font-sans">
                <div className="flex items-center gap-1.5 text-[11px] text-[#202124]">
                  <div className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center text-[9px] font-bold text-[#ed1c27]">
                    W
                  </div>
                  <span className="text-gray-700">westernofficesolutions.com</span>
                  <span className="text-gray-400">›</span>
                  <span className="text-gray-500 truncate max-w-[200px]">
                    {editingItem.pathOrUrl.replace(/^\//, "")}
                  </span>
                </div>
                <h4 className="text-[15px] font-medium text-[#1a0dab] hover:underline cursor-pointer leading-tight truncate">
                  {formTitle || editingItem.defaultTitle}
                </h4>
                <p className="text-[12px] text-[#4d5156] line-clamp-2 leading-relaxed">
                  {formDescription || editingItem.defaultDesc}
                </p>
              </div>
            </div>

            {/* Meta Title Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  Meta Title *
                </label>
                <span
                  className={`text-[10px] font-bold ${
                    formTitle.length > 60 ? "text-amber-500" : "text-gray-400"
                  }`}
                >
                  {formTitle.length} / 60 recommended
                </span>
              </div>
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder={editingItem.defaultTitle}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#ed1c27]/40 text-black shadow-sm"
              />
              <p className="text-[10px] text-gray-400">
                Recommended 50–60 characters. Leave empty to use system default:{" "}
                <em className="text-gray-600 not-italic font-medium">
                  {editingItem.defaultTitle}
                </em>
              </p>
            </div>

            {/* Meta Description Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  Meta Description *
                </label>
                <span
                  className={`text-[10px] font-bold ${
                    formDescription.length > 160 ? "text-amber-500" : "text-gray-400"
                  }`}
                >
                  {formDescription.length} / 160 recommended
                </span>
              </div>
              <textarea
                rows={3}
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder={editingItem.defaultDesc}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#ed1c27]/40 text-black shadow-sm resize-none"
              />
              <p className="text-[10px] text-gray-400">
                Recommended 150–160 characters. A concise summary for search engine
                snippets and social previews.
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => {
                  setFormTitle("");
                  setFormDescription("");
                }}
                className="text-xs text-red-500 hover:text-red-700 font-bold uppercase tracking-wider cursor-pointer"
              >
                Clear Custom Tags
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-bold uppercase tracking-wider text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-[#ed1c27] hover:bg-[#c5141e] text-white font-bold uppercase tracking-wider text-xs rounded-xl cursor-pointer shadow-lg shadow-[#ed1c27]/10 disabled:opacity-60 flex items-center gap-1.5"
                >
                  <Save size={13} />
                  {isSubmitting ? "Saving..." : "Save SEO"}
                </button>
              </div>
            </div>
          </form>
        )}
      </AppModal>
    </div>
  );
}
