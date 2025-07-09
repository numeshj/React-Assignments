import { useEffect, useRef } from "react";
import "./ASG_27.css";
import BackToHome from "../component/BackToHome";

export default function ASG_27() {
  const containerRef = useRef(null);
  const startX = useRef(0);
  const startY = useRef(0);
  const dragElem = useRef(null);
  const elemStartX = useRef(0);
  const elemStartY = useRef(0);

  useEffect(() => {
    const container = containerRef.current;

    const handleMouseDown = (event) => {
      const target = event.target.closest(".draggable");

      if (!target || !container.contains(target)) return;

      dragElem.current = target;

      startX.current = event.clientX;
      startY.current = event.clientY;

      const rect = target.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      elemStartX.current = rect.left - containerRect.left;
      elemStartY.current = rect.top - containerRect.top;

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);

      event.preventDefault();
    };

    const handleMouseMove = (event) => {
      if (!dragElem.current) return;

      const currentX = event.clientX;
      const currentY = event.clientY;

      const deltaX = currentX - startX.current;
      const deltaY = currentY - startY.current;

      const newLeft = elemStartX.current + deltaX;
      const newTop = elemStartY.current + deltaY;

      dragElem.current.style.left = `${newLeft}px`;
      dragElem.current.style.top = `${newTop}px`;
    };

    const handleMouseUp = () => {
      dragElem.current = null;
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    container.addEventListener("mousedown", handleMouseDown);

    return () => {
      container.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
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
