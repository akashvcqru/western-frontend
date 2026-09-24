import type { Metadata } from "next";
import ProductDetailClient from "./ProductDetailClient";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  
  let productTitle = "";
  let productDescription = "";
  let productImage = "";

  try {
    const res = await fetch(`http://127.0.0.1:5073/api/products/${encodeURIComponent(id)}`, { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      const product = json.data;
      if (product) {
        productTitle = product.metaTitle || product.name;
        productDescription = product.metaDescription || product.description;
        productImage = product.images?.[0] || "";
      }
    }
  } catch {}

  const humanReadable = id.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const formattedTitle = productTitle 
    ? productTitle
    : humanReadable;

  const formattedDescription = productDescription 
    ? productDescription.replace(/<[^>]*>?/gm, "").slice(0, 160)
    : `Buy ${humanReadable} from Western Interio Gurgaon. Premium quality ergonomic office furniture, modular workstations, and custom finishes.`;

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
