"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search, Filter, Edit, Trash2, X, FileText, Calendar, Clock, User, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { Card, AppModal, useAppToast, AdminPageHeader } from "@/components/ui";
import { Pagination } from "@/components/ui/Pagination";
import { AppRoutes } from "@/constants/routes";
import initialBlogsData from "@/data/blogs.json";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  author: string;
  authorRole: string;
  tags: string[];
  content: string[];
}

export default function AdminBlogsPage() {
  const { addToast } = useAppToast();

  // State
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);

  // Form State
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

  // Load from sessionStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("bdm_blogs");
      if (stored) {
        try {
          setBlogs(JSON.parse(stored));
        } catch {
          setBlogs(initialBlogsData as BlogPost[]);
        }
      } else {
        setBlogs(initialBlogsData as BlogPost[]);
        sessionStorage.setItem("bdm_blogs", JSON.stringify(initialBlogsData));
      }
    }
  }, []);

  // Save helper
  const saveBlogs = (updatedList: BlogPost[]) => {
    setBlogs(updatedList);
    sessionStorage.setItem("bdm_blogs", JSON.stringify(updatedList));
    window.dispatchEvent(new Event("bdm-blogs-updated"));
  };

  // Open Modal for Create
  const handleAddClick = () => {
    const todayStr = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });

    setEditingBlog(null);
    setFormTitle("");
    setFormSlug("");
    setFormExcerpt("");
    setFormCategory("Ergonomics");
    setFormImage("");
    setFormAuthor("Admin");
    setFormAuthorRole("Western Interio Admin");
    setFormTags("Workspace, Office, Design");
    setFormContent("");
    setFormDate(todayStr);
    setIsModalOpen(true);
  };

  // Open Modal for Edit
  const handleEditClick = (blog: BlogPost) => {
    setEditingBlog(blog);
    setFormTitle(blog.title);
    setFormSlug(blog.id);
    setFormExcerpt(blog.excerpt);
    setFormCategory(blog.category);
    setFormImage(blog.image);
    setFormAuthor(blog.author);
    setFormAuthorRole(blog.authorRole);
    setFormTags(blog.tags.join(", "));
    setFormContent(blog.content.join("\n\n"));
    setFormDate(blog.date);
    setIsModalOpen(true);
  };

  // Handle Delete
  const handleDeleteClick = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete the blog "${title}"?`)) {
      const updated = blogs.filter((b) => b.id !== id);
      saveBlogs(updated);
      addToast({
        title: "Blog Deleted",
        message: `"${title}" has been deleted successfully.`,
        variant: "info",
      });
    }
  };

  // Handle Form Submit
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formTitle || !formExcerpt || !formContent) {
      addToast({
        title: "Validation Error",
        message: "Please fill in all required fields (Title, Excerpt, Content).",
        variant: "error",
      });
      return;
    }

    // Auto-generate slug if blank
    let slug = formSlug.trim();
    if (!slug) {
      slug = formTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }

    // Ensure slug uniqueness
    const slugClash = blogs.some((b) => b.id === slug && (!editingBlog || editingBlog.id !== b.id));
    if (slugClash) {
      slug = `${slug}-${Math.floor(Math.random() * 1000)}`;
    }

    // Parse content paragraphs
    const contentParagraphs = formContent
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean);

    // Estimate read time
    const totalWords = formContent.split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(totalWords / 200));
    const estimatedReadTime = `${minutes} Min Read`;

    // Parse tags
    const tagsArray = formTags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const defaultImage = "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop";
    const imageUrl = formImage.trim() || defaultImage;

    if (editingBlog) {
      // Edit Mode
      const updated = blogs.map((b) => {
        if (b.id === editingBlog.id) {
          return {
            ...b,
            id: slug, // Update ID/slug
            title: formTitle,
            excerpt: formExcerpt,
            category: formCategory,
            date: formDate,
            readTime: estimatedReadTime,
            image: imageUrl,
            author: formAuthor,
            authorRole: formAuthorRole,
            tags: tagsArray,
            content: contentParagraphs,
          };
        }
        return b;
      });
      saveBlogs(updated);
      addToast({
        title: "Blog Updated",
        message: `"${formTitle}" has been updated successfully.`,
        variant: "success",
      });
    } else {
      // Create Mode
      const newBlog: BlogPost = {
        id: slug,
        title: formTitle,
        excerpt: formExcerpt,
        category: formCategory,
        date: formDate,
        readTime: estimatedReadTime,
        image: imageUrl,
        author: formAuthor,
        authorRole: formAuthorRole,
        tags: tagsArray,
        content: contentParagraphs,
      };
      const updated = [newBlog, ...blogs];
      saveBlogs(updated);
      addToast({
        title: "Blog Created",
        message: `"${formTitle}" was successfully published.`,
        variant: "success",
      });
    }

    setIsModalOpen(false);
  };

  // Filter blogs based on search and category
  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === "All" || blog.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredBlogs.length / ITEMS_PER_PAGE);
  const paginatedBlogs = filteredBlogs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Unique categories for filtering
  const categoriesList = ["All", ...Array.from(new Set(blogs.map((b) => b.category)))];

  return (
    <div className="space-y-6">
      {/* Admin Page Header with Breadcrumb */}
      <AdminPageHeader
        title="Blogs"
        breadcrumbs={[
          { label: "Admin", href: AppRoutes.Admin.Dashboard },
          { label: "Blogs" },
        ]}
      />

      {/* Data Table Card */}
      <Card className="!overflow-visible">
        <Card.Header>
          <div className="flex items-center gap-3 w-full">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search blogs by title, excerpt or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-medium focus:outline-none focus:border-[#ed1c27]/30 transition-colors"
              />
            </div>

            {/* Category Filter */}
            <div className="relative flex-shrink-0">
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-xs font-bold uppercase tracking-widest text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <Filter size={12} /> Filters
              </button>

              {showFilterDropdown && (
                <div className="absolute right-0 top-12 z-50 bg-white border border-gray-100 rounded-xl shadow-xl p-4 w-60 space-y-3">
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
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="w-full text-xs font-semibold bg-gray-50 border border-gray-200 rounded-lg p-2 focus:outline-none"
                    >
                      {categoriesList.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Add Blog Button */}
            <button
              onClick={handleAddClick}
              className="flex-shrink-0 inline-flex items-center justify-center gap-2 bg-[#ed1c27] hover:bg-[#c5141e] text-white font-bold uppercase tracking-[0.12em] text-[10px] rounded-xl px-5 py-2.5 transition-all duration-300 cursor-pointer hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#ed1c27]/25"
            >
              <Plus size={14} /> Add Blog
            </button>
          </div>
        </Card.Header>

        <Card.Body noPadding>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-400 w-24">Image</th>
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">Blog Title & Slug</th>
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">Category & Tags</th>
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">Author</th>
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">Date & Read Time</th>
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginatedBlogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-xs font-medium text-gray-400">
                      No blog posts found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  paginatedBlogs.map((blog) => (
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
                          {blog.tags.slice(0, 3).map((t) => (
                            <span key={t} className="px-1.5 py-0.5 rounded bg-gray-50 border border-gray-100 text-[8px] font-bold text-gray-450 uppercase">
                              #{t}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-6">
                        <p className="text-xs font-semibold text-gray-900">{blog.author}</p>
                        <p className="text-[9px] text-gray-450 mt-0.5">{blog.authorRole}</p>
                      </td>
                      <td className="py-3 px-6">
                        <p className="text-xs font-semibold text-gray-700">{blog.date}</p>
                        <p className="text-[9px] text-gray-400 font-medium mt-0.5 flex items-center gap-1">
                          <Clock size={10} className="text-[#ed1c27]" /> {blog.readTime}
                        </p>
                      </td>
                      <td className="py-3 px-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEditClick(blog)}
                            className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit Blog"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(blog.id, blog.title)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Blog"
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
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500 font-medium">
              Showing {filteredBlogs.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0}-
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredBlogs.length)} of {filteredBlogs.length} blogs
              {searchTerm || categoryFilter !== "All" ? ` (filtered from ${blogs.length} total)` : ""}
            </p>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              className="pt-0 border-t-0 mt-0 flex-wrap shrink-0 py-1"
            />
          </div>
        </Card.Footer>
      </Card>

      {/* App Modal for Add/Edit */}
      <AppModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingBlog ? "Edit Blog Post" : "Add New Blog Post"}
        size="lg"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto px-1">
          {/* Title */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Blog Title *</label>
            <input
              type="text"
              required
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="e.g. 5 Trends in Corporate Workspaces"
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#ed1c27]/40"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Custom Slug */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Custom URL Slug (Optional)</label>
              <input
                type="text"
                value={formSlug}
                onChange={(e) => setFormSlug(e.target.value)}
                placeholder="e.g. corporate-workspace-trends"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#ed1c27]/40"
              />
              <p className="text-[8px] text-gray-450 mt-0.5">Leave blank to auto-generate from title.</p>
            </div>

            {/* Category */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Category *</label>
              <input
                type="text"
                required
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                placeholder="e.g. Office Trends"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#ed1c27]/40"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Author */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Author Name *</label>
              <input
                type="text"
                required
                value={formAuthor}
                onChange={(e) => setFormAuthor(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#ed1c27]/40"
              />
            </div>

            {/* Author Role */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Author Role *</label>
              <input
                type="text"
                required
                value={formAuthorRole}
                onChange={(e) => setFormAuthorRole(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#ed1c27]/40"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Date */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Publish Date *</label>
              <input
                type="text"
                required
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#ed1c27]/40"
              />
            </div>

            {/* Tags */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Tags (Comma-separated)</label>
              <input
                type="text"
                value={formTags}
                onChange={(e) => setFormTags(e.target.value)}
                placeholder="e.g. Ergonomics, Posture, Office"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#ed1c27]/40"
              />
            </div>
          </div>

          {/* Excerpt */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Excerpt / Short Description *</label>
            <textarea
              required
              rows={2}
              value={formExcerpt}
              onChange={(e) => setFormExcerpt(e.target.value)}
              placeholder="Brief description displaying on the listing page (1-2 sentences)..."
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#ed1c27]/40 resize-none"
            />
          </div>

          {/* Content */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Article Content *</label>
            <textarea
              required
              rows={8}
              value={formContent}
              onChange={(e) => setFormContent(e.target.value)}
              placeholder="Write the article content. Separate different paragraphs with double newlines (Press Enter twice)."
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#ed1c27]/40 resize-y"
            />
          </div>

          {/* Image URL */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Featured Image URL</label>
            <input
              type="text"
              value={formImage}
              onChange={(e) => setFormImage(e.target.value)}
              placeholder="e.g. https://images.unsplash.com/photo-1524758631624-e2822e304c36..."
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#ed1c27]/40"
            />
            <p className="text-[8px] text-gray-450 mt-0.5">Leave blank to use a default high-quality office space image.</p>
          </div>

          {/* Form Actions */}
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
              {editingBlog ? "Save Changes" : "Publish Blog"}
            </button>
          </div>
        </form>
      </AppModal>
    </div>
  );
}
