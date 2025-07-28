import BackToHome from "../component/BackToHome";
import "../assignments/ASG_39.css";
import { useState } from "react";

function CircleSelector() {
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const items = Array.from({ length: 8 }, (_, i) => `Item ${i + 1}`);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setDragOffset(0);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const offset = e.clientX - startX;
    setDragOffset(offset);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    
    const rotationChange = dragOffset * 0.5;
    setRotation(prev => prev + rotationChange);
    
    setIsDragging(false);
    setDragOffset(0);
  };

  const currentRotation = rotation + (isDragging ? dragOffset * 0.5 : 0);

  return (
    <div 
      className="circle-wrapper"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div 
        className="carousel-3d"
        onMouseDown={handleMouseDown}
        style={{
          transform: `rotateY(${currentRotation}deg)`,
          transition: isDragging ? 'none' : 'transform 0.5s ease',
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
      >
        {items.map((item, index) => {
          const angle = (360 / items.length) * index;
          const rotatedAngle = (angle - currentRotation + 360) % 360;
          
          // Calculate Z position (depth) - positive Z is towards viewer
          const zPosition = Math.cos(rotatedAngle * Math.PI / 180);
          
          // Get all items with their Z positions
          const allItemsWithZ = items.map((_, i) => {
            const itemAngle = (360 / items.length) * i;
            const itemRotatedAngle = (itemAngle - currentRotation + 360) % 360;
            const itemZ = Math.cos(itemRotatedAngle * Math.PI / 180);
            return {
              index: i,
              z: itemZ
            };
          });
          
          // Sort by Z position (descending) to get front-most items
          const sortedByZ = allItemsWithZ.sort((a, b) => b.z - a.z);
          const frontThree = sortedByZ.slice(0, 3);
          const isVisible = frontThree.some(item => item.index === index);
          
          // Determine scale: front center = 1.0, sides = 0.8
          let scale = 0.8;
          if (isVisible) {
            const position = frontThree.findIndex(item => item.index === index);
            scale = position === 0 ? 1.0 : 0.8;
          }

          return (
            <div
              key={index}
              className="carousel-item-3d"
              style={{
                transform: `rotateY(${angle}deg) translateZ(250px) scale(${scale})`,
                opacity: isVisible ? 1 : 0,
                visibility: isVisible ? 'visible' : 'hidden',
                transition: isDragging ? 'none' : 'all 0.3s ease'
              }}
            >
              <div className="item-content">
                {item}
              </div>
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="controls">
        <button 
          className="nav-button left" 
          onClick={() => setRotation(prev => prev - 45)}
        >
          ⬅
        </button>
        <button 
          className="nav-button right" 
          onClick={() => setRotation(prev => prev + 45)}
        >
          ➡
        </button>
      </div>
    </div>
  );
}

export default function ASG_39() {
  return (
    <div className="asg39">
      <BackToHome />
      <h1 className="assignment-title">Assignment-39</h1>
      <hr />
      <br />
      <CircleSelector />
    </div>
  );
}
