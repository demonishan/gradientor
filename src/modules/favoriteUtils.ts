/**
 * Adds a gradient configuration to favorites in localStorage and dispatches an update event.
 * @param gradient GradientFavorite object to add
 */
export type ColorStop = {
  color: string;
  position: number;
  opacity: number;
};
export type GradientFavorite = {
  type: 'linear' | 'radial' | 'elliptical' | 'conic';
  angle?: number;
  repeating?: boolean;
  colorStops: ColorStop[];
  radialDirection?: string;
  radialSize?: string;
  conicPosition?: { x: number; y: number };
};
export const FAVORITES_KEY = 'gradientor-favorites';
export function addFavorite(gradient: GradientFavorite) {
  const item = window.localStorage.getItem(FAVORITES_KEY);
  const favs: GradientFavorite[] = item ? JSON.parse(item) : [];
  favs.unshift(gradient);
  window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs.slice(0, 50)));
  window.dispatchEvent(new Event('favorites-updated'));
}
