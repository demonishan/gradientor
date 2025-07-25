import type { GradientConfig } from '../App';

/**
 * Exports a CSS gradient as an SVG file and triggers a download.
 * @param gradientCSS CSS gradient string (e.g., 'linear-gradient(...)').
 * @param filename Name of the SVG file to download (default: 'gradientor.svg').
 */
export function exportSVG(gradientCSS: string, filename = 'gradientor.svg') {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><style>svg{background:${gradientCSS};}</style></svg>`;
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

/**
 * Exports a gradient as a PNG image and triggers a download.
 * @param gradient Gradient configuration object.
 * @param hexToRgba Function to convert hex color and opacity to RGBA string.
 * @param filename Name of the PNG file to download (default: 'gradientor.png').
 * @param width Width of the PNG image (default: 1920).
 * @param height Height of the PNG image (default: 1080).
 */
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

/**
 * Exports CSS code as a .css file and triggers a download.
 * @param css CSS string to export.
 * @param filename Name of the CSS file to download (default: 'gradientor.css').
 */
export function exportCSS(css: string, filename = 'gradientor.css') {
  const wrapped = `body {\n  ${css.replace(/\n/g, '\n  ')}\n}`;
  const blob = new Blob([wrapped], { type: 'text/css' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}
