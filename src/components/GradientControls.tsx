import React from 'react';
interface GradientControlsProps {
  type: 'linear' | 'radial' | 'conic';
  angle: number;
  onTypeChange: (type: 'linear' | 'radial' | 'conic') => void;
  onAngleChange: (angle: number) => void;
  radialDirection?: string;
  onRadialDirectionChange?: (dir: string) => void;
}
const GradientControls: React.FC<
  GradientControlsProps & {
    conicPosition?: { x: number; y: number };
    onConicPositionChange?: (pos: { x: number; y: number }) => void;
  }
> = ({ type, angle, onTypeChange, onAngleChange, conicPosition = { x: 50, y: 50 }, onConicPositionChange, radialDirection = 'center', onRadialDirectionChange }) => {
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
    if (!isNaN(num)) {
      onConicPositionChange({ ...conicPosition, [name]: num });
    }
  };
  return (
    <div className="gradient-controls-panel-content">
      {(type === 'linear' || type === 'conic') && (
        <div className="angle-display">
          <div className="angle-circle" onMouseDown={type === 'linear' || type === 'conic' ? handleAngleMouseDown : undefined}>
            <div className="angle-indicator" style={{ transform: `rotate(${angle}deg)` }}></div>
          </div>
          <input type="number" value={angle} onChange={handleAngleChange} min="0" max="360" className="angle-input-inline" />
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
        </div>
      )}
      {type === 'radial' && onRadialDirectionChange && (
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
      <div className="gradient-type-btn-group">
        <button type="button" className={`type-btn${type === 'linear' ? ' active' : ''}`} aria-pressed={type === 'linear'} onClick={() => onTypeChange('linear')}>
          Linear
        </button>
        <button type="button" className={`type-btn${type === 'radial' ? ' active' : ''}`} aria-pressed={type === 'radial'} onClick={() => onTypeChange('radial')}>
          Radial
        </button>
        <button type="button" className={`type-btn${type === 'conic' ? ' active' : ''}`} aria-pressed={type === 'conic'} onClick={() => onTypeChange('conic')}>
          Conic
        </button>
      </div>
    </div>
  );
};
export default GradientControls;
