import type { Metadata } from "next";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
  title: "About Us | Modular Office Furniture Manufacturer in Gurgaon",
  description: "Learn about Western Interio, an ISO 9001:2015 certified premier modular office furniture manufacturer and turnkey interior design firm based in Gurgaon, India.",
  keywords: ["About Western Interio", "Office Furniture Manufacturer Gurgaon", "Modular Furniture Factory Gurgaon", "Ergonomic Office Furniture India"],
  openGraph: {
    title: "About Us | Western Interio Gurgaon",
    description: "Learn about Western Interio, a premier modular office furniture manufacturer in Gurgaon delivering ergonomic workspace solutions across India.",
    type: "website",
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
