"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { Card, AppModal, useAppToast, AdminPageHeader, Pagination, RHFControl, SearchInput } from "@/components/ui";
import { AppRoutes } from "@/constants/routes";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  price: string;
  status: string;
  stock: number;
  image: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  count: number;
  image: string;
  status: string;
}

const initialProducts: Product[] = [
  { id: "PROD-001", name: "Premium Vitrified Tiles", category: "Floor Tiles", brand: "Kajaria", price: "₹850/box", status: "Active", stock: 145, image: "https://bawadittamal.com/wp-content/uploads/2023/12/1.jpg" },
  { id: "PROD-002", name: "Wooden Finish Flooring", category: "Wooden Flooring", brand: "Greenply", price: "₹1,200/sqft", status: "Active", stock: 12, image: "https://bawadittamal.com/wp-content/uploads/2023/12/2.jpg" },
  { id: "PROD-003", name: "Ceramic Wall Tiles", category: "Wall Tiles", brand: "Somany", price: "₹650/box", status: "Active", stock: 89, image: "https://bawadittamal.com/wp-content/uploads/2023/12/3.jpg" },
  { id: "PROD-004", name: "Luxury Bathroom Fittings", category: "Bathroom Fittings", brand: "Jaquar", price: "₹4,500/set", status: "Inactive", stock: 0, image: "https://bawadittamal.com/wp-content/uploads/2023/12/4.jpg" },
  { id: "PROD-005", name: "Granite Countertop", category: "Granite & Marble", brand: "Local", price: "₹3,200/slab", status: "Active", stock: 34, image: "https://bawadittamal.com/wp-content/uploads/2023/12/5.jpg" },
];

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
  image: yup
    .string()
    .required("Product Image is required"),
  status: yup
    .string()
    .required("Status is required"),
});

type ProductFormData = yup.InferType<typeof productSchema>;

export default function AdminProductsPage() {
  const { addToast } = useAppToast();

  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

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
      category: "Floor Tiles",
      brand: "",
      price: "",
      stock: 10,
      image: "",
      status: "Active",
    },
  });

  const { reset } = methods;

  // Reset form when modal opens or editingProduct changes
  useEffect(() => {
    if (isModalOpen) {
      if (editingProduct) {
        reset({
          name: editingProduct.name,
          category: editingProduct.category,
          brand: editingProduct.brand,
          price: editingProduct.price,
          stock: editingProduct.stock,
          image: editingProduct.image,
          status: editingProduct.status,
        });
      } else {
        reset({
          name: "",
          category: "Floor Tiles",
          brand: "",
          price: "",
          stock: 10,
          image: "",
          status: "Active",
        });
      }
    }
  }, [isModalOpen, editingProduct, reset]);

  // Load from sessionStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("bdm_products");
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as Product[];
          const migrated = parsed.map((p) => {
            if (p.status !== "Active" && p.status !== "Inactive") {
              return {
                ...p,
                status: p.stock > 0 ? "Active" : "Inactive",
              };
            }
            return p;
          });
          // eslint-disable-next-line react-hooks/set-state-in-effect
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
    const defaultImage = "https://bawadittamal.com/wp-content/uploads/2023/12/1.jpg";
    const imageUrl = data.image?.trim() || defaultImage;

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
            image: imageUrl,
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
      const newId = `PROD-${String(products.length + 1).padStart(3, "0")}`;
      const newProduct: Product = {
        id: newId,
        name: data.name,
        category: data.category,
        brand: data.brand,
        price: data.price,
        stock: data.stock,
        status: data.status,
        image: imageUrl,
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
    { label: "Floor Tiles", value: "Floor Tiles" },
    { label: "Wall Tiles", value: "Wall Tiles" },
    { label: "Wooden Flooring", value: "Wooden Flooring" },
    { label: "Bathroom Fittings", value: "Bathroom Fittings" },
    { label: "Granite & Marble", value: "Granite & Marble" },
  ];
  const categoryOptions = categories.length > 0
    ? categories.map((c) => ({ label: c.name, value: c.name }))
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
            placeholder="Search by Consumer, Mobile or Code"
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
                          <Image src={prod.image} alt={prod.name} fill className="object-cover" />
                        </div>
                      </td>
                      <td className="py-3 px-6">
                        <p className="text-xs font-semibold text-gray-900">{prod.name}</p>
                        <p className="text-[10px] text-gray-400 font-medium mt-0.5">{prod.id}</p>
                      </td>
                      <td className="py-3 px-6">
                        <p className="text-xs font-medium text-gray-700">{prod.category}</p>
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
        size="md"
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
          <form id="product-form" onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <RHFControl
              control="input"
              name="name"
              label="Product Name *"
              placeholder="e.g. Designer Vitrified Tile"
              className="rounded-xl"
            />

            <div className="grid grid-cols-2 gap-4">
              {/* Category */}
              <RHFControl
                control="select"
                name="category"
                label="Category *"
                options={categoryOptions}
                className="rounded-xl"
              />

              {/* Brand */}
              <RHFControl
                control="input"
                name="brand"
                label="Brand *"
                placeholder="e.g. Kajaria"
                className="rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Price */}
              <RHFControl
                control="input"
                name="price"
                label="Price *"
                placeholder="e.g. ₹950/box"
                className="rounded-xl"
              />

              {/* Stock */}
              <RHFControl
                control="input"
                type="number"
                name="stock"
                label="Stock Quantity *"
                placeholder="e.g. 50"
                className="rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Status */}
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
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <label className="text-[10px] font-semibold uppercase tracking-widest text-secondary/60">
                Product Image *
              </label>
              <Controller
                name="image"
                control={methods.control}
                render={({ field, fieldState: { error } }) => {
                  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
                      <div className="border-2 border-dashed border-gray-200 hover:border-[#ed1c27]/50 rounded-xl p-4 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center gap-2 bg-gray-50/50 relative group min-h-[140px]">
                        {field.value ? (
                          <div className="relative w-full h-32 rounded-lg overflow-hidden border border-gray-100">
                            <Image
                              src={field.value}
                              alt="Product preview"
                              fill
                              className="object-cover"
                            />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                field.onChange("");
                              }}
                              className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-md transition-colors cursor-pointer z-10"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        ) : (
                          <>
                            <Upload className="w-8 h-8 text-gray-400 group-hover:text-[#ed1c27] transition-colors duration-300" />
                            <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Upload Image</span>
                            <span className="text-[9px] text-gray-400 font-semibold uppercase tracking-widest">Click or drag image file</span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                      </div>
                      {error?.message && (
                        <p className="text-[10px] font-semibold text-red-500 uppercase tracking-tight">{error.message}</p>
                      )}
                    </div>
                  );
                }}
              />
            </div>
          </form>
        </FormProvider>
      </AppModal>
    </div>
  );
}
