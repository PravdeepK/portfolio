/**
 * Shared constants and builders for the services pages. Metadata and
 * structured data come from the same helpers so every page stays in step.
 */
import type { Metadata } from "next";

export const SITE = "https://www.builtbyprav.com";
export const BRAND = "Built by Prav";
export const EMAIL = "hello@builtbyprav.com";
export const REVIEW_HREF = `mailto:${EMAIL}?subject=Free%20website%20review`;
export const CALL_HREF = `mailto:${EMAIL}?subject=Free%20site%20review`;
export const GITHUB = "https://github.com/PravdeepK";
export const LINKEDIN = "https://www.linkedin.com/in/pravdeepk/";

export const BUSINESS_ID = `${SITE}/#business`;
export const PERSON_ID = `${SITE}/#person`;
export const AREA_SERVED = { "@type": "AdministrativeArea", name: "Ontario, Canada" };

export type ServicePage = {
  slug: string;
  name: string;
  /** One line for the cards and the related links. */
  summary: string;
};

export const servicePages: ServicePage[] = [
  {
    slug: "website-redesign",
    name: "Website redesign",
    summary:
      "A rebuild of an outdated site around the one thing a visitor came to do: call you, book, or ask for a quote.",
  },
  {
    slug: "wordpress-migration",
    name: "WordPress migration",
    summary:
      "Moving an aging WordPress or PHP site to a faster stack, with every old URL redirected so search traffic carries over.",
  },
  {
    slug: "speed-and-seo",
    name: "Speed and local SEO",
    summary:
      "Fixing what makes a site slow on phones, and the basics that help Google show you to people searching nearby.",
  },
  {
    slug: "website-care",
    name: "Website care",
    summary: "Edits, updates, and hosting and domain help after launch, so the hours and prices on the site stay right.",
  },
];

export const servicePath = (slug: string) => `/services/${slug}`;

export function pageMetadata({
  path,
  title,
  description,
}: {
  path: string;
  title: string;
  description: string;
}): Metadata {
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: path,
      siteName: BRAND,
      locale: "en_CA",
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export type Crumb = { name: string; path: string };

export const HOME_CRUMB: Crumb = { name: "Home", path: "/" };
export const SERVICES_CRUMB: Crumb = { name: "Services", path: "/services" };

const absolute = (path: string) => (path === "/" ? `${SITE}/` : `${SITE}${path}`);

export function breadcrumbJsonLd(trail: Crumb[]) {
  return {
    "@type": "BreadcrumbList",
    "@id": `${absolute(trail[trail.length - 1].path)}#breadcrumb`,
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absolute(crumb.path),
    })),
  };
}

export function webPageJsonLd({ path, title, description }: { path: string; title: string; description: string }) {
  const url = absolute(path);
  return {
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: title,
    description,
    inLanguage: "en-CA",
    isPartOf: { "@id": `${SITE}/#website` },
    breadcrumb: { "@id": `${url}#breadcrumb` },
  };
}

/** A service subpage: the Service node, its page and its breadcrumb trail. */
export function serviceJsonLd({
  path,
  title,
  name,
  description,
}: {
  path: string;
  title: string;
  name: string;
  description: string;
}) {
  const url = absolute(path);
  return {
    "@context": "https://schema.org",
    "@graph": [
      { ...webPageJsonLd({ path, title, description }), mainEntity: { "@id": `${url}#service` } },
      breadcrumbJsonLd([HOME_CRUMB, SERVICES_CRUMB, { name, path }]),
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name,
        serviceType: name,
        description,
        url,
        provider: {
          "@type": "ProfessionalService",
          "@id": BUSINESS_ID,
          name: BRAND,
          url: absolute(SERVICES_CRUMB.path),
        },
        areaServed: AREA_SERVED,
      },
    ],
  };
}
