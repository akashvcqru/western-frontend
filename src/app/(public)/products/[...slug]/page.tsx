import type { Metadata } from "next";
import ProductListingClient from "./ProductListingClient";

interface Props {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = Array.isArray(slug)
    ? slug.map((s) => decodeURIComponent(s).trim().toLowerCase().replace(/\s+/g, "-"))
    : [];

  const lastSegment = decodedSlug[decodedSlug.length - 1] || "";
  
  let entityTitle = "";
  let entityDescription = "";
  let entityImage = "";

  try {
    // 1. Check Category
    const catRes = await fetch("http://127.0.0.1:5073/api/categories?limit=100", { cache: "no-store" });
    if (catRes.ok) {
      const catJson = await catRes.json();
      const matchedCat = catJson.data?.find((c: any) => c.slug?.toLowerCase() === lastSegment || c.id === lastSegment);
      if (matchedCat) {
        entityTitle = matchedCat.metaTitle || matchedCat.name;
        entityDescription = matchedCat.metaDescription || matchedCat.description;
        entityImage = matchedCat.image;
      }
    }

    // 2. Check SubCategory if not found
    if (!entityTitle) {
      const subRes = await fetch("http://127.0.0.1:5073/api/categories/subcategories?limit=100", { cache: "no-store" });
      if (subRes.ok) {
        const subJson = await subRes.json();
        const matchedSub = subJson.data?.find((s: any) => s.slug?.toLowerCase() === lastSegment || s.id === lastSegment);
        if (matchedSub) {
          entityTitle = matchedSub.metaTitle || matchedSub.name;
          entityDescription = matchedSub.metaDescription || matchedSub.description;
          entityImage = matchedSub.image;
        }
      }
    }
  } catch {}

  const humanReadable = lastSegment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const finalTitle = entityTitle 
    ? entityTitle
    : `${humanReadable || "Products"} Collections`;

  const finalDescription = entityDescription || `Explore premium ${humanReadable || "office furniture"} collections, ergonomic designs, and modular workstation solutions at Western Interio Gurgaon.`;

  return {
    title: finalTitle,
    description: finalDescription,
    openGraph: {
      title: finalTitle,
      description: finalDescription,
      images: entityImage ? [entityImage] : [],
      type: "website",
    },
  };
}

export default function ProductListingPage({ params }: Props) {
  return <ProductListingClient params={params} />;
}
