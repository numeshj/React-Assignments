import { useState } from "react";
import "./ASG_27.css";
import BackToHome from "../component/BackToHome";

export default function ASG_27() {
  const [position, setPosition] = useState({ x: 10, y: 30 });
  const [origin, setOrigin] = useState({ x: 0, y: 0 });
  const [down, setDown] = useState(false);

  const onMouseDown = (event) => {
    if (event.target.className !== "draggable") return;
    setDown(true);
    setOrigin({
      x: event.clientX - position.x,
      y: event.clientY - position.y,
    });
  };

  const onmousemove = (event) => {
    if (!down) return;

    const defX = event.clientX - origin.x;
    const defY = event.clientY - origin.y;

    setPosition({
      x: defX,
      y: defY,
    });
  };

  const onMouseUp = () => {
    setDown(false);
  };

  return (
    <>
      <BackToHome />
      <h1 className="assignment-title">Assignment-27</h1>
      <hr />
      <br />
      <div
        className="container"
        onMouseDown={onMouseDown}
        onMouseMove={onmousemove}
        onMouseUp={onMouseUp}
      >
        <div
          className="draggable"
          style={{ left: position.x, top: position.y }}
        >
          Drag Me!
        </div>
      </div>
    </>
  );
}
