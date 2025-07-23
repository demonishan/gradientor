import type { GradientConfig, ColorStop } from '../App';
export const updateRepeating = (gradient: GradientConfig, repeating: boolean): GradientConfig => ({ ...gradient, repeating });
export const updateRadialSize = (gradient: GradientConfig, size: string): GradientConfig => ({ ...gradient, radialSize: size });
export const addColorStop = (gradient: GradientConfig, position: number): GradientConfig => {
  const newStop: ColorStop = { id: Date.now().toString(), color: '#ffffff', position, opacity: 1 };
  return { ...gradient, colorStops: [...gradient.colorStops, newStop].sort((a, b) => a.position - b.position) };
};
export const updateColorStop = (gradient: GradientConfig, id: string, updates: Partial<ColorStop>): GradientConfig => ({
  ...gradient,
  colorStops: gradient.colorStops.map((stop) => (stop.id === id ? { ...stop, ...updates } : stop)),
});
export const deleteColorStop = (gradient: GradientConfig, id: string): GradientConfig => {
  if (gradient.colorStops.length <= 2) return gradient;
  return { ...gradient, colorStops: gradient.colorStops.filter((stop) => stop.id !== id) };
};
export const updateGradientType = (gradient: GradientConfig, type: 'linear' | 'radial' | 'conic' | 'elliptical'): GradientConfig => ({ ...gradient, type });
export const updateGradientAngle = (gradient: GradientConfig, angle: number): GradientConfig => ({ ...gradient, angle });
export const updateConicPosition = (gradient: GradientConfig, pos: { x: number; y: number }): GradientConfig => ({ ...gradient, conicPosition: pos });
export const updateRadialDirection = (gradient: GradientConfig, dir: string): GradientConfig => ({ ...gradient, radialDirection: dir });
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
  const { type, angle, colorStops, conicPosition, radialDirection, radialSize, repeating } = gradientConfig;
  const encoded = btoa(JSON.stringify({ type, angle, colorStops, conicPosition, radialDirection, radialSize, repeating }));
  return `${window.location.origin}/?gradient=${encoded}`;
};
export const parseShareLink = (url: string): GradientShareConfig | null => {
  const params = new URL(url).searchParams;
  const encoded = params.get('gradient');
  if (!encoded) return null;
  try {
    return JSON.parse(atob(encoded));
  } catch {
    return null;
  }
};
