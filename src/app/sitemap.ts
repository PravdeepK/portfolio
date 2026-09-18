import type { MetadataRoute } from "next";

/** Generated at build time so lastmod stops being a date I forgot to change. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://www.builtbyprav.com/",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
