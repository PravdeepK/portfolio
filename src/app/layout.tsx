import type { Metadata } from "next";
import { Source_Serif_4, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const serif = Source_Serif_4({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://builtbyprav.com"),
  title: "Pravdeep Kullar | Full-stack Developer",
  description:
    "Full-stack developer in Ontario, Canada. I build applications end to end in React, Next.js and Node. Currently at Mentera, an AI platform for private practices and medspas.",
  openGraph: {
    title: "Pravdeep Kullar | Full-stack Developer",
    description:
      "Full-stack developer in Ontario, Canada. I build applications end to end in React, Next.js and Node. Currently at Mentera, an AI platform for private practices and medspas.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${serif.variable} ${mono.variable}`}>
        {children}
      </body>
    </html>
  );
}
