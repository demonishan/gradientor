import React, { useState, useEffect } from 'react'
import type { ColorStop } from '../App'
import './ColorPicker.css'
interface ColorPickerProps {
  selectedStop: ColorStop | undefined
  onColorChange: (color: string) => void
}
const ColorPicker: React.FC<ColorPickerProps> = ({ selectedStop, onColorChange }) => {
  const [color, setColor] = useState('#ffffff')
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  }
  useEffect(() => {
    if (selectedStop) setColor(selectedStop.color)
  }, [selectedStop])
  const handleColorChange = (newColor: string) => {
    setColor(newColor)
    onColorChange(newColor)
  }
  if (!selectedStop) {
    return (
      <div className="color-picker-container"><div className="no-selection">Select a color stop to edit its color</div></div>
    )
  }
  return (
    <div className="color-picker-container">
      <div className="color-picker-large">
        <input type="color" value={color} onChange={e => handleColorChange(e.target.value)} className="color-input-large" />
      </div>
      <div className="color-value-display">
        <div className="rgb-values">
          <div className="rgb-group">
            <label>R</label>
            <span>{hexToRgb(color)?.r || 0}</span>
          </div>
          <div className="rgb-group">
            <label>G</label>
            <span>{hexToRgb(color)?.g || 0}</span>
          </div>
          <div className="rgb-group">
            <label>B</label>
            <span>{hexToRgb(color)?.b || 0}</span>
          </div>
          <div className="rgb-group">
            <label>A</label>
            <span>100</span>
          </div>
        </div>
      </div>
    </div>
  )
}
export default ColorPicker
