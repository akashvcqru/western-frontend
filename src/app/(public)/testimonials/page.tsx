import type { Metadata } from "next";
import TestimonialsClient from "./TestimonialsClient";

export const metadata: Metadata = {
  title: "Client Testimonials & Reviews",
  description: "Read verified client reviews and testimonials about Western Interio's modular office furniture quality, custom craftsmanship, and timely delivery.",
  keywords: ["Western Interio Reviews", "Office Furniture Testimonials", "Modular Furniture Customer Feedback Gurgaon"],
  openGraph: {
    title: "Client Testimonials & Reviews | Western Interio",
    description: "Read what our clients have to say about our premium office furniture manufacturing and ergonomic workspace installations.",
    type: "website",
  },
};

export default function TestimonialsPage() {
  return <TestimonialsClient />;
}
