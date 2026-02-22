import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SEO Health Checker | Janssens & Janssens Webservices",
  description:
    "Analyseer de SEO-gezondheid van uw website. Ontvang een gedetailleerd rapport met scores, problemen en aanbevelingen.",
  keywords: "SEO, website analyse, SEO checker, website score, Janssens Webservices",
  openGraph: {
    title: "SEO Health Checker | Janssens & Janssens Webservices",
    description: "Gratis SEO analyse voor uw website",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}