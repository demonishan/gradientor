import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Card, CardMedia, CardContent, Chip, Stack, FormControl, InputLabel, Select, MenuItem, Button, TableRow, Table, TableCell } from '@mui/material';
import { getGradientPresets } from '../modules/contentful';

const Library: React.FC = () => {
  const [presets, setPresets] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const PAGE_SIZE = 12;
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedStops, setSelectedStops] = useState<string>('');
  const [selectedLightness, setSelectedLightness] = useState<string>('');
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await getGradientPresets(PAGE_SIZE, 0);
        setPresets(Array.isArray(data) ? data : []);
        setHasMore(data.length === PAGE_SIZE);
        setOffset(data.length);
      } catch (err: any) {
        setError(err.message || 'Failed to load presets');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleLoadMore = async () => {
    setLoading(true);
    try {
      const moreData = await getGradientPresets(PAGE_SIZE, offset);
      setPresets((prev) => [...prev, ...moreData]);
      setHasMore(moreData.length === PAGE_SIZE);
      setOffset((prev) => prev + moreData.length);
    } catch (err: any) {
      setError(err.message || 'Failed to load more presets');
    } finally {
      setLoading(false);
    }
  };
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const allTags = React.useMemo(() => {
    const tagSet = new Set<string>();
    presets.forEach((preset: any) => {
      if (preset.tags) {
        preset.tags.split(',').forEach((tag: string) => {
          const trimmed = tag.trim();
          if (trimmed) tagSet.add(trimmed);
        });
      }
    });
    return Array.from(tagSet);
  }, [presets]);
  return (
    <Box p={2}>
      <Typography variant="h5" gutterBottom>
        Gradient Presets Library
      </Typography>
      <Box display="flex" gap={2} alignItems="center">
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Type</InputLabel>
          <Select label="Type" value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
            <MenuItem value="">All</MenuItem>
            <MenuItem value="linear">Linear</MenuItem>
            <MenuItem value="radial">Radial</MenuItem>
            <MenuItem value="elliptical">Elliptical</MenuItem>
            <MenuItem value="conic">Conic</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Color Stops</InputLabel>
          <Select label="Color Stops" value={selectedStops} onChange={(e) => setSelectedStops(e.target.value)}>
            <MenuItem value="">All</MenuItem>
            {[2, 3, 4, 5, 6, 7].map((n) => (
              <MenuItem key={n} value={String(n)}>
                {n}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Brightness</InputLabel>
          <Select label="Darkness" value={selectedLightness} onChange={(e) => setSelectedLightness(e.target.value)}>
            <MenuItem value="">All</MenuItem>
            {[...Array(10)].map((_, i) => (
              <MenuItem key={i + 1} value={String(i + 1)}>
                {10 - i}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel>Tags</InputLabel>
          <Select label="Tags" value={selectedTags} onChange={(e) => setSelectedTags(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value)} renderValue={(selected) => (selected as string[]).join(', ')} sx={{ textTransform: 'capitalize' }}>
            {allTags.map((tag) => (
              <MenuItem key={tag} value={tag} sx={{ textTransform: 'capitalize' }}>
                {tag}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="text"
          color="inherit"
          onClick={() => {
            setSelectedType('');
            setSelectedStops('');
            setSelectedLightness('');
            setSelectedTags([]);
          }}
        >
          Reset
        </Button>
      </Box>
      {error && <Typography color="error">{error}</Typography>}
      <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(220px, 1fr))" gap={2} mt={2}>
        {presets
          .filter((preset: any) => {
            if (selectedType) {
              const type = Array.isArray(preset.type) ? preset.type[0] : preset.type;
              if (!(type && type.toLowerCase() === selectedType)) return false;
            }
            if (selectedStops !== '') {
              const stops = Array.isArray(preset.colorStops) ? preset.colorStops.length : Object.keys(preset.colorStops).length;
              if (String(stops) !== selectedStops) return false;
            }
            if (selectedLightness) {
              if (String(preset.lightness) !== selectedLightness) return false;
            }
            if (selectedTags.length > 0) {
              const presetTags = preset.tags ? preset.tags.split(',').map((tag: string) => tag.trim()) : [];
              if (!selectedTags.every((tag) => presetTags.includes(tag))) return false;
            }
            return true;
          })
          .map((preset: any) => (
            <Card key={preset.id} sx={{ backgroundColor: 'rgba(125, 125, 125, 0.1)' }} title={preset.title}>
              <CardMedia sx={{ height: 140 }} style={{ background: preset.rawInput }} />
              <CardContent>
                <Typography gutterBottom variant="subtitle2" component="div" sx={{ fontSize: '1rem' }}>
                  {preset.title}
                </Typography>
                <Table sx={{ textTransform: 'capitalize', mb: 2, '& td': { padding: '0.5rem 0' } }}>
                  <TableRow>
                    <TableCell>Type</TableCell>
                    <TableCell>{preset.type}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Angle</TableCell>
                    <TableCell>{preset.angle}deg</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Brightness</TableCell>
                    <TableCell>{11 - Number(preset.lightness)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Color Stops</TableCell>
                    <TableCell>{Object.keys(preset.colorStops).length}</TableCell>
                  </TableRow>
                </Table>
                <Stack mt={1} display={'flex'} flexDirection={'row'} flexWrap="wrap" gap={0.25}>
                  {preset.tags.split(',').map((tag: string, i: number) => (
                    <Chip variant="outlined" key={i} label={tag.trim()} size="small" sx={{ color: 'text.secondary', borderRadius: '4px', textTransform: 'capitalize' }} />
                  ))}
                </Stack>
              </CardContent>
            </Card>
          ))}
      </Box>
      {loading && (
        <Box mt={2}>
          <CircularProgress />
        </Box>
      )}
      {!loading && hasMore && (
        <Box mt={2} display="flex" justifyContent="center">
          <button onClick={handleLoadMore} style={{ padding: '8px 24px', fontSize: '1rem', borderRadius: '6px', border: 'none', background: '#eee', cursor: 'pointer' }}>
            Load More
          </button>
        </Box>
      )}
      {!loading && !hasMore && presets.length === 0 && <Typography>No presets found.</Typography>}
    </Box>
  );
};

export default Library;
