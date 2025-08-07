import BackToHome from "../component/BackToHome";
import "../assignments/ASG_46.css";
import { useEffect, useRef, useState } from "react";

export default function ASG_46() {
  const [tick, setTick] = useState(0);
  const groundRef = useRef(null);
  const skyRef = useRef(null);

  // Multiple tree refs
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

  useEffect(() => {
    let frameId;

    const animate = () => {
      // ground scroll
      groundOffset.current -= speed.ground;
      if (groundRef.current) {
        groundRef.current.style.backgroundPositionX = `${groundOffset.current}vh`;
      }

      // sky scroll
      skyOffset.current -= speed.sky;
      if (skyRef.current) {
        skyRef.current.style.backgroundPositionX = `${skyOffset.current}vh`;
      }

      // trees scroll and reset
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

  return (
    <div className="asg46">
      <BackToHome />
      <div className="container-asg46">
        {/* Sky Section */}
        <div className="sky">
          <div className="sky-img" ref={skyRef}></div>

          {/* Dino */}
          <img
            src="./asg46/dino-run-game-dino.gif"
            className="dino"
            data-jumping="false"
            alt="dino"
          />

          {/* Trees */}
          {treeRefs.map((ref, i) => (
            <img
              key={i}
              ref={ref}
              src="./asg46/dino-run-game-tree.png"
              className="tree"
              alt={`tree-${i}`}
            />
          ))}
        </div>

        {/* Ground Section */}
        <div className="ground" ref={groundRef}></div>
      </div>
    </div>
  );
}
