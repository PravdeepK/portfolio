import type { Metadata, Viewport } from "next";
import { Source_Serif_4, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { projects } from "./projects";

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

const SITE = "https://www.builtbyprav.com";
const TITLE = "Pravdeep Kullar | Full-stack Developer";
const DESCRIPTION =
  "Full-stack developer in Ontario, Canada, serving the Toronto area. I build applications end to end in React, Next.js and Node. Currently at Mentera, an AI platform for private practices and medspas.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: TITLE,
    template: "%s | Pravdeep Kullar",
  },
  description: DESCRIPTION,
  applicationName: "Pravdeep Kullar",
  authors: [{ name: "Pravdeep Kullar", url: SITE }],
  creator: "Pravdeep Kullar",
  keywords: [
    "full-stack developer Toronto",
    "full-stack developer Ontario",
    "React developer Toronto",
    "Next.js developer",
    "Node.js developer",
    "freelance web developer Toronto",
    "Pravdeep Kullar",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE,
    siteName: "Pravdeep Kullar",
    title: TITLE,
    description: DESCRIPTION,
    locale: "en_CA",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Pravdeep Kullar, full-stack developer, Ontario, Canada",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og.png"],
  },
  manifest: "/site.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: "#fbfbf9",
  colorScheme: "light",
};

/** Person plus WebSite, so search engines can attach the name to the site. */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE}/#person`,
      name: "Pravdeep Kullar",
      url: SITE,
      email: "mailto:pravdeepkk@gmail.com",
      jobTitle: "Full-stack Developer",
      description: DESCRIPTION,
      image: `${SITE}/og.png`,
      address: {
        "@type": "PostalAddress",
        addressRegion: "Ontario",
        addressCountry: "CA",
      },
      worksFor: {
        "@type": "Organization",
        name: "Mentera",
        url: "https://mentera.ai",
      },
      alumniOf: {
        "@type": "EducationalOrganization",
        name: "Humber Polytechnic",
      },
      knowsAbout: [
        "React",
        "Next.js",
        "TypeScript",
        "Node.js",
        "PostgreSQL",
        "Python",
        "PyTorch",
        "Machine learning",
      ],
      sameAs: [
        "https://github.com/PravdeepK",
        "https://linkedin.com/in/pravdeepk",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE}/#website`,
      url: SITE,
      name: "Pravdeep Kullar",
      alternateName: TITLE,
      description: DESCRIPTION,
      inLanguage: "en-CA",
      publisher: { "@id": `${SITE}/#person` },
    },
    {
      "@type": "ProfilePage",
      "@id": `${SITE}/#page`,
      url: SITE,
      name: TITLE,
      description: DESCRIPTION,
      inLanguage: "en-CA",
      isPartOf: { "@id": `${SITE}/#website` },
      about: { "@id": `${SITE}/#person` },
      mainEntity: { "@id": `${SITE}/#person` },
      primaryImageOfPage: `${SITE}/og.png`,
      hasPart: {
        "@type": "ItemList",
        name: "Selected work",
        numberOfItems: projects.length,
        itemListElement: projects.map((project, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "CreativeWork",
            name: project.title,
            description: project.description,
            about: project.category,
            keywords: project.meta.join(", "),
            author: { "@id": `${SITE}/#person` },
            ...(project.href ? { url: project.href } : {}),
          },
        })),
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-CA">
      <body className={`${serif.variable} ${mono.variable}`}>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
