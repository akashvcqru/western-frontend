import type { Metadata } from "next";
import ServicesClient from "./ServicesClient";

export const metadata: Metadata = {
  title: "Office Interior & Furniture Manufacturing Services",
  description: "Explore our turnkey workspace solutions, modular workstation design, interior contracting, glass partitions, false ceilings, and corporate office furniture manufacturing.",
  keywords: ["Office Interior Services Gurgaon", "Modular Workstation Manufacturing", "Turnkey Office Interior Contractor", "Commercial Furniture Fitout"],
  openGraph: {
    title: "Office Interior & Furniture Manufacturing Services | Western Interio",
    description: "Explore turnkey workspace solutions, modular workstation design, interior contracting, and bespoke commercial furniture manufacturing.",
    type: "website",
  },
};

export default function ServicesPage() {
  return <ServicesClient />;
}
