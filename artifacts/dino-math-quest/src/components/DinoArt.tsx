import { useState } from 'react';
import type { Dino } from '../lib/dinos';
import { publicAssetUrl } from '../lib/assets';

interface DinoArtProps {
  /** Undefined is tolerated so callers can render a lookup that may miss. */
  dino?: Pick<Dino, 'name' | 'emoji' | 'art'>;
  /** Sizing lives here — an <img> needs width/height, not a font size. */
  className?: string;
  /** True when an adjacent element already names the dino. */
  decorative?: boolean;
}

/**
 * Renders a dino's SVG portrait, falling back to its emoji if the art is
 * missing or fails to load. The fallback matters: art is generated against the
 * specs in `docs/asset-specs/dinos/` and a file can legitimately be absent
 * mid-regeneration. A missing portrait should degrade, not blank the screen.
 */
export function DinoArt({ dino, className = '', decorative = false }: DinoArtProps) {
  const [failed, setFailed] = useState(false);

  if (!dino || !dino.art || failed) {
    return (
      <span className={className} aria-hidden={decorative || !dino ? true : undefined}>
        {dino?.emoji ?? '🦕'}
      </span>
    );
  }

  return (
    <img
      src={publicAssetUrl(dino.art)}
      alt={decorative ? '' : dino.name}
      aria-hidden={decorative || undefined}
      draggable={false}
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
