import type { Metadata } from "next";
import ClientsClient from "./ClientsClient";
import { getPageMetadata } from "@/lib/server-seo";

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata(
    "/clients",
    "Our Clients & Corporate Partnerships | Western Interio",
    "Discover top corporate enterprises, startups, and institutions across India that trust Western Interio for turnkey office furniture manufacturing and ergonomic installations.",
    {
      keywords: ["Western Interio Clients", "Corporate Office Furniture Clients", "Commercial Furniture Portfolio India"],
    }
  );
}

export default function ClientsPage() {
  return <ClientsClient />;
}
