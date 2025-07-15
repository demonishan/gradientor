import React, { useEffect } from 'react';
import { ColorPicker as ReactColorPicker, useColor } from 'react-color-palette';
import type { IColor } from 'react-color-palette';
import 'react-color-palette/dist/css/rcp.css';
import type { ColorStop } from '../App';
import './ColorPicker.css';

interface ColorPickerProps {
  selectedStop: ColorStop | undefined;
  onColorChange: (color: string) => void;
  onOpacityChange: (opacity: number) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ selectedStop, onColorChange, onOpacityChange }) => {
  const [color, setColor] = useColor('#ffffff');

  const hexToColor = (hex: string, alpha: number = 1): IColor => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    // Convert RGB to HSV
    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;

    const max = Math.max(rNorm, gNorm, bNorm);
    const min = Math.min(rNorm, gNorm, bNorm);
    const diff = max - min;

    let h = 0;
    let s = 0;
    const v = max;

    if (diff !== 0) {
      s = diff / max;
      if (max === rNorm) {
        h = ((gNorm - bNorm) / diff) % 6;
      } else if (max === gNorm) {
        h = (bNorm - rNorm) / diff + 2;
      } else {
        h = (rNorm - gNorm) / diff + 4;
      }
      h *= 60;
      if (h < 0) h += 360;
    }

    return {
      hex,
      rgb: { r, g, b, a: alpha },
      hsv: { h, s: s * 100, v: v * 100, a: alpha },
    };
  };

  useEffect(() => {
    if (selectedStop) {
      const newColor = hexToColor(selectedStop.color, selectedStop.opacity);
      setColor(newColor);
    }
  }, [selectedStop, setColor]);

  const handleColorChange = (newColor: IColor) => {
    setColor(newColor);
    onColorChange(newColor.hex);
    onOpacityChange(newColor.rgb.a);
  };

  if (!selectedStop) {
    return (
      <div className="color-picker-container">
        <div className="no-selection">Select a color stop to edit its color</div>
      </div>
    );
  }

  return (
    <div className="color-picker-container">
      <div className="color-picker-wrapper">
        <ReactColorPicker color={color} onChange={handleColorChange} height={180} />
        <div className="color-inputs">
          <div className="color-input-group">
            <div className="input-wrapper">
              <span className="input-label">HEX</span>
              <input
                type="text"
                value={color.hex}
                onChange={(e) => {
                  const hex = e.target.value;
                  if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
                    const newColor = hexToColor(hex, color.rgb.a);
                    setColor(newColor);
                    onColorChange(hex);
                  }
                }}
                className="hex-input"
              />
            </div>
          </div>
          <div className="rgb-inputs">
            <div className="rgb-input-group">
              <div className="input-wrapper">
                <span className="input-label">R</span>
                <input
                  type="number"
                  value={Math.round(color.rgb.r)}
                  onChange={(e) => {
                    const r = Math.max(0, Math.min(255, parseInt(e.target.value) || 0));
                    const hex = `#${r.toString(16).padStart(2, '0')}${Math.round(color.rgb.g).toString(16).padStart(2, '0')}${Math.round(color.rgb.b).toString(16).padStart(2, '0')}`;
                    const newColor = hexToColor(hex, color.rgb.a);
                    setColor(newColor);
                    onColorChange(hex);
                  }}
                  min="0"
                  max="255"
                  step="1"
                  className="rgb-input"
                />
              </div>
            </div>
            <div className="rgb-input-group">
              <div className="input-wrapper">
                <span className="input-label">G</span>
                <input
                  type="number"
                  value={Math.round(color.rgb.g)}
                  onChange={(e) => {
                    const g = Math.max(0, Math.min(255, parseInt(e.target.value) || 0));
                    const hex = `#${Math.round(color.rgb.r).toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${Math.round(color.rgb.b).toString(16).padStart(2, '0')}`;
                    const newColor = hexToColor(hex, color.rgb.a);
                    setColor(newColor);
                    onColorChange(hex);
                  }}
                  min="0"
                  max="255"
                  step="1"
                  className="rgb-input"
                />
              </div>
            </div>
            <div className="rgb-input-group">
              <div className="input-wrapper">
                <span className="input-label">B</span>
                <input
                  type="number"
                  value={Math.round(color.rgb.b)}
                  onChange={(e) => {
                    const b = Math.max(0, Math.min(255, parseInt(e.target.value) || 0));
                    const hex = `#${Math.round(color.rgb.r).toString(16).padStart(2, '0')}${Math.round(color.rgb.g).toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
                    const newColor = hexToColor(hex, color.rgb.a);
                    setColor(newColor);
                    onColorChange(hex);
                  }}
                  min="0"
                  max="255"
                  step="1"
                  className="rgb-input"
                />
              </div>
            </div>
            <div className="rgb-input-group">
              <div className="input-wrapper">
                <span className="input-label">A</span>
                <input
                  type="number"
                  value={Math.round(color.rgb.a * 100)}
                  onChange={(e) => {
                    const alpha = Math.max(0, Math.min(100, parseInt(e.target.value) || 100)) / 100;
                    const newColor = { ...color, rgb: { ...color.rgb, a: alpha }, hsv: { ...color.hsv, a: alpha } };
                    setColor(newColor);
                    onOpacityChange(alpha);
                  }}
                  min="0"
                  max="100"
                  step="1"
                  className="rgb-input"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;
