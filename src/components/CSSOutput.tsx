import { generateShareLink } from '../modules/share';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import React, { useState, useCallback } from 'react';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import type { GradientConfig } from '../App';
import type { GradientShareConfig } from '../modules/share';
import useSnackbar from '../helpers/useSnackbar';
import { Box } from '@mui/material';
interface CSSOutputProps {
  gradient: GradientConfig;
}
const CSSOutput: React.FC<CSSOutputProps> = ({ gradient }) => {
  const [maxCompatibility, setMaxCompatibility] = useState(false);
  const hexToRgba = (hex: string, opacity: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity.toFixed(1)})`;
  };
  const generateGradientCSS = useCallback(() => {
    const stops = gradient.colorStops
      .sort((a, b) => a.position - b.position)
      .map((stop) => {
        const colorValue = stop.opacity !== 1 ? hexToRgba(stop.color, stop.opacity) : stop.color;
        return `${colorValue} ${stop.position.toFixed(1)}%`;
      })
      .join(', ');
    if (gradient.type === 'linear') {
      const prefix = gradient.repeating ? 'repeating-linear-gradient' : 'linear-gradient';
      return `${prefix}(${gradient.angle}deg, ${stops})`;
    } else if (gradient.type === 'radial' || gradient.type === 'elliptical') {
      let dir = gradient.radialDirection || 'center';
      if (dir === 'center') dir = 'at center';
      const size = gradient.radialSize && gradient.radialSize !== 'None' ? gradient.radialSize : '';
      const prefix = gradient.repeating ? 'repeating-radial-gradient' : 'radial-gradient';
      const shape = gradient.type === 'elliptical' ? 'ellipse' : 'circle';
      if (size && dir.startsWith('at ')) {
        return `${prefix}(${shape} ${size} ${dir}, ${stops})`;
      } else if (size) {
        return `${prefix}(${shape} ${size}, ${stops})`;
      } else if (dir.startsWith('at ')) {
        return `${prefix}(${shape} ${dir}, ${stops})`;
      } else {
        return `${prefix}(${shape}, ${stops})`;
      }
    } else if (gradient.type === 'conic') {
      const pos = gradient.conicPosition || { x: 50, y: 50 };
      const prefix = gradient.repeating ? 'repeating-conic-gradient' : 'conic-gradient';
      return `${prefix}(from ${gradient.angle}deg at ${pos.x}% ${pos.y}%, ${stops})`;
    }
    return '';
  }, [gradient]);
  const generateFullCSS = useCallback(() => {
    const gradientCSS = generateGradientCSS();
    if (maxCompatibility) {
      const fallbackColor = gradient.colorStops.sort((a, b) => a.position - b.position)[0].color;
      return `background: ${fallbackColor};
background: -webkit-${gradientCSS};
background: -moz-${gradientCSS};
background: -o-${gradientCSS};
background: ${gradientCSS};`;
    } else {
      return `background: ${gradientCSS};`;
    }
  }, [generateGradientCSS, maxCompatibility, gradient.colorStops]);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generateFullCSS());
      showSnackbar('CSS copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };
  const [snackbarOpen, snackbarMsg, showSnackbar, hideSnackbar] = useSnackbar();
  const handleShare = async () => {
    try {
      const link = generateShareLink(gradient as GradientShareConfig);
      await navigator.clipboard.writeText(link);
      showSnackbar('Shareable link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy share link:', err);
    }
  };
  return (
    <>
      <Snackbar open={snackbarOpen} autoHideDuration={2000} onClose={hideSnackbar} message={snackbarMsg} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }} />
      <TextField value={generateFullCSS()} multiline fullWidth label="CSS Code" maxRows={3} inputProps={{ readOnly: true, style: { fontFamily: 'monospace' } }} />
      <Box display="flex" alignItems="center" mt={1.5} gap={1}>
        <FormControlLabel control={<Checkbox checked={maxCompatibility} onChange={(e) => setMaxCompatibility(e.target.checked)} color="primary" />} label="Max compatibility" />
        <Button variant="text" color="primary" onClick={handleShare} sx={{ ml: 'auto' }}>
          Share
        </Button>
        <Button variant="contained" color="primary" onClick={handleCopy}>
          Copy CSS
        </Button>
      </Box>
    </>
  );
};
export default CSSOutput;
