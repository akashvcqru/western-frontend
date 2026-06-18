import type { Metadata } from "next";
import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import WhatsAppWidget from "@/components/ui/WhatsAppWidget";
import siteContent from "@/data/site-content.json";

export const metadata: Metadata = {
  title: siteContent.metaData.title,
  description: siteContent.metaData.description,
};

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5073";
  let initialCategories = [];
  let initialSubCategories = [];
  let initialHeaderLogo = "/logo-v3.png";
  let initialFooterLogo = "/logo-v3.png";

  try {
    const categoriesRes = await fetch(`${backendUrl}/api/categories?limit=100`, { cache: "no-store" });
    if (categoriesRes.ok) {
      const result = await categoriesRes.json();
      initialCategories = result.data || [];
    }
  } catch (e) {
    console.error("Failed to fetch initial categories on server:", e);
  }

  try {
    const subCategoriesRes = await fetch(`${backendUrl}/api/categories/subcategories?limit=100`, { cache: "no-store" });
    if (subCategoriesRes.ok) {
      const result = await subCategoriesRes.json();
      initialSubCategories = result.data || [];
    }
  } catch (e) {
    console.error("Failed to fetch initial subcategories on server:", e);
  }

  try {
    const logoRes = await fetch(`${backendUrl}/api/settings/bdm_settings_logo`, { cache: "no-store" });
    if (logoRes.ok) {
      const result = await logoRes.json();
      if (result.success && result.data) {
        initialHeaderLogo = result.data.headerLogo || "/logo-v3.png";
        initialFooterLogo = result.data.footerLogo || "/logo-v3.png";
      }
    }
  } catch (e) {
    console.error("Failed to fetch initial logo settings on server:", e);
  }

  return (
    <>
      <Header
        initialCategories={initialCategories}
        initialSubCategories={initialSubCategories}
        initialHeaderLogo={initialHeaderLogo}
      />
      <main className="text-secondary relative">
        <Breadcrumbs />
        {children}
      </main>
      <Footer initialFooterLogo={initialFooterLogo} />
      <WhatsAppWidget />
    </>
  );
}
