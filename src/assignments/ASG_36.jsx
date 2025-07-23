import BackToHome from "../component/BackToHome";
import "../assignments/ASG_36.css";
import { useState, useEffect } from "react";

export default function ASG_36() {

const [frame, setFrame] = useState({})
const [rangeValue, setRangeValue] = useState(80)

const onMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const newFrame = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      id: crypto.randomUUID(),
    };

    setFrame(newFrame);
  };

  const resetOrigin = () => {
    setFrame({});
  };

  return (
    <div className="asg36">
      <BackToHome />
      <h1 className="assignment-title">Assignment-36</h1>
      <hr />
      <br />
      <div>
        <input 
          className="range-selection" 
          type="range" 
          max="120" 
          min="40" 
          value={rangeValue}
          onChange={(e) => setRangeValue(e.target.value)}
        />
        <button className="range-button" onClick={resetOrigin}>Reset Origin</button>
      </div>
      <div className="picture-box" onMouseMove={onMouseMove}>
        <img src="./asg36.png" alt="asg36" />
        {frame.x && (
          <div 
            key={frame.id}
            className="picture-frame"
            style={{
              left: frame.x + "px",
              top: frame.y + "px",
              width: rangeValue + "px",
              height: rangeValue + "px",
            }}
          />
        )}
      </div>
    </div>
  );
}
