import BackToHome from "../component/BackToHome";
import "../assignments/ASG_60.css";
import { useState, useRef, useEffect } from "react";

export default function ASG_60() {
  const [colors, setColors] = useState([]);             
  const [currentColor, setCurrentColor] = useState(null); 
  const [brushSize, setBrushSize] = useState(5);                    
  const [recording, setRecording] = useState(false); 
  const recorderRef = useRef(null);         
  const chunksRef = useRef([]);             
  const canvasRef = useRef(null);                                      
  const ctxRef = useRef(null);                                         
  const drawingRef = useRef(false);                                   
  const lastPosRef = useRef(null);               

  const publicBase =
    (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.BASE_URL) ||
    "/"; 

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
    fetch(`./asg60/colors-asg60.json`) 
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
  }, [publicBase]);

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
    lastPosRef.current = { x, y };                
    ctx.beginPath();
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = brushSize;
    ctx.moveTo(x, y);
    ctx.beginPath();                 
    ctx.fillStyle = currentColor;                
    ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);  
    ctx.fill();                                    
    ctx.beginPath();                               
    ctx.moveTo(x, y);                              
  }; 

  const handlePointerMove = (e) => {
    if (!drawingRef.current) return;
    const ctx = ctxRef.current;
    const { x, y } = getPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    lastPosRef.current = { x, y };         
  }; 

  const stopDrawing = () => {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    lastPosRef.current = null;             
  }; 

  const clearCanvas = () => {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }; 

  const startRecording = () => {
    if (recording || recorderRef.current) return;
    if (typeof MediaRecorder === "undefined") {
      alert("MediaRecorder not supported in this browser.");
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas || !canvas.captureStream) {
      alert("Canvas captureStream not supported.");
      return;
    }
    const stream = canvas.captureStream(60); 
    const mime = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
      ? "video/webm;codecs=vp9"
      : MediaRecorder.isTypeSupported("video/webm;codecs=vp8")
      ? "video/webm;codecs=vp8"
      : "video/webm";
    const mr = new MediaRecorder(stream, { mimeType: mime });
    chunksRef.current = [];
    mr.ondataavailable = (e) => {
      if (e.data && e.data.size) chunksRef.current.push(e.data);
    };
    mr.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: mime });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const ts = new Date().toISOString().replace(/[:.]/g, "-");
      a.href = url;
      a.download = `canvas-recording-${ts}.webm`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        URL.revokeObjectURL(url);
        a.remove();
      }, 2000);
      recorderRef.current = null;
    };
    mr.start();
    recorderRef.current = mr;
    setRecording(true);
  };

  const stopRecording = () => {
    const mr = recorderRef.current;
    if (!mr) return;
    if (mr.state !== "inactive") mr.stop();
    // stop tracks
    mr.stream.getTracks().forEach(t => t.stop());
    setRecording(false);
  };

  const toggleRecording = () => {
    if (recorderRef.current && recorderRef.current.state === "inactive") {
      recorderRef.current = null;                  
    }
    if (recording) stopRecording();
    else startRecording();
  };

  useEffect(() => {
    return () => {
      // cleanup on unmount
      if (recorderRef.current && recorderRef.current.state !== "inactive") {
        recorderRef.current.stop();
        recorderRef.current.stream.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

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
            onClick={toggleRecording}
            aria-pressed={recording}
            title={recording ? "Stop Recording" : "Start Recording"}
            disabled={!currentColor || !colors.length}
          >
            <img
              src={`./asg60/canvas-video-recorder-${recording ? "stop" : "record"}.svg`}
              alt={recording ? "Stop recording" : "Start recording"}
            />
          </button>
          <button
            className="reset"
            onClick={clearCanvas}
            title="Clear Canvas"
          >
            <img
              src={`./asg60/canvas-video-recorder-reset.svg`}
              alt="Clear canvas"
            />
          </button>
        </div>
      </div>
    </div>
  );
}
