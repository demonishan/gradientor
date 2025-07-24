// Minimal helper to clamp a value between min and max
export const clamp = (value: number, min: number, max: number): number => Math.max(min, Math.min(max, value));
