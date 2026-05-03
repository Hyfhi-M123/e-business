import type { Metadata } from "next";
import "./globals.css";

import CustomCursor from "./components/CustomCursor";

import { Providers } from "./providers";
import ThemeToggle from "./components/ThemeToggle";

export const metadata: Metadata = {
  title: "TrailForge | Adventure Tools Marketplace",
  description: "Gear Up. Go Wild. — Platform e-commerce peralatan adventure & outdoor terpercaya dengan kurasi produk terbaik untuk pendaki, camper, dan petualang.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="bg-[#F8F9FA] dark:bg-neutral-950 text-[#212529] dark:text-neutral-300 min-h-screen transition-colors duration-300">
        <Providers>
          <CustomCursor />
          <ThemeToggle />
          {children}
        </Providers>
      </body>
    </html>
  );
}
