import type { Metadata } from "next";
import CategoriesClient from "./CategoriesClient";

export const metadata: Metadata = {
  title: "Explore Office Furniture Categories",
  description: "Browse our comprehensive range of modular office furniture categories including executive desks, modular workstations, ergonomic office chairs, conference tables, and office storage.",
  keywords: ["Office Furniture Categories", "Modular Workstations Gurgaon", "Office Chairs Gurgaon", "Executive Desks India"],
  openGraph: {
    title: "Explore Office Furniture Categories | Western Interio",
    description: "Browse all modular office furniture categories designed for productivity and ergonomic comfort.",
    type: "website",
  },
};

export default function CategoriesPage() {
  return <CategoriesClient />;
}
