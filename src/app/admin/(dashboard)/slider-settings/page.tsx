"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Trash2,
  Upload,
  AlertCircle,
  Plus,
  ImageIcon,
  Edit,
} from "lucide-react";
import {
  Card,
  AppModal,
  AdminPageHeader,
  Pagination,
  SearchInput,
} from "@/components/ui";
import { useAppToast } from "@/components/ui/AppToast";

import { useForm, FormProvider } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import RHFControl from "@/components/ui/inputs/RHFControl";
import { apiGet, apiPut } from "@/lib/api";
import { AppRoutes } from "@/constants/routes";

const slideSchema = yup.object().shape({
  heading: yup.string().required("Heading is required"),
  description: yup.string().required("Description is required"),
  buttonText: yup.string().required("Button text is required"),
  buttonLink: yup.string().required("Button link is required"),
  image: yup.string().required("Slide image is required"),
});

interface SlideItem {
  image: string;
  heading: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

export default function AdminSliderSettingsPage() {
  const { addToast } = useAppToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [slides, setSlides] = useState<SlideItem[]>([]);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlideIndex, setEditingSlideIndex] = useState<number | null>(null);
  const [modalPreview, setModalPreview] = useState<string | null>(null);

  // Search & Pagination state
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const slideMethods = useForm<SlideItem>({
    mode: "onChange",
    resolver: yupResolver(slideSchema),
    defaultValues: {
      image: "",
      heading: "",
      description: "",
      buttonText: "Start Your Project",
      buttonLink: "#quote",
    },
  });

  // ── Load settings from backend ───────────────────────────────────────
  const loadSettings = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const sliderRes = await apiGet<{
        heading?: string;
        description?: string;
        buttonText?: string;
        buttonLink?: string;
        images?: string[];
        slides?: SlideItem[];
      }>("/api/settings/bdm_settings_slider");
      if (sliderRes.success && sliderRes.data) {
        let loadedSlides: SlideItem[] = [];
        if (sliderRes.data.slides && Array.isArray(sliderRes.data.slides)) {
          loadedSlides = sliderRes.data.slides;
        } else if (sliderRes.data.images && Array.isArray(sliderRes.data.images)) {
          // Fallback from old schema: convert each image to a slide using global settings
          loadedSlides = sliderRes.data.images.map((img) => ({
            image: img,
            heading: sliderRes.data.heading || "Welcome to Western Interio",
            description: sliderRes.data.description || "Think to design beyond. Please upload showcase images or configure slide settings in the admin panel to populate this slider.",
            buttonText: sliderRes.data.buttonText || "Start Your Project",
            buttonLink: sliderRes.data.buttonLink || "#quote",
          }));
        }
        setSlides(loadedSlides);
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while loading settings"
      );
    } finally {
      setIsLoading(false);
      setIsMounted(true);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  // ── Slide CRUD ───────────────────────────────────────────────────────
  const handleAddSlide = () => {
    setEditingSlideIndex(null);
    slideMethods.reset({
      image: "",
      heading: "",
      description: "",
      buttonText: "Start Your Project",
      buttonLink: "#quote",
    });
    setModalPreview(null);
    setIsModalOpen(true);
  };

  const handleEditSlide = (index: number) => {
    setEditingSlideIndex(index);
    const slide = slides[index];
    slideMethods.reset({
      image: slide.image,
      heading: slide.heading,
      description: slide.description,
      buttonText: slide.buttonText,
      buttonLink: slide.buttonLink,
    });
    setModalPreview(slide.image);
    setIsModalOpen(true);
  };

  const handleDeleteSlide = async (index: number) => {
    if (!confirm(`Are you sure you want to delete Slide #${index + 1}?`)) return;
    const updated = slides.filter((_, idx) => idx !== index);
    setSlides(updated);

    // Save to backend immediately
    try {
      await apiPut("/api/settings/bdm_settings_slider", { slides: updated });
      addToast({
        title: "Slide Deleted",
        message: `Slide has been deleted successfully.`,
        variant: "info",
      });
    } catch {
      addToast({
        title: "Error",
        message: "Failed to persist slide deletion.",
        variant: "error",
      });
    }
  };

  const handleModalImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        setModalPreview(reader.result as string);
        slideMethods.setValue("image", reader.result as string, { shouldValidate: true });
      }
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleModalSave = async (data: SlideItem) => {
    if (!modalPreview) {
      addToast({
        title: "Validation Error",
        message: "Please upload an image for this slide.",
        variant: "error",
      });
      return;
    }

    const slideData = { ...data, image: modalPreview };
    let updated: SlideItem[];
    if (editingSlideIndex !== null) {
      updated = slides.map((slide, idx) =>
        idx === editingSlideIndex ? slideData : slide
      );
    } else {
      updated = [...slides, slideData];
    }
    setSlides(updated);

    // Save to backend immediately
    try {
      await apiPut("/api/settings/bdm_settings_slider", { slides: updated });
      addToast({
        title: editingSlideIndex !== null ? "Slide Updated" : "Slide Added",
        message:
          editingSlideIndex !== null
            ? `Slide #${editingSlideIndex + 1} has been updated.`
            : `New slide has been added successfully.`,
        variant: "success",
      });
      setIsModalOpen(false);
    } catch {
      addToast({
        title: "Error",
        message: "Failed to save slide changes.",
        variant: "error",
      });
    }
  };

  // ── Filtered & Paginated slides ──────────────────────────────────────
  const indexedSlides = slides.map((slide, idx) => ({
    originalIndex: idx,
    ...slide,
  }));

  const filteredSlides = searchTerm
    ? indexedSlides.filter(
        (s) =>
          s.heading.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : indexedSlides;

  const totalItems = filteredSlides.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedSlides = filteredSlides.slice(
    (safePage - 1) * itemsPerPage,
    safePage * itemsPerPage
  );

  // Reset page when search/pageSize changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage]);

  // ── Loading state ────────────────────────────────────────────────────
  if (!isMounted || isLoading) {
    return (
      <div className="space-y-6">
        <AdminPageHeader
          title="Slider Settings"
          breadcrumbs={[
            { label: "Admin", href: AppRoutes.Admin.Dashboard },
            { label: "Slider Settings" },
          ]}
        />
        <div className="bg-white rounded-2xl border border-gray-100 p-8 flex justify-center items-center shadow-sm">
          <div className="w-6 h-6 border-2 border-[#ed1c27]/20 border-t-[#ed1c27] rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Page Header with Breadcrumbs ──────────────────────────────── */}
      <AdminPageHeader
        title="Slider Settings"
        breadcrumbs={[
          { label: "Admin", href: AppRoutes.Admin.Dashboard },
          { label: "Slider Settings" },
        ]}
      />

      {error && (
        <div className="flex items-center gap-3 p-4 text-red-600 bg-red-50 border border-red-100 rounded-xl">
          <AlertCircle size={18} />
          <p className="text-sm font-semibold">{error}</p>
          <button
            onClick={loadSettings}
            className="ml-auto text-xs underline cursor-pointer font-bold uppercase tracking-widest"
          >
            Retry
          </button>
        </div>
      )}

      {/* ── Main Card (Directly shows the Slides table) ──────── */}
      <Card>
        <Card.Header>
          <SearchInput
            placeholder="Search slides by heading or description..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            wrapperClassName="max-w-sm"
          />
          <div className="flex items-center gap-3">
            <button
              id="add-slide-btn"
              type="button"
              onClick={handleAddSlide}
              className="inline-flex items-center justify-center gap-2 bg-[#ed1c27] hover:bg-[#c5141e] text-white font-bold uppercase tracking-[0.12em] text-[10px] rounded-xl px-5 py-2 transition-all duration-300 cursor-pointer hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#ed1c27]/25"
            >
              <Plus size={14} /> Add Slide
            </button>
          </div>
        </Card.Header>

        <Card.Body noPadding>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-400 w-16">Image</th>
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">Heading &amp; Description</th>
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">Button CTA</th>
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
                      <td className="py-3 px-6"><div className="h-5 bg-gray-100 rounded-full w-16" /></td>
                      <td className="py-3 px-6"><div className="h-5 bg-gray-100 rounded-full w-16" /></td>
                      <td className="py-3 px-6" />
                    </tr>
                  ))
                ) : paginatedSlides.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-16 text-center">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                        {searchTerm ? "No slides found" : "No slides uploaded yet"}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-1">
                        {searchTerm
                          ? "Try adjusting your search."
                          : "Add your first slide to get started."}
                      </p>
                    </td>
                  </tr>
                ) : (
                  paginatedSlides.map((slide) => (
                    <tr key={slide.originalIndex} className="hover:bg-gray-50/50 transition-colors group">
                      {/* Thumbnail */}
                      <td className="py-3 px-6">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden relative border border-gray-100">
                          <Image
                            src={slide.image}
                            alt={slide.heading}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </td>
                      {/* Heading + Description */}
                      <td className="py-3 px-6">
                        <p className="text-xs font-semibold text-gray-900 truncate max-w-[200px]" dangerouslySetInnerHTML={{ __html: slide.heading }} />
                        <p className="text-[10px] text-gray-400 font-medium mt-0.5 truncate max-w-[250px]">
                          {slide.description}
                        </p>
                      </td>
                      {/* Button Text & Link */}
                      <td className="py-3 px-6">
                        <p className="text-xs font-semibold text-blue-600">{slide.buttonText}</p>
                        <p className="text-[10px] text-gray-400 font-medium mt-0.5 truncate max-w-[150px]">
                          {slide.buttonLink}
                        </p>
                      </td>
                      {/* Status */}
                      <td className="py-3 px-6">
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest bg-emerald-50 text-emerald-600">
                          Active
                        </span>
                      </td>
                      {/* Actions */}
                      <td className="py-3 px-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={() => handleEditSlide(slide.originalIndex)}
                            className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit Slide"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteSlide(slide.originalIndex)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Slide"
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
            currentPage={safePage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            pageSize={itemsPerPage}
            onPageSizeChange={(size) => {
              setItemsPerPage(size);
              setCurrentPage(1);
            }}
            totalItems={totalItems}
            pageSizeOptions={[5, 10, 20, 50]}
          />
        </Card.Footer>
      </Card>

      {/* ── Add/Edit Slide Modal ──────────────────────────────────────── */}
      <AppModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          editingSlideIndex !== null
            ? `Edit Slide #${editingSlideIndex + 1}`
            : "Add New Slide"
        }
        size="lg"
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-bold uppercase tracking-wider text-gray-500 hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="slide-edit-form"
              className="px-5 py-2 bg-[#ed1c27] hover:bg-[#c5141e] text-white font-bold uppercase tracking-wider text-xs rounded-xl cursor-pointer shadow-lg shadow-[#ed1c27]/10"
            >
              {editingSlideIndex !== null ? "Save Changes" : "Add Slide"}
            </button>
          </>
        }
      >
        <FormProvider {...slideMethods}>
          <form
            id="slide-edit-form"
            onSubmit={slideMethods.handleSubmit(handleModalSave)}
            noValidate
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Image upload */}
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-semibold uppercase tracking-widest text-secondary/60">
                  Slide Image *
                </label>
                <div className="border-2 border-dashed border-gray-200 hover:border-[#ed1c27]/50 rounded-xl p-4 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center gap-2 bg-gray-50/50 relative group min-h-[180px]">
                  {modalPreview ? (
                    <div className="relative w-full h-44 rounded-lg overflow-hidden border border-gray-100">
                      <Image
                        src={modalPreview}
                        alt="Slide preview"
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setModalPreview(null);
                          slideMethods.setValue("image", "");
                        }}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-md transition-colors cursor-pointer z-10"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-gray-400 group-hover:text-[#ed1c27] transition-colors duration-300" />
                      <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                        Upload Image
                      </span>
                      <span className="text-[9px] text-gray-400 font-semibold uppercase tracking-widest">
                        Click or drag image file
                      </span>
                    </>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleModalImageUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
                {slideMethods.formState.errors.image && (
                  <p className="text-[10px] text-red-500 font-semibold">
                    {slideMethods.formState.errors.image.message}
                  </p>
                )}
              </div>

              {/* Slide texts */}
              <RHFControl
                control="input"
                name="heading"
                label="Heading / Title"
                type="text"
                placeholder="Welcome to Western Interio"
              />
              <RHFControl
                control="input"
                name="buttonText"
                label="Button Text"
                type="text"
                placeholder="Start Your Project"
              />
              <div className="md:col-span-2">
                <RHFControl
                  control="input"
                  name="buttonLink"
                  label="Button Link / URL"
                  type="text"
                  placeholder="/contact"
                />
              </div>
              <div className="md:col-span-2">
                <RHFControl
                  control="textarea"
                  name="description"
                  label="Description"
                  placeholder="Think to design beyond..."
                />
              </div>
            </div>
          </form>
        </FormProvider>
      </AppModal>
    </div>
  );
}
