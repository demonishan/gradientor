import { useState, useMemo, useEffect } from 'react';
import { parseShareLink, updateRepeating, updateRadialSize, addColorStop, updateColorStop, deleteColorStop, updateGradientType, updateGradientAngle, updateConicPosition, updateRadialDirection } from './modules/share';
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
  type: `linear` | `radial` | `conic` | `elliptical`;
  angle: number;
  colorStops: ColorStop[];
  conicPosition?: { x: number; y: number };
  radialDirection?: string;
  radialSize?: string;
  repeating?: boolean;
}
const App = () => {
  const [gradient, setGradient] = useState<GradientConfig>({
    type: `linear`,
    angle: 90,
    colorStops: [
      { id: `1`, color: `#ff0000`, position: 0, opacity: 1 },
      { id: `2`, color: `#0000ff`, position: 100, opacity: 1 },
    ],
    conicPosition: { x: 50, y: 50 },
    radialDirection: `center`,
    radialSize: `None`,
    repeating: false,
  });

  useEffect(() => {
    const shared = parseShareLink(window.location.href);
    if (shared && Array.isArray(shared.colorStops) && shared.colorStops.length > 0) {
      setGradient((prev) => ({
        ...prev,
        ...shared,
        colorStops: shared.colorStops,
      }));
      window.history.replaceState({}, document.title, window.location.pathname + window.location.hash);
    }
  }, []);
  const [selectedStopId, setSelectedStopId] = useState<string>(`1`);
  const handleAddColorStop = (position: number) => {
    const updated = addColorStop(gradient, position);
    setGradient(updated);
    setSelectedStopId(updated.colorStops[updated.colorStops.length - 1].id);
  };
  const handleUpdateColorStop = (id: string, updates: Partial<ColorStop>) => setGradient(updateColorStop(gradient, id, updates));
  const handleDeleteColorStop = (id: string) => {
    const updated = deleteColorStop(gradient, id);
    if (updated.colorStops.length < gradient.colorStops.length && selectedStopId === id) setSelectedStopId(updated.colorStops[0].id);
    setGradient(updated);
  };
  const handleUpdateRepeating = (repeating: boolean) => setGradient(updateRepeating(gradient, repeating));
  const handleUpdateRadialSize = (size: string) => setGradient(updateRadialSize(gradient, size));
  const handleUpdateGradientType = (type: `linear` | `radial` | `conic` | `elliptical`) => setGradient(updateGradientType(gradient, type));
  const handleUpdateGradientAngle = (angle: number) => setGradient(updateGradientAngle(gradient, angle));
  const handleUpdateConicPosition = (pos: { x: number; y: number }) => setGradient(updateConicPosition(gradient, pos));
  const handleUpdateRadialDirection = (dir: string) => setGradient(updateRadialDirection(gradient, dir));
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem(`darkMode`);
    return stored ? stored === `true` : false;
  });
  const handleToggleDarkMode = () => {
    setDarkMode((prev) => {
      localStorage.setItem(`darkMode`, String(!prev));
      return !prev;
    });
  };
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? `dark` : `light`,
        },
      }),
    [darkMode],
  );
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="app">
        <header className="app-header">
          <div className="header-content" style={{ display: `flex`, alignItems: `center`, gap: 12 }}>
            <img src={logo} alt="Gradientor Logo" className="app-logo" />
            <Tooltip title={darkMode ? `Switch to light mode` : `Switch to dark mode`}>
              <IconButton onClick={handleToggleDarkMode} color="inherit" size="large" sx={{ ml: 1 }}>
                {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Tooltip>
          </div>
        </header>
        <GradientPreview gradient={gradient} />
        <main className="app-main">
          <Grid container spacing={2} className="gradient-panels" sx={{ alignItems: `stretch` }}>
            <Grid size={8}>
              <Card className="gradient-display-panel" sx={{ height: `100%`, display: `flex`, alignItems: `center` }}>
                <CardContent sx={{ flex: 1 }}>
                  <GradientBar gradient={gradient} selectedStopId={selectedStopId} onStopSelect={setSelectedStopId} onAddStop={handleAddColorStop} onUpdateStop={handleUpdateColorStop} />
                </CardContent>
              </Card>
            </Grid>
            <Grid size={4}>
              <Card className="gradient-controls-panel" sx={{ height: `100%` }}>
                <CardContent>
                  <CSSOutput gradient={gradient} />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Grid container spacing={2} className="editor-section" sx={{ alignItems: `stretch` }}>
            <Grid size={4}>
              <Card className="left-panel" sx={{ height: `100%` }}>
                <CardContent>
                  <Typography gutterBottom sx={{ color: `text.primary`, fontSize: 14 }}>
                    Picker
                  </Typography>
                  <ColorPicker selectedStop={gradient.colorStops.find((stop) => stop.id === selectedStopId)} onColorChange={(color) => handleUpdateColorStop(selectedStopId, { color })} onOpacityChange={(opacity) => handleUpdateColorStop(selectedStopId, { opacity })} />
                </CardContent>
              </Card>
            </Grid>
            <Grid size={4}>
              <Card className="right-panel" sx={{ height: `100%` }}>
                <CardContent>
                  <Typography gutterBottom sx={{ color: `text.primary`, fontSize: 14 }}>
                    Stops
                  </Typography>
                  <ColorStopsList colorStops={gradient.colorStops} selectedStopId={selectedStopId} onStopSelect={setSelectedStopId} onUpdateStop={handleUpdateColorStop} onDeleteStop={handleDeleteColorStop} />
                </CardContent>
              </Card>
            </Grid>
            <Grid size={4}>
              <Card className="third-panel" sx={{ height: `100%` }}>
                <CardContent>
                  <Typography gutterBottom sx={{ color: `text.primary`, fontSize: 14 }}>
                    Controls
                  </Typography>
                  <GradientControls type={gradient.type} angle={gradient.angle} onTypeChange={handleUpdateGradientType} onAngleChange={handleUpdateGradientAngle} conicPosition={gradient.conicPosition} onConicPositionChange={handleUpdateConicPosition} radialDirection={gradient.radialDirection} onRadialDirectionChange={handleUpdateRadialDirection} radialSize={gradient.radialSize} onRadialSizeChange={handleUpdateRadialSize} repeating={gradient.repeating} onRepeatingChange={handleUpdateRepeating} />
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
