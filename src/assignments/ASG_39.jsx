import BackToHome from "../component/BackToHome";
import "../assignments/ASG_39.css";
import { useState } from "react";

function CircleSelector() {
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const items = Array.from({ length: 8 }, (_, i) => `Item ${i + 1}`);
  
  // Circle parameters
  const radius = 200; // R value
  const centerX = 400; // Center of circle
  const centerY = 300; // Center of circle

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
    const rotationChange = dragOffset * 0.3; // Offset rotation
    setRotation(prev => prev + rotationChange);
    setIsDragging(false);
    setDragOffset(0);
  };

  const currentRotation = rotation + (isDragging ? dragOffset * 0.3 : 0);

  // Calculate positions for all items
  const getItemPositions = () => {
    return items.map((item, index) => {
      // Q value - angle for each item
      const baseAngle = (360 / items.length) * index;
      const adjustedAngle = baseAngle + currentRotation;
      
      // Convert to radians
      const angleRad = (adjustedAngle * Math.PI) / 180;
      
      // Calculate x, y coordinates
      const x = centerX + radius * Math.cos(angleRad);
      const y = centerY + radius * Math.sin(angleRad);
      
      // Y value for depth (positive = front, negative = back)
      const depthY = Math.sin(angleRad);
      
      return {
        item,
        index,
        x,
        y,
        depthY,
        angle: adjustedAngle,
        isVisible: depthY > 0, // Only show items with positive Y (front half)
        scale: depthY > 0.7 ? 1.0 : 0.8 // Front center item gets scale 1.0
      };
    });
  };

  const itemPositions = getItemPositions();
  
  // Get only visible items (front 3 with highest depthY values)
  const visibleItems = itemPositions
    .filter(item => item.isVisible)
    .sort((a, b) => b.depthY - a.depthY)
    .slice(0, 3);

  return (
    <>
      <div
        className="circle-wrapper"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          className="carousel-container"
          onMouseDown={handleMouseDown}
          style={{
            cursor: isDragging ? "grabbing" : "grab",
          }}
        >
          {itemPositions.map((itemData) => {
            const isInVisibleSet = visibleItems.some(v => v.index === itemData.index);
            const visibleIndex = visibleItems.findIndex(v => v.index === itemData.index);
            const scale = isInVisibleSet && visibleIndex === 0 ? 1.0 : 0.8;
            
            return (
              <div
                key={itemData.index}
                className="carousel-item"
                style={{
                  position: 'absolute',
                  left: `${itemData.x - 75}px`,
                  top: `${itemData.y - 100}px`,
                  transform: `scale(${scale})`,
                  opacity: isInVisibleSet ? 1 : 0,
                  visibility: isInVisibleSet ? 'visible' : 'hidden',
                  zIndex: Math.round(itemData.depthY * 100),
                  transition: isDragging ? "none" : "all 0.3s ease",
                }}
              >
                <div className="item-content">{itemData.item}</div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Navigation Buttons - positioned below the carousel */}
      <div className="controls">
        <button onClick={() => setRotation(r => r - 45)} className="nav-button left">⬅</button>
        <button onClick={() => setRotation(r => r + 45)} className="nav-button right">➡</button>
      </div>
    </>
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
    