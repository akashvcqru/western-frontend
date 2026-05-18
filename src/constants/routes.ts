export const AppRoutes = {
  Public: {
    Home: "/",
    About: "/about",
    OurBrands: "/our-brands",
    Gallery: "/gallery",
    Contact: "/contact",
    Products: "/products",
    DownloadCenter: "/download-center",
    PrivacyPolicy: "/privacy-policy",
    TermsOfService: "/terms-of-service",
  },
  Admin: {
    Login: "/admin/login",
    Dashboard: "/admin",
    Products: "/admin/products",
    Categories: "/admin/categories",
    Brands: "/admin/brands",
    Gallery: "/admin/gallery",
    Inquiries: "/admin/inquiries",
    Settings: "/admin/settings",
  },
} as const;

export type AppRouteType = typeof AppRoutes;
