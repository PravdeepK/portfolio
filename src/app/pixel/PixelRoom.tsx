"use client";

import { useEffect, useRef } from "react";
import { mountRoom } from "./room-engine";

/** The hero: the walkable room, its status bar, the snake leaderboard and the touch pad. */
export function PixelRoom() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!root.current) return;
    return mountRoom(root.current);
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
            <span className="status__label">I work in</span> <span data-room="skills" />
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
          <h2 id="board-title">
            Snake leaderboard <span>Top 10, best score per player</span>
          </h2>
          <ol data-room="board-list" />
          <p className="board__empty" data-room="board-empty">
            Loading scores&hellip;
          </p>
        </section>
      </div>

      <div className="pad" data-room="pad" role="group" aria-label="Touch controls">
        <div className="pad__dpad">
          <button type="button" data-dir="f" aria-label="Walk toward the wall, or steer up">
            &#9650;
          </button>
          <button type="button" data-dir="l" aria-label="Walk left, or steer left">
            &#9664;
          </button>
          <button type="button" data-dir="r" aria-label="Walk right, or steer right">
            &#9654;
          </button>
          <button type="button" data-dir="b" aria-label="Walk away from the wall, or steer down">
            &#9660;
          </button>
        </div>
        <button type="button" className="pad__use" data-room="use" aria-label="Use">
          Use
        </button>
      </div>

      <p className="controls controls--keys" id="room-keys">
        <kbd>W</kbd>
        <kbd>A</kbd>
        <kbd>S</kbd>
        <kbd>D</kbd> to walk, or the arrow keys once you&apos;ve clicked the room. Press <kbd>E</kbd> next to
        something to use it, or click it.
      </p>
      <p className="controls controls--touch">
        Tap the floor to walk there, or tap something to walk over and use it. The pad works too.
      </p>
      <p className="sr-only" data-room="announce" aria-live="polite" />
      <div className="objects" data-room="objects" role="group" aria-label="Go to something in the room" />
    </section>
  );
}
