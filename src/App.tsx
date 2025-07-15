import { useState } from 'react'
import './App.css'
import GradientBar from './components/GradientBar'
import ColorPicker from './components/ColorPicker'
import ColorStopsList from './components/ColorStopsList'
import GradientControls from './components/GradientControls'
import CSSOutput from './components/CSSOutput'
import GradientPreview from './components/GradientPreview'
import logo from './assets/logo.webp'
export interface ColorStop {
  id: string
  color: string
  position: number
  opacity: number
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
      { id: '1', color: '#ff0000', position: 0, opacity: 1 },
      { id: '2', color: '#0000ff', position: 100, opacity: 1 }
    ]
  })
  const [selectedStopId, setSelectedStopId] = useState<string>('1')
  const addColorStop = (position: number) => {
    const newStop: ColorStop = {
      id: Date.now().toString(),
      color: '#ffffff',
      position,
      opacity: 1
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
        <div className="header-content">
          <img src={logo} alt="Gradientor Logo" className="app-logo" />
        </div>
      </header>
      <GradientPreview gradient={gradient} />
      <main className="app-main">
        <div className="gradient-panels">
          <div className="gradient-display-panel">
            <GradientBar gradient={gradient} selectedStopId={selectedStopId} onStopSelect={setSelectedStopId} onAddStop={addColorStop} onUpdateStop={updateColorStop} />
          </div>
          <div className="gradient-controls-panel">
            <GradientControls type={gradient.type} angle={gradient.angle} onTypeChange={updateGradientType} onAngleChange={updateGradientAngle} />
          </div>
        </div>
        <div className="editor-section">
          <div className="left-panel">
            <h3>Picker</h3>
            <ColorPicker 
              selectedStop={gradient.colorStops.find(stop => stop.id === selectedStopId)} 
              onColorChange={color => updateColorStop(selectedStopId, { color })} 
              onOpacityChange={opacity => updateColorStop(selectedStopId, { opacity })}
            />
          </div>
          <div className="right-panel">
            <h3>Stops</h3>
            <ColorStopsList colorStops={gradient.colorStops} selectedStopId={selectedStopId} onStopSelect={setSelectedStopId} onUpdateStop={updateColorStop} onDeleteStop={deleteColorStop} />
          </div>
          <div className="third-panel">
            <h3>CSS</h3>
            <CSSOutput gradient={gradient} />
          </div>
        </div>
      </main>
    </div>
  )
}
export default App
