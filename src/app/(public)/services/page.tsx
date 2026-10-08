import type { Metadata } from "next";
import ServicesClient from "./ServicesClient";
import { getPageMetadata } from "@/lib/server-seo";

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata(
    "/services",
    "Office Interior & Furniture Manufacturing Services | Western Interio",
    "Explore our turnkey workspace solutions, modular workstation design, interior contracting, glass partitions, false ceilings, and corporate office furniture manufacturing.",
    {
      keywords: ["Office Interior Services Gurgaon", "Modular Workstation Manufacturing", "Turnkey Office Interior Contractor", "Commercial Furniture Fitout"],
    }
  );
}

export default function ServicesPage() {
  return <ServicesClient />;
}
