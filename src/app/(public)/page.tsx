import type { Metadata } from "next";
import HomeClient from "./HomeClient";
import siteContent from "@/data/site-content.json";

export const metadata: Metadata = {
  title: siteContent.metaData.title,
  description: siteContent.metaData.description,
  keywords: siteContent.metaData.keywords,
  openGraph: {
    title: siteContent.metaData.title,
    description: siteContent.metaData.description,
    type: "website",
  },
};

export default function HomePage() {
  return <HomeClient />;
}
