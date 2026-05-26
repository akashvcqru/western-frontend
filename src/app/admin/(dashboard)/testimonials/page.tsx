"use client";

import React, { useState, useEffect } from "react";
import { Edit, Trash2, AlertCircle, MessageSquare, Star, Plus } from "lucide-react";
import { Card, AppModal, useAppToast, AdminPageHeader, Pagination, SearchInput, RHFControl } from "@/components/ui";
import { AppRoutes } from "@/constants/routes";
import { useForm, FormProvider, Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  useGetAdminTestimonialsQuery,
  useCreateAdminTestimonialMutation,
  useUpdateTestimonialMutation,
  useDeleteTestimonialMutation,
} from "@/redux/api/testimonialsApi";
import { useGetCategoriesQuery } from "@/redux/api/categoriesApi";
import type { Testimonial } from "@/types/api";

const testimonialValidationSchema = yup.object().shape({
  author: yup.string().required("Client name is required").min(3, "Must be at least 3 characters"),
  designation: yup.string().required("Job title is required"),
  company: yup.string().required("Company name is required"),
  category: yup.string().required("Category is required"),
  quote: yup.string().required("Review text is required").min(10, "Must be at least 10 characters"),
  status: yup.string().required("Status is required"),
});

type TestimonialFormData = yup.InferType<typeof testimonialValidationSchema>;

export default function AdminTestimonialsPage() {
  const { addToast } = useAppToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const {
    data: testimonialsData,
    isLoading: isFetching,
    error: fetchError,
    refetch,
  } = useGetAdminTestimonialsQuery({
    page: currentPage,
    limit: itemsPerPage,
    search: debouncedSearch,
  });

  const { data: categoriesData } = useGetCategoriesQuery({ limit: 100 });

  const [updateTestimonial, { isLoading: isUpdating }] = useUpdateTestimonialMutation();
  const [createAdminTestimonial, { isLoading: isCreating }] = useCreateAdminTestimonialMutation();
  const [deleteTestimonial] = useDeleteTestimonialMutation();

  const isSubmitting = isUpdating || isCreating;

  const testimonials = testimonialsData?.data || [];
  const pagination = testimonialsData?.pagination || {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: itemsPerPage,
  };

  const categoryOptions = React.useMemo(() => {
    const list = [{ label: "Select Category", value: "" }];
    (categoriesData?.data || []).forEach((c) => {
      list.push({ label: c.name, value: c.slug || c.id });
    });
    return list;
  }, [categoriesData]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [selectedRating, setSelectedRating] = useState(5);

  const methods = useForm<TestimonialFormData>({
    resolver: yupResolver(testimonialValidationSchema) as Resolver<TestimonialFormData>,
    defaultValues: {
      author: "",
      designation: "",
      company: "",
      category: "",
      quote: "",
      status: "Active",
    },
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, itemsPerPage]);

  useEffect(() => {
    if (isModalOpen && editingTestimonial) {
      methods.reset({
        author: editingTestimonial.author,
        designation: editingTestimonial.designation,
        company: editingTestimonial.company,
        category: editingTestimonial.category,
        quote: editingTestimonial.quote,
        status: editingTestimonial.status,
      });
      setSelectedRating(editingTestimonial.rating);
    } else {
      methods.reset({
        author: "",
        designation: "",
        company: "",
        category: "",
        quote: "",
        status: "Active",
      });
      setSelectedRating(5);
    }
  }, [isModalOpen, editingTestimonial, methods]);

  const handleEditClick = (t: Testimonial) => {
    setEditingTestimonial(t);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (id: string, author: string) => {
    if (!confirm(`Are you sure you want to delete the review by "${author}"?`)) return;
    try {
      await deleteTestimonial(id).unwrap();
      addToast({ title: "Review Deleted", message: `Review by "${author}" has been deleted.`, variant: "info" });
    } catch (err) {
      const errMsg = (err as { data?: { message?: string } })?.data?.message || "Delete failed";
      addToast({ title: "Error", message: errMsg, variant: "error" });
    }
  };

  const handleStatusToggle = async (t: Testimonial) => {
    const nextStatus = t.status === "Active" ? "Inactive" : "Active";
    try {
      await updateTestimonial({
        id: t.id,
        body: { status: nextStatus },
      }).unwrap();
      addToast({ title: "Status Updated", message: `Status is now ${nextStatus}.`, variant: "success" });
    } catch (err) {
      const errMsg = (err as { data?: { message?: string } })?.data?.message || "Update failed";
      addToast({ title: "Error", message: errMsg, variant: "error" });
    }
  };

  const handleFormSubmit = async (data: TestimonialFormData) => {
    try {
      if (editingTestimonial) {
        await updateTestimonial({
          id: editingTestimonial.id,
          body: {
            author: data.author,
            designation: data.designation,
            company: data.company,
            quote: data.quote,
            rating: selectedRating,
            category: data.category,
            status: data.status,
          },
        }).unwrap();
        addToast({ title: "Review Updated", message: "Review was updated successfully.", variant: "success" });
      } else {
        await createAdminTestimonial({
          author: data.author,
          designation: data.designation,
          company: data.company,
          quote: data.quote,
          rating: selectedRating,
          category: data.category,
          status: data.status,
        }).unwrap();
        addToast({ title: "Review Created", message: "Review was created successfully.", variant: "success" });
      }
      setIsModalOpen(false);
    } catch (err) {
      const errMsg = (err as { data?: { message?: string } })?.data?.message || "Operation failed";
      addToast({ title: "Error", message: errMsg, variant: "error" });
    }
  };

  const error = fetchError
    ? (fetchError as { data?: { message?: string } })?.data?.message || "Failed to load testimonials"
    : null;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Testimonials"
        breadcrumbs={[
          { label: "Admin", href: AppRoutes.Admin.Dashboard },
          { label: "Testimonials" },
        ]}
      />

      <Card>
        <Card.Header>
          <SearchInput
            placeholder="Search reviews by name, company, or quote..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            wrapperClassName="max-w-sm"
          />
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setEditingTestimonial(null);
                setIsModalOpen(true);
              }}
              className="inline-flex items-center justify-center gap-2 bg-[#ed1c27] hover:bg-[#c5141e] text-white font-bold uppercase tracking-[0.12em] text-[10px] rounded-xl px-5 py-2 transition-all duration-300 cursor-pointer hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#ed1c27]/25"
            >
              <Plus size={14} /> Add Testimonial
            </button>
          </div>
        </Card.Header>

        <Card.Body noPadding>
          {error && (
            <div className="flex items-center gap-3 p-6 text-red-600 bg-red-50 border-b border-red-100">
              <AlertCircle size={18} />
              <p className="text-sm font-semibold">{error}</p>
              <button onClick={() => refetch()} className="ml-auto text-xs underline cursor-pointer">
                Retry
              </button>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">Client Details</th>
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">Category</th>
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">Rating</th>
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-400 w-96">Feedback (Quote)</th>
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</th>
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isFetching ? (
                  Array.from({ length: itemsPerPage }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="py-4 px-6">
                        <div className="h-3 bg-gray-100 rounded w-24 mb-1" />
                        <div className="h-2 bg-gray-100 rounded w-16" />
                      </td>
                      <td className="py-4 px-6"><div className="h-3 bg-gray-100 rounded w-16" /></td>
                      <td className="py-4 px-6"><div className="h-3 bg-gray-100 rounded w-12" /></td>
                      <td className="py-4 px-6"><div className="h-3 bg-gray-100 rounded w-full" /></td>
                      <td className="py-4 px-6"><div className="h-5 bg-gray-100 rounded w-14" /></td>
                      <td className="py-4 px-6" />
                    </tr>
                  ))
                ) : testimonials.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center">
                      <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">No reviews found</p>
                      <p className="text-[11px] text-gray-400 mt-1">
                        {searchTerm ? "Try adjusting your search query." : "Client review submissions will appear here."}
                      </p>
                    </td>
                  </tr>
                ) : (
                  testimonials.map((t) => {
                    const catObj = (categoriesData?.data || []).find((c) => c.slug === t.category || c.id === t.category);
                    const categoryLabel = catObj ? catObj.name : t.category;
                    return (
                      <tr key={t.id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="py-4 px-6">
                          <p className="text-xs font-bold text-gray-900">{t.author}</p>
                          <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                            {t.designation} at <span className="font-bold text-gray-500">{t.company}</span>
                          </p>
                        </td>
                        <td className="py-4 px-6">
                          <span className="px-2.5 py-0.5 bg-neutral-100 text-neutral-600 rounded-md text-[9px] font-bold uppercase tracking-widest">
                            {categoryLabel}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-0.5 text-primary">
                            {[...Array(5)].map((_, starIdx) => (
                              <Star
                                key={starIdx}
                                size={12}
                                fill={starIdx < t.rating ? "currentColor" : "none"}
                                className={starIdx < t.rating ? "" : "text-neutral-200"}
                                strokeWidth={starIdx < t.rating ? 0 : 1.5}
                              />
                            ))}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <p className="text-xs text-gray-600 font-medium leading-relaxed italic line-clamp-3">
                            &ldquo;{t.quote}&rdquo;
                          </p>
                        </td>
                        <td className="py-4 px-6">
                          <button
                            onClick={() => handleStatusToggle(t)}
                            className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest cursor-pointer transition-all duration-300 ${
                              t.status === "Active"
                                ? "bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100"
                                : t.status === "Pending"
                                ? "bg-amber-50 text-amber-650 border border-amber-200 hover:bg-amber-100"
                                : "bg-neutral-50 text-neutral-400 border border-neutral-200 hover:bg-neutral-100"
                            }`}
                            title="Click to toggle status"
                          >
                            {t.status}
                          </button>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleEditClick(t)}
                              className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                              title="Edit Testimonial"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(t.id, t.author)}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete Testimonial"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
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
            onPageSizeChange={(size) => {
              setItemsPerPage(size);
              setCurrentPage(1);
            }}
            totalItems={pagination.totalItems}
            pageSizeOptions={[5, 10, 20, 50]}
          />
        </Card.Footer>
      </Card>

      <AppModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTestimonial ? "Edit Testimonial Review" : "Add New Testimonial"}
        size="md"
      >
        <FormProvider {...methods}>
          <form id="edit-testimonial-form" onSubmit={methods.handleSubmit(handleFormSubmit)} className="space-y-4">
            <RHFControl
              control="select"
              name="status"
              label="Status *"
              options={[
                { label: "Active", value: "Active" },
                { label: "Inactive", value: "Inactive" },
                { label: "Pending", value: "Pending" },
              ]}
              className="rounded-xl"
            />

            <div className="grid grid-cols-2 gap-4">
              <RHFControl
                control="input"
                name="author"
                label="Client Name *"
                placeholder="Aditya"
                className="rounded-xl"
              />
              <RHFControl
                control="input"
                name="designation"
                label="Job Title *"
                placeholder="Developer"
                className="rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <RHFControl
                control="input"
                name="company"
                label="Company Name *"
                placeholder="VCQRU"
                className="rounded-xl"
              />
              <RHFControl
                control="select"
                name="category"
                label="Project Category *"
                options={categoryOptions}
                className="rounded-xl"
              />
            </div>

            {/* Rating Selector */}
            <div className="space-y-2 pb-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Rating Selection *</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setSelectedRating(star)}
                    className="p-1 cursor-pointer focus:outline-none transition-transform duration-200 active:scale-125"
                  >
                    <Star
                      size={20}
                      fill={star <= selectedRating ? "#ed1c27" : "none"}
                      className={star <= selectedRating ? "text-primary animate-in zoom-in duration-100" : "text-neutral-300"}
                      strokeWidth={star <= selectedRating ? 0 : 1.5}
                    />
                  </button>
                ))}
                <span className="text-[11px] font-semibold text-gray-500 ml-2">{selectedRating} out of 5 stars</span>
              </div>
            </div>

            <RHFControl
              control="textarea"
              name="quote"
              label="Review (Quote) *"
              placeholder="Testimonial text..."
              className="rounded-xl"
            />

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
                disabled={isSubmitting}
                className="px-5 py-2 bg-[#ed1c27] hover:bg-[#c5141e] text-white font-bold uppercase tracking-wider text-xs rounded-xl cursor-pointer shadow-lg disabled:opacity-60"
              >
                {isSubmitting ? "Saving..." : editingTestimonial ? "Save Changes" : "Create Testimonial"}
              </button>
            </div>
          </form>
        </FormProvider>
      </AppModal>
    </div>
  );
}
