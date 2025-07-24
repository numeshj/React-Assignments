import BackToHome from "../component/BackToHome";
import "../assignments/ASG_37.css";
import { useState, useRef } from "react";

export default function ASG_37() {
  
const [frame, setFrame] = useState({})
const [rangeValue, setRangeValue] = useState(80)
const [selectedArea, setSelectedArea] = useState(null)
const [capturedImageData, setCapturedImageData] = useState(null)
const [isDragging, setIsDragging] = useState(false)
const [originalImageData, setOriginalImageData] = useState(null)
const canvasRef = useRef(null)
const overlayCanvasRef = useRef(null)

// Load image onto canvas and store original data
const loadImage = () => {
  const canvas = canvasRef.current
  const ctx = canvas.getContext('2d')
  const img = new Image()
  
  img.onload = () => {
    canvas.width = img.width
    canvas.height = img.height
    ctx.drawImage(img, 0, 0)
    
    // Store original image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    setOriginalImageData(imageData)
  }
  img.src = "./asg36.png"
}

// Initialize canvas when component mounts
useState(() => {
  setTimeout(loadImage, 100)
}, [])

const onMouseMove = (event) => {
  const canvas = canvasRef.current
  const rect = canvas.getBoundingClientRect()
  const newFrame = {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
    id: crypto.randomUUID(),
  }
  setFrame(newFrame)
  
  // Draw hover frame on overlay canvas
  drawHoverFrame(newFrame.x, newFrame.y)
}

// Draw hover frame using canvas
const drawHoverFrame = (x, y) => {
  if (isDragging) return
  
  const overlayCanvas = overlayCanvasRef.current
  const ctx = overlayCanvas.getContext('2d')
  
  // Clear overlay
  ctx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height)
  
  // Draw hover frame
  ctx.strokeStyle = '#0000ff'
  ctx.lineWidth = 2
  ctx.strokeRect(x - rangeValue/2, y - rangeValue/2, rangeValue, rangeValue)
}

// Capture image section using getImageData
const captureImageSection = (x, y, size) => {
  const canvas = canvasRef.current
  const ctx = canvas.getContext('2d')
  
  // Calculate capture area bounds
  const startX = Math.max(0, Math.floor(x - size/2))
  const startY = Math.max(0, Math.floor(y - size/2))
  const width = Math.min(size, canvas.width - startX)
  const height = Math.min(size, canvas.height - startY)
  
  // Get image data from the specified area
  const imageData = ctx.getImageData(startX, startY, width, height)
  
  return {
    data: imageData,
    startX,
    startY,
    width,
    height
  }
}

// Place image data at new location using putImageData
const placeImageData = (imageDataInfo, newX, newY) => {
  const canvas = canvasRef.current
  const ctx = canvas.getContext('2d')
  
  const startX = Math.max(0, Math.floor(newX - imageDataInfo.width/2))
  const startY = Math.max(0, Math.floor(newY - imageDataInfo.height/2))
  
  // Put the captured image data at new location
  ctx.putImageData(imageDataInfo.data, startX, startY)
}

// Draw selection area outline
const drawSelectionArea = (x, y, size) => {
  const overlayCanvas = overlayCanvasRef.current
  const ctx = overlayCanvas.getContext('2d')
  
  ctx.strokeStyle = '#ff0000'
  ctx.lineWidth = 3
  ctx.setLineDash([5, 5])
  ctx.strokeRect(x - size/2, y - size/2, size, size)
  ctx.setLineDash([])
}

// Draw moving captured frame
const drawMovingFrame = (x, y) => {
  if (!capturedImageData) return
  
  const overlayCanvas = overlayCanvasRef.current
  const ctx = overlayCanvas.getContext('2d')
  
  // Clear previous frame
  ctx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height)
  
  // Draw selection area if exists
  if (selectedArea) {
    drawSelectionArea(selectedArea.x, selectedArea.y, selectedArea.size)
  }
  
  // Draw moving frame with captured data
  const tempCanvas = document.createElement('canvas')
  const tempCtx = tempCanvas.getContext('2d')
  tempCanvas.width = capturedImageData.width
  tempCanvas.height = capturedImageData.height
  tempCtx.putImageData(capturedImageData.data, 0, 0)
  
  ctx.strokeStyle = '#00ff00'
  ctx.lineWidth = 2
  ctx.strokeRect(x - rangeValue/2, y - rangeValue/2, rangeValue, rangeValue)
  
  // Draw the captured image data preview
  ctx.drawImage(tempCanvas, x - rangeValue/2, y - rangeValue/2, rangeValue, rangeValue)
}

const onMouseDown = (e) => {
  if (!frame.x || !frame.y) return
  
  if (selectedArea && capturedImageData) {
    // Place the captured image data at new location
    placeImageData(capturedImageData, frame.x, frame.y)
  } else {
    // First selection - capture the area using getImageData
    const captured = captureImageSection(frame.x, frame.y, rangeValue)
    setSelectedArea({
      x: frame.x,
      y: frame.y,
      size: rangeValue
    })
    setCapturedImageData(captured)
    setIsDragging(true)
    
    // Draw selection area
    const overlayCanvas = overlayCanvasRef.current
    const ctx = overlayCanvas.getContext('2d')
    ctx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height)
    drawSelectionArea(frame.x, frame.y, rangeValue)
  }
}

const resetOrigin = () => {
  // Reset to original image using putImageData
  if (originalImageData) {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.putImageData(originalImageData, 0, 0)
  }
  
  // Clear overlay
  const overlayCanvas = overlayCanvasRef.current
  const ctx = overlayCanvas.getContext('2d')
  ctx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height)
  
  setSelectedArea(null)
  setCapturedImageData(null)
  setIsDragging(false)
  setFrame({})
}

// Update overlay when frame changes and dragging
useState(() => {
  if (frame.x && isDragging && capturedImageData) {
    drawMovingFrame(frame.x, frame.y)
  }
}, [frame, isDragging, capturedImageData])

  return (
    <div className="asg37">
      <BackToHome />
      <h1 className="assignment-title">Assignment-37 - Canvas ImageData Clone</h1>
      <hr />
      <br />
      <div className="controls">
        <input 
          className="range-selection" 
          type="range" 
          max="120" 
          min="40" 
          value={rangeValue}
          disabled={isDragging}
          onChange={(e) => setRangeValue(parseInt(e.target.value))}
        />
        <button className="range-button" onClick={resetOrigin}>Reset Origin</button>
      </div>
      <div className="canvas-container">
        <canvas
          ref={canvasRef}
          className="main-canvas"
          onMouseMove={onMouseMove}
          onMouseDown={onMouseDown}
          width={800}
          height={600}
        />
        <canvas
          ref={overlayCanvasRef}
          className="overlay-canvas"
          width={800}
          height={600}
        />
      </div>
    </div>
  );
}
