import type { GradientConfig } from '../App';
interface GradientPreviewProps {
  gradient: GradientConfig;
}
const generateGradientCSS = (gradient: GradientConfig): string => {
  const colorStops = gradient.colorStops
    .sort((a, b) => a.position - b.position)
    .map((stop) => `rgba(${parseInt(stop.color.slice(1, 3), 16)}, ${parseInt(stop.color.slice(3, 5), 16)}, ${parseInt(stop.color.slice(5, 7), 16)}, ${stop.opacity}) ${stop.position}%`)
    .join(', ');

  if (gradient.type === 'radial') {
    let dir = gradient.radialDirection || 'center';
    if (dir === 'center') dir = 'at center';
    const size = gradient.radialSize && gradient.radialSize !== 'None' ? gradient.radialSize : '';
    if (size && dir.startsWith('at ')) {
      return `radial-gradient(circle ${size} ${dir}, ${colorStops})`;
    } else if (size) {
      return `radial-gradient(circle ${size}, ${colorStops})`;
    } else if (dir.startsWith('at ')) {
      return `radial-gradient(circle ${dir}, ${colorStops})`;
    } else {
      return `radial-gradient(circle, ${colorStops})`;
    }
  }
  if (gradient.type === 'conic') {
    const pos = gradient.conicPosition || { x: 50, y: 50 };
    return `conic-gradient(from ${gradient.angle}deg at ${pos.x}% ${pos.y}%, ${colorStops})`;
  }
  return `linear-gradient(${gradient.angle}deg, ${colorStops})`;
};
const GradientPreview = ({ gradient }: GradientPreviewProps) => (
  <div className="gradient-preview">
    <div className="gradient-preview-display" style={{ background: generateGradientCSS(gradient) }} />
  </div>
);
export default GradientPreview;
