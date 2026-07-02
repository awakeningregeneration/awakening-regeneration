import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NorthStarNav from "@/app/components/NorthStarNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Canary Commons",
  description:
    "A constellation of sustainable, life-supporting places and projects across North America and beyond. Diversity sustains us. What we give our attention to grows.",
  metadataBase: new URL("https://www.canarycommons.org"),
  openGraph: {
    title: "Canary Commons",
    description:
      "A constellation of sustainable, life-supporting places and projects across North America and beyond. Diversity sustains us. What we give our attention to grows.",
    url: "https://www.canarycommons.org",
    siteName: "Canary Commons",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Canary Commons — A constellation of sustainable, life-supporting places and projects across North America and beyond.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Canary Commons",
    description:
      "A constellation of sustainable, life-supporting places and projects across North America and beyond. Diversity sustains us. What we give our attention to grows.",
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NorthStarNav />
        {children}
      </body>
    </html>
  );
}
