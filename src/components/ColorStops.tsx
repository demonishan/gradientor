import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import BackspaceOutlinedIcon from '@mui/icons-material/BackspaceOutlined';
import Radio from '@mui/material/Radio';
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
      const roundedPosition = Math.round(Math.max(0, Math.min(100, position)) * 10) / 10;
      onUpdateStop(id, { position: roundedPosition });
    }
  };
  return (
    <Box display="flex" flexDirection="column" gap={1.75}>
      {sortedStops.map((stop) => (
        <Box key={stop.id} display="flex" alignItems="center" gap={1}>
          <Radio checked={selectedStopId === stop.id} onChange={() => onStopSelect(stop.id)} aria-label={`Select color stop ${stop.id}`} sx={{ borderRadius: '4px', p: 1, backgroundColor: stop.color }} />
          <TextField label="Hex" size="small" value={stop.color.toUpperCase()} onChange={(e) => onUpdateStop(stop.id, { color: e.target.value })} onClick={(e) => e.stopPropagation()} sx={{ flexGrow: 1 }} />
          <TextField label="Position" size="small" type="number" value={stop.position.toFixed(1)} onChange={(e) => handlePositionChange(stop.id, e.target.value)} onClick={(e) => e.stopPropagation()} sx={{ flexGrow: 1 }} />
          {colorStops.length > 2 && (
            <IconButton size="small" onClick={() => onDeleteStop(stop.id)} title="Delete color stop">
              <BackspaceOutlinedIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      ))}
    </Box>
  );
};
export default ColorStopsList;
