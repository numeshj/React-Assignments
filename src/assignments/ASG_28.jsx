import BackToHome from "../component/BackToHome";
import "../assignments/ASG_28.css";
import { useState } from "react";

export default function ASG_28() {
  const [tail, setTail] = useState([]);

  const onMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const newDot = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
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
      <div className="asg28-container" onMouseMove={onMouseMove}>
        <div className="asg28-wording">MOVE YOUR CURSOR HERE</div>
        {tail.map((dot) => (
          <div
            key={dot.id}
            className="asg28-bubble"
            style={{
              left: dot.x + "px",
              top: dot.y + "px",
            }}
          />
        ))}
      </div>
    </>
  );
}
