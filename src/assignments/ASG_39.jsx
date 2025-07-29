import { useState, useRef } from "react";
import "../assignments/ASG_39.css";
import BackToHome from "../component/BackToHome";

const RADIUS = 180;
const TOTAL_ITEMS = 8;

export default function ASG_39() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [items, setItems] = useState(
    Array.from({ length: TOTAL_ITEMS }, (_, i) => `Item #${i + 1}`)
  );

  const dragStartX = useRef(null);

  const rotate = (direction) => {
    setCurrentIndex((prev) => (prev + direction + TOTAL_ITEMS) % TOTAL_ITEMS);
  };

  const handleItemClick = (index) => {
    if (index === (currentIndex + 1) % TOTAL_ITEMS) rotate(1);
    else if (index === (currentIndex - 1 + TOTAL_ITEMS) % TOTAL_ITEMS) rotate(-1);
  };

  const handleDragStart = (e) => {
    dragStartX.current = e.clientX || e.touches?.[0]?.clientX;
  };

  const handleDragEnd = (e) => {
    const endX = e.clientX || e.changedTouches?.[0]?.clientX;
    const delta = endX - dragStartX.current;

    if (Math.abs(delta) > 30) {
      rotate(delta > 0 ? -1 : 1);
    }

    dragStartX.current = null;
  };

  const getStyle = (index) => {
    const relativeIndex = (index - currentIndex + TOTAL_ITEMS) % TOTAL_ITEMS;
    
    const distance = (relativeIndex + TOTAL_ITEMS) % TOTAL_ITEMS;
    const show = distance === 0 || distance === 1 || distance === TOTAL_ITEMS - 1;

    let x, y, scale, zIndex;

    if (distance === 0) {
      x = 0;
      y = 0;
      scale = 1.1;
      zIndex = 10;
    } else if (distance === 1) {
      x = 200; 
      y = 0;
      scale = 0.8;
      zIndex = 5;
    } else if (distance === TOTAL_ITEMS - 1) {
      x = -200; 
      y = 0;
      scale = 0.8;
      zIndex = 5;
    } else {
      let angle = (360 / TOTAL_ITEMS) * relativeIndex - 90;
      let rad = (angle * Math.PI) / 180;
      x = RADIUS * Math.cos(rad);
      y = RADIUS * Math.sin(rad);
      scale = 0.6;
      zIndex = 0;
    }

    const opacity = show ? 1 : 0;

    return {
      transform: `translate(${x - 90}px, ${y - 60}px) scale(${scale})`,
      opacity,
      zIndex,
      pointerEvents: show ? "auto" : "none",
    };
  };

  return (
    <div className="asg39">
      <BackToHome />
      <h1 className="assignment-title">Assignment-39</h1>
      <hr />
      <div
        className="circle-container"
        onMouseDown={handleDragStart}
        onMouseUp={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchEnd={handleDragEnd}
      >
        <div className="arrow-btn1" onClick={() => rotate(-1)} />
        <div className="circle">
          {items.map((item, index) => (
            <div
              key={index}
              className="circle-item"
              style={getStyle(index)}
              onClick={() => handleItemClick(index)}
            >
              {item}
            </div>
          ))}
        </div>
        <div className="arrow-btn2" onClick={() => rotate(1)} />
      </div>
    </div>
  );
}
