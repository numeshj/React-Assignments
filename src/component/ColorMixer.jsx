import React, { useState } from "react";
import "../assignments/AGS_17.css";

function ColorMixer() {
  const [color1, setColor1] = useState("#ff0000");
  const [color2, setColor2] = useState("#0000ff");
  const [mixedColor, setMixedColor] = useState("#000000");
  const [rgb1, setRgb1] = useState([255, 0, 0]);
  const [rgb2, setRgb2] = useState([0, 0, 255]);

  const hexToRgb = (hex) => {
    hex = hex.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return [r, g, b];
  };

  const handleColor1Change = (e) => {
    const hex = e.target.value;
    setColor1(hex);
    const rgb = hexToRgb(hex);
    setRgb1(rgb);
  };

  const handleColor2Change = (e) => {
    const hex = e.target.value;
    setColor2(hex);
    const rgb = hexToRgb(hex);
    setRgb2(rgb);
  };

  const addRgbValues = () => {
    let outR = rgb1[0] + rgb2[0];
    let outG = rgb1[1] + rgb2[1];
    let outB = rgb1[2] + rgb2[2];

    // Applying max value 255
    outR = Math.min(outR, 255);
    outG = Math.min(outG, 255);
    outB = Math.min(outB, 255);

    const hexColor = rgbToHex(outR, outG, outB);
    setMixedColor(hexColor);
  };

  const rgbToHex = (r, g, b) => {
    const toHex = (value) => {
      const hex = value.toString(16);
      return hex.padStart(2, "0").toUpperCase();
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  return (
    <div className="color-mixer-container">
      <div className="color-mixer-title">Color Mixer</div>
      <div className="color-mixer-row">
        <label className="color-mixer-label">Color 1:</label>
        <input
          type="color"
          className="color-mixer-input"
          value={color1}
          onChange={handleColor1Change}
        />
      </div>
      <div className="color-mixer-row">
        <label className="color-mixer-label">Color 2:</label>
        <input
          type="color"
          className="color-mixer-input"
          value={color2}
          onChange={handleColor2Change}
        />
      </div>
      <button className="color-mixer-btn" onClick={addRgbValues}>
        Add RGB
      </button>
      <div className="color-mixer-output">
        <div
          className="color-mixer-output-color"
          style={{ "--output-color": mixedColor, background: mixedColor }}
        ></div>
      </div>
      <div className="color-mixer-output-label">
        Output HEX Color: {mixedColor}
      </div>
      <div
        className="color-mixer-gradient"
        style={{
          "--gradient-bg": `linear-gradient(to right, ${color1}, ${mixedColor}, ${color2})`,
          background: `linear-gradient(to right, ${color1}, ${mixedColor}, ${color2})`,
        }}
      >
        <span className="color-mixer-gradient-label">
          Gradient: Color 1 → Mixed → Color 2
        </span>
      </div>
    </div>
  );
}

export default ColorMixer;
