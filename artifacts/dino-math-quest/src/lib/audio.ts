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
  setTimeout(() => playTone(523.25, 'sine', 0.2), 0);    // C5
  setTimeout(() => playTone(659.25, 'sine', 0.2), 100);  // E5
  setTimeout(() => playTone(783.99, 'sine', 0.4), 200);  // G5
}

export function playWrong() {
  if (playReviewedAudioAsset('tri-one-more-try', playWrongFallback)) return;
  playWrongFallback();
}

function playWrongFallback() {
  if (isMuted) return;
  playTone(200, 'sine', 0.3, 0.2);
}

export function playUnlockDino() {
  if (playReviewedAudioAsset('tri-new-friend', playUnlockDinoFallback)) return;
  playUnlockDinoFallback();
}

function playUnlockDinoFallback() {
  if (isMuted) return;
  setTimeout(() => playTone(440, 'square', 0.15), 0);
  setTimeout(() => playTone(554.37, 'square', 0.15), 150);
  setTimeout(() => playTone(659.25, 'square', 0.15), 300);
  setTimeout(() => playTone(880, 'square', 0.4), 450);
}

export function playUnlockBiome() {
  if (isMuted) return;
  setTimeout(() => playTone(523.25, 'triangle', 0.15), 0);
  setTimeout(() => playTone(659.25, 'triangle', 0.15), 150);
  setTimeout(() => playTone(783.99, 'triangle', 0.15), 300);
  setTimeout(() => playTone(659.25, 'triangle', 0.15), 450);
  setTimeout(() => playTone(1046.50, 'triangle', 0.6), 600);
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
  [0, 180, 360].forEach((delay, index) => {
    setTimeout(() => playTone(index === 2 ? 660 : 520, 'triangle', 0.12, 0.08), delay);
  });
}

export function playWordRhythm(beatCount: number) {
  if (isMuted) return;
  const count = Math.max(1, Math.min(4, beatCount));
  Array.from({ length: count }).forEach((_, index) => {
    setTimeout(() => playTone(index === count - 1 ? 660 : 520, 'triangle', 0.14, 0.08), index * 210);
  });
}

export function playPhonicsCue() {
  if (isMuted) return;
  setTimeout(() => playTone(392, 'sine', 0.12, 0.06), 0);
  setTimeout(() => playTone(523.25, 'sine', 0.16, 0.06), 140);
}

export function playTinySong() {
  if (playReviewedAudioAsset('sparkle-short', playTinySongFallback)) return;
  playTinySongFallback();
}

function playTinySongFallback() {
  if (isMuted) return;
  [392, 440, 523.25, 440, 523.25, 659.25].forEach((freq, index) => {
    setTimeout(() => playTone(freq, 'sine', 0.18, 0.07), index * 160);
  });
}

function playReviewedAudioAsset(id: string, onPlaybackFailure: () => void): boolean {
  if (isMuted || !hasUserGesture) return false;
  if (!reviewedAudioManifest) {
    preloadReviewedAudioManifest();
    return false;
  }

  const asset = reviewedAudioManifest.assets.find((entry) => entry.id === id && entry.approved);
  if (!asset) return false;

  const audio = new Audio(publicAudioUrl(asset.src));
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
  reviewedAudioManifestRequest = fetch(publicAudioUrl('/audio/manifest.json'))
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

function publicAudioUrl(src: string): string {
  const base = import.meta.env.BASE_URL || '/';
  return `${base.replace(/\/$/, '')}/${src.replace(/^\//, '')}`;
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
