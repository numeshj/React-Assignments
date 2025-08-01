import BackToHome from "../component/BackToHome";
import "../assignments/ASG_42.css";
import { useRef, useState, useEffect } from "react";

export default function ASG_42() {
  const [image, setImage] = useState(null);
  const fileInputRef = useRef();
  const canvasOriginRef = useRef();
  const canvasNewRef = useRef();
  const [loading, setLoading] = useState(null);
  const [filterSize, setFilterSize] = useState(4);

   useEffect(() => {
    if (image && canvasOriginRef.current && canvasNewRef.current) {
      const canvas = canvasOriginRef.current;
      const ctx = canvas.getContext("2d");
      const canvasNew = canvasNewRef.current;
      const ctxNew = canvasNew.getContext("2d");
      const img = new window.Image();
      img.onload = () => {

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const canvasRatio = canvas.width / canvas.height;
        const imgRatio = img.width / img.height;

        let drawWidth, drawHeight, offsetX, offsetY;

        if (imgRatio > canvasRatio) {
          drawHeight = canvas.height;
          drawWidth = img.width * (canvas.height / img.height);
          offsetX = (canvas.width - drawWidth) / 2;
          offsetY = 0;
        } else {
          drawWidth = canvas.width;
          drawHeight = img.height * (canvas.width / img.width);
          offsetX = 0;
          offsetY = (canvas.height - drawHeight) / 2;
        }

        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

        ctxNew.clearRect(0, 0, canvasNew.width, canvasNew.height);
        ctxNew.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

        applyFilterToCanvas(ctxNew, canvasNew.width, canvasNew.height, 4);
      };
      img.src = image;
    } else if (canvasOriginRef.current && canvasNewRef.current) {
      const canvas = canvasOriginRef.current;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const ctxNew = canvasNewRef.current.getContext("2d");
      ctxNew.clearRect(0, 0, canvasNewRef.current.width, canvasNewRef.current.height);
    }
    setLoading(false);

  }, [image]);

  function applyFilterToCanvas(ctx, width, height, size) {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const output = ctx.createImageData(width, height);

    for (let y = 0; y < height; y += size) {
      for (let x = 0; x < width; x += size) {
        let r = 0, g = 0, b = 0, count = 0;
        for (let dy = 0; dy < size; dy++) {
          for (let dx = 0; dx < size; dx++) {
            const px = x + dx;
            const py = y + dy;
            if (px < width && py < height) {
              const idx = (py * width + px) * 4;
              r += data[idx];
              g += data[idx + 1];
              b += data[idx + 2];
              count++;
            }
          }
        }
        r = Math.round(r / count);
        g = Math.round(g / count);
        b = Math.round(b / count);
        for (let dy = 0; dy < size; dy++) {
          for (let dx = 0; dx < size; dx++) {
            const px = x + dx;
            const py = y + dy;
            if (px < width && py < height) {
              const idx = (py * width + px) * 4;
              output.data[idx] = r;
              output.data[idx + 1] = g;
              output.data[idx + 2] = b;
              output.data[idx + 3] = 255;
            }
          }
        }
      }
    }
    ctx.putImageData(output, 0, 0);
  }

  const handleDownload = () => {
    const canvas = canvasNewRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "filtered-image.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const handleRange = (e) => {
    setFilterSize(Number(e.target.value));
  };

  const handleApplyFilter = () => {
    const dstCanvas = canvasNewRef.current;
    if (!dstCanvas) return;
    const dstCtx = dstCanvas.getContext("2d");
    const width = dstCanvas.width;
    const height = dstCanvas.height;
    const size = filterSize;

    const srcData = dstCtx.getImageData(0, 0, width, height).data;
    const output = dstCtx.createImageData(width, height);

    let x = 0;
    function processNextColumn() {
      for (let y = 0; y < height; y += size) {
        let r = 0, g = 0, b = 0, count = 0;
        for (let dy = 0; dy < size; dy++) {
          for (let dx = 0; dx < size; dx++) {
            const px = x + dx;
            const py = y + dy;
            if (px < width && py < height) {
              const idx = (py * width + px) * 4;
              r += srcData[idx];
              g += srcData[idx + 1];
              b += srcData[idx + 2];
              count++;
            }
          }
        }
        if (count > 0) {
          r = Math.round(r / count);
          g = Math.round(g / count);
          b = Math.round(b / count);
        }
        for (let dy = 0; dy < size; dy++) {
          for (let dx = 0; dx < size; dx++) {
            const px = x + dx;
            const py = y + dy;
            if (px < width && py < height) {
              const idx = (py * width + px) * 4;
              output.data[idx] = r;
              output.data[idx + 1] = g;
              output.data[idx + 2] = b;
              output.data[idx + 3] = 255;
            }
          }
        }
      }
      x += size;
      if (x < width) {
        dstCtx.putImageData(output, 0, 0);
        requestAnimationFrame(processNextColumn);
      } else {
        dstCtx.putImageData(output, 0, 0);
      }
    }
    processNextColumn();
  };

  const handleUpload = () => {
    setLoading(true);
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (ev) => setImage(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="asg42">
      <BackToHome />
      <h1 className="assignment-title">Assignment-43</h1>
      <hr />
      <br />
      <div className="picture-container">
        <div className="origin-box">
          <canvas
            className="canvas-origin"
            ref={canvasOriginRef}
            width={300}
            height={400}
          />
          <button
            className="upload-btn"
            onClick={handleUpload}
            disabled={loading}
          >
            Upload
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </div>
        <div className="new-box">
          <canvas
            className="canvas-new"
            ref={canvasNewRef}
            width={300}
            height={400}
          />
          <button
            className="download-btn"
            onClick={handleDownload}
            disabled={loading}
          >
            Download
          </button>
        </div>

        <div className="filter-box">
          <input
            type="range"
            min="4"
            max="15"
            value={filterSize}
            onChange={handleRange}
          />
          <button
            className="filter-btn"
            onClick={handleApplyFilter}
            disabled={loading}
          >
            Apply Filter
          </button>
        </div>
      </div>
    </div>
  );
}
