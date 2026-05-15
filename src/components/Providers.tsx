"use client";

import React from "react";
import { ErrorBoundary, OfflineStatus, AppToastProvider } from "@/components/ui";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppToastProvider>
      <ErrorBoundary>
        <OfflineStatus />
        {children}
      </ErrorBoundary>
    </AppToastProvider>
  );
}
