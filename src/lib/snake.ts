/**
 * Snake rules shared by the game on the monitor and the leaderboard API, so the
 * browser and the server check scores and initials the same way.
 */

export const GRID_W = 28;
export const GRID_H = 16;
/** Every cell filled, minus the starting body. */
export const MAX_SCORE = GRID_W * GRID_H - 4;
/** The fastest the snake ever moves, in seconds per step. */
export const MIN_STEP = 0.065;

// Arcade initials are three letters, so the filter is a list of three-letter
// words rather than a pattern over free text.
const BLOCKED = new Set(
  (
    "ASS FUK FUC FCK FKU FUQ FAP CUM COK COC KOK DIK DIC DIX TIT FAG FGT NIG " +
    "NGR NGA NIK KKK SEX XXX JIZ WTF SHT SUK SUC PIS VAG CNT KNT TWT HOE HOR " +
    "SLT WHR RPE NAZ HTL KYS"
  ).split(" ")
);

export function cleanInitials(value: unknown): string {
  return String(value ?? "")
    .toUpperCase()
    .replace(/[^A-Z]/g, "")
    .slice(0, 3);
}

export function isAllowedInitials(value: string): boolean {
  return /^[A-Z]{3}$/.test(value) && !BLOCKED.has(value);
}

/** Each point needs at least one step, so a score can't outrun the clock. */
export function isPlausibleScore(score: number, elapsedMs: number): boolean {
  if (!Number.isInteger(score) || score < 1 || score > MAX_SCORE) return false;
  return score <= elapsedMs / 1000 / (MIN_STEP * 0.9) + 1;
}

export type BoardRow = { rank: number; initials: string; score: number; you: boolean };
