/**
 * The project figures, one animated pixel scene per project, drawn at 192x108.
 * Each scene is a factory returning a draw function of (colours, seconds, delta);
 * most are pure functions of time, Tera's keeps a little state. `still` is the
 * moment drawn for people who turn motion off: the frame that makes the point.
 */
import { clamp, line, px, text3, textW, type Ctx } from "./art";

export const FW = 192;
export const FH = 108;

export type Colors = {
  ink: string; soft: string; faint: string; accent: string; bad: string;
  good: string; bg: string; fill: string; hi: string; warm: string;
};
type Run = (c: Ctx, k: Colors, t: number, dt: number) => void;
type Scene = { label: string; still: number; make: (still: boolean) => Run };

/* ---------- helpers ---------- */

const seg = (t: number, a: number, b: number) => clamp((t - a) / (b - a), 0, 1);
const ease = (u: number) => u * u * (3 - 2 * u);
const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
const R = Math.round;

function frame(c: Ctx, x: number, y: number, w: number, h: number, col: string) {
  px(c, x, y, w, 1, col);
  px(c, x, y + h - 1, w, 1, col);
  px(c, x, y, 1, h, col);
  px(c, x + w - 1, y, 1, h, col);
}
function dashFrame(c: Ctx, x: number, y: number, w: number, h: number, col: string) {
  c.fillStyle = col;
  for (let i = 0; i < w; i += 2) {
    c.fillRect(x + i, y, 1, 1);
    c.fillRect(x + i, y + h - 1, 1, 1);
  }
  for (let i = 0; i < h; i += 2) {
    c.fillRect(x, y + i, 1, 1);
    c.fillRect(x + w - 1, y + i, 1, 1);
  }
}
function dashH(c: Ctx, x: number, y: number, w: number, col: string, shift = 0) {
  c.fillStyle = col;
  for (let i = 0; i < w; i++) if ((i + shift) % 3 === 0) c.fillRect(x + i, y, 1, 1);
}
function dashV(c: Ctx, x: number, y: number, h: number, col: string, shift = 0) {
  c.fillStyle = col;
  for (let i = 0; i < h; i++) if ((i + shift) % 3 === 0) c.fillRect(x, y + i, 1, 1);
}
function arrowR(c: Ctx, x: number, y: number, len: number, col: string) {
  px(c, x, y, len, 1, col);
  const e = x + len - 1;
  px(c, e - 1, y - 1, 1, 1, col);
  px(c, e - 1, y + 1, 1, 1, col);
  px(c, e - 2, y - 2, 1, 1, col);
  px(c, e - 2, y + 2, 1, 1, col);
}
function arrowD(c: Ctx, x: number, y: number, len: number, col: string) {
  px(c, x, y, 1, len, col);
  const e = y + len - 1;
  px(c, x - 1, e - 1, 1, 1, col);
  px(c, x + 1, e - 1, 1, 1, col);
  px(c, x - 2, e - 2, 1, 1, col);
  px(c, x + 2, e - 2, 1, 1, col);
}
const textC = (c: Ctx, s: string, cx: number, y: number, col: string, scale = 1) =>
  text3(c, s, R(cx - textW(s, scale) / 2), y, col, scale);
const textRight = (c: Ctx, s: string, right: number, y: number, col: string) => text3(c, s, right - textW(s), y, col);

function sprite(c: Ctx, rows: string[], x: number, y: number, col: string) {
  c.fillStyle = col;
  rows.forEach((row, r) => [...row].forEach((p, k) => p === "#" && c.fillRect(x + k, y + r, 1, 1)));
}
const CHECK = ["....#", "...#.", "#.#..", ".#..."];
const RING = [".###.", "#...#", "#...#", "#...#", ".###."];
const BELL = ["..#..", ".###.", ".###.", "#####", "..#.."];

/** A point a fraction of the way along a polyline. */
function walk(points: number[][], u: number): [number, number] {
  const lens = points.slice(1).map((p, i) => Math.hypot(p[0] - points[i][0], p[1] - points[i][1]));
  let d = clamp(u, 0, 1) * lens.reduce((a, b) => a + b, 0);
  for (let i = 0; i < lens.length; i++) {
    if (d <= lens[i] || i === lens.length - 1) {
      const f = lens[i] ? Math.min(1, d / lens[i]) : 0;
      return [lerp(points[i][0], points[i + 1][0], f), lerp(points[i][1], points[i + 1][1], f)];
    }
    d -= lens[i];
  }
  return [points[0][0], points[0][1]];
}
function dot(c: Ctx, x: number, y: number, k: Colors, size = 3) {
  px(c, R(x) - 1, R(y) - 1, size + 2, size + 2, k.ink);
  px(c, R(x), R(y), size, size, k.hi);
}

/* ---------- 01 Forward deployed engineering ---------- */

const fde: Scene = {
  label: "A client's problem is scoped into a checklist, built by the engineers block by block, and shipped as the first milestone, with fireworks when the flag goes up.",
  still: 7.95,
  make: () => (c, k, t) => {
    px(c, 0, 0, FW, FH, k.bg);
    const T = t % 9.8;
    const xs = [6, 54, 102, 150];
    const labels = ["CLIENT", "SCOPE", "BUILD", "SHIP"];
    // Where the problem is: at a station, or moving between two.
    const stops = [[0, 0.7], [1.5, 3.1], [3.9, 5.5], [6.3, 9.8]];
    let pos = 0;
    stops.forEach(([a], i) => {
      if (T >= a) pos = i;
      if (i > 0 && T > stops[i - 1][1] && T < a) pos = i - 1 + ease(seg(T, stops[i - 1][1], a));
    });
    const at = Math.round(pos) === pos ? pos : -1;

    xs.forEach((x, i) => {
      const on = at === i;
      frame(c, x, 26, 36, 18, on ? k.accent : k.ink);
      textC(c, labels[i], x + 18, 33, on ? k.accent : k.ink);
      if (i < 3) arrowR(c, x + 37, 35, 10, k.faint);
    });
    const tx = lerp(xs[0], xs[3], pos / 3) + 18;
    px(c, R(tx) - 4, 17, 8, 6, k.ink);
    px(c, R(tx) - 3, 18, 6, 4, k.hi);

    // client: the problem
    frame(c, 10, 54, 28, 16, k.soft);
    px(c, 18, 70, 3, 2, k.soft);
    textC(c, "?", 24, 59, k.warm);
    textC(c, "PROBLEM", 24, 80, k.soft);

    // scope: the checklist fills in
    for (let i = 0; i < 3; i++) {
      const y = 54 + i * 8;
      px(c, 58, y + 1, 18, 2, k.faint);
      frame(c, 80, y, 5, 5, k.soft);
      if (T > 1.8 + i * 0.4) px(c, 81, y + 1, 3, 3, k.good);
    }
    textC(c, "SCOPED", 72, 80, k.soft);

    // build: the engineers stack it up
    const blocks = T < 4.1 ? 0 : Math.min(3, Math.floor((T - 4.1) / 0.45) + 1);
    for (let i = 0; i < blocks; i++) {
      px(c, 111, 68 - i * 7, 18, 6, k.ink);
      px(c, 112, 69 - i * 7, 16, 4, k.accent);
    }
    textC(c, "NXGP ENG", 120, 80, k.soft);

    // ship: milestone one goes up
    px(c, 158, 50, 1, 24, k.ink);
    px(c, 155, 73, 7, 1, k.ink);
    if (T > 6.4) {
      const fy = R(66 - ease(seg(T, 6.4, 7.3)) * 15);
      px(c, 159, fy, 16, 8, k.good);
      text3(c, "M1", 162, fy + 2, k.bg);
    }
    textC(c, "MILESTONE 1", 168, 80, k.soft);

    // fireworks once the flag is all the way up
    const bursts: [number, number, number, string][] = [
      [7.35, 128, 11, k.hi],
      [7.7, 166, 9, k.good],
      [8.05, 96, 13, k.warm],
      [8.4, 180, 15, k.hi],
    ];
    bursts.forEach(([at, bx, by, col]) => {
      if (T < at) return;
      const rise = seg(T, at, at + 0.25);
      if (rise < 1) {
        const y = R(lerp(24, by, ease(rise)));
        px(c, bx, y, 1, 2, k.hi);
        px(c, bx, y + 3, 1, 1, k.faint);
        return;
      }
      const u = seg(T, at + 0.25, at + 1.2);
      if (u >= 1) return;
      if (u < 0.12) px(c, bx - 1, by - 1, 3, 3, k.hi);
      const r = (1 - (1 - u) ** 2) * 14;
      const fall = u * u * 5;
      for (let i = 0; i < 16; i++) {
        if (u > 0.7 && (i + Math.floor(t * 12)) % 2) continue;
        const a = (i / 16) * Math.PI * 2;
        const size = u < 0.3 ? 2 : 1;
        px(c, R(bx + Math.cos(a) * r), R(by + Math.sin(a) * r + fall), size, size, i % 2 ? col : k.accent);
        if (u > 0.15 && u < 0.8) px(c, R(bx + Math.cos(a) * r * 0.55), R(by + Math.sin(a) * r * 0.55 + fall * 0.7), 1, 1, col);
      }
    });
  },
};

/* ---------- 02 Tera: buffer, then render ---------- */

const stream: Scene = {
  label: "Chunks arrive from the socket into a buffer. A block stays in the buffer, marked open, until its last chunk arrives, then it moves to the panel and renders.",
  still: 0,
  make: (still) => {
    const FS = {
      chunks: [] as { x: number; y: number }[], spawn: 0, count: 0, open: 0,
      flying: [] as { t: number; row: number }[], rows: 0, hold: 0,
    };
    if (still) {
      FS.chunks = [{ x: 18, y: 43 }, { x: 34, y: 38 }];
      FS.open = 2;
      FS.rows = 3;
    }
    const SLOT = { x: 58, y: 42 };
    const PANEL = { x: 121, y: 24 };
    const rowW = [32, 26, 32, 20, 30, 24];
    const step = (dt: number) => {
      if (FS.hold > 0) {
        FS.hold -= dt;
        if (FS.hold <= 0) FS.rows = 0;
        return;
      }
      FS.spawn -= dt;
      if (FS.spawn <= 0 && FS.rows + FS.flying.length < 6) {
        FS.chunks.push({ x: 2, y: 38 + (FS.count++ % 3) * 5 });
        FS.spawn = 0.42;
      }
      FS.chunks.forEach((ch) => (ch.x += 44 * dt));
      FS.chunks = FS.chunks.filter((ch) => {
        if (ch.x < 52) return true;
        FS.open++;
        if (FS.open >= 4) {
          FS.open = 0;
          FS.flying.push({ t: 0, row: FS.rows + FS.flying.length });
        }
        return false;
      });
      FS.flying.forEach((b) => (b.t += dt / 0.55));
      FS.flying = FS.flying.filter((b) => {
        if (b.t < 1) return true;
        FS.rows++;
        return false;
      });
      if (FS.rows >= 6) FS.hold = 1.4;
    };
    return (c, k, _t, dt) => {
      if (dt > 0) step(dt);
      px(c, 0, 0, FW, FH, k.bg);
      c.save();
      c.translate(16, 9);
      text3(c, "SOCKET", 4, 6, k.soft);
      text3(c, "BUFFER", 58, 6, k.soft);
      text3(c, "PANEL", 121, 6, k.soft);
      FS.chunks.forEach((ch) => px(c, R(ch.x), ch.y, 5, 3, k.soft));
      dashFrame(c, 54, 14, 53, 66, k.faint);
      dashFrame(c, SLOT.x, SLOT.y, 44, 8, k.bad);
      if (FS.open > 0) px(c, SLOT.x + 2, SLOT.y + 2, FS.open * 10, 4, k.faint);
      text3(c, "OPEN", SLOT.x, SLOT.y + 12, k.bad);
      arrowR(c, 108, 46, 9, k.ink);
      frame(c, 118, 14, 38, 66, k.ink);
      px(c, 121, 17, 32, 3, k.accent);
      for (let i = 0; i < FS.rows; i++) px(c, PANEL.x, PANEL.y + i * 9, rowW[i], 6, i === 2 ? k.fill : k.faint);
      FS.flying.forEach((b) => {
        const e = 1 - (1 - b.t) ** 3;
        const x = R(SLOT.x + (PANEL.x - SLOT.x) * e);
        const y = R(SLOT.y + 1 + (PANEL.y + b.row * 9 - SLOT.y - 1) * e);
        px(c, x, y, R(42 + (rowW[b.row] - 42) * e), 6, k.accent);
      });
      c.restore();
    };
  },
};

/* ---------- 03 Making sites fast and findable ---------- */

const speed: Scene = {
  label: "Two page loads. Before, the hero video loads first and everything waits behind it. After, images and fonts load first and the video and tag manager are deferred, so the page shows early. The targets were 75 or more on desktop and 65 or more on mobile PageSpeed.",
  still: 5,
  make: () => (c, k, t) => {
    px(c, 0, 0, FW, FH, k.bg);
    const T = t % 6.5;
    const play = ease(seg(T, 0.3, 4.3)) * 144;
    const X0 = 44;
    const rows = ["VIDEO", "IMAGES", "GTM", "FONTS", "MOTION"];
    const panel = (y0: number, title: string, bars: [number, number][], blocker: number, shows: number) => {
      text3(c, title, 4, y0, k.ink);
      rows.forEach((r, i) => {
        const y = y0 + 9 + i * 7;
        text3(c, r, 4, y, k.soft);
        px(c, X0, y + 2, 144, 1, k.fill);
        const [a, b] = bars[i];
        const vis = clamp(play - a, 0, b - a);
        if (vis > 0) px(c, X0 + a, y, R(vis), 5, i === blocker ? k.bad : i === 0 ? k.faint : k.accent);
      });
      if (play >= shows) {
        px(c, X0 + shows, y0 + 7, 1, 37, k.good);
        text3(c, "PAGE SHOWS", Math.min(X0 + shows + 3, FW - 41), y0, k.good);
      }
      if (play < 144) dashV(c, X0 + R(play), y0 + 7, 37, k.soft);
    };
    panel(2, "BEFORE", [[0, 88], [88, 118], [90, 112], [88, 104], [92, 138]], 0, 90);
    panel(52, "AFTER", [[34, 70], [0, 16], [64, 76], [0, 8], [22, 40]], -1, 18);
    textC(c, "TARGET: 75+ DESKTOP, 65+ MOBILE", 96, 101, k.soft);
  },
};

/* ---------- 04 Rosehill: how an edit reaches the site ---------- */

const workflow: Scene = {
  label: "An edit goes from the owner to a Notion board, I make the change and deploy it. A CMS for the owner was never built.",
  still: 6.5,
  make: () => (c, k, t) => {
    px(c, 0, 0, FW, FH, k.bg);
    const T = t % 7.2;
    const xs = [4, 52, 100, 148];
    const names = ["OWNER", "NOTION", "ME", "DEPLOY"];
    xs.forEach((x, i) => {
      const mine = names[i] === "ME";
      frame(c, x, 18, 40, 18, mine ? k.accent : k.ink);
      textC(c, names[i], x + 20, 25, mine ? k.accent : k.ink);
      if (i < 3) arrowR(c, x + 41, 27, 6, k.faint);
    });
    // the edit, as a sticky note
    const legs: [number, number, number, number][] = [[0.4, 1.2, 0, 1], [2.0, 2.8, 1, 2], [4.2, 5.0, 2, 3]];
    let cx = xs[0] + 20;
    legs.forEach(([a, b, from, to]) => {
      if (T >= a) cx = lerp(xs[from], xs[to], ease(seg(T, a, b))) + 20;
    });
    px(c, R(cx) - 5, 7, 10, 8, k.ink);
    px(c, R(cx) - 4, 8, 8, 6, k.hi);
    px(c, R(cx) - 3, 10, 6, 1, k.warm);

    // typing it in
    if (T > 2.8) for (let i = 0; i < 3; i++) px(c, 104, 41 + i * 4, R(clamp((T - 2.8) * 22 - i * 9, 0, 16)), 1, k.soft);
    // deploying
    frame(c, 150, 41, 36, 6, k.faint);
    px(c, 151, 42, R(34 * seg(T, 5.0, 6.2)), 4, k.accent);
    if (T > 6.2) {
      sprite(c, CHECK, 158, 51, k.good);
      text3(c, "LIVE", 165, 51, k.good);
    }

    // the step that was left out on purpose
    dashFrame(c, 34, 64, 124, 18, k.faint);
    line(c, 40, 68, 48, 76, k.bad);
    line(c, 48, 68, 40, 76, k.bad);
    text3(c, "A CMS FOR THE OWNER", 56, 70, k.soft);
    textC(c, "NEVER BUILT", 96, 89, k.bad);
  },
};

/* ---------- 05 Rising Sun: what a parent came to do ---------- */

const enroll: Scene = {
  label: "From a program page a parent reaches the gallery, the application, or a tour. The gallery stays on the site. The application hands off to Transparent Classroom and the tour is booked by email on a Wednesday morning, so both leave the site.",
  still: 6.8,
  make: () => (c, k, t) => {
    px(c, 0, 0, FW, FH, k.bg);
    const T = t % 7.5;
    const b = Math.floor(T / 2.5);
    const u = (T % 2.5) / 2.5;
    const cols = [32, 96, 160];
    const arrived = u > 0.62;

    frame(c, 64, 3, 64, 15, k.ink);
    textC(c, "PROGRAM PAGE", 96, 8, k.ink);
    px(c, 96, 18, 1, 7, k.faint);
    px(c, 32, 25, 129, 1, k.faint);
    cols.forEach((x) => px(c, x, 25, 1, 7, k.faint));

    const names = ["GALLERY", "APPLY", "BOOK A TOUR"];
    cols.forEach((x, i) => {
      const lit = b === i && arrived;
      frame(c, x - 28, 32, 56, 14, lit && i === 0 ? k.good : k.ink);
      textC(c, names[i], x, 37, k.ink);
    });
    textC(c, "STAYS HERE", 32, 50, b === 0 && arrived ? k.good : k.soft);

    dashH(c, 4, 58, 184, k.faint);
    text3(c, "OFF THE SITE", 4, 62, k.soft);
    px(c, 96, 46, 1, 22, k.faint);
    px(c, 160, 46, 1, 22, k.faint);
    const off: [string, string][] = [["TRANSPARENT", "CLASSROOM"], ["EMAIL", "WED MORNING"]];
    off.forEach(([l1, l2], i) => {
      const x = cols[i + 1];
      const lit = b === i + 1 && arrived;
      if (lit) px(c, x - 27, 69, 54, 20, k.fill);
      frame(c, x - 28, 68, 56, 22, k.accent);
      textC(c, l1, x, 72, k.accent);
      textC(c, l2, x, 80, k.accent);
    });

    // the parent, following one of the three paths
    const x = cols[b];
    const path = b === 0 ? [[96, 18], [96, 25], [x, 25], [x, 32]] : [[96, 18], [96, 25], [x, 25], [x, 32], [x, 46], [x, 68]];
    const [dx, dy] = walk(path, ease(seg(u, 0.05, 0.6)));
    if (u < 0.92) dot(c, dx - 1, dy - 1, k);
  },
};

/* ---------- 06 Rebelsnow: storefront chain ---------- */

const commerce: Scene = {
  label: "Catalog, product, cart, checkout and payment, reading from REST APIs, with checkout under the heaviest test coverage in Jest and React Testing Library.",
  still: 5.6,
  make: () => (c, k, t) => {
    px(c, 0, 0, FW, FH, k.bg);
    const T = t % 8;
    const names = ["CATALOG", "PRODUCT", "CART", "CHECKOUT", "PAYMENT"];
    const xs = names.map((_, i) => 1 + i * 39);
    // [arrive, leave] at each box; checkout holds longest, while the tests run
    const stays = [[0, 0.7], [1.2, 1.9], [2.4, 3.1], [3.6, 5.8], [6.3, 8]];
    let pos = 0;
    stays.forEach(([a], i) => {
      if (T >= a) pos = i;
      if (i > 0 && T > stays[i - 1][1] && T < a) pos = i - 1 + ease(seg(T, stays[i - 1][1], a));
    });
    const at = Math.round(pos) === pos ? pos : -1;

    names.forEach((n, i) => {
      const x = xs[i];
      const col = i === 3 ? k.accent : at === 4 && i === 4 ? k.good : k.ink;
      frame(c, x, 38, 34, 16, col);
      textC(c, n, x + 17, 44, col);
      if (i < 4) px(c, x + 34, 46, 5, 1, k.faint);
      dashV(c, x + 17, 54, 30, at === i ? k.accent : k.faint, at === i ? Math.floor(t * 14) : 0);
    });
    const cx = lerp(xs[0], xs[4], pos / 4) + 17;
    px(c, R(cx) - 4, 29, 8, 6, k.ink);
    px(c, R(cx) - 3, 30, 6, 3, k.hi);
    px(c, R(cx) - 3, 34, 1, 1, k.ink);
    px(c, R(cx) + 2, 34, 1, 1, k.ink);

    const ck = xs[3] + 17;
    textC(c, "JEST + RTL", ck, 6, k.accent);
    px(c, ck, 12, 1, 15, k.accent);
    for (let i = 0; i < 3; i++) {
      const y = 13 + i * 5;
      if (T > 3.9 + i * 0.5 && T < 8) sprite(c, CHECK, ck + 4, y, k.good);
      else px(c, ck + 4, y + 1, 4, 1, k.faint);
    }

    px(c, 1, 84, 190, 14, k.fill);
    text3(c, "REST API: PRODUCTS, AUTH, ORDERS", 6, 89, k.soft);
  },
};

/* ---------- 07 FakeWordle: where the state lives ---------- */

const socket: Scene = {
  label: "Every letter in a match goes between the two players through the socket server. Only the final result is written to Firestore, once.",
  still: 6.6,
  make: () => (c, k, t) => {
    px(c, 0, 0, FW, FH, k.bg);
    const T = t % 7.5;
    const A: [number, number] = [50, 20];
    const B: [number, number] = [50, 78];
    const S: [number, number] = [70, 49];

    line(c, A[0], A[1], S[0], S[1] - 4, k.faint);
    line(c, B[0], B[1], S[0], S[1] + 4, k.faint);
    frame(c, 4, 12, 46, 16, k.ink);
    textC(c, "PLAYER A", 27, 18, k.ink);
    frame(c, 4, 70, 46, 16, k.ink);
    textC(c, "PLAYER B", 27, 76, k.ink);
    frame(c, 70, 38, 52, 22, k.accent);
    textC(c, "SOCKET", 96, 42, k.ink);
    textC(c, "SERVER", 96, 50, k.ink);
    textC(c, "LIVE STATE", 96, 64, k.accent);

    const wrote = T > 6.0;
    dashH(c, 122, 49, 24, wrote ? k.good : k.faint);
    frame(c, 146, 38, 44, 22, wrote ? k.good : k.ink);
    textC(c, "FIRESTORE", 168, 47, k.ink);
    textC(c, wrote ? "WRITES: 1" : "WRITES: 0", 168, 64, wrote ? k.good : k.soft);

    // letters, back and forth while the match runs
    for (let n = 0; n < 14; n++) {
      const t0 = n * 0.36;
      if (T < t0 || T > t0 + 0.7) continue;
      const u = (T - t0) / 0.7;
      const [from, to] = n % 2 ? [A, B] : [B, A];
      const [x, y] = walk([from, S, to], u);
      px(c, R(x) - 1, R(y) - 1, 3, 3, k.hi);
    }
    // the result, once, at the end
    if (T > 5.2 && T < 6.1) {
      const x = lerp(122, 144, ease(seg(T, 5.2, 6.0)));
      dot(c, x, 48, k, 4);
    }
  },
};

/* ---------- 08 Schedule to calendar: cell to event ---------- */

const timetable: Scene = {
  label: "The scan reaches a filled timetable cell. Its column and row become the day and time, and it is written out as a calendar event: AIGC 5500, Wednesday 14:00 to 16:00, room D221.",
  still: 6.5,
  make: () => (c, k, t) => {
    px(c, 0, 0, FW, FH, k.bg);
    const T = t % 7.5;
    c.save();
    c.translate(0, 12);
    const days = ["MON", "TUE", "WED", "THU", "FRI"];
    const filled = new Set(["0,0", "1,1", "3,0", "4,2", "0,3", "2,2", "3,3"]);
    const hitIdx = 2 * 5 + 2;
    const scan = Math.floor(seg(T, 0, 1.5) * (hitIdx + 1));
    const found = T > 1.5;

    days.forEach((d, i) => textC(c, d, 4 + i * 14 + 6, 0, found && i === 2 ? k.accent : k.soft));
    for (let r = 0; r < 4; r++) {
      for (let col = 0; col < 5; col++) {
        const x = 4 + col * 14;
        const y = 8 + r * 13;
        const idx = r * 5 + col;
        const hit = idx === hitIdx;
        if (hit && found) px(c, x, y, 13, 12, k.accent);
        else if (filled.has(`${col},${r}`)) px(c, x + 1, y + 1, 11, 10, k.fill);
        frame(c, x, y, 13, 12, !found && idx === scan ? k.hi : k.faint);
      }
    }
    if (found) px(c, 1, 8 + 2 * 13 + 4, 2, 4, k.accent);
    textC(c, "SCREENSHOT", 38, 64, k.soft);

    const grow = R(ease(seg(T, 1.6, 2.2)) * 24);
    if (grow > 3) arrowR(c, 80, 34, grow, k.ink);
    if (T > 1.6) textC(c, "POSITION", 93, 24, k.soft);

    frame(c, 112, 6, 76, 48, k.ink);
    px(c, 112, 6, 3, 48, k.accent);
    const type = (s: string, a: number, b: number) => s.slice(0, Math.floor(seg(T, a, b) * s.length));
    text3(c, type("AIGC 5500", 2.2, 2.9), 119, 14, k.ink);
    text3(c, type("WED 14:00-16:00", 2.9, 3.9), 119, 26, k.soft);
    text3(c, type("ROOM D221", 3.9, 4.5), 119, 36, k.soft);
    textC(c, "ICS EVENT", 150, 64, k.soft);
    c.restore();
  },
};

/* ---------- 09 Cineplex ticket watcher ---------- */

const cineplex: Scene = {
  label: "The Raspberry Pi checks Cineplex again and again. Not yet, not yet, then on sale, and it sends a push notification to the phone.",
  still: 8.2,
  make: () => (c, k, t) => {
    px(c, 0, 0, FW, FH, k.bg);
    const T = t % 9.5;
    const polls = [0, 1.4, 2.8, 4.2, 5.6];
    const onSale = T > 6.6;

    // the Pi
    frame(c, 4, 30, 56, 24, k.ink);
    px(c, 5, 31, 54, 22, k.fill);
    px(c, 24, 37, 12, 10, k.ink);
    for (let i = 0; i < 5; i++) px(c, 10 + i * 9, 50, 4, 2, k.faint);
    const polling = polls.some((p) => T >= p && T < p + 0.5);
    px(c, 8, 34, 2, 2, polling ? k.good : k.faint);
    px(c, 12, 34, 2, 2, k.bad);
    textC(c, "RASPBERRY PI 4", 32, 58, k.soft);

    frame(c, 78, 30, 46, 24, k.ink);
    textC(c, "CINEPLEX", 101, 40, k.ink);

    let status = "WAITING";
    let statusCol = k.soft;
    polls.forEach((p, i) => {
      const last = i === polls.length - 1;
      if (T >= p && T < p + 0.5) px(c, R(lerp(60, 74, (T - p) / 0.5)), 37, 3, 3, k.hi);
      if (T >= p + 0.5 && T < p + 1.0) px(c, R(lerp(74, 60, (T - p - 0.5) / 0.5)), 45, 3, 3, last ? k.good : k.faint);
      if (T >= p + 1.0) {
        status = last ? "ON SALE" : "NOT YET";
        statusCol = last ? k.good : k.soft;
      }
      if (T >= p && T < p + 1.0) status = "CHECKING";
    });
    text3(c, status, 4, 70, statusCol);
    for (let i = 0; i < polls.length; i++) {
      if (T >= polls[i] + 1.0) px(c, 4 + i * 6, 78, 4, 2, i === polls.length - 1 ? k.good : k.faint);
    }

    // the phone
    frame(c, 144, 12, 44, 70, k.ink);
    px(c, 160, 14, 12, 2, k.ink);
    if (T > 6.6 && T < 7.4) {
      const [x, y] = walk([[32, 30], [32, 8], [166, 8], [166, 14]], seg(T, 6.6, 7.4));
      dot(c, x - 1, y - 1, k);
    }
    if (T > 7.4) {
      px(c, 147, 22, 38, 26, k.fill);
      frame(c, 147, 22, 38, 26, k.accent);
      const shake = !onSale ? 0 : Math.floor(t * 10) % 2 && T < 8.2 ? 1 : 0;
      sprite(c, BELL, 163 + shake, 25, k.hi);
      textC(c, "TICKETS", 166, 32, k.ink);
      textC(c, "ON SALE", 166, 40, k.good);
    }
    textC(c, "PUSH", 166, 86, k.soft);
  },
};

/* ---------- 10 Countdown widgets ---------- */

const widgets: Scene = {
  label: "The iOS app writes a date to storage it shares with the widgets through a native Swift module. The widget reads it and the countdown on the Home Screen ticks down.",
  still: 1.2,
  make: () => (c, k, t) => {
    px(c, 0, 0, FW, FH, k.bg);
    const T = t % 6.4;

    // Home Screen
    frame(c, 6, 3, 54, 102, k.ink);
    px(c, 26, 5, 14, 2, k.ink);
    px(c, 11, 12, 44, 30, k.fill);
    frame(c, 11, 12, 44, 30, k.accent);
    const n = 12 - Math.floor((T + 0.6) / 1.6);
    textC(c, String(n), 33, 16, k.ink, 2);
    textC(c, "DAYS", 33, 32, k.soft);
    for (let r = 0; r < 3; r++) {
      for (let i = 0; i < 4; i++) {
        px(c, 12 + i * 11, 48 + r * 12, 8, 8, (r + i) % 3 === 0 ? k.accent : k.faint);
      }
    }
    px(c, 10, 88, 46, 12, k.fill);
    for (let i = 0; i < 4; i++) px(c, 12 + i * 11, 90, 8, 8, k.soft);

    // how the number gets there
    frame(c, 104, 6, 64, 14, k.ink);
    textC(c, "EXPO APP", 136, 11, k.ink);
    arrowD(c, 136, 20, 22, k.faint);
    frame(c, 92, 42, 88, 16, k.accent);
    textC(c, "SHARED STORAGE", 136, 48, k.accent);
    text3(c, "SWIFT MODULE", 141, 63, k.soft);
    arrowD(c, 136, 58, 24, k.faint);
    frame(c, 104, 82, 64, 14, k.ink);
    textC(c, "WIDGETKIT", 136, 87, k.ink);
    dashH(c, 62, 89, 42, k.faint, Math.floor(t * 10));
    dashV(c, 62, 27, 62, k.faint, Math.floor(t * 10));

    if (T < 0.6) px(c, 135, R(lerp(21, 40, T / 0.6)), 3, 3, k.hi);
    const u = (T % 1.6) / 1.6;
    if (u < 0.3) px(c, 135, R(lerp(59, 80, u / 0.3)), 3, 3, k.hi);
    else if (u < 0.62) {
      const [x, y] = walk([[103, 89], [62, 89], [62, 27], [56, 27]], (u - 0.3) / 0.32);
      px(c, R(x) - 1, R(y) - 1, 3, 3, k.hi);
    }
  },
};

/* ---------- 11 Health risk classifier: same inputs, two models ---------- */

const models: Scene = {
  label: "The same inputs go into a logistic regression and a multilayer perceptron, so the two can be compared.",
  still: 2.2,
  make: () => (c, k, t) => {
    px(c, 0, 0, FW, FH, k.bg);
    const T = t % 3.4;
    const ys = [22, 40, 58, 76];
    const hid = [31, 49, 67];
    text3(c, "LOGISTIC REGRESSION", 4, 4, k.ink);
    text3(c, "MULTILAYER PERCEPTRON", 104, 4, k.accent);
    dashV(c, 98, 14, 78, k.faint);

    ys.forEach((y) => line(c, 16, y, 76, 49, k.faint));
    ys.forEach((y) => hid.forEach((h) => line(c, 112, y, 146, h, k.faint)));
    hid.forEach((h) => line(c, 152, h, 180, 49, k.faint));

    const lit = T < 3.0;
    const inOn = lit && T > 0.1;
    ys.forEach((y) => {
      sprite(c, RING, 10, y - 2, k.ink);
      sprite(c, RING, 106, y - 2, k.ink);
      if (inOn) {
        px(c, 11, y - 1, 3, 3, k.hi);
        px(c, 107, y - 1, 3, 3, k.hi);
      }
    });
    hid.forEach((h) => {
      sprite(c, RING, 146, h - 2, k.accent);
      if (lit && T > 1.2) px(c, 147, h - 1, 3, 3, k.accent);
    });
    sprite(c, RING, 76, 47, k.ink);
    sprite(c, RING, 180, 47, k.accent);
    if (lit && T > 1.8) {
      px(c, 77, 48, 3, 3, k.ink);
      px(c, 181, 48, 3, 3, k.accent);
    }

    // signals moving through each model
    const pl = seg(T, 0.6, 1.8);
    if (pl > 0 && pl < 1) ys.forEach((y) => px(c, R(lerp(16, 76, pl)), R(lerp(y, 49, pl)), 2, 2, k.hi));
    const p1 = seg(T, 0.6, 1.2);
    if (p1 > 0 && p1 < 1) ys.forEach((y, i) => px(c, R(lerp(112, 146, p1)), R(lerp(y, hid[i % 3], p1)), 2, 2, k.hi));
    const p2 = seg(T, 1.2, 1.8);
    if (p2 > 0 && p2 < 1) hid.forEach((h) => px(c, R(lerp(152, 180, p2)), R(lerp(h, 49, p2)), 2, 2, k.hi));

    textC(c, "SAME INPUTS, TWO MODELS", 96, 98, k.soft);
  },
};

/* ---------- 12 HuntigoX: verification output, illustrative ---------- */

const verify: Scene = {
  label: "Illustrative verification scan: business registration matched, document authenticity matched, posting pattern clear, LMIA reference valid, legitimacy score 94 of 100.",
  still: 6.5,
  make: () => (c, k, t) => {
    px(c, 0, 0, FW, FH, k.bg);
    const T = t % 8.5;
    const checks: [string, string][] = [
      ["BUSINESS REGISTRATION", "MATCHED"],
      ["DOCUMENT AUTHENTICITY", "MATCHED"],
      ["POSTING PATTERN", "CLEAR"],
      ["LMIA REFERENCE", "VALID"],
    ];
    text3(c, "VERIFICATION SCAN", 4, 4, k.soft);
    checks.forEach(([label, value], i) => {
      const y = 20 + i * 15;
      const start = 0.4 + i * 0.9;
      text3(c, label, 4, y, k.ink);
      for (let x = 4; x < 188; x += 2) px(c, x, y + 8, 1, 1, k.faint);
      if (T < start) text3(c, "...", 177, y, k.faint);
      else if (T < start + 0.6) {
        const spin = Math.floor(t * 12) % 4;
        const sp = [[0, 0], [2, 0], [2, 2], [0, 2]][spin];
        px(c, 182 + sp[0], y + 1 + sp[1], 2, 2, k.hi);
      } else {
        textRight(c, value, 188, y, k.good);
        sprite(c, CHECK, 188 - textW(value) - 8, y, k.good);
      }
    });
    const score = R(94 * ease(seg(T, 4.1, 5.4)));
    text3(c, "LEGITIMACY SCORE", 4, 84, k.soft);
    textRight(c, `${score} / 100`, 188, 84, k.ink);
    px(c, 4, 93, 184, 5, k.fill);
    px(c, 4, 93, R((184 * score) / 100), 5, k.good);
    if (T > 5.4) {
      frame(c, 150, 1, 38, 11, k.good);
      textC(c, "VERIFIED", 169, 4, k.good);
    }
  },
};

export const SCENES = { fde, stream, speed, workflow, enroll, commerce, socket, timetable, cineplex, widgets, models, verify };
export type SceneKey = keyof typeof SCENES;
