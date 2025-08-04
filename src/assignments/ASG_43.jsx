import BackToHome from "../component/BackToHome";
import "../assignments/ASG_43.css";
import { useState, useEffect } from "react";

// Import 8 directional GIFs
import arrowUp from "../assets/arrow-up.gif";
import arrowDown from "../assets/arrow-down.gif";
import arrowLeft from "../assets/arrow-left.gif";
import arrowRight from "../assets/arrow-right.gif";
import arrowUpLeft from "../assets/arrow-up-left.gif";
import arrowUpRight from "../assets/arrow-up-right.gif";
import arrowDownLeft from "../assets/arrow-down-left.gif";
import arrowDownRight from "../assets/arrow-down-right.gif";

// Map directions to image
const gifMap = {
  up: arrowUp,
  down: arrowDown,
  left: arrowLeft,
  right: arrowRight,
  "up-left": arrowUpLeft,
  "up-right": arrowUpRight,
  "down-left": arrowDownLeft,
  "down-right": arrowDownRight,
};

// Default fallback
const fallbackGif = arrowRight;

export default function ASG_43() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [direction, setDirection] = useState("right");

  useEffect(() => {
    const handleMouseMove = (event) => {
      const { clientX, clientY, movementX, movementY } = event;
      setMouse({ x: clientX, y: clientY });

      // Detect diagonal or straight direction
      let dir = "";
      if (movementX > 0 && movementY > 0) dir = "down-right";
      else if (movementX > 0 && movementY < 0) dir = "up-right";
      else if (movementX < 0 && movementY > 0) dir = "down-left";
      else if (movementX < 0 && movementY < 0) dir = "up-left";
      else if (movementX > 0) dir = "right";
      else if (movementX < 0) dir = "left";
      else if (movementY > 0) dir = "down";
      else if (movementY < 0) dir = "up";

      if (dir) {
        setDirection(dir);
        console.log(`Direction: ${dir}, Mouse: (${clientX}, ${clientY})`);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="asg43 custom-cursor-container">
      <BackToHome />
      {mouse.x !== 0 || mouse.y !== 0 ? (
        <img
          src={gifMap[direction] || fallbackGif}
          alt="cursor"
          className="asg43-cursor-img"
          style={{
            left: Math.max(50, Math.min(window.innerWidth - 50, mouse.x)),
            top: Math.max(50, Math.min(window.innerHeight - 50, mouse.y)),
          }}
        />
      ) : null}
    </div>
  );
}
      
