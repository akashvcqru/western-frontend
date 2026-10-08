import type { Metadata } from "next";
import GalleryClient from "./GalleryClient";
import { getPageMetadata } from "@/lib/server-seo";

interface PageProps {
  params: Promise<{
    category?: string[];
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const categoryParam = resolvedParams?.category;
  const categorySlug = Array.isArray(categoryParam) ? categoryParam[0] : categoryParam;

  if (!categorySlug) {
    return getPageMetadata(
      "/gallery",
      "Office Furniture Project Gallery & Workstation Portfolio | Western Interio",
      "Browse completed office interior projects, executive cabins, acoustic systems, and modular office furniture installations across India by Western Interio."
    );
  }

  const categoryName = categorySlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const title = `${categoryName} Office Projects & Gallery | Western Interio`;
  const description = `Explore our completed ${categoryName.toLowerCase()} interior installations, modular workstations, and turnkey corporate designs by Western Interio Gurgaon.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

export default function GalleryPage({ params }: PageProps) {
  return <GalleryClient params={params} />;
}
