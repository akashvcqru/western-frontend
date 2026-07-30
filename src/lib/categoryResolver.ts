export const CATEGORY_ALIAS_MAP: Record<string, string[]> = {
  "modular-kitchen-series": ["kitchen-designs", "modular-kitchen-series"],
  "kitchen-designs": ["kitchen-designs", "modular-kitchen-series"],
  
  "desking-workstation": ["modular-workstation", "workstation", "workstations"],
  "modular-workstation": ["modular-workstation", "workstation"],
  "workstation": ["workstation", "workstations", "modular-workstation", "desking-workstation"],
  "workstations": ["workstation", "workstations", "modular-workstation", "desking-workstation"],

  "modular-office-furniture": ["desking-workstation", "modular-workstation", "office-furniture", "office-chairs", "office-tables", "office-storage"],
  "office-furniture": ["desking-workstation", "modular-workstation", "office-furniture", "office-chairs", "office-tables", "office-storage"],

  "executive-tables": ["director-table", "executive-tables"],
  "director-table": ["director-table", "executive-tables"],
  
  "ceo-series-chairs": ["ceo-chairs", "ceo-series-chairs", "boss-chair", "president-chair"],
  "ceo-chairs": ["ceo-chairs", "ceo-series-chairs", "boss-chair", "president-chair"],
  "boss-chair": ["boss-chair", "ceo-chairs"],
  "president-chair": ["president-chair", "ceo-chairs"],
  
  "executive-chairs": ["executive-chairs", "office-executive-chairs"],
  "office-executive-chairs": ["executive-chairs", "office-executive-chairs"],

  "workstation-chairs": ["workstation-chairs", "office-workstation"],
  "office-workstation": ["workstation-chairs", "office-workstation"],

  "visitor-chairs": ["visitor-chairs", "visitor-training"],
  "visitor-training": ["visitor-chairs", "visitor-training"],

  "cafeteria-chairs": ["cafeteria-chairs", "cafeteria-bar-chairs"],
  "cafeteria-bar-chairs": ["cafeteria-chairs", "cafeteria-bar-chairs"],
  "cafeteria-chairs-in-gurgaon": ["cafeteria-chairs", "cafeteria-bar-chairs"],

  "waiting-area-chairs": ["waiting-area-chairs", "waiting-area-series"],
  "waiting-area-series": ["waiting-area-chairs", "waiting-area-series"],

  "conference-meeting": ["conferencemeeting-tables", "conference-table", "conference-tables", "conference-chairs"],
  "conference-table": ["conferencemeeting-tables", "conference-table", "conference-tables", "conference-chairs"],
  "conference-tables": ["conferencemeeting-tables", "conference-table", "conference-tables", "conference-chairs"],
  "conference-chairs": ["conferencemeeting-tables", "conference-chairs", "conference-tables", "conference-table"],
  "conferencemeeting-tables": ["conferencemeeting-tables", "conference-tables", "conference-table", "conference-chairs"],

  "reception-series": ["reception-desks", "reception-desk", "reception-sofa"],
  "reception-desk": ["reception-desks", "reception-desk"],
  "reception-desks": ["reception-desks", "reception-desk"],
  "reception-sofa": ["reception-sofa"],
  
  "office-storage": ["office-storage-solutions", "storage-solutions", "office-storage"],
  "office-storage-solutions": ["office-storage-solutions", "storage-solutions", "office-storage"],
  "storage-solutions": ["office-storage-solutions", "storage-solutions"],

  "center-tables": ["center-tables", "center-table", "centre-tables-in-gurgon"],
  "center-table": ["center-tables", "center-table"],
  "centre-tables-in-gurgon": ["center-tables", "center-table"],

  "computer-tables-1": ["computer-tables-1", "computer-tables", "computer-table"],
  "computer-tables": ["computer-tables-1", "computer-tables", "computer-table"],

  "sofas-series": ["office-sofa", "reception-sofa", "boss-cabin-sofa", "lounge-sofa", "sofas-series"],
  "sofas": ["office-sofa", "reception-sofa", "boss-cabin-sofa", "lounge-sofa", "sofas-series"],
  "office-sofa": ["office-sofa"],
  "boss-cabin-sofa": ["boss-cabin-sofa"],
  "lounge-sofa": ["lounge-sofa"],
  
  "chairs": [
    "office-chairs",
    "modern-office-chairs",
    "ceo-chairs",
    "executive-chairs",
    "workstation-chairs",
    "visitor-chairs",
    "cafeteria-chairs",
    "waiting-area-chairs",
    "conference-chairs"
  ],
  "office-chairs": [
    "modern-office-chairs",
    "ceo-chairs",
    "executive-chairs",
    "workstation-chairs",
    "visitor-chairs",
    "cafeteria-chairs",
    "waiting-area-chairs",
    "conference-chairs"
  ],
  "tables": [
    "office-tables",
    "director-table",
    "executive-tables",
    "conferencemeeting-tables",
    "center-tables",
    "reception-desks",
    "computer-tables-1"
  ],
  "office-tables": [
    "director-table",
    "executive-tables",
    "conferencemeeting-tables",
    "center-tables",
    "reception-desks",
    "computer-tables-1"
  ]
};

// Function to resolve category slug to a list of matching actual categories
export const resolveCategorySlugs = (slug: string): string[] => {
  const normalized = slug.trim().toLowerCase();
  return CATEGORY_ALIAS_MAP[normalized] || [normalized];
};

