import { OG_SIZE, renderOgImage } from "../_components/og";

export const alt = "Built by Prav: website speed and local SEO for Ontario small businesses, with a pixel art shopfront";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    kicker: "Services · Speed and local SEO",
    title: "Website speed and local SEO",
    tags: ["Core Web Vitals", "PageSpeed", "Local search"],
  });
}
