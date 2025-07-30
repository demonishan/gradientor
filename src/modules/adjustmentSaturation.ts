/**
 * Adjusts the saturation of an array of hex colors by a given amount.
 * @param hexColors Array of hex color strings.
 * @param saturationShift Amount to shift saturation (-100 to 100).
 * @returns Array of hex color strings with adjusted saturation.
 */
export const adjustSaturation = (hexColors: string[], saturationShift: number): string[] => {
  return hexColors.map((hex) => {
    const { h, s, l } = hexToHsl(hex);
    let newS;
    if (saturationShift === 0) newS = s;
    else if (saturationShift < 0) newS = s * (1 + saturationShift / 100);
    else newS = s + (100 - s) * (saturationShift / 100);
    newS = Math.max(0, Math.min(100, newS));
    return hslToHex(h, newS, l);
  });
};

/**
 * Converts a hex color to HSL.
 * @param hex Hex color string.
 * @returns HSL object.
 */
function hexToHsl(hex: string): { h: number; s: number; l: number } {
  hex = hex.replace(/^#/, ``);
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h = h * 60;
  }
  return { h, s: s * 100, l: l * 100 };
}

/**
 * Converts HSL to hex color.
 * @param h Hue.
 * @param s Saturation.
 * @param l Lightness.
 * @returns Hex color string.
 */
function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0,
    g = 0,
    b = 0;
  if (h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (h < 300) {
    r = x;
    g = 0;
    b = c;
  } else {
    r = c;
    g = 0;
    b = x;
  }
  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);
  return `#` + [r, g, b].map((x) => x.toString(16).padStart(2, `0`)).join(``);
}
