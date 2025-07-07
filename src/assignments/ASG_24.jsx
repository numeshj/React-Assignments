import React, { useState, useRef, useEffect } from "react";
import { createWorker } from "tesseract.js";
import BackToHome from "../component/BackToHome";
import "./ASG_24.css";

function ASG_24() {
  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);
  const workerRef = useRef(null);

  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [strokeColor, setStrokeColor] = useState('#000000');

  const handleClearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setText("");
    setLoading(false);
  };

  useEffect(() => {
    if (!workerRef.current) {
      workerRef.current = createWorker();
    }
  }, []);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    isDrawingRef.current = true;
  };

  const draw = (e) => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
  };

  const stopDrawing = () => {
    isDrawingRef.current = false;
  };

  // Simple function to preprocess canvas for better OCR
  const preprocessCanvas = (canvas) => {
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    
    // Scale up 2x for better recognition
    tempCanvas.width = canvas.width * 2;
    tempCanvas.height = canvas.height * 2;
    
    // White background
    tempCtx.fillStyle = 'white';
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    
    // Draw scaled image
    tempCtx.drawImage(canvas, 0, 0, tempCanvas.width, tempCanvas.height);
    
    return tempCanvas;
  };

  const handleReadCanvas = async () => {
    setLoading(true);
    setText("");

    try {
      let worker = workerRef.current;
      if (typeof worker.then === "function") {
        worker = await worker;
        workerRef.current = worker;
      }

      const canvas = canvasRef.current;
      if (!canvas) {
        setText("Canvas not available");
        setLoading(false);
        return;
      }

      // Simple preprocessing
      const processedCanvas = preprocessCanvas(canvas);
      
      // Convert to blob
      const blob = await new Promise((resolve) => 
        processedCanvas.toBlob(resolve, "image/png")
      );

      // Simple OCR recognition
      const result = await worker.recognize(blob);
      setText(result.data.text.trim());
      
    } catch (err) {
      console.error(err);
      setText("OCR Failed: " + err.message);
    }

    setLoading(false);
  };


  return (
    <>
      <BackToHome />
      <h1 className="assignment-title">Assignment-24</h1>
      <hr />
      <br />
      <div className="ocr-container">
        <h2 className="ocr-title">OCR Reader</h2>
        
        {/* Drawing Controls */}
        <div className="drawing-controls">
          <label className="control-label">
            Stroke Width: 
            <input
              type="range"
              min="1"
              max="8"
              value={strokeWidth}
              onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
              className="stroke-slider"
            />
            <span className="stroke-value">{strokeWidth}px</span>
          </label>
          
          <label className="control-label">
            Drawing Color: 
            <input
              type="color"
              value={strokeColor}
              onChange={(e) => setStrokeColor(e.target.value)}
              className="color-picker"
            />
            <span className="color-value">{strokeColor}</span>
          </label>
          
          {/* Quick Color Presets */}
          <div className="color-presets">
            <span className="preset-label">Quick Colors:</span>
            <div className="preset-colors">
              {['#000000', '#FF0000', '#00FF00', '#0000FF'].map(color => (
                <button
                  key={color}
                  className={`color-preset ${strokeColor === color ? 'active' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setStrokeColor(color)}
                  title={color}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="ocr-controls">
          <canvas
            ref={canvasRef}
            width={300}
            height={300}
            className="ocr-canvas"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          />

          <div className="ocr-controls">
            <button onClick={handleReadCanvas} disabled={loading}>
              Read Text
            </button>
            <button onClick={handleClearCanvas} disabled={loading}>
              Clear
            </button>
          </div>
        </div>

        {loading && (
          <div className="ocr-progress-section">
            <p className="ocr-progress-text">Reading text from canvas...</p>
          </div>
        )}

        <div className="ocr-result-section">
          <h3 className="ocr-result-title">Extracted Text</h3>
          <textarea
            rows="10"
            cols="50"
            value={text}
            readOnly
            className="ocr-result-textarea"
          />
        </div>
      </div>
    </>
  );
}

export default ASG_24;
