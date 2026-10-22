import { ImageResponse } from "next/og";

/** The light theme tokens from globals.css. */
const C = {
  bg: "#d9dcea",
  dot: "#c9cde0",
  panel: "#f6f7fc",
  panel2: "#e6e8f2",
  ink: "#1b1d33",
  soft: "#4b4f6e",
  accent: "#3d4fc4",
  warm: "#e8743b",
  hi: "#ffd166",
  shadow: "#a3a8c9",
};

export const OG_SIZE = { width: 1200, height: 630 };

/** A shopfront, one character per pixel. */
const SHOP = [
  "..KKKKKKKKKKKK..",
  ".KWWPPWWPPWWPPK.",
  ".KWWPPWWPPWWPPK.",
  "KKKKKKKKKKKKKKKK",
  ".KGGGGGGGGGGGGK.",
  ".KGKKKKKGKKKKGK.",
  ".KGKHHHKGKAAKGK.",
  ".KGKHHHKGKAAKGK.",
  ".KGKKKKKGKAHKGK.",
  ".KGGGGGGGKAAKGK.",
  ".KGGGGGGGKAAKGK.",
  "KKKKKKKKKKKKKKKK",
];
const SHOP_COLORS: Record<string, string> = {
  K: C.ink,
  W: C.warm,
  P: C.panel,
  G: C.panel2,
  H: C.hi,
  A: C.accent,
};
const PX = 18;

function Shop() {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {SHOP.map((row, y) => (
        <div key={y} style={{ display: "flex" }}>
          {row.split("").map((cell, x) => (
            <div
              key={x}
              style={{ width: PX, height: PX, background: SHOP_COLORS[cell] ?? "transparent" }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

/**
 * Corner squares in the background colour, so the panel gets the site's
 * stepped corners. Offset by the border width, since absolute children sit
 * inside the border.
 */
function Notches({ size, color }: { size: number; color: string }) {
  const s = { position: "absolute" as const, width: size, height: size, background: color };
  return (
    <>
      <div style={{ ...s, top: -size, left: -size }} />
      <div style={{ ...s, top: -size, right: -size }} />
      <div style={{ ...s, bottom: -size, left: -size }} />
      <div style={{ ...s, bottom: -size, right: -size }} />
    </>
  );
}

export function renderOgImage({ kicker, title, tags }: { kicker: string; title: string; tags: string[] }) {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          padding: 56,
          background: C.bg,
          backgroundImage: `radial-gradient(${C.dot} 3px, transparent 3px)`,
          backgroundSize: "48px 48px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", position: "relative", width: "100%", height: "100%" }}>
          <div
            style={{
              position: "absolute",
              top: 12,
              left: 12,
              width: "100%",
              height: "100%",
              background: C.shadow,
            }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              position: "relative",
              width: "100%",
              height: "100%",
              border: `8px solid ${C.ink}`,
              background: C.panel,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "16px 32px",
                borderBottom: `8px solid ${C.ink}`,
                background: C.accent,
                color: "#ffffff",
                fontSize: 24,
                fontWeight: 700,
                letterSpacing: 3,
              }}
            >
              <span>BUILT BY PRAV</span>
              <span>ONTARIO, CANADA</span>
            </div>
            <div style={{ display: "flex", flex: 1, alignItems: "center", gap: 40, padding: "0 48px" }}>
              <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                <div style={{ color: C.warm, fontSize: 26, fontWeight: 700, letterSpacing: 3 }}>
                  {kicker.toUpperCase()}
                </div>
                <div
                  style={{
                    marginTop: 14,
                    color: C.ink,
                    fontSize: 64,
                    fontWeight: 800,
                    lineHeight: 1.05,
                  }}
                >
                  {title}
                </div>
                <div style={{ width: 220, height: 12, marginTop: 22, background: C.hi }} />
              </div>
              <Shop />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "18px 32px 22px",
                borderTop: `4px dashed ${C.shadow}`,
              }}
            >
              <div style={{ display: "flex", gap: 10 }}>
                {tags.map((tag) => (
                  <div
                    key={tag}
                    style={{
                      display: "flex",
                      padding: "6px 14px",
                      border: `4px solid ${C.shadow}`,
                      background: C.panel2,
                      color: C.ink,
                      fontSize: 20,
                      fontWeight: 700,
                      letterSpacing: 1,
                    }}
                  >
                    {tag.toUpperCase()}
                  </div>
                ))}
              </div>
              <div style={{ color: C.soft, fontSize: 24, fontWeight: 700 }}>builtbyprav.com</div>
            </div>
            <Notches size={8} color={C.bg} />
          </div>
        </div>
      </div>
    ),
    OG_SIZE
  );
}
