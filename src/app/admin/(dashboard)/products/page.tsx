"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { Card, AppModal, useAppToast, AdminPageHeader, Pagination, RHFControl, SearchInput } from "@/components/ui";
import { AppRoutes } from "@/constants/routes";
import { useForm, FormProvider, Controller, useWatch, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import initialProductsData from "@/data/products.json";

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
}

interface Category {
  id: string;
  name: string;
  description: string;
  count: number;
  image: string;
  status: string;
  slug?: string;
}

const initialProducts: Product[] = initialProductsData.map((p: any) => ({
  id: p.id || p.slug || "",
  slug: p.slug || p.id || "",
  name: p.name || "",
  category: p.category || "",
  brand: p.brand || "Western",
  price: p.price || "",
  status: p.status || "Active",
  stock: p.stock !== undefined ? p.stock : 10,
  description: p.description || "",
  images: Array.isArray(p.images) ? p.images : (p.image ? [p.image] : []),
  catNo: p.catNo || "",
  blueprintImage: p.blueprintImage || "",
  features: Array.isArray(p.features) ? p.features : [],
  specifications: Array.isArray(p.specifications) ? p.specifications : [],
  dimensions: Array.isArray(p.dimensions) ? p.dimensions : [],
  resources: Array.isArray(p.resources) ? p.resources : [],
}));

// Helper to generate slug
const generateSlug = (name: string) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

// Validation Schema
const productSchema = yup.object().shape({
  name: yup
    .string()
    .required("Product Name is required")
    .min(3, "Product Name must be at least 3 characters"),
  category: yup
    .string()
    .required("Category is required"),
  brand: yup
    .string()
    .required("Brand is required"),
  price: yup
    .string()
    .required("Price is required"),
  stock: yup
    .number()
    .typeError("Stock must be a number")
    .required("Stock Quantity is required")
    .min(0, "Stock Quantity cannot be negative"),
  status: yup
    .string()
    .required("Status is required"),
  description: yup
    .string()
    .required("Description is required"),
  catNo: yup
    .string()
    .nullable()
    .optional(),
  blueprintImage: yup
    .string()
    .nullable()
    .optional(),
  images: yup
    .array()
    .of(yup.string().required())
    .min(1, "At least one product image is required")
    .required("Product images are required"),
  features: yup
    .array()
    .of(
      yup.object().shape({
        title: yup.string().required("Feature title is required"),
        desc: yup.string().required("Feature description is required"),
      })
    )
    .optional(),
  specifications: yup
    .array()
    .of(
      yup.object().shape({
        label: yup.string().required("Label is required"),
        value: yup.string().required("Value is required"),
      })
    )
    .optional(),
  dimensions: yup
    .array()
    .of(
      yup.object().shape({
        name: yup.string().required("Dimension name is required"),
        range: yup.string().required("Dimension range is required"),
        coord: yup.string().required("Coordinate label is required"),
      })
    )
    .optional(),
  resources: yup
    .array()
    .of(
      yup.object().shape({
        id: yup.string().required("Resource ID is required"),
        title: yup.string().required("Resource title is required"),
        desc: yup.string().required("Resource description is required"),
        format: yup.string().required("Resource format is required"),
        size: yup.string().required("Resource size is required"),
      })
    )
    .optional(),
});

type ProductFormData = yup.InferType<typeof productSchema>;

export default function AdminProductsPage() {
  const { addToast } = useAppToast();

  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"general" | "media" | "specs" | "advanced">("general");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // React Hook Form Configuration
  const methods = useForm<ProductFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(productSchema) as any,
    defaultValues: {
      name: "",
      category: "",
      brand: "Western",
      price: "",
      stock: 10,
      status: "Active",
      description: "",
      catNo: "",
      blueprintImage: "",
      images: [],
      features: [],
      specifications: [],
      dimensions: [],
      resources: [],
    },
  });

  const { reset, setValue, control } = methods;
  const watchedStatus = useWatch({ control, name: "status" });

  // Field Arrays
  const { fields: featureFields, append: appendFeature, remove: removeFeature } = useFieldArray({
    control,
    name: "features",
  });

  const { fields: specFields, append: appendSpec, remove: removeSpec } = useFieldArray({
    control,
    name: "specifications",
  });

  const { fields: dimFields, append: appendDim, remove: removeDim } = useFieldArray({
    control,
    name: "dimensions",
  });

  const { fields: resFields, append: appendRes, remove: removeRes } = useFieldArray({
    control,
    name: "resources",
  });

  // Automatically adjust stock based on status
  useEffect(() => {
    if (watchedStatus === "Inactive") {
      setValue("stock", 0);
    } else if (watchedStatus === "Active") {
      const currentStock = methods.getValues("stock");
      if (currentStock === undefined || currentStock === null || currentStock <= 0) {
        setValue("stock", 10);
      }
    }
  }, [watchedStatus, setValue, methods]);

  // Reset form when modal opens or editingProduct changes
  useEffect(() => {
    if (isModalOpen) {
      if (editingProduct) {
        reset({
          name: editingProduct.name || "",
          category: editingProduct.category || "",
          brand: editingProduct.brand || "Western",
          price: editingProduct.price || "",
          stock: editingProduct.stock !== undefined ? editingProduct.stock : 10,
          status: editingProduct.status || "Active",
          description: editingProduct.description || "",
          catNo: editingProduct.catNo || "",
          blueprintImage: editingProduct.blueprintImage || "",
          images: editingProduct.images || [],
          features: editingProduct.features || [],
          specifications: editingProduct.specifications || [],
          dimensions: editingProduct.dimensions || [],
          resources: editingProduct.resources || [],
        });
      } else {
        reset({
          name: "",
          category: categories[0]?.id || categories[0]?.slug || "",
          brand: "Western",
          price: "",
          stock: 10,
          status: "Active",
          description: "",
          catNo: "",
          blueprintImage: "",
          images: [],
          features: [],
          specifications: [],
          dimensions: [],
          resources: [],
        });
      }
      setActiveTab("general");
    }
  }, [isModalOpen, editingProduct, reset, categories]);

  // Load from sessionStorage on mount
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("bdm_products");
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as Product[];
          const migrated = parsed.map((p) => {
            return {
              ...p,
              status: p.status || (p.stock > 0 ? "Active" : "Inactive"),
              stock: p.stock !== undefined ? p.stock : 10,
              images: Array.isArray(p.images) ? p.images : (p.image ? [p.image] : []),
              features: Array.isArray(p.features) ? p.features : [],
              specifications: Array.isArray(p.specifications) ? p.specifications : [],
              dimensions: Array.isArray(p.dimensions) ? p.dimensions : [],
              resources: Array.isArray(p.resources) ? p.resources : [],
            };
          });
          setProducts(migrated);
        } catch {
          setProducts(initialProducts);
        }
      } else {
        setProducts(initialProducts);
        sessionStorage.setItem("bdm_products", JSON.stringify(initialProducts));
      }

      const storedCats = sessionStorage.getItem("bdm_categories");
      if (storedCats) {
        try {
          setCategories(JSON.parse(storedCats));
        } catch {
          setCategories([]);
        }
      }
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  // Save to sessionStorage helper
  const saveProducts = (updatedList: Product[]) => {
    setProducts(updatedList);
    sessionStorage.setItem("bdm_products", JSON.stringify(updatedList));
  };

  // Open Modal for Create
  const handleAddClick = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  // Open Modal for Edit
  const handleEditClick = (prod: Product) => {
    setEditingProduct(prod);
    setIsModalOpen(true);
  };

  // Handle Delete
  const handleDeleteClick = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      const updated = products.filter((p) => p.id !== id);
      saveProducts(updated);
      addToast({
        title: "Product Deleted",
        message: `"${name}" has been removed successfully.`,
        variant: "info",
      });
    }
  };

  // Handle Form Submit
  const onSubmit = (data: ProductFormData) => {
    const defaultImage = "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=2070&auto=format&fit=crop";
    const imagesList = data.images && data.images.length > 0 ? data.images : [defaultImage];

    if (editingProduct) {
      // Edit mode
      const updated = products.map((p) => {
        if (p.id === editingProduct.id) {
          return {
            ...p,
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
          };
        }
        return p;
      });
      saveProducts(updated);
      addToast({
        title: "Product Updated",
        message: `"${data.name}" has been updated successfully.`,
        variant: "success",
      });
    } else {
      // Create mode
      const slug = generateSlug(data.name);
      let uniqueId = slug;
      let counter = 1;
      while (products.some((p) => p.id === uniqueId || p.slug === uniqueId)) {
        uniqueId = `${slug}-${counter}`;
        counter++;
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
      };
      const updated = [newProduct, ...products];
      saveProducts(updated);
      addToast({
        title: "Product Created",
        message: `"${data.name}" was successfully added to the catalog.`,
        variant: "success",
      });
    }

    setIsModalOpen(false);
  };

  // Filter products based on search
  const filteredProducts = products.filter((prod) => {
    return (
      prod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prod.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prod.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const defaultCategoryOptions = [
    { label: "Floor Tiles", value: "floor-tiles" },
    { label: "Wall Tiles", value: "wall-tiles" },
    { label: "Wooden Flooring", value: "wooden-flooring" },
    { label: "Bathroom Fittings", value: "bathroom-fittings" },
    { label: "Granite & Marble", value: "granite-marble" },
  ];
  const categoryOptions = categories.length > 0
    ? categories.map((c) => ({ label: c.name, value: c.id || c.slug || "" }))
    : defaultCategoryOptions;

  return (
    <div className="space-y-6">
      {/* Admin Page Header with Breadcrumb */}
      <AdminPageHeader
        title="Products"
        breadcrumbs={[
          { label: "Admin", href: AppRoutes.Admin.Dashboard },
          { label: "Products" },
        ]}
      />

      {/* Data Table with Integrated Toolbar */}
      <Card>
        <Card.Header>
          {/* Left: Search input */}
          <SearchInput
            placeholder="Search products by name, brand or ID..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            wrapperClassName="max-w-sm"
          />

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            {/* Add Product button */}
            <button
              id="add-product-btn"
              onClick={handleAddClick}
              className="inline-flex items-center justify-center gap-2 bg-[#ed1c27] hover:bg-[#c5141e] text-white font-bold uppercase tracking-[0.12em] text-[10px] rounded-xl px-5 py-2 transition-all duration-300 cursor-pointer hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#ed1c27]/25"
            >
              <Plus size={14} /> Add Product
            </button>
          </div>
        </Card.Header>

        <Card.Body noPadding>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-400 w-16">Image</th>
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">Product</th>
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">Category & Brand</th>
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">Price</th>
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</th>
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginatedProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-xs font-medium text-gray-400">
                      No products found matching your search.
                    </td>
                  </tr>
                ) : (
                  paginatedProducts.map((prod) => (
                    <tr key={prod.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="py-3 px-6">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden relative border border-gray-100">
                          <Image src={prod.images?.[0] || prod.image || "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=2070&auto=format&fit=crop"} alt={prod.name} fill className="object-cover" />
                        </div>
                      </td>
                      <td className="py-3 px-6">
                        <p className="text-xs font-semibold text-gray-900">{prod.name}</p>
                        <p className="text-[10px] text-gray-400 font-medium mt-0.5">{prod.id}</p>
                      </td>
                      <td className="py-3 px-6">
                        <p className="text-xs font-medium text-gray-700">
                          {categories.find((c) => c.id === prod.category || c.slug === prod.category)?.name || prod.category}
                        </p>
                        <p className="text-[10px] text-gray-400 font-medium mt-0.5">{prod.brand}</p>
                      </td>
                      <td className="py-3 px-6 text-xs font-semibold text-gray-900">
                        {prod.price}
                      </td>
                      <td className="py-3 px-6">
                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest ${
                          prod.status === "Active" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                        }`}>
                          {prod.status} ({prod.stock})
                        </span>
                      </td>
                      <td className="py-3 px-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEditClick(prod)}
                            className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit Product"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(prod.id, prod.name)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Product"
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
            totalItems={filteredProducts.length}
            pageSizeOptions={[5, 10, 20, 50]}
          />
        </Card.Footer>
      </Card>

      {/* App Modal for Add/Edit */}
      <AppModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? "Edit Product" : "Add New Product"}
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
              form="product-form"
              className="px-5 py-2 bg-[#ed1c27] hover:bg-[#c5141e] text-white font-bold uppercase tracking-wider text-xs rounded-xl cursor-pointer shadow-lg shadow-[#ed1c27]/10"
            >
              {editingProduct ? "Save Changes" : "Create Product"}
            </button>
          </>
        }
      >
        <FormProvider {...methods}>
          <form id="product-form" onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
            {/* Tabs Header */}
            <div className="flex border-b border-gray-100 mb-6">
              {(["general", "media", "specs", "advanced"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2.5 text-center text-xs font-bold uppercase tracking-wider border-b-2 transition-all duration-300 ${
                    activeTab === tab
                      ? "border-[#ed1c27] text-gray-900"
                      : "border-transparent text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {tab === "general" && "General Info"}
                  {tab === "media" && "Media / Images"}
                  {tab === "specs" && "Specs & Features"}
                  {tab === "advanced" && "Advanced"}
                </button>
              ))}
            </div>

            {/* General Tab */}
            <div className={activeTab === "general" ? "space-y-4" : "hidden"}>
              <RHFControl
                control="input"
                name="name"
                label="Product Name *"
                placeholder="e.g. WFU 001 Workstation"
                className="rounded-xl"
              />

              <div className="grid grid-cols-2 gap-4">
                <RHFControl
                  control="select"
                  name="category"
                  label="Category *"
                  options={categoryOptions}
                  className="rounded-xl"
                />
                <RHFControl
                  control="input"
                  name="brand"
                  label="Brand *"
                  placeholder="e.g. Western"
                  className="rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <RHFControl
                  control="input"
                  name="price"
                  label="Price *"
                  placeholder="e.g. 24,500"
                  className="rounded-xl"
                />
                <RHFControl
                  control="input"
                  name="catNo"
                  label="Catalog Number (Cat. No.)"
                  placeholder="e.g. wfu-001"
                  className="rounded-xl"
                />
              </div>

              <RHFControl
                control="select"
                name="status"
                label="Status *"
                options={[
                  { label: "Active", value: "Active" },
                  { label: "Inactive", value: "Inactive" },
                ]}
                className="rounded-xl"
              />

              <RHFControl
                control="textarea"
                name="description"
                label="Description *"
                placeholder="Provide a detailed description of the product..."
                className="rounded-xl"
              />
            </div>

            {/* Media Tab */}
            <div className={activeTab === "media" ? "space-y-4" : "hidden"}>
              <div className="space-y-2">
                <label className="text-[10px] font-semibold uppercase tracking-widest text-secondary/60">
                  Product Images (At least 1 required) *
                </label>
                <Controller
                  name="images"
                  control={control}
                  render={({ field, fieldState: { error } }) => {
                    const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                      const files = e.target.files;
                      if (files && files.length > 0) {
                        const fileList = Array.from(files);
                        const loadPromises = fileList.map((file) => {
                          return new Promise<string>((resolve) => {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              resolve(reader.result as string);
                            };
                            reader.readAsDataURL(file);
                          });
                        });

                        Promise.all(loadPromises).then((base64Urls) => {
                          field.onChange([...(field.value || []), ...base64Urls]);
                        });
                      }
                    };

                    const removeImageAtIndex = (index: number) => {
                      const updated = [...(field.value || [])];
                      updated.splice(index, 1);
                      field.onChange(updated);
                    };

                    return (
                      <div className="space-y-4">
                        <div className="border-2 border-dashed border-gray-200 hover:border-[#ed1c27]/50 rounded-xl p-6 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center gap-2 bg-gray-50/50 relative group min-h-[140px]">
                          <Upload className="w-8 h-8 text-gray-400 group-hover:text-[#ed1c27] transition-colors duration-300" />
                          <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Upload Product Images</span>
                          <span className="text-[9px] text-gray-400 font-semibold uppercase tracking-widest">Click or drag image files (multiple allowed)</span>
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFilesChange}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                          />
                        </div>
                        
                        {field.value && field.value.length > 0 && (
                          <div className="grid grid-cols-3 gap-4">
                            {field.value.map((url: string, index: number) => (
                              <div key={index} className="relative aspect-video rounded-lg overflow-hidden border border-gray-100 group/item">
                                <Image
                                  src={url}
                                  alt={`Product preview ${index + 1}`}
                                  fill
                                  className="object-cover"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeImageAtIndex(index)}
                                  className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded shadow-md transition-colors cursor-pointer z-10 opacity-0 group-hover/item:opacity-100"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        {error?.message && (
                          <p className="text-[10px] font-semibold text-red-500 uppercase tracking-tight">{error.message}</p>
                        )}
                      </div>
                    );
                  }}
                />
              </div>
            </div>

            {/* Specs & Features Tab */}
            <div className={activeTab === "specs" ? "space-y-6" : "hidden"}>
              {/* Specifications */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800">Specifications</h4>
                  <button
                    type="button"
                    onClick={() => appendSpec({ label: "", value: "" })}
                    className="inline-flex items-center justify-center gap-1 bg-blue-50 text-blue-600 hover:bg-blue-100 text-[10px] font-bold uppercase tracking-wider rounded-lg px-3 py-1.5 transition-colors cursor-pointer"
                  >
                    <Plus size={10} /> Add Spec
                  </button>
                </div>

                {specFields.length === 0 ? (
                  <p className="text-[10px] text-gray-400 font-medium py-2">No specifications added yet. Add some specs details like Materials, Finish, or Ergonomics.</p>
                ) : (
                  <div className="space-y-3">
                    {specFields.map((field, index) => (
                      <div key={field.id} className="flex gap-3 items-end">
                        <div className="flex-1">
                          <RHFControl
                            control="input"
                            name={`specifications.${index}.label`}
                            label={index === 0 ? "Label *" : ""}
                            placeholder="e.g. Frame Material"
                            className="rounded-xl"
                          />
                        </div>
                        <div className="flex-1">
                          <RHFControl
                            control="input"
                            name={`specifications.${index}.value`}
                            label={index === 0 ? "Value *" : ""}
                            placeholder="e.g. Powder Coated Metal"
                            className="rounded-xl"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeSpec(index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer mb-1 shrink-0"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Features */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800">Features</h4>
                  <button
                    type="button"
                    onClick={() => appendFeature({ title: "", desc: "" })}
                    className="inline-flex items-center justify-center gap-1 bg-blue-50 text-blue-600 hover:bg-blue-100 text-[10px] font-bold uppercase tracking-wider rounded-lg px-3 py-1.5 transition-colors cursor-pointer"
                  >
                    <Plus size={10} /> Add Feature
                  </button>
                </div>

                {featureFields.length === 0 ? (
                  <p className="text-[10px] text-gray-400 font-medium py-2">No features added yet. Add highlighting features like Ergonomic support, smart controls, etc.</p>
                ) : (
                  <div className="space-y-3">
                    {featureFields.map((field, index) => (
                      <div key={field.id} className="flex gap-3 items-end">
                        <div className="flex-1">
                          <RHFControl
                            control="input"
                            name={`features.${index}.title`}
                            label={index === 0 ? "Feature Title *" : ""}
                            placeholder="e.g. Ergonomic Lumbar"
                            className="rounded-xl"
                          />
                        </div>
                        <div className="flex-[2]">
                          <RHFControl
                            control="input"
                            name={`features.${index}.desc`}
                            label={index === 0 ? "Feature Description *" : ""}
                            placeholder="e.g. Contour backrest with mechanical adjustments"
                            className="rounded-xl"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer mb-1 shrink-0"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Advanced Tab */}
            <div className={activeTab === "advanced" ? "space-y-6" : "hidden"}>
              {/* Blueprint Image */}
              <div className="space-y-2">
                <label className="text-[10px] font-semibold uppercase tracking-widest text-secondary/60">
                  Blueprint Image
                </label>
                <Controller
                  name="blueprintImage"
                  control={control}
                  render={({ field }) => {
                    const handleBlueprintChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          field.onChange(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    };

                    return (
                      <div className="space-y-2">
                        <div className="border-2 border-dashed border-gray-200 hover:border-[#ed1c27]/50 rounded-xl p-4 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center gap-2 bg-gray-50/50 relative group min-h-[120px]">
                          {field.value ? (
                            <div className="relative w-full h-24 rounded-lg overflow-hidden border border-gray-100">
                              <Image
                                src={field.value}
                                alt="Blueprint preview"
                                fill
                                className="object-contain"
                              />
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  field.onChange("");
                                }}
                                className="absolute top-1 right-1 p-1 bg-red-500 hover:bg-red-600 text-white rounded shadow-md transition-colors cursor-pointer z-10"
                              >
                                <Trash2 size={10} />
                              </button>
                            </div>
                          ) : (
                            <>
                              <Upload className="w-6 h-6 text-gray-400 group-hover:text-[#ed1c27] transition-colors duration-300" />
                              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Upload Blueprint Image</span>
                            </>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleBlueprintChange}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                          />
                        </div>
                      </div>
                    );
                  }}
                />
              </div>

              {/* Dimensions */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800">Dimensions (Blueprint Mapping)</h4>
                  <button
                    type="button"
                    onClick={() => appendDim({ name: "", range: "", coord: "" })}
                    className="inline-flex items-center justify-center gap-1 bg-blue-50 text-blue-600 hover:bg-blue-100 text-[10px] font-bold uppercase tracking-wider rounded-lg px-3 py-1.5 transition-colors cursor-pointer"
                  >
                    <Plus size={10} /> Add Dimension
                  </button>
                </div>

                {dimFields.length === 0 ? (
                  <p className="text-[10px] text-gray-400 font-medium py-2">No dimensions added. Add mapping references coordinates like A, B, C matching your blueprint.</p>
                ) : (
                  <div className="space-y-3">
                    {dimFields.map((field, index) => (
                      <div key={field.id} className="flex gap-2 items-end">
                        <div className="w-20">
                          <RHFControl
                            control="input"
                            name={`dimensions.${index}.coord`}
                            label={index === 0 ? "Coord *" : ""}
                            placeholder="e.g. A"
                            className="rounded-xl"
                          />
                        </div>
                        <div className="flex-1">
                          <RHFControl
                            control="input"
                            name={`dimensions.${index}.name`}
                            label={index === 0 ? "Dimension Name *" : ""}
                            placeholder="e.g. Total Height"
                            className="rounded-xl"
                          />
                        </div>
                        <div className="flex-1">
                          <RHFControl
                            control="input"
                            name={`dimensions.${index}.range`}
                            label={index === 0 ? "Range *" : ""}
                            placeholder="e.g. 980-1120 mm"
                            className="rounded-xl"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeDim(index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer mb-1 shrink-0"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Resources */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800">Downloadable Resources</h4>
                  <button
                    type="button"
                    onClick={() => appendRes({ id: `res-${Date.now()}`, title: "", desc: "", format: "PDF", size: "2.4 MB" })}
                    className="inline-flex items-center justify-center gap-1 bg-blue-50 text-blue-600 hover:bg-blue-100 text-[10px] font-bold uppercase tracking-wider rounded-lg px-3 py-1.5 transition-colors cursor-pointer"
                  >
                    <Plus size={10} /> Add Resource
                  </button>
                </div>

                {resFields.length === 0 ? (
                  <p className="text-[10px] text-gray-400 font-medium py-2">No resources added. You can attach user guides, installation booklets, spec sheets.</p>
                ) : (
                  <div className="space-y-3">
                    {resFields.map((field, index) => (
                      <div key={field.id} className="border border-gray-100 rounded-xl p-3 bg-gray-50/50 space-y-3 relative">
                        <button
                          type="button"
                          onClick={() => removeRes(index)}
                          className="absolute top-2 right-2 p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 size={12} />
                        </button>
                        <div className="grid grid-cols-2 gap-3">
                          <RHFControl
                            control="input"
                            name={`resources.${index}.title`}
                            label="Resource Title *"
                            placeholder="e.g. Specification Sheet"
                            className="rounded-xl"
                          />
                          <RHFControl
                            control="input"
                            name={`resources.${index}.desc`}
                            label="Brief Description *"
                            placeholder="e.g. Complete technical dimensions details"
                            className="rounded-xl"
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <RHFControl
                            control="input"
                            name={`resources.${index}.format`}
                            label="Format *"
                            placeholder="e.g. PDF"
                            className="rounded-xl"
                          />
                          <RHFControl
                            control="input"
                            name={`resources.${index}.size`}
                            label="Size *"
                            placeholder="e.g. 1.8 MB"
                            className="rounded-xl"
                          />
                          <RHFControl
                            control="input"
                            name={`resources.${index}.id`}
                            label="Resource ID *"
                            placeholder="e.g. spec-sheet"
                            className="rounded-xl"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </form>
        </FormProvider>
      </AppModal>
    </div>
  );
}
