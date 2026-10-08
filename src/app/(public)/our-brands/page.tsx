import type { Metadata } from "next";
import OurBrandsClient from "./OurBrandsClient";
import { getPageMetadata } from "@/lib/server-seo";

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata(
    "/our-brands",
    "Our Partner Brands & OEM Collaborations | Western Interio",
    "Explore certified partner brands, specialized component suppliers, and manufacturing collaborations backed by Western Interio Gurgaon.",
    {
      keywords: ["Western Interio Brands", "OEM Furniture Manufacturing", "Modular Furniture Collaborations"],
    }
  );
}

export default function OurBrandsPage() {
  return <OurBrandsClient />;
}
