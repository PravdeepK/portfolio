import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    // The snake leaderboard API has nothing to index.
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: "https://www.builtbyprav.com/sitemap.xml",
    host: "https://www.builtbyprav.com",
  };
}
