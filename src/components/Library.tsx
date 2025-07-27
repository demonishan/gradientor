import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Card, CardMedia, CardContent, FormControl, InputLabel, Select, MenuItem, Button, Badge } from '@mui/material';
import { getGradientPresets } from '../modules/contentful';
import useLocalStorage from '../helpers/useLocalStorage';

const Library: React.FC = () => {
  interface GradientPreset {
    id: string;
    title: string;
    tags: string;
    lightness: string;
    colorStops: string[];
    linearGradient: string;
  }
  const PAGE_SIZE = 20;
  const [presets, setPresets] = useState<GradientPreset[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [cachedPresets, setCachedPresets] = useLocalStorage<GradientPreset[]>('gradient_presets', []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [selectedStops, setSelectedStops] = useState<string>('');
  const [selectedLightness, setSelectedLightness] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const filtersActive = selectedStops || selectedLightness || selectedTags.length > 0;
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        if (cachedPresets && cachedPresets.length > 0) {
          setPresets(cachedPresets);
          const { total } = await getGradientPresets(1, 0);
          setTotal(total);
        } else {
          const { items, total } = await getGradientPresets(PAGE_SIZE, 0);
          setPresets(items);
          setCachedPresets(items);
          setTotal(total);
          setHasMore(items.length + 0 < total);
          setOffset(items.length);
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load presets');
      } finally {
        setLoading(false);
      }
    })();
  }, [cachedPresets, setCachedPresets]);
  useEffect(() => {
    if (filtersActive) {
      setOffset(0);
      setHasMore(false);
    } else setHasMore(presets.length < total);
  }, [selectedStops, selectedLightness, selectedTags, presets, total]);
  const handleLoadMore = async () => {
    setLoading(true);
    try {
      const { items: moreItems, total: apiTotal } = await getGradientPresets(PAGE_SIZE, offset);
      setPresets((prev) => {
        const updated = [...prev, ...moreItems];
        setCachedPresets(updated);
        return updated;
      });
      setTotal(apiTotal);
      setOffset((prev) => prev + moreItems.length);
      setHasMore(offset + moreItems.length < apiTotal);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load more presets');
    } finally {
      setLoading(false);
    }
  };
  const allTags = React.useMemo(() => {
    const tagSet = new Set<string>();
    presets.forEach((preset: GradientPreset) => {
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
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h5" m={0}>
          <Badge max={1000} badgeContent={total} sx={{ color: 'inherit.main' }}>
            Gradient Presets Library
          </Badge>
        </Typography>
        <Box display={'flex'} alignItems="center">
          <FormControl size="small" sx={{ width: 100, mr: 1 }}>
            <InputLabel>Stops</InputLabel>
            <Select label="Stops" value={selectedStops} onChange={(e) => setSelectedStops(e.target.value)}>
              <MenuItem value="">All</MenuItem>
              {[2, 3, 4, 5, 6, 7].map((n) => (
                <MenuItem key={n} value={String(n)}>
                  {n}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ width: 130, mr: 1 }}>
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
          <FormControl size="small" sx={{ width: 90 }}>
            <InputLabel>Tags</InputLabel>
            <Select label="Tags" value={selectedTags} onChange={(e) => setSelectedTags(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value)} renderValue={(selected) => (selected as string[]).join(', ')} sx={{ textTransform: 'capitalize' }}>
              <MenuItem value="">All</MenuItem>
              {allTags.map((tag) => (
                <MenuItem key={tag} value={tag} sx={{ textTransform: 'capitalize' }}>
                  {tag}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            size="small"
            variant="text"
            color="inherit"
            onClick={() => {
              setSelectedStops('');
              setSelectedLightness('');
              setSelectedTags([]);
            }}
          >
            Reset
          </Button>
        </Box>
      </Box>
      {error && <Typography color="error">{error}</Typography>}
      <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(220px, 1fr))" gap={2} mt={2}>
        {(() => {
          const filtered = presets.filter((preset) => {
            if (selectedStops && String(preset.colorStops.length) !== selectedStops) return false;
            if (selectedLightness && String(preset.lightness) !== selectedLightness) return false;
            if (selectedTags.length > 0) {
              const presetTags = preset.tags ? preset.tags.split(',').map((tag) => tag.trim()) : [];
              if (!selectedTags.every((tag) => presetTags.includes(tag))) return false;
            }
            return true;
          });
          if (filtered.length === 0 && !loading) {
            return <Typography sx={{ gridColumn: '1/-1', textAlign: 'center', color: 'text.secondary', mt: 4 }}>No presets match your filter.</Typography>;
          }
          return filtered.map((preset) => (
            <Card key={preset.id} sx={{ backgroundColor: 'rgba(125, 125, 125, 0.1)' }} title={preset.title}>
              <CardMedia sx={{ height: 140, background: preset.linearGradient }} />
              <CardContent sx={{ padding: '0.5rem 1rem 0.5rem !important' }}>
                <Typography variant="h6" sx={{ fontSize: '0.875rem', m: 0 }}>
                  {preset.title}
                </Typography>
              </CardContent>
            </Card>
          ));
        })()}
      </Box>
      {!filtersActive && loading && (
        <Box mt={2} mx="auto" display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      )}
      {!filtersActive && !loading && hasMore && (
        <Box mt={5} display="flex" justifyContent="center">
          <Button onClick={handleLoadMore} variant="outlined" color="inherit">
            Load More
          </Button>
        </Box>
      )}
      {!loading && !hasMore && presets.length === 0 && <Typography>No presets found.</Typography>}
    </Box>
  );
};

export default Library;
