/** Rotation from the up arrow, in degrees, in the same order as W A S D. */
const ARROWS = [
  ["Up", 0],
  ["Left", -90],
  ["Down", 180],
  ["Right", 90],
] as const;

/** Arrow keys drawn on a 5x5 pixel grid, because the Silkscreen font the other keys use has no arrow glyphs. */
export function ArrowKeys() {
  return (
    <>
      {ARROWS.map(([name, turn]) => (
        <kbd key={name}>
          <svg
            className="kbd__arrow"
            viewBox="0 0 5 5"
            aria-hidden="true"
            style={turn ? { transform: `rotate(${turn}deg)` } : undefined}
          >
            <path d="M2 0h1v1H2zM1 1h3v1H1zM0 2h1v1H0zM2 2h1v3H2zM4 2h1v1H4z" fill="currentColor" />
          </svg>
          <span className="sr-only">{name} arrow</span>
        </kbd>
      ))}
    </>
  );
}
