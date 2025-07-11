import { useEffect, useRef } from "react";
import "./ASG_27.css";
import BackToHome from "../component/BackToHome";

export default function ASG_27() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    let dragElement = null;
    let startX = 0;
    let startY = 0;
    let elemStartX = 0;
    let elemStartY = 0;

    const handleMouseDown = (e) => {
      if (e.target.className.includes("draggable")) {
        dragElement = e.target;
      } else if (e.target.closest(".draggable")) {
        dragElement = e.target.closest(".draggable");
      }

      if (!dragElement) return;

      startX = e.clientX;
      startY = e.clientY;

      const style = dragElement.style;
      elemStartX = parseInt(style.left) || 300; 
      elemStartY = parseInt(style.top) || 200; 

      e.preventDefault();
    };

    const handleMouseMove = (e) => {
      if (!dragElement) return;

      const newX = elemStartX + (e.clientX - startX);
      const newY = elemStartY + (e.clientY - startY);

      dragElement.style.left = newX + "px";
      dragElement.style.top = newY + "px";
    };

    const handleMouseUp = () => {
      dragElement = null;
    };

    container.onmousedown = handleMouseDown;
    container.onmousemove = handleMouseMove;
    container.onmouseup = handleMouseUp;
    container.onmouseleave = handleMouseUp;

    return () => {
      container.onmousedown = null;
      container.onmousemove = null;
      container.onmouseup = null;
      container.onmouseleave = null;
    };
  }, []);

  return (
    <>
      <div className="header-container">
        <BackToHome />
        <h1 className="assignment-title">Assignment-27</h1>
      </div>

      <div className="asg27-container" ref={containerRef}>
        <div className="draggable">
          <p className="draggable-word">DRAG ME!</p>
        </div>
      </div>
    </>
  );
}

