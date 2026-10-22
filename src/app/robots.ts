import type { MetadataRoute } from "next";
import { SITE } from "./site";

export default function robots(): MetadataRoute.Robots {
  return {
    // The snake leaderboard API has nothing to index.
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: `${SITE}/sitemap.xml`,
  };
}
