/**
 * ColorStops component displays and manages a list of gradient color stops.
 * @component
 * @param {ColorStop[]} colorStops Array of color stops.
 * @param {string} selectedStopId ID of the selected color stop.
 * @param {'HEX' | 'RGBA' | 'HSL'} colorMode Current color mode.
 * @param {(id: string) => void} onStopSelect Callback to select a color stop.
 * @param {(id: string, updates: Partial<ColorStop>) => void} onUpdateStop Callback to update a color stop.
 * @param {(id: string) => void} onDeleteStop Callback to delete a color stop.
 * @returns {JSX.Element}
 */
import React from 'react';
import { Box, TextField, IconButton, Radio, RadioGroup, Tooltip } from '@mui/material';
import { hexToRgba } from '../helpers';
import { visuallyHidden } from '@mui/utils';
import BackspaceTwoToneIcon from '@mui/icons-material/BackspaceTwoTone';
import type { ColorStop } from '../modules';

interface ColorStopsProps {
  colorStops: ColorStop[];
  selectedStopId: string;
  colorMode: 'HEX' | 'RGBA' | 'HSL';
  onStopSelect: (id: string) => void;
  onUpdateStop: (id: string, updates: Partial<ColorStop>) => void;
  onDeleteStop: (id: string) => void;
}

const getColorLabel = (mode: 'HEX' | 'RGBA' | 'HSL') => (mode === 'HEX' ? 'Hex' : mode === 'RGBA' ? 'RGBA' : 'HSL');
const ColorStops: React.FC<ColorStopsProps> = ({ colorStops, selectedStopId, colorMode, onStopSelect, onUpdateStop, onDeleteStop }) => {
  const sortedStops = [...colorStops].sort((a, b) => a.position - b.position);
  const getDisplayColor = (color: string) => (colorMode === 'RGBA' && /^#/.test(color) ? hexToRgba(color) : color);
  const handlePositionChange = (id: string, value: string) => {
    const position = parseFloat(value);
    if (!isNaN(position)) onUpdateStop(id, { position: Math.round(Math.max(0, Math.min(100, position)) * 10) / 10 });
  };
  return (
    <RadioGroup sx={{ display: 'flex', flexDirection: 'column', gap: 1.72 }}>
      {sortedStops.map((stop) => (
        <Box key={stop.id} display="flex" alignItems="center" gap={1}>
          <label style={visuallyHidden} htmlFor={`color-stop-label-${stop.id}`}>
            Select color stop {stop.id}
          </label>
          <Radio id={`color-stop-label-${stop.id}`} checked={selectedStopId === stop.id} onChange={() => onStopSelect(stop.id)} aria-labelledby={`color-stop-label-${stop.id}`} sx={{ borderRadius: `4px`, p: 1, backgroundColor: stop.color }} />
          <TextField size="small" label={getColorLabel(colorMode)} value={getDisplayColor(stop.color)} InputProps={{ readOnly: true }} onClick={(e) => e.stopPropagation()} sx={{ flexGrow: 1 }} />
          <TextField label="Position" size="small" type="number" value={stop.position.toFixed(1)} onChange={(e) => handlePositionChange(stop.id, e.target.value)} onClick={(e) => e.stopPropagation()} sx={{ width: '8rem' }} />
          {colorStops.length > 2 && (
            <Tooltip title="Delete color stop" placement="top">
              <IconButton size="small" onClick={() => onDeleteStop(stop.id)} aria-label="Delete color stop">
                <BackspaceTwoToneIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      ))}
    </RadioGroup>
  );
};
export default ColorStops;
