import type { Metadata } from "next";
import BlogDetailClient from "./BlogDetailClient";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  
  let blogTitle = "";
  let blogDescription = "";
  let blogImage = "";

  try {
    const res = await fetch(`http://127.0.0.1:5073/api/blogs/${encodeURIComponent(id)}`, { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      const post = json.data;
      if (post) {
        blogTitle = post.metaTitle || post.title;
        blogDescription = post.metaDescription || (Array.isArray(post.content) ? post.content[0] : post.content);
        blogImage = post.image;
      }
    }
  } catch {}

  const formattedTitle = blogTitle 
    ? blogTitle
    : `${id.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}`;

  const cleanDescription = blogDescription
    ? blogDescription.replace(/<[^>]*>?/gm, "").slice(0, 160)
    : `Read about ${id.replace(/-/g, " ")} and expert ergonomic office furniture insights on the Western Interio blog.`;

  return {
    title: formattedTitle,
    description: cleanDescription,
    openGraph: {
      title: formattedTitle,
      description: cleanDescription,
      images: blogImage ? [blogImage] : [],
      type: "article",
    },
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const resolved = await params;
  return <BlogDetailClient id={resolved.id} />;
}
