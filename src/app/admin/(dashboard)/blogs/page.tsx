"use client";

import React, { useState, useEffect } from "react";
import { Plus, Filter, Edit, Trash2, X, Clock, Upload } from "lucide-react";
import Image from "next/image";
import { Card, AppModal, useAppToast, AdminPageHeader, Pagination, SearchInput } from "@/components/ui";
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
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Reset page when filters change
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
    }, 0);
    return () => clearTimeout(timer);
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

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("bdm_blogs");
      const timer = setTimeout(() => {
        if (stored) {
          try {
            setBlogs(JSON.parse(stored));
          } catch {
            setBlogs(initialBlogsData as BlogPost[]);
          }
        } else {
          setBlogs(initialBlogsData as BlogPost[]);
          localStorage.setItem("bdm_blogs", JSON.stringify(initialBlogsData));
        }
      }, 0);
      return () => clearTimeout(timer);
    }
  }, []);

  // Save helper
  const saveBlogs = (updatedList: BlogPost[]) => {
    setBlogs(updatedList);
    localStorage.setItem("bdm_blogs", JSON.stringify(updatedList));
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

  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);
  const paginatedBlogs = filteredBlogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
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
          {/* Left: Search input */}
          <SearchInput
            placeholder="Search blogs by title, excerpt or ID..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            wrapperClassName="max-w-sm"
          />

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            {/* Category Filter */}
            <div className="relative">
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-[10px] font-bold uppercase tracking-widest text-gray-600 hover:bg-gray-55 transition-colors cursor-pointer"
              >
                <Filter size={12} /> Filters
              </button>

              {showFilterDropdown && (
                <div className="absolute right-0 top-12 z-50 bg-white border border-gray-100 rounded-xl shadow-xl p-4 w-60 space-y-3 text-left">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                     <span className="text-[10px] font-bold uppercase text-gray-400">Filters</span>
                     <button onClick={() => setShowFilterDropdown(false)} className="text-gray-400 hover:text-gray-650 cursor-pointer">
                       <X size={14} />
                     </button>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-gray-400">Category</label>
                    <select
                      value={categoryFilter}
                      onChange={(e) => {
                        setCategoryFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full text-xs font-semibold bg-gray-50 border border-gray-200 rounded-lg p-2 focus:outline-none cursor-pointer"
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
              id="add-blog-btn"
              onClick={handleAddClick}
              className="inline-flex items-center justify-center gap-2 bg-[#ed1c27] hover:bg-[#c5141e] text-white font-bold uppercase tracking-[0.12em] text-[10px] rounded-xl px-5 py-2 transition-all duration-300 cursor-pointer hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#ed1c27]/25"
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
            totalItems={filteredBlogs.length}
            pageSizeOptions={[5, 10, 20, 50]}
          />
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

          {/* Featured Image Upload */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Featured Image *</label>

            {/* Dropzone */}
            <div className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-2 bg-gray-50/50 relative group cursor-pointer transition-all duration-300 min-h-[140px] ${
              !formImage ? "border-gray-200 hover:border-[#ed1c27]/40" : "border-emerald-200 hover:border-emerald-400"
            }`}>
              {formImage ? (
                <div className="relative w-full h-32 rounded-lg overflow-hidden border border-gray-150">
                  <Image src={formImage} alt="Featured Blog Image" fill className="object-cover" />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFormImage("");
                    }}
                    className="absolute top-2 right-2 bg-black/60 hover:bg-red-600 text-white rounded-full p-1.5 transition-colors z-10"
                    title="Remove image"
                  >
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-gray-300 group-hover:text-[#ed1c27] transition-colors duration-300" />
                  <span className="text-xs text-gray-500 font-bold uppercase tracking-wider text-center">
                    Upload Featured Image
                  </span>
                  <span className="text-[9px] text-gray-400 font-semibold uppercase tracking-widest text-center">
                    Click or drag — PNG, JPG or WEBP (Max 2MB)
                  </span>
                </>
              )}
              <input
                id="blog-image-upload"
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                disabled={!!formImage}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  if (file.size > 2 * 1024 * 1024) {
                    addToast({
                      title: "File Too Large",
                      message: "Please choose an image smaller than 2 MB.",
                      variant: "warning",
                    });
                    return;
                  }
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    if (typeof reader.result === "string") {
                      setFormImage(reader.result);
                    }
                  };
                  reader.readAsDataURL(file);
                }}
              />
            </div>
            <p className="text-[9px] text-gray-450 font-semibold uppercase tracking-widest">
              {formImage ? "Featured image uploaded. Click the X button to remove." : "Required — select a featured image."}
            </p>
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
