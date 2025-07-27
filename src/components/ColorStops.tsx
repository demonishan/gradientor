/**
 * ColorStops component
 *
 * Renders a list of color stops with controls for selection, editing, and deletion.
 *
 * @param {ColorStopsProps} props - The props for the component.
 * @returns {JSX.Element} Color stops UI.
 */
import { Box, TextField, IconButton, Radio, RadioGroup, Tooltip } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import BackspaceTwoToneIcon from '@mui/icons-material/BackspaceTwoTone';
import React from 'react';
import type { ColorStop } from '../App';

/**
 * Props for ColorStops component.
 * @property colorStops - Array of color stops.
 * @property selectedStopId - ID of the selected color stop.
 * @property onStopSelect - Function to select a color stop.
 * @property onUpdateStop - Function to update a color stop's properties.
 * @property onDeleteStop - Function to delete a color stop.
*/
interface ColorStopsProps {
  colorStops: ColorStop[];
  selectedStopId: string;
  onStopSelect: (id: string) => void;
  onUpdateStop: (id: string, updates: Partial<ColorStop>) => void;
  onDeleteStop: (id: string) => void;
}
const ColorStops: React.FC<ColorStopsProps> = ({ colorStops, selectedStopId, onStopSelect, onUpdateStop, onDeleteStop }) => {
  const sortedStops = [...colorStops].sort((a, b) => a.position - b.position);

  /**
   * Handles position change for a color stop.
   */
  const handlePositionChange = (id: string, value: string) => {
    const position = parseFloat(value);
    if (!isNaN(position)) {
      onUpdateStop(id, { position: Math.round(Math.max(0, Math.min(100, position)) * 10) / 10 });
    }
  };
  return (
    <RadioGroup sx={{ display: `flex`, flexDirection: `column`, gap: 1.75 }}>
      {sortedStops.map(stop => (
        <Box key={stop.id} display="flex" alignItems="center" gap={1}>
          <label style={visuallyHidden} htmlFor={`color-stop-label-${stop.id}`}>Select color stop {stop.id}</label>
          <Radio
            id={`color-stop-label-${stop.id}`}
            checked={selectedStopId === stop.id}
            onChange={() => onStopSelect(stop.id)}
            aria-labelledby={`color-stop-label-${stop.id}`}
            sx={{ borderRadius: `4px`, p: 1, backgroundColor: stop.color }}
          />
          <TextField
            label="Hex"
            size="small"
            value={stop.color.toUpperCase()}
            onChange={e => onUpdateStop(stop.id, { color: e.target.value })}
            onClick={e => e.stopPropagation()}
            sx={{ flexGrow: 1 }}
          />
          <TextField
            label="Position"
            size="small"
            type="number"
            value={stop.position.toFixed(1)}
            onChange={e => handlePositionChange(stop.id, e.target.value)}
            onClick={e => e.stopPropagation()}
            sx={{ flexGrow: 1 }}
          />
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
