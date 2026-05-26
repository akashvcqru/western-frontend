export const AppRoutes = {
  Public: {
    Home: "/",
    About: "/about",
    OurBrands: "/our-brands",
    Gallery: "/gallery",
    Contact: "/contact",
    Products: "/products",
    Blog: "/blog",
    DownloadCenter: "/download-center",
    PrivacyPolicy: "/privacy-policy",
    TermsOfService: "/terms-of-service",
  },
  Admin: {
    Login: "/admin/login",
    Dashboard: "/admin",
    Products: "/admin/products",
    NewProduct: "/admin/products/new",
    EditProduct: (id: string) => `/admin/products/${id}/edit`,
    Categories: "/admin/categories",
    Brands: "/admin/brands",
    Gallery: "/admin/gallery",
    Inquiries: "/admin/inquiries",
    Blogs: "/admin/blogs",
    SliderSettings: "/admin/slider-settings",
    Settings: "/admin/settings",
    Catalogues: "/admin/catalogues",
  },
} as const;

export type AppRouteType = typeof AppRoutes;
