"use client";

import { useEffect, useRef } from "react";
import { drawSprite } from "./art";

/** The character from the room, standing still and blinking, for the stats panel. */
export function Avatar() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current?.getContext("2d");
    if (!c) return;
    const draw = (blink: boolean) => {
      c.clearRect(0, 0, 16, 28);
      drawSprite(c, "N", 0, 0, false, 0, blink);
    };
    draw(false);
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let open: ReturnType<typeof setTimeout>;
    const blinker = setInterval(() => {
      draw(true);
      open = setTimeout(() => draw(false), 130);
    }, 3400);
    return () => {
      clearInterval(blinker);
      clearTimeout(open);
    };
  }, []);

  return <canvas className="avatar" ref={ref} width={16} height={28} aria-hidden="true" />;
}
