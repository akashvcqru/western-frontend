import searchTerms from "../data/search_terms.json";

/**
 * Resolves a new Next.js relative or absolute URL to its corresponding old URL
 * from the Excel spreadsheet, if a mapping exists.
 */
export function getOldUrl(url: string, baseUrl?: string): string {
  if (!url) return url;

  // If URL starts with http, extract the relative path
  let path = url;
  let isAbsolute = false;
  let origin = baseUrl || "";

  if (url.startsWith("http://") || url.startsWith("https://")) {
    try {
      const parsed = new URL(url);
      path = parsed.pathname;
      origin = parsed.origin;
      isAbsolute = true;
    } catch (e) {
      // Fallback
    }
  }

  // Normalize path to compare (e.g. "/blog/my-post/" -> "/blog/my-post")
  const cleanPath = "/" + path.replace(/^\/|\/$/g, "").toLowerCase();

  const match = searchTerms.find((t) => {
    const normalizedNew = "/" + t.new_rel.replace(/^\/|\/$/g, "").toLowerCase();
    return normalizedNew === cleanPath;
  });

  if (match) {
    const mappedRel = match.old_rel;
    return isAbsolute ? `${origin}${mappedRel}` : mappedRel;
  }

  return url;
}
