"use client";

import React from "react";
import { useParams, notFound } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useGetCategoriesQuery, useGetSubCategoriesQuery } from "@/redux/api/categoriesApi";
import { useGetProductsQuery } from "@/redux/api/productsApi";
import { useGetBlogsQuery } from "@/redux/api/blogsApi";

import BlogDetailPage from "../blog/[id]/page";
import ProductDetailPage from "../product/[id]/page";
import ProductListingPage from "../products/[...slug]/page";

export default function CatchAllRouterPage() {
  const params = useParams();
  const slug = params.slug as string[];

  const decodedSlug = React.useMemo(() => {
    return slug
      ? slug.map((s) => decodeURIComponent(s).trim().toLowerCase().replace(/\s+/g, "-"))
      : [];
  }, [slug]);

  const lastSegment = decodedSlug.length > 0 ? decodedSlug[decodedSlug.length - 1] : "";

  // 1. Fetch categories
  const { data: categoriesResult, isLoading: isCatsLoading } = useGetCategoriesQuery({ limit: 100 });
  const categoriesList = categoriesResult?.data || [];

  // 2. Fetch subcategories
  const { data: subCategoriesResult, isLoading: isSubsLoading } = useGetSubCategoriesQuery({ limit: 100 });
  const subcategoriesList = subCategoriesResult?.data || [];

  // 3. Fetch products
  const { data: productsResult, isLoading: isProdsLoading } = useGetProductsQuery({ limit: 1000 });
  const productsList = productsResult?.data || [];

  // 4. Fetch blogs
  const { data: blogsResult, isLoading: isBlogsLoading } = useGetBlogsQuery({ limit: 200 });
  const blogsList = blogsResult?.data || [];

  const isLoading = isCatsLoading || isSubsLoading || isProdsLoading || isBlogsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  // A. Check Blog match (matches if last segment is a blog ID or matches slug)
  const matchedBlog = blogsList.find(
    (b) =>
      (b.id && b.id.toLowerCase() === lastSegment) ||
      (b.title &&
        b.title
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/[\s_-]+/g, "-") === lastSegment)
  );
  if (matchedBlog) {
    return <BlogDetailPage id={matchedBlog.id} />;
  }

  // B. Check Product match
  const matchedProduct = productsList.find(
    (p) =>
      (p.slug && p.slug.toLowerCase() === lastSegment) ||
      (p.id && p.id.toLowerCase() === lastSegment)
  );
  if (matchedProduct) {
    return <ProductDetailPage id={matchedProduct.id} />;
  }

  // C. Check Category match
  const matchedCategory = categoriesList.find(
    (c) =>
      (c.slug && c.slug.toLowerCase() === lastSegment) ||
      (c.id && c.id.toLowerCase() === lastSegment)
  );

  // D. Check SubCategory match
  const matchedSubCategory = subcategoriesList.find(
    (s) =>
      (s.slug && s.slug.toLowerCase() === lastSegment) ||
      (s.id && s.id.toLowerCase() === lastSegment)
  );

  if (matchedCategory || matchedSubCategory) {
    return <ProductListingPage />;
  }

  // If nothing matches, trigger notFound
  notFound();
  return null;
}
