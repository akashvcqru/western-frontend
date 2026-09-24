import type { Metadata } from "next";
import GalleryClient from "./GalleryClient";

interface PageProps {
  params: Promise<{
    category?: string[];
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const categoryParam = resolvedParams?.category;
  const categorySlug = Array.isArray(categoryParam) ? categoryParam[0] : categoryParam;

  const categoryName = categorySlug
    ? categorySlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "All Projects";

  const title = categorySlug
    ? `${categoryName} Office Projects & Gallery`
    : "Project Gallery & Workspace Installations";

  const description = categorySlug
    ? `Explore our completed ${categoryName.toLowerCase()} interior installations, modular workstations, and turnkey corporate designs by Western Interio Gurgaon.`
    : "Browse completed office interior projects, executive cabins, acoustic systems, and modular office furniture installations across India by Western Interio.";

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
