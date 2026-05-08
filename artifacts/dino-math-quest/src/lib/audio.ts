let audioCtx: AudioContext | null = null;
let bgmOscillator: OscillatorNode | null = null;
let bgmGain: GainNode | null = null;
let isMuted = false;

function getContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
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
  const ctx = getContext();
  if (isMuted) return;
  setTimeout(() => playTone(523.25, 'sine', 0.2), 0);    // C5
  setTimeout(() => playTone(659.25, 'sine', 0.2), 100);  // E5
  setTimeout(() => playTone(783.99, 'sine', 0.4), 200);  // G5
}

export function playWrong() {
  if (isMuted) return;
  playTone(200, 'sine', 0.3, 0.2);
}

export function playUnlockDino() {
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

export function startBgMusic(biomeIndex: number) {
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
