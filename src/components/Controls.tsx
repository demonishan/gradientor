import { Divider, Box, Typography, TextField, MenuItem, Checkbox, FormControlLabel, Slider, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowDownwardLeftIcon from '@mui/icons-material/SouthWest';
import ArrowDownwardRightIcon from '@mui/icons-material/SouthEast';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowUpwardLeftIcon from '@mui/icons-material/NorthWest';
import ArrowUpwardRightIcon from '@mui/icons-material/NorthEast';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import React from 'react';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
interface ControlsProps {
  type: 'linear' | 'radial' | 'conic' | 'elliptical';
  angle: number;
  onTypeChange: (type: 'linear' | 'radial' | 'conic' | 'elliptical') => void;
  onAngleChange: (angle: number) => void;
  radialDirection?: string;
  onRadialDirectionChange?: (dir: string) => void;
  radialSize?: string;
  onRadialSizeChange?: (size: string) => void;
  hue?: number;
  onHueChange?: (hue: number) => void;
  saturation?: number;
  onSaturationChange?: (saturation: number) => void;
  lightness?: number;
  onLightnessChange?: (lightness: number) => void;
}
const Controls: React.FC<
  ControlsProps & {
    conicPosition?: { x: number; y: number };
    onConicPositionChange?: (pos: { x: number; y: number }) => void;
    repeating?: boolean;
    onRepeatingChange?: (repeating: boolean) => void;
  }
> = (props) => {
  const { type, angle, onTypeChange, onAngleChange, conicPosition = { x: 50, y: 50 }, onConicPositionChange, radialDirection = 'center', onRadialDirectionChange, radialSize = 'farthest-side', onRadialSizeChange, repeating = false, onRepeatingChange, hue = 0, onHueChange, saturation = 0, onSaturationChange, lightness = 0, onLightnessChange } = props;
  const radialDirections = [
    ['at left top', 'at top', 'at right top'],
    ['at left', 'center', 'at right'],
    ['at left bottom', 'at bottom', 'at right bottom'],
  ];
  const directionLabels = [
    [<ArrowUpwardLeftIcon fontSize="small" />, <ArrowUpwardIcon fontSize="small" />, <ArrowUpwardRightIcon fontSize="small" />],
    [<ArrowBackIcon fontSize="small" />, <RadioButtonUncheckedIcon fontSize="small" />, <ArrowForwardIcon fontSize="small" />],
    [<ArrowDownwardLeftIcon fontSize="small" />, <ArrowDownwardIcon fontSize="small" />, <ArrowDownwardRightIcon fontSize="small" />],
  ];
  const handleConicPositionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onConicPositionChange) return;
    const { name, value } = e.target;
    const num = parseInt(value);
    if (!isNaN(num)) onConicPositionChange({ ...conicPosition, [name]: num });
  };
  const [value, setValue] = React.useState('2');
  const handleChange = (_: React.SyntheticEvent, value: string) => {
    setValue(value);
  };
  return (
    <>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Controls" value="1" />
            <Tab label="Hue/Saturation" value="2" />
          </TabList>
        </Box>
        <TabPanel value="1" sx={{ px: 0 }}>
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
              <Slider value={angle} onChange={(_, val) => typeof val === 'number' && onAngleChange(val)} min={0} max={360} step={10} valueLabelDisplay="auto" aria-label="Gradient angle slider" sx={{ flexGrow: 1 }} />
              <label style={visuallyHidden} htmlFor="gradient-angle">
                Angle
              </label>
              <TextField
                type="number"
                size="small"
                value={angle}
                id="gradient-angle"
                aria-label="Gradient angle"
                inputProps={{ min: 0, max: 360 }}
                onChange={(e) => {
                  const v = parseInt(e.target.value);
                  if (!isNaN(v)) onAngleChange(Math.max(0, Math.min(360, v)));
                }}
                sx={{ width: 120 }}
              />
            </Box>
          )}
          {type === 'conic' && (
            <Box display="flex" alignItems="center" gap={2}>
              <TextField label="X (%)" name="x" type="number" size="small" value={conicPosition.x} onChange={handleConicPositionChange} inputProps={{ min: 0, max: 100, style: { width: 60 }, 'aria-label': 'Conic X position' }} sx={{ width: '50%' }} />
              <TextField label="Y (%)" name="y" type="number" size="small" value={conicPosition.y} onChange={handleConicPositionChange} inputProps={{ min: 0, max: 100, style: { width: 60 }, 'aria-label': 'Conic Y position' }} sx={{ width: '50%' }} />
              <FormControlLabel control={<Checkbox checked={repeating} onChange={(e) => onRepeatingChange && onRepeatingChange(e.target.checked)} inputProps={{ 'aria-label': 'Toggle repeating gradient' }} />} label="Repeating" sx={{ mb: 0.5 }} />
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
                  <MenuItem value="None" aria-label="No radial size">
                    None
                  </MenuItem>
                  <MenuItem value="farthest-side" aria-label="Farthest side">
                    farthest-side
                  </MenuItem>
                  <MenuItem value="farthest-corner" aria-label="Farthest corner">
                    farthest-corner
                  </MenuItem>
                </TextField>
              )}
            </>
          )}
        </TabPanel>
        <TabPanel value="2" sx={{ px: 0 }}>
          <Box display="flex" alignItems="flex-end" justifyContent="space-between" gap={2} mb={1}>
            <Typography>Hue</Typography>
            <TextField
              type="number"
              size="small"
              id="gradient-hue"
              aria-label="Gradient hue"
              value={typeof hue === 'number' ? hue : 0}
              inputProps={{ min: -100, max: 100 }}
              onChange={(e) => {
                const v = parseInt(e.target.value);
                if (!isNaN(v) && onHueChange) onHueChange(Math.max(-100, Math.min(100, v)));
              }}
              sx={{ width: 80, ml: 2 }}
            />
          </Box>
          <Slider value={typeof hue === 'number' ? hue : 0} onChange={(_, val) => typeof val === 'number' && onHueChange && onHueChange(val)} min={-100} max={100} step={1} valueLabelDisplay="auto" aria-label="Gradient hue slider" sx={{ borderRadius: '4px', mb: 2, background: 'linear-gradient(to right, hsl( 0, 100%, 50%) 0%, hsl( 60, 100%, 50%) 16.67%, hsl(120, 100%, 50%) 33.33%, hsl(180, 100%, 50%) 50%, hsl(240, 100%, 50%) 66.67%, hsl(320, 100%, 50%) 83.33%, hsl(360, 100%, 50%) 100% );' }} />
          <label style={visuallyHidden} htmlFor="gradient-hue">
            Hue
          </label>
          <Box display="flex" alignItems="flex-end" justifyContent="space-between" gap={2} mb={1}>
            <Typography>Saturation</Typography>
            <label style={visuallyHidden} htmlFor="gradient-saturation">
              Saturation
            </label>
            <TextField
              type="number"
              size="small"
              value={typeof saturation === 'number' ? saturation : 0}
              id="gradient-saturation"
              aria-label="Gradient saturation"
              inputProps={{ min: -100, max: 100 }}
              onChange={(e) => {
                const v = parseInt(e.target.value);
                if (!isNaN(v) && onSaturationChange) onSaturationChange(Math.max(-100, Math.min(100, v)));
              }}
              sx={{ width: 80, ml: 2 }}
            />
          </Box>
          <Slider value={typeof saturation === 'number' ? saturation : 0} onChange={(_, val) => typeof val === 'number' && onSaturationChange && onSaturationChange(val)} min={-100} max={100} step={1} valueLabelDisplay="auto" aria-label="Gradient saturation slider" sx={{ borderRadius: '4px', mb: 2, background: 'linear-gradient(to right, hsl(0,0%,50%) 0%, hsl(0,100%,50%) 100%)' }} />
          <Box display="flex" alignItems="flex-end" justifyContent="space-between" gap={2} mb={1}>
            <Typography>Lightness</Typography>
            <label style={visuallyHidden} htmlFor="gradient-lightness">
              Lightness
            </label>
            <TextField
              type="number"
              size="small"
              value={typeof lightness === 'number' ? lightness : 0}
              id="gradient-lightness"
              aria-label="Gradient lightness"
              inputProps={{ min: -100, max: 100 }}
              onChange={(e) => {
                const v = parseInt(e.target.value);
                if (!isNaN(v) && onLightnessChange) onLightnessChange(Math.max(-100, Math.min(100, v)));
              }}
              sx={{ width: 80, ml: 2 }}
            />
          </Box>
          <Slider value={typeof lightness === 'number' ? lightness : 0} onChange={(_, val) => typeof val === 'number' && onLightnessChange && onLightnessChange(val)} min={-100} max={100} step={1} valueLabelDisplay="auto" aria-label="Gradient lightness slider" sx={{ borderRadius: '3px', mb: 2, background: 'linear-gradient(to right, hsl(0,100%,0%) 0%, hsl(0,100%,100%) 100%)' }} />
        </TabPanel>
      </TabContext>
    </>
  );
};
export default Controls;
