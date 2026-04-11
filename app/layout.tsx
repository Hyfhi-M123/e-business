import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Premium Digital Store | Marketplace Produk Digital",
  description: "Marketplace produk digital terbaik dengan estetika premium.",
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
