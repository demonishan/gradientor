import { useState, useMemo, useEffect } from 'react';
import { parseShareLink } from './modules/share';
import './App.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import ColorPicker from './components/ColorPicker';
import ColorStopsList from './components/ColorStopsList';
import CssBaseline from '@mui/material/CssBaseline';
import CSSOutput from './components/CSSOutput';
import GradientBar from './components/GradientBar';
import GradientControls from './components/GradientControls';
import GradientPreview from './components/GradientPreview';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import logo from './assets/logo.webp';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
export interface ColorStop {
  id: string;
  color: string;
  position: number;
  opacity: number;
}
export interface GradientConfig {
  type: 'linear' | 'radial' | 'conic' | 'elliptical';
  angle: number;
  colorStops: ColorStop[];
  conicPosition?: { x: number; y: number };
  radialDirection?: string;
  radialSize?: string;
  repeating?: boolean;
}
const App = () => {
  const [gradient, setGradient] = useState<GradientConfig>({
    type: 'linear',
    angle: 90,
    colorStops: [
      { id: '1', color: '#ff0000', position: 0, opacity: 1 },
      { id: '2', color: '#0000ff', position: 100, opacity: 1 },
    ],
    conicPosition: { x: 50, y: 50 },
    radialDirection: 'center',
    radialSize: 'None',
    repeating: false,
  });

  useEffect(() => {
    const shared = parseShareLink(window.location.href);
    if (shared && Array.isArray(shared.colorStops) && shared.colorStops.length > 0) {
      setGradient(prev => ({
        ...prev,
        ...shared,
        colorStops: shared.colorStops
      }));
    }
  }, []);
  const updateRepeating = (repeating: boolean) => setGradient((prev) => ({ ...prev, repeating }));
  const updateRadialSize = (size: string) => setGradient((prev) => ({ ...prev, radialSize: size }));
  const [selectedStopId, setSelectedStopId] = useState<string>('1');
  const addColorStop = (position: number) => {
    const newStop: ColorStop = {
      id: Date.now().toString(),
      color: '#ffffff',
      position,
      opacity: 1,
    };
    setGradient((prev) => ({
      ...prev,
      colorStops: [...prev.colorStops, newStop].sort((a, b) => a.position - b.position),
    }));
    setSelectedStopId(newStop.id);
  };
  const updateColorStop = (id: string, updates: Partial<ColorStop>) => {
    setGradient((prev) => ({
      ...prev,
      colorStops: prev.colorStops.map((stop) => (stop.id === id ? { ...stop, ...updates } : stop)),
    }));
  };
  const deleteColorStop = (id: string) => {
    if (gradient.colorStops.length <= 2) return;
    setGradient((prev) => ({
      ...prev,
      colorStops: prev.colorStops.filter((stop) => stop.id !== id),
    }));
    if (selectedStopId === id) setSelectedStopId(gradient.colorStops[0].id);
  };
  const updateGradientType = (type: 'linear' | 'radial' | 'conic' | 'elliptical') => setGradient((prev) => ({ ...prev, type }));
  const updateGradientAngle = (angle: number) => setGradient((prev) => ({ ...prev, angle }));
  const updateConicPosition = (pos: { x: number; y: number }) => setGradient((prev) => ({ ...prev, conicPosition: pos }));
  const updateRadialDirection = (dir: string) => setGradient((prev) => ({ ...prev, radialDirection: dir }));
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem('darkMode');
    return stored ? stored === 'true' : false;
  });
  const handleToggleDarkMode = () => {
    setDarkMode((prev) => {
      localStorage.setItem('darkMode', String(!prev));
      return !prev;
    });
  };
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
        },
      }),
    [darkMode],
  );
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="app">
        <header className="app-header">
          <div className="header-content" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src={logo} alt="Gradientor Logo" className="app-logo" />
            <Tooltip title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
              <IconButton onClick={handleToggleDarkMode} color="inherit" size="large" sx={{ ml: 1 }}>
                {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Tooltip>
          </div>
        </header>
        <GradientPreview gradient={gradient} />
        <main className="app-main">
          <Grid container spacing={2} className="gradient-panels" sx={{ alignItems: 'stretch' }}>
            <Grid size={8}>
              <Card className="gradient-display-panel" sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                <CardContent sx={{ flex: 1 }}>
                  <GradientBar gradient={gradient} selectedStopId={selectedStopId} onStopSelect={setSelectedStopId} onAddStop={addColorStop} onUpdateStop={updateColorStop} />
                </CardContent>
              </Card>
            </Grid>
            <Grid size={4}>
              <Card className="gradient-controls-panel" sx={{ height: '100%' }}>
                <CardContent>
                  <CSSOutput gradient={gradient} />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Grid container spacing={2} className="editor-section" sx={{ alignItems: 'stretch' }}>
            <Grid size={4}>
              <Card className="left-panel" sx={{ height: '100%' }}>
                <CardContent>
                  <Typography gutterBottom sx={{ color: 'text.primary', fontSize: 14 }}>
                    Picker
                  </Typography>
                  <ColorPicker selectedStop={gradient.colorStops.find((stop) => stop.id === selectedStopId)} onColorChange={(color) => updateColorStop(selectedStopId, { color })} onOpacityChange={(opacity) => updateColorStop(selectedStopId, { opacity })} />
                </CardContent>
              </Card>
            </Grid>
            <Grid size={4}>
              <Card className="right-panel" sx={{ height: '100%' }}>
                <CardContent>
                  <Typography gutterBottom sx={{ color: 'text.primary', fontSize: 14 }}>
                    Stops
                  </Typography>
                  <ColorStopsList colorStops={gradient.colorStops} selectedStopId={selectedStopId} onStopSelect={setSelectedStopId} onUpdateStop={updateColorStop} onDeleteStop={deleteColorStop} />
                </CardContent>
              </Card>
            </Grid>
            <Grid size={4}>
              <Card className="third-panel" sx={{ height: '100%' }}>
                <CardContent>
                  <Typography gutterBottom sx={{ color: 'text.primary', fontSize: 14 }}>
                    Controls
                  </Typography>
                  <GradientControls type={gradient.type} angle={gradient.angle} onTypeChange={updateGradientType} onAngleChange={updateGradientAngle} conicPosition={gradient.conicPosition} onConicPositionChange={updateConicPosition} radialDirection={gradient.radialDirection} onRadialDirectionChange={updateRadialDirection} radialSize={gradient.radialSize} onRadialSizeChange={updateRadialSize} repeating={gradient.repeating} onRepeatingChange={updateRepeating} />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </main>
      </div>
    </ThemeProvider>
  );
};
export default App;
