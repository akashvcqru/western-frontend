import type { Metadata } from "next";
import CatchAllClient from "./CatchAllClient";

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
    // 1. Check Blog
    const blogRes = await fetch(`http://127.0.0.1:5073/api/blogs/${encodeURIComponent(lastSegment)}`, { cache: "no-store" });
    if (blogRes.ok) {
      const blogJson = await blogRes.json();
      if (blogJson.data) {
        entityTitle = blogJson.data.metaTitle || blogJson.data.title;
        entityDescription = blogJson.data.metaDescription || (Array.isArray(blogJson.data.content) ? blogJson.data.content[0] : blogJson.data.content);
        entityImage = blogJson.data.image;
      }
    }

    // 2. Check Product
    if (!entityTitle) {
      const prodRes = await fetch(`http://127.0.0.1:5073/api/products/${encodeURIComponent(lastSegment)}`, { cache: "no-store" });
      if (prodRes.ok) {
        const prodJson = await prodRes.json();
        if (prodJson.data) {
          entityTitle = prodJson.data.metaTitle || prodJson.data.name;
          entityDescription = prodJson.data.metaDescription || prodJson.data.description;
          entityImage = prodJson.data.images?.[0] || "";
        }
      }
    }

    // 3. Check Category
    if (!entityTitle) {
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
    }

    // 4. Check SubCategory
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
    : (humanReadable || "Office Furniture");

  const finalDescription = entityDescription 
    ? entityDescription.replace(/<[^>]*>?/gm, "").slice(0, 160)
    : `Explore ${humanReadable || "modular office furniture"} from Western Interio Gurgaon. High quality ergonomic workspace solutions.`;

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

export default function CatchAllRouterPage() {
  return <CatchAllClient />;
}
