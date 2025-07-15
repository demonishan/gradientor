import React from 'react'
import './GradientControls.css'
interface GradientControlsProps {
  type: 'linear' | 'radial'
  angle: number
  onTypeChange: (type: 'linear' | 'radial') => void
  onAngleChange: (angle: number) => void
}
const GradientControls: React.FC<GradientControlsProps> = ({
  type,
  angle,
  onTypeChange,
  onAngleChange
}) => {
  const handleAngleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAngle = parseInt(e.target.value)
    if (!isNaN(newAngle)) onAngleChange(newAngle)
  }
  const handleAngleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    const circle = e.currentTarget as HTMLElement
    const rect = circle.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const updateAngle = (clientX: number, clientY: number) => {
      const deltaX = clientX - centerX
      const deltaY = clientY - centerY
      let newAngle = Math.atan2(deltaY, deltaX) * (180 / Math.PI)
      newAngle = (newAngle + 90) % 360
      if (newAngle < 0) newAngle += 360
      onAngleChange(Math.round(newAngle))
    }
    const handleMouseMove = (e: MouseEvent) => {
      updateAngle(e.clientX, e.clientY)
    }
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
    updateAngle(e.clientX, e.clientY)
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }
  return (
    <div className="gradient-controls-inline">
      {type === 'linear' && (
        <div className="angle-display">
          <div className="angle-circle" onMouseDown={handleAngleMouseDown}>
            <div className="angle-indicator" style={{ transform: `rotate(${angle}deg)` }}></div>
          </div>
          <input type="number" value={angle} onChange={handleAngleChange} min="0" max="360" className="angle-input-inline" />
        </div>
      )}
      <div className="gradient-type-switch">
        <div className="switch-container">
          <div 
            className={`switch-slider ${type === 'linear' ? 'active' : ''}`}
            onClick={() => onTypeChange(type === 'linear' ? 'radial' : 'linear')}
          />
          <span 
            className={`switch-label left ${type === 'radial' ? 'active' : ''}`}
            onClick={() => onTypeChange('radial')}
          >
            Radial
          </span>
          <span 
            className={`switch-label right ${type === 'linear' ? 'active' : ''}`}
            onClick={() => onTypeChange('linear')}
          >
            Linear
          </span>
        </div>
      </div>
    </div>
  )
}
export default GradientControls
