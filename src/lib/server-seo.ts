import type { Metadata } from "next";

export function getApiBaseUrl(): string {
  const url =
    process.env.INTERNAL_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5073";
  return url.replace(/\/+$/, "");
}

export function cleanDescription(text?: string | null, fallback?: string): string {
  if (!text) return fallback || "Western Interio Gurgaon - Modular office furniture and ergonomic interior solutions.";
  const clean = text
    .replace(/<[^>]*>?/gm, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (clean.length > 160) {
    return clean.slice(0, 157).trim() + "...";
  }
  return clean || fallback || "Western Interio Gurgaon - Modular office furniture.";
}

export async function getPageMetadata(
  path: string,
  defaultTitle: string,
  defaultDescription: string,
  extra?: Partial<Metadata>
): Promise<Metadata> {
  const baseUrl = getApiBaseUrl();
  let metaTitle = defaultTitle;
  let metaDescription = defaultDescription;

  try {
    const res = await fetch(`${baseUrl}/api/seo/page?path=${encodeURIComponent(path)}`, {
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 0 },
    });

    if (res.ok) {
      const json = await res.json();
      if (json.data) {
        if (json.data.metaTitle && json.data.metaTitle.trim()) {
          metaTitle = json.data.metaTitle.trim();
        }
        if (json.data.metaDescription && json.data.metaDescription.trim()) {
          metaDescription = json.data.metaDescription.trim();
        }
      }
    }
  } catch (err) {
    // Graceful fallback to default title & description on fetch error
  }

  const cleanedDesc = cleanDescription(metaDescription, defaultDescription);

  return {
    title: metaTitle,
    description: cleanedDesc,
    openGraph: {
      title: metaTitle,
      description: cleanedDesc,
      type: "website",
      ...(extra?.openGraph || {}),
    },
    ...(extra || {}),
  };
}
