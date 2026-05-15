import type { Metadata } from "next";
import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import siteContent from "@/data/site-content.json";

export const metadata: Metadata = {
  title: siteContent.metaData.title,
  description: siteContent.metaData.description,
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="text-secondary relative pt-28 lg:pt-36">
        <Breadcrumbs />
        {children}
      </main>
      <Footer />
    </>
  );
}
