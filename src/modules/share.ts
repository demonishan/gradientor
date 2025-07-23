// share.ts
// Module for sharing gradients or generating shareable links

export type GradientShareConfig = {
  type: 'linear' | 'radial' | 'conic' | 'elliptical';
  angle: number;
  colorStops: {
    id: string;
    color: string;
    position: number;
    opacity: number;
  }[];
  conicPosition?: { x: number; y: number };
  radialDirection?: string;
  radialSize?: string;
  repeating?: boolean;
};

export const generateShareLink = (gradientConfig: GradientShareConfig): string => {
  // Include all controls in the share link
  const {
    type,
    angle,
    colorStops,
    conicPosition,
    radialDirection,
    radialSize,
    repeating
  } = gradientConfig;
  const encoded = btoa(
    JSON.stringify({
      type,
      angle,
      colorStops,
      conicPosition,
      radialDirection,
      radialSize,
      repeating
    })
  );
  return `${window.location.origin}/?gradient=${encoded}`;
};

export const parseShareLink = (url: string): GradientShareConfig | null => {
  const params = new URL(url).searchParams;
  const encoded = params.get('gradient');
  if (!encoded) return null;
  try {
    return JSON.parse(atob(encoded)) as GradientShareConfig;
  } catch {
    return null;
  }
};
