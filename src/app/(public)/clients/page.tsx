import type { Metadata } from "next";
import ClientsClient from "./ClientsClient";

export const metadata: Metadata = {
  title: "Our Clients & Corporate Partnerships",
  description: "Discover top corporate enterprises, startups, and institutions across India that trust Western Interio for turnkey office furniture manufacturing and ergonomic installations.",
  keywords: ["Western Interio Clients", "Corporate Office Furniture Clients", "Commercial Furniture Portfolio India"],
  openGraph: {
    title: "Our Clients & Corporate Partnerships | Western Interio",
    description: "Discover top corporate enterprises, startups, and institutions that trust Western Interio for turnkey office furniture.",
    type: "website",
  },
};

export default function ClientsPage() {
  return <ClientsClient />;
}
