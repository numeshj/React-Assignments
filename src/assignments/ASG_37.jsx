import { useState, useRef, useEffect } from "react";
import BackToHome from "../component/BackToHome";
import "../assignments/ASG_37.css";

export default function ASG_37() {
  const canvasRef = useRef(null);
  const [range, setRange] = useState(80);
  const [selectedData, setSelectedData] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [cursorPos, setCursorPos] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [imageHistory, setImageHistory] = useState([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setOriginalImage(imageData);
    };
    img.src = "./asg36.png";
  }, []);

  const drawHoverFrame = (ctx, x, y, size) => {
    ctx.strokeStyle = "#0000ff";
    ctx.lineWidth = 2;
    ctx.strokeRect(x - size / 2, y - size / 2, size, size);
  };

  const activeFrame = (ctx, x, y, size) => {
    ctx.strokeStyle = "#ff0000";
    ctx.lineWidth = 2;
    ctx.strokeRect(x - size / 2, y - size / 2, size, size);
  };

  const drawSelectedAreaFrame = (ctx, x, y, size) => {
    ctx.strokeStyle = "#ff0000";
    ctx.lineWidth = 3;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(x - size / 2, y - size / 2, size, size);
    ctx.setLineDash([]);
  };

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    setCursorPos({ x, y });

    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    if (originalImage) {
      ctx.putImageData(originalImage, 0, 0);
    }

    // Draw selected area frame if exists
    if (selectedArea) {
      drawSelectedAreaFrame(
        ctx,
        selectedArea.x,
        selectedArea.y,
        selectedArea.size
      );
    }

    if (!isDragging) {
      drawHoverFrame(ctx, x, y, range);
    } else {
      activeFrame(ctx, x, y, range);

      if (selectedData) {
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = selectedData.width;
        tempCanvas.height = selectedData.height;
        const tempCtx = tempCanvas.getContext("2d");
        tempCtx.putImageData(selectedData.data, 0, 0);

        const drawX = x - range / 2;
        const drawY = y - range / 2;

        ctx.drawImage(tempCanvas, drawX, drawY, range, range);

        ctx.fillStyle = "rgba(255, 0, 0, 0.1)";
        ctx.fillRect(drawX, drawY, range, range);
      }
    }
  };

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    if (!isDragging) {
      // First click - select area and save to selectedArea
      const size = range;
      const startX = Math.max(0, Math.floor(x - size / 2));
      const startY = Math.max(0, Math.floor(y - size / 2));
      const width = Math.min(size, canvas.width - startX);
      const height = Math.min(size, canvas.height - startY);

      // Capture image data
      const data = ctx.getImageData(startX, startY, width, height);
      setSelectedData({ data, width, height });

      // Save selected area for red dashed frame
      setSelectedArea({ x, y, size });

      setIsDragging(true);
      setCursorPos({ x, y });

      // Immediately draw the selected area frame
      ctx.putImageData(originalImage, 0, 0);
      drawSelectedAreaFrame(ctx, x, y, size);
    } else {
      if (selectedData) {
        const startX = Math.max(0, Math.floor(x - range / 2));
        const startY = Math.max(0, Math.floor(y - range / 2));
        ctx.putImageData(selectedData.data, startX, startY);

        // Save new state of image into history
        const newImageData = ctx.getImageData(
          0,
          0,
          canvas.width,
          canvas.height
        );
        setOriginalImage(newImageData); // this keeps the latest state
        setImageHistory((prev) => [...prev, newImageData]); // keep a history
      }
    }
  };

  const handleReset = () => {
    setSelectedData(null);
    setSelectedArea(null);
    setIsDragging(false);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    if (imageHistory.length > 0) {
      const latestImage = imageHistory[imageHistory.length - 1];
      ctx.putImageData(latestImage, 0, 0);
      setOriginalImage(latestImage); // update current image state
    }

    // Optionally, keep hover frame active
    if (cursorPos) {
      drawHoverFrame(ctx, cursorPos.x, cursorPos.y, range);
    }
  };

  return (
    <div className="asg37">
      <BackToHome />
      <h1 className="assignment-title">
        Assignment-37 - Canvas ImageData Clone
      </h1>
      <hr />
      <br />
      <div className="controls">
        <input
          type="range"
          min="40"
          max="120"
          value={range}
          disabled={isDragging}
          onChange={(e) => setRange(parseInt(e.target.value))}
        />
        <button onClick={handleReset}>Reset Origin</button>
      </div>
      <div className="canvas-container">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          style={{ cursor: isDragging ? "none" : "crosshair" }}
        />
      </div>
    </div>
  );
}
