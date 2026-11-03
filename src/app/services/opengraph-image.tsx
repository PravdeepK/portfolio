import { OG_SIZE, renderOgImage } from "./_components/og";

export const alt = "Built by Prav: custom websites and software for Ontario businesses, with a pixel art shopfront";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    kicker: "Freelance full-stack developer",
    title: "Custom websites and software for Ontario businesses",
    tags: ["Websites", "CRMs", "AI tools", "Free site review"],
  });
}
