import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Pixelify_Sans, Silkscreen } from "next/font/google";
import "./globals.css";
import { projects } from "./projects";
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

const SITE = "https://www.builtbyprav.com";
const NAME = "Pravdeep Kullar";
const TITLE = "Pravdeep Kullar | Forward Deployed & Full-Stack Engineer";
const DESCRIPTION =
  "Pravdeep Kullar is a Forward Deployed Engineer and full-stack developer in Ontario, Canada. React, Next.js, TypeScript, Node.js, Python, RAG and AI agents.";
const OG_IMAGE = {
  url: "/og.png",
  width: 1200,
  height: 630,
  type: "image/png",
  alt: "Pravdeep Kullar, Forward Deployed Engineer and full-stack developer, Ontario, Canada, next to a pixel art room at night",
};
const GITHUB = "https://github.com/PravdeepK";
const LINKEDIN = "https://www.linkedin.com/in/pravdeepk/";
const HUMBER = {
  "@type": "CollegeOrUniversity",
  name: "Humber Polytechnic",
  url: "https://humber.ca",
};
/** Build time, so the date moves whenever the content does. */
const BUILT = new Date().toISOString();

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
  keywords: [
    "Pravdeep Kullar",
    "forward deployed engineer",
    "full-stack developer",
    "full-stack developer Toronto",
    "full-stack developer Ontario",
    "AI engineer Toronto",
    "React developer",
    "Next.js developer",
    "TypeScript developer",
    "Node.js developer",
    "Python developer",
    "Claude API",
    "RAG",
    "AI agents",
    "freelance web developer Toronto",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "profile",
    url: SITE,
    siteName: NAME,
    title: TITLE,
    description: DESCRIPTION,
    locale: "en_CA",
    firstName: "Pravdeep",
    lastName: "Kullar",
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

/** Person plus WebSite, so search engines can attach the name to the site. */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE}/#person`,
      name: NAME,
      givenName: "Pravdeep",
      familyName: "Kullar",
      url: SITE,
      email: "mailto:pravdeepkk@gmail.com",
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
      sameAs: [GITHUB, LINKEDIN],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE}/#website`,
      url: SITE,
      name: NAME,
      alternateName: ["builtbyprav", "Built by Prav"],
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
      dateModified: BUILT,
      isPartOf: { "@id": `${SITE}/#website` },
      about: { "@id": `${SITE}/#person` },
      mainEntity: { "@id": `${SITE}/#person` },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: `${SITE}${OG_IMAGE.url}`,
        width: OG_IMAGE.width,
        height: OG_IMAGE.height,
      },
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
