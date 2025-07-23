import React from 'react';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowUpwardLeftIcon from '@mui/icons-material/NorthWest';
import ArrowUpwardRightIcon from '@mui/icons-material/NorthEast';
import ArrowDownwardLeftIcon from '@mui/icons-material/SouthWest';
import ArrowDownwardRightIcon from '@mui/icons-material/SouthEast';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Slider from '@mui/material/Slider';
import { Divider, Box, Typography, TextField, MenuItem } from '@mui/material';
interface GradientControlsProps {
  type: 'linear' | 'radial' | 'conic' | 'elliptical';
  angle: number;
  onTypeChange: (type: 'linear' | 'radial' | 'conic' | 'elliptical') => void;
  onAngleChange: (angle: number) => void;
  radialDirection?: string;
  onRadialDirectionChange?: (dir: string) => void;
  radialSize?: string;
  onRadialSizeChange?: (size: string) => void;
}
const GradientControls: React.FC<
  GradientControlsProps & {
    conicPosition?: { x: number; y: number };
    onConicPositionChange?: (pos: { x: number; y: number }) => void;
    repeating?: boolean;
    onRepeatingChange?: (repeating: boolean) => void;
  }
> = ({ type, angle, onTypeChange, onAngleChange, conicPosition = { x: 50, y: 50 }, onConicPositionChange, radialDirection = 'center', onRadialDirectionChange, radialSize = 'farthest-side', onRadialSizeChange, repeating = false, onRepeatingChange }) => {
  const radialDirections = [
    ['at left top', 'at top', 'at right top'],
    ['at left', 'center', 'at right'],
    ['at left bottom', 'at bottom', 'at right bottom'],
  ];
  const directionLabels = [
    [<ArrowUpwardLeftIcon fontSize="small" />, <ArrowUpwardIcon fontSize="small" />, <ArrowUpwardRightIcon fontSize="small" />],
    [<ArrowBackIcon fontSize="small" />, <RadioButtonCheckedIcon fontSize="small" />, <ArrowForwardIcon fontSize="small" />],
    [<ArrowDownwardLeftIcon fontSize="small" />, <ArrowDownwardIcon fontSize="small" />, <ArrowDownwardRightIcon fontSize="small" />],
  ];
  const handleConicPositionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onConicPositionChange) return;
    const { name, value } = e.target;
    const num = parseInt(value);
    if (!isNaN(num)) onConicPositionChange({ ...conicPosition, [name]: num });
  };
  return (
    <div className="gradient-controls-panel-content">
      <ToggleButtonGroup value={type} exclusive onChange={(_, val) => val && onTypeChange(val)} color="primary" sx={{ mr: 2 }}>
        <ToggleButton value="linear">Linear</ToggleButton>
        <ToggleButton value="radial">Radial</ToggleButton>
        <ToggleButton value="elliptical">Elliptical</ToggleButton>
        <ToggleButton value="conic">Conic</ToggleButton>
      </ToggleButtonGroup>
      <FormControlLabel control={<Checkbox checked={repeating} onChange={(e) => onRepeatingChange && onRepeatingChange(e.target.checked)} color="primary" />} label="Repeating" sx={{ mr: 2 }} />
      <Divider orientation="vertical" flexItem />
      {(type === 'linear' || type === 'conic') && (
        <Box display="flex" alignItems="center" gap={2} mt={1.5}>
          <Typography>Angle</Typography>
          <Slider value={angle} onChange={(_, val) => typeof val === 'number' && onAngleChange(val)} min={0} max={360} step={10} valueLabelDisplay="auto" sx={{ width: 180 }} />
          <input
            type="number"
            min={0}
            max={360}
            value={angle}
            onChange={(e) => {
              const v = parseInt(e.target.value);
              if (!isNaN(v)) onAngleChange(Math.max(0, Math.min(360, v)));
            }}
            style={{ width: 60, marginLeft: 8, padding: '4px 8px', borderRadius: 4, border: '1px solid #ccc', fontSize: 14 }}
          />
        </Box>
      )}
      {type === 'conic' && (
        <Box display="flex" alignItems="center" gap={2} mt={3}>
          <TextField label="X (%)" name="x" type="number" size="small" value={conicPosition.x} onChange={handleConicPositionChange} inputProps={{ min: 0, max: 100, style: { width: 60 } }} sx={{ width: 100 }} />
          <TextField label="Y (%)" name="y" type="number" size="small" value={conicPosition.y} onChange={handleConicPositionChange} inputProps={{ min: 0, max: 100, style: { width: 60 } }} sx={{ width: 100 }} />
        </Box>
      )}
      {(type === 'radial' || type === 'elliptical') && (
        <>
          {onRadialDirectionChange && (
            <Box display="flex" flexDirection="column" gap={0} mt={1.5}>
              {radialDirections.map((row, i) => (
                <ToggleButtonGroup key={i} value={radialDirection} exclusive onChange={(_, val) => val && onRadialDirectionChange(val)} size="small" sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                  {row.map((dir, j) => (
                    <ToggleButton key={dir} value={dir} sx={{ minWidth: 36, px: 1 }}>
                      {directionLabels[i][j]}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              ))}
            </Box>
          )}
          {onRadialSizeChange && (
            <Box mt={3}>
              <TextField select label="Size" id="radial-size-select" value={radialSize} onChange={(e) => onRadialSizeChange(e.target.value)}>
                <MenuItem value="None">None</MenuItem>
                <MenuItem value="farthest-side">farthest-side</MenuItem>
                <MenuItem value="farthest-corner">farthest-corner</MenuItem>
              </TextField>
            </Box>
          )}
        </>
      )}
    </div>
  );
};
export default GradientControls;
