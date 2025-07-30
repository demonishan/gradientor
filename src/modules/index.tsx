/**
 * Shared types and barrel exports for all gradient-related modules.
 * @module GradientorModules
 */
export interface ColorStop {
  color: string;
  id: string;
  opacity: number;
  position: number;
}
export { addFavorite } from './favoriteUtils';
export { adjustHue } from './adjustmentHue';
export { adjustLightness } from './adjustmentLightness';
export { adjustSaturation } from './adjustmentSaturation';
export { default as useClipboard } from './useClipboard';
export { exportCSS, exportJSON, exportPNG, exportSVG } from './exportToFiles';
export { FAVORITES_KEY } from './favoriteUtils';
export { generateRandomGradient } from './randomGradient';
export { generateShareLink, parseShareLink } from './shareLink';
export { getGradientPresets } from './contentfulApi';
export type { GradientFavorite } from './favoriteUtils';
export type { GradientShareConfig } from './shareLink';
