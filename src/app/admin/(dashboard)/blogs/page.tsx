"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Plus, Filter, Edit, Trash2, X, Clock, Upload, AlertCircle } from "lucide-react";
import Image from "next/image";
import { Card, AppModal, useAppToast, AdminPageHeader, Pagination, SearchInput } from "@/components/ui";
import { AppRoutes } from "@/constants/routes";
import { apiAuthGetPaginated, apiPost, apiPut, apiDelete, buildQuery } from "@/lib/api";
import type { BlogPost, PaginationMeta } from "@/types/api";

export default function AdminBlogsPage() {
  const { addToast } = useAppToast();

  // Data state
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({ currentPage: 1, totalPages: 1, totalItems: 0, limit: 5 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formTitle, setFormTitle] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formExcerpt, setFormExcerpt] = useState("");
  const [formCategory, setFormCategory] = useState("Ergonomics");
  const [formImage, setFormImage] = useState("");
  const [formAuthor, setFormAuthor] = useState("Admin");
  const [formAuthorRole, setFormAuthorRole] = useState("Western Interio Admin");
  const [formTags, setFormTags] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formDate, setFormDate] = useState("");

  // Categories helper state
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  // ── Fetch blogs from API ─────────────────────────────────────────────────────
  const fetchBlogs = useCallback(async (page: number, limit: number, search: string, category: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const query = buildQuery({ page, limit, search, category });
      const res = await apiAuthGetPaginated<BlogPost>(`/api/blogs${query}`);
      setBlogs(res.data);
      setPagination(res.pagination);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load blogs";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch on mount and whenever filters change
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBlogs(currentPage, itemsPerPage, searchTerm, categoryFilter);
    }, 300);
    return () => clearTimeout(timer);
  }, [currentPage, itemsPerPage, searchTerm, categoryFilter, fetchBlogs]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter, itemsPerPage]);

  // Load all categories for dynamic selection
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await apiAuthGetPaginated<{ name: string }>("/api/categories?limit=100");
        if (res.data) {
          const cats = res.data.map((c) => c.name);
          setAllCategories(cats);
          if (cats.length > 0) {
            setFormCategory(cats[0]);
          }
        }
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };
    loadCategories();
  }, []);

  // ── Modal helpers ────────────────────────────────────────────────────────────
  const handleAddClick = () => {
    const todayStr = new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
    setEditingBlog(null);
    setFormTitle(""); setFormSlug(""); setFormExcerpt("");
    setFormCategory(allCategories[0] || ""); setFormImage(""); setFormAuthor("Admin");
    setFormAuthorRole("Western Interio Admin"); setFormTags("Workspace, Office, Design");
    setFormContent(""); setFormDate(todayStr);
    setIsNewCategory(false);
    setNewCategoryName("");
    setIsModalOpen(true);
  };

  const handleEditClick = (blog: BlogPost) => {
    setEditingBlog(blog);
    setFormTitle(blog.title); setFormSlug(blog.id); setFormExcerpt(blog.excerpt);
    setFormCategory(blog.category); setFormImage(blog.image); setFormAuthor(blog.author);
    setFormAuthorRole(blog.authorRole); setFormTags(blog.tags.join(", "));
    setFormContent(blog.content.join("\n\n")); setFormDate(blog.date);
    setIsNewCategory(false);
    setNewCategoryName("");
    setIsModalOpen(true);
  };

  // ── Delete ───────────────────────────────────────────────────────────────────
  const handleDeleteClick = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete the blog "${title}"?`)) return;
    try {
      await apiDelete(`/api/blogs/${id}`);
      addToast({ title: "Blog Deleted", message: `"${title}" has been deleted successfully.`, variant: "info" });
      fetchBlogs(currentPage, itemsPerPage, searchTerm, categoryFilter);
    } catch (err: unknown) {
      addToast({ title: "Error", message: err instanceof Error ? err.message : "Delete failed", variant: "error" });
    }
  };

  // ── Form submit ──────────────────────────────────────────────────────────────
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formExcerpt || !formContent) {
      addToast({ title: "Validation Error", message: "Please fill in all required fields (Title, Excerpt, Content).", variant: "error" });
      return;
    }

    const finalCategory = isNewCategory ? newCategoryName.trim() : formCategory;
    if (isNewCategory && !newCategoryName.trim()) {
      addToast({ title: "Validation Error", message: "Please specify the new category name.", variant: "error" });
      return;
    }

    const contentParagraphs = formContent.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
    const tagsArray = formTags.split(",").map(t => t.trim()).filter(Boolean);
    const defaultImage = "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop";

    const payload = {
      title: formTitle,
      excerpt: formExcerpt,
      category: finalCategory,
      image: formImage.trim() || defaultImage,
      author: formAuthor,
      authorRole: formAuthorRole,
      tags: tagsArray,
      content: contentParagraphs,
      date: formDate,
    };

    setIsSubmitting(true);
    try {
      if (editingBlog) {
        await apiPut(`/api/blogs/${editingBlog.id}`, payload);
        addToast({ title: "Blog Updated", message: `"${formTitle}" has been updated successfully.`, variant: "success" });
      } else {
        await apiPost("/api/blogs", payload);
        addToast({ title: "Blog Created", message: `"${formTitle}" was successfully published.`, variant: "success" });
      }
      setIsModalOpen(false);
      setAllCategories(prev => Array.from(new Set([...prev, finalCategory])));
      fetchBlogs(currentPage, itemsPerPage, searchTerm, categoryFilter);
    } catch (err: unknown) {
      addToast({ title: "Error", message: err instanceof Error ? err.message : "Operation failed", variant: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Blogs"
        breadcrumbs={[
          { label: "Admin", href: AppRoutes.Admin.Dashboard },
          { label: "Blogs" },
        ]}
      />

      <Card className="!overflow-visible">
        <Card.Header>
          <SearchInput
            placeholder="Search blogs by title, excerpt or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            wrapperClassName="max-w-sm"
          />

          <div className="flex items-center gap-3">
            {/* Category Filter */}
            <div className="relative">
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-[10px] font-bold uppercase tracking-widest text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <Filter size={12} /> Filters
                {categoryFilter && <span className="w-1.5 h-1.5 rounded-full bg-[#ed1c27]" />}
              </button>

              {showFilterDropdown && (
                <div className="absolute right-0 top-12 z-50 bg-white border border-gray-100 rounded-xl shadow-xl p-4 w-60 space-y-3 text-left">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                    <span className="text-[10px] font-bold uppercase text-gray-400">Filters</span>
                    <button onClick={() => setShowFilterDropdown(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                      <X size={14} />
                    </button>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-gray-400">Category</label>
                    <select
                      value={categoryFilter}
                      onChange={(e) => { setCategoryFilter(e.target.value); setShowFilterDropdown(false); }}
                      className="w-full text-xs font-semibold bg-gray-50 border border-gray-200 rounded-lg p-2 focus:outline-none cursor-pointer"
                    >
                      <option value="">All Categories</option>
                      {allCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                  {categoryFilter && (
                    <button
                      onClick={() => { setCategoryFilter(""); setShowFilterDropdown(false); }}
                      className="text-[9px] font-bold text-[#ed1c27] uppercase tracking-widest cursor-pointer"
                    >
                      Clear Filter
                    </button>
                  )}
                </div>
              )}
            </div>

            <button
              id="add-blog-btn"
              onClick={handleAddClick}
              className="inline-flex items-center justify-center gap-2 bg-[#ed1c27] hover:bg-[#c5141e] text-white font-bold uppercase tracking-[0.12em] text-[10px] rounded-xl px-5 py-2 transition-all duration-300 cursor-pointer hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#ed1c27]/25"
            >
              <Plus size={14} /> Add Blog
            </button>
          </div>
        </Card.Header>

        <Card.Body noPadding>
          {/* Error state */}
          {error && (
            <div className="flex items-center gap-3 p-6 text-red-600 bg-red-50 border-b border-red-100">
              <AlertCircle size={18} />
              <p className="text-sm font-semibold">{error}</p>
              <button onClick={() => fetchBlogs(currentPage, itemsPerPage, searchTerm, categoryFilter)} className="ml-auto text-xs underline cursor-pointer">Retry</button>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-400 w-24">Image</th>
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">Blog Title &amp; Slug</th>
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">Category &amp; Tags</th>
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">Author</th>
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">Date &amp; Read Time</th>
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoading ? (
                  Array.from({ length: itemsPerPage }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="py-3 px-6"><div className="w-16 h-10 rounded-lg bg-gray-100" /></td>
                      <td className="py-3 px-6"><div className="h-3 bg-gray-100 rounded w-40 mb-1" /><div className="h-2 bg-gray-100 rounded w-24" /></td>
                      <td className="py-3 px-6"><div className="h-3 bg-gray-100 rounded w-24" /></td>
                      <td className="py-3 px-6"><div className="h-3 bg-gray-100 rounded w-20" /></td>
                      <td className="py-3 px-6"><div className="h-3 bg-gray-100 rounded w-20" /></td>
                      <td className="py-3 px-6" />
                    </tr>
                  ))
                ) : blogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">No blog posts found</p>
                      <p className="text-[11px] text-gray-400 mt-1">
                        {searchTerm || categoryFilter ? "Try adjusting your search or filters." : "Add your first blog post to get started."}
                      </p>
                    </td>
                  </tr>
                ) : (
                  blogs.map(blog => (
                    <tr key={blog.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="py-3 px-6">
                        <div className="w-16 h-10 rounded-lg bg-gray-100 overflow-hidden relative border border-gray-100">
                          <Image src={blog.image} alt={blog.title} fill className="object-cover" />
                        </div>
                      </td>
                      <td className="py-3 px-6">
                        <p className="text-xs font-semibold text-gray-900 line-clamp-1">{blog.title}</p>
                        <p className="text-[9px] text-gray-400 font-medium mt-0.5">{blog.id}</p>
                      </td>
                      <td className="py-3 px-6">
                        <p className="text-xs font-semibold text-gray-700">{blog.category}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {blog.tags.slice(0, 3).map(t => (
                            <span key={t} className="px-1.5 py-0.5 rounded bg-gray-50 border border-gray-100 text-[8px] font-bold text-gray-400 uppercase">#{t}</span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-6">
                        <p className="text-xs font-semibold text-gray-900">{blog.author}</p>
                        <p className="text-[9px] text-gray-400 mt-0.5">{blog.authorRole}</p>
                      </td>
                      <td className="py-3 px-6">
                        <p className="text-xs font-semibold text-gray-700">{blog.date}</p>
                        <p className="text-[9px] text-gray-400 font-medium mt-0.5 flex items-center gap-1">
                          <Clock size={10} className="text-[#ed1c27]" /> {blog.readTime}
                        </p>
                      </td>
                      <td className="py-3 px-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleEditClick(blog)} className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer" title="Edit Blog">
                            <Edit size={14} />
                          </button>
                          <button onClick={() => handleDeleteClick(blog.id, blog.title)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer" title="Delete Blog">
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
            onPageSizeChange={(size) => { setItemsPerPage(size); setCurrentPage(1); }}
            totalItems={pagination.totalItems}
            pageSizeOptions={[5, 10, 20, 50]}
          />
        </Card.Footer>
      </Card>

      {/* Add/Edit Modal */}
      <AppModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingBlog ? "Edit Blog Post" : "Add New Blog Post"}
        size="lg"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4 px-1">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Blog Title *</label>
            <input type="text" required value={formTitle} onChange={e => setFormTitle(e.target.value)} placeholder="e.g. 5 Trends in Corporate Workspaces" className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#ed1c27]/40" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Custom URL Slug (Optional)</label>
              <input type="text" value={formSlug} onChange={e => setFormSlug(e.target.value)} placeholder="e.g. corporate-workspace-trends" className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#ed1c27]/40" />
              <p className="text-[8px] text-gray-400 mt-0.5">Leave blank to auto-generate from title.</p>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Category *</label>
              {!isNewCategory ? (
                <select
                  value={formCategory}
                  onChange={(e) => {
                    if (e.target.value === "__NEW__") {
                      setIsNewCategory(true);
                    } else {
                      setFormCategory(e.target.value);
                    }
                  }}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#ed1c27]/40 cursor-pointer"
                >
                  {allCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                  <option value="__NEW__" className="text-[#ed1c27] font-bold">
                    + Add New Category
                  </option>
                </select>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="e.g. Wellness"
                    className="flex-1 px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#ed1c27]/40"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setIsNewCategory(false);
                      setNewCategoryName("");
                    }}
                    className="px-3 py-2 border border-gray-200 text-gray-400 hover:text-gray-600 rounded-xl text-[10px] font-bold uppercase tracking-wider bg-gray-50 cursor-pointer"
                  >
                    Select Existing
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Author Name *</label>
              <input type="text" required value={formAuthor} onChange={e => setFormAuthor(e.target.value)} className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#ed1c27]/40" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Author Role *</label>
              <input type="text" required value={formAuthorRole} onChange={e => setFormAuthorRole(e.target.value)} className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#ed1c27]/40" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Tags (Comma-separated)</label>
            <input type="text" value={formTags} onChange={e => setFormTags(e.target.value)} placeholder="e.g. Ergonomics, Posture, Office" className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#ed1c27]/40" />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Excerpt / Short Description *</label>
            <textarea required rows={2} value={formExcerpt} onChange={e => setFormExcerpt(e.target.value)} placeholder="Brief description displaying on the listing page..." className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#ed1c27]/40 resize-none" />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Article Content *</label>
            <textarea required rows={8} value={formContent} onChange={e => setFormContent(e.target.value)} placeholder="Write the article content. Separate paragraphs with double newlines." className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#ed1c27]/40 resize-y" />
          </div>

          {/* Featured Image Upload */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Featured Image</label>
            <div className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-2 bg-gray-50/50 relative group cursor-pointer transition-all duration-300 min-h-[140px] ${!formImage ? "border-gray-200 hover:border-[#ed1c27]/40" : "border-emerald-200 hover:border-emerald-400"}`}>
              {formImage ? (
                <div className="relative w-full h-32 rounded-lg overflow-hidden border border-gray-150">
                  <Image src={formImage} alt="Featured Blog Image" fill className="object-cover" />
                  <button type="button" onClick={e => { e.stopPropagation(); setFormImage(""); }} className="absolute top-2 right-2 bg-black/60 hover:bg-red-600 text-white rounded-full p-1.5 transition-colors z-10" title="Remove image">
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-gray-300 group-hover:text-[#ed1c27] transition-colors duration-300" />
                  <span className="text-xs text-gray-500 font-bold uppercase tracking-wider text-center">Upload Featured Image</span>
                  <span className="text-[9px] text-gray-400 font-semibold uppercase tracking-widest text-center">Click or drag — PNG, JPG or WEBP (Max 100KB)</span>
                </>
              )}
              <input
                id="blog-image-upload"
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                disabled={!!formImage}
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  if (file.size > 102400) {
                    addToast({ title: "File Too Large", message: "Image size must not exceed 100KB.", variant: "error" });
                    return;
                  }
                  const reader = new FileReader();
                  reader.onloadend = () => { if (typeof reader.result === "string") setFormImage(reader.result); };
                  reader.readAsDataURL(file);
                }}
              />
            </div>
            <p className="text-[9px] text-gray-400 font-semibold uppercase tracking-widest">
              {formImage ? "Image uploaded. Click X to remove." : "Optional — a default image will be used if not provided."}
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-bold uppercase tracking-wider text-gray-500 hover:bg-gray-50 cursor-pointer">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="px-5 py-2 bg-[#ed1c27] hover:bg-[#c5141e] text-white font-bold uppercase tracking-wider text-xs rounded-xl cursor-pointer shadow-lg shadow-[#ed1c27]/10 disabled:opacity-60">
              {isSubmitting ? "Saving..." : editingBlog ? "Save Changes" : "Publish Blog"}
            </button>
          </div>
        </form>
      </AppModal>
    </div>
  );
}
