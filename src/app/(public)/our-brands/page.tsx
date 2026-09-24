import type { Metadata } from "next";
import OurBrandsClient from "./OurBrandsClient";

export const metadata: Metadata = {
  title: "Our Partner Brands & OEM Collaborations",
  description: "Explore certified partner brands, specialized component suppliers, and manufacturing collaborations backed by Western Interio Gurgaon.",
  keywords: ["Western Interio Brands", "OEM Furniture Manufacturing", "Modular Furniture Collaborations"],
  openGraph: {
    title: "Our Partner Brands & OEM Collaborations | Western Interio",
    description: "Explore certified partner brands and manufacturing collaborations backed by Western Interio.",
    type: "website",
  },
};

export default function OurBrandsPage() {
  return <OurBrandsClient />;
}
