import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Dancing_Script } from "next/font/google";
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

const dancingScript = Dancing_Script({
  variable: "--font-caveat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Follow the Canary | Canary Commons",
  description:
    "Turns out, another way is already here. Find the lights. Follow the Canary.",
  metadataBase: new URL("https://www.canarycommons.org"),
  openGraph: {
    title: "Follow the Canary | Canary Commons",
    description:
      "Turns out, another way is already here. Find the lights. Follow the Canary.",
    url: "https://www.canarycommons.org",
    siteName: "Canary Commons",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "The Canary, formed from a night sky of lights — Canary Commons, Follow the Canary.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Follow the Canary | Canary Commons",
    description:
      "Turns out, another way is already here. Find the lights. Follow the Canary.",
    images: ["/opengraph-image"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Canary",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FFD86B",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${dancingScript.variable} antialiased`}
      >
        <NorthStarNav />
        {children}
      </body>
    </html>
  );
}
