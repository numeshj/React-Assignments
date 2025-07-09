import { useRef, useEffect } from "react";
import "./ASG_27.css";
import BackToHome from "../component/BackToHome";

export default function ASG_27() {
  const containerRef = useRef(null);
  const dragTarget = useRef(null);
  const startMousePos = useRef({ x: 0, y: 0 });
  const startElemPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;

    const handleMouseDown = (e) => {
      const target = e.target.closest(".draggable");

      if (!target || !container.contains(target)) return;

      dragTarget.current = target;

      const containerRect = container.getBoundingClientRect();
      const elemRect = target.getBoundingClientRect();

      startMousePos.current = { x: e.clientX, y: e.clientY };
      startElemPos.current = {
        x: elemRect.left - containerRect.left,
        y: elemRect.top - containerRect.top,
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);

      e.preventDefault(); 
    };

    const handleMouseMove = (e) => {
      if (!dragTarget.current) return;

      const deltaX = e.clientX - startMousePos.current.x;
      const deltaY = e.clientY - startMousePos.current.y;

      const newX = startElemPos.current.x + deltaX;
      const newY = startElemPos.current.y + deltaY;

      dragTarget.current.style.left = `${newX}px`;
      dragTarget.current.style.top = `${newY}px`;
    };

    const handleMouseUp = () => {
      dragTarget.current = null;
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
