import { OG_SIZE, renderOgImage } from "../_components/og";

export const alt = "Built by Prav: moving outdated WordPress sites to a faster stack, with a pixel art shopfront";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    kicker: "Services · WordPress migration",
    title: "Moving off an outdated WordPress site",
    tags: ["301 redirects", "No plugins to patch", "Email checked first"],
  });
}
