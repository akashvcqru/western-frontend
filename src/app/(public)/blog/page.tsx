import type { Metadata } from "next";
import BlogClient from "./BlogClient";

export const metadata: Metadata = {
  title: "Blogs & Workspace Insights | Office Furniture & Design Trends",
  description: "Read our latest articles on ergonomic office furniture, corporate workspace design, productivity trends, and commercial interiors by Western Interio.",
  keywords: ["Office Furniture Blog", "Ergonomic Furniture Articles", "Office Interior Design Tips Gurgaon", "Modular Workstation Guides"],
  openGraph: {
    title: "Blogs & Workspace Insights | Western Interio",
    description: "Read our latest articles on ergonomic office furniture, corporate workspace design, productivity trends, and commercial interiors.",
    type: "website",
  },
};

export default function BlogPage() {
  return <BlogClient />;
}
