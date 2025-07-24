export const hexToRgba = (hex: string, opacity: number): string => `rgba(${parseInt(hex.slice(1, 3), 16)}, ${parseInt(hex.slice(3, 5), 16)}, ${parseInt(hex.slice(5, 7), 16)}, ${opacity.toFixed(1)})`;
