import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Card, CardMedia, CardContent, FormControl, InputLabel, Select, MenuItem, Button, Popper, ClickAwayListener, Badge } from '@mui/material';
import { getGradientPresets } from '../modules/contentful';
import useLocalStorage from '../helpers/useLocalStorage';
import FilterAltTwoToneIcon from '@mui/icons-material/FilterAltTwoTone';

const Library: React.FC = () => {
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const filterPopperOpen = Boolean(filterAnchorEl);
  interface GradientPreset {
    id: string;
    title: string;
    rawInput: string;
    type: string;
    tags: string;
    angle: number;
    lightness: string;
    colorStops: string[];
  }
  const [presets, setPresets] = useState<GradientPreset[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [cachedPresets, setCachedPresets] = useLocalStorage<GradientPreset[]>('gradient_presets', []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const PAGE_SIZE = 20;
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedStops, setSelectedStops] = useState<string>('');
  const [selectedLightness, setSelectedLightness] = useState<string>('');
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        if (cachedPresets && cachedPresets.length > 0) {
          setPresets(cachedPresets);
          setHasMore(true);
          setOffset(cachedPresets.length);
          // Fetch total for badge
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
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
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
        <Box display="inline-block" position="relative">
          <ClickAwayListener onClickAway={() => setFilterAnchorEl(null)}>
            <Box display="inline-block" position="relative">
              <FilterAltTwoToneIcon sx={{ cursor: 'pointer' }} onClick={(e) => setFilterAnchorEl(filterPopperOpen ? null : (e.currentTarget as unknown as HTMLElement))} />
              <Popper open={filterPopperOpen} anchorEl={filterAnchorEl} placement="bottom-end" disablePortal>
                <Box sx={{ p: 2, bgcolor: 'background.paper', boxShadow: 3, borderRadius: 2, minWidth: 260, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <FormControl>
                    <InputLabel>Type</InputLabel>
                    <Select label="Type" value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                      <MenuItem value="" selected>
                        All
                      </MenuItem>
                      <MenuItem value="linear">Linear</MenuItem>
                      <MenuItem value="radial">Radial</MenuItem>
                      <MenuItem value="elliptical">Elliptical</MenuItem>
                      <MenuItem value="conic">Conic</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl>
                    <InputLabel>Color Stops</InputLabel>
                    <Select label="Color Stops" value={selectedStops} onChange={(e) => setSelectedStops(e.target.value)}>
                      <MenuItem value="" selected>
                        All
                      </MenuItem>
                      {[2, 3, 4, 5, 6, 7].map((n) => (
                        <MenuItem key={n} value={String(n)}>
                          {n}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl>
                    <InputLabel>Brightness</InputLabel>
                    <Select label="Darkness" value={selectedLightness} onChange={(e) => setSelectedLightness(e.target.value)}>
                      <MenuItem value="" selected>
                        All
                      </MenuItem>
                      {[...Array(10)].map((_, i) => (
                        <MenuItem key={i + 1} value={String(i + 1)}>
                          {10 - i}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl>
                    <InputLabel>Tags</InputLabel>
                    <Select label="Tags" value={selectedTags} onChange={(e) => setSelectedTags(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value)} renderValue={(selected) => (selected as string[]).join(', ')} sx={{ textTransform: 'capitalize' }}>
                      <MenuItem value="" selected>
                        All
                      </MenuItem>
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
              </Popper>
            </Box>
          </ClickAwayListener>
        </Box>
      </Box>
      {error && <Typography color="error">{error}</Typography>}
      <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(220px, 1fr))" gap={2} mt={2}>
        {presets
          .filter((preset: GradientPreset) => {
            if (selectedType) {
              const type = Array.isArray(preset.type) ? preset.type[0] : preset.type;
              if (!(type && type.toLowerCase() === selectedType)) return false;
            }
            if (selectedStops !== '') {
              const stops = Array.isArray(preset.colorStops) ? preset.colorStops.length : Object.keys(preset.colorStops).length;
              if (String(stops) !== selectedStops) return false;
            }
            if (selectedLightness) if (String(preset.lightness) !== selectedLightness) return false;
            if (selectedTags.length > 0) {
              const presetTags = preset.tags ? preset.tags.split(',').map((tag: string) => tag.trim()) : [];
              if (!selectedTags.every((tag) => presetTags.includes(tag))) return false;
            }
            return true;
          })
          .map((preset: GradientPreset) => (
            <Card key={preset.id} sx={{ backgroundColor: 'rgba(125, 125, 125, 0.1)' }} title={preset.title}>
              <CardMedia sx={{ height: 140 }} style={{ background: preset.rawInput }} />
              <CardContent sx={{ padding: '0.5rem 1rem 0.5rem !important' }}>
                <Typography gutterBottom sx={{ fontSize: '1rem', m: 0 }}>
                  {preset.title}
                </Typography>
                {/* <Table sx={{ textTransform: 'capitalize', mb: 2, '& td': { padding: '0.125rem 0.5rem', fontSize: '0.75rem', '&:last-child': { textAlign: 'right' } } }}>
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
                    <Chip variant="outlined" key={i} label={tag.trim()} size="small" sx={{ fontSize: '0.75rem', color: 'text.secondary', borderRadius: '4px', textTransform: 'capitalize', p: '1px 5px', height: 'auto', '& span': { p: 0 } }} />
                  ))}
                </Stack> */}
              </CardContent>
            </Card>
          ))}
      </Box>
      {loading && (
        <Box mt={2} mx="auto" display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      )}
      {!loading && hasMore && (
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
