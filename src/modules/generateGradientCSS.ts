import type { GradientConfig } from '../App';
import { hexToRgba } from '../helpers/color';
import { clamp } from '../helpers/clamp';
export const sortColorStops = <T extends { position: number }>(colorStops: T[]): T[] => [...colorStops].sort((a, b) => a.position - b.position);
const generateGradientCSS = (gradient: GradientConfig): string => {
  const stops = sortColorStops(gradient.colorStops)
    .map((stop) => `${stop.opacity !== 1 ? hexToRgba(stop.color, stop.opacity) : stop.color} ${stop.position.toFixed(1)}%`)
    .join(`, `);
  if (gradient.type === `linear`) return `${gradient.repeating ? `repeating-linear-gradient` : `linear-gradient`}(${gradient.angle}deg, ${stops})`;
  if (gradient.type === `radial` || gradient.type === `elliptical`) {
    let dir = gradient.radialDirection || `center`;
    if (dir === `center`) dir = `at center`;
    const size = gradient.radialSize && gradient.radialSize !== `None` ? gradient.radialSize : ``;
    const prefix = gradient.repeating ? `repeating-radial-gradient` : `radial-gradient`;
    const shape = gradient.type === `elliptical` ? `ellipse` : `circle`;
    if (size && dir.startsWith(`at `)) return `${prefix}(${shape} ${size} ${dir}, ${stops})`;
    if (size) return `${prefix}(${shape} ${size}, ${stops})`;
    if (dir.startsWith(`at `)) return `${prefix}(${shape} ${dir}, ${stops})`;
    return `${prefix}(${shape}, ${stops})`;
  }
  if (gradient.type === `conic`) {
    const pos = gradient.conicPosition || { x: 50, y: 50 };
    return `${gradient.repeating ? `repeating-conic-gradient` : `conic-gradient`}(${clamp(pos.x, 0, 100)}% ${clamp(pos.y, 0, 100)}%, ${stops})`;
  }
  return ``;
};
const generateFullCSS = (gradient: GradientConfig, maxCompatibility: boolean): string => {
  const gradientCSS = generateGradientCSS(gradient);
  if (maxCompatibility) {
    const fallbackColor = gradient.colorStops.sort((a, b) => a.position - b.position)[0].color;
    return `background: ${fallbackColor};background: -webkit-${gradientCSS};background: -moz-${gradientCSS};background: -o-${gradientCSS};background: ${gradientCSS};`;
  }
  return `background: ${gradientCSS};`;
};
export { generateGradientCSS, generateFullCSS };
