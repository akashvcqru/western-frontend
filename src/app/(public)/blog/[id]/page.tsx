import type { Metadata } from "next";
import BlogDetailClient from "./BlogDetailClient";
import { getApiBaseUrl, cleanDescription } from "@/lib/server-seo";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const baseUrl = getApiBaseUrl();
  
  let blogTitle = "";
  let blogDescription = "";
  let blogImage = "";

  try {
    const res = await fetch(`${baseUrl}/api/blogs/${encodeURIComponent(id)}`, {
      cache: "no-store",
      next: { revalidate: 0 },
    });
    if (res.ok) {
      const json = await res.json();
      const post = json.data;
      if (post) {
        blogTitle = post.metaTitle || post.title;
        blogDescription = post.metaDescription || (Array.isArray(post.content) ? post.content[0] : post.content);
        blogImage = post.image || "";
      }
    }
  } catch {}

  const humanReadable = id.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const formattedTitle = blogTitle 
    ? blogTitle
    : `${humanReadable} | Western Interio`;

  const fallbackDesc = `Read about ${humanReadable} and expert ergonomic office furniture insights on the Western Interio blog.`;
  const cleanDesc = cleanDescription(blogDescription, fallbackDesc);

  return {
    title: formattedTitle,
    description: cleanDesc,
    openGraph: {
      title: formattedTitle,
      description: cleanDesc,
      images: blogImage ? [blogImage] : [],
      type: "article",
    },
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const resolved = await params;
  return <BlogDetailClient id={resolved.id} />;
}
