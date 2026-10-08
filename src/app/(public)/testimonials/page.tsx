import type { Metadata } from "next";
import TestimonialsClient from "./TestimonialsClient";
import { getPageMetadata } from "@/lib/server-seo";

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata(
    "/testimonials",
    "Client Testimonials & Reviews | Western Interio",
    "Read verified client reviews and testimonials about Western Interio's modular office furniture quality, custom craftsmanship, and timely delivery.",
    {
      keywords: ["Western Interio Reviews", "Office Furniture Testimonials", "Modular Furniture Customer Feedback Gurgaon"],
    }
  );
}

export default function TestimonialsPage() {
  return <TestimonialsClient />;
}
