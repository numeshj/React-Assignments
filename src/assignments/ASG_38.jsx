import BackToHome from "../component/BackToHome";
import "../assignments/ASG_38.css";
import { useState, useEffect, useRef } from "react";

export default function ASG_38() {
  const frame = useRef(null);
  const position = useRef({ x: 50, y: 50 });
  const speed = useRef({ x: 5, y: 7 });
  const [count, setCount] = useState(0);
  const barPosition = useRef({x:0 ,y:0})

  const animate = () => {
    frame.current = requestAnimationFrame(animate);
    // console.log("Position:", position.current);

    position.current.y += speed.current.y;
    position.current.x += speed.current.x;

    // bottom and top walls
    if (position.current.y >= 470 || position.current.y <= 0) {
      speed.current.y = -speed.current.y;
    }

    // right and left walls
    if (position.current.x >= 470 || position.current.x <= 0) {
      speed.current.x = -speed.current.x;
    }

    setCount((prev) => prev + 1);
  };

  const onChangeX = (e) => {
    const speedX = Number(e.target.value);
    speed.current.x = speedX;
    setCount((prev) => prev + 1);
  };

  const onChangeY = (e) => {
    const speedY = Number(e.target.value);
    speed.current.y = speedY;
    setCount((prev) => prev + 1);
  };

  const onMouseMove = (event) => {
    const boxRect = event.currentTarget.getBoundingClientRect();
    let x = event.clientX - boxRect.left - 50;
    x = Math.max(0, Math.min(x, 380)); 
    barPosition.current.x = x;
    setCount((prev) => prev + 1); // trigger re-render
  }

  useEffect(() => {
    animate();

    return () => {
      cancelAnimationFrame(frame.current);
    };
  }, []);

  return (
    <div className="asg38">
      <BackToHome />
      <h1 className="assignment-title">Assignment-38</h1>
      <hr />
      <br />
      <div className="box" onMouseMove={onMouseMove}>
        <div
          className="ball"
          style={{
            left: position.current.x + "px",
            top: position.current.y + "px",
          }}
        />
        <div className="bar" style={{left: barPosition.current.x + "px"}}/>
      </div>
      <div>
        <input type="range" id="range-x" min="0" max="8" onChange={onChangeX} />
        <span>Speed of X</span>
      </div>
      <div>
        <input type="range" id="range-x" min="0" max="8" onChange={onChangeY} />
        <span>Speed of Y</span>
      </div>
    </div>
  );
}
