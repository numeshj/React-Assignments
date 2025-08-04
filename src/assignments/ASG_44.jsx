import BackToHome from "../component/BackToHome";
import "../assignments/ASG_44.css";
import { useState, useRef, useEffect } from "react";

export default function ASG_45() {
  const [score, setScore] = useState(0);
  const [knifeFlying, setKnifeFlying] = useState(false);
  const [knifeY, setKnifeY] = useState(0);
  const [rotateDirection, setRotateDirection] = useState("normal"); // CSS animation direction

  const knifeHitsRef = useRef([]);
  const gameOverRef = useRef(false);
  const restartTimeoutRef = useRef(null);

  // Center target and knives
  const targetSize = 200;
  const knifeLength = 90;

  // Knife hit handler
  function handleKnifeHit() {
    if (gameOverRef.current || knifeFlying) return;
    setKnifeFlying(true);
    // Animate knife flying up
    let start = null;
    function flyKnife(ts) {
      if (!start) start = ts;
      const elapsed = ts - start;
      const progress = Math.min(elapsed / 200, 1); // 200ms animation
      setKnifeY(progress * (targetSize / 2 + knifeLength));
      if (progress < 1) {
        requestAnimationFrame(flyKnife);
      } else {
        setKnifeFlying(false);
        setKnifeY(0);
        // Calculate hit angle based on current time and direction
        // For CSS animation, we estimate angle by time elapsed
        const now = Date.now();
        const baseAngle = ((now / 2000) * 360) % 360;
        const hitAngle =
          rotateDirection === "normal"
            ? baseAngle
            : (360 - baseAngle) % 360;
        // Check collision: within 15deg of any previous hit
        const collision = knifeHitsRef.current.some(
          (prev) =>
            Math.abs(((prev - hitAngle + 360) % 360)) < 15 ||
            Math.abs(((hitAngle - prev + 360) % 360)) < 15
        );
        if (collision) {
          gameOverRef.current = true;
          restartTimeoutRef.current = setTimeout(() => {
            // Restart game after 1s, reverse direction
            knifeHitsRef.current = [];
            setScore(0);
            setRotateDirection((d) =>
              d === "normal" ? "reverse" : "normal"
            );
            gameOverRef.current = false;
          }, 1000);
          return;
        }
        // Success: add hit, increase score, reverse direction
        knifeHitsRef.current.push(hitAngle);
        setScore((s) => s + 1);
        setRotateDirection((d) => (d === "normal" ? "reverse" : "normal"));
      }
    }
    requestAnimationFrame(flyKnife);
  }

  // Render knives on target
  const knives = knifeHitsRef.current.map((angle, idx) => (
    <img
      key={idx}
      src="blade-hit-demo-knife.png"
      alt=""
      className="knife-on-target"
      style={{
        transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-${knifeLength}px)`,
      }}
    />
  ));

  // Game over message
  const isGameOver = gameOverRef.current;

  return (
    <div className="asg44">
      <BackToHome />
      <div className="background">
        <img
          src="blade-hit-demo-background.png"
          alt=""
          style={{ width: "100vw", height: "100vh", objectFit: "cover" }}
        />
      </div>
      <div
        className="count"
        style={{
          position: "absolute",
          top: 40,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 2,
        }}
      >
        Score: {score}
        {isGameOver && <div className="game-over">Game Over!</div>}
      </div>
      <div
        className="target"
        style={{
          width: targetSize,
          height: targetSize,
          zIndex: 2,
        }}
      >
        <img
          src="blade-hit-demo-target.png"
          alt=""
          className="rotating"
          style={{ "--rotate-direction": rotateDirection }}
        />
        {knives}
      </div>
      {/* Knife waiting at bottom center, flies up on click */}
      {!knifeFlying && !isGameOver && (
        <div className="knife" onClick={handleKnifeHit}>
          <img src="blade-hit-demo-knife.png" alt="" />
        </div>
      )}
      {/* Flying knife animation */}
      {knifeFlying && (
        <img
          src="blade-hit-demo-knife.png"
          alt=""
          style={{
            position: "absolute",
            left: "50%",
            bottom: 40 + knifeY,
            transform: "translateX(-50%)",
            zIndex: 3,
            transition: "bottom 0.05s linear",
            pointerEvents: "none",
            width: "80px",
            height: "80px"
          }}
        />
      )}
    </div>
  );
}
