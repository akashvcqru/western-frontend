import type { Metadata } from "next";
import DownloadCenterClient from "./DownloadCenterClient";
import { getPageMetadata } from "@/lib/server-seo";

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata(
    "/download-center",
    "Download Product Catalogues & Brochures | Western Interio",
    "Download the latest PDF catalogues, technical specification sheets, product brochures, and finish guides for Western Interio modular office furniture.",
    {
      keywords: ["Office Furniture Catalogues PDF", "Modular Workstation Brochure Download", "Western Interio Spec Sheets"],
    }
  );
}

export default function DownloadCenterPage() {
  return <DownloadCenterClient />;
}
