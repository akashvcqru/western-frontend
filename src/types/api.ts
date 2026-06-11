// ─── Shared API Response Types ───────────────────────────────────────────────

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  limit: number;
}

/** Standard single-item response */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

/** Paginated list response */
export interface PaginatedApiResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: PaginationMeta;
}

// ─── Domain Model Types (mirror backend) ────────────────────────────────────

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  author: string;
  authorRole: string;
  tags: string[];
  content: string[];
  linkText?: string;
  hyperlink?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  subCategory?: string;
  brand: string;
  price: string;
  status: string;
  stock: number;
  description: string;
  images: string[];
  image?: string;
  catNo?: string;
  blueprintImage?: string;
  material?: string;
  finish?: string;
  size?: string;
  features?: { title: string; desc: string }[];
  specifications?: { label: string; value: string }[];
  dimensions?: { name: string; range: string; coord: string }[];
  resources?: { id: string; title: string; desc: string; format: string; size: string }[];
  variants?: { label: string; options: string[] }[];
  swatches?: { category: string; options: { name: string; hex: string; desc: string; border?: boolean }[] }[];
  detailsTitle?: string;
  detailsText1?: string;
  detailsText2?: string;
  quickSpecs?: string[];
  metaTitle?: string;
  metaDescription?: string;
}

export interface Category {
  id: string;
  slug?: string;
  name: string;
  description: string;
  count: number;
  image: string;
  status: string;
  location?: string;
  position?: number;
  metaTitle?: string;
  metaDescription?: string;
}

export interface SubCategory {
  id: string;
  slug?: string;
  name: string;
  description: string;
  image: string;
  categoryId: string;
  status: string;
  position?: number;
  metaTitle?: string;
  metaDescription?: string;
}

export interface Brand {
  id: string;
  name: string;
  url: string;
  link: string;
}

export interface GalleryItem {
  id: number;
  title: string;
  category: string;
  image: string;
}

export interface Inquiry {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message?: string;
  date: string;
  status: string;
}

export interface DashboardStats {
  products: number;
  categories: number;
  brands: number;
  gallery: number;
  blogs: number;
  totalInquiries: number;
  pendingInquiries: number;
}

export interface ActivityItem {
  id: string;
  action: string;
  detail: string;
  type: string;
  timestamp: string;
}


export interface Testimonial {
  id: string;
  author: string;
  designation: string;
  company: string;
  quote: string;
  rating: number;
  category: string;
  status: string;
  createdAt: string;
  image?: string;
}

export interface Catalogue {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  pdfData?: string; // Optional since it might be omitted in list view
  pdfFileName?: string;
  status: string;
  createdAt: string;
  hasPdf?: boolean;
}

export interface Service {
  id: string;
  slug: string;
  title: string;
  description?: string;
  category?: string;
  icon?: string;
  image: string;
  status: string;
  createdAt: string;
}

