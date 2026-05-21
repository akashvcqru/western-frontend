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
import initialProductsData from "@/data/products.json";

// ─── Types ──────────────────────────────────────────────────────────────────
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
  detailsTitle?: string;
  detailsText1?: string;
  detailsText2?: string;
  quickSpecs?: string[];
}

interface Category {
  id: string;
  name: string;
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
  brand: yup.string().required("Brand is required"),
  price: yup.string().required("Price is required"),
  stock: yup.number().typeError("Must be a number").required("Required").min(0),
  status: yup.string().required("Status is required"),
  description: yup.string().required("Description is required"),
  catNo: yup.string().nullable().optional(),
  blueprintImage: yup.string().nullable().optional(),
  images: yup.array().of(yup.string().required()).min(1, "At least one image is required").required(),
  features: yup.array().of(yup.object().shape({ title: yup.string().required(), desc: yup.string().required() })).optional(),
  specifications: yup.array().of(yup.object().shape({ label: yup.string().required(), value: yup.string().required() })).optional(),
  dimensions: yup.array().of(yup.object().shape({ name: yup.string().required(), range: yup.string().required(), coord: yup.string().required() })).optional(),
  resources: yup.array().of(yup.object().shape({ id: yup.string().required(), title: yup.string().required(), desc: yup.string().required(), format: yup.string().required(), size: yup.string().required() })).optional(),
  variants: yup.array().of(yup.object().shape({ label: yup.string().required(), options: yup.array().of(yup.string().required()).optional() })).optional(),
  swatches: yup.array().of(yup.object().shape({
    category: yup.string().required(),
    options: yup.array().of(yup.object().shape({ name: yup.string().required(), hex: yup.string().required(), desc: yup.string().required(), border: yup.boolean().optional() })).optional(),
  })).optional(),
  detailsTitle: yup.string().nullable().optional(),
  detailsText1: yup.string().nullable().optional(),
  detailsText2: yup.string().nullable().optional(),
  quickSpecs: yup.array().of(yup.object().shape({ value: yup.string().required() })).optional(),
});

type ProductFormData = yup.InferType<typeof productSchema>;

// ─── Swatch Options Editor ────────────────────────────────────────────────────
function SwatchOptionsEditor({ swatchIndex, control }: { swatchIndex: number; control: any }) {
  const { fields, append, remove } = useFieldArray({ control, name: `swatches.${swatchIndex}.options` });
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-widest text-amber-700/70">Colour / Material Options</span>
        <button type="button" onClick={() => append({ name: "", hex: "#cccccc", desc: "", border: false })}
          className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 hover:bg-amber-200 text-[10px] font-bold uppercase tracking-wider rounded-lg px-2.5 py-1 cursor-pointer">
          <Plus size={9} /> Add Option
        </button>
      </div>
      {fields.length === 0 ? (
        <p className="text-[10px] text-gray-400 italic">No options yet.</p>
      ) : (
        <div className="space-y-3">
          {fields.map((opt, optIndex) => (
            <div key={opt.id} className="grid grid-cols-[auto_1fr_1fr_auto] gap-3 items-end bg-white border border-gray-100 rounded-xl p-3">
              <Controller name={`swatches.${swatchIndex}.options.${optIndex}.hex`} control={control}
                render={({ field }) => (
                  <div className="flex flex-col items-center gap-1">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Color</label>
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden border-2 border-gray-200 cursor-pointer shadow-sm">
                      <input type="color" value={field.value || "#cccccc"} onChange={(e) => field.onChange(e.target.value)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                      <div className="w-full h-full rounded-lg" style={{ backgroundColor: field.value || "#cccccc" }} />
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="text-[8px] font-mono text-white/80 drop-shadow font-bold">{(field.value || "#ccc").toUpperCase()}</span>
                      </div>
                    </div>
                    <input type="text" value={field.value || ""} onChange={(e) => field.onChange(e.target.value)} placeholder="#cccccc"
                      className="w-16 text-center border border-gray-200 rounded-md px-1 py-0.5 text-[9px] font-mono text-gray-600 focus:outline-none focus:border-amber-400" />
                  </div>
                )} />
              <RHFControl control="input" name={`swatches.${swatchIndex}.options.${optIndex}.name`} label="Name *" placeholder="e.g. Premium Oak" className="rounded-xl" />
              <RHFControl control="input" name={`swatches.${swatchIndex}.options.${optIndex}.desc`} label="Description *" placeholder="e.g. Warm natural oak woodgrain" className="rounded-xl" />
              <div className="flex flex-col items-center gap-2 pb-1">
                <Controller name={`swatches.${swatchIndex}.options.${optIndex}.border`} control={control}
                  render={({ field }) => (
                    <label className="flex flex-col items-center gap-1 cursor-pointer">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Border</span>
                      <div onClick={() => field.onChange(!field.value)} className={`w-8 h-4 rounded-full transition-colors duration-200 relative ${field.value ? "bg-amber-400" : "bg-gray-200"}`}>
                        <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform duration-200 ${field.value ? "translate-x-4" : "translate-x-0.5"}`} />
                      </div>
                    </label>
                  )} />
                <button type="button" onClick={() => remove(optIndex)} className="p-1 text-red-400 hover:bg-red-50 rounded-lg cursor-pointer"><Trash2 size={12} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function NewProductPage() {
  const router = useRouter();
  const { addToast } = useAppToast();

  const [activeTab, setActiveTab] = useState<"general" | "media" | "specs" | "advanced" | "variants">("general");
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<{ id: string; name: string }[]>([]);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const defaultCategoryOptions = [
    { label: "Floor Tiles", value: "floor-tiles" },
    { label: "Wall Tiles", value: "wall-tiles" },
    { label: "Wooden Flooring", value: "wooden-flooring" },
    { label: "Bathroom Fittings", value: "bathroom-fittings" },
    { label: "Granite & Marble", value: "granite-marble" },
  ];

  const defaultBrandOptions = [
    { label: "Western", value: "Western" },
    { label: "Kajaria", value: "Kajaria" },
    { label: "Somany", value: "Somany" },
    { label: "Jaquar", value: "Jaquar" },
    { label: "Greenply", value: "Greenply" },
    { label: "Hindware", value: "Hindware" },
  ];

  const methods = useForm<ProductFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(productSchema) as any,
    defaultValues: {
      name: "", category: "", brand: "Western", price: "", stock: 10,
      status: "Active", description: "", catNo: "", blueprintImage: "",
      images: [], features: [], specifications: [], dimensions: [],
      resources: [], variants: [], swatches: [],
      detailsTitle: "", detailsText1: "", detailsText2: "", quickSpecs: [],
    },
  });

  const { reset, setValue, control, handleSubmit, formState: { errors, isSubmitting } } = methods;
  const watchedStatus = useWatch({ control, name: "status" });

  const { fields: featureFields, append: appendFeature, remove: removeFeature } = useFieldArray({ control, name: "features" });
  const { fields: specFields, append: appendSpec, remove: removeSpec } = useFieldArray({ control, name: "specifications" });
  const { fields: dimFields, append: appendDim, remove: removeDim } = useFieldArray({ control, name: "dimensions" });
  const { fields: resFields, append: appendRes, remove: removeRes } = useFieldArray({ control, name: "resources" });
  const { fields: variantFields, append: appendVariant, remove: removeVariant } = useFieldArray({ control, name: "variants" });
  const { fields: swatchFields, append: appendSwatch, remove: removeSwatch } = useFieldArray({ control, name: "swatches" });
  const { fields: quickSpecFields, append: appendQuickSpec, remove: removeQuickSpec } = useFieldArray({ control, name: "quickSpecs" });

  // Auto-adjust stock by status
  useEffect(() => {
    if (watchedStatus === "Inactive") {
      setValue("stock", 0);
    } else if (watchedStatus === "Active") {
      const cur = methods.getValues("stock");
      if (!cur || cur <= 0) setValue("stock", 10);
    }
  }, [watchedStatus, setValue, methods]);

  // Load categories and brands from sessionStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCats = sessionStorage.getItem("bdm_categories");
      if (storedCats) {
        try { setCategories(JSON.parse(storedCats)); } catch { setCategories([]); }
      }
      const storedBrands = sessionStorage.getItem("bdm_brands");
      if (storedBrands) {
        try { setBrands(JSON.parse(storedBrands)); } catch { setBrands([]); }
      }
    }
  }, []);

  const categoryOptions = categories.length > 0
    ? categories.map((c) => ({ label: c.name, value: c.id || c.slug || "" }))
    : defaultCategoryOptions;

  const brandOptions = (() => {
    const list = brands.length > 0
      ? brands.map((b) => ({ label: b.name, value: b.name }))
      : defaultBrandOptions;
    if (!list.some((opt) => opt.value.toLowerCase() === "western")) {
      return [{ label: "Western", value: "Western" }, ...list];
    }
    return list;
  })();

  const onSubmit = (data: ProductFormData) => {
    const defaultImage = "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=2070&auto=format&fit=crop";
    const imagesList = data.images && data.images.length > 0 ? data.images : [defaultImage];

    const existing: Product[] = (() => {
      try {
        const s = sessionStorage.getItem("bdm_products");
        return s ? JSON.parse(s) : initialProductsData;
      } catch { return initialProductsData as Product[]; }
    })();

    const slug = generateSlug(data.name);
    let uniqueId = slug;
    let counter = 1;
    while (existing.some((p) => p.id === uniqueId || p.slug === uniqueId)) {
      uniqueId = `${slug}-${counter++}`;
    }

    const newProduct: Product = {
      id: uniqueId,
      slug: uniqueId,
      name: data.name,
      category: data.category,
      brand: data.brand,
      price: data.price,
      stock: data.stock,
      status: data.status,
      description: data.description,
      catNo: data.catNo || "",
      blueprintImage: data.blueprintImage || "",
      images: imagesList,
      features: data.features || [],
      specifications: data.specifications || [],
      dimensions: data.dimensions || [],
      resources: data.resources || [],
      variants: (data.variants || []).map((v) => ({ label: v.label, options: Array.isArray(v.options) ? v.options.filter(Boolean) as string[] : [] })),
      swatches: (data.swatches || []).map((sw) => ({ category: sw.category, options: (sw.options || []).map((opt) => ({ name: opt.name, hex: opt.hex, desc: opt.desc, border: opt.border ?? false })) })),
      detailsTitle: data.detailsTitle || "",
      detailsText1: data.detailsText1 || "",
      detailsText2: data.detailsText2 || "",
      quickSpecs: (data.quickSpecs || []).map((q) => q.value).filter(Boolean),
    };

    const updated = [newProduct, ...existing];
    sessionStorage.setItem("bdm_products", JSON.stringify(updated));

    addToast({ title: "Product Created", message: `"${data.name}" was added successfully.`, variant: "success" });
    setSavedSuccess(true);
    setTimeout(() => router.push(AppRoutes.Admin.Products), 1200);
  };

  const TABS = [
    { key: "general", label: "General Info" },
    { key: "media", label: "Media / Images" },
    { key: "specs", label: "Specs & Features" },
    { key: "advanced", label: "Advanced" },
    { key: "variants", label: "Variants & Swatches" },
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
              <div className="flex border-b border-gray-100 overflow-x-auto scrollbar-none">
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

                  <div className="grid grid-cols-2 gap-4">
                    <RHFControl control="select" name="category" label="Category *" options={categoryOptions} className="rounded-xl" />
                    <RHFControl control="select" name="brand" label="Brand *" options={brandOptions} className="rounded-xl" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <RHFControl control="input" name="price" label="Price *" placeholder="e.g. 24,500 or Price on Request" className="rounded-xl" />
                    <RHFControl control="input" name="catNo" label="Catalog Number (Cat. No.)" placeholder="e.g. wfu-001" className="rounded-xl" />
                  </div>

                  <RHFControl control="select" name="status" label="Status *"
                    options={[{ label: "Active", value: "Active" }, { label: "Inactive", value: "Inactive" }]}
                    className="rounded-xl" />

                  <RHFControl control="textarea" name="description" label="Description *"
                    placeholder="Provide a detailed description of the product..." className="rounded-xl" />
                </div>

                {/* ══ MEDIA TAB ══ */}
                <div className={activeTab === "media" ? "space-y-5" : "hidden"}>
                  {/* Product Images */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-semibold uppercase tracking-widest text-secondary/60">
                      Product Images (at least 1 required) *
                    </label>
                    <Controller name="images" control={control}
                      render={({ field, fieldState: { error } }) => {
                        const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
                          const files = e.target.files;
                          if (!files || files.length === 0) return;
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
                              <span className="text-[9px] text-gray-400 font-semibold uppercase tracking-widest">Click or drag — multiple files allowed</span>
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

                  {/* Blueprint Image */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-semibold uppercase tracking-widest text-secondary/60">Blueprint / Technical Drawing Image</label>
                    <Controller name="blueprintImage" control={control}
                      render={({ field }) => {
                        const handleBlueprint = (e: React.ChangeEvent<HTMLInputElement>) => {
                          const f = e.target.files?.[0];
                          if (!f) return;
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
                                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Upload Blueprint Image</span>
                              </>
                            )}
                            <input type="file" accept="image/*" onChange={handleBlueprint} className="absolute inset-0 opacity-0 cursor-pointer" />
                          </div>
                        );
                      }} />
                  </div>
                </div>

                {/* ══ SPECS & FEATURES TAB ══ */}
                <div className={activeTab === "specs" ? "space-y-8" : "hidden"}>
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

                  {/* Features */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800">Features</h4>
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

                  {/* Product Details Tab Content */}
                  <div className="space-y-3 pt-4 border-t border-gray-100">
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
                </div>

                {/* ══ ADVANCED TAB ══ */}
                <div className={activeTab === "advanced" ? "space-y-8" : "hidden"}>
                  {/* Dimensions */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800">Dimensions (Blueprint Mapping)</h4>
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

                  {/* Resources */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800">Downloadable Resources</h4>
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
                            <div className="grid grid-cols-3 gap-3">
                              <RHFControl control="input" name={`resources.${i}.format`} label="Format *" placeholder="e.g. PDF" className="rounded-xl" />
                              <RHFControl control="input" name={`resources.${i}.size`} label="Size *" placeholder="e.g. 1.8 MB" className="rounded-xl" />
                              <RHFControl control="input" name={`resources.${i}.id`} label="Resource ID *" placeholder="e.g. spec-sheet" className="rounded-xl" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* ══ VARIANTS & SWATCHES TAB ══ */}
                <div className={activeTab === "variants" ? "space-y-8" : "hidden"}>
                  {/* Variants */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800">Product Variants</h4>
                        <p className="text-[10px] text-gray-400 mt-0.5">Size, frame type, colour option sets shown on the product page</p>
                      </div>
                      <button type="button" onClick={() => appendVariant({ label: "", options: [] })}
                        className="inline-flex items-center gap-1 bg-violet-50 text-violet-600 hover:bg-violet-100 text-[10px] font-bold uppercase tracking-wider rounded-lg px-3 py-1.5 cursor-pointer shrink-0">
                        <Plus size={10} /> Add Variant
                      </button>
                    </div>
                    {variantFields.length === 0 ? (
                      <p className="text-[10px] text-gray-400 py-2">No variants added. Add sizing options, frame types, or other customer-selectable configurations.</p>
                    ) : (
                      <div className="space-y-3">
                        {variantFields.map((f, i) => (
                          <div key={f.id} className="border border-gray-100 rounded-xl p-4 bg-gray-50/40 space-y-3 relative">
                            <button type="button" onClick={() => removeVariant(i)} className="absolute top-2 right-2 p-1.5 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"><Trash2 size={12} /></button>
                            <RHFControl control="input" name={`variants.${i}.label`} label="Variant Label *" placeholder="e.g. Size, Frame Type, Colour" className="rounded-xl" />
                            <Controller name={`variants.${i}.options`} control={control}
                              render={({ field: optField, fieldState: { error } }) => {
                                const raw = Array.isArray(optField.value) ? (optField.value as string[]).join(", ") : "";
                                return (
                                  <div className="space-y-1.5">
                                    <label className="text-[10px] font-semibold uppercase tracking-widest text-secondary/60">
                                      Options <span className="text-gray-400 normal-case tracking-normal font-normal">(comma-separated)</span>
                                    </label>
                                    <input type="text" defaultValue={raw} placeholder="e.g. Standard, Large, Extra Large"
                                      onBlur={(e) => optField.onChange(e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
                                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#ed1c27]/20 focus:border-[#ed1c27]/50 bg-white" />
                                    {error?.message && <p className="text-[10px] font-semibold text-red-500 uppercase">{error.message}</p>}
                                    {Array.isArray(optField.value) && (optField.value as string[]).length > 0 && (
                                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                                        {(optField.value as string[]).map((opt, oi) => (
                                          <span key={oi} className="px-2 py-0.5 bg-violet-50 text-violet-700 text-[10px] font-semibold rounded-md border border-violet-100">{opt}</span>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                );
                              }} />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Swatches */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800">Material Swatches</h4>
                        <p className="text-[10px] text-gray-400 mt-0.5">Colour/material customizer shown on the product page</p>
                      </div>
                      <button type="button" onClick={() => appendSwatch({ category: "", options: [] })}
                        className="inline-flex items-center gap-1 bg-amber-50 text-amber-600 hover:bg-amber-100 text-[10px] font-bold uppercase tracking-wider rounded-lg px-3 py-1.5 cursor-pointer shrink-0">
                        <Plus size={10} /> Add Swatch Category
                      </button>
                    </div>
                    {swatchFields.length === 0 ? (
                      <p className="text-[10px] text-gray-400 py-2">No swatch categories. Add palettes like Tabletop Finishes, Frame Coatings, or Mesh Upholstery.</p>
                    ) : (
                      <div className="space-y-4">
                        {swatchFields.map((sw, swI) => (
                          <div key={sw.id} className="border border-amber-100 rounded-xl p-4 bg-amber-50/20 space-y-4 relative">
                            <button type="button" onClick={() => removeSwatch(swI)} className="absolute top-2 right-2 p-1.5 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"><Trash2 size={12} /></button>
                            <RHFControl control="input" name={`swatches.${swI}.category`} label="Category Name *" placeholder="e.g. Tabletop Finishes" className="rounded-xl" />
                            <SwatchOptionsEditor swatchIndex={swI} control={control} />
                          </div>
                        ))}
                      </div>
                    )}
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
                          • <span className="font-bold uppercase">{key}</span>: {(err as { message?: string })?.message || "Required"}
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
                      <li>Upload at least 1 product image in the <strong>Media</strong> tab</li>
                      <li>Add specs like frame material and surface finish in <strong>Specs & Features</strong></li>
                      <li>Dimensions link to the blueprint image via coordinate labels (A, B, C…)</li>
                      <li>Variants appear as selectable option buttons on the product page</li>
                      <li>Swatches appear in the customization section of the product page</li>
                    </ul>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </div>

          {/* Bottom sticky save bar */}
          <div className="sticky bottom-0 z-30 bg-white/95 backdrop-blur border-t border-gray-100 -mx-6 px-6 py-3 flex items-center justify-between gap-4 shadow-[0_-4px_20px_-8px_rgba(0,0,0,0.08)]">
            <p className="text-[10px] text-gray-400 font-medium">All changes are saved to session storage and reflected instantly on the storefront.</p>
            <button type="submit" disabled={isSubmitting || savedSuccess}
              className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold uppercase tracking-wider text-xs text-white transition-all duration-300 cursor-pointer ${
                savedSuccess ? "bg-emerald-500" : "bg-[#ed1c27] hover:bg-[#c5141e] hover:-translate-y-0.5"
              } disabled:opacity-60`}>
              {savedSuccess ? <><CheckCircle2 size={14} /> Product Created!</> : <><Save size={14} /> Create Product</>}
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
