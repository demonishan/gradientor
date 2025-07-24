import { Divider, Box, Typography, TextField, MenuItem } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowDownwardLeftIcon from '@mui/icons-material/SouthWest';
import ArrowDownwardRightIcon from '@mui/icons-material/SouthEast';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowUpwardLeftIcon from '@mui/icons-material/NorthWest';
import ArrowUpwardRightIcon from '@mui/icons-material/NorthEast';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import React from 'react';
import Slider from '@mui/material/Slider';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
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
    <>
      <ToggleButtonGroup size="small" value={type} fullWidth exclusive onChange={(_, val) => val && onTypeChange(val)} sx={{ mb: 1 }}>
        <ToggleButton value="linear">Linear</ToggleButton>
        <ToggleButton value="radial">Radial</ToggleButton>
        <ToggleButton value="elliptical">Elliptical</ToggleButton>
        <ToggleButton value="conic">Conic</ToggleButton>
      </ToggleButtonGroup>
      <FormControlLabel control={<Checkbox checked={repeating} onChange={(e) => onRepeatingChange && onRepeatingChange(e.target.checked)} />} label="Repeating" sx={{ mb: 0.5 }} />
      <Divider sx={{ mb: 2 }}></Divider>
      {(type === 'linear' || type === 'conic') && (
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Typography>Angle</Typography>
          <Slider value={angle} onChange={(_, val) => typeof val === 'number' && onAngleChange(val)} min={0} max={360} step={10} valueLabelDisplay="auto" sx={{ flexGrow: 1 }} />
          <TextField
            type="number"
            size="small"
            value={angle}
            onChange={(e) => {
              const v = parseInt(e.target.value);
              if (!isNaN(v)) onAngleChange(Math.max(0, Math.min(360, v)));
            }}
            inputProps={{ min: 0, max: 360 }}
            sx={{ width: 120 }}
          />
        </Box>
      )}
      {type === 'conic' && (
        <Box display="flex" alignItems="center" gap={2}>
          <TextField label="X (%)" name="x" type="number" size="small" value={conicPosition.x} onChange={handleConicPositionChange} inputProps={{ min: 0, max: 100, style: { width: 60 } }} sx={{ width: '50%' }} />
          <TextField label="Y (%)" name="y" type="number" size="small" value={conicPosition.y} onChange={handleConicPositionChange} inputProps={{ min: 0, max: 100, style: { width: 60 } }} sx={{ width: '50%' }} />
        </Box>
      )}
      {(type === 'radial' || type === 'elliptical') && (
        <>
          <Typography>Direction</Typography>
          {onRadialDirectionChange && (
            <Box display="flex" flexDirection="column" gap={0} mb={3}>
              {radialDirections.map((row, i) => (
                <ToggleButtonGroup key={i} value={radialDirection} exclusive onChange={(_, val) => val && onRadialDirectionChange(val)} size="small" fullWidth>
                  {row.map((dir, j) => (
                    <ToggleButton key={dir} value={dir} sx={{ flexGrow: 1 }}>
                      {directionLabels[i][j]}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              ))}
            </Box>
          )}
          {onRadialSizeChange && (
            <TextField select fullWidth size="small" label="Size" id="radial-size-select" value={radialSize} onChange={(e) => onRadialSizeChange(e.target.value)}>
              <MenuItem value="None">None</MenuItem>
              <MenuItem value="farthest-side">farthest-side</MenuItem>
              <MenuItem value="farthest-corner">farthest-corner</MenuItem>
            </TextField>
          )}
        </>
      )}
    </>
  );
};
export default GradientControls;
