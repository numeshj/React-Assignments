import BackToHome from "../component/BackToHome";
import "../assignments/ASG_60.css";
import { useState, useRef, useEffect } from "react";

export default function ASG_60() {
  const [colors, setColors] = useState([]);             
  const [currentColor, setCurrentColor] = useState(null); 
  const [brushSize, setBrushSize] = useState(5);                    
  const [recording, setRecording] = useState(false); 
  const canvasRef = useRef(null);                                      
  const ctxRef = useRef(null);                                         
  const drawingRef = useRef(false);                                   

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctxRef.current = ctx;
  }, []); 

  useEffect(() => {
    // fetch colors JSON from public
    const base =
      (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.BASE_URL) ||
      "/";
    fetch(`${base}asg60/colors-asg60.json`) 
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then(data => {
        if (Array.isArray(data) && data.length) {
          setColors(data);
          setCurrentColor(data[0]);
        }
      })
      .catch(() => {
        // silent
      });
  }, []);

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }; 

  const handlePointerDown = (e) => {
    if (!currentColor) return;           
    const ctx = ctxRef.current;
    if (!ctx) return;
    drawingRef.current = true;
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = brushSize;
    ctx.moveTo(x, y);
  }; 

  const handlePointerMove = (e) => {
    if (!drawingRef.current) return;
    const ctx = ctxRef.current;
    const { x, y } = getPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  }; 

  const stopDrawing = () => {
    if (!drawingRef.current) return;
    drawingRef.current = false;
  }; 

  const clearCanvas = () => {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }; 

  return (
    <div className="asg60">
      <BackToHome />
      <h1 className="assignment-title">Assignment-60</h1>
      <hr />
      <br />
      <div className="container">
        <canvas
          ref={canvasRef}                               
          className="canvas"
          width="560"
          height="500"
          onPointerDown={handlePointerDown}             
          onPointerMove={handlePointerMove}             
          onPointerUp={stopDrawing}                     
          onPointerLeave={stopDrawing}                  
        ></canvas>
        <div className="options">
          <div className="style">
            <div className="colors">
              {colors.map(c => (
                <div
                  key={c}
                  className="color"
                  data-active={c === currentColor ? "true" : "false"} 
                  style={{ background: c }}
                  onClick={() => setCurrentColor(c)}                 
                />
              ))}
            </div>
            <input
              type="range"
              className="size"
              step="0.1"
              min="1"
              max="40"
              value={brushSize}                    
              onChange={(e) => setBrushSize(parseFloat(e.target.value))} 
            />
          </div>
          <button
            className="record"
            data-active={recording ? "true" : "false"}
            onClick={() => setRecording(r => !r)}
            aria-pressed={recording}
            title={recording ? "Stop Recording" : "Start Recording"}
          ></button>
          <button className="reset" onClick={clearCanvas}></button>
        </div>
      </div>
    </div>
  );
}
