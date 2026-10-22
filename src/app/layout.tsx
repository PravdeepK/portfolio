import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Pixelify_Sans, Silkscreen } from "next/font/google";
import "./globals.css";
import { DESCRIPTION, EMAIL, GITHUB, LINKEDIN, NAME, OG_IMAGE, PERSON_ID, SITE, TITLE, WEBSITE_ID } from "./site";
import { skillGroups } from "./skills";

const display = Pixelify_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const label = Silkscreen({
  variable: "--font-label",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const mono = IBM_Plex_Mono({
  variable: "--font-plex",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

/** Applies a saved Lights on/off choice before first paint, so the page doesn't flash the wrong theme. */
const themeScript = `try{var t=localStorage.getItem("theme");if(t==="dark"||t==="light")document.documentElement.setAttribute("data-theme",t)}catch(e){}`;

const HUMBER = {
  "@type": "CollegeOrUniversity",
  name: "Humber Polytechnic",
  url: "https://humber.ca",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: TITLE,
    template: `%s | ${NAME}`,
  },
  description: DESCRIPTION,
  applicationName: NAME,
  authors: [{ name: NAME, url: SITE }],
  creator: NAME,
  publisher: NAME,
  // Defaults for every route. Canonical and og:url are set per page, so no page inherits the homepage's.
  openGraph: {
    type: "website",
    siteName: NAME,
    title: TITLE,
    description: DESCRIPTION,
    locale: "en_CA",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: OG_IMAGE.url, alt: OG_IMAGE.alt }],
  },
  manifest: "/site.webmanifest",
  formatDetection: {
    telephone: false,
    address: false,
    email: false,
  },
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
  // TODO: replace with the Search Console HTML tag token.
  verification: { google: "TODO" },
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#d9dcea" },
    { media: "(prefers-color-scheme: dark)", color: "#10121f" },
  ],
  colorScheme: "light dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/** Person plus WebSite, so search engines can attach the name to the site. Pages add their own nodes by @id. */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": PERSON_ID,
      name: NAME,
      givenName: "Pravdeep",
      familyName: "Kullar",
      url: SITE,
      email: `mailto:${EMAIL}`,
      jobTitle: "Forward Deployed Engineer",
      description: DESCRIPTION,
      image: `${SITE}${OG_IMAGE.url}`,
      address: {
        "@type": "PostalAddress",
        addressRegion: "Ontario",
        addressCountry: "CA",
      },
      worksFor: { "@type": "Organization", name: "Nx Growth Partners" },
      hasOccupation: [
        {
          "@type": "Occupation",
          name: "Forward Deployed Engineer",
          occupationLocation: { "@type": "Country", name: "Canada" },
        },
        {
          "@type": "Occupation",
          name: "Full-stack developer",
          occupationLocation: { "@type": "Country", name: "Canada" },
        },
      ],
      alumniOf: HUMBER,
      hasCredential: [
        {
          "@type": "EducationalOccupationalCredential",
          name: "Graduate Certificate, Artificial Intelligence with Machine Learning",
          credentialCategory: "certificate",
          recognizedBy: HUMBER,
        },
        {
          "@type": "EducationalOccupationalCredential",
          name: "Computer Programming Diploma",
          credentialCategory: "diploma",
          recognizedBy: HUMBER,
        },
        {
          "@type": "EducationalOccupationalCredential",
          name: "Meta Front-End Developer",
          credentialCategory: "certification",
          recognizedBy: { "@type": "Organization", name: "Meta" },
        },
        {
          "@type": "EducationalOccupationalCredential",
          name: "Meta UI/UX Design",
          credentialCategory: "certification",
          recognizedBy: { "@type": "Organization", name: "Meta" },
        },
      ],
      knowsAbout: skillGroups.flatMap((group) => group.items),
      // TODO: add the Google Business Profile URL once the profile is live.
      sameAs: [GITHUB, LINKEDIN],
    },
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      url: SITE,
      name: NAME,
      alternateName: ["builtbyprav", "Built by Prav"],
      description: DESCRIPTION,
      inLanguage: "en-CA",
      publisher: { "@id": PERSON_ID },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-CA"
      className={`${display.variable} ${label.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
      </body>
    </html>
  );
}
