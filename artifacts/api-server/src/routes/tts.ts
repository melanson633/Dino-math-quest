import { Router, type IRouter, type Request } from "express";
import { logger } from "../lib/logger";

const router: IRouter = Router();

const DEFAULT_VOICE_ID = process.env.ELEVENLABS_VOICE_ID ?? "21m00Tcm4TlvDq8ikWAM";
const ELEVENLABS_TTS_URL = "https://api.elevenlabs.io/v1/text-to-speech";

// eleven_flash_v2_5: lowest latency, optimised for real-time game interactions.
// Voice settings tuned for energetic, child-friendly delivery (panel-reviewed).
const TTS_MODEL = "eleven_flash_v2_5";
const VOICE_SETTINGS = {
  stability: 0.35,         // lower = more expressive / emotive range
  similarity_boost: 0.80,  // keeps voice character consistent
  style: 0.45,             // adds prosodic exaggeration suitable for kids
  use_speaker_boost: true, // enhances clarity over BGM
};

/* ── Simple in-memory IP rate limiter ─────────────────────────────────────
   Allows MAX_REQUESTS per IP within WINDOW_MS. No external dependency needed.
   Buckets are purged once per window to prevent unbounded memory growth.      */

const WINDOW_MS = 60_000;  // 1 minute window
const MAX_REQUESTS = 20;   // 20 TTS calls per IP per minute

interface RateBucket { count: number; windowStart: number }
const rateBuckets = new Map<string, RateBucket>();

let lastPurge = Date.now();
function purgeExpiredBuckets() {
  const now = Date.now();
  if (now - lastPurge < WINDOW_MS) return;
  lastPurge = now;
  for (const [ip, bucket] of rateBuckets) {
    if (now - bucket.windowStart >= WINDOW_MS) rateBuckets.delete(ip);
  }
}

function checkRateLimit(req: Request): boolean {
  purgeExpiredBuckets();
  const ip = (req.headers["x-forwarded-for"] as string | undefined)?.split(",")[0].trim()
    ?? req.socket.remoteAddress
    ?? "unknown";
  const now = Date.now();
  let bucket = rateBuckets.get(ip);
  if (!bucket || now - bucket.windowStart >= WINDOW_MS) {
    bucket = { count: 0, windowStart: now };
  }
  bucket.count += 1;
  rateBuckets.set(ip, bucket);
  return bucket.count > MAX_REQUESTS;
}

/* ── Route ────────────────────────────────────────────────────────────── */

router.post("/tts", async (req, res) => {
  if (checkRateLimit(req)) {
    res.status(429).json({ error: "Too many requests — please wait a moment" });
    return;
  }

  const { text, voiceId } = req.body as { text?: string; voiceId?: string };

  if (!text || typeof text !== "string" || text.trim().length === 0) {
    res.status(400).json({ error: "text is required" });
    return;
  }

  if (text.length > 500) {
    res.status(400).json({ error: "text must be 500 characters or fewer" });
    return;
  }

  const voice = voiceId ?? DEFAULT_VOICE_ID;

  try {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      res.status(503).json({ error: "TTS service not configured" });
      return;
    }

    const upstream = await fetch(`${ELEVENLABS_TTS_URL}/${voice}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text: text.trim(),
        model_id: TTS_MODEL,
        voice_settings: VOICE_SETTINGS,
      }),
    });

    if (!upstream.ok) {
      const errText = await upstream.text();
      logger.error({ status: upstream.status, body: errText }, "ElevenLabs TTS error");
      res.status(502).json({ error: "TTS upstream error" });
      return;
    }

    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Cache-Control", "public, max-age=3600");

    const body = upstream.body;
    if (!body) {
      res.status(502).json({ error: "Empty TTS response" });
      return;
    }

    const reader = body.getReader();
    const pump = async () => {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(Buffer.from(value));
      }
      res.end();
    };
    await pump();
  } catch (err) {
    logger.error({ err }, "TTS route error");
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

export default router;
