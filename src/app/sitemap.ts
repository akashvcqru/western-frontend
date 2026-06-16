import { MetadataRoute } from 'next';

export const revalidate = 3600; // Cache the sitemap for 1 hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://westernofficesolutions.com';
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'https://western.vcqru.com/api';

  // Helper to slugify category names just like ProductCard does
  const slugify = (str?: string) => 
    str?.toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "") || "";

  // 1. Static pages of the website
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/categories`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/gallery`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/our-brands`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/download-center`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/privacy-policy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/terms-of-service`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/services`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/testimonials`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/clients`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/products`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
  ];

  try {
    // 2. Fetch categories from CMS API
    const catsRes = await fetch(`${apiBase}/api/categories?limit=100`, { next: { revalidate: 3600 } });
    const catsData = catsRes.ok ? await catsRes.json() : null;
    const categories = Array.isArray(catsData?.data) ? catsData.data : [];

    // 3. Fetch subcategories from CMS API
    const subsRes = await fetch(`${apiBase}/api/categories/subcategories?limit=100`, { next: { revalidate: 3600 } });
    const subsData = subsRes.ok ? await subsRes.json() : null;
    const subcategories = Array.isArray(subsData?.data) ? subsData.data : [];

    // 4. Fetch products from CMS API
    const prodsRes = await fetch(`${apiBase}/api/products?limit=1000`, { next: { revalidate: 3600 } });
    const prodsData = prodsRes.ok ? await prodsRes.json() : null;
    const products = Array.isArray(prodsData?.data) ? prodsData.data : [];

    // 5. Fetch blog posts from CMS API
    const blogsRes = await fetch(`${apiBase}/api/blogs?limit=200`, { next: { revalidate: 3600 } });
    const blogsData = blogsRes.ok ? await blogsRes.json() : null;
    const blogs = Array.isArray(blogsData?.data) ? blogsData.data : [];

    // Build helper maps for category IDs to slugs/names
    const catIdToSlug: Record<string, string> = {};
    const catIdToName: Record<string, string> = {};
    for (const cat of categories) {
      if (cat.status === 'Active') {
        const catSlug = cat.slug || cat.id;
        catIdToSlug[cat.id] = catSlug;
        catIdToName[cat.id] = cat.name;
      }
    }

    const dynamicEntries: MetadataRoute.Sitemap = [];

    // A. Generate Category Sitemap URLs (/products/[category-slug])
    for (const cat of categories) {
      if (cat.status === 'Active') {
        const catSlug = cat.slug || cat.id;
        dynamicEntries.push({
          url: `${baseUrl}/products/${catSlug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.8,
        });
      }
    }

    // B. Generate Subcategory Sitemap URLs (/products/[category-slug]/[subcategory-slug])
    for (const sub of subcategories) {
      if (sub.status === 'Active') {
        const catSlug = catIdToSlug[sub.categoryId] || slugify(sub.categoryId);
        const subSlug = sub.slug || sub.id;
        if (catSlug && subSlug) {
          dynamicEntries.push({
            url: `${baseUrl}/products/${catSlug}/${subSlug}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
          });
        }
      }
    }

    // C. Generate Product Detail Sitemap URLs (/products/[category-slug]/[product-slug])
    for (const prod of products) {
      if (prod.status === 'Active') {
        const parentCatId = prod.category;
        const catSlug = catIdToSlug[parentCatId] || slugify(catIdToName[parentCatId] || parentCatId);
        const prodSlug = prod.slug || prod.id;
        if (catSlug && prodSlug) {
          dynamicEntries.push({
            url: `${baseUrl}/products/${catSlug}/${prodSlug}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.6,
          });
        }
      }
    }

    // D. Generate Blog Detail Sitemap URLs (/blog/[blog-id])
    for (const blog of blogs) {
      const blogId = blog.id;
      dynamicEntries.push({
        url: `${baseUrl}/blog/${blogId}`,
        lastModified: blog.publishedAt ? new Date(blog.publishedAt) : new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }

    return [...staticPages, ...dynamicEntries];
  } catch (error) {
    console.error('Error generating dynamic sitemap, returning static fallback:', error);
    return staticPages;
  }
}
