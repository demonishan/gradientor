import type { GradientConfig } from '../App';
interface GradientPreviewProps {
  gradient: GradientConfig;
}
const generateGradientCSS = (gradient: GradientConfig): string => {
  const colorStops = gradient.colorStops
    .sort((a, b) => a.position - b.position)
    .map((stop) => `rgba(${parseInt(stop.color.slice(1, 3), 16)}, ${parseInt(stop.color.slice(3, 5), 16)}, ${parseInt(stop.color.slice(5, 7), 16)}, ${stop.opacity}) ${stop.position}%`)
    .join(', ');

  if (gradient.type === 'radial' || gradient.type === 'elliptical') {
    let dir = gradient.radialDirection || 'center';
    if (dir === 'center') dir = 'at center';
    const size = gradient.radialSize && gradient.radialSize !== 'None' ? gradient.radialSize : '';
    const prefix = gradient.repeating ? 'repeating-radial-gradient' : 'radial-gradient';
    const shape = gradient.type === 'elliptical' ? 'ellipse' : 'circle';
    if (size && dir.startsWith('at ')) {
      return `${prefix}(${shape} ${size} ${dir}, ${colorStops})`;
    } else if (size) {
      return `${prefix}(${shape} ${size}, ${colorStops})`;
    } else if (dir.startsWith('at ')) {
      return `${prefix}(${shape} ${dir}, ${colorStops})`;
    } else {
      return `${prefix}(${shape}, ${colorStops})`;
    }
  }
  if (gradient.type === 'conic') {
    const pos = gradient.conicPosition || { x: 50, y: 50 };
    const prefix = gradient.repeating ? 'repeating-conic-gradient' : 'conic-gradient';
    return `${prefix}(from ${gradient.angle}deg at ${pos.x}% ${pos.y}%, ${colorStops})`;
  }
  const prefix = gradient.repeating ? 'repeating-linear-gradient' : 'linear-gradient';
  return `${prefix}(${gradient.angle}deg, ${colorStops})`;
};
const GradientPreview = ({ gradient }: GradientPreviewProps) => (
  <div className="gradient-preview">
    <div className="gradient-preview-display" style={{ background: generateGradientCSS(gradient) }} />
  </div>
);
export default GradientPreview;
