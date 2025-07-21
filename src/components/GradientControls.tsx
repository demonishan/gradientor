import React from 'react';
interface GradientControlsProps {
  type: 'linear' | 'radial' | 'conic' | 'elliptical';
  angle: number;
  onTypeChange: (type: 'linear' | 'radial' | 'conic' | 'elliptical') => void;
  onAngleChange: (angle: number) => void;
  radialDirection?: string;
  onRadialDirectionChange?: (dir: string) => void;
  radialSize?: string;
  onRadialSizeChange?: (size: string) => void;
}
const GradientControls: React.FC<
  GradientControlsProps & {
    conicPosition?: { x: number; y: number };
    onConicPositionChange?: (pos: { x: number; y: number }) => void;
    repeating?: boolean;
    onRepeatingChange?: (repeating: boolean) => void;
  }
> = ({ type, angle, onTypeChange, onAngleChange, conicPosition = { x: 50, y: 50 }, onConicPositionChange, radialDirection = 'center', onRadialDirectionChange, radialSize = 'farthest-side', onRadialSizeChange, repeating = false, onRepeatingChange }) => {
  const radialDirections = [
    ['at left top', 'at top', 'at right top'],
    ['at left', 'center', 'at right'],
    ['at left bottom', 'at bottom', 'at right bottom'],
  ];
  const directionLabels = [
    ['↖', '↑', '↗'],
    ['←', '•', '→'],
    ['↙', '↓', '↘'],
  ];
  const handleAngleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAngle = parseInt(e.target.value);
    if (!isNaN(newAngle)) onAngleChange(newAngle);
  };
  const handleAngleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const circle = e.currentTarget as HTMLElement;
    const rect = circle.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const updateAngle = (clientX: number, clientY: number) => {
      const deltaX = clientX - centerX;
      const deltaY = clientY - centerY;
      let newAngle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
      newAngle = (newAngle + 90) % 360;
      if (newAngle < 0) newAngle += 360;
      onAngleChange(Math.round(newAngle));
    };
    const handleMouseMove = (e: MouseEvent) => updateAngle(e.clientX, e.clientY);
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    updateAngle(e.clientX, e.clientY);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  const handleConicPositionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onConicPositionChange) return;
    const { name, value } = e.target;
    const num = parseInt(value);
    if (!isNaN(num)) onConicPositionChange({ ...conicPosition, [name]: num });
  };
  return (
    <div className="gradient-controls-panel-content">
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
        <label style={{ display: 'flex', alignItems: 'center', marginRight: 12 }}>
          <input
            type="checkbox"
            checked={repeating}
            onChange={e => onRepeatingChange && onRepeatingChange(e.target.checked)}
            style={{ marginRight: 6 }}
          />
          Repeating
        </label>
        <div className="gradient-type-btn-group">
          <button type="button" className={`type-btn${type === 'linear' ? ' active' : ''}`} aria-pressed={type === 'linear'} onClick={() => onTypeChange('linear')}>Linear</button>
          <button type="button" className={`type-btn${type === 'radial' ? ' active' : ''}`} aria-pressed={type === 'radial'} onClick={() => onTypeChange('radial')}>Radial</button>
          <button type="button" className={`type-btn${type === 'elliptical' ? ' active' : ''}`} aria-pressed={type === 'elliptical'} onClick={() => onTypeChange('elliptical')}>Elliptical</button>
          <button type="button" className={`type-btn${type === 'conic' ? ' active' : ''}`} aria-pressed={type === 'conic'} onClick={() => onTypeChange('conic')}>Conic</button>
        </div>
      </div>
      {(type === 'linear' || type === 'conic') && (
        <div className="angle-display">
          <div className="angle-circle" onMouseDown={type === 'linear' || type === 'conic' ? handleAngleMouseDown : undefined}>
            <div className="angle-indicator" style={{ transform: `rotate(${angle}deg)` }}></div>
          </div>
          <input type="number" value={angle} onChange={handleAngleChange} min="0" max="360" className="angle-input-inline" />
        </div>
      )}
      {type === 'conic' && (
        <>
          <label style={{ marginLeft: '1em', marginRight: '0.5em' }}>
            X (%)
            <input type="number" name="x" value={conicPosition.x} min="0" max="100" onChange={handleConicPositionChange} className="angle-input-inline" style={{ marginLeft: 4, width: 60 }} />
          </label>
          <label>
            Y (%)
            <input type="number" name="y" value={conicPosition.y} min="0" max="100" onChange={handleConicPositionChange} className="angle-input-inline" style={{ marginLeft: 4, width: 60 }} />
          </label>
        </>
      )}
      {(type === 'radial' || type === 'elliptical') && (
        <>
          {onRadialDirectionChange && (
            <div className="radial-direction-grid">
              {radialDirections.map((row, i) => (
                <div className="radial-direction-row" key={i}>
                  {row.map((dir, j) => (
                    <button key={dir} type="button" className={`radial-direction-btn${radialDirection === dir ? ' active' : ''}`} onClick={() => onRadialDirectionChange(dir)} aria-pressed={radialDirection === dir}>
                      {directionLabels[i][j]}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}
          {onRadialSizeChange && (
            <div>
              <label htmlFor="radial-size-select" style={{ color: '#e2e8f0', fontWeight: 500, fontSize: '0.95rem' }}>
                Size
              </label>
              <select id="radial-size-select" value={radialSize} onChange={e => onRadialSizeChange(e.target.value)} style={{ padding: '0.3rem 0.7rem', borderRadius: 4, border: '1px solid #4a5568', background: '#2d3748', color: '#e2e8f0', fontSize: '0.95rem', fontWeight: 500 }}>
                <option value="None">None</option>
                <option value="farthest-side">farthest-side</option>
                <option value="farthest-corner">farthest-corner</option>
              </select>
            </div>
          )}
        </>
      )}
    </div>
  );
};
export default GradientControls;
