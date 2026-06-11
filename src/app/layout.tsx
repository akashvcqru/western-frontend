import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { AppToastProvider } from "@/components/ui/AppToast";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import OfflineStatus from "@/components/ui/OfflineStatus";
import { ReduxProvider } from "@/redux/provider";
import { CanonicalHeader } from "@/components/common";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
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
    <html lang="en" className={poppins.variable} suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <CanonicalHeader />
      </head>
      <body className="font-sans antialiased">
        <ReduxProvider>
          <AppToastProvider>
            <ErrorBoundary>
              <OfflineStatus />
              {children}
            </ErrorBoundary>
          </AppToastProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
