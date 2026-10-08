import type { Metadata } from "next";
import ProductDetailClient from "./ProductDetailClient";
import { getApiBaseUrl, cleanDescription } from "@/lib/server-seo";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const baseUrl = getApiBaseUrl();
  
  let productTitle = "";
  let productDescription = "";
  let productImage = "";

  try {
    const res = await fetch(`${baseUrl}/api/products/${encodeURIComponent(id)}`, {
      cache: "no-store",
      next: { revalidate: 0 },
    });
    if (res.ok) {
      const json = await res.json();
      const product = json.data;
      if (product) {
        productTitle = product.metaTitle || product.name;
        productDescription = product.metaDescription || product.description;
        productImage = product.images?.[0] || product.image || "";
      }
    }
  } catch {}

  const humanReadable = id.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const formattedTitle = productTitle 
    ? productTitle
    : `${humanReadable} | Western Interio`;

  const fallbackDesc = `Buy ${humanReadable} from Western Interio Gurgaon. Premium quality ergonomic office furniture, modular workstations, and custom finishes.`;
  const formattedDescription = cleanDescription(productDescription, fallbackDesc);

  return {
    title: formattedTitle,
    description: formattedDescription,
    openGraph: {
      title: formattedTitle,
      description: formattedDescription,
      images: productImage ? [productImage] : [],
      type: "website",
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const resolved = await params;
  return <ProductDetailClient id={resolved.id} />;
}
