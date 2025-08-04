import BackToHome from "../component/BackToHome";
import "../assignments/ASG_44.css";
import { useEffect, useRef, useState } from "react";

export default function ASG_44() {
  const [score, setScore] = useState(0); // ✅ Only useState

  const knifeHitsRef = useRef([]);       // ✅ Knife angles
  const rotationRef = useRef(0);         // ✅ Current rotation angle in degrees
  const directionRef = useRef(1);        // ✅ 1 for normal, -1 for reverse
  const animationFrameRef = useRef(null);
  const gameOverRef = useRef(false);
  const knifeFlyingRef = useRef(false);
  const lastTimestampRef = useRef(null);

  const targetSize = 200;
  const knifeLength = 90;

  // Rotation animation loop
  useEffect(() => {
    function updateRotation(ts) {
      if (!lastTimestampRef.current) lastTimestampRef.current = ts;
      const delta = ts - lastTimestampRef.current;
      lastTimestampRef.current = ts;

      const degreesPerMs = 360 / 2000;
      rotationRef.current =
        (rotationRef.current + directionRef.current * degreesPerMs * delta) % 360;

      animationFrameRef.current = requestAnimationFrame(updateRotation);
    }

    animationFrameRef.current = requestAnimationFrame(updateRotation);
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, []);

  function handleKnifeClick() {
    if (gameOverRef.current || knifeFlyingRef.current) return;
    knifeFlyingRef.current = true;

    let start = null;
    let animationId;

    function flyKnife(ts) {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / 200, 1);

      if (progress < 1) {
        animationId = requestAnimationFrame(flyKnife);
      } else {
        knifeFlyingRef.current = false;
        const hitAngle = rotationRef.current;

        const hasCollision = knifeHitsRef.current.some((prev) => {
          const diff = Math.abs((prev - hitAngle + 360) % 360);
          return diff < 15 || 360 - diff < 15;
        });

        if (hasCollision) {
          gameOverRef.current = true;
          setTimeout(() => {
            knifeHitsRef.current = [];
            setScore(0);
            directionRef.current *= -1;
            gameOverRef.current = false;
          }, 1000);
        } else {
          knifeHitsRef.current.push(hitAngle);
          setScore((prev) => prev + 1);
          directionRef.current *= -1;
        }
      }
    }

    requestAnimationFrame(flyKnife);
  }

  // Knife visuals (now rotate with the target)
  const knives = knifeHitsRef.current.map((angle, i) => (
    <img
      key={i}
      src="blade-hit-demo-knife.png"
      alt=""
      className="knife-on-target embedded"
      style={{
        transform: `rotate(${angle}deg) translateY(-110px)`,
      }}
    />
  ));

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
      <div className="count">
        Score: {score}
        {gameOverRef.current && <div className="game-over">Game Over!</div>}
      </div>
      <div className="target">
        <div
          className="rotating"
          style={{
            transform: `rotate(${rotationRef.current}deg)`,
            transition: "transform 0.05s linear",
          }}
        >
          <img
            src="blade-hit-demo-target.png"
            alt=""
            style={{ width: "100%", height: "100%" }}
          />
          {knives}
        </div>
      </div>
      {!knifeFlyingRef.current && !gameOverRef.current && (
        <div className="knife" onClick={handleKnifeClick}>
          <img src="blade-hit-demo-knife.png" alt="" />
        </div>
      )}
    </div>
  );
}
