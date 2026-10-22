"use client";

import { useEffect, useRef } from "react";
import { mountRoom } from "./room-engine";
import { ArrowKeys } from "./ArrowKeys";

/** The hero: the walkable room, its status bar, the snake leaderboard and the touch pad. */
export function PixelRoom() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!root.current) return;
    // If the room ever fails to start, keep the rest of the page working.
    try {
      return mountRoom(root.current);
    } catch (error) {
      console.error("Pixel room failed to start", error);
    }
  }, []);

  return (
    <section className="stage" aria-label="Pixel room" ref={root}>
      <div className="scene-wrap">
        <div className="scene-box">
          <div className="lift" style={{ maxWidth: "100%" }}>
            <div className="scene notch" data-room="scene">
              <canvas
                data-room="canvas"
                width={256}
                height={144}
                tabIndex={0}
                role="application"
                aria-label="Pixel room with a door, a bookshelf, a diploma, a window, a Wordle poster, a desk with a monitor and a Raspberry Pi"
                aria-describedby="room-keys"
              />
              <div className="bubble" data-room="bubble" aria-hidden="true" hidden>
                <span data-room="bubble-text" />
                <span className="caret" />
              </div>
            </div>
          </div>
          <div className="dialog" data-room="dialog" tabIndex={-1} role="dialog" aria-labelledby="room-dlg-name" hidden>
            <span className="dialog__name" id="room-dlg-name" data-room="dlg-name" />
            <p className="dialog__text" data-room="dlg-text" />
            <p className="sr-only" data-room="dlg-full" aria-live="polite" />
            <div className="dialog__foot" data-room="dlg-foot" />
            <span className="dialog__more" aria-hidden="true">
              &#9660;
            </span>
          </div>
        </div>

        <div className="status">
          <p className="status__skills" data-room="skills-line" aria-hidden="true">
            <span className="status__label">I work with</span> <span data-room="skills" />
            <span className="caret" />
          </p>
          <p className="status__prompt" data-room="prompt" aria-hidden="true" />
          <div className="status__snake" data-room="snakebar" hidden>
            <span data-room="snake-score">Score 0</span>
            <button className="btn btn--small" type="button" data-room="snake-restart">
              Restart
            </button>
            <button className="btn btn--small" type="button" data-room="snake-quit">
              Quit snake
            </button>
          </div>
        </div>

        <section className="board notch" data-room="board" aria-labelledby="board-title" hidden>
          <p className="board__title" id="board-title">
            Snake leaderboard <span>Top 10, best score per player</span>
          </p>
          <ol data-room="board-list" />
          <p className="board__empty" data-room="board-empty">
            Loading scores&hellip;
          </p>
        </section>
      </div>

      <div className="pad" data-room="pad" role="group" aria-label="Touch controls">
        <div className="pad__dpad">
          <button type="button" data-dir="f">
            <span aria-hidden="true">&#9650;</span>
            <span className="sr-only">Walk toward the wall, or steer up</span>
          </button>
          <button type="button" data-dir="l">
            <span aria-hidden="true">&#9664;</span>
            <span className="sr-only">Walk left, or steer left</span>
          </button>
          <button type="button" data-dir="r">
            <span aria-hidden="true">&#9654;</span>
            <span className="sr-only">Walk right, or steer right</span>
          </button>
          <button type="button" data-dir="b">
            <span aria-hidden="true">&#9660;</span>
            <span className="sr-only">Walk away from the wall, or steer down</span>
          </button>
        </div>
        <button type="button" className="pad__use" data-room="use">
          Use
        </button>
      </div>

      <p className="controls controls--keys" id="room-keys">
        <kbd>W</kbd>
        <kbd>A</kbd>
        <kbd>S</kbd>
        <kbd>D</kbd> to walk, or <ArrowKeys /> once you&apos;ve clicked the room. Press <kbd>E</kbd> next to something to use it, or click it.
      </p>
      <p className="controls controls--touch">
        Tap the floor to walk there, or tap something to walk over and use it. The pad works too.
      </p>
      <p className="sr-only" data-room="announce" aria-live="polite" />
      <div className="objects" data-room="objects" role="group" aria-label="Go to something in the room" />
    </section>
  );
}
