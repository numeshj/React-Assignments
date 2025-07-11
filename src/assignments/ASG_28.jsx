import BackToHome from "../component/BackToHome";
import "../assignments/ASG_28.css";
import { useState } from "react";

export default function ASG_28() {
  const [tail, setTail] = useState([]);

  const onMouseMove = (event) => {
    const newDot = {
      x: event.clientX,
      y: event.clientY,
      id: crypto.randomUUID(),
    };

    setTail((prev) => [...prev, newDot]);

    setTimeout(() => {
      setTail((prev) => prev.filter((dot) => dot.id !== newDot.id));
    }, 300);
  };

  return (
    <>
      <BackToHome />
      <h1 className="assignment-title">Assignment-28</h1>
      <hr />
      <br />
      <div className="container" onMouseMove={onMouseMove}>
        <div className="wording">MOVE YOUR CURSOR HERE</div>
        {tail.map((dot) => (
          <div
            key={dot.id}
            className="bubble"
            style={{ left: dot.x + "px", top: dot.y + "px" }}
          />
        ))}
      </div>
    </>
  );
}
