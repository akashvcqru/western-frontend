import type { Metadata } from "next";
import ProductListingClient from "./ProductListingClient";
import { getApiBaseUrl, cleanDescription } from "@/lib/server-seo";

interface Props {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = Array.isArray(slug)
    ? slug.map((s) => decodeURIComponent(s).trim().toLowerCase().replace(/\s+/g, "-"))
    : [];

  const lastSegment = decodedSlug[decodedSlug.length - 1] || "";
  const baseUrl = getApiBaseUrl();
  
  let entityTitle = "";
  let entityDescription = "";
  let entityImage = "";

  try {
    // 1. Check Product first (individual product pages are nested under /products/.../slug)
    const prodRes = await fetch(`${baseUrl}/api/products/${encodeURIComponent(lastSegment)}`, {
      cache: "no-store",
      next: { revalidate: 0 },
    });
    if (prodRes.ok) {
      const prodJson = await prodRes.json();
      const product = prodJson.data;
      if (product) {
        entityTitle = product.metaTitle || product.name;
        entityDescription = product.metaDescription || product.description;
        entityImage = product.images?.[0] || product.image || "";
      }
    }

    // 2. Check Category if not found
    if (!entityTitle) {
      const catRes = await fetch(`${baseUrl}/api/categories?limit=100`, {
        cache: "no-store",
        next: { revalidate: 0 },
      });
      if (catRes.ok) {
        const catJson = await catRes.json();
        const matchedCat = catJson.data?.find(
          (c: any) => c.slug?.toLowerCase() === lastSegment || c.id?.toLowerCase() === lastSegment
        );
        if (matchedCat) {
          entityTitle = matchedCat.metaTitle || matchedCat.name;
          entityDescription = matchedCat.metaDescription || matchedCat.description;
          entityImage = matchedCat.image || "";
        }
      }
    }

    // 3. Check SubCategory if not found
    if (!entityTitle) {
      const subRes = await fetch(`${baseUrl}/api/categories/subcategories?limit=100`, {
        cache: "no-store",
        next: { revalidate: 0 },
      });
      if (subRes.ok) {
        const subJson = await subRes.json();
        const matchedSub = subJson.data?.find(
          (s: any) => s.slug?.toLowerCase() === lastSegment || s.id?.toLowerCase() === lastSegment
        );
        if (matchedSub) {
          entityTitle = matchedSub.metaTitle || matchedSub.name;
          entityDescription = matchedSub.metaDescription || matchedSub.description;
          entityImage = matchedSub.image || "";
        }
      }
    }
  } catch {}

  const humanReadable = lastSegment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const finalTitle = entityTitle 
    ? entityTitle
    : `${humanReadable || "Products"} Collections | Western Interio`;

  const fallbackDesc = `Explore premium ${humanReadable || "office furniture"} collections, ergonomic designs, and modular workstation solutions at Western Interio Gurgaon.`;
  const finalDescription = cleanDescription(entityDescription, fallbackDesc);

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
