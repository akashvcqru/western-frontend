"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Trash2,
  Upload,
  ArrowLeft,
  Save,
  CheckCircle2,
  FileText,
} from "lucide-react";
import Image from "next/image";
import {
  Card,
  useAppToast,
  AdminPageHeader,
  RHFControl,
} from "@/components/ui";
import { AppRoutes } from "@/constants/routes";
import {
  useForm,
  FormProvider,
  Controller,
  useWatch,
  useFieldArray,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { apiPost, apiGetPaginated } from "@/lib/api";

// ─── Types ──────────────────────────────────────────────────────────────────

interface Category {
  id: string;
  name: string;
  slug?: string;
}

interface SubCategory {
  id: string;
  name: string;
  categoryId: string;
  slug?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
const generateSlug = (name: string) =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

// ─── Validation Schema ────────────────────────────────────────────────────────
const productSchema = yup.object().shape({
  name: yup.string().required("Product Name is required").min(3, "Minimum 3 characters"),
  category: yup.string().required("Category is required"),
  subCategory: yup.string().required("Sub Category is required"),
  brand: yup.string().required("Brand is required"),
  price: yup.string().required("Price is required"),
  stock: yup.number().typeError("Must be a number").required("Required").min(0),
  status: yup.string().required("Status is required"),
  description: yup.string().required("Description is required"),
  catNo: yup.string().nullable().optional(),
  blueprintImage: yup.string().nullable().optional(),
  material: yup.string().nullable().optional(),
  finish: yup.string().nullable().optional(),
  size: yup.string().nullable().optional(),
  images: yup.array().of(yup.string().required()).min(1, "At least one image is required").required(),
  features: yup.array().of(yup.object().shape({ title: yup.string().nullable().optional(), desc: yup.string().nullable().optional() })).optional(),
  specifications: yup.array().of(yup.object().shape({ label: yup.string().nullable().optional(), value: yup.string().nullable().optional() })).optional(),
  dimensions: yup.array().of(yup.object().shape({ name: yup.string().nullable().optional(), range: yup.string().nullable().optional(), coord: yup.string().nullable().optional() })).optional(),
  resources: yup.array().of(yup.object().shape({
    id: yup.string().required(),
    title: yup.string().nullable().optional(),
    desc: yup.string().nullable().optional(),
    format: yup.string().nullable().optional(),
    size: yup.string().nullable().optional(),
    fileData: yup.string().nullable().optional(),
    fileName: yup.string().nullable().optional(),
  })).optional(),
  variants: yup.array().of(yup.object().shape({ label: yup.string().nullable().optional(), options: yup.array().of(yup.string().required()).optional() })).optional(),
  swatches: yup.array().of(yup.object().shape({
    category: yup.string().nullable().optional(),
    options: yup.array().of(yup.object().shape({ name: yup.string().nullable().optional(), hex: yup.string().nullable().optional(), desc: yup.string().nullable().optional(), border: yup.boolean().optional() })).optional(),
  })).optional(),
  detailsTitle: yup.string().nullable().optional(),
  detailsText1: yup.string().nullable().optional(),
  detailsText2: yup.string().nullable().optional(),
  quickSpecs: yup.array().of(yup.object().shape({ value: yup.string().nullable().optional() })).optional(),
  trustBadges: yup.array().of(yup.object().shape({
    title: yup.string().nullable().optional(),
    desc: yup.string().nullable().optional(),
    icon: yup.string().nullable().optional()
  })).optional(),
  metaTitle: yup.string().nullable().optional(),
  metaDescription: yup.string().nullable().optional(),
});

type ProductFormData = yup.InferType<typeof productSchema>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getErrorMessage = (err: any): string => {
  if (!err) return "";
  if (typeof err.message === "string") return err.message;
  if (Array.isArray(err)) {
    for (const item of err) {
      if (item) {
        const msg = getErrorMessage(item);
        if (msg) return msg;
      }
    }
  }
  if (typeof err === "object") {
    for (const key of Object.keys(err)) {
      const msg = getErrorMessage(err[key]);
      if (msg) return msg;
    }
  }
  return "Required";
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function NewProductPage() {
  const router = useRouter();
  const { addToast } = useAppToast();

  const [activeTab, setActiveTab] = useState<"general" | "details" | "blueprint" | "specs" | "resources" | "seo">("general");
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [brands, setBrands] = useState<{ id: string; name: string }[]>([]);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const methods = useForm<ProductFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(productSchema) as any,
    defaultValues: {
      name: "", category: "", subCategory: "", brand: "Western", price: "", stock: 10,
      status: "Active", description: "", catNo: "", blueprintImage: "",
      material: "", finish: "", size: "",
      images: [], features: [], specifications: [], dimensions: [],
      resources: [], variants: [], swatches: [],
      detailsTitle: "", detailsText1: "", detailsText2: "", quickSpecs: [],
      trustBadges: [
        { title: "BIFMA Quality", desc: "Heavy industrial standards", icon: "ShieldCheck" },
        { title: "Direct Factory", desc: "Zero intermediary markups", icon: "Award" },
        { title: "5Y Warranty", desc: "Assured structural coverage", icon: "Zap" },
      ],
      metaTitle: "",
      metaDescription: "",
    },
  });

  const { setValue, control, handleSubmit, formState: { errors, isSubmitting } } = methods;
  const watchedStatus = useWatch({ control, name: "status" });
  const watchedResources = useWatch({ control, name: "resources" }) || [];

  const { fields: featureFields, append: appendFeature, remove: removeFeature } = useFieldArray({ control, name: "features" });
  const { fields: specFields, append: appendSpec, remove: removeSpec } = useFieldArray({ control, name: "specifications" });
  const { fields: dimFields, append: appendDim, remove: removeDim } = useFieldArray({ control, name: "dimensions" });
  const { fields: resFields, append: appendRes, remove: removeRes } = useFieldArray({ control, name: "resources" });
  const { fields: quickSpecFields, append: appendQuickSpec, remove: removeQuickSpec } = useFieldArray({ control, name: "quickSpecs" });
  const { fields: trustBadgeFields, append: appendTrustBadge, remove: removeTrustBadge } = useFieldArray({ control, name: "trustBadges" });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      addToast({
        title: "File Too Large",
        message: "Please choose a file smaller than 1 MB.",
        variant: "error"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setValue(`resources.${index}.fileData`, result);
      setValue(`resources.${index}.fileName`, file.name);

      const extension = file.name.split(".").pop()?.toUpperCase() || "";
      if (!methods.getValues(`resources.${index}.format`)) {
        setValue(`resources.${index}.format`, extension);
      }

      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      const sizeStr = parseFloat(sizeMB) > 0.1 ? `${sizeMB} MB` : `${(file.size / 1024).toFixed(0)} KB`;
      if (!methods.getValues(`resources.${index}.size`)) {
        setValue(`resources.${index}.size`, sizeStr);
      }

      if (!methods.getValues(`resources.${index}.title`)) {
        setValue(`resources.${index}.title`, file.name.substring(0, file.name.lastIndexOf(".")) || file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  // Auto-adjust stock by status
  useEffect(() => {
    if (watchedStatus === "Inactive") {
      setValue("stock", 0);
    } else if (watchedStatus === "Active") {
      const cur = methods.getValues("stock");
      if (!cur || cur <= 0) setValue("stock", 10);
    }
  }, [watchedStatus, setValue, methods]);

  // Load categories, subcategories and brands from backend
  useEffect(() => {
    const loadData = async () => {
      try {
        const catsRes = await apiGetPaginated<Category>("/api/categories?limit=100");
        setCategories(catsRes.data);
      } catch (e) {
        console.error("Error loading categories:", e);
      }
      try {
        const subCatsRes = await apiGetPaginated<SubCategory>("/api/categories/subcategories?limit=100");
        setSubCategories(subCatsRes.data);
      } catch (e) {
        console.error("Error loading subcategories:", e);
      }
      try {
        const brandsRes = await apiGetPaginated<{ id: string; name: string }>("/api/brands?limit=100");
        setBrands(brandsRes.data);
      } catch (e) {
        console.error("Error loading brands:", e);
      }
    };
    loadData();
  }, []);

  const categoryOptions = categories.map((c) => ({ label: c.name, value: c.id || c.slug || "" }));

  const watchedCategory = useWatch({ control, name: "category" });
  const filteredSubCategories = React.useMemo(() => {
    if (!watchedCategory) return [];
    return subCategories.filter((sc) => sc.categoryId === watchedCategory);
  }, [subCategories, watchedCategory]);

  const subCategoryOptions = filteredSubCategories.map((sc) => ({ label: sc.name, value: sc.id || sc.slug || "" }));

  const brandOptions = (() => {
    const list = brands.map((b) => ({ label: b.name, value: b.name }));
    if (!list.some((opt) => opt.value.toLowerCase() === "western")) {
      return [{ label: "Western", value: "Western" }, ...list];
    }
    return list;
  })();

  const onSubmit = async (data: ProductFormData) => {
    const defaultImage = "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=2070&auto=format&fit=crop";
    const imagesList = data.images && data.images.length > 0 ? data.images : [defaultImage];

    const slug = generateSlug(data.name);

    const productPayload = {
      name: data.name,
      slug: slug,
      category: data.category,
      subCategory: data.subCategory,
      brand: data.brand,
      price: data.price,
      stock: data.stock,
      status: data.status,
      description: data.description,
      catNo: data.catNo || "",
      blueprintImage: data.blueprintImage || "",
      material: data.material || "",
      finish: data.finish || "",
      size: data.size || "",
      images: imagesList,
      features: (data.features || [])
        .filter((f) => f.title || f.desc)
        .map((f) => ({ title: f.title || "", desc: f.desc || "" })),
      specifications: (data.specifications || [])
        .filter((s) => s.label || s.value)
        .map((s) => ({ label: s.label || "", value: s.value || "" })),
      dimensions: (data.dimensions || [])
        .filter((d) => d.name || d.range || d.coord)
        .map((d) => ({ name: d.name || "", range: d.range || "", coord: d.coord || "" })),
      resources: (data.resources || [])
        .filter((res) => res.title || res.fileName)
        .map((res) => ({
          id: res.id,
          title: res.title || "",
          desc: res.desc || "",
          format: res.format || "",
          size: res.size || "",
          fileData: res.fileData || undefined,
          fileName: res.fileName || undefined,
        })),
      variants: (data.variants || [])
        .filter((v) => v.label)
        .map((v) => ({ label: v.label || "", options: Array.isArray(v.options) ? (v.options.filter(Boolean) as string[]) : [] })),
      swatches: (data.swatches || [])
        .filter((sw) => sw.category)
        .map((sw) => ({
          category: sw.category || "",
          options: (sw.options || [])
            .filter((opt) => opt.name || opt.hex)
            .map((opt) => ({ name: opt.name || "", hex: opt.hex || "", desc: opt.desc || "", border: opt.border ?? false }))
        })),
      detailsTitle: data.detailsTitle || "",
      detailsText1: data.detailsText1 || "",
      detailsText2: data.detailsText2 || "",
      quickSpecs: (data.quickSpecs || []).map((q) => q.value).filter(Boolean) as string[],
      trustBadges: (data.trustBadges || [])
        .filter((badge) => badge.title || badge.desc)
        .map((badge) => ({
          title: badge.title || "",
          desc: badge.desc || "",
          icon: badge.icon || "",
        })),
      metaTitle: data.metaTitle || "",
      metaDescription: data.metaDescription || "",
    };

    try {
      await apiPost("/api/products", productPayload);
      addToast({ title: "Product Created", message: `"${data.name}" was added successfully.`, variant: "success" });
      setSavedSuccess(true);
      setTimeout(() => router.push(AppRoutes.Admin.Products), 1200);
    } catch (err: unknown) {
      addToast({ title: "Error", message: err instanceof Error ? err.message : "Failed to create product", variant: "error" });
    }
  };

  const TABS = [
    { key: "general", label: "General Info" },
    { key: "details", label: "Product Details" },
    { key: "blueprint", label: "Dimension Blueprint" },
    { key: "specs", label: "Specifications" },
    { key: "resources", label: "Downloads & Resources" },
    { key: "seo", label: "SEO Settings" },
  ] as const;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Add New Product"
        breadcrumbs={[
          { label: "Admin", href: AppRoutes.Admin.Dashboard },
          { label: "Products", href: AppRoutes.Admin.Products },
          { label: "New Product" },
        ]}
      />

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* Top action bar */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <button type="button" onClick={() => router.push(AppRoutes.Admin.Products)}
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-gray-800 transition-colors cursor-pointer">
              <ArrowLeft size={14} /> Back to Products
            </button>
            <button type="submit" disabled={isSubmitting || savedSuccess}
              className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold uppercase tracking-wider text-xs text-white shadow-lg transition-all duration-300 cursor-pointer ${
                savedSuccess
                  ? "bg-emerald-500 shadow-emerald-500/20"
                  : "bg-[#ed1c27] hover:bg-[#c5141e] shadow-[#ed1c27]/20 hover:-translate-y-0.5"
              } disabled:opacity-60`}>
              {savedSuccess ? <><CheckCircle2 size={14} /> Saved!</> : <><Save size={14} /> Create Product</>}
            </button>
          </div>

          <div className="grid lg:grid-cols-[1fr_320px] gap-6 items-start">
            {/* ── Left: Tabbed Form ── */}
            <Card>
              {/* Tab Header */}
              <div className="flex border-b border-gray-100 overflow-x-auto scrollbar-none gap-2">
                {TABS.map((tab) => (
                  <button key={tab.key} type="button" onClick={() => setActiveTab(tab.key)}
                    className={`flex-shrink-0 py-3.5 px-4 text-[10px] font-bold uppercase tracking-wider border-b-2 whitespace-nowrap transition-all duration-300 ${
                      activeTab === tab.key
                        ? "border-[#ed1c27] text-[#ed1c27]"
                        : "border-transparent text-gray-400 hover:text-gray-600"
                    }`}>
                    {tab.label}
                  </button>
                ))}
              </div>

              <Card.Body>
                {/* ══ GENERAL TAB ══ */}
                <div className={activeTab === "general" ? "space-y-5" : "hidden"}>
                  <RHFControl control="input" name="name" label="Product Name *" placeholder="e.g. WFU 001 Modular Workstation" className="rounded-xl" />

                  <div className="grid grid-cols-3 gap-4">
                    <RHFControl control="select" name="category" label="Category *" options={categoryOptions} className="rounded-xl" />
                    <RHFControl control="select" name="subCategory" label="Sub Category *" options={subCategoryOptions} disabled={!watchedCategory} className="rounded-xl" />
                    <RHFControl control="select" name="brand" label="Brand *" options={brandOptions} className="rounded-xl" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <RHFControl control="input" name="price" label="Price *" placeholder="e.g. 24,500 or Price on Request" className="rounded-xl" />
                    <RHFControl control="input" name="catNo" label="Catalog Number (Cat. No.)" placeholder="e.g. wfu-001" className="rounded-xl" />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <RHFControl control="input" name="material" label="Material" placeholder="e.g. Premium PLPB / Engineered Wood" className="rounded-xl" />
                    <RHFControl control="input" name="finish" label="Finish" placeholder="e.g. Melamine Laminate" className="rounded-xl" />
                    <RHFControl control="input" name="size" label="Size" placeholder="e.g. 1200W x 600D x 750H mm" className="rounded-xl" />
                  </div>

                  {/* Trust Badges */}
                  <div className="space-y-3 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800">Trust Badges</h4>
                        <p className="text-[10px] text-gray-400 mt-0.5">Customize the trust/quality badges displayed on the product page (e.g. BIFMA Quality, Direct Factory, 5Y Warranty). If left empty, default values will be shown.</p>
                      </div>
                      <button type="button" onClick={() => appendTrustBadge({ title: "", desc: "", icon: "ShieldCheck" })}
                        className="inline-flex items-center gap-1 bg-[#ed1c27]/10 text-[#ed1c27] hover:bg-[#ed1c27]/20 text-[10px] font-bold uppercase tracking-wider rounded-lg px-3 py-1.5 cursor-pointer whitespace-nowrap shrink-0">
                        <Plus size={10} /> Add Trust Badge
                      </button>
                    </div>
                    {trustBadgeFields.length === 0 ? (
                      <p className="text-[10px] text-gray-400 py-2">No custom trust badges yet. Default ones (BIFMA Quality, Direct Factory, 5Y Warranty) will be displayed on storefront.</p>
                    ) : (
                      <div className="space-y-4">
                        {trustBadgeFields.map((f, i) => {
                          return (
                            <div key={f.id} className="border border-gray-100 rounded-xl p-3 bg-gray-50/50 space-y-3 relative">
                              <button type="button" onClick={() => removeTrustBadge(i)} className="absolute top-2 right-2 p-1.5 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"><Trash2 size={12} /></button>
                              <div className="grid grid-cols-2 gap-3 pr-6">
                                <RHFControl control="input" name={`trustBadges.${i}.title`} label="Badge Title *" placeholder="e.g. BIFMA Quality" className="rounded-xl" />
                                <RHFControl control="input" name={`trustBadges.${i}.desc`} label="Badge Description *" placeholder="e.g. Heavy industrial standards" className="rounded-xl" />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <RHFControl control="select" name="status" label="Status *"
                    options={[{ label: "Active", value: "Active" }, { label: "Inactive", value: "Inactive" }]}
                    className="rounded-xl" />

                  <RHFControl control="textarea" name="description" label="Description *"
                    placeholder="Provide a detailed description of the product..." className="rounded-xl" />

                  {/* Product Images Upload */}
                  <div className="space-y-2 pt-4 border-t border-gray-100">
                    <label className="text-[10px] font-semibold uppercase tracking-widest text-secondary/60">
                      Product Images (at least 1 required) *
                    </label>
                    <Controller name="images" control={control}
                      render={({ field, fieldState: { error } }) => {
                        const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
                          const files = e.target.files;
                          if (!files || files.length === 0) return;
                          const oversizedFiles = Array.from(files).filter(f => f.size > 102400);
                          if (oversizedFiles.length > 0) {
                            addToast({
                              title: "File Too Large",
                              message: "All images must be 100KB or smaller. Some files exceed this limit.",
                              variant: "error",
                            });
                            return;
                          }
                          const promises = Array.from(files).map(
                            (f) => new Promise<string>((res) => {
                              const r = new FileReader();
                              r.onloadend = () => res(r.result as string);
                              r.readAsDataURL(f);
                            })
                          );
                          Promise.all(promises).then((urls) => field.onChange([...(field.value || []), ...urls]));
                        };
                        const removeAt = (i: number) => {
                          const arr = [...(field.value || [])];
                          arr.splice(i, 1);
                          field.onChange(arr);
                        };
                        return (
                          <div className="space-y-4">
                            <div className="border-2 border-dashed border-gray-200 hover:border-[#ed1c27]/50 rounded-xl p-8 flex flex-col items-center justify-center gap-2 bg-gray-50/50 relative group cursor-pointer transition-all duration-300 min-h-[160px]">
                              <Upload className="w-9 h-9 text-gray-300 group-hover:text-[#ed1c27] transition-colors duration-300" />
                              <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Upload Product Images</span>
                              <span className="text-[9px] text-gray-400 font-semibold uppercase tracking-widest">Click or drag — multiple files allowed (Max 100KB each)</span>
                              <input type="file" multiple accept="image/*" onChange={handleFiles} className="absolute inset-0 opacity-0 cursor-pointer" />
                            </div>
                            {field.value && field.value.length > 0 && (
                              <div className="grid grid-cols-3 gap-4">
                                {field.value.map((url: string, i: number) => (
                                  <div key={i} className="relative aspect-video rounded-xl overflow-hidden border border-gray-100 group/img">
                                    <Image src={url} alt={`Preview ${i + 1}`} fill className="object-cover" />
                                    <button type="button" onClick={() => removeAt(i)}
                                      className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow transition-colors cursor-pointer opacity-0 group-hover/img:opacity-100 z-10">
                                      <Trash2 size={12} />
                                    </button>
                                    {i === 0 && (
                                      <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 text-white text-[9px] font-bold uppercase tracking-wider rounded-md">
                                        Primary
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                            {error?.message && <p className="text-[10px] font-semibold text-red-500 uppercase">{error.message}</p>}
                          </div>
                        );
                      }} />
                  </div>
                </div>

                {/* ══ PRODUCT DETAILS TAB ══ */}
                <div className={activeTab === "details" ? "space-y-8" : "hidden"}>
                  {/* Product Details Tab Content */}
                  <div className="space-y-3">
                    <div className="pb-2 border-b border-gray-100">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800">Product Details Tab Content <span className="text-gray-400 normal-case tracking-normal font-normal">(Storefront View)</span></h4>
                      <p className="text-[10px] text-gray-400 mt-0.5">Customize the title, description paragraphs, and quick specification checklist shown on the storefront&apos;s Product Details tab. Leave empty to use category defaults.</p>
                    </div>

                    <RHFControl control="input" name="detailsTitle" label="Details Tab Title" placeholder="e.g. Elevating Workspace Productivity" className="rounded-xl" />
                    <RHFControl control="textarea" name="detailsText1" label="Description Paragraph 1" placeholder="e.g. Crafted for high-density, modern corporate environments..." className="rounded-xl" />
                    <RHFControl control="textarea" name="detailsText2" label="Description Paragraph 2" placeholder="e.g. All Western Interio furniture is manufactured using premium grade MDF/PLPB..." className="rounded-xl" />

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-semibold uppercase tracking-widest text-secondary/60">Quick Checklist Bullet Points</label>
                        <button type="button" onClick={() => appendQuickSpec({ value: "" })}
                          className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 text-[10px] font-bold uppercase tracking-wider rounded-lg px-3 py-1.5 cursor-pointer">
                          <Plus size={10} /> Add Bullet
                        </button>
                      </div>
                      {quickSpecFields.length === 0 ? (
                        <p className="text-[10px] text-gray-400 py-1">No custom bullet points. Default checklist (e.g. &quot;100% Anti-Moisture Sealing&quot;) will be shown.</p>
                      ) : (
                        <div className="space-y-2">
                          {quickSpecFields.map((f, i) => (
                            <div key={f.id} className="flex gap-3 items-end">
                              <div className="flex-1"><RHFControl control="input" name={`quickSpecs.${i}.value`} label={i === 0 ? "Bullet Text *" : ""} placeholder="e.g. 100% Anti-Moisture Sealing" className="rounded-xl" /></div>
                              <button type="button" onClick={() => removeQuickSpec(i)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer mb-1 shrink-0"><Trash2 size={14} /></button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-3 pt-6 border-t border-gray-100">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800">Core Technical Features</h4>
                        <p className="text-[10px] text-gray-400 mt-0.5">Feature items that display in the right-hand card on the storefront details tab.</p>
                      </div>
                      <button type="button" onClick={() => appendFeature({ title: "", desc: "" })}
                        className="inline-flex items-center gap-1 bg-blue-50 text-blue-600 hover:bg-blue-100 text-[10px] font-bold uppercase tracking-wider rounded-lg px-3 py-1.5 cursor-pointer">
                        <Plus size={10} /> Add Feature
                      </button>
                    </div>
                    {featureFields.length === 0 ? (
                      <p className="text-[10px] text-gray-400 py-2">No features yet. Highlight ergonomic benefits, materials, and smart features.</p>
                    ) : (
                      <div className="space-y-3">
                        {featureFields.map((f, i) => (
                          <div key={f.id} className="flex gap-3 items-end">
                            <div className="flex-1"><RHFControl control="input" name={`features.${i}.title`} label={i === 0 ? "Feature Title *" : ""} placeholder="e.g. Ergonomic Lumbar" className="rounded-xl" /></div>
                            <div className="flex-[2]"><RHFControl control="input" name={`features.${i}.desc`} label={i === 0 ? "Description *" : ""} placeholder="e.g. Contour backrest with mechanical adjustments" className="rounded-xl" /></div>
                            <button type="button" onClick={() => removeFeature(i)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer mb-1 shrink-0"><Trash2 size={14} /></button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  </div>

                {/* ══ DIMENSION BLUEPRINT TAB ══ */}
                <div className={activeTab === "blueprint" ? "space-y-8" : "hidden"}>
                  {/* Blueprint Image */}
                  <div className="space-y-2">
                    <div className="pb-2 border-b border-gray-100">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800">Blueprint drawing</h4>
                      <p className="text-[10px] text-gray-400 mt-0.5">Upload a technical blueprint illustration showing coordinates A, B, C etc. for this product.</p>
                    </div>
                    <Controller name="blueprintImage" control={control}
                      render={({ field }) => {
                        const handleBlueprint = (e: React.ChangeEvent<HTMLInputElement>) => {
                          const f = e.target.files?.[0];
                          if (!f) return;
                          if (f.size > 102400) {
                            addToast({
                              title: "File Too Large",
                              message: "Blueprint image size must not exceed 100KB.",
                              variant: "error",
                            });
                            return;
                          }
                          const r = new FileReader();
                          r.onloadend = () => field.onChange(r.result as string);
                          r.readAsDataURL(f);
                        };
                        return (
                          <div className="border-2 border-dashed border-gray-200 hover:border-[#ed1c27]/50 rounded-xl p-5 flex flex-col items-center justify-center gap-2 bg-gray-50/50 relative group cursor-pointer transition-all duration-300 min-h-[120px]">
                            {field.value ? (
                              <div className="relative w-full h-32 rounded-lg overflow-hidden">
                                <Image src={field.value} alt="Blueprint" fill className="object-contain" />
                                <button type="button" onClick={(e) => { e.stopPropagation(); field.onChange(""); }}
                                  className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-lg cursor-pointer z-10">
                                  <Trash2 size={10} />
                                </button>
                              </div>
                            ) : (
                              <>
                                <Upload className="w-6 h-6 text-gray-400 group-hover:text-[#ed1c27] transition-colors" />
                                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Upload Blueprint Image (Max 100KB)</span>
                              </>
                            )}
                            <input type="file" accept="image/*" onChange={handleBlueprint} className="absolute inset-0 opacity-0 cursor-pointer" />
                          </div>
                        );
                      }} />
                  </div>

                  {/* Dimensions */}
                  <div className="space-y-3 pt-6 border-t border-gray-100">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800">Dimensions (Blueprint Mapping)</h4>
                        <p className="text-[10px] text-gray-400 mt-0.5">Map blueprint coordinates (A, B, C etc.) to dimension descriptions and range options.</p>
                      </div>
                      <button type="button" onClick={() => appendDim({ name: "", range: "", coord: "" })}
                        className="inline-flex items-center gap-1 bg-blue-50 text-blue-600 hover:bg-blue-100 text-[10px] font-bold uppercase tracking-wider rounded-lg px-3 py-1.5 cursor-pointer">
                        <Plus size={10} /> Add Dimension
                      </button>
                    </div>
                    {dimFields.length === 0 ? (
                      <p className="text-[10px] text-gray-400 py-2">No dimensions yet. Add blueprint hotspot coordinates like A, B, C with their ranges.</p>
                    ) : (
                      <div className="space-y-3">
                        {dimFields.map((f, i) => (
                          <div key={f.id} className="flex gap-2 items-end">
                            <div className="w-20"><RHFControl control="input" name={`dimensions.${i}.coord`} label={i === 0 ? "Coord *" : ""} placeholder="A" className="rounded-xl" /></div>
                            <div className="flex-1"><RHFControl control="input" name={`dimensions.${i}.name`} label={i === 0 ? "Name *" : ""} placeholder="e.g. Total Height" className="rounded-xl" /></div>
                            <div className="flex-1"><RHFControl control="input" name={`dimensions.${i}.range`} label={i === 0 ? "Range *" : ""} placeholder="e.g. 980–1120 mm" className="rounded-xl" /></div>
                            <button type="button" onClick={() => removeDim(i)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer mb-1 shrink-0"><Trash2 size={14} /></button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* ══ SPECIFICATIONS TAB ══ */}
                <div className={activeTab === "specs" ? "space-y-5" : "hidden"}>
                  {/* Specifications */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800">Specifications</h4>
                      <button type="button" onClick={() => appendSpec({ label: "", value: "" })}
                        className="inline-flex items-center gap-1 bg-blue-50 text-blue-600 hover:bg-blue-100 text-[10px] font-bold uppercase tracking-wider rounded-lg px-3 py-1.5 cursor-pointer">
                        <Plus size={10} /> Add Spec
                      </button>
                    </div>
                    {specFields.length === 0 ? (
                      <p className="text-[10px] text-gray-400 py-2">No specifications yet. Add material, finish, ergonomics details, etc.</p>
                    ) : (
                      <div className="space-y-3">
                        {specFields.map((f, i) => (
                          <div key={f.id} className="flex gap-3 items-end">
                            <div className="flex-1"><RHFControl control="input" name={`specifications.${i}.label`} label={i === 0 ? "Label *" : ""} placeholder="e.g. Frame Material" className="rounded-xl" /></div>
                            <div className="flex-1"><RHFControl control="input" name={`specifications.${i}.value`} label={i === 0 ? "Value *" : ""} placeholder="e.g. Powder Coated Steel" className="rounded-xl" /></div>
                            <button type="button" onClick={() => removeSpec(i)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer mb-1 shrink-0"><Trash2 size={14} /></button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* ══ DOWNLOADS & RESOURCES TAB ══ */}
                <div className={activeTab === "resources" ? "space-y-5" : "hidden"}>
                  {/* Resources */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800">Downloadable Resources</h4>
                        <p className="text-[10px] text-gray-400 mt-0.5">Attach PDFs or spec guides for customers to download.</p>
                      </div>
                      <button type="button" onClick={() => appendRes({ id: `res-${Date.now()}`, title: "", desc: "", format: "PDF", size: "2.4 MB" })}
                        className="inline-flex items-center gap-1 bg-blue-50 text-blue-600 hover:bg-blue-100 text-[10px] font-bold uppercase tracking-wider rounded-lg px-3 py-1.5 cursor-pointer">
                        <Plus size={10} /> Add Resource
                      </button>
                    </div>
                    {resFields.length === 0 ? (
                      <p className="text-[10px] text-gray-400 py-2">No resources yet. Attach user guides, spec sheets, installation booklets.</p>
                    ) : (
                      <div className="space-y-3">
                        {resFields.map((f, i) => (
                          <div key={f.id} className="border border-gray-100 rounded-xl p-3 bg-gray-50/50 space-y-3 relative">
                            <button type="button" onClick={() => removeRes(i)} className="absolute top-2 right-2 p-1.5 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"><Trash2 size={12} /></button>
                            <div className="grid grid-cols-2 gap-3">
                              <RHFControl control="input" name={`resources.${i}.title`} label="Title *" placeholder="e.g. Specification Sheet" className="rounded-xl" />
                              <RHFControl control="input" name={`resources.${i}.desc`} label="Description *" placeholder="e.g. Technical dimensions detail" className="rounded-xl" />
                            </div>
                            <div className="space-y-1.5 pt-1">
                              <label className="text-[10px] font-semibold uppercase tracking-widest text-secondary/60">Upload Document</label>
                              <div className="flex items-center gap-3">
                                <input
                                  type="file"
                                  id={`file-upload-new-${f.id}`}
                                  className="hidden"
                                  accept=".pdf,.doc,.docx,.xls,.xlsx,.zip,.dwg,.step,.png,.jpg,.jpeg"
                                  onChange={(e) => handleFileUpload(e, i)}
                                />
                                <label
                                  htmlFor={`file-upload-new-${f.id}`}
                                  className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-200/80 hover:bg-neutral-200 text-secondary text-[10px] font-bold uppercase tracking-wider rounded-xl cursor-pointer transition-colors duration-200 border border-neutral-300/30"
                                >
                                  <Upload size={12} />
                                  {watchedResources[i]?.fileName ? "Change Document" : "Choose Document"}
                                </label>
                                {watchedResources[i]?.fileName && (
                                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 bg-white/80 border border-gray-100 rounded-xl px-3 py-1.5">
                                    <FileText size={12} className="text-primary shrink-0" />
                                    <span className="truncate max-w-[180px] text-[10px]">{watchedResources[i]?.fileName}</span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setValue(`resources.${i}.fileData`, "");
                                        setValue(`resources.${i}.fileName`, "");
                                      }}
                                      className="text-red-500 hover:text-red-700 text-sm font-bold ml-1 inline-flex items-center justify-center cursor-pointer"
                                    >
                                      &times;
                                    </button>
                                  </div>
                                )}
                              </div>
                              <p className="text-[9px] text-gray-400 font-normal font-sans">Supports PDF, ZIP, CAD, and image formats up to 1 MB.</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* ══ SEO TAB ══ */}
                <div className={activeTab === "seo" ? "space-y-5" : "hidden"}>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800">SEO Metadata</h4>
                      <p className="text-[10px] text-gray-400 mt-0.5">Define search engine optimization settings for this product to improve its search ranking.</p>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      <RHFControl control="input" name="metaTitle" label="Meta Title" placeholder="SEO Page Title (optional)" className="rounded-xl" />
                      <RHFControl control="textarea" name="metaDescription" label="Meta Description" placeholder="SEO Page Description (optional)" className="rounded-xl" />
                    </div>
                  </div>
                </div>


              </Card.Body>
            </Card>

            {/* ── Right: Summary Sidebar ── */}
            <div className="space-y-4 lg:sticky lg:top-20">
              {/* Tab navigation helper */}
              <Card>
                <Card.Header>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-700">Form Sections</h3>
                </Card.Header>
                <Card.Body>
                  <div className="space-y-1">
                    {TABS.map((tab) => (
                      <button key={tab.key} type="button" onClick={() => setActiveTab(tab.key)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                          activeTab === tab.key
                            ? "bg-[#ed1c27]/8 text-[#ed1c27] font-bold"
                            : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                        }`}>
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </Card.Body>
              </Card>

              {/* Errors summary */}
              {Object.keys(errors).length > 0 && (
                <Card>
                  <Card.Body>
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-red-500">Fix these errors</p>
                      {Object.entries(errors).map(([key, err]) => (
                        <p key={key} className="text-[10px] text-red-400 font-medium">
                          • <span className="font-bold uppercase">{key}</span>: {getErrorMessage(err)}
                        </p>
                      ))}
                    </div>
                  </Card.Body>
                </Card>
              )}

              {/* Tips */}
              <Card>
                <Card.Body>
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Quick Tips</p>
                    <ul className="space-y-2 text-[10px] text-gray-400 font-normal leading-relaxed list-disc list-inside">
                      <li>Upload at least 1 product image in the <strong>General Info</strong> tab</li>
                      <li>Add specs like frame material and surface finish in <strong>Specifications</strong></li>
                      <li>Dimensions link to the blueprint image via coordinate labels (A, B, C…)</li>

                    </ul>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </div>


        </form>
      </FormProvider>
    </div>
  );
}
