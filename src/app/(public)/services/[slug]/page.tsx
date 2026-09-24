import type { Metadata } from "next";
import ServiceDetailClient from "./ServiceDetailClient";
import servicesData from "@/data/services.json";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  
  // 1. Check static services json
  const staticDetail = (servicesData as any[]).find((s) => s.slug === slug);
  
  // 2. Fallback to API if running
  let serviceTitle = staticDetail?.name || staticDetail?.hero?.title;
  let serviceDescription = staticDetail?.hero?.description || staticDetail?.philosophy?.description;
  let serviceImage = staticDetail?.hero?.image;

  if (!serviceTitle) {
    try {
      const res = await fetch(`http://127.0.0.1:5073/api/services?limit=100`, { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        const found = json.data?.find((s: any) => s.slug === slug);
        if (found) {
          serviceTitle = found.title;
          serviceDescription = found.description;
          serviceImage = found.image;
        }
      }
    } catch {}
  }

  const formattedTitle = serviceTitle 
    ? `${serviceTitle} | Western Interio Services`
    : `${slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} | Western Interio Services`;

  const formattedDescription = serviceDescription || `Explore professional ${slug.replace(/-/g, " ")} workspace solutions, turnkey manufacturing, and spatial design by Western Interio Gurgaon.`;

  return {
    title: formattedTitle,
    description: formattedDescription,
    openGraph: {
      title: formattedTitle,
      description: formattedDescription,
      images: serviceImage ? [serviceImage] : [],
      type: "website",
    },
  };
}

export default function ServiceDetailPage() {
  return <ServiceDetailClient />;
}
