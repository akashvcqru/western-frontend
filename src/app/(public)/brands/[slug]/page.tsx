import type { Metadata } from "next";
import BrandClient from "./BrandClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const brandName = slug.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");

  const title = `${brandName} Office Furniture Collections`;
  const description = `Explore genuine ${brandName} office furniture, ergonomic seating, desks, and architectural solutions at Western Interio Gurgaon.`;

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

export default function BrandPage() {
  return <BrandClient />;
}
