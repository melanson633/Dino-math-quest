import { publicAssetUrl } from './assets';

type ReviewedAudioAsset = { id: string; src: string; approved: boolean };
type ReviewedAudioManifest = { assets: ReviewedAudioAsset[] };

let audioCtx: AudioContext | null = null;
let isMuted = false;
let hasUserGesture = false;
let reviewedAssets = new Map<string, string>();
let manifestRequest: Promise<void> | null = null;
let narration: HTMLAudioElement | null = null;
let narrationRequestId = 0;
const activeAudio = new Set<HTMLAudioElement>();
// Pausing an element whose play() promise is still pending rejects with
// AbortError. That is an intentional stop, not a broken clip, so it must not
// reach the tone fallback — stopAllAudio() clears `narration`, so the
// exclusivity guards would no longer suppress the stray beep on the next screen.
const intentionallyStopped = new WeakSet<HTMLAudioElement>();

function getContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) audioCtx = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  if (audioCtx.state === 'suspended') void audioCtx.resume();
  return audioCtx;
}

/** Call from the tap that begins an adventure; never from page load. */
export function unlockAudioForGesture() {
  hasUserGesture = true;
  if (!isMuted) getContext();
  preloadReviewedAudioManifest();
}

export function setMuted(muted: boolean) {
  isMuted = muted;
  if (muted) stopAllAudio();
}

export function stopAllAudio() {
  narrationRequestId += 1;
  for (const audio of activeAudio) {
    intentionallyStopped.add(audio);
    audio.pause();
    audio.currentTime = 0;
  }
  activeAudio.clear();
  narration = null;
}

function playTone(freq: number, duration: number, volume = 0.06, offset = 0) {
  if (isMuted || !hasUserGesture || narration) return;
  const context = getContext();
  if (!context) return;
  const start = context.currentTime + offset;
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(freq, start);
  gain.gain.setValueAtTime(0.001, start);
  gain.gain.linearRampToValueAtTime(volume, start + 0.025);
  gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.02);
}

function playFallback(notes: number[], volume = 0.06) {
  notes.forEach((note, index) => playTone(note, index === notes.length - 1 ? 0.24 : 0.12, volume, index * 0.12));
}

function playReviewedAudioAsset(id: string, fallback: () => void, narrationChannel = false): boolean {
  if (isMuted || !hasUserGesture) return false;
  const src = reviewedAssets.get(id);
  if (!src) {
    preloadReviewedAudioManifest();
    return false;
  }

  // Spoken models are deliberately exclusive: no beep, rhythm or prior model
  // should compete with a word Charlotte is trying to hear and repeat.
  if (!narrationChannel && narration) return true;
  if (narrationChannel) stopAllAudio();

  const audio = new Audio(publicAssetUrl(src));
  audio.preload = 'auto';
  audio.volume = narrationChannel ? 0.8 : 0.58;
  activeAudio.add(audio);
  if (narrationChannel) narration = audio;

  let handledFailure = false;
  const finish = () => {
    activeAudio.delete(audio);
    if (narration === audio) narration = null;
  };
  const fail = () => {
    if (handledFailure) return;
    handledFailure = true;
    finish();
    // Real load, decode, and network errors still fall back to a local tone.
    if (intentionallyStopped.has(audio)) return;
    fallback();
  };
  audio.addEventListener('ended', finish, { once: true });
  audio.addEventListener('error', fail, { once: true });
  void audio.play().catch(fail);
  return true;
}

function preloadReviewedAudioManifest() {
  if (manifestRequest || reviewedAssets.size > 0 || typeof window === 'undefined') return;
  manifestRequest = fetch(publicAssetUrl('/audio/manifest.json'))
    .then((response) => response.ok ? response.json() as Promise<ReviewedAudioManifest> : null)
    .then((manifest) => {
      const assets = Array.isArray(manifest?.assets) ? manifest.assets : [];
      for (const asset of assets.slice(0, 48)) {
        if (
          asset?.approved === true &&
          typeof asset.id === 'string' && /^[a-z0-9][a-z0-9-]*$/.test(asset.id) &&
          typeof asset.src === 'string' && asset.src.startsWith('/audio/generated/') && asset.src.endsWith('.mp3') && !asset.src.includes('..')
        ) {
          reviewedAssets.set(asset.id, asset.src);
          const preload = new Audio(publicAssetUrl(asset.src));
          preload.preload = 'auto';
        }
      }
    })
    .catch(() => undefined)
    .finally(() => { manifestRequest = null; });
}

export function playTap() {
  // A restored PWA may open directly on a game screen. This tap is its fresh,
  // iPad-safe audio unlock rather than relying on an earlier Home tap.
  unlockAudioForGesture();
  const tone = () => playTone(780, 0.055, 0.035);
  if (!playReviewedAudioAsset('tap-soft', tone)) tone();
}

export function playCorrect() {
  const melody = () => playFallback([523.25, 659.25, 783.99]);
  if (!playReviewedAudioAsset('success-sparkle', melody)) melody();
}

/** A neutral lift, never a sad or "wrong" sound. */
export function playWrong() {
  const melody = () => playFallback([392, 493.88], 0.035);
  if (!playReviewedAudioAsset('try-again-leaf', melody)) melody();
}

export function playUnlockDino() {
  const melody = () => playFallback([440, 554.37, 659.25, 880]);
  if (!playReviewedAudioAsset('new-dino-friend', melody)) melody();
}

export function playUnlockBiome() {
  const melody = () => playFallback([523.25, 659.25, 783.99, 1046.5]);
  if (!playReviewedAudioAsset('biome-discovery', melody)) melody();
}

export function playRhythmCue() {
  const melody = () => playFallback([523.25, 523.25, 659.25], 0.055);
  if (!playReviewedAudioAsset('dino-three-beat', melody)) melody();
}

export function playWordRhythm(beatCount: number) {
  const count = Math.max(1, Math.min(4, beatCount));
  playFallback(Array.from({ length: count }, (_, index) => index === count - 1 ? 659.25 : 523.25), 0.045);
}

export function playPhonicsCue() {
  const melody = () => playFallback([392, 523.25], 0.04);
  if (!playReviewedAudioAsset('phonics-pop', melody)) melody();
}

export function playTinySong() {
  const melody = () => playFallback([392, 440, 523.25, 659.25], 0.05);
  if (!playReviewedAudioAsset('island-play-song', melody)) melody();
}

function playNarrationAsset(id: string, fallback: () => void) {
  const requestId = ++narrationRequestId;
  if (playReviewedAudioAsset(id, fallback, true)) return;

  // On a restored PWA session, the child's first Hear tap may race manifest
  // loading. Wait for that one local request so the first model is the actual
  // recorded word, not a tone. If loading fails, the local tone still answers.
  const pendingManifest = manifestRequest;
  if (!pendingManifest) {
    fallback();
    return;
  }
  void pendingManifest.then(() => {
    if (requestId !== narrationRequestId || isMuted || !hasUserGesture) return;
    if (!playReviewedAudioAsset(id, fallback, true)) fallback();
  });
}

/** An explicit "Hear it" tap only. Static clips make every spelling word work offline. */
export function playWord(wordId: string, beatCount = 1) {
  unlockAudioForGesture();
  playNarrationAsset(`word-${wordId.toLowerCase()}`, () => playWordRhythm(beatCount));
}

/** An explicit model button; no microphone or pronunciation judgement is involved. */
export function playSpeechModel(promptId: string, beatCount = 3) {
  unlockAudioForGesture();
  playNarrationAsset(`speech-${promptId}`, () => playWordRhythm(beatCount));
}
