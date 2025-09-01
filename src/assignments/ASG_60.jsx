import { useState, useRef, useEffect } from "react";
import BackToHome from "../component/BackToHome";
import "../assignments/ASG_60.css";

export default function ASG_60_Simple() {
  const [colors, setColors] = useState([]);
  const [currentColor, setCurrentColor] = useState(null);
  const [brushSize, setBrushSize] = useState(5);
  const [recording, setRecording] = useState(false);

  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const drawingRef = useRef(false);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);

  // setup canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctxRef.current = ctx;
  }, []);

  // load colors.json
  useEffect(() => {
    fetch("./asg60/colors-asg60.json")
      .then(r => r.json())
      .then(data => {
        setColors(data);
        setCurrentColor(data[0]);
      });
  }, []);

  // position helper
  const getPos = e => {
    const rect = canvasRef.current.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  // drawing handlers
  const startDraw = e => {
    if (!currentColor) return;
    drawingRef.current = true;
    const { x, y } = getPos(e);
    const ctx = ctxRef.current;
    ctx.beginPath();
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = brushSize;
    ctx.moveTo(x, y);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const draw = e => {
    if (!drawingRef.current) return;
    const { x, y } = getPos(e);
    const ctx = ctxRef.current;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDraw = () => (drawingRef.current = false);

  // clear canvas
  const clearCanvas = () => {
    const ctx = ctxRef.current;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  // recording
  const startRec = () => {
    const stream = canvasRef.current.captureStream(30);
    const mr = new MediaRecorder(stream, { mimeType: "video/webm" });
    chunksRef.current = [];
    mr.ondataavailable = e => chunksRef.current.push(e.data);
    mr.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "drawing.webm";
      a.click();
    };
    mr.start();
    recorderRef.current = mr;
    setRecording(true);
  };

  const stopRec = () => {
    recorderRef.current.stop();
    setRecording(false);
  };

  return (
    <div className="asg60">
      <BackToHome />
      <h1 className="assignment-title">Assignment-60</h1>
      <div className="container">
        <canvas
          ref={canvasRef}
          className="canvas"
          width="560"
          height="500"
          onPointerDown={startDraw}
          onPointerMove={draw}
          onPointerUp={stopDraw}
          onPointerLeave={stopDraw}
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
              min="1"
              max="40"
              value={brushSize}
              onChange={e => setBrushSize(+e.target.value)}
            />
          </div>

          <button
            className="record"
            data-active={recording}
            onClick={recording ? stopRec : startRec}
          >
            <img
              src={`./asg60/canvas-video-recorder-${recording ? "stop" : "record"}.svg`}
              alt={recording ? "Stop recording" : "Start recording"}
            />
          </button>

          <button className="reset" onClick={clearCanvas}>
            <img
              src="./asg60/canvas-video-recorder-reset.svg"
              alt="Clear canvas"
            />
          </button>
        </div>
      </div>
    </div>
  );
}
