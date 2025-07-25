/**
 * Exports a gradient as SVG, PNG, or CSS file and triggers download in browser.
 * @param gradientCSS CSS string for SVG or CSS export
 * @param filename Name of the file to download
 * @param gradient GradientConfig for PNG export
 * @param hexToRgba Function to convert hex to RGBA for PNG export
 * @param width Width of PNG export
 * @param height Height of PNG export
 */
import type { GradientConfig } from '../App';
export function exportSVG(gradientCSS: string, filename = 'gradientor.svg') {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><style>svg{background:${gradientCSS};}</style></svg>`;
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}
export function exportPNG(gradient: GradientConfig, hexToRgba: (hex: string, opacity: number) => string, filename = 'gradientor.png', width = 1920, height = 1080) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const grad = ctx.createLinearGradient(0, 0, width, 0);
  gradient.colorStops
    .sort((a, b) => a.position - b.position)
    .forEach((stop) => {
      const colorValue = stop.opacity !== 1 ? hexToRgba(stop.color, stop.opacity) : stop.color;
      grad.addColorStop(stop.position / 100, colorValue);
    });
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);
  canvas.toBlob((blob: Blob | null) => {
    if (!blob) return;
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  }, 'image/png');
}
export function exportCSS(css: string, filename = 'gradientor.css') {
  const wrapped = `body {\n  ${css.replace(/\n/g, '\n  ')}\n}`;
  const blob = new Blob([wrapped], { type: 'text/css' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}
