import type { Metadata } from "next";
import SearchClient from "./SearchClient";

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const resolved = await searchParams;
  const q = resolved?.q?.trim() || "";

  const title = q
    ? `Search Results for "${q}"`
    : "Search Office Furniture & Products";

  const description = q
    ? `Explore matching office furniture, modular workstations, chairs, and executive solutions for "${q}" at Western Interio Gurgaon.`
    : "Search through our comprehensive catalogue of ergonomic workstations, office chairs, executive desks, and commercial storage furniture.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

export default function SearchPage({ searchParams }: Props) {
  return <SearchClient searchParams={searchParams} />;
}
