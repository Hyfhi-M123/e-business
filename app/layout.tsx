import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="id">
      <body className="bg-mesh min-h-screen">
        {children}
      </body>
    </html>
  );
}
