import type { Metadata } from "next";
import ContactClient from "./ContactClient";
import { getPageMetadata } from "@/lib/server-seo";

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata(
    "/contact",
    "Contact Us | Office Furniture Manufacturer in Gurgaon",
    "Get in touch with Western Interio for office furniture queries, bulk quotations, bespoke modular workstations, and visit our showroom in Kadipur, Gurgaon.",
    {
      keywords: ["Contact Western Interio", "Office Furniture Gurgaon Phone", "Western Interio Address Gurgaon", "Office Furniture Enquiry"],
    }
  );
}

export default function ContactPage() {
  return <ContactClient />;
}
