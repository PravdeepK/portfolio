import { OG_SIZE, renderOgImage } from "./_components/og";

export const alt = "Built by Prav: moving Ontario small businesses off WordPress onto fast custom sites, with a pixel art shopfront";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    kicker: "Freelance web developer",
    title: "Moving Ontario small businesses off WordPress",
    tags: ["No plugin updates", "Fast on phones", "Free site review"],
  });
}
