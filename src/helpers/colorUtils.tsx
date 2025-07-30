/**
 * Converts a hex color to RGBA string.
 * Accepts #RRGGBB, #RGB, or #RRGGBBAA.
 * @param {string} hex - Hex color string.
 * @returns {string} RGBA color string.
 */
export function hexToRgba(hex: string): string {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map((x) => x + x).join('');
  if (h.length === 6) {
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    return `rgba(${r},${g},${b},1)`;
  }
  if (h.length === 8) {
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    const a = parseInt(h.slice(6, 8), 16) / 255;
    return `rgba(${r},${g},${b},${+a.toFixed(1)})`;
  }
  return hex;
}

/**
 * Converts an RGBA string to hex color.
 * Accepts rgba(r,g,b,a) or rgb(r,g,b).
 * @param {string} rgba - RGBA color string.
 * @returns {string} Hex color string.
 */
export function rgbaToHex(rgba: string): string {
  const match = rgba.replace(/\s+/g, '').match(/rgba?\((\d+),(\d+),(\d+)(?:,([\d.]+))?\)/i);
  if (!match) return rgba;
  const r = Math.min(255, parseInt(match[1]));
  const g = Math.min(255, parseInt(match[2]));
  const b = Math.min(255, parseInt(match[3]));
  let hex = `#${[r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('')}`;
  if (match[4] !== undefined) {
    const alpha = Math.round(Math.min(1, parseFloat(match[4])) * 255);
    hex += alpha.toString(16).padStart(2, '0');
  }
  return hex;
}

/**
 * Converts a hex color to HSL string.
 * Accepts #RRGGBB or #RGB.
 * @param {string} hex - Hex color string.
 * @returns {string} HSL color string.
 */
export function hexToHsl(hex: string): string {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map((x) => x + x).join('');
  if (h.length !== 6) return hex;
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let hslH = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: hslH = (g - b) / d + (g < b ? 6 : 0); break;
      case g: hslH = (b - r) / d + 2; break;
      case b: hslH = (r - g) / d + 4; break;
    }
    hslH /= 6;
  }
  return `hsl(${Math.round(hslH * 360)},${Math.round(s * 100)}%,${Math.round(l * 100)}%)`;
}

/**
 * Converts an HSL string to hex color.
 * Accepts hsl(h,s%,l%).
 * @param {string} hsl - HSL color string.
 * @returns {string} Hex color string.
 */
export function hslToHex(hsl: string): string {
  const match = hsl.match(/hsl\((\d+),(\d+)%?,(\d+)%?\)/);
  if (!match) return hsl;
  const h = parseInt(match[1]) / 360;
  const s = parseInt(match[2]) / 100;
  const l = parseInt(match[3]) / 100;
  let r, g, b;
  if (s === 0) r = g = b = l;
  else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return `#${[r, g, b].map((x) => Math.round(x * 255).toString(16).padStart(2, '0')).join('')}`;
}
