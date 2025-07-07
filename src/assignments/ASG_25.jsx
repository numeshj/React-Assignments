// ASG_25.jsx
import React from "react";
import BackToHome from "../component/BackToHome";
import "./ASG_25.css";

function ASG_25() {
  return (
    <>
      <BackToHome />
      <div className="asg25-container">
        <h1 className="asg25-title">CSS 3D Transforms Demo</h1>

        <div className="card-container">
          <div className="card rotateX">rotateX(45deg)</div>
          <div className="card rotateY">rotateY(180deg)</div>
          <div className="card rotateZ">rotateZ(45deg)</div>
          <div className="card translateZ">translateZ(50px)</div>
          <div className="card scaleZ">scaleZ(1.5)</div>
          <div className="card perspective">
            <div className="inner-card">perspective: 1000px</div>
          </div>
          <div className="card preserve3d">
            <div className="child-card front">Front</div>
            <div className="child-card back">Back</div>
          </div>
          <div className="card backfaceHidden">
            <div className="flip-card-inner">
              <div className="flip-card-front">Front Face</div>
              <div className="flip-card-back">Back Face (hidden)</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ASG_25;
