import React, { useEffect } from 'react';
import { ColorPicker as ReactColorPicker, useColor } from 'react-color-palette';
import type { IColor } from 'react-color-palette';
import 'react-color-palette/dist/css/rcp.css';
import type { ColorStop } from '../App';
import { TextField, Grid } from '@mui/material';

interface ColorPickerProps {
  selectedStop: ColorStop | undefined;
  onColorChange: (color: string) => void;
  onOpacityChange: (opacity: number) => void;
}
const ColorPicker: React.FC<ColorPickerProps> = ({ selectedStop, onColorChange, onOpacityChange }) => {
  const [color, setColor] = useColor('#ffffff');
  const hexToColor = (hex: string, alpha: number = 1): IColor => {
    const r = parseInt(hex.slice(1, 3), 16),
      g = parseInt(hex.slice(3, 5), 16),
      b = parseInt(hex.slice(5, 7), 16);
    const rNorm = r / 255,
      gNorm = g / 255,
      bNorm = b / 255;
    const max = Math.max(rNorm, gNorm, bNorm),
      min = Math.min(rNorm, gNorm, bNorm),
      diff = max - min;
    let h = 0,
      s = 0;
    const v = max;
    if (diff !== 0) {
      s = diff / max;
      if (max === rNorm) h = ((gNorm - bNorm) / diff) % 6;
      else if (max === gNorm) h = (bNorm - rNorm) / diff + 2;
      else h = (rNorm - gNorm) / diff + 4;
      h *= 60;
      if (h < 0) h += 360;
    }
    return { hex, rgb: { r, g, b, a: alpha }, hsv: { h, s: s * 100, v: v * 100, a: alpha } };
  };
  useEffect(() => {
    if (selectedStop) setColor(hexToColor(selectedStop.color, selectedStop.opacity));
  }, [selectedStop, setColor]);
  const handleColorChange = (newColor: IColor) => {
    setColor(newColor);
    onColorChange(newColor.hex);
    onOpacityChange(newColor.rgb.a);
  };
  if (!selectedStop)
    return (
      <div className="color-picker-container">
        <div className="no-selection">Select a color stop to edit its color</div>
      </div>
    );
  return (
    <div className="color-picker-container">
      <div className="color-picker-wrapper">
        <ReactColorPicker color={color} onChange={handleColorChange} height={180} />
        <TextField
          label="HEX"
          size="small"
          fullWidth
          value={color.hex}
          sx={{ mt: 1.5, mb: 1 }}
          onChange={(e) => {
            const hex = e.target.value;
            if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
              const newColor = hexToColor(hex, color.rgb.a);
              setColor(newColor);
              onColorChange(hex);
            }
          }}
        />
        <Grid container spacing={2}>
          <Grid size={3}>
            <TextField
              label="R"
              type="number"
              size="small"
              fullWidth
              value={Math.round(color.rgb.r)}
              onChange={(e) => {
                const r = Math.max(0, Math.min(255, parseInt(e.target.value) || 0));
                const hex = `#${r.toString(16).padStart(2, '0')}${Math.round(color.rgb.g).toString(16).padStart(2, '0')}${Math.round(color.rgb.b).toString(16).padStart(2, '0')}`;
                const newColor = hexToColor(hex, color.rgb.a);
                setColor(newColor);
                onColorChange(hex);
              }}
              inputProps={{ min: 0, max: 255, step: 1 }}
            />
          </Grid>
          <Grid size={3}>
            <TextField
              label="G"
              type="number"
              size="small"
              fullWidth
              value={Math.round(color.rgb.g)}
              onChange={(e) => {
                const g = Math.max(0, Math.min(255, parseInt(e.target.value) || 0));
                const hex = `#${Math.round(color.rgb.r).toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${Math.round(color.rgb.b).toString(16).padStart(2, '0')}`;
                const newColor = hexToColor(hex, color.rgb.a);
                setColor(newColor);
                onColorChange(hex);
              }}
              inputProps={{ min: 0, max: 255, step: 1 }}
            />
          </Grid>
          <Grid size={3}>
            <TextField
              label="B"
              type="number"
              size="small"
              fullWidth
              value={Math.round(color.rgb.b)}
              onChange={(e) => {
                const b = Math.max(0, Math.min(255, parseInt(e.target.value) || 0));
                const hex = `#${Math.round(color.rgb.r).toString(16).padStart(2, '0')}${Math.round(color.rgb.g).toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
                const newColor = hexToColor(hex, color.rgb.a);
                setColor(newColor);
                onColorChange(hex);
              }}
              inputProps={{ min: 0, max: 255, step: 1 }}
            />
          </Grid>
          <Grid size={3}>
            <TextField
              label="A"
              type="number"
              variant="outlined"
              size="small"
              fullWidth
              value={Math.round(color.rgb.a * 100)}
              onChange={(e) => {
                const alpha = Math.max(0, Math.min(100, parseInt(e.target.value) || 100)) / 100;
                const newColor = { ...color, rgb: { ...color.rgb, a: alpha }, hsv: { ...color.hsv, a: alpha } };
                setColor(newColor);
                onOpacityChange(alpha);
              }}
              inputProps={{ min: 0, max: 100, step: 1 }}
            />
          </Grid>
        </Grid>
      </div>
    </div>
  );
};
export default ColorPicker;
