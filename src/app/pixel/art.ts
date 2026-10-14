/**
 * Pixel art kit: one-pixel drawing helpers, a 3x5 font, the character sprite
 * and the room's day and night palettes. Everything here draws in canvas
 * pixels; the canvases are scaled up with image-rendering: pixelated.
 */

export type Ctx = CanvasRenderingContext2D;

export function px(c: Ctx, x: number, y: number, w: number, h: number, color: string) {
  c.fillStyle = color;
  c.fillRect(x, y, w, h);
}

/** Bresenham, so diagonal strokes stay one pixel wide. */
export function line(c: Ctx, x0: number, y0: number, x1: number, y1: number, color: string) {
  c.fillStyle = color;
  const dx = Math.abs(x1 - x0);
  const sx = x0 < x1 ? 1 : -1;
  const dy = -Math.abs(y1 - y0);
  const sy = y0 < y1 ? 1 : -1;
  let err = dx + dy;
  for (;;) {
    c.fillRect(x0, y0, 1, 1);
    if (x0 === x1 && y0 === y1) break;
    const e2 = 2 * err;
    if (e2 >= dy) {
      err += dy;
      x0 += sx;
    }
    if (e2 <= dx) {
      err += dx;
      y0 += sy;
    }
  }
}

/** Seeded, so the bookshelf and skyline come out the same on every load. */
export function rng(seed: number) {
  return () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296;
}

export function mix(a: string, b: string, t: number) {
  const parse = (h: string) => {
    const n = parseInt(h.slice(1), 16);
    return [n >> 16, (n >> 8) & 255, n & 255];
  };
  const A = parse(a);
  const B = parse(b);
  return (
    "#" +
    A.map((v, i) =>
      Math.round(v + (B[i] - v) * t)
        .toString(16)
        .padStart(2, "0")
    ).join("")
  );
}

export const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

const GLYPHS: Record<string, string[]> = {
  A: [".#.", "#.#", "###", "#.#", "#.#"], B: ["##.", "#.#", "##.", "#.#", "##."],
  C: [".##", "#..", "#..", "#..", ".##"], D: ["##.", "#.#", "#.#", "#.#", "##."],
  E: ["###", "#..", "##.", "#..", "###"], F: ["###", "#..", "##.", "#..", "#.."],
  G: [".##", "#..", "#.#", "#.#", ".##"], K: ["#.#", "#.#", "##.", "#.#", "#.#"],
  L: ["#..", "#..", "#..", "#..", "###"], M: ["#.#", "###", "###", "#.#", "#.#"],
  N: ["##.", "#.#", "#.#", "#.#", "#.#"], O: ["###", "#.#", "#.#", "#.#", "###"],
  P: ["##.", "#.#", "##.", "#..", "#.."], R: ["##.", "#.#", "##.", "#.#", "#.#"],
  S: [".##", "#..", ".#.", "..#", "##."], T: ["###", ".#.", ".#.", ".#.", ".#."],
  U: ["#.#", "#.#", "#.#", "#.#", "###"], V: ["#.#", "#.#", "#.#", "#.#", ".#."],
  Y: ["#.#", "#.#", ".#.", ".#.", ".#."], H: ["#.#", "#.#", "###", "#.#", "#.#"],
  I: ["###", ".#.", ".#.", ".#.", "###"], J: ["..#", "..#", "..#", "#.#", ".#."],
  Q: [".#.", "#.#", "#.#", "##.", ".##"], W: ["#.#", "#.#", "###", "###", "#.#"],
  X: ["#.#", "#.#", ".#.", "#.#", "#.#"], Z: ["###", "..#", ".#.", "#..", "###"],
  ".": ["...", "...", "...", "...", ".#."], ",": ["...", "...", "...", ".#.", "#.."],
  ":": ["...", ".#.", "...", ".#.", "..."], "-": ["...", "...", "###", "...", "..."],
  "/": ["..#", "..#", ".#.", "#..", "#.."], "+": ["...", ".#.", "###", ".#.", "..."],
  "?": ["##.", "..#", ".#.", "...", ".#."], "!": [".#.", ".#.", ".#.", "...", ".#."],
  "=": ["...", "###", "...", "###", "..."], "'": [".#.", ".#.", "...", "...", "..."],
  0: ["###", "#.#", "#.#", "#.#", "###"], 1: [".#.", "##.", ".#.", ".#.", "###"],
  2: ["##.", "..#", ".#.", "#..", "###"], 3: ["##.", "..#", ".#.", "..#", "##."],
  4: ["#.#", "#.#", "###", "..#", "..#"], 5: ["###", "#..", "##.", "..#", "##."],
  6: [".##", "#..", "###", "#.#", "###"], 7: ["###", "..#", ".#.", ".#.", ".#."],
  8: ["###", "#.#", "###", "#.#", "###"], 9: ["###", "#.#", "###", "..#", "##."],
};

/** 3x5 pixel text, 4px per character. `scale` draws each pixel as a block. */
export function text3(c: Ctx, str: string | number, x: number, y: number, color: string, scale = 1) {
  c.fillStyle = color;
  for (const ch of String(str).toUpperCase()) {
    const g = GLYPHS[ch];
    if (g) {
      g.forEach((row, r) =>
        [...row].forEach((p, k) => p === "#" && c.fillRect(x + k * scale, y + r * scale, scale, scale))
      );
    }
    x += 4 * scale;
  }
}

export const textW = (s: string | number, scale = 1) => (String(s).length * 4 - 1) * scale;

/* The character: grey hoodie (hood bunched behind the neck, drawstrings,
   front pocket), black sweats, cream shoes. Faces right; flipped for left. */
const BODY = [
  ".....oooooo.....", "...oohhhhhhoo...", "..ohhHHHhhhhho..", ".ohhhhhhhhhhhho.",
  ".ohhhhhhhhhhhhho", ".ohhhhhhhhhhhhho", ".ohhhhhsssssssso", ".ohhhhssesssesso",
  ".ohhhhssesssesso", ".ohhhSssssssssso", ".otthSsssssssso.", ".ottoSsssssoo...",
  "..ottTSSTto.....", "....otTdtdto....", "...otttdtdtto...", "..otttttttttto..",
  "..otTttttttTto..", "..otTtTTTTtTto..", "..otTttttttTto..", "..osTTTTTTTTso..",
];
const LEGS = {
  N: ["...oppppppppo...", "...opppPPpppo...", "...opppoopppo...", "...opppoopppo...",
      "...opppoopppo...", "...obbbbobbbbo..", "...ooooooooooo.."],
  A: ["...oppppppppo...", "..opppoooppppo..", "..oppo...opppo..", ".oppo.....oppo..",
      ".oppo.....oppo..", "obbbo.....obbbbo", "ooooo.....oooooo"],
  B: ["...oppppppppo...", "....oppppppo....", ".....opppPo.....", ".....opppPo.....",
      ".....opppPo.....", ".....obbbbbo....", ".....ooooooo...."],
};
export type Legs = keyof typeof LEGS;
const SPR: Record<string, string> = {
  o: "#1b1d33", h: "#2b2230", H: "#4a3a4f", s: "#c98e66", S: "#a5704f", e: "#1b1d33",
  t: "#9a9ea8", T: "#767a86", d: "#e6e7ec", p: "#2c2d36", P: "#1c1d24", b: "#efe6cf",
};

export function drawSprite(c: Ctx, legs: Legs, x0: number, y0: number, flip: boolean, dy: number, blink: boolean) {
  BODY.concat(LEGS[legs]).forEach((row, r) => {
    for (let k = 0; k < 16; k++) {
      let ch = row[k] || ".";
      if (ch === ".") continue;
      if (blink && ch === "e") ch = "s";
      c.fillStyle = SPR[ch];
      c.fillRect(x0 + (flip ? 15 - k : k), y0 + r + (r < 20 ? dy : 0), 1, 1);
    }
  });
}

export const DAY = {
  out: "#1b1d33", wall: "#c7cbe2", wallStripe: "#bdc1da", wallTop: "#aeb2cf",
  base: "#6d5f86", baseHi: "#857aa0", floor: "#b07f5c", floorLine: "#93664a", floorHi: "#c4946f",
  wood: "#8a5a40", woodDk: "#6a412e", woodHi: "#a8714f", shelfBack: "#5e3a2a",
  door: "#9b6a4c", doorDk: "#7a4f37", knob: "#e8b84a", sign: "#f3ead2", signText: "#2f7a52",
  frame: "#eef0f8", frameDk: "#c5c9de", curtain: "#d0674a", curtainDk: "#a84f37",
  gold: "#d2a141", paper: "#f7f2e4", inkLine: "#9a9aaa", seal: "#c0483a", meta: "#3d6fd1",
  sky: ["#6fa6e0", "#86b6e6", "#a3c7ea", "#f2cfa6", "#f7b98a"], sun: "#ffe08a", moon: "#f3efd8",
  cloud: "#ffffff", cloudDk: "#dce6f4", cityFar: "#93a3c9", cityNear: "#62729b", tower: "#56648f",
  lit: "#ffd166", litDim: "#b59448",
  pot: "#c46d4a", potDk: "#9c5236", leaf: "#3f8f5a", leafDk: "#2d6b43",
  mon: "#2b2e44", screen: "#16213a", lamp: "#3d4fc4", lampDk: "#2c3a96", bulb: "#fff2b0",
  mug: "#f2f2f2", mugDk: "#c9cbd6", pi: "#2f8a4a", piOff: "#21663a", chip: "#1b1d33", usb: "#c9cbd6", cable: "#4b4f6e",
  note: "#ffd166", w: { g: "#5aa469", y: "#d8b544", x: "#8a8ea6", e: "#dfe1ea", bg: "#f6f6fa" },
  shadow: "rgba(27,29,51,0.18)", patch: "rgba(255,238,200,0.35)",
  books: ["#c0483a", "#3d4fc4", "#2f7a52", "#d8a83a", "#7a4f9e", "#d9774b", "#4b8fb0", "#e9e3d3"],
};
export type Palette = typeof DAY;

export const NIGHT: Palette = {
  ...DAY,
  out: "#0b0c18", wall: "#4a4f78", wallStripe: "#454a71", wallTop: "#3c4066",
  base: "#2e2a45", baseHi: "#3b3657", floor: "#5e4536", floorLine: "#4b3529", floorHi: "#6c5040",
  wood: "#4f3428", woodDk: "#3a251c", woodHi: "#62423a", shelfBack: "#2d1c15",
  door: "#55392b", doorDk: "#422b20", knob: "#c79a3e", sign: "#cfc6ae", signText: "#2f8a55",
  frame: "#8e93b8", frameDk: "#6f7499", curtain: "#7e3f33", curtainDk: "#622f26",
  gold: "#9c7a36", paper: "#bdb8a8", inkLine: "#6f6f80", seal: "#8d3a30", meta: "#3a5aa0",
  sky: ["#0b1028", "#111939", "#172049", "#1e2756", "#262e63"],
  cityFar: "#1f2649", cityNear: "#141936", tower: "#181d3a",
  pot: "#7a4733", potDk: "#5f3627", leaf: "#2a5c3d", leafDk: "#1e442d",
  mon: "#1f2133", screen: "#1a2a4a", lamp: "#2c3a96", lampDk: "#1f2a6e", bulb: "#ffe9a0",
  mug: "#a9abb8", mugDk: "#878a99", pi: "#22663a", piOff: "#174a29", chip: "#0b0c18", usb: "#8e91a3", cable: "#2b2e48",
  note: "#b59448", w: { g: "#3f7a4c", y: "#a68b33", x: "#5d6178", e: "#8c8fa0", bg: "#a9abb8" },
  shadow: "rgba(5,6,13,0.3)", patch: "rgba(170,190,255,0.12)",
  books: DAY.books.map((c) => mix(c, "#151933", 0.5)),
};

export const CODE = ["#7fd1b9", "#ffd166", "#ef8a7a", "#9fb4ff", "#c7cbe2"];

/** Light or dark, from the toggle if it was used, else the system setting. */
export function isNight(): boolean {
  const t = document.documentElement.getAttribute("data-theme");
  if (t === "dark") return true;
  if (t === "light") return false;
  return matchMedia("(prefers-color-scheme: dark)").matches;
}

/** Calls back whenever the effective theme changes. Returns the unsubscribe. */
export function onThemeChange(fn: () => void): () => void {
  const mq = matchMedia("(prefers-color-scheme: dark)");
  const mo = new MutationObserver(fn);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  mq.addEventListener("change", fn);
  return () => {
    mo.disconnect();
    mq.removeEventListener("change", fn);
  };
}
