import './App.css';
import { Container } from '@mui/material';
import { parseShareLink } from './modules/share';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useState, useMemo, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import ColorPicker from './components/ColorPicker';
import ColorStopsList from './components/ColorStops';
import CSSOutput from './components/CSSOutput';
import GradientAnimation from './modules/background.tsx';
import GradientBar from './components/GradientBar';
import GradientControls from './components/GradientControls';
import GradientPreview from './components/GradientPreview';
import Grid from '@mui/material/Grid';
import Header from './components/Header';
import useLocalStorage from './helpers/useLocalStorage';
import useSnackbar from './helpers/useSnackbar';
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
      { id: '2', color: '#ffa500', position: 16.7, opacity: 1 },
      { id: '3', color: '#ffff00', position: 33.3, opacity: 1 },
      { id: '4', color: '#00ff00', position: 50, opacity: 1 },
      { id: '5', color: '#00ffff', position: 66.7, opacity: 1 },
      { id: '6', color: '#0000ff', position: 83.3, opacity: 1 },
      { id: '7', color: '#8b00ff', position: 100, opacity: 1 },
    ],
    conicPosition: { x: 50, y: 50 },
    radialDirection: 'center',
    radialSize: 'None',
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
      window.history.replaceState({}, document.title, window.location.pathname);
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
  const [darkMode, setDarkMode] = useLocalStorage('darkMode', false);
  const [, , showSnackbar] = useSnackbar();
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
          primary: { main: '#ffc107' },
        },
        typography: {
          fontFamily: `'Work Sans', sans-serif`,
        },
      }),
    [darkMode],
  );
  return (
    <ThemeProvider theme={theme}>
      <GradientAnimation darkMode={darkMode} />
      <Header darkMode={darkMode} setDarkMode={setDarkMode} showSnackbar={showSnackbar} />
      <GradientPreview gradient={gradient} />
      <main>
        <Container>
          <Grid container spacing={2} sx={{ alignItems: 'stretch' }}>
            <Grid size={6} mb={2}>
              <Card sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                <CardContent sx={{ flex: 1 }}>
                  <GradientBar gradient={gradient} selectedStopId={selectedStopId} onStopSelect={setSelectedStopId} onAddStop={addColorStop} onUpdateStop={updateColorStop} />
                </CardContent>
              </Card>
            </Grid>
            <Grid size={6} mb={2}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <CSSOutput gradient={gradient} />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Grid container spacing={2} className="editor-section" sx={{ alignItems: 'stretch' }}>
            <Grid size={4} mb={2}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <ColorPicker selectedStop={gradient.colorStops.find((stop) => stop.id === selectedStopId)} onColorChange={(color) => updateColorStop(selectedStopId, { color })} onOpacityChange={(opacity) => updateColorStop(selectedStopId, { opacity })} />
                </CardContent>
              </Card>
            </Grid>
            <Grid size={4} mb={2}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <ColorStopsList colorStops={gradient.colorStops} selectedStopId={selectedStopId} onStopSelect={setSelectedStopId} onUpdateStop={updateColorStop} onDeleteStop={deleteColorStop} />
                </CardContent>
              </Card>
            </Grid>
            <Grid size={4} mb={2}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <GradientControls type={gradient.type} angle={gradient.angle} onTypeChange={updateGradientType} onAngleChange={updateGradientAngle} conicPosition={gradient.conicPosition} onConicPositionChange={updateConicPosition} radialDirection={gradient.radialDirection} onRadialDirectionChange={updateRadialDirection} radialSize={gradient.radialSize} onRadialSizeChange={updateRadialSize} repeating={gradient.repeating} onRepeatingChange={updateRepeating} />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </main>
    </ThemeProvider>
  );
};
export default App;
