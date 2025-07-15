import { useState } from 'react'
import './App.css'
import GradientBar from './components/GradientBar'
import ColorPicker from './components/ColorPicker'
import ColorStopsList from './components/ColorStopsList'
import GradientControls from './components/GradientControls'
import CSSOutput from './components/CSSOutput'
export interface ColorStop {
  id: string
  color: string
  position: number
}
export interface GradientConfig {
  type: 'linear' | 'radial'
  angle: number
  colorStops: ColorStop[]
}
const App = () => {
  const [gradient, setGradient] = useState<GradientConfig>({
    type: 'linear',
    angle: 90,
    colorStops: [
      { id: '1', color: '#ff0000', position: 0 },
      { id: '2', color: '#0000ff', position: 100 }
    ]
  })
  const [selectedStopId, setSelectedStopId] = useState<string>('1')
  const addColorStop = (position: number) => {
    const newStop: ColorStop = {
      id: Date.now().toString(),
      color: '#ffffff',
      position
    }
    setGradient(prev => ({
      ...prev,
      colorStops: [...prev.colorStops, newStop].sort((a, b) => a.position - b.position)
    }))
    setSelectedStopId(newStop.id)
  }
  const updateColorStop = (id: string, updates: Partial<ColorStop>) => {
    setGradient(prev => ({
      ...prev,
      colorStops: prev.colorStops.map(stop =>
        stop.id === id ? { ...stop, ...updates } : stop
      )
    }))
  }
  const deleteColorStop = (id: string) => {
    if (gradient.colorStops.length <= 2) return
    setGradient(prev => ({
      ...prev,
      colorStops: prev.colorStops.filter(stop => stop.id !== id)
    }))
    if (selectedStopId === id) 
      setSelectedStopId(gradient.colorStops[0].id)
  }
  const updateGradientType = (type: 'linear' | 'radial') => {
    setGradient(prev => ({ ...prev, type }))
  }
  const updateGradientAngle = (angle: number) => {
    setGradient(prev => ({ ...prev, angle }))
  }
  return (
    <div className="app">
      <header className="app-header">
        <h1>CSS Gradient Generator</h1>
      </header>
      <main className="app-main">
        <div className="gradient-section">
          <GradientBar gradient={gradient} selectedStopId={selectedStopId} onStopSelect={setSelectedStopId} onAddStop={addColorStop} onUpdateStop={updateColorStop} />
          <div className="gradient-controls-inline">
            <GradientControls type={gradient.type} angle={gradient.angle} onTypeChange={updateGradientType} onAngleChange={updateGradientAngle} />
          </div>
        </div>
        <div className="editor-section">
          <div className="left-panel">
            <h3>Picker</h3>
            <ColorPicker selectedStop={gradient.colorStops.find(stop => stop.id === selectedStopId)} onColorChange={(color: string) => updateColorStop(selectedStopId, { color })} />
          </div>
          <div className="middle-panel">
            <h3>Hex</h3>
            <div className="hex-input-section">
              {gradient.colorStops.find(stop => stop.id === selectedStopId) && (
                <input type="text" value={gradient.colorStops.find(stop => stop.id === selectedStopId)?.color || ''} onChange={(e) => updateColorStop(selectedStopId, { color: e.target.value })} className="hex-input-main" />
              )}
            </div>
          </div>
          <div className="right-panel">
            <h3>Stops</h3>
            <ColorStopsList colorStops={gradient.colorStops} selectedStopId={selectedStopId} onStopSelect={setSelectedStopId} onUpdateStop={updateColorStop} onDeleteStop={deleteColorStop} />
          </div>
        </div>
        <div className="output-section">
          <CSSOutput gradient={gradient} />
        </div>
      </main>
    </div>
  )
}
export default App
