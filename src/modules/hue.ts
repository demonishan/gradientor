// src/modules/hue.ts
// Module for hue adjustment

export function adjustHue(hexColors: string[], hueShift: number): string[] {
  // Converts hex to HSL, shifts hue, converts back to hex
  return hexColors.map(hex => {
    let { h, s, l } = hexToHsl(hex);
    h = (h + hueShift + 360) % 360;
    return hslToHex(h, s, l);
  });
}

function hexToHsl(hex: string) {
  // Remove # if present
  hex = hex.replace(/^#/, '');
  let r = parseInt(hex.substring(0,2), 16) / 255;
  let g = parseInt(hex.substring(2,4), 16) / 255;
  let b = parseInt(hex.substring(4,6), 16) / 255;
  let max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch(max){
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h = h * 60;
  }
  return { h, s: s * 100, l: l * 100 };
}

function hslToHex(h: number, s: number, l: number) {
  s /= 100;
  l /= 100;
  let c = (1 - Math.abs(2 * l - 1)) * s;
  let x = c * (1 - Math.abs((h / 60) % 2 - 1));
  let m = l - c/2;
  let r=0, g=0, b=0;
  if (h < 60) { r = c; g = x; b = 0; }
  else if (h < 120) { r = x; g = c; b = 0; }
  else if (h < 180) { r = 0; g = c; b = x; }
  else if (h < 240) { r = 0; g = x; b = c; }
  else if (h < 300) { r = x; g = 0; b = c; }
  else { r = c; g = 0; b = x; }
  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);
  return '#' + [r,g,b].map(x => x.toString(16).padStart(2, '0')).join('');
}
