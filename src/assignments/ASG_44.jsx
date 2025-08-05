import { useEffect, useRef, useState } from "react";
import BackToHome from "../component/BackToHome";
import "../assignments/ASG_44.css";

export default function ASG_44() {
  // Score state
  const [score, setScore] = useState(0);

  // Refs for game state and DOM
  const knifeHitsRef = useRef([]); // Array of hit angles (saved when knife hits)
  const baseRotationRef = useRef(0); // Current rotation of base
  const directionRef = useRef(1); // Rotation direction
  const animationRef = useRef(null); // Animation frame id
  const gameOverRef = useRef(false); // Game over flag
  const knifeFlyingRef = useRef(false); // Is knife flying
  const knifeRef = useRef(null); // Knife DOM ref
  const targetBaseRef = useRef(null); // Target base DOM ref
  const targetRef = useRef(null); // Target DOM ref

  // Animation loop for rotating base and target
  useEffect(() => {
    const animate = () => {
      if (gameOverRef.current) return;

      // Update rotation
      baseRotationRef.current += directionRef.current * 2;
      baseRotationRef.current = (baseRotationRef.current + 360) % 360;

      // Apply rotation to DOM
      if (targetBaseRef.current) {
        targetBaseRef.current.style.transform = `translate(-50%, -50%) rotate(${baseRotationRef.current}deg)`;
      }
      if (targetRef.current) {
        targetRef.current.style.transform = `translate(-50%, -50%) rotate(${baseRotationRef.current}deg)`;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, []);

  // Handle knife click: animate knife to target-base
  const handleKnifeClick = () => {
    if (knifeFlyingRef.current || gameOverRef.current) return;

    knifeFlyingRef.current = true;
    if (knifeRef.current) {
      knifeRef.current.style.transition = "top 0.2s linear";
      // Move knife to the bottom edge of target-base (not center)
      knifeRef.current.style.top = "calc(50% + 125px)";
    }

    // After animation, check hit
    setTimeout(() => {
      // Calculate hit position based on knife and target-base centers
      if (knifeRef.current && targetBaseRef.current) {
        const knifeRect = knifeRef.current.getBoundingClientRect();
        const baseRect = targetBaseRef.current.getBoundingClientRect();
        const baseCenterX = baseRect.left + baseRect.width / 2;
        const baseCenterY = baseRect.top + baseRect.height / 2;
        const knifeCenterX = knifeRect.left + knifeRect.width / 2;
        const knifeCenterY = knifeRect.top + knifeRect.height / 2;
        // Calculate angle from base center to knife center
        const dx = knifeCenterX - baseCenterX;
        const dy = knifeCenterY - baseCenterY;
        let hitAngle = Math.atan2(dy, dx) * (180 / Math.PI);
        hitAngle = (hitAngle - 90 + 360) % 360; // bottom side
        // Adjust for current base rotation
        hitAngle = (hitAngle - baseRotationRef.current + 360) % 360;
        handleKnifeHit(hitAngle);
      } else {
        handleKnifeHit(baseRotationRef.current);
      }
    }, 200);
  };

  // Handle knife hit: check collision, stick knife, update score/direction
  const handleKnifeHit = (hitAngle) => {
    // Check collision with previous knives
    const collision = knifeHitsRef.current.some((deg) => {
      const diff = Math.abs((deg - hitAngle + 360) % 360);
      return diff < 15 || 360 - diff < 15;
    });

    if (collision) {
      gameOverRef.current = true;
      setScore((s) => s); // force render
      setTimeout(() => restartGame(), 1000);
      return;
    }

    // Stick knife to base at calculated angle
    knifeHitsRef.current.push(hitAngle); // Assign knife-hit at the saved angle
    setScore((s) => s + 1);
    directionRef.current *= -1; // Reverse rotation

    // Reset knife for next throw
    if (knifeRef.current) {
      knifeRef.current.style.transition = "none";
      knifeRef.current.style.top = "calc(90% - 60px)";
    }

    knifeFlyingRef.current = false;
  };

  // Restart game after game over
  const restartGame = () => {
    knifeHitsRef.current = [];
    baseRotationRef.current = 0;
    directionRef.current = 1;
    gameOverRef.current = false;
    knifeFlyingRef.current = false;
    if (knifeRef.current) {
      knifeRef.current.style.transition = "none";
      knifeRef.current.style.top = "calc(90% - 60px)";
    }
    setScore(0);

    // Restart animation loop
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    const animate = () => {
      if (gameOverRef.current) return;
      baseRotationRef.current += directionRef.current * 2;
      baseRotationRef.current = (baseRotationRef.current + 360) % 360;
      if (targetBaseRef.current) {
        targetBaseRef.current.style.transform = `translate(-50%, -50%) rotate(${baseRotationRef.current}deg)`;
      }
      if (targetRef.current) {
        targetRef.current.style.transform = `translate(-50%, -50%) rotate(${baseRotationRef.current}deg)`;
      }
      animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);
  };

  return (
    <div className="asg44">
      <BackToHome />
      <div className="container">
        {/* Score display */}
        <div className="score">{gameOverRef.current ? "Game Over" : `Score: ${score}`}</div>

        {/* Rotating target base with stuck knives */}
        <div ref={targetBaseRef} className="target-base">
          {knifeHitsRef.current.map((deg, i) => (
            // Assign knife-hit at the saved angle, ensure knife is upside down (tip at bottom)
            <div
              key={i}
              className="knife-hit"
              style={{
                // Add 180deg to flip knife upside down
                transform: `translate(-50%, -50%) rotate(${deg + 360}deg) translateY(125px)`,
              }}
            />
          ))}
        </div>

        {/* Rotating target (must be rendered after knife-hit for correct stacking) */}
        <div ref={targetRef} className="target" />

        {/* Flying knife (click to throw) */}
        {!gameOverRef.current && (
          <div
            ref={knifeRef}
            className="knife"
            onClick={handleKnifeClick}
            style={{
              top: "calc(90% - 60px)",
              cursor: "pointer",
            }}
          />
        )}
      </div>
    </div>
  );
}

