import productsData from "@/data/products.json";

export const CATEGORY_ALIAS_MAP: Record<string, string[]> = {
  "modular-kitchen-series": ["kitchen-designs"],
  "kitchen-designs": ["kitchen-designs"],
  
  "desking-workstation": ["modular-workstation", "workstation"],
  "modular-workstation": ["modular-workstation"],
  "workstation": ["workstation"],
  
  "executive-tables": ["director-table"],
  "director-table": ["director-table"],
  
  "ceo-series-chairs": ["boss-chair", "president-chair"],
  "boss-chair": ["boss-chair"],
  "president-chair": ["president-chair"],
  
  "conference-meeting": ["conference-table"],
  "conference-table": ["conference-table"],
  
  "reception-series": ["reception-desk", "reception-sofa"],
  "reception-desk": ["reception-desk"],
  "reception-sofa": ["reception-sofa"],
  
  "office-storage": ["storage-solutions"],
  "storage-solutions": ["storage-solutions"],
  
  "sofas-series": ["office-sofa", "reception-sofa", "boss-cabin-sofa", "lounge-sofa"],
  "office-sofa": ["office-sofa"],
  "boss-cabin-sofa": ["boss-cabin-sofa"],
  "lounge-sofa": ["lounge-sofa"],
  
  "office-chairs": [
    "modern-office-chairs",
    "boss-chair",
    "president-chair",
    "workstation-chair",
    "teacher-chair",
    "student-chair",
    "sofa-chair",
    "visitor-chair",
    "cafeteria-chair"
  ],
  "modern-office-chairs": ["modern-office-chairs"],
  "workstation-chair": ["workstation-chair"],
  "teacher-chair": ["teacher-chair"],
  "student-chair": ["student-chair"],
  "sofa-chair": ["sofa-chair"],
  "visitor-chair": ["visitor-chair"],
  "cafeteria-chair": ["cafeteria-chair"],
  
  "office-tables": ["director-table", "conference-table", "center-table"],
  "center-table": ["center-table"]
};

// Function to resolve category slug to a list of matching actual categories
export const resolveCategorySlugs = (slug: string): string[] => {
  const normalized = slug.trim().toLowerCase();
  return CATEGORY_ALIAS_MAP[normalized] || [normalized];
};

// Function to calculate counts for any standard or alias category slug
export const getProductCountBySlug = (slug: string): number => {
  const resolved = resolveCategorySlugs(slug);
  let products = productsData;
  if (typeof window !== "undefined") {
    const stored = sessionStorage.getItem("bdm_products");
    if (stored) {
      try {
        products = JSON.parse(stored);
      } catch {
        // fallback
      }
    }
  }
  return products.filter((p: { category: string }) => resolved.includes(p.category)).length;
};

