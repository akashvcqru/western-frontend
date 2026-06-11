"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function CanonicalHeader() {
  const pathname = usePathname();
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  // Use configured NEXT_PUBLIC_SITE_URL environment variable if present,
  // otherwise fallback to the current dynamic browser domain.
  const baseDomain = process.env.NEXT_PUBLIC_SITE_URL || origin;

  if (!baseDomain) {
    return null;
  }

  const canonicalUrl = `${baseDomain}${pathname === "/" ? "" : pathname}`;

  return (
    <link rel="canonical" href={canonicalUrl} />
  );
}

