import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import type { ColorStop } from '../App';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
interface ColorStopsListProps {
  colorStops: ColorStop[];
  selectedStopId: string;
  onStopSelect: (id: string) => void;
  onUpdateStop: (id: string, updates: Partial<ColorStop>) => void;
  onDeleteStop: (id: string) => void;
}
const ColorStopsList: React.FC<ColorStopsListProps> = ({ colorStops, selectedStopId, onStopSelect, onUpdateStop, onDeleteStop }) => {
  const sortedStops = [...colorStops].sort((a, b) => a.position - b.position);
  const handlePositionChange = (id: string, value: string) => {
    const position = parseFloat(value);
    if (!isNaN(position)) {
      const clamped = Math.max(0, Math.min(100, position));
      const rounded = parseFloat(clamped.toFixed(1));
      onUpdateStop(id, { position: rounded });
    }
  };
  return (
    <RadioGroup value={selectedStopId} onChange={(_, id) => id && onStopSelect(id)}>
      {sortedStops.map((stop) => (
        <Box key={stop.id} display="flex" alignItems="center" gap={1} py={1}>
          <Radio checked={selectedStopId === stop.id} value={stop.id} onChange={() => onStopSelect(stop.id)} sx={{ borderRadius: `4px`, width: 40, height: 40, bgcolor: stop.color }} />
          <TextField label="Hex" size="small" value={stop.color.toUpperCase()} onChange={(e) => onUpdateStop(stop.id, { color: e.target.value })} onClick={(e) => e.stopPropagation()} />
          <TextField label="Position" size="small" type="number" value={stop.position.toFixed(1)} onChange={(e) => handlePositionChange(stop.id, e.target.value)} onClick={(e) => e.stopPropagation()} />
          {colorStops.length > 2 && (
            <IconButton
              size="small"
              title="Delete color stop"
              sx={{ p: 0 }}
              onClick={(e) => {
                e.stopPropagation();
                onDeleteStop(stop.id);
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      ))}
    </RadioGroup>
  );
};
export default ColorStopsList;
