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
  const [baseOriginalImage, setBaseOriginalImage] = useState(null); // Store truly original image

  // Load the image when component mounts
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
      setBaseOriginalImage(imageData); // Store base original for reset
    };
    img.src = "./asg36.png";
  }, []);

  // Draw selected area with red dashed border
  const drawSelectedArea = (ctx, x, y, size) => {
    ctx.strokeStyle = "#ff0000";
    ctx.lineWidth = 3;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(x - size / 2, y - size / 2, size, size);
    ctx.setLineDash([]);
  };

  // Redraw everything when state changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !originalImage) return;
    const ctx = canvas.getContext("2d");

    // Reset to original
    ctx.putImageData(originalImage, 0, 0);

    // Draw selected area with red border if exists
    if (selectedArea) {
      drawSelectedArea(ctx, selectedArea.x, selectedArea.y, selectedArea.size);
    }

    // Draw moving image if dragging
    if (isDragging && selectedData && cursorPos) {
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = selectedData.width;
      tempCanvas.height = selectedData.height;
      const tempCtx = tempCanvas.getContext("2d");
      tempCtx.putImageData(selectedData.data, 0, 0);

      const x = cursorPos.x - range / 2;
      const y = cursorPos.y - range / 2;

      // Draw the captured image
      ctx.drawImage(tempCanvas, x, y, range, range);

      // Green border for moving frame
      ctx.strokeStyle = "#00ff00";
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y, range, range);

      // Add transparency overlay
      ctx.fillStyle = "rgba(0, 255, 0, 0.1)";
      ctx.fillRect(x, y, range, range);
    }
  }, [cursorPos, isDragging, selectedData, selectedArea, range, originalImage]);

  // Mouse move: update cursor position and show moving frame
  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    if (isDragging) {
      setCursorPos({ x, y });
    }
  };

  // Mouse down: first click to select, subsequent clicks to place
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

      // Save selected area for red box drawing
      setSelectedArea({ x, y, size });

      setIsDragging(true);
      setCursorPos({ x, y });
    } else {
      // Subsequent clicks - place the image data
      if (selectedData) {
        const startX = Math.max(0, Math.floor(x - range / 2));
        const startY = Math.max(0, Math.floor(y - range / 2));
        ctx.putImageData(selectedData.data, startX, startY);

        // Update original image to include the placed data
        const newImageData = ctx.getImageData(
          0,
          0,
          canvas.width,
          canvas.height
        );
        setOriginalImage(newImageData);
      }
    }
  };

  const handleReset = () => {
    // Clear all states first
    setSelectedData(null);
    setSelectedArea(null);
    setIsDragging(false);
    setCursorPos(null);
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
