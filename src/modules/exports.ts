import type { GradientConfig } from '../App';

/**
 * Exports a CSS gradient as an SVG file and triggers a download.
 * @param gradientCSS CSS gradient string (e.g., `linear-gradient(...)`).
 */
export function exportSVG(gradientCSS: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><style>svg{background:${gradientCSS};}</style></svg>`;
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  const link = document.createElement(`a`);
  link.href = URL.createObjectURL(blob);
  link.download = `Gradientor ` + getTimestamp() + `.svg`;
  link.click();
  URL.revokeObjectURL(link.href);
}

/**
 * Exports a gradient as a PNG image and triggers a download.
 * @param gradient Gradient configuration object.
 * @param hexToRgba Function to convert hex color and opacity to RGBA string.
 * @param width Width of the PNG image (default: 1920).
 * @param height Height of the PNG image (default: 1080).
 */
export function exportPNG(gradient: GradientConfig, hexToRgba: (hex: string, opacity: number) => string, width = 1920, height = 1080) {
  const canvas = document.createElement(`canvas`);
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext(`2d`);
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
    const link = document.createElement(`a`);
    link.href = URL.createObjectURL(blob);
    link.download = `Gradientor ` + getTimestamp() + `.png`;
    link.click();
    URL.revokeObjectURL(link.href);
  }, `image/png`);
}

/**
 * Exports CSS code as a .css file and triggers a download.
 * @param css CSS string to export.
 */
export function exportCSS(css: string) {
  const wrapped = `body {\n  ${css.replace(/\n/g, `\n  `)}\n}`;
  const blob = new Blob([wrapped], { type: 'text/css' });
  const link = document.createElement(`a`);
  link.href = URL.createObjectURL(blob);
  link.download = `Gradientor ` + getTimestamp() + `.css`;
  link.click();
  URL.revokeObjectURL(link.href);
}

/**
 * Exports a gradient configuration object as a JSON file and triggers a download.
 * The exported JSON will not include the 'id' property in any color stop.
 * @param gradient Gradient configuration object to export.
 */
export function exportJSON(gradient: GradientConfig) {
  const filtered = {
    ...gradient,
    colorStops: gradient.colorStops.map((stop) => {
      const { id: _id, ...rest } = stop;
      void _id;
      return rest;
    }),
  };
  const json = JSON.stringify(filtered, null, 2);
  const blob = new Blob([json], { type: `application/json` });
  const link = document.createElement(`a`);
  link.href = URL.createObjectURL(blob);
  link.download = `Gradientor ` + getTimestamp() + `.json`;
  link.click();
  URL.revokeObjectURL(link.href);
}

/**
 * Returns the current timestamp in YYYY-MM-DD HH-mm-ss format.
 * @returns {string} Current timestamp.
 */
export function getTimestamp(): string {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}-${d.getMinutes()}-${d.getSeconds()}`;
}
