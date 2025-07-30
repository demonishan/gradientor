import type { GradientConfig } from '../App';

/**
 * Generates a random hex color string.
 * @returns {string} Random hex color
 */
const randomColor = (): string => {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `#${r.toString(16).padStart(2, `0`)}${g.toString(16).padStart(2, `0`)}${b.toString(16).padStart(2, `0`)}`;
};

/**
 * Generates an array of random color stops.
 * @param {number} count Number of stops (default: random between 2 and 7)
 * @returns {Array} Array of color stops
 */
const randomStops = (count = 2 + Math.floor(Math.random() * 6)) =>
  Array.from({ length: count }, (_, i) => ({
    id: i === 0 ? `1` : `${Date.now()}-${Math.random().toString(36).slice(2)}-${i}`,
    color: randomColor(),
    position: Math.round((i / (count - 1)) * 100),
    opacity: 1,
  }));

/**
 * Generates a random angle (multiple of 45).
 * @returns {number} Random angle
 */
const randomAngle = (): number => 45 * Math.floor(Math.random() * 5);

/**
 * Generates a random linear gradient config.
 * @returns {GradientConfig} Linear gradient config
 */
const randomLinear = (): GradientConfig => ({
  type: `linear`,
  angle: randomAngle(),
  repeating: false,
  colorStops: randomStops(),
});

/**
 * Generates a random radial or elliptical gradient config.
 * @returns {GradientConfig} Radial or elliptical gradient config
 */
const randomRadial = (): GradientConfig => {
  const directions = [`at center`, `at top`, `at bottom`, `at left`, `at right`, `at top left`, `at top right`, `at bottom left`, `at bottom right`];
  return {
    type: Math.random() < 0.5 ? `radial` : `elliptical`,
    angle: randomAngle(),
    radialDirection: directions[Math.floor(Math.random() * directions.length)],
    radialSize: `None`,
    repeating: false,
    colorStops: randomStops(),
  };
};

/**
 * Generates a random conic gradient config.
 * @returns {GradientConfig} Conic gradient config
 */
const randomConic = (): GradientConfig => ({
  type: `conic`,
  angle: randomAngle(),
  conicPosition: { x: 50, y: 50 },
  repeating: false,
  colorStops: randomStops(),
});

/**
 * Generates a random gradient configuration (linear, radial/elliptical, or conic).
 * @returns {GradientConfig} A random gradient configuration object
 */
export const generateRandomGradient = (): GradientConfig => {
  const type = Math.random();
  if (type < 0.5) return randomLinear();
  if (type < 0.8) return randomRadial();
  return randomConic();
};
