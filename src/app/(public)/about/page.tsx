import type { Metadata } from "next";
import AboutClient from "./AboutClient";
import { getPageMetadata } from "@/lib/server-seo";

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata(
    "/about",
    "About Us | Modular Office Furniture Manufacturer in Gurgaon",
    "Learn about Western Interio, an ISO 9001:2015 certified premier modular office furniture manufacturer and turnkey interior design firm based in Gurgaon, India.",
    {
      keywords: ["About Western Interio", "Office Furniture Manufacturer Gurgaon", "Modular Furniture Factory Gurgaon", "Ergonomic Office Furniture India"],
    }
  );
}

export default function AboutPage() {
  return <AboutClient />;
}
