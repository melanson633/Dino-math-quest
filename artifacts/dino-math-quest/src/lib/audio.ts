import { publicAssetUrl } from './assets';

let audioCtx: AudioContext | null = null;
let bgmOscillator: OscillatorNode | null = null;
let bgmGain: GainNode | null = null;
let isMuted = false;
let hasUserGesture = false;
let reviewedAudioManifest: ReviewedAudioManifest | null = null;
let reviewedAudioManifestRequest: Promise<ReviewedAudioManifest | null> | null = null;

interface ReviewedAudioManifest {
  assets: ReviewedAudioAsset[];
}

interface ReviewedAudioAsset {
  id: string;
  src: string;
  approved: boolean;
}

const MAX_REVIEWED_AUDIO_ASSETS = 50;

function getContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function unlockAudioForGesture() {
  hasUserGesture = true;
  if (isMuted) return;
  getContext();
  preloadReviewedAudioManifest();
}

export function setMuted(muted: boolean) {
  isMuted = muted;
  if (bgmGain) {
    bgmGain.gain.setTargetAtTime(muted ? 0 : 0.04, getContext().currentTime, 0.1);
  }
}

function playTone(freq: number, type: OscillatorType, duration: number, vol = 0.1) {
  if (isMuted) return;
  const ctx = getContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  
  osc.start();
  osc.stop(ctx.currentTime + duration);
}

export function playCorrect() {
  if (playReviewedAudioAsset('tri-great-counting', playCorrectFallback)) return;
  playCorrectFallback();
}

function playCorrectFallback() {
  const ctx = getContext();
  if (isMuted) return;
  // Celebratory C5→E5→G5 arpeggio using Web Audio currentTime for tight scheduling
  const t = ctx.currentTime;
  playToneAt(523.25, 'sine', 0.2, t);
  playToneAt(659.25, 'sine', 0.2, t + 0.10);
  playToneAt(783.99, 'sine', 0.4, t + 0.20);
}

export function playWrong() {
  if (playReviewedAudioAsset('tri-one-more-try', playWrongFallback)) return;
  playWrongFallback();
}

function playWrongFallback() {
  if (isMuted) return;
  // Gentle descending "oops" — softer than a single low drone
  const ctx = getContext();
  const t = ctx.currentTime;
  playToneAt(220, 'triangle', 0.2, t);
  playToneAt(175, 'triangle', 0.25, t + 0.18);
}

export function playUnlockDino() {
  // Try new cheerful dino roar first, then the voiced clip, then oscillator
  if (playReviewedAudioAsset('dino-happy-roar', () => {
    if (!playReviewedAudioAsset('tri-new-friend', playUnlockDinoFallback)) {
      playUnlockDinoFallback();
    }
  })) return;
  if (playReviewedAudioAsset('tri-new-friend', playUnlockDinoFallback)) return;
  playUnlockDinoFallback();
}

function playUnlockDinoFallback() {
  if (isMuted) return;
  const ctx = getContext();
  const t = ctx.currentTime;
  playToneAt(440,    'square', 0.15, t);
  playToneAt(554.37, 'square', 0.15, t + 0.15);
  playToneAt(659.25, 'square', 0.15, t + 0.30);
  playToneAt(880,    'square', 0.4,  t + 0.45);
}

export function playUnlockBiome() {
  if (isMuted) return;
  const ctx = getContext();
  const t = ctx.currentTime;
  playToneAt(523.25,  'triangle', 0.15, t);
  playToneAt(659.25,  'triangle', 0.15, t + 0.15);
  playToneAt(783.99,  'triangle', 0.15, t + 0.30);
  playToneAt(659.25,  'triangle', 0.15, t + 0.45);
  playToneAt(1046.50, 'triangle', 0.6,  t + 0.60);
}

/** Jungle win fanfare — played on biome clear or long streak. */
export function playBiomeComplete() {
  if (playReviewedAudioAsset('jungle-win-fanfare', playUnlockBiome)) return;
  playUnlockBiome();
}

/** Shimmering sparkle win — richer than sparkle-short, used for word streaks. */
export function playSparkleWin() {
  if (playReviewedAudioAsset('magical-sparkle-success', playTinySongFallback)) return;
  playTinySongFallback();
}

export function playTap() {
  if (isMuted) return;
  playTone(800, 'sine', 0.05, 0.05);
}

export function playRhythmCue() {
  if (playReviewedAudioAsset('dino-soft-stomp', playRhythmCueFallback)) return;
  playRhythmCueFallback();
}

function playRhythmCueFallback() {
  if (isMuted) return;
  const ctx = getContext();
  const t = ctx.currentTime;
  [0, 0.18, 0.36].forEach((offset, index) => {
    playToneAt(index === 2 ? 660 : 520, 'triangle', 0.12, t + offset, 0.08);
  });
}

export function playWordRhythm(beatCount: number) {
  if (isMuted) return;
  const count = Math.max(1, Math.min(4, beatCount));
  const ctx = getContext();
  const t = ctx.currentTime;
  Array.from({ length: count }).forEach((_, index) => {
    playToneAt(index === count - 1 ? 660 : 520, 'triangle', 0.14, t + index * 0.21, 0.08);
  });
}

export function playPhonicsCue() {
  if (isMuted) return;
  const ctx = getContext();
  const t = ctx.currentTime;
  playToneAt(392,    'sine', 0.12, t,        0.06);
  playToneAt(523.25, 'sine', 0.16, t + 0.14, 0.06);
}

export function playTinySong() {
  if (playReviewedAudioAsset('sparkle-short', playTinySongFallback)) return;
  playTinySongFallback();
}

function playTinySongFallback() {
  if (isMuted) return;
  const ctx = getContext();
  const t = ctx.currentTime;
  [392, 440, 523.25, 440, 523.25, 659.25].forEach((freq, index) => {
    playToneAt(freq, 'sine', 0.18, t + index * 0.16, 0.07);
  });
}

/** Schedule a tone using AudioContext time offsets for drift-free timing. */
function playToneAt(freq: number, type: OscillatorType, duration: number, startTime: number, vol = 0.1) {
  if (isMuted) return;
  const ctx = getContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, startTime);

  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(vol, startTime + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(startTime);
  osc.stop(startTime + duration);
}

function playReviewedAudioAsset(id: string, onPlaybackFailure: () => void): boolean {
  if (isMuted || !hasUserGesture) return false;
  if (!reviewedAudioManifest) {
    preloadReviewedAudioManifest();
    return false;
  }

  const asset = reviewedAudioManifest.assets.find((entry) => entry.id === id && entry.approved);
  if (!asset) return false;

  const audio = new Audio(publicAssetUrl(asset.src));
  audio.volume = 0.72;
  let didFallback = false;
  const fallbackOnce = () => {
    if (didFallback) return;
    didFallback = true;
    onPlaybackFailure();
  };
  audio.addEventListener('error', fallbackOnce, { once: true });
  void audio.play().catch(fallbackOnce);
  return true;
}

function preloadReviewedAudioManifest(): void {
  if (reviewedAudioManifest || reviewedAudioManifestRequest) return;
  reviewedAudioManifestRequest = fetch(publicAssetUrl('/audio/manifest.json'))
    .then((response) => (response.ok ? response.json() : null))
    .then((manifest: ReviewedAudioManifest | null) => {
      reviewedAudioManifest = validateReviewedAudioManifest(manifest);
      return reviewedAudioManifest;
    })
    .catch(() => null)
    .finally(() => {
      reviewedAudioManifestRequest = null;
    });
}

function validateReviewedAudioManifest(manifest: unknown): ReviewedAudioManifest | null {
  if (!manifest || typeof manifest !== 'object') return null;
  const assets = (manifest as ReviewedAudioManifest).assets;
  if (!Array.isArray(assets)) return null;

  const validAssets = assets.filter((asset): asset is ReviewedAudioAsset => {
    if (!asset || typeof asset !== 'object') return false;
    if (asset.approved !== true) return false;
    if (typeof asset.id !== 'string' || !/^[a-z0-9][a-z0-9-]*$/.test(asset.id)) return false;
    if (typeof asset.src !== 'string' || !asset.src.startsWith('/audio/generated/') || !asset.src.endsWith('.mp3')) {
      return false;
    }
    if (asset.src.includes('..')) return false;
    return true;
  });

  return { assets: validAssets.slice(0, MAX_REVIEWED_AUDIO_ASSETS) };
}

export function startBgMusic(biomeIndex: number) {
  if (!hasUserGesture) return;
  const ctx = getContext();
  if (bgmOscillator) {
    bgmOscillator.stop();
    bgmOscillator.disconnect();
  }
  if (bgmGain) {
    bgmGain.disconnect();
  }
  
  bgmOscillator = ctx.createOscillator();
  bgmGain = ctx.createGain();
  
  // Different frequencies per biome
  const freqs = [150, 180, 130, 220];
  bgmOscillator.frequency.value = freqs[biomeIndex] || 150;
  bgmOscillator.type = 'triangle';
  
  bgmGain.gain.value = isMuted ? 0 : 0.04;
  
  bgmOscillator.connect(bgmGain);
  bgmGain.connect(ctx.destination);
  bgmOscillator.start();
}

export function stopBgMusic() {
  if (bgmOscillator) {
    bgmOscillator.stop();
    bgmOscillator.disconnect();
    bgmOscillator = null;
  }
}
