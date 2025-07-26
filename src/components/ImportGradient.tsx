import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, DialogContentText } from '@mui/material';
import React, { useState } from 'react';
import type { GradientConfig } from '../App';

/**
 * Props for the ImportGradient component.
 * @property open - Whether the dialog is open.
 * @property onClose - Callback for closing the dialog. Accepts optional error message.
 * @property onImport - Callback for importing a parsed gradient.
 */
interface ImportGradientProps {
  open: boolean;
  onClose: (errorMessage?: string) => void;
  onImport: (gradient: GradientConfig) => void;
}

/**
 * Parses a CSS gradient string and returns a GradientConfig object if valid.
 * Supports linear, radial, and conic gradients.
 * @param input - CSS gradient string to parse.
 * @returns GradientConfig object or null if parsing fails.
 */
const parseCSSGradient = (input: string): GradientConfig | null => {
  let cleaned = input.replace(/^[^:]*:/, ``).trim(); cleaned = cleaned.replace(/;$/, ``);
  const gradientTypeMatch = cleaned.match(/(linear|radial|conic)-gradient/i);
  if (!gradientTypeMatch) return null;
  const type = gradientTypeMatch[1].toLowerCase() as GradientConfig[`type`];
  const valueInsideGradient = /.*gradient\s*\(((?:\([^)]*\)|[^)(]*)*)\)/;
  const match = cleaned.match(valueInsideGradient);
  if (!match) return null;
  const content = match[1].trim(); let angle = 90; let colorStopsStr = content;
  switch (type) {
    case `linear`: {
      const angleMatch = content.match(/^([\d.]+)(deg|rad|turn|grad)\s*,\s*(.+)$/);
      if (angleMatch) {
        const val = parseFloat(angleMatch[1]);
        switch (angleMatch[2]) {
          case `deg`: angle = val; break;
          case `rad`: angle = val * (180 / Math.PI); break;
          case `turn`: angle = val * 360; break;
          case `grad`: angle = (val / 400) * 360; break;
        }
        colorStopsStr = angleMatch[3];
      } else {
        const dirMatch = content.match(/^to\s+(left|right|top|bottom)(?:\s+(left|right|top|bottom))?\s*,\s*(.+)$/);
        if (dirMatch) {
          const dir1 = dirMatch[1]; const dir2 = dirMatch[2]; colorStopsStr = dirMatch[3];
          const dirMap = { right: 90, left: 270, top: 0, bottom: 180 };
          if (dir2) {
            if ((dir1 === `top` && dir2 === `right`) || (dir1 === `right` && dir2 === `top`)) angle = 45;
            else if ((dir1 === `top` && dir2 === `left`) || (dir1 === `left` && dir2 === `top`)) angle = 315;
            else if ((dir1 === `bottom` && dir2 === `right`) || (dir1 === `right` && dir2 === `bottom`)) angle = 135;
            else if ((dir1 === `bottom` && dir2 === `left`) || (dir1 === `left` && dir2 === `bottom`)) angle = 225;
          } else angle = dirMap[dir1 as keyof typeof dirMap];
        }
      }
      break;
    }
    case `conic`: {
      const conicMatch = content.match(/^from\s+([\d.]+)(deg|rad|turn|grad)(?:\s+at\s+([\d.]+%?)\s+([\d.]+%?))?\s*,\s*(.+)$/);
      if (conicMatch) {
        const val = parseFloat(conicMatch[1]);
        switch (conicMatch[2]) {
          case `deg`: angle = val; break;
          case `rad`: angle = val * (180 / Math.PI); break;
          case `turn`: angle = val * 360; break;
          case `grad`: angle = (val / 400) * 360; break;
        }
        colorStopsStr = conicMatch[5];
      } else {
        const angleMatch = content.match(/^from\s+([\d.]+)deg\s*,\s*(.+)$/);
        if (angleMatch) { angle = parseFloat(angleMatch[1]); colorStopsStr = angleMatch[2]; }
      }
      break;
    }
    case `radial`: {
      const shapePosMatch = content.match(/^([a-zA-Z\s]+at\s+[a-zA-Z\s0-9%]+),\s*(.+)$/);
      if (shapePosMatch) colorStopsStr = shapePosMatch[2];
      break;
    }
    default: break;
  }
  const splitElements = /(?:[^)(,]+|\([^)(]+\))+/g;
  const stopsArr = colorStopsStr.match(splitElements) || [];

  /**
   * Parses a color stop from the gradient string.
   * @param stop - Color stop string.
   * @param idx - Index of the color stop.
   * @returns Color stop object with color, position, opacity, and id.
  */
  const colorStops = stopsArr.map((stop, idx) => {
    const colorMatch = stop.match(/#[0-9a-fA-F]{3,8}|rgba?\([^)]*\)|hsla?\([^)]*\)|[a-zA-Z]+/);
    const color = colorMatch ? colorMatch[0] : stop.trim().split(/\s+/)[0];
    const posMatches = stop.match(/([\d.]+%)/g);
    let position = idx * (100 / (stopsArr.length - 1));
    if (posMatches && posMatches.length > 0) position = parseFloat(posMatches[0]);
    return { color, position, opacity: 1, id: String(idx + 1) };
  });
  return { type, angle, repeating: false, colorStops };
};

/**
 * ImportGradient component for importing CSS gradients via a dialog popup.
 * Provides input field, error handling, and accessibility features.
 * @param open - Whether the dialog is open.
 * @param onClose - Callback for closing the dialog.
 * @param onImport - Callback for importing a parsed gradient.
 */
const ImportGradient: React.FC<ImportGradientProps> = ({ open, onClose, onImport }) => {
  const [input, setInput] = useState(``);
  const handleImport = () => {
    try {
      const parsed = parseCSSGradient(input);
      if (!parsed) { setInput(``); onClose(`Gradient import failed.`); return; }
      onImport(parsed); setInput(``); onClose();
    } catch { setInput(``); onClose(`Gradient import failed.`); }
  };
  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={() => onClose()} aria-label="Import Gradient Popup">
      <DialogTitle>Import Gradient</DialogTitle>
      <DialogContent sx={{ paddingBottom: 0 }}>
        <DialogContentText variant="body2" sx={{ marginBottom: 2 }}>
          Paste CSS gradient code below to import. Supported formats: linear, radial, conic, elliptical.
        </DialogContentText>
        <TextField autoFocus label="CSS Gradient" type="text" fullWidth multiline minRows={3} maxRows={5} value={input} onChange={e => setInput(e.target.value)} aria-label="CSS Gradient Input" />
      </DialogContent>
      <DialogActions sx={{ padding: 3 }}>
        <Button color="inherit" onClick={() => onClose()} aria-label="Cancel Import">Cancel</Button>
        <Button color="inherit" onClick={handleImport} variant="outlined" aria-label="Import Gradient">Import</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImportGradient;
