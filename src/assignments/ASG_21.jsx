import BackToHome from "../component/BackToHome";
import "../assignments/AGS_21.css";
import { useRef, useState } from "react";

export default function ASG_21() {
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const [rgb, setRgb] = useState("");
  const [hex, setHex] = useState("");
  const [imageSrc, setImageSrc] = useState(null);

  const MAX_WIDTH = 400;
  const MAX_HEIGHT = 320;

  const handleUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setImageSrc(imageURL);
    }
  };

  const handleImageLoad = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const img = imgRef.current;
    let scale = Math.min(
      MAX_WIDTH / img.naturalWidth,
      MAX_HEIGHT / img.naturalHeight,
      1
    );
    const drawWidth = Math.round(img.naturalWidth * scale);
    const drawHeight = Math.round(img.naturalHeight * scale);
    canvas.width = drawWidth;
    canvas.height = drawHeight;
    ctx.clearRect(0, 0, drawWidth, drawHeight);
    ctx.drawImage(img, 0, 0, drawWidth, drawHeight);
  };

  const handleCanvasClick = (event) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = Math.floor((event.clientX - rect.left) * scaleX);
    const y = Math.floor((event.clientY - rect.top) * scaleY);
    if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) return;
    const pixelData = ctx.getImageData(x, y, 1, 1).data;
    const [r, g, b] = pixelData;
    const rgbValue = `rgb(${r},${g},${b})`;
    const hexValue = `#${r.toString(16).padStart(2, "0")}${g
      .toString(16)
      .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
    setRgb(rgbValue);
    setHex(hexValue);
  };

  return (
    <>
      <BackToHome />
      <h1 className="assignment-title">Assignment-21</h1>
      <hr />
      <br />
      <div className="color-picker-container">
        <div className="color-picker-title">Color Picker from Image</div>
        <label
          htmlFor="upload-image"
          className="upload-btn-label"
          onClick={() => {
            document.getElementById("upload-image").click();
          }}
        >
          <button type="button" tabIndex={-1}>
            Upload
          </button>
        </label>
        <input
          id="upload-image"
          type="file"
          accept="image/*"
          onChange={handleUpload}
          style={{ display: "none" }}
        />
        {imageSrc && (
          <div className="canvas-area-row">
            <div className="canvas-area-canvas-wrapper" style={{ display: 'inline-block', textAlign: 'center' }}>
              <img
                ref={imgRef}
                src={imageSrc}
                alt="uploaded"
                style={{ display: "none" }}
                onLoad={handleImageLoad}
              />
              <canvas
                ref={canvasRef}
                onClick={handleCanvasClick}
                className="color-canvas"
                style={{ cursor: "crosshair" }}
              />
            </div>
          </div>
        )}
        <div className="color-info">
          <div className="color-row">
            <strong>RGB:</strong> {rgb}
          </div>
          <div className="color-row">
            <strong>Hex:</strong> {hex}
          </div>
          {hex && (
            <div
              className="color-preview"
              style={{ backgroundColor: hex }}
            ></div>
          )}
        </div>
      </div>
    </>
  );
}
