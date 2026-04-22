import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Canary Commons — A gateway revealing what is already life-forward",
  description:
    "A living map of what is already life-forward. Find, reveal, and support places, people, and projects tending the elements that sustain life.",
  metadataBase: new URL("https://canarycommons.org"),
  openGraph: {
    title: "Canary Commons — A gateway revealing what is already life-forward",
    description:
      "A living map of what is already life-forward. Find, reveal, and support places, people, and projects tending the elements that sustain life.",
    url: "https://canarycommons.org",
    siteName: "Canary Commons",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Canary Commons — a starry night sky with the Canary Commons logo and the headline Connected, We Dawn Brighter",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Canary Commons — A gateway revealing what is already life-forward",
    description:
      "A living map of what is already life-forward. Find, reveal, and support places, people, and projects tending the elements that sustain life.",
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
        {children}
      </body>
    </html>
  );
}
