import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppToastProvider } from "@/components/ui/AppToast";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import OfflineStatus from "@/components/ui/OfflineStatus";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Western Interio",
    template: "%s | Western Interio",
  },
  description: "Western Interio - Think to design beyond. Modular office furniture manufacturer and interior design firm specializing in ergonomic workspace solutions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <AppToastProvider>
          <ErrorBoundary>
            <OfflineStatus />
            {children}
          </ErrorBoundary>
        </AppToastProvider>
      </body>
    </html>
  );
}
