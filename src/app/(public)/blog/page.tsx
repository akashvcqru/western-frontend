import type { Metadata } from "next";
import BlogClient from "./BlogClient";
import { getPageMetadata } from "@/lib/server-seo";

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata(
    "/blog",
    "Blogs & Workspace Insights | Western Interio",
    "Read our latest articles on ergonomic office furniture, corporate workspace design, productivity trends, and commercial interiors by Western Interio.",
    {
      keywords: ["Office Furniture Blog", "Ergonomic Furniture Articles", "Office Interior Design Tips Gurgaon", "Modular Workstation Guides"],
    }
  );
}

export default function BlogPage() {
  return <BlogClient />;
}
