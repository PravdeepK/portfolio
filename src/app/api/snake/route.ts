import { NextResponse, type NextRequest } from "next/server";
import { Redis } from "@upstash/redis";
import {
  cleanInitials,
  isAllowedInitials,
  isPlausibleScore,
  type BoardRow,
} from "@/lib/snake";

/**
 * Snake leaderboard. GET reads the top 10. POST either starts a game (the
 * server notes the time, so a score can be checked against how long the game
 * really ran) or submits a finished one. Each player keeps only their best.
 *
 * Players are anonymous: the browser makes a random id and keeps it in
 * localStorage. That id never leaves the server in a response, so nobody can
 * read someone else's id off the board and post over their score.
 */

export const dynamic = "force-dynamic";

const BOARD = "snake:board";
const NAMES = "snake:names";
const GAME_TTL_S = 60 * 60;
const RATE_WINDOW_S = 10 * 60;
const RATE_MAX = 20;
const BOARD_CAP = 500;

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

// Vercel's Upstash integration sets the KV_* names; a direct Upstash setup uses UPSTASH_*.
function redis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
  return url && token ? new Redis({ url, token }) : null;
}

const fail = (error: string, status: number) => NextResponse.json({ error }, { status });

export async function GET(request: NextRequest) {
  const r = redis();
  if (!r) return fail("not_configured", 503);

  const player = request.headers.get("x-snake-player") ?? "";
  const flat = await r.zrange<(string | number)[]>(BOARD, 0, 9, { rev: true, withScores: true });

  const entries: { id: string; score: number }[] = [];
  for (let i = 0; i < flat.length; i += 2) {
    entries.push({ id: String(flat[i]), score: Number(flat[i + 1]) });
  }
  const names = entries.length
    ? ((await r.hmget<Record<string, string>>(NAMES, ...entries.map((e) => e.id))) ?? {})
    : {};

  const rows: BoardRow[] = entries.map((e, i) => {
    const initials = cleanInitials(names[e.id]);
    return {
      rank: i + 1,
      // Re-checked on the way out too, in case anything got in some other way.
      initials: isAllowedInitials(initials) ? initials : "???",
      score: e.score,
      you: UUID.test(player) && e.id === player,
    };
  });

  return NextResponse.json({ rows }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: NextRequest) {
  const r = redis();
  if (!r) return fail("not_configured", 503);

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return fail("bad_request", 400);
  }

  const player = String(body.player ?? "");
  if (!UUID.test(player)) return fail("bad_request", 400);

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const rateKey = `snake:rate:${ip}`;
  const hits = await r.incr(rateKey);
  if (hits === 1) await r.expire(rateKey, RATE_WINDOW_S);
  if (hits > RATE_MAX) return fail("rate_limited", 429);

  if (body.action === "start") {
    const game = crypto.randomUUID();
    await r.set(`snake:game:${game}`, Date.now(), { ex: GAME_TTL_S });
    return NextResponse.json({ game });
  }

  if (body.action !== "submit") return fail("bad_request", 400);

  const game = String(body.game ?? "");
  const initials = cleanInitials(body.initials);
  const score = Number(body.score);
  if (!UUID.test(game)) return fail("bad_request", 400);
  if (!isAllowedInitials(initials)) return fail("initials_not_allowed", 400);

  // One submission per game: reading the start time also deletes it.
  const started = await r.getdel<number>(`snake:game:${game}`);
  if (started === null) return fail("game_expired", 400);
  if (!isPlausibleScore(score, Date.now() - Number(started))) return fail("implausible", 400);

  const previous = await r.zscore(BOARD, player);
  if (previous !== null && Number(previous) >= score) {
    return NextResponse.json({ posted: false, best: Number(previous) });
  }

  await r.zadd(BOARD, { score, member: player });
  await r.hset(NAMES, { [player]: initials });
  // Keep the set bounded; only the top of it is ever shown.
  await r.zremrangebyrank(BOARD, 0, -(BOARD_CAP + 1));

  return NextResponse.json({ posted: true, best: score });
}
