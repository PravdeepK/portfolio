import { OG_SIZE, renderOgImage } from "../_components/og";

export const alt = "Built by Prav: small-business website redesign in Ontario, with a pixel art shopfront";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    kicker: "Services · Website redesign",
    title: "Small-business website redesign",
    tags: ["Faster pages", "Clear calls to action", "Kept URLs"],
  });
}
