import BackToHome from "../component/BackToHome";
import "../assignments/ASG_38.css";
import { useState, useEffect, useRef } from "react";

export default function ASG_38() {
  const frame = useRef(null);
  const position = useRef({ x: 50, y: 50 });
  const speed = useRef({ x: 1, y: 1 });
  const [count, setCount] = useState(0);
  const barPosition = useRef({ x: 0, y: 0 });

  const animate = () => {
    frame.current = requestAnimationFrame(animate);

    position.current.y += speed.current.y;
    position.current.x += speed.current.x;

    const ballX = position.current.x;
    const ballY = position.current.y;
    const barX = barPosition.current.x;
    const barY = 250;
    const barWidth = 100;
    const barHeight = 5;
    const ballSize = 10;

    if (
      ballX + ballSize >= barX &&
      ballX <= barX + barWidth &&
      ballY + ballSize >= barY &&
      ballY <= barY + barHeight
    ) {
      if (ballY <= 240) {
        speed.current.y = -Math.abs(speed.current.y);
      } else if (ballY >= 245) {
        speed.current.y = Math.abs(speed.current.y);
      }
    }

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
    setCount((prev) => prev + 1);
  };

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
        <div className="bar" style={{ left: barPosition.current.x + "px" }} />
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
