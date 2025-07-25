/**
 * ColorPicker component
 *
 * Allows editing color and opacity for a selected color stop using react-color-palette and MUI inputs.
 *
 * @param {ColorPickerProps} props - The props for the component.
 * @returns {JSX.Element} Color picker UI.
 */
import 'react-color-palette/dist/css/rcp.css';
import { ColorPicker as ReactColorPicker, useColor } from 'react-color-palette';
import { TextField, Grid, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import type { ColorStop } from '../modules';
import type { IColor } from 'react-color-palette';

/**
 * Props for ColorPicker component.
 * @property selectedStop - The selected color stop to edit.
 * @property onColorChange - Function to update color.
 * @property onOpacityChange - Function to update opacity.
 */
export interface ColorPickerProps {
  selectedStop: ColorStop | undefined;
  onColorChange: (color: string) => void;
  onOpacityChange: (opacity: number) => void;
}
export const ColorPicker: React.FC<ColorPickerProps> = ({ selectedStop, onColorChange, onOpacityChange }) => {
  const [color, setColor] = useColor('#ffffff');

  /**
   * Converts a hex color and alpha to IColor object for react-color-palette.
   * @param hex Hex color string.
   * @param alpha Opacity value (0-1).
   * @returns IColor object.
   */
  const hexToColor = (hex: string, alpha: number = 1): IColor => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const rNorm = r / 255, gNorm = g / 255, bNorm = b / 255;
    const max = Math.max(rNorm, gNorm, bNorm), min = Math.min(rNorm, gNorm, bNorm), diff = max - min;
    let h = 0, s = 0;
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
    return <Typography color="textSecondary">Select a color stop to edit its color</Typography>;
  return (
    <>
      <ReactColorPicker color={color} onChange={handleColorChange} height={180} />
      <TextField
        label="Hex"
        size="small"
        fullWidth
        value={color.hex}
        sx={{ mt: 3, mb: 2.5 }}
        onChange={e => {
          const hex = e.target.value;
          if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
            const newColor = hexToColor(hex, color.rgb.a);
            setColor(newColor);
            onColorChange(hex);
          }
        }}
      />
      <Grid container spacing={1}>
        {['r', 'g', 'b'].map(ch => (
          <Grid size={3} key={ch}>
            <TextField
              label={ch.toUpperCase()}
              type="number"
              size="small"
              fullWidth
              value={Math.round(color.rgb[ch as keyof typeof color.rgb])}
              onChange={e => {
                const val = Math.max(0, Math.min(255, parseInt(e.target.value) || 0));
                const rgb = ['r', 'g', 'b'].map(k => k === ch ? val : Math.round(color.rgb[k as keyof typeof color.rgb]));
                const hex = `#${rgb.map(x => x.toString(16).padStart(2, '0')).join('')}`;
                const newColor = hexToColor(hex, color.rgb.a);
                setColor(newColor);
                onColorChange(hex);
              }}
              inputProps={{ min: 0, max: 255, step: 1 }}
            />
          </Grid>
        ))}
        <Grid size={3}>
          <TextField
            label="A"
            type="number"
            variant="outlined"
            size="small"
            fullWidth
            value={Math.round(color.rgb.a * 100)}
            onChange={e => {
              const alpha = Math.max(0, Math.min(100, parseInt(e.target.value) || 100)) / 100;
              const newColor = { ...color, rgb: { ...color.rgb, a: alpha }, hsv: { ...color.hsv, a: alpha } };
              setColor(newColor);
              onOpacityChange(alpha);
            }}
            inputProps={{ min: 0, max: 100, step: 1 }}
          />
        </Grid>
      </Grid>
    </>
  );
};
