import './App.css';
import { ColorPicker } from './components/ColorPicker';
import { Container } from '@mui/material';
import { parseShareLink, adjustHue, adjustSaturation, adjustLightness } from './modules';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useLocalStorage, useSnackbar } from './helpers';
import { useState, useMemo, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import ColorStops from './components/ColorStops';
import Controls from './components/Controls';
import GradientAnimation from './modules/background.tsx';
import GradientBar from './components/GradientBar';
import GradientPreview from './components/GradientPreview';
import Grid from '@mui/material/Grid';
import Header from './components/Header';
import Output from './components/Output';
import Snackbar from '@mui/material/Snackbar';
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
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(0);
  const [lightness, setLightness] = useState(0);
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

  // Ensure the first stop is selected after a random gradient is generated
  const handleSetGradient = (g: GradientConfig) => {
    setGradient(g);
    setHue(0);
    setSaturation(0);
    setLightness(0);
    const first = g.colorStops.find((stop) => stop.id === '1');
    setSelectedStopId(first ? '1' : g.colorStops[0]?.id || '');
  };
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
    if (updates.color !== undefined) {
      const oldStop = gradient.colorStops.find((stop) => stop.id === id);
      if (oldStop && oldStop.color !== updates.color) {
        setHue(0);
        setSaturation(0);
        setLightness(0);
      }
    }
    setGradient((prev) => {
      const newStops = prev.colorStops.map((stop) => (stop.id === id ? { ...stop, ...updates } : stop));
      return {
        ...prev,
        colorStops: newStops,
      };
    });
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
  // Update all colors when hue changes
  const handleHueChange = (newHue: number) => {
    setHue(newHue);
    setGradient((prev) => ({
      ...prev,
      colorStops: adjustHue(
        prev.colorStops.map((cs) => cs.color),
        newHue,
      ).map((color, i) => ({ ...prev.colorStops[i], color })),
    }));
  };
  // Update all colors when saturation changes
  const handleSaturationChange = (newSaturation: number) => {
    setSaturation(newSaturation);
    setGradient((prev) => ({
      ...prev,
      colorStops: adjustSaturation(
        prev.colorStops.map((cs) => cs.color),
        newSaturation,
      ).map((color, i) => ({ ...prev.colorStops[i], color })),
    }));
  };
  // Update all colors when lightness changes
  const handleLightnessChange = (newLightness: number) => {
    setLightness(newLightness);
    setGradient((prev) => ({
      ...prev,
      colorStops: adjustLightness(
        prev.colorStops.map((cs) => cs.color),
        newLightness,
      ).map((color, i) => ({ ...prev.colorStops[i], color })),
    }));
  };
  const updateGradientAngle = (angle: number) => setGradient((prev) => ({ ...prev, angle }));
  const updateConicPosition = (pos: { x: number; y: number }) => setGradient((prev) => ({ ...prev, conicPosition: pos }));
  const updateRadialDirection = (dir: string) => setGradient((prev) => ({ ...prev, radialDirection: dir }));
  const [darkMode, setDarkMode] = useLocalStorage('darkMode', false);
  const [snackbarOpen, snackbarMsg, showSnackbar, hideSnackbar] = useSnackbar();
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
          primary: { main: '#9e9e9e' },
        },
        typography: {
          fontFamily: `'Poppins', sans-serif`,
        },
        components: {
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                backgroundColor: darkMode ? '#121212' : '#eee',
                marginBottom: '-0.5rem',
              },
            },
          },
        },
      }),
    [darkMode],
  );
  return (
    <ThemeProvider theme={theme}>
      <style>{darkMode ? '::-webkit-scrollbar-thumb{background:#333}::-webkit-scrollbar-track{background:#777}' : '::-webkit-scrollbar-thumb{background:#ddd}::-webkit-scrollbar-track{background:#ccc}'}</style>
      <GradientAnimation darkMode={darkMode} />
      <Header darkMode={darkMode} setDarkMode={setDarkMode} showSnackbar={showSnackbar} setGradient={handleSetGradient} />
      <Snackbar open={snackbarOpen} autoHideDuration={2500} onClose={hideSnackbar} message={snackbarMsg} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} />
      <GradientPreview gradient={gradient} />
      <main>
        <Container>
          <Grid container spacing={2} sx={{ alignItems: 'stretch' }}>
            <Grid mb={2} size={{ xs: 12, md: 8 }}>
              <Card sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                <CardContent sx={{ flex: 1 }}>
                  <GradientBar gradient={gradient} selectedStopId={selectedStopId} onStopSelect={setSelectedStopId} onAddStop={addColorStop} onUpdateStop={updateColorStop} />
                </CardContent>
              </Card>
            </Grid>
            <Grid mb={2} size={{ xs: 12, md: 4 }}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Output gradient={gradient} showSnackbar={showSnackbar} />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Grid container spacing={2} className="editor-section" sx={{ alignItems: 'stretch' }}>
            <Grid mb={2} size={{ xs: 12, md: 4 }}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <ColorPicker selectedStop={gradient.colorStops.find((stop) => stop.id === selectedStopId)} onColorChange={(color) => updateColorStop(selectedStopId, { color })} onOpacityChange={(opacity) => updateColorStop(selectedStopId, { opacity })} />
                </CardContent>
              </Card>
            </Grid>
            <Grid mb={2} size={{ xs: 12, md: 4 }}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <ColorStops colorStops={gradient.colorStops} selectedStopId={selectedStopId} onStopSelect={setSelectedStopId} onUpdateStop={updateColorStop} onDeleteStop={deleteColorStop} />
                </CardContent>
              </Card>
            </Grid>
            <Grid mb={2} size={{ xs: 12, md: 4 }}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Controls
                    type={gradient.type}
                    angle={gradient.angle}
                    onTypeChange={updateGradientType}
                    onAngleChange={updateGradientAngle}
                    conicPosition={gradient.conicPosition}
                    onConicPositionChange={updateConicPosition}
                    radialDirection={gradient.radialDirection}
                    onRadialDirectionChange={updateRadialDirection}
                    radialSize={gradient.radialSize}
                    onRadialSizeChange={updateRadialSize}
                    repeating={gradient.repeating}
                    onRepeatingChange={updateRepeating}
                    hue={hue}
                    onHueChange={handleHueChange}
                    saturation={saturation}
                    onSaturationChange={handleSaturationChange}
                    lightness={lightness}
                    onLightnessChange={handleLightnessChange}
                  />
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
