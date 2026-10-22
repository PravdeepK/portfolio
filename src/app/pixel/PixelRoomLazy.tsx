"use client";

import dynamic from "next/dynamic";
import { ArrowKeys } from "./ArrowKeys";

/** The `button` labels from HOTSPOTS in room-engine.ts. Keep the two in step, or the row changes width on load. */
const OBJECT_LABELS = [
  "Door: contact",
  "Bookshelf: skills",
  "Diploma: history",
  "Window: Ontario",
  "Poster: FakeWordle",
  "Monitor: work",
  "Pi: ticket bot",
];

/**
 * Stands in for the room until its script arrives. It repeats every part of
 * PixelRoom that takes up space (the canvas, the status bar, the pad, the
 * control hints and the object buttons), so swapping the real room in doesn't
 * move anything below it.
 */
function RoomPlaceholder() {
  return (
    <section className="stage" aria-hidden="true">
      <div className="scene-wrap">
        <div className="scene-box">
          <div className="lift" style={{ maxWidth: "100%" }}>
            <div className="scene notch">
              <canvas width={256} height={144} />
            </div>
          </div>
        </div>
        <div className="status">
          <p className="status__skills">
            <span className="status__label">I work with</span> <span />
            <span className="caret" />
          </p>
          <p className="status__prompt" />
        </div>
      </div>
      <div className="pad">
        <div className="pad__dpad" />
      </div>
      <p className="controls controls--keys">
        <kbd>W</kbd>
        <kbd>A</kbd>
        <kbd>S</kbd>
        <kbd>D</kbd> to walk, or <ArrowKeys /> once you&apos;ve clicked the room. Press <kbd>E</kbd> next to something to use it, or click it.
      </p>
      <p className="controls controls--touch">
        Tap the floor to walk there, or tap something to walk over and use it. The pad works too.
      </p>
      <div className="objects">
        {OBJECT_LABELS.map((label) => (
          <span className="btn btn--small" key={label}>
            {label}
          </span>
        ))}
      </div>
    </section>
  );
}

/** The room engine is the heaviest script on the page, so it loads after the rest of the page is usable. */
export const PixelRoomLazy = dynamic(() => import("./PixelRoom").then((mod) => mod.PixelRoom), {
  ssr: false,
  loading: RoomPlaceholder,
});
