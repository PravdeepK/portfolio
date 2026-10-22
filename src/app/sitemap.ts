import type { MetadataRoute } from "next";
import { SITE } from "./site";

/** Every path without a trailing slash, matching the canonicals. */
const pages: { path: string; priority: number }[] = [
  { path: "", priority: 1 },
  { path: "/services", priority: 0.9 },
  { path: "/services/website-redesign", priority: 0.8 },
  { path: "/services/wordpress-migration", priority: 0.8 },
  { path: "/services/speed-and-seo", priority: 0.8 },
  { path: "/services/website-care", priority: 0.8 },
];

/** Generated at build time so lastmod stops being a date I forgot to change. */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return pages.map(({ path, priority }) => ({
    url: `${SITE}${path}`,
    lastModified,
    changeFrequency: "monthly",
    priority,
  }));
}
