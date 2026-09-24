import type { Metadata } from "next";
import DownloadCenterClient from "./DownloadCenterClient";

export const metadata: Metadata = {
  title: "Download Product Catalogues & Brochures",
  description: "Download the latest PDF catalogues, technical specification sheets, product brochures, and finish guides for Western Interio modular office furniture.",
  keywords: ["Office Furniture Catalogues PDF", "Modular Workstation Brochure Download", "Western Interio Spec Sheets"],
  openGraph: {
    title: "Download Product Catalogues & Brochures | Western Interio",
    description: "Download the latest product brochures, technical spec sheets, and catalogues for Western Interio office furniture.",
    type: "website",
  },
};

export default function DownloadCenterPage() {
  return <DownloadCenterClient />;
}
