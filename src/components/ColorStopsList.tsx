import React from 'react';
import type { ColorStop } from '../App';
interface ColorStopsListProps {
  colorStops: ColorStop[];
  selectedStopId: string;
  onStopSelect: (id: string) => void;
  onUpdateStop: (id: string, updates: Partial<ColorStop>) => void;
  onDeleteStop: (id: string) => void;
}
const ColorStopsList: React.FC<ColorStopsListProps> = ({ colorStops, selectedStopId, onStopSelect, onUpdateStop, onDeleteStop }) => {
  const sortedStops = [...colorStops].sort((a, b) => a.position - b.position);
  const handlePositionChange = (id: string, value: string) => {
    const position = parseFloat(value);
    if (!isNaN(position)) {
      const roundedPosition = Math.round(Math.max(0, Math.min(100, position)) * 10) / 10;
      onUpdateStop(id, { position: roundedPosition });
    }
  };
  return (
    <div className="color-stops-list">
      {sortedStops.map((stop) => (
        <div key={stop.id} className={`color-stop-item-inline ${selectedStopId === stop.id ? 'selected' : ''}`} onClick={() => onStopSelect(stop.id)}>
          <div className="stop-color-box" style={{ backgroundColor: stop.color }}></div>
          <div className="stop-hex-input">
            <input type="text" value={stop.color.toUpperCase()} onChange={(e) => onUpdateStop(stop.id, { color: e.target.value })} className="hex-input-inline" onClick={(e) => e.stopPropagation()} />
          </div>
          <div className="stop-position-input">
            <input type="number" value={Math.round(stop.position)} onChange={(e) => handlePositionChange(stop.id, e.target.value)} min="0" max="100" className="position-input-inline" onClick={(e) => e.stopPropagation()} />
          </div>
          {colorStops.length > 2 && (
            <button
              className="delete-stop-btn-inline"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteStop(stop.id);
              }}
              title="Delete color stop"
            >
              ×
            </button>
          )}
        </div>
      ))}
    </div>
  );
};
export default ColorStopsList;
