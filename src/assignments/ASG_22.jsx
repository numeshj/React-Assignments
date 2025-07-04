import BackToHome from "../component/BackToHome";
import "../assignments/ASG_22.css";
import { useRef, useState } from "react";

export default function ASG_22() {
  const [imageSrc, setImageSrc] = useState(null);
  const [blur, setBlur] = useState(0);
  const [brightness, setBrightness] = useState(100); 
  const [contrast, setContrast] = useState(100); 
  const [grayscale, setGrayscale] = useState(0);
  const [hueRotate, setHueRotate] = useState(0); 
  const [invert, setInvert] = useState(0);
  const [opacity, setOpacity] = useState(100); 
  const [saturate, setSaturate] = useState(100); 
  const [sepia, setSepia] = useState(0);

  const fileInputRef = useRef(null);

  const filterStyle = `
    blur(${blur}px)
    brightness(${brightness}%)
    contrast(${contrast}%)
    grayscale(${grayscale}%)
    hue-rotate(${hueRotate}deg)
    invert(${invert}%)
    opacity(${opacity}%)
    saturate(${saturate}%)
    sepia(${sepia}%)
  `;

  const handleUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const objectURL = URL.createObjectURL(file);
      setImageSrc(objectURL);
    }
  };

  const handleReset = () => {
    setBlur(0);
    setBrightness(100);
    setContrast(100);
    setGrayscale(0);
    setHueRotate(0);
    setInvert(0);
    setOpacity(100);
    setSaturate(100);
    setSepia(0);
  };

  return (
    <>
      <BackToHome />
      <h1 className="assignment-title">Assignment-22</h1>
      <hr />
      <br />
      <div className="image-filter-container">
        <h2 className="image-filter-title">Image Filter Tool</h2>
        <label className="upload-btn-label">
          <button type="button" onClick={() => fileInputRef.current.click()}>
            Upload
          </button>
        </label>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleUpload}
          style={{ display: "none" }}
        />
        {imageSrc && (
          <img
            src={imageSrc}
            alt="filtered"
            className="filtered-image"
            style={{ filter: filterStyle }}
          />
        )}
        <div>
          <button class="btn-reset" onClick={handleReset}>Reset Filters</button>
        </div>
        <div className="filter-controls">
          <div className="filter-slider-row">
            <label>Blur :</label>
            <input
              type="range"
              min="0"
              max="20"
              step="0.1"
              value={blur}
              onChange={(e) => setBlur(parseFloat(e.target.value))}
            />
          </div>
          <div className="filter-slider-row">
            <label>Brightness :</label>
            <input
              type="range"
              min="0"
              max="200"
              step="1"
              value={brightness}
              onChange={(e) => setBrightness(parseFloat(e.target.value))}
            />
          </div>
          <div className="filter-slider-row">
            <label>Contrast :</label>
            <input
              type="range"
              min="0"
              max="200"
              step="1"
              value={contrast}
              onChange={(e) => setContrast(parseFloat(e.target.value))}
            />
          </div>
          <div className="filter-slider-row">
            <label>Grayscale :</label>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={grayscale}
              onChange={(e) => setGrayscale(parseFloat(e.target.value))}
            />
          </div>
          <div className="filter-slider-row">
            <label>Hue Rotate :</label>
            <input
              type="range"
              min="0"
              max="360"
              step="1"
              value={hueRotate}
              onChange={(e) => setHueRotate(parseFloat(e.target.value))}
            />
          </div>
          <div className="filter-slider-row">
            <label>Invert :</label>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={invert}
              onChange={(e) => setInvert(parseFloat(e.target.value))}
            />
          </div>
          <div className="filter-slider-row">
            <label>Opacity :</label>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={opacity}
              onChange={(e) => setOpacity(parseFloat(e.target.value))}
            />
          </div>
          <div className="filter-slider-row">
            <label>Saturate :</label>
            <input
              type="range"
              min="0"
              max="200"
              step="1"
              value={saturate}
              onChange={(e) => setSaturate(parseFloat(e.target.value))}
            />
          </div>
          <div className="filter-slider-row">
            <label>Sepia :</label>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={sepia}
              onChange={(e) => setSepia(parseFloat(e.target.value))}
            />
          </div>
        </div>
      </div>
    </>
  );
}
