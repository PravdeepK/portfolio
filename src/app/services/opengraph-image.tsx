import { OG_SIZE, renderOgImage } from "./_components/og";

export const alt = "Built by Prav: website redesigns for Ontario small businesses, with a pixel art shopfront";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    kicker: "Freelance web developer",
    title: "Website redesigns for Ontario small businesses",
    tags: ["Fast", "Mobile-friendly", "Free site review"],
  });
}
