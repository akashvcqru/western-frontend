import type { Metadata } from "next";
import ProductsClient from "./ProductsClient";

export const metadata: Metadata = {
  title: "Modular Office Furniture Products & Collections",
  description: "Explore our complete range of premium modular workstations, ergonomic office chairs, conference tables, executive storage, and acoustic office furniture in Gurgaon.",
  keywords: ["Modular Office Furniture Products", "Buy Office Chairs Online Gurgaon", "Executive Office Desks", "Modular Workstations India"],
  openGraph: {
    title: "Modular Office Furniture Products & Collections | Western Interio",
    description: "Explore our complete catalogue of premium modular desks, ergonomic seating, and architectural office furniture.",
    type: "website",
  },
};

export default function ProductsPage() {
  return <ProductsClient />;
}
