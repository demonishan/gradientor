import React, { useState, useCallback, useRef } from 'react';
import { useDebounce } from '../helpers';
import { useClipboard } from '../modules';
import { generateShareLink, addFavorite, exportCSS, exportPNG, exportSVG, exportJSON } from '../modules';
import type { GradientConfig } from '../App';
import type { GradientShareConfig, GradientFavorite } from '../modules';
import { Box, Button, Checkbox, FormControlLabel, IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import TextField from '@mui/material/TextField';
interface OutputProps {
  gradient: GradientConfig;
}
const Output: React.FC<OutputProps & { showSnackbar: (msg: string) => void }> = ({ gradient, showSnackbar }) => {
  const [maxCompatibility, setMaxCompatibility] = useState(false);
  const hexToRgba = (hex: string, opacity: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity.toFixed(1)})`;
  };
  const generateGradientCSS = useCallback(() => {
    const stops = gradient.colorStops
      .sort((a: GradientConfig[`colorStops`][number], b: GradientConfig[`colorStops`][number]) => a.position - b.position)
      .map((stop: GradientConfig[`colorStops`][number]) => {
        const colorValue = stop.opacity !== 1 ? hexToRgba(stop.color, stop.opacity) : stop.color;
        return `${colorValue} ${stop.position.toFixed(1)}%`;
      })
      .join(`, `);
    if (gradient.type === `linear`) {
      const prefix = gradient.repeating ? `repeating-linear-gradient` : `linear-gradient`;
      return `${prefix}(${gradient.angle}deg, ${stops})`;
    } else if (gradient.type === `radial` || gradient.type === `elliptical`) {
      let dir = gradient.radialDirection || `center`;
      if (dir === `center`) dir = `at center`;
      const size = gradient.radialSize && gradient.radialSize !== `None` ? gradient.radialSize : ``;
      const prefix = gradient.repeating ? `repeating-radial-gradient` : `radial-gradient`;
      const shape = gradient.type === `elliptical` ? `ellipse` : `circle`;
      if (size && dir.startsWith(`at `)) {
        return `${prefix}(${shape} ${size} ${dir}, ${stops})`;
      } else if (size) {
        return `${prefix}(${shape} ${size}, ${stops})`;
      } else if (dir.startsWith(`at `)) {
        return `${prefix}(${shape} ${dir}, ${stops})`;
      } else {
        return `${prefix}(${shape}, ${stops})`;
      }
    } else if (gradient.type === `conic`) {
      const pos = gradient.conicPosition || { x: 50, y: 50 };
      const prefix = gradient.repeating ? `repeating-conic-gradient` : `conic-gradient`;
      return `${prefix}(from ${gradient.angle}deg at ${pos.x}% ${pos.y}%, ${stops})`;
    }
    return ``;
  }, [gradient]);
  const addFavoriteButtonRef = useRef<HTMLButtonElement | null>(null);
  const handleAddFavorite = useDebounce(() => {
    addFavorite(gradient as GradientFavorite);
    showSnackbar(`Added to favorites!`);
  }, addFavoriteButtonRef);
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
  const copyToClipboard = useClipboard();
  const copyButtonRef = useRef<HTMLButtonElement | null>(null);
  const handleCopy = useDebounce(async () => {
    await copyToClipboard(generateFullCSS());
    showSnackbar(`CSS copied to clipboard!`);
  }, copyButtonRef);
  const shareButtonRef = useRef<HTMLButtonElement | null>(null);
  const handleShare = useDebounce(async () => {
    const link = generateShareLink(gradient as GradientShareConfig);
    await copyToClipboard(link);
    showSnackbar(`Shareable link copied to clipboard!`);
  }, shareButtonRef);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleExportCSS = () => {
    exportCSS(generateFullCSS());
    handleClose();
    showSnackbar(`CSS file exported!`);
  };
  const handleExportSVG = () => {
    exportSVG(generateGradientCSS());
    handleClose();
    showSnackbar(`SVG file exported!`);
  };
  const handleExportPNG = () => {
    exportPNG(gradient, hexToRgba);
    handleClose();
    showSnackbar(`PNG file exported!`);
  };
  const handleExportJSON = () => {
    exportJSON(gradient);
    handleClose();
    showSnackbar(`JSON file exported!`);
  };
  return (
    <>
      <TextField value={generateFullCSS()} multiline fullWidth label="CSS Code" rows={3} inputProps={{ readOnly: true, style: { fontSize: `0.875rem` } }} />
      <FormControlLabel control={<Checkbox checked={maxCompatibility} onChange={(e) => setMaxCompatibility(e.target.checked)} color="primary" />} label="Compatibility" />
      <Box display="flex" justifyContent="flex-end" mt={1.5} gap={1}>
        <Tooltip title="Add to favorites" placement="top">
          <IconButton color="inherit" component="button" onClick={handleAddFavorite} ref={addFavoriteButtonRef} aria-label="Add to favorites">
            <FavoriteBorderIcon />
          </IconButton>
        </Tooltip>
        <Button variant="text" color="inherit" onClick={handleShare} component="button" ref={shareButtonRef} aria-label="Copy shareable link">
          Share
        </Button>
        <Button variant="text" color="inherit" id="basic-button" aria-controls={open ? `basic-menu` : undefined} aria-haspopup="true" onClick={handleClick} aria-label="Export options">
          Export <KeyboardArrowDownIcon fontSize="small" />
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          slotProps={{
            list: {
              'aria-labelledby': 'basic-button',
            },
          }}
        >
          <MenuItem onClick={handleExportPNG}>PNG</MenuItem>
          <MenuItem onClick={handleExportSVG}>SVG</MenuItem>
          <MenuItem onClick={handleExportCSS}>CSS</MenuItem>
          <MenuItem onClick={handleExportJSON}>JSON</MenuItem>
        </Menu>
        <Button variant="outlined" onClick={handleCopy} component="button" ref={copyButtonRef} aria-label="Copy CSS to clipboard">
          Copy CSS
        </Button>
      </Box>
    </>
  );
};
export default Output;
