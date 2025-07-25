/**
 * GradientPreview component
 *
 * Renders a preview box with the given gradient configuration.
 * Supports linear, radial, elliptical, and conic gradients with color stops and opacity.
 *
 * @param {GradientPreviewProps} props - The props for the component.
 * @returns {JSX.Element} A Box with the gradient background.
 */
import { Box } from '@mui/material';
import type { GradientConfig, ColorStop } from '../App';

/**
 * Props for GradientPreview.
 * @property gradient - Gradient configuration object.
*/
interface GradientPreviewProps {
  gradient: GradientConfig;
}
const GradientPreview: React.FC<GradientPreviewProps> = ({ gradient }) => {
  const stops = gradient.colorStops
    .sort((a: ColorStop, b: ColorStop) => a.position - b.position)
    .map((s: ColorStop) => `rgba(${parseInt(s.color.slice(1, 3), 16)},${parseInt(s.color.slice(3, 5), 16)},${parseInt(s.color.slice(5, 7), 16)},${s.opacity}) ${s.position}%`)
    .join(', ');
  let bg = '';
  if (gradient.type === 'radial' || gradient.type === 'elliptical') {
    let dir = gradient.radialDirection || 'center';
    if (dir === 'center') dir = 'at center';
    const size = gradient.radialSize && gradient.radialSize !== 'None' ? gradient.radialSize : '';
    const prefix = gradient.repeating ? 'repeating-radial-gradient' : 'radial-gradient';
    const shape = gradient.type === 'elliptical' ? 'ellipse' : 'circle';
    if (size && dir.startsWith('at ')) bg = `${prefix}(${shape} ${size} ${dir}, ${stops})`;
    else if (size) bg = `${prefix}(${shape} ${size}, ${stops})`;
    else if (dir.startsWith('at ')) bg = `${prefix}(${shape} ${dir}, ${stops})`;
    else bg = `${prefix}(${shape}, ${stops})`;
  } else if (gradient.type === 'conic') {
    const pos = gradient.conicPosition || { x: 50, y: 50 };
    const prefix = gradient.repeating ? 'repeating-conic-gradient' : 'conic-gradient';
    bg = `${prefix}(from ${gradient.angle}deg at ${pos.x}% ${pos.y}%, ${stops})`;
  } else {
    const prefix = gradient.repeating ? 'repeating-linear-gradient' : 'linear-gradient';
    bg = `${prefix}(${gradient.angle}deg, ${stops})`;
  }
  return <Box sx={{ m: 2, borderRadius: 1, height: '10rem', background: bg }} />;
};
export default GradientPreview;
