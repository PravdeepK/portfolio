import { OG_SIZE, renderOgImage } from "../_components/og";

export const alt = "Built by Prav: website care, edits, updates and hosting help, with a pixel art shopfront";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    kicker: "Services · Website care",
    title: "Website care, edits and hosting help",
    tags: ["Content edits", "Updates", "Domains and DNS"],
  });
}
