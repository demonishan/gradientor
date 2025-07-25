/**
 * Represents a color stop in a gradient.
 * @property color Hex color string
 * @property position Position (0-100)
 * @property opacity Opacity (0-1)
 */
export type ColorStop = {
  color: string;
  position: number;
  opacity: number;
};

/**
 * Represents a favorite gradient configuration.
 * @property type Gradient type
 * @property angle Angle (optional)
 * @property repeating Repeating flag (optional)
 * @property colorStops Array of color stops
 * @property radialDirection Radial direction (optional)
 * @property radialSize Radial size (optional)
 * @property conicPosition Conic position (optional)
 */
export type GradientFavorite = {
  type: 'linear' | 'radial' | 'elliptical' | 'conic';
  angle?: number;
  repeating?: boolean;
  colorStops: ColorStop[];
  radialDirection?: string;
  radialSize?: string;
  conicPosition?: { x: number; y: number };
};

/**
 * Adds a gradient configuration to favorites in localStorage and dispatches an update event.
 * @param gradient GradientFavorite object to add
 */
export function addFavorite(gradient: GradientFavorite) {
  const item = window.localStorage.getItem(FAVORITES_KEY);
  const favs: GradientFavorite[] = item ? JSON.parse(item) : [];
  favs.unshift(gradient);
  window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs.slice(0, 50)));
  window.dispatchEvent(new Event('favorites-updated'));
}

/**
 * Key for storing favorites in localStorage.
 */
export const FAVORITES_KEY = 'gradientor-favorites';