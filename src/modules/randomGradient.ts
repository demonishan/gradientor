import type { GradientConfig } from '../App';
function randomColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}
function randomStops(count = 2 + Math.floor(Math.random() * 7)) {
  return Array.from({ length: count }, (_, i) => ({
    id: i === 0 ? '1' : `${Date.now()}-${Math.random().toString(36).slice(2)}-${i}`,
    color: randomColor(),
    position: Math.round((i / (count - 1)) * 100),
    opacity: 1,
  }));
}
function randomAngle() {
  return 45 * Math.floor(Math.random() * 5);
}
function randomLinear() {
  return {
    type: 'linear',
    angle: randomAngle(),
    repeating: false,
    colorStops: randomStops(),
  } as GradientConfig;
}
function randomRadial() {
  const directions = ['at center', 'at top', 'at bottom', 'at left', 'at right', 'at top left', 'at top right', 'at bottom left', 'at bottom right'];
  return {
    type: Math.random() < 0.5 ? 'radial' : 'elliptical',
    radialDirection: directions[Math.floor(Math.random() * directions.length)],
    radialSize: 'None',
    repeating: false,
    colorStops: randomStops(),
  } as GradientConfig;
}
function randomConic() {
  return {
    type: 'conic',
    angle: randomAngle(),
    conicPosition: { x: 50, y: 50 },
    repeating: false,
    colorStops: randomStops(),
  } as GradientConfig;
}
export function generateRandomGradient(): GradientConfig {
  const type = Math.random();
  if (type < 0.5) return randomLinear();
  if (type < 0.8) return randomRadial();
  return randomConic();
}
