"use client";

import { useEffect, useRef } from "react";
import { onThemeChange } from "./art";
import { FH, FW, SCENES, type Colors, type SceneKey } from "./scenes";

/**
 * Runs one project scene on a canvas: colours from the page tokens (so it
 * follows the theme), whole-number scaling where the column allows it, frames
 * only while it's on screen, and a still frame when motion is turned off.
 */
export function PixelFigure({ scene }: { scene: SceneKey }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const def = SCENES[scene];

  useEffect(() => {
    const canvas = ref.current;
    const c = canvas?.getContext("2d");
    if (!canvas || !c) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const run = def.make(reduce);

    let k: Colors;
    const readColors = () => {
      const cs = getComputedStyle(document.documentElement);
      const g = (n: string) => cs.getPropertyValue(n).trim();
      k = {
        ink: g("--ink"), soft: g("--ink-soft"), faint: g("--line-soft"), accent: g("--accent"),
        bad: g("--bad"), good: g("--good"), bg: g("--panel"), fill: g("--panel-2"), hi: g("--hi"), warm: g("--warm"),
      };
    };

    const fit = () => {
      const avail = canvas.parentElement?.clientWidth ?? FW;
      const s = Math.floor(avail / FW);
      const w = s >= 2 ? s * FW : avail;
      canvas.style.width = w + "px";
      canvas.style.height = Math.round((w * FH) / FW) + "px";
    };
    const ro = new ResizeObserver(fit);
    if (canvas.parentElement) ro.observe(canvas.parentElement);
    fit();

    let t = reduce ? def.still : 0;
    readColors();
    run(c, k!, t, 0);
    const stopTheme = onThemeChange(() => {
      readColors();
      run(c, k, t, 0);
    });
    if (reduce) {
      return () => {
        ro.disconnect();
        stopTheme();
      };
    }

    let inView = false;
    const io = new IntersectionObserver(([e]) => (inView = e.isIntersecting));
    io.observe(canvas);
    let last = performance.now();
    let raf = requestAnimationFrame(function tick(now) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (inView) {
        t += dt;
        run(c, k, t, dt);
      }
      raf = requestAnimationFrame(tick);
    });
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      stopTheme();
    };
  }, [def]);

  return (
    <canvas className="pixel-figure" ref={ref} width={FW} height={FH} role="img" aria-label={def.label} />
  );
}
