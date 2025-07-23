import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import type { ColorStop } from '../App';
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
    <Box display="flex" flexDirection="column" gap={1}>
      {sortedStops.map((stop) => (
        <Box key={stop.id} display="flex" alignItems="center" gap={1.5} p={1} bgcolor={selectedStopId === stop.id ? 'action.selected' : 'background.paper'} boxShadow={selectedStopId === stop.id ? 2 : 0} onClick={() => onStopSelect(stop.id)}>
          <Box sx={{ width: 24, height: 24, borderRadius: '4px', bgcolor: stop.color, border: '1px solid #ccc' }} />
          <TextField label="Hex" size="small" value={stop.color.toUpperCase()} onChange={(e) => onUpdateStop(stop.id, { color: e.target.value })} onClick={(e) => e.stopPropagation()} />
          <TextField label="Pos" size="small" type="number" value={stop.position.toFixed(1)} onChange={(e) => handlePositionChange(stop.id, e.target.value)} onClick={(e) => e.stopPropagation()} />
          {colorStops.length > 2 && (
            <IconButton
              size="small"
              color="error"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteStop(stop.id);
              }}
              title="Delete color stop"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      ))}
    </Box>
  );
};
export default ColorStopsList;
