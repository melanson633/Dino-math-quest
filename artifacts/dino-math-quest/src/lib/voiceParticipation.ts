export type VoiceAttemptResult = 'attempt' | 'quiet' | 'unavailable';

interface VoiceAttemptOptions {
  durationMs?: number;
  threshold?: number;
}

export async function detectVoiceAttempt(options: VoiceAttemptOptions = {}): Promise<VoiceAttemptResult> {
  const durationMs = options.durationMs ?? 1400;
  const threshold = options.threshold ?? 0.035;

  if (!navigator.mediaDevices?.getUserMedia || !window.AudioContext) {
    return 'unavailable';
  }

  let stream: MediaStream | null = null;
  let audioContext: AudioContext | null = null;

  try {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      }
    });

    audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 512;
    source.connect(analyser);

    const samples = new Uint8Array(analyser.fftSize);
    const startedAt = performance.now();
    let peak = 0;

    while (performance.now() - startedAt < durationMs) {
      analyser.getByteTimeDomainData(samples);
      let sum = 0;
      for (const sample of samples) {
        const centered = (sample - 128) / 128;
        sum += centered * centered;
      }
      peak = Math.max(peak, Math.sqrt(sum / samples.length));
      if (peak >= threshold) return 'attempt';
      await new Promise(resolve => window.setTimeout(resolve, 80));
    }

    return peak >= threshold ? 'attempt' : 'quiet';
  } catch {
    return 'unavailable';
  } finally {
    stream?.getTracks().forEach(track => track.stop());
    if (audioContext?.state !== 'closed') {
      void audioContext?.close();
    }
  }
}
