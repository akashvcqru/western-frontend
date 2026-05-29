"use client";

import React from "react";
import { Provider } from "react-redux";
import { store } from "./store";

// Suppress extension-injected 'bis_skin_checked' hydration warnings in development terminal/console
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  const originalError = console.error;
  console.error = (...args: unknown[]) => {
    const errorMsg = args.map(arg => {
      try {
        return typeof arg === "string" ? arg : (arg instanceof Error ? arg.message : String(arg));
      } catch {
        return "";
      }
    }).join(" ");

    if (errorMsg.includes("bis_skin_checked")) {
      return;
    }
    originalError(...args);
  };
}

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}

