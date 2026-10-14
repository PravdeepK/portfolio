"use client";

import { useEffect, useState } from "react";
import { isNight, onThemeChange } from "./art";

/** "Lights off" switches to the night theme, "Lights on" back to day. The choice is remembered. */
export function ThemeToggle() {
  const [night, setNight] = useState<boolean | null>(null);

  useEffect(() => {
    setNight(isNight());
    return onThemeChange(() => setNight(isNight()));
  }, []);

  return (
    <button
      className="btn btn--small"
      type="button"
      aria-label={night ? "Switch to the daytime light theme" : "Switch to the night dark theme"}
      onClick={() => {
        const next = isNight() ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", next);
        try {
          localStorage.setItem("theme", next);
        } catch {
          // Storage blocked: the switch still works for this visit.
        }
      }}
    >
      {night ? "Lights on" : "Lights off"}
    </button>
  );
}
