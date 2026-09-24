import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact Us | Office Furniture Manufacturer in Gurgaon",
  description: "Get in touch with Western Interio for office furniture queries, bulk quotations, bespoke modular workstations, and visit our showroom in Kadipur, Gurgaon.",
  keywords: ["Contact Western Interio", "Office Furniture Gurgaon Phone", "Western Interio Address Gurgaon", "Office Furniture Enquiry"],
  openGraph: {
    title: "Contact Us | Western Interio Gurgaon",
    description: "Get in touch with Western Interio for office furniture queries, customized modular workstations, and showroom visits in Gurgaon.",
    type: "website",
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
