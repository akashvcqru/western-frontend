import type { Metadata } from "next";
import HomeClient from "./HomeClient";
import siteContent from "@/data/site-content.json";
import { getPageMetadata } from "@/lib/server-seo";

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata(
    "/",
    siteContent.metaData.title,
    siteContent.metaData.description,
    {
      keywords: siteContent.metaData.keywords,
    }
  );
}

export default function HomePage() {
  return <HomeClient />;
}
