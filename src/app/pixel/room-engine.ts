/**
 * The walkable room. Plain canvas and DOM, mounted by PixelRoom.tsx into its
 * markup (elements are found by their data-room attribute) and torn down by
 * the returned function, which removes every listener, timer and frame.
 *
 * The room is drawn at 256x144 and scaled up. A to D walks along the room,
 * W and S toward and away from the wall; walking up to something outlines it.
 * Typing "snake", or snake.exe on the monitor, zooms into the screen for a
 * game whose scores can go on the leaderboard (see /api/snake).
 */
import {
  CODE, DAY, NIGHT, clamp, drawSprite, isNight, line, mix, onThemeChange, px, rng, text3, textW,
  type Ctx, type Legs, type Palette,
} from "./art";
import {
  GRID_H as GH, GRID_W as GW, cleanInitials, isAllowedInitials, isPlausibleScore,
  type BoardRow,
} from "@/lib/snake";

const W = 256;
const H = 144;
const Y0 = 116; // feet closest to the wall
const Y1 = 141; // feet at the front of the floor
const CELL = 8;
const OX = 16;
const OY = 12;

type Hotspot = {
  id: string;
  name: string;
  short: string;
  button: string;
  rect: [number, number, number, number];
  x0: number;
  x1: number;
  y0: number;
  y1: number;
  text: string;
  email?: string;
  link?: { label: string; href: string };
  scroll?: { label: string; target: string };
  egg?: boolean;
  outline?: HTMLCanvasElement;
  wash?: HTMLCanvasElement;
};

const HOTSPOTS: Hotspot[] = [
  { id: "door", name: "Front door", short: "door", button: "Door: contact", rect: [3, 65, 28, 46], x0: 6, x1: 28, y0: 66, y1: 112,
    text: "Got something you want built? I'm open to front-end and full-stack roles, and I take freelance work. Email is the fastest way to reach me.",
    email: "pravdeepkk@gmail.com", scroll: { label: "Open contact", target: "contact" } },
  { id: "shelf", name: "Bookshelf", short: "bookshelf", button: "Bookshelf: skills", rect: [33, 52, 28, 59], x0: 34, x1: 60, y0: 52, y1: 112,
    text: "React, Next.js, TypeScript and Node.js on the product side. Python, PyTorch and scikit-learn on the ML side. The Claude API, RAG and AI agents in between.",
    scroll: { label: "Open skills", target: "skills" } },
  { id: "diploma", name: "Diploma", short: "diploma", button: "Diploma: history", rect: [67, 39, 21, 28], x0: 66, x1: 88, y0: 38, y1: 68,
    text: "A computer programming diploma from Humber, 2023 to 2025, then a graduate certificate in AI with machine learning in 2026. The two small frames are my Meta front-end and UI/UX certifications.",
    scroll: { label: "Open where I've been", target: "history" } },
  { id: "window", name: "Window", short: "window", button: "Window: Ontario", rect: [84, 15, 80, 60], x0: 92, x1: 156, y0: 18, y1: 74,
    text: "Ontario, Canada. The tall one is the CN Tower. It's day out there in light mode and night in dark mode, and the Lights button in the top bar switches it." },
  { id: "poster", name: "Poster", short: "poster", button: "Poster: FakeWordle", rect: [160, 28, 26, 31], x0: 160, x1: 185, y0: 28, y1: 58,
    text: "FakeWordle. It's Wordle, except you race someone else in real time. You open a room, send them the code, and a chat runs alongside.",
    link: { label: "Play a game", href: "https://www.fakewordle.com" }, scroll: { label: "Read about it", target: "project-07" } },
  { id: "monitor", name: "Monitor", short: "monitor", button: "Monitor: work", rect: [189, 69, 34, 23], x0: 188, x1: 224, y0: 68, y1: 96,
    text: "Twelve projects. Some were paid, the rest I built because I wanted the thing to exist.",
    scroll: { label: "Open selected work", target: "work" }, egg: true },
  { id: "pi", name: "Raspberry Pi 4", short: "Raspberry Pi", button: "Pi: ticket bot", rect: [232, 87, 16, 6], x0: 230, x1: 250, y0: 82, y1: 112,
    text: "It watches Cineplex for ticket on-sale times and sends me a push notification so I can grab tickets quickly. It runs headless on Raspberry Pi OS Lite, and I manage it over SSH.",
    scroll: { label: "Read about it", target: "project-09" } },
];

const INTRO = ["Hi, I'm Pravdeep,", "I'm a forward deployed engineer and full-stack developer.", "Welcome to my website!"];
export const SKILLS = ["React", "Next.js", "TypeScript", "Node.js", "Python", "Claude API", "RAG", "AI agents", "FastAPI", "Firebase", "PyTorch", "scikit-learn", "whatever the problem needs"];

const STARS = [[102, 27], [106, 38], [112, 29], [117, 35], [127, 28], [133, 33], [139, 27], [145, 31], [120, 41], [143, 40], [110, 43]];
const CLOUDS = [
  { rows: ["...###....", ".#######..", "##########"], speed: 1.6, y: 30, off: 0 },
  { rows: ["..##...", ".#####.", "#######"], speed: 2.4, y: 38, off: 34 },
];
const MON = { x: 190, y: 70.5, w: 32, h: 18 };

const mk = (w: number, h: number) => {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return c;
};
const ctx2d = (c: HTMLCanvasElement, opts?: CanvasRenderingContext2DSettings) => c.getContext("2d", opts) as Ctx;

/** A v4 UUID. crypto.randomUUID only exists on secure pages (and newer browsers);
    getRandomValues works on plain http too, such as a phone on the local network. */
function uuid(): string {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  const b = crypto.getRandomValues(new Uint8Array(16));
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  const h = [...b].map((x) => x.toString(16).padStart(2, "0")).join("");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

function store(key: string, value?: string): string | null {
  try {
    if (value !== undefined) localStorage.setItem(key, value);
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function mountRoom(root: HTMLElement): () => void {
  const q = <T extends HTMLElement>(name: string) => root.querySelector(`[data-room="${name}"]`) as T;
  const canvas = q<HTMLCanvasElement>("canvas");
  const bubble = q("bubble");
  const bubbleText = q("bubble-text");
  const dlg = q("dialog");
  const dlgName = q("dlg-name");
  const dlgText = q("dlg-text");
  const dlgFull = q("dlg-full");
  const dlgFoot = q("dlg-foot");
  const skillsEl = q("skills");
  const skillsLine = q("skills-line");
  const promptEl = q("prompt");
  const snakebar = q("snakebar");
  const snakeScore = q("snake-score");
  const boardEl = q("board");
  const boardList = q("board-list");
  const boardEmpty = q("board-empty");
  const pad = q("pad");
  const useBtn = q<HTMLButtonElement>("use");
  const objects = q("objects");
  const announcer = q("announce");
  const scene = q("scene");

  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  const coarse = matchMedia("(pointer: coarse)");
  let alive = true;
  const cleanups: (() => void)[] = [];
  const timers = new Set<ReturnType<typeof setTimeout>>();
  const later = (fn: () => void, ms: number) => {
    const t = setTimeout(() => {
      timers.delete(t);
      if (alive) fn();
    }, ms);
    timers.add(t);
  };
  const wait = (ms: number) => new Promise<void>((r) => later(r, ms));
  const listen = <K extends keyof WindowEventMap>(target: Window, type: K, fn: (e: WindowEventMap[K]) => void) => {
    target.addEventListener(type, fn);
    cleanups.push(() => target.removeEventListener(type, fn));
  };

  function announce(msg: string) {
    announcer.textContent = "";
    later(() => (announcer.textContent = msg), 30);
  }

  /* ---------- canvases ---------- */
  const ctx = ctx2d(canvas);
  const frame = mk(W, H);
  const fctx = ctx2d(frame);
  const stat = mk(W, H);
  const sctx = ctx2d(stat, { willReadFrequently: true });
  const bg = mk(W, H);
  const bgx = ctx2d(bg, { willReadFrequently: true });
  const skyline = mk(50, 42);
  const kctx = ctx2d(skyline);
  let night = isNight();
  let pal: Palette = night ? NIGHT : DAY;

  const box = (c: Ctx, x: number, y: number, w: number, h: number, fill: string) => {
    px(c, x, y, w, h, pal.out);
    px(c, x + 1, y + 1, w - 2, h - 2, fill);
  };
  function glow(c: Ctx, cx: number, cy: number, rx: number, ry: number, color: string) {
    c.fillStyle = color;
    for (let y = cy - ry; y <= cy + ry; y++) {
      for (let x = cx - rx; x <= cx + rx; x++) {
        const d = ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2;
        if (d < 0.35 || (d < 0.7 && (x + y) % 2 === 0) || (d < 1 && x % 2 === 0 && y % 2 === 0)) c.fillRect(x, y, 1, 1);
      }
    }
  }

  function drawStatic() {
    const c = sctx;
    c.clearRect(0, 0, W, H);
    // wall, baseboard, floor
    px(c, 0, 0, W, 106, pal.wall);
    for (let x = 6; x < W; x += 12) px(c, x, 4, 1, 102, pal.wallStripe);
    px(c, 0, 0, W, 4, pal.wallTop);
    px(c, 0, 106, W, 4, pal.base);
    px(c, 0, 106, W, 1, pal.baseHi);
    px(c, 0, 110, W, 34, pal.floor);
    px(c, 0, 110, W, 1, pal.floorLine);
    [[111, 118], [119, 128], [129, 140], [141, 144]].forEach(([y0, y1], i) => {
      px(c, 0, y1, W, 1, pal.floorLine);
      px(c, 0, y0, W, 1, pal.floorHi);
      for (let x = (i * 23) % 40; x < W; x += 40) px(c, x, y0, 1, y1 - y0, pal.floorLine);
    });
    // light from the window across the floor
    c.fillStyle = pal.patch;
    for (let y = 111; y < H; y++) {
      const s = Math.round((y - 110) * 0.8) + 4;
      for (let x = 99 + s; x < 149 + s; x++) if ((x + y) % 2 === 0) c.fillRect(x, y, 1, 1);
    }
    // the empty room, kept so the outlines can tell objects from wall
    bgx.clearRect(0, 0, W, H);
    bgx.drawImage(stat, 0, 0);

    // door, with the open-to-work sign
    box(c, 4, 66, 26, 44, pal.frameDk);
    box(c, 6, 68, 22, 42, pal.door);
    px(c, 9, 87, 16, 1, pal.doorDk);
    px(c, 9, 87, 1, 19, pal.doorDk);
    px(c, 24, 87, 1, 19, pal.doorDk);
    px(c, 9, 105, 16, 1, pal.doorDk);
    px(c, 24, 94, 2, 2, pal.knob);
    px(c, 17, 70, 1, 1, pal.knob);
    line(c, 11, 74, 17, 71, pal.out);
    line(c, 23, 74, 17, 71, pal.out);
    box(c, 9, 75, 17, 9, pal.sign);
    text3(c, "OPEN", 10, 77, pal.signText);

    // bookshelf
    box(c, 34, 62, 26, 48, pal.wood);
    px(c, 36, 64, 22, 44, pal.shelfBack);
    const r = rng(42);
    [[64, 78], [80, 93], [95, 108]].forEach(([top, bottom], ci) => {
      let x = 36;
      while (x < 56) {
        const w = 2 + Math.floor(r() * 2);
        if (x + w > 58) break;
        const h = bottom - top - 1 - Math.floor(r() * 4);
        const col = pal.books[Math.floor(r() * pal.books.length)];
        px(c, x, bottom - h, w, h, col);
        px(c, x, bottom - h + 2, w, 1, mix(col, "#000000", 0.25));
        x += w + (r() < 0.2 ? 1 : 0);
        if (ci === 2 && x > 48) break;
      }
      if (bottom < 108) {
        px(c, 35, bottom, 24, 2, pal.wood);
        px(c, 35, bottom, 24, 1, pal.woodHi);
      }
    });
    px(c, 50, 58, 8, 2, pal.books[1]);
    px(c, 49, 60, 9, 2, pal.books[0]);
    px(c, 38, 57, 6, 5, pal.pot);
    px(c, 38, 57, 6, 1, pal.potDk);
    px(c, 39, 54, 1, 3, pal.leaf);
    px(c, 41, 53, 1, 4, pal.leaf);
    px(c, 43, 55, 1, 2, pal.leaf);

    // diploma and the two Meta certificates
    box(c, 68, 40, 18, 14, pal.gold);
    px(c, 70, 42, 14, 10, pal.paper);
    px(c, 72, 44, 10, 1, pal.inkLine);
    px(c, 71, 46, 12, 1, pal.inkLine);
    px(c, 72, 48, 7, 1, pal.inkLine);
    px(c, 80, 49, 2, 2, pal.seal);
    px(c, 86, 41, 1, 14, pal.shadow);
    px(c, 69, 54, 18, 1, pal.shadow);
    [68, 78].forEach((x) => {
      box(c, x, 58, 8, 8, pal.frameDk);
      px(c, x + 1, 59, 6, 6, pal.paper);
      px(c, x + 2, 60, 2, 2, pal.meta);
      px(c, x + 2, 63, 4, 1, pal.inkLine);
    });

    // window: frame, sill, curtains (the glass is drawn every frame)
    px(c, 86, 17, 76, 2, pal.woodDk);
    px(c, 85, 16, 2, 4, pal.woodDk);
    px(c, 161, 16, 2, 4, pal.woodDk);
    box(c, 96, 22, 56, 48, pal.frame);
    px(c, 98, 24, 52, 44, pal.frameDk);
    box(c, 93, 69, 62, 4, pal.frame);
    px(c, 96, 73, 56, 1, pal.shadow);
    ([[88, 1], [151, -1]] as const).forEach(([x0, dir]) => {
      for (let i = 0; i < 9; i++) {
        const edge = dir === 1 ? i : 8 - i;
        const h = 52 - Math.max(0, edge - 4) * 3;
        px(c, x0 + i, 19, 1, h, i % 3 === 2 ? pal.curtainDk : pal.curtain);
      }
      px(c, dir === 1 ? 88 : 151, 54, 9, 2, pal.curtainDk);
    });

    // Wordle poster
    box(c, 161, 30, 23, 27, pal.w.bg);
    ["xyxxx", "xgxyx", "ggyxx", "gggxg", "ggggg", "....."].forEach((row, ry) =>
      [...row].forEach((k, rx) => px(c, 163 + rx * 4, 32 + ry * 4, 3, 3, k === "." ? pal.w.e : pal.w[k as "g" | "y" | "x"]))
    );
    px(c, 172, 29, 1, 2, pal.seal);
    px(c, 184, 31, 1, 27, pal.shadow);

    // plant
    [[163, 88], [166, 84], [171, 82], [176, 86], [179, 91], [161, 94], [174, 93]].forEach(([lx, ly], i) => {
      line(c, 170, 99, lx, ly, pal.leafDk);
      line(c, 170 + (i % 2), 98, lx + 1, ly, pal.leaf);
    });
    box(c, 165, 100, 10, 10, pal.pot);
    px(c, 164, 99, 12, 2, pal.potDk);

    // desk
    box(c, 178, 92, 74, 4, pal.wood);
    px(c, 179, 93, 72, 1, pal.woodHi);
    box(c, 181, 96, 3, 14, pal.woodDk);
    box(c, 246, 96, 3, 14, pal.woodDk);
    box(c, 222, 96, 24, 12, pal.wood);
    px(c, 231, 101, 6, 1, pal.knob);
    px(c, 184, 96, 38, 1, pal.shadow);
    // monitor
    box(c, 190, 70, 32, 20, pal.mon);
    px(c, 204, 90, 4, 1, pal.mon);
    px(c, 200, 91, 12, 1, pal.mon);
    px(c, 219, 71, 2, 2, pal.note);
    // lamp
    px(c, 179, 90, 7, 2, pal.lampDk);
    line(c, 181, 89, 183, 81, pal.lamp);
    box(c, 180, 76, 9, 5, pal.lamp);
    px(c, 182, 81, 5, 1, pal.bulb);
    // mug
    box(c, 225, 86, 6, 6, pal.mug);
    px(c, 231, 88, 1, 3, pal.mugDk);
    // Raspberry Pi, with its cable off the back of the desk
    box(c, 233, 88, 15, 4, pal.pi);
    px(c, 238, 89, 3, 2, pal.chip);
    px(c, 244, 88, 4, 3, pal.usb);
    line(c, 248, 91, 251, 94, pal.cable);
    px(c, 251, 96, 1, 14, pal.cable);

    buildOutlines();
    if (night) {
      glow(c, 206, 82, 46, 36, "rgba(140,180,255,0.12)");
      glow(c, 188, 97, 26, 15, "rgba(255,214,140,0.16)");
    }
  }

  /* Each object's highlight: a gold ring hugging its pixels, a dark ring outside
     that, and a light wash over the object. Found by diffing the room against
     the empty room. */
  function buildOutlines() {
    const A = sctx.getImageData(0, 0, W, H).data;
    const B = bgx.getImageData(0, 0, W, H).data;
    HOTSPOTS.forEach((h) => {
      const [rx, ry, rw, rh] = h.rect;
      const mask = (x: number, y: number) => {
        if (x < rx || x >= rx + rw || y < ry || y >= ry + rh) return false;
        const i = (y * W + x) * 4;
        return Math.abs(A[i] - B[i]) + Math.abs(A[i + 1] - B[i + 1]) + Math.abs(A[i + 2] - B[i + 2]) > 24;
      };
      const ring1 = (x: number, y: number) =>
        !mask(x, y) && (mask(x - 1, y) || mask(x + 1, y) || mask(x, y - 1) || mask(x, y + 1));
      const oc = mk(rw + 4, rh + 4);
      const o = ctx2d(oc);
      const fc = mk(rw + 4, rh + 4);
      const fo = ctx2d(fc);
      for (let y = ry - 2; y < ry + rh + 2; y++) {
        for (let x = rx - 2; x < rx + rw + 2; x++) {
          const lx = x - rx + 2;
          const ly = y - ry + 2;
          if (mask(x, y)) px(fo, lx, ly, 1, 1, "#ffffff");
          else if (ring1(x, y)) px(o, lx, ly, 1, 1, "#ffd166");
          else if (ring1(x - 1, y) || ring1(x + 1, y) || ring1(x, y - 1) || ring1(x, y + 1)) px(o, lx, ly, 1, 1, "#1b1d33");
        }
      }
      h.outline = oc;
      h.wash = fc;
    });
  }

  function drawSkyline() {
    const c = kctx;
    c.clearRect(0, 0, 50, 42);
    let r = rng(7);
    let x = 0;
    while (x < 50) {
      const w = 3 + Math.floor(r() * 4);
      const h = 8 + Math.floor(r() * 9);
      px(c, x, 42 - h, w, h, pal.cityFar);
      if (night) for (let yy = 44 - h; yy < 41; yy += 3) for (let xx = x + 1; xx < x + w - 1; xx += 2) if (r() < 0.2) px(c, xx, yy, 1, 1, pal.litDim);
      x += w;
    }
    // CN Tower
    px(c, 32, 12, 2, 30, pal.tower);
    px(c, 30, 20, 6, 3, pal.tower);
    px(c, 31, 16, 4, 1, pal.tower);
    px(c, 32, 4, 1, 8, pal.tower);
    px(c, 31, 36, 4, 6, pal.tower);
    r = rng(11);
    x = -2;
    while (x < 50) {
      const w = 4 + Math.floor(r() * 5);
      const h = 4 + Math.floor(r() * 8);
      px(c, x, 42 - h, w, h, pal.cityNear);
      if (night) for (let yy = 44 - h; yy < 41; yy += 2) for (let xx = x + 1; xx < x + w - 1; xx += 2) if (r() < 0.3) px(c, xx, yy, 1, 1, pal.lit);
      x += w + (r() < 0.3 ? 1 : 0);
    }
  }

  const codeLines = (() => {
    const r = rng(5);
    const out: { segs: [number, number, string][]; len: number }[] = [];
    let indent = 0;
    for (let i = 0; i < 24; i++) {
      const segs: [number, number, string][] = [];
      let len = indent * 2;
      const n = 1 + Math.floor(r() * 3);
      for (let s = 0; s < n && len < 22; s++) {
        const w = Math.min(2 + Math.floor(r() * 6), 25 - len);
        segs.push([len, w, CODE[Math.floor(r() * CODE.length)]]);
        len += w + 1;
      }
      out.push({ segs, len });
      indent = clamp(indent + (r() < 0.4 ? 1 : r() < 0.5 ? -1 : 0), 0, 3);
    }
    return out;
  })();

  function drawWindow(c: Ctx, t: number) {
    c.save();
    c.beginPath();
    c.rect(99, 25, 50, 42);
    c.clip();
    let y = 25;
    [9, 8, 8, 8, 9].forEach((h, i) => {
      px(c, 99, y, 50, h, pal.sky[i]);
      y += h;
    });
    if (night) {
      STARS.forEach(([sx, sy], i) => px(c, sx, sy, 1, 1, (Math.floor(t / 420) + i * 3) % 7 === 0 ? "#6b75a8" : "#ffffff"));
      for (let dy = -4; dy <= 4; dy++) {
        for (let dx = -4; dx <= 4; dx++) {
          if (dx * dx + dy * dy <= 17 && (dx - 2) ** 2 + (dy + 1) ** 2 > 12) px(c, 108 + dx, 33 + dy, 1, 1, pal.moon);
        }
      }
    } else {
      for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) if (dx * dx + dy * dy <= 17) px(c, 141 + dx, 33 + dy, 1, 1, pal.sun);
      CLOUDS.forEach((cl) => {
        const span = 50 + cl.rows[0].length;
        const x0 = 99 - cl.rows[0].length + ((Math.floor((t / 1000) * cl.speed) + cl.off) % span);
        cl.rows.forEach((row, ry) =>
          [...row].forEach((p, k) => {
            if (p === "#") px(c, x0 + k, cl.y + ry, 1, 1, ry === cl.rows.length - 1 ? pal.cloudDk : pal.cloud);
          })
        );
      });
    }
    c.drawImage(skyline, 99, 25);
    if (night && Math.floor(t / 900) % 2 === 0) px(c, 131, 28, 1, 1, "#ff5a4f");
    c.restore();
    px(c, 123, 25, 2, 42, pal.frame);
    px(c, 99, 45, 50, 2, pal.frame);
    if (!night) {
      const g = "rgba(255,255,255,0.6)";
      px(c, 101, 31, 1, 1, g);
      px(c, 102, 30, 1, 1, g);
      px(c, 103, 29, 1, 1, g);
    }
  }

  function drawScreen(c: Ctx, t: number) {
    px(c, 192, 72, 28, 16, pal.screen);
    const step = t / 650;
    const base = Math.floor(step);
    const frac = reduce.matches ? 1 : step - base;
    let lastX = 193;
    let lastY = 73;
    for (let i = 0; i < 7; i++) {
      const ln = codeLines[(base + i) % codeLines.length];
      const yy = 73 + i * 2;
      const limit = i === 6 ? Math.floor(ln.len * frac) : 99;
      ln.segs.forEach(([sx, w, col]) => {
        const vis = clamp(limit - sx, 0, w);
        if (vis > 0) px(c, 193 + sx, yy, vis, 1, col);
      });
      if (i === 6) {
        lastX = 193 + Math.min(ln.len, limit) + 1;
        lastY = yy;
      }
    }
    if (Math.floor(t / 500) % 2 === 0) px(c, Math.min(lastX, 218), lastY, 2, 1, "#ffffff");
  }

  /* ---------- dialog ---------- */
  let openId: string | null = null;
  let typeTimer: ReturnType<typeof setInterval> | undefined;

  function smallBtn(label: string, cls = "") {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "btn btn--small" + (cls ? " " + cls : "");
    b.textContent = label;
    return b;
  }
  const focusRoom = () => canvas.focus({ preventScroll: true });
  const say = (text: string) => {
    dlgText.textContent = text;
    dlgFull.textContent = text;
  };

  function openDialog(h: Hotspot, focus: boolean) {
    hideBubble();
    openId = h.id;
    dlg.hidden = false;
    dlgName.textContent = h.name;
    dlgFull.textContent = h.name + ". " + h.text;
    dlgFoot.replaceChildren();
    clearInterval(typeTimer);
    if (reduce.matches) dlgText.textContent = h.text;
    else {
      let i = 0;
      dlgText.textContent = "";
      typeTimer = setInterval(() => {
        i += 2;
        dlgText.textContent = h.text.slice(0, i);
        if (i >= h.text.length) clearInterval(typeTimer);
      }, 16);
    }
    if (h.email) {
      const email = h.email;
      const span = document.createElement("span");
      span.className = "dialog__email";
      span.textContent = email;
      const copy = smallBtn("Copy address");
      const selectIt = () => {
        const sel = getSelection();
        const range = document.createRange();
        range.selectNodeContents(span);
        sel?.removeAllRanges();
        sel?.addRange(range);
        copy.textContent = "Selected, press copy";
      };
      copy.addEventListener("click", () => {
        // No clipboard API on plain http pages; select the address instead.
        if (!navigator.clipboard) return selectIt();
        navigator.clipboard.writeText(email).then(() => {
          copy.textContent = "Copied";
          announce("Email address copied");
        }, selectIt);
      });
      dlgFoot.append(span, copy);
    }
    if (h.link) {
      const a = document.createElement("a");
      a.className = "btn btn--small";
      a.href = h.link.href;
      a.target = "_blank";
      a.rel = "noreferrer";
      a.textContent = h.link.label + " ↗";
      dlgFoot.append(a);
    }
    if (h.scroll) {
      const target = h.scroll.target;
      const b = smallBtn(h.scroll.label + " ↓");
      b.addEventListener("click", () =>
        document.getElementById(target)?.scrollIntoView({ behavior: reduce.matches ? "auto" : "smooth" })
      );
      dlgFoot.append(b);
    }
    if (h.egg) {
      const b = smallBtn("snake.exe", "btn--egg");
      b.setAttribute("aria-label", "Play snake on the monitor");
      b.addEventListener("click", startSnake);
      dlgFoot.append(b);
    }
    const close = smallBtn("Close", "dialog__close");
    close.addEventListener("click", () => {
      closeDialog();
      focusRoom();
    });
    dlgFoot.append(close);
    if (focus) dlg.focus({ preventScroll: true });
  }
  function closeDialog() {
    openId = null;
    dlg.hidden = true;
    clearInterval(typeTimer);
    dlgFull.textContent = "";
  }

  /* ---------- the player ---------- */
  const hero = { x: 128, y: 131, facing: 1, walkT: 0, moving: false };
  let target: { x: number; y: number; use: Hotspot | null; focus?: boolean } | null = null;
  type Dir = "l" | "r" | "u" | "d";
  const input: Record<Dir, boolean> = { l: false, r: false, u: false, d: false };
  const padInput: Record<Dir, boolean> = { l: false, r: false, u: false, d: false };
  const cx = (h: Hotspot) => Math.round((h.x0 + h.x1) / 2);

  // You have to walk up to the wall, not just line up with something from the front of the floor.
  function nearest(): Hotspot | null {
    if (hero.y > Y0 + 8) return null;
    let best: Hotspot | null = null;
    let bd = Infinity;
    for (const h of HOTSPOTS) {
      if (hero.x < h.x0 - 4 || hero.x > h.x1 + 4) continue;
      const d = Math.abs(hero.x - cx(h));
      if (d < bd) {
        bd = d;
        best = h;
      }
    }
    return best;
  }
  function walkTo(h: Hotspot, focus: boolean) {
    if (SN.active) return;
    target = { x: clamp(cx(h), 12, 244), y: 120, use: h, focus };
    announce("Walking to the " + h.short + ".");
  }
  function interactNearest() {
    const h = nearest();
    if (!h) {
      announce("Nothing to use here. Walk up to something first, or pick it from the list below the room.");
      return;
    }
    if (openId === h.id) closeDialog();
    else openDialog(h, false);
  }

  /* ---------- snake ---------- */
  const SN = {
    active: false, zoom: 0, body: [] as number[][], dir: [1, 0], queue: [] as number[][],
    food: [0, 0], alive: true, waiting: true, score: 0, best: Number(store("pixelroom.snake.best")) || 0,
    step: 0.13, acc: 0, playStart: null as number | null, game: null as string | null,
  };

  function snakeReset() {
    if (openId === "post") closeDialog();
    SN.body = [[8, 8], [7, 8], [6, 8], [5, 8]];
    SN.dir = [1, 0];
    SN.queue = [];
    SN.alive = true;
    SN.waiting = true;
    SN.score = 0;
    SN.step = 0.13;
    SN.acc = 0;
    SN.playStart = null;
    SN.game = null;
    placeFood();
    snakeUi();
  }
  function placeFood() {
    let f: number[];
    do f = [Math.floor(Math.random() * GW), Math.floor(Math.random() * GH)];
    while (SN.body.some((b) => b[0] === f[0] && b[1] === f[1]));
    SN.food = f;
  }
  function snakeTurn(dx: number, dy: number) {
    if (!SN.alive) return;
    const last = SN.queue.length ? SN.queue[SN.queue.length - 1] : SN.dir;
    if ((dx === -last[0] && dy === -last[1]) || (dx === last[0] && dy === last[1])) {
      if (SN.waiting && dx === last[0] && dy === last[1]) SN.waiting = false;
      return;
    }
    SN.waiting = false;
    if (SN.queue.length < 3) SN.queue.push([dx, dy]);
  }
  function snakeStep() {
    if (SN.queue.length) SN.dir = SN.queue.shift()!;
    const h = SN.body[0];
    const n = [h[0] + SN.dir[0], h[1] + SN.dir[1]];
    const hitSelf = SN.body.some((b, i) => i < SN.body.length - 1 && b[0] === n[0] && b[1] === n[1]);
    if (n[0] < 0 || n[1] < 0 || n[0] >= GW || n[1] >= GH || hitSelf) {
      SN.alive = false;
      if (SN.score > SN.best) {
        SN.best = SN.score;
        store("pixelroom.snake.best", String(SN.best));
      }
      announce("Game over. Score " + SN.score + ". Best " + SN.best + ".");
      snakeUi();
      if (SN.score > 0) openPostDialog();
      return;
    }
    SN.body.unshift(n);
    if (n[0] === SN.food[0] && n[1] === SN.food[1]) {
      SN.score++;
      SN.step = Math.max(0.065, SN.step - 0.003);
      placeFood();
      snakeUi();
    } else SN.body.pop();
  }
  function snakeUpdate(dt: number) {
    if (!SN.active || SN.zoom < 1 || !SN.alive || SN.waiting) return;
    if (SN.playStart == null) {
      SN.playStart = performance.now();
      startGameOnServer();
    }
    SN.acc += dt;
    while (SN.acc >= SN.step && SN.alive) {
      SN.acc -= SN.step;
      snakeStep();
    }
  }
  function drawSnake(c: Ctx, t: number) {
    px(c, 0, 0, W, H, "#0b0c18");
    px(c, 2, 2, W - 4, H - 4, pal.mon);
    px(c, OX - 2, OY - 2, GW * CELL + 4, GH * CELL + 4, "#0b0c18");
    px(c, OX, OY, GW * CELL, GH * CELL, "#0d1526");
    for (let y = 0; y < GH; y++) for (let x = 0; x < GW; x++) px(c, OX + x * CELL + 3, OY + y * CELL + 3, 1, 1, "#18233a");
    text3(c, "SCORE " + SN.score, OX, 3, "#c7cbe2");
    const best = "BEST " + SN.best;
    text3(c, best, OX + GW * CELL - textW(best), 3, "#c7cbe2");
    const [fx, fy] = SN.food;
    if (SN.alive || Math.floor(t / 300) % 2) px(c, OX + fx * CELL + 1, OY + fy * CELL + 1, 6, 6, "#ef8a7a");
    SN.body.forEach(([x, y], i) => px(c, OX + x * CELL, OY + y * CELL, 7, 7, i === 0 ? "#d6fff0" : "#7fd1b9"));
    const msg = !SN.alive ? "GAME OVER" : SN.waiting ? "READY" : "";
    if (msg) {
      const w = textW(msg) + 12;
      px(c, Math.round(W / 2 - w / 2), 64, w, 13, "#0b0c18");
      text3(c, msg, Math.round(W / 2 - textW(msg) / 2), 68, !SN.alive ? "#ef8a7a" : "#ffd166");
    }
  }
  function snakeUi() {
    snakeScore.textContent = "Score " + SN.score + " · Best " + SN.best;
  }

  function startSnake() {
    closeDialog();
    hideBubble();
    target = null;
    SN.active = true;
    snakeReset();
    pad.classList.add("is-snake");
    // Vertical swipes steer instead of scrolling the page while the game is open.
    canvas.style.touchAction = "none";
    boardEl.hidden = false;
    snakebar.hidden = false;
    skillsLine.hidden = true;
    promptEl.hidden = true;
    loadBoard();
    canvas.scrollIntoView({ block: "nearest", behavior: reduce.matches ? "auto" : "smooth" });
    focusRoom();
    announce("Snake. Steer with the arrow keys, W A S D, the touch pad or a swipe on the screen. Escape or Quit snake leaves.");
  }
  function stopSnake() {
    SN.active = false;
    if (openId === "post") closeDialog();
    boardEl.hidden = true;
    canvas.style.touchAction = "";
    pad.classList.remove("is-snake");
    snakebar.hidden = true;
    skillsLine.hidden = false;
    promptEl.hidden = false;
    announce("Back in the room.");
    focusRoom();
  }

  /* ---------- leaderboard ---------- */
  const player = (() => {
    const saved = store("pixelroom.snake.player");
    if (saved && /^[0-9a-f-]{36}$/.test(saved)) return saved;
    const id = uuid();
    store("pixelroom.snake.player", id);
    return id;
  })();
  let boardState: "loading" | "ready" | "off" | "error" = "loading";
  let rows: BoardRow[] = [];

  function renderBoard() {
    boardList.replaceChildren();
    rows.forEach((r) => {
      const li = document.createElement("li");
      if (r.you) li.className = "is-me";
      const rank = document.createElement("span");
      rank.className = "board__rank";
      rank.textContent = String(r.rank).padStart(2, "0");
      const name = document.createElement("span");
      name.textContent = r.initials;
      if (r.you) {
        const you = document.createElement("span");
        you.className = "board__you";
        you.textContent = "you";
        name.append(you);
      }
      const score = document.createElement("span");
      score.textContent = String(r.score);
      li.append(rank, name, score);
      boardList.append(li);
    });
    const msg =
      boardState === "loading" ? "Loading scores…"
      : boardState === "off" ? "The leaderboard isn't set up yet. Your best score still saves in this browser."
      : boardState === "error" ? "Couldn't load the leaderboard just now."
      : rows.length ? "" : "No scores yet. Finish a game and post yours.";
    boardEmpty.textContent = msg;
    boardEmpty.hidden = !msg;
  }
  async function loadBoard() {
    try {
      const res = await fetch("/api/snake", { headers: { "x-snake-player": player }, cache: "no-store" });
      if (!alive) return;
      if (res.status === 503) boardState = "off";
      else if (!res.ok) boardState = "error";
      else {
        const data = (await res.json()) as { rows: BoardRow[] };
        rows = Array.isArray(data.rows) ? data.rows.slice(0, 10) : [];
        boardState = "ready";
      }
    } catch {
      boardState = "error";
    }
    if (alive) renderBoard();
  }
  async function startGameOnServer() {
    if (boardState === "off") return;
    try {
      const res = await fetch("/api/snake", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "start", player }),
      });
      if (res.ok) SN.game = ((await res.json()) as { game?: string }).game ?? null;
    } catch {
      SN.game = null;
    }
  }

  function openPostDialog() {
    const score = SN.score;
    const game = SN.game;
    const elapsed = SN.playStart == null ? 0 : performance.now() - SN.playStart;
    openId = "post";
    dlg.hidden = false;
    dlgName.textContent = "High score";
    dlgFoot.replaceChildren();
    clearInterval(typeTimer);
    const ok = () => {
      const b = smallBtn("OK", "dialog__close");
      b.addEventListener("click", () => {
        closeDialog();
        focusRoom();
      });
      return b;
    };

    if (boardState === "off" || !game) {
      say(
        "You scored " + score + ". " +
          (boardState === "off"
            ? "The leaderboard isn't set up yet, so this score stays in your browser."
            : "The leaderboard couldn't be reached when this game started, so this score can't be posted.")
      );
      dlgFoot.append(ok());
      return;
    }
    say("You scored " + score + ". Post it to the leaderboard?");

    const form = document.createElement("form");
    form.className = "post";
    form.noValidate = true;
    const label = document.createElement("label");
    label.htmlFor = "snake-initials";
    label.textContent = "Your initials";
    const field = document.createElement("input");
    field.id = "snake-initials";
    field.maxLength = 3;
    field.autocomplete = "off";
    field.spellcheck = false;
    field.setAttribute("autocapitalize", "characters");
    field.setAttribute("aria-describedby", "snake-post-error");
    field.value = cleanInitials(store("pixelroom.snake.initials"));
    label.append(field);
    const post = document.createElement("button");
    post.type = "submit";
    post.className = "btn btn--small";
    post.textContent = "Post score";
    const skip = smallBtn("Keep it to myself");
    const err = document.createElement("p");
    err.className = "post__error";
    err.id = "snake-post-error";
    err.setAttribute("role", "alert");
    form.append(label, post, skip, err);
    dlgFoot.append(form);

    field.addEventListener("input", () => {
      const v = cleanInitials(field.value);
      if (v !== field.value) field.value = v;
      err.textContent = "";
    });
    field.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        skip.click();
      }
    });
    skip.addEventListener("click", () => {
      closeDialog();
      announce("Score kept to yourself.");
      focusRoom();
    });
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const initials = cleanInitials(field.value);
      if (initials.length !== 3) {
        err.textContent = "Use three letters, A to Z.";
        field.focus();
        return;
      }
      if (!isAllowedInitials(initials)) {
        err.textContent = "Those initials aren't allowed on the leaderboard. Try different ones.";
        field.focus();
        return;
      }
      if (!isPlausibleScore(score, elapsed)) {
        err.textContent = "That score didn't pass the check, so it wasn't posted.";
        return;
      }
      post.disabled = true;
      post.textContent = "Posting…";
      store("pixelroom.snake.initials", initials);
      try {
        const res = await fetch("/api/snake", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ action: "submit", player, game, initials, score }),
        });
        const data = (await res.json().catch(() => ({}))) as { posted?: boolean; best?: number; error?: string };
        if (!alive) return;
        if (res.ok && data.posted) {
          closeDialog();
          announce("Posted " + initials + " with " + score + " to the leaderboard.");
          loadBoard();
          focusRoom();
          return;
        }
        if (res.ok) {
          say("Your best on the leaderboard is " + data.best + ", so this score wasn't posted.");
          dlgFoot.replaceChildren(ok());
          return;
        }
        post.disabled = false;
        post.textContent = "Post score";
        err.textContent =
          data.error === "initials_not_allowed" ? "Those initials aren't allowed on the leaderboard. Try different ones."
          : data.error === "rate_limited" ? "Too many posts from here. Try again in a few minutes."
          : data.error === "game_expired" ? "This game is too old to post. Play another and post it within the hour."
          : data.error === "implausible" ? "That score didn't pass the check, so it wasn't posted."
          : "Couldn't post just now. Try again in a moment.";
      } catch {
        post.disabled = false;
        post.textContent = "Post score";
        err.textContent = "Couldn't post just now. Try again in a moment.";
      }
    });
    later(() => field.focus({ preventScroll: true }), 60);
  }

  /* ---------- typing: the intro in a speech bubble, the skills in the status bar ---------- */
  let bubbleOn = true;
  let introDone = false;
  function hideBubble() {
    bubbleOn = false;
    bubble.hidden = true;
  }
  async function typeSeq(el: HTMLElement, seq: string[], holds: number[], loop: boolean) {
    let cur = "";
    do {
      for (let i = 0; i < seq.length; i++) {
        const s = seq[i];
        let p = 0;
        while (p < cur.length && p < s.length && cur[p] === s[p]) p++;
        while (cur.length > p) {
          cur = cur.slice(0, -1);
          el.textContent = cur;
          await wait(22);
          if (!alive) return;
        }
        while (cur.length < s.length) {
          cur = s.slice(0, cur.length + 1);
          el.textContent = cur;
          await wait(40);
          if (!alive) return;
        }
        await wait(holds[i] ?? holds[holds.length - 1]);
        if (!alive) return;
      }
    } while (loop);
  }
  if (reduce.matches) {
    bubbleText.textContent = INTRO[2];
    skillsEl.textContent = SKILLS.slice(0, -1).join(", ") + ", and " + SKILLS[SKILLS.length - 1];
    introDone = true;
  } else {
    typeSeq(bubbleText, INTRO, [1400, 1400, 1200], false).then(() => {
      if (!alive) return;
      introDone = true;
      later(hideBubble, 2600);
      typeSeq(skillsEl, SKILLS, [1400], true);
    });
  }

  /* ---------- sizing: integer scale where the column allows it ---------- */
  const stageBox = root;
  // Width-led, but never taller than the screen leaves room for (landscape phones).
  // Phones in portrait run the room edge to edge, so they size to the viewport.
  function fit() {
    const edgeToEdge = matchMedia("(max-width: 520px)").matches;
    const avail = edgeToEdge ? document.documentElement.clientWidth : stageBox.clientWidth - 8;
    const byHeight = Math.max(W, ((window.innerHeight - 150) * W) / H);
    const limit = Math.min(avail, byHeight);
    const s = Math.min(4, Math.floor(limit / W));
    const w = s >= 2 ? s * W : Math.max(200, Math.floor(limit));
    canvas.style.width = w + "px";
    canvas.style.height = Math.round((w * H) / W) + "px";
    // A small room (phones, landscape phones) puts the dialog under it instead of over it.
    root.classList.toggle("room--compact", w < 600);
  }
  const ro = new ResizeObserver(fit);
  ro.observe(stageBox);
  cleanups.push(() => ro.disconnect());
  listen(window, "resize", fit);
  fit();

  /* ---------- object buttons ---------- */
  objects.replaceChildren();
  HOTSPOTS.forEach((h) => {
    const b = smallBtn(h.button);
    b.addEventListener("click", () => walkTo(h, true));
    objects.append(b);
  });

  /* ---------- pointer: tap to walk or use, swipe to steer the snake ---------- */
  let down: { x: number; y: number } | null = null;
  const onDown = (e: PointerEvent) => {
    down = { x: e.clientX, y: e.clientY };
    focusRoom();
  };
  const onUp = (e: PointerEvent) => {
    if (!down) return;
    const dx = e.clientX - down.x;
    const dy = e.clientY - down.y;
    down = null;
    if (SN.active) {
      if (Math.max(Math.abs(dx), Math.abs(dy)) > 18) {
        if (Math.abs(dx) > Math.abs(dy)) snakeTurn(Math.sign(dx), 0);
        else snakeTurn(0, Math.sign(dy));
      } else if (!SN.alive && openId !== "post") snakeReset();
      else if (SN.waiting) SN.waiting = false;
      return;
    }
    if (Math.max(Math.abs(dx), Math.abs(dy)) > 12) return;
    const r = canvas.getBoundingClientRect();
    const lx = ((e.clientX - r.left) / r.width) * W;
    const ly = ((e.clientY - r.top) / r.height) * H;
    const hit = HOTSPOTS.find((h) => lx >= h.x0 && lx <= h.x1 && ly >= h.y0 && ly <= h.y1);
    if (hit) walkTo(hit, false);
    else target = { x: clamp(Math.round(lx), 12, 244), y: ly < 110 ? Y0 + 2 : clamp(Math.round(ly), Y0, Y1), use: null };
  };
  const onCancel = () => (down = null);
  canvas.addEventListener("pointerdown", onDown);
  canvas.addEventListener("pointerup", onUp);
  canvas.addEventListener("pointercancel", onCancel);
  cleanups.push(() => {
    canvas.removeEventListener("pointerdown", onDown);
    canvas.removeEventListener("pointerup", onUp);
    canvas.removeEventListener("pointercancel", onCancel);
  });

  /* ---------- touch pad ---------- */
  const SNAKE_DIRS: Record<string, [number, number]> = { l: [-1, 0], r: [1, 0], f: [0, -1], b: [0, 1] };
  const PAD_WALK: Record<string, Dir> = { l: "l", r: "r", f: "u", b: "d" };
  pad.querySelectorAll<HTMLButtonElement>("[data-dir]").forEach((b) => {
    const d = b.dataset.dir as string;
    const press = (e: PointerEvent) => {
      e.preventDefault();
      b.classList.add("is-down");
      if (SN.active) snakeTurn(...SNAKE_DIRS[d]);
      else {
        padInput[PAD_WALK[d]] = true;
        target = null;
      }
    };
    const release = () => {
      b.classList.remove("is-down");
      padInput[PAD_WALK[d]] = false;
    };
    const click = (e: MouseEvent) => {
      if (e.detail === 0 && SN.active) snakeTurn(...SNAKE_DIRS[d]);
    };
    const menu = (e: Event) => e.preventDefault();
    b.addEventListener("pointerdown", press);
    b.addEventListener("pointerup", release);
    b.addEventListener("pointerleave", release);
    b.addEventListener("pointercancel", release);
    b.addEventListener("click", click);
    b.addEventListener("contextmenu", menu);
    cleanups.push(() => {
      b.removeEventListener("pointerdown", press);
      b.removeEventListener("pointerup", release);
      b.removeEventListener("pointerleave", release);
      b.removeEventListener("pointercancel", release);
      b.removeEventListener("click", click);
      b.removeEventListener("contextmenu", menu);
    });
  });
  const onUse = () => {
    if (SN.active) {
      if (!SN.alive && openId !== "post") snakeReset();
      else if (SN.waiting) SN.waiting = false;
      return;
    }
    interactNearest();
  };
  useBtn.addEventListener("click", onUse);
  cleanups.push(() => useBtn.removeEventListener("click", onUse));

  const restartBtn = q("snake-restart");
  const quitBtn = q("snake-quit");
  const onRestart = () => {
    snakeReset();
    focusRoom();
  };
  restartBtn.addEventListener("click", onRestart);
  quitBtn.addEventListener("click", stopSnake);
  cleanups.push(() => {
    restartBtn.removeEventListener("click", onRestart);
    quitBtn.removeEventListener("click", stopSnake);
  });

  /* ---------- keyboard ---------- */
  const WALK: Record<string, Dir> = { arrowleft: "l", a: "l", arrowright: "r", d: "r", arrowup: "u", w: "u", arrowdown: "d", s: "d" };
  const STEER: Record<string, string> = { arrowleft: "l", a: "l", arrowright: "r", d: "r", arrowup: "f", w: "f", arrowdown: "b", s: "b" };
  let typedBuf = "";
  const typing = (el: Element | null) =>
    !!el && ((el as HTMLElement).isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));

  listen(window, "keydown", (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey || typing(document.activeElement)) return;
    const k = e.key.toLowerCase();
    const onCanvas = document.activeElement === canvas;
    const free = onCanvas || document.activeElement === document.body;

    if (k.length === 1) {
      typedBuf = (typedBuf + k).slice(-5);
      if (typedBuf === "snake" && !SN.active) {
        startSnake();
        return;
      }
    }
    if (SN.active) {
      if (k === "escape" && openId === "post") {
        e.preventDefault();
        closeDialog();
        focusRoom();
        return;
      }
      if (k === "escape") {
        e.preventDefault();
        stopSnake();
        return;
      }
      const d = STEER[k];
      if (d && (free || k.startsWith("arrow"))) {
        e.preventDefault();
        snakeTurn(...SNAKE_DIRS[d]);
        return;
      }
      if ((k === "enter" || k === " ") && free) {
        e.preventDefault();
        if (!SN.alive) snakeReset();
        else SN.waiting = false;
      }
      return;
    }
    if (k === "escape" && openId) {
      closeDialog();
      return;
    }
    if (!free || !inView) return;
    const d = WALK[k];
    if (d) {
      if ((k === "arrowup" || k === "arrowdown") && !onCanvas) return;
      if (onCanvas || !k.startsWith("arrow")) e.preventDefault();
      input[d] = true;
      target = null;
    } else if (k === "e" || ((k === "enter" || k === " ") && onCanvas)) {
      e.preventDefault();
      interactNearest();
    }
  });
  listen(window, "keyup", (e) => {
    const d = WALK[e.key.toLowerCase()];
    if (d) input[d] = false;
  });
  listen(window, "blur", () => {
    (Object.keys(input) as Dir[]).forEach((k) => (input[k] = false));
  });

  /* ---------- theme ---------- */
  function applyTheme() {
    night = isNight();
    pal = night ? NIGHT : DAY;
    drawStatic();
    drawSkyline();
  }
  cleanups.push(onThemeChange(applyTheme));

  /* ---------- loop ---------- */
  let inView = true;
  const io = new IntersectionObserver(([e]) => (inView = e.isIntersecting));
  io.observe(scene);
  cleanups.push(() => io.disconnect());

  let last = performance.now();
  let lastNear: Hotspot | null = null;
  let raf = 0;

  function drawRoom(c: Ctx, now: number, amb: number, near: Hotspot | null) {
    c.drawImage(stat, 0, 0);
    drawWindow(c, amb);
    drawScreen(c, amb);
    // Pi LEDs: power stays on, activity flickers
    px(c, 235, 89, 1, 1, "#ff5a4f");
    const act = reduce.matches || [0, 2, 3].includes(Math.floor(now / 140) % 11);
    px(c, 236, 89, 1, 1, act ? "#6dff7a" : pal.piOff);
    if (!reduce.matches) {
      const s = Math.floor(now / 260) % 4;
      const s2 = (s + 2) % 4;
      px(c, 227, 84 - s, 1, 1, "rgba(255,255,255," + (0.5 - s * 0.12) + ")");
      px(c, 229, 83 - s2, 1, 1, "rgba(255,255,255," + (0.5 - s2 * 0.12) + ")");
    }
    // highlight whatever you're standing next to
    if (near && near.outline && near.wash && openId !== near.id) {
      const pulse = reduce.matches ? 0 : Math.floor(now / 450) % 2;
      c.globalAlpha = pulse ? 0.16 : 0.1;
      c.drawImage(near.wash, near.rect[0] - 2, near.rect[1] - 2);
      c.globalAlpha = pulse ? 0.75 : 1;
      c.drawImage(near.outline, near.rect[0] - 2, near.rect[1] - 2);
      c.globalAlpha = 1;
    }
    // hero
    const hx = Math.round(hero.x) - 8;
    const hy = Math.round(hero.y);
    px(c, hx + 3, hy - 1, 10, 1, pal.shadow);
    px(c, hx + 4, hy, 8, 1, pal.shadow);
    const legs: Legs = hero.moving ? (Math.floor(hero.walkT * 8) % 2 ? "A" : "B") : "N";
    const bob = !hero.moving && !reduce.matches && Math.floor(now / 700) % 2 ? 1 : 0;
    drawSprite(c, legs, hx, hy - 27, hero.facing < 0, bob, now % 3400 < 130);
  }

  function tick(now: number) {
    if (!alive) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const amb = reduce.matches ? 0 : now;

    // movement: A and D along the room, W and S toward and away from the wall
    const held = (k: Dir) => input[k] || padInput[k];
    const dir = SN.active ? 0 : (held("r") ? 1 : 0) - (held("l") ? 1 : 0);
    const dep = SN.active ? 0 : (held("d") ? 1 : 0) - (held("u") ? 1 : 0);
    hero.moving = false;
    if (dir || dep) {
      const n = dir && dep ? Math.SQRT1_2 : 1;
      hero.x += dir * 52 * n * dt;
      hero.y += dep * 34 * n * dt;
      if (dir) hero.facing = dir;
      hero.moving = true;
      target = null;
    } else if (target && !SN.active) {
      const dx = target.x - hero.x;
      const dy = target.y - hero.y;
      if (Math.abs(dx) <= 1 && Math.abs(dy) <= 1) {
        hero.x = target.x;
        hero.y = target.y;
        if (target.use) openDialog(target.use, !!target.focus);
        target = null;
      } else {
        const step = Math.min(1, (60 * dt) / Math.hypot(dx, dy * 1.5));
        hero.x += dx * step;
        hero.y += dy * step;
        if (Math.abs(dx) > 0.5) hero.facing = Math.sign(dx);
        hero.moving = true;
      }
    }
    hero.x = clamp(hero.x, 12, 244);
    hero.y = clamp(hero.y, Y0, Y1);
    if (hero.moving) hero.walkT += dt;
    else hero.walkT = 0;
    if (hero.moving && introDone && bubbleOn) hideBubble();

    const near = SN.active ? null : nearest();
    if (openId && openId !== "post" && (!near || near.id !== openId) && hero.moving) closeDialog();
    if (near !== lastNear) {
      lastNear = near;
      if (near) announce("Next to the " + near.short + ". Press E, or Use, to look at it.");
      promptEl.replaceChildren();
      if (near) {
        if (coarse.matches) promptEl.textContent = "Tap Use: " + near.short;
        else {
          const kbd = document.createElement("kbd");
          kbd.textContent = "E";
          promptEl.append(kbd, " use the " + near.short);
        }
      }
      useBtn.setAttribute("aria-label", near ? "Use the " + near.short : "Use");
    }
    useBtn.disabled = !near && !SN.active;

    // zoom toward the monitor for snake, and back out
    const zTarget = SN.active ? 1 : 0;
    SN.zoom = reduce.matches ? zTarget : clamp(SN.zoom + (Math.sign(zTarget - SN.zoom) * dt) / 0.45, 0, 1);
    snakeUpdate(dt);

    if (inView) {
      if (SN.zoom >= 1) drawSnake(ctx, now);
      else if (SN.zoom > 0) {
        drawRoom(fctx, now, amb, null);
        const e = SN.zoom * SN.zoom * (3 - 2 * SN.zoom);
        ctx.drawImage(frame, MON.x * e, MON.y * e, W + (MON.w - W) * e, H + (MON.h - H) * e, 0, 0, W, H);
      } else drawRoom(ctx, now, amb, near);

      // keep the speech bubble over the character's head
      if (bubbleOn && !openId && SN.zoom === 0) {
        bubble.hidden = false;
        const cw = canvas.clientWidth;
        const ch = canvas.clientHeight;
        const bw = bubble.offsetWidth;
        bubble.style.left = clamp((hero.x / W) * cw, bw / 2 + 6, cw - bw / 2 - 6) + "px";
        bubble.style.top = Math.max(bubble.offsetHeight + 20, ((hero.y - 28) / H) * ch) + "px";
      } else bubble.hidden = true;
    }
    raf = requestAnimationFrame(tick);
  }

  applyTheme();
  snakeUi();
  renderBoard();
  raf = requestAnimationFrame(tick);

  return () => {
    alive = false;
    cancelAnimationFrame(raf);
    clearInterval(typeTimer);
    timers.forEach(clearTimeout);
    cleanups.forEach((fn) => fn());
  };
}
