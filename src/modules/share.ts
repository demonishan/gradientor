import type { GradientConfig, ColorStop } from '../App';

/**
 * Updates the repeating property of a gradient.
 * @param gradient GradientConfig object
 * @param repeating Boolean for repeating
 * @returns Updated GradientConfig
 */
export const updateRepeating = (gradient: GradientConfig, repeating: boolean): GradientConfig => ({ ...gradient, repeating });

/**
 * Updates the radial size property of a gradient.
 * @param gradient GradientConfig object
 * @param size Radial size string
 * @returns Updated GradientConfig
 */
export const updateRadialSize = (gradient: GradientConfig, size: string): GradientConfig => ({ ...gradient, radialSize: size });

/**
 * Adds a new color stop to the gradient.
 * @param gradient GradientConfig object
 * @param position Position for the new color stop
 * @returns Updated GradientConfig
 */
export const addColorStop = (gradient: GradientConfig, position: number): GradientConfig => {
  const newStop: ColorStop = { id: Date.now().toString(), color: `#ffffff`, position, opacity: 1 };
  return { ...gradient, colorStops: [...gradient.colorStops, newStop].sort((a, b) => a.position - b.position) };
};

/**
 * Updates a color stop in the gradient.
 * @param gradient GradientConfig object
 * @param id Color stop ID
 * @param updates Partial updates for the color stop
 * @returns Updated GradientConfig
 */
export const updateColorStop = (gradient: GradientConfig, id: string, updates: Partial<ColorStop>): GradientConfig => ({
  ...gradient,
  colorStops: gradient.colorStops.map((stop) => (stop.id === id ? { ...stop, ...updates } : stop)),
});

/**
 * Deletes a color stop from the gradient.
 * @param gradient GradientConfig object
 * @param id Color stop ID
 * @returns Updated GradientConfig
 */
export const deleteColorStop = (gradient: GradientConfig, id: string): GradientConfig => {
  if (gradient.colorStops.length <= 2) return gradient;
  return { ...gradient, colorStops: gradient.colorStops.filter((stop) => stop.id !== id) };
};

/**
 * Updates the gradient type.
 * @param gradient GradientConfig object
 * @param type Gradient type
 * @returns Updated GradientConfig
 */
export const updateGradientType = (gradient: GradientConfig, type: 'linear' | 'radial' | 'conic' | 'elliptical'): GradientConfig => ({ ...gradient, type });

/**
 * Updates the gradient angle.
 * @param gradient GradientConfig object
 * @param angle Gradient angle
 * @returns Updated GradientConfig
 */
export const updateGradientAngle = (gradient: GradientConfig, angle: number): GradientConfig => ({ ...gradient, angle });

/**
 * Updates the conic position of the gradient.
 * @param gradient GradientConfig object
 * @param pos Position object { x, y }
 * @returns Updated GradientConfig
 */
export const updateConicPosition = (gradient: GradientConfig, pos: { x: number; y: number }): GradientConfig => ({ ...gradient, conicPosition: pos });

/**
 * Updates the radial direction of the gradient.
 * @param gradient GradientConfig object
 * @param dir Radial direction string
 * @returns Updated GradientConfig
 */
export const updateRadialDirection = (gradient: GradientConfig, dir: string): GradientConfig => ({ ...gradient, radialDirection: dir });

/**
 * Type for sharing gradient configuration via URL.
 */
export type GradientShareConfig = {
  type: `linear` | `radial` | `conic` | `elliptical`;
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

/**
 * Generates a shareable link for a gradient configuration.
 * @param gradientConfig GradientShareConfig object
 * @returns Shareable URL string
 */
export const generateShareLink = (gradientConfig: GradientShareConfig): string => {
  const { type, angle, colorStops, conicPosition, radialDirection, radialSize, repeating } = gradientConfig;
  const encoded = btoa(JSON.stringify({ type, angle, colorStops, conicPosition, radialDirection, radialSize, repeating }));
  return `${window.location.origin}/?g=${encoded}`;
};

/**
 * Parses a shareable gradient link and returns the gradient configuration.
 * @param url URL string
 * @returns GradientShareConfig object or null if invalid
 */
export const parseShareLink = (url: string): GradientShareConfig | null => {
  const params = new URL(url).searchParams;
  const encoded = params.get(`g`);
  if (!encoded) return null;
  try {
    return JSON.parse(atob(encoded));
  } catch {
    return null;
  }
};
