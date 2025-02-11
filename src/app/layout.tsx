import type { Metadata } from "next";
import { Orbitron } from "next/font/google";
import { appUrl } from "./constants/config";
import "./globals.css";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-orbitron",
});

const config = {
  title: "Assasinate",
  description: "Unlocking a new world for you",
  url: appUrl,
};

export const metadata: Metadata = {
  title: config.title,
  description: config.description,
  icons: {
    icon: "/favicons.ico",
    shortcut: "/favicons-32x32.png",
    apple: "/apple-touch-icons.png",
  },
  openGraph: {
    title: config.title,
    description: config.description,
    type: "website",
    url: config.url,
    images: [
      {
        url: `${config.url}/preview.png`,
        width: 1279,
        height: 721,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: config.title,
    description: config.description,
    images: [`${config.url}/preview.png`],
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
        className={`${orbitron.variable} font-orbitron antialiased bg-slate-500`}
      >
        {children}
      </body>
    </html>
  );
}
