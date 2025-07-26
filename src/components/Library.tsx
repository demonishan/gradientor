import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Card, CardMedia, CardContent, Chip, Stack } from '@mui/material';
import { getGradientPresets } from '../modules/contentful';
const Library: React.FC = () => {
  const [presets, setPresets] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    (async () => {
      try {
        const data = await getGradientPresets();
        if (Array.isArray(data)) {
          setPresets(data);
        } else {
          setPresets([]);
        }
        console.log('Formatted Contentful presets:', data);
      } catch (err: any) {
        setError(err.message || 'Failed to load presets');
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  return (
    <Box p={2}>
      <Typography variant="h5" gutterBottom>
        Gradient Presets Library
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : presets.length === 0 ? (
        <Typography>No presets found.</Typography>
      ) : (
        <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(220px, 1fr))" gap={2} mt={2}>
          {presets.map((preset: any) => (
            <Card key={preset.id} sx={{ backgroundColor: 'rgba(125, 125, 125, 0.1)' }} title={preset.title}>
              {(() => {
                const bg = preset.rawInput.replace(/^background:\s*/, '').replace(/;$/, '');
                return <CardMedia sx={{ height: 140 }} style={{ background: bg }} title="gradient preview" />;
              })()}
              <CardContent>
                <Typography gutterBottom variant="subtitle2" component="div" sx={{ fontSize: '1rem' }}>
                  {preset.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Type: {Array.isArray(preset.type) ? preset.type[0] : preset.type || 'NA'}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Angle: {preset.angle}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Lightness: {preset.lightness}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Stops: {Object.keys(preset.colorStops).length}
                </Typography>
                <Stack mt={1} display={'flex'} flexDirection={'row'} flexWrap="wrap" gap={0.25}>
                  {preset.tags.split(',').map((tag: string, i: number) => (
                    <Chip variant="outlined" key={i} label={tag.trim()} size="small" sx={{ color: 'text.secondary', borderRadius: '4px', textTransform: 'capitalize' }} />
                  ))}
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default Library;
