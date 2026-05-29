"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Upload, AlertCircle } from "lucide-react";
import Image from "next/image";
import { Card, AppModal, useAppToast, AdminPageHeader, Pagination, SearchInput } from "@/components/ui";
import { AppRoutes } from "@/constants/routes";
import {
  useGetAdminServicesQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
} from "@/redux/api/servicesApi";
import type { Service } from "@/types/api";

export default function AdminServicesPage() {
  const { addToast } = useAppToast();

  // Search and Pagination State
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Debounced Search Term for API
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // RTK Query Hooks
  const {
    data: servicesData,
    isLoading: isFetching,
    error: fetchError,
    refetch,
  } = useGetAdminServicesQuery({
    page: currentPage,
    limit: itemsPerPage,
    search: debouncedSearch,
  });

  const [createService, { isLoading: isCreating }] = useCreateServiceMutation();
  const [updateService, { isLoading: isUpdating }] = useUpdateServiceMutation();
  const [deleteService] = useDeleteServiceMutation();

  const services = servicesData?.data || [];
  const pagination = servicesData?.pagination || {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: itemsPerPage,
  };
  const isLoading = isFetching;
  const error = fetchError
    ? (fetchError as { data?: { message?: string } })?.data?.message || "Failed to load services"
    : null;
  const isSubmitting = isCreating || isUpdating;

  // Reset to first page when search terms change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, itemsPerPage]);

  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const [formTitle, setFormTitle] = useState("");
  const [formImage, setFormImage] = useState("");
  const [formStatus, setFormStatus] = useState("Active");

  // Handle Image upload to Base64
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      addToast({ title: "File Too Large", message: "Please choose an image smaller than 2 MB.", variant: "warning" });
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setFormImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  // Open modal for adding a new service
  const handleAddClick = () => {
    setEditingService(null);
    setFormTitle("");
    setFormImage("");
    setFormStatus("Active");
    setIsModalOpen(true);
  };

  // Open modal for editing an existing service
  const handleEditClick = (srv: Service) => {
    setEditingService(srv);
    setFormTitle(srv.title);
    setFormImage(srv.image || "");
    setFormStatus(srv.status || "Active");
    setIsModalOpen(true);
  };

  // Delete service
  const handleDeleteClick = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete service "${title}"?`)) return;
    try {
      await deleteService(id).unwrap();
      addToast({ title: "Service Deleted", message: `Service "${title}" has been deleted.`, variant: "info" });
    } catch (err: unknown) {
      addToast({ title: "Error", message: err instanceof Error ? err.message : "Delete failed", variant: "error" });
    }
  };

  // Toggle status directly from table row
  const handleStatusToggle = async (srv: Service) => {
    const nextStatus = srv.status === "Active" ? "Inactive" : "Active";
    try {
      await updateService({ id: srv.id, body: { status: nextStatus } }).unwrap();
      addToast({ title: "Status Updated", message: `Service "${srv.title}" is now ${nextStatus.toLowerCase()}.`, variant: "success" });
    } catch (err: unknown) {
      addToast({ title: "Error", message: err instanceof Error ? err.message : "Status update failed", variant: "error" });
    }
  };

  // Submit form
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle) {
      addToast({ title: "Validation Error", message: "Service name is required.", variant: "error" });
      return;
    }
    if (!formImage) {
      addToast({ title: "Validation Error", message: "Service image is required.", variant: "error" });
      return;
    }

    try {
      // The user requested ONLY Image and Service Name in Add Service form
      const payload = {
        title: formTitle,
        image: formImage,
        status: formStatus,
      };

      if (editingService) {
        await updateService({ id: editingService.id, body: payload }).unwrap();
        addToast({ title: "Service Updated", message: `Service "${formTitle}" was updated successfully.`, variant: "success" });
      } else {
        await createService(payload).unwrap();
        addToast({ title: "Service Created", message: `Service "${formTitle}" was added successfully.`, variant: "success" });
      }
      setIsModalOpen(false);
    } catch (err: unknown) {
      addToast({ title: "Error", message: err instanceof Error ? err.message : "Operation failed", variant: "error" });
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Services"
        breadcrumbs={[
          { label: "Admin", href: AppRoutes.Admin.Dashboard },
          { label: "Services" },
        ]}
      />

      <Card>
        <Card.Header>
          <SearchInput
            placeholder="Search services by name..."
            value={searchTerm}
            onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            wrapperClassName="max-w-sm"
          />
          <div className="flex items-center gap-3">
            <button
              id="add-service-btn"
              onClick={handleAddClick}
              className="inline-flex items-center justify-center gap-2 bg-[#ed1c27] hover:bg-[#c5141e] text-white font-bold uppercase tracking-[0.12em] text-[10px] rounded-xl px-5 py-2 transition-all duration-300 cursor-pointer hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#ed1c27]/25"
            >
              <Plus size={14} /> Add Service
            </button>
          </div>
        </Card.Header>

        <Card.Body noPadding>
          {error && (
            <div className="flex items-center gap-3 p-6 text-red-600 bg-red-50 border-b border-red-100">
              <AlertCircle size={18} />
              <p className="text-sm font-semibold">{error}</p>
              <button onClick={() => refetch()} className="ml-auto text-xs underline cursor-pointer">Retry</button>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-400 w-28">Image</th>
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">Service Name</th>
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</th>
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">Created Date</th>
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoading ? (
                  Array.from({ length: itemsPerPage }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="py-3 px-6"><div className="w-16 h-10 rounded-lg bg-gray-100" /></td>
                      <td className="py-3 px-6"><div className="h-3 bg-gray-100 rounded w-24 mb-1" /><div className="h-2 bg-gray-100 rounded w-16" /></td>
                      <td className="py-3 px-6"><div className="h-4 bg-gray-100 rounded-lg w-12" /></td>
                      <td className="py-3 px-6"><div className="h-3 bg-gray-100 rounded w-24" /></td>
                      <td className="py-3 px-6" />
                    </tr>
                  ))
                ) : services.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-16 text-center">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">No services found</p>
                      <p className="text-[11px] text-gray-400 mt-1">{searchTerm ? "Try adjusting your search." : "Add your first service to get started."}</p>
                    </td>
                  </tr>
                ) : (
                  services.map(srv => (
                    <tr key={srv.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="py-3 px-6">
                        <div className="w-16 h-10 rounded-lg bg-gray-50 overflow-hidden relative flex items-center justify-center border border-gray-100">
                          {srv.image ? (
                            <Image src={srv.image} alt={srv.title} fill className="object-cover" />
                          ) : (
                            <span className="text-[8px] text-gray-400 font-bold uppercase tracking-wider text-center">No Image</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-6">
                        <p className="text-xs font-semibold text-gray-900">{srv.title}</p>
                        <p className="text-[10px] text-gray-400 font-medium mt-0.5">{srv.slug}</p>
                      </td>
                      <td className="py-3 px-6">
                        <button
                          onClick={() => handleStatusToggle(srv)}
                          className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider cursor-pointer border transition-colors ${
                            srv.status === "Active"
                              ? "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100"
                              : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
                          }`}
                        >
                          {srv.status || "Active"}
                        </button>
                      </td>
                      <td className="py-3 px-6">
                        <p className="text-[10px] text-gray-400 font-medium">
                          {srv.createdAt ? new Date(srv.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—"}
                        </p>
                      </td>
                      <td className="py-3 px-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleEditClick(srv)} className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer" title="Edit Service">
                            <Edit size={14} />
                          </button>
                          <button onClick={() => handleDeleteClick(srv.id, srv.title)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer" title="Delete Service">
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

      {/* Add/Edit Modal */}
      <AppModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingService ? "Edit Service" : "Add New Service"}
        size="md"
      >
        <form onSubmit={handleFormSubmit} className="space-y-5">
          {/* Service Name */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Service Name *</label>
            <input
              type="text" required value={formTitle} onChange={e => setFormTitle(e.target.value)}
              placeholder="e.g. Turnkey Electricals"
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#ed1c27]/40"
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Service Image *</label>
            <div className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-2 bg-gray-50/50 relative group cursor-pointer transition-all duration-300 min-h-[140px] ${!formImage ? "border-gray-200 hover:border-[#ed1c27]/60" : "border-emerald-200 hover:border-emerald-400"}`}>
              <Upload className={`w-8 h-8 transition-colors duration-300 ${!formImage ? "text-gray-300 group-hover:text-[#ed1c27]" : "text-emerald-400"}`} />
              <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                {formImage ? "Image Uploaded — Click to Replace" : "Upload Service Image"}
              </span>
              <span className="text-[9px] text-gray-400 font-semibold uppercase tracking-widest">PNG, JPG or WEBP (Max 2MB)</span>
              <input id="service-image-upload" type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageUpload} />
            </div>
            {formImage && (
              <div className="relative h-24 w-40 rounded-lg overflow-hidden border border-gray-100 bg-gray-50 mx-auto">
                <Image src={formImage} alt="Service preview" fill className="object-cover" />
              </div>
            )}
          </div>

          {/* Status Selection */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</label>
            <select
              value={formStatus}
              onChange={e => setFormStatus(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#ed1c27]/40"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-bold uppercase tracking-wider text-gray-500 hover:bg-gray-50 cursor-pointer">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="px-5 py-2 bg-[#ed1c27] hover:bg-[#c5141e] text-white font-bold uppercase tracking-wider text-xs rounded-xl cursor-pointer shadow-lg transition-all duration-200 disabled:opacity-60">
              {isSubmitting ? "Saving..." : editingService ? "Save Changes" : "Create Service"}
            </button>
          </div>
        </form>
      </AppModal>
    </div>
  );
}
