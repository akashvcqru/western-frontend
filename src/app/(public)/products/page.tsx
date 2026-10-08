import type { Metadata } from "next";
import ProductsClient from "./ProductsClient";
import { getPageMetadata } from "@/lib/server-seo";

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata(
    "/products",
    "Modular Office Furniture Products & Collections | Western Interio",
    "Explore our complete range of premium modular workstations, ergonomic office chairs, conference tables, executive storage, and acoustic office furniture in Gurgaon.",
    {
      keywords: ["Modular Office Furniture Products", "Buy Office Chairs Online Gurgaon", "Executive Office Desks", "Modular Workstations India"],
    }
  );
}

export default function ProductsPage() {
  return <ProductsClient />;
}
