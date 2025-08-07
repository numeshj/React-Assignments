import BackToHome from "../component/BackToHome";
import "../assignments/ASG_46.css";
import { useEffect, useRef, useState } from "react";

export default function ASG_46() {
  const [tick, setTick] = useState(0);
  const groundRef = useRef(null);
  const skyRef = useRef(null);
  const dinoRef = useRef(null);

  const treeRefs = [useRef(null), useRef(null), useRef(null)];
  const treeOffsets = useRef([80, 140, 260]);

  const groundOffset = useRef(0);
  const skyOffset = useRef(0);

  const speed = {
    ground: 0.9,
    sky: 0.1,
    tree: 0.9,
  };

  const minGap = 60;
  const maxGap = 200;

  const getRandomGap = () => {
    return minGap + Math.random() * (maxGap - minGap);
  };

  // Animation loop
  useEffect(() => {
    let frameId;

    const animate = () => {
      // move ground
      groundOffset.current -= speed.ground;
      if (groundRef.current) {
        groundRef.current.style.backgroundPositionX = `${groundOffset.current}vh`;
      }

      // move sky
      skyOffset.current -= speed.sky;
      if (skyRef.current) {
        skyRef.current.style.backgroundPositionX = `${skyOffset.current}vh`;
      }

      // move trees
      treeOffsets.current.forEach((offset, idx) => {
        treeOffsets.current[idx] -= speed.tree;

        if (treeOffsets.current[idx] < -10) {
          const lastIndex = (idx + treeRefs.length - 1) % treeRefs.length;
          const lastX = treeOffsets.current[lastIndex];
          treeOffsets.current[idx] = Math.max(lastX, 100) + getRandomGap();
        }

        const ref = treeRefs[idx].current;
        if (ref) {
          ref.style.left = `${treeOffsets.current[idx]}vh`;
        }
      });

      setTick((prev) => prev + 1);
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, []);

  // Handle spacebar jump
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Space") {
        const dino = dinoRef.current;
        if (!dino || dino.dataset.jumping === "true") return;

        dino.dataset.jumping = "true";

        setTimeout(() => {
          if (dino) dino.dataset.jumping = "false";
        }, 500); // match animation duration
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="asg46-46">
      <BackToHome />
      <div className="container-asg46-46">
        {/* Sky Section */}
        <div className="sky-46">
          <div
            className="sky-img-46"
            ref={skyRef}
            style={{
              backgroundImage: "url('./asg46/dino-run-game-sky.png')"
            }}
          ></div>

          {/* Dino */}
          <img
            ref={dinoRef}
            src="./asg46/dino-run-game-dino.gif"
            className="dino46"
            data-jumping="false"
            alt="dino"
          />

          {/* Trees */}
          {treeRefs.map((ref, i) => (
            <img
              key={i}
              ref={ref}
              src="./asg46/dino-run-game-tree.png"
              className="tree-46"
              alt={`tree-${i}`}
            />
          ))}
        </div>

        {/* Ground Section */}
        <div
          className="ground-46"
          ref={groundRef}
          style={{
            backgroundImage: "URL('./asg46/dino-run-game-ground.jpg')"
          }}
        ></div>
      </div>
    </div>
  );
}

// Do NOT set dino.style.bottom in your JS
