import BackToHome from "../component/BackToHome";
import "../assignments/ASG_47.css";
import { useEffect, useRef, useState } from "react";

export default function ASG_47() {
  const [tick, setTick] = useState(0);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [highScore, setHighScore] = useState(0);
  const [highLevel, setHighLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [visible, setVisible] = useState(true);

  const groundRef = useRef(null);
  const skyRef = useRef(null);
  const dinoRef = useRef(null);
  const containerRef = useRef(null);

  const treeRefs = [useRef(null), useRef(null), useRef(null)];
  const treeOffsets = useRef([80, 140, 260]);
  const scoredFlags = useRef([false, false, false]);

  const groundOffset = useRef(0);
  const skyOffset = useRef(0);

  const baseSpeed = useRef({ ground: 0.9, sky: 0.1, tree: 0.9 });
  const speed = useRef({ ...baseSpeed.current });

  const minGap = 60;
  const maxGap = 200;

  const getRandomGap = () => minGap + Math.random() * (maxGap - minGap);

  const resetGame = () => {
    setScore(0);
    setLevel(1);
    setGameOver(false);
    groundOffset.current = 0;
    skyOffset.current = 0;
    treeOffsets.current = [80, 140, 260];
    scoredFlags.current = [false, false, false];
    speed.current = { ...baseSpeed.current };
    setVisible(true);
    if (dinoRef.current) {
      dinoRef.current.src = "./asg46/dino-run-game-dino.gif";
      dinoRef.current.style.transition = "none";
      dinoRef.current.style.bottom = "20vh";
      dinoRef.current.style.zIndex = "21";
      dinoRef.current.dataset.jumping = "false";
      void dinoRef.current.offsetHeight;
      dinoRef.current.style.transition = "bottom 1.5s ease-in";
    }
  };

  useEffect(() => {
    if (gameOver) {
      setHighScore((prev) => Math.max(prev, score));
      setHighLevel((prev) => Math.max(prev, level));
    }
  }, [gameOver, score, level]);

  useEffect(() => {
    let frameId;
    const animate = () => {
      if (gameOver) return;

      groundOffset.current -= speed.current.ground;
      skyOffset.current -= speed.current.sky;
      if (groundRef.current)
        groundRef.current.style.backgroundPositionX = `${groundOffset.current}vh`;
      if (skyRef.current)
        skyRef.current.style.backgroundPositionX = `${skyOffset.current}vh`;

      treeOffsets.current.forEach((offset, idx) => {
        treeOffsets.current[idx] -= speed.current.tree;

        const tree = treeRefs[idx].current;
        const dino = dinoRef.current;

        // Collision detection
        if (
          tree && dino &&
          treeOffsets.current[idx] < 28 &&
          treeOffsets.current[idx] + 9 > 18 &&
          dino.dataset.jumping !== "true"
        ) {
          setGameOver(true);

          // Animate dino falling in front of ground
          if (dino) {
            dino.src = "./asg46/dino-run-game-dino.gif";
            dino.style.transition = "bottom 1.5s ease-in";
            dino.style.zIndex = "21";
            dino.style.bottom = "-25vh";
          }

          setTimeout(() => resetGame(), 2000);
          return;
        }

        // Only count score if not game over and dino has passed the tree
        if (
          !scoredFlags.current[idx] &&
          treeOffsets.current[idx] + 4.5 < 18 &&
          !gameOver // <-- only count if not game over
        ) {
          setScore((prev) => prev + 1);
          scoredFlags.current[idx] = true;
        }

        if (treeOffsets.current[idx] < -10) {
          const lastIndex = (idx + treeRefs.length - 1) % treeRefs.length;
          const lastX = treeOffsets.current[lastIndex];
          treeOffsets.current[idx] = Math.max(lastX, 100) + getRandomGap();
          scoredFlags.current[idx] = false;
        }

        if (tree) tree.style.left = `${treeOffsets.current[idx]}vh`;
      });

      setTick((t) => t + 1);
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [gameOver]);

  useEffect(() => {
    if (score > 0 && score % 5 === 0) {
      setLevel((prev) => {
        const next = prev + 1;
        speed.current.ground *= 1.1;
        speed.current.sky *= 1.1;
        speed.current.tree *= 1.1;
        return next;
      });
    }
  }, [score]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Space") {
        setVisible(true);
        if (dinoRef.current && dinoRef.current.dataset.jumping !== "true") {
          dinoRef.current.style.bottom = "20vh";
          dinoRef.current.dataset.jumping = "true";
          setTimeout(() => {
            if (dinoRef.current) dinoRef.current.dataset.jumping = "false";
          }, 500);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="asg47">
      <BackToHome />
      <div className="hud">
        <div className="center">
          <div className="score">Score: {score}</div>
          <div className="level">Level: {level}</div>
        </div>
        <div className="right">
          <div>High Score: {highScore}</div>
          <div>High Level: {highLevel}</div>
        </div>
      </div>
      {gameOver && <div className="game-over">Game Over</div>}
      <div className="container-asg47" ref={containerRef}>
        <div className="sky">
          <div
            className="sky-img"
            ref={skyRef}
            style={{ backgroundImage: "url('./asg46/dino-run-game-sky.png')" }}
          ></div>

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

        <div
          className="ground"
          ref={groundRef}
          style={{ backgroundImage: "url('./asg46/dino-run-game-ground.jpg')" }}
        ></div>

        {visible && (
          <img
            ref={dinoRef}
            src="./asg46/dino-run-game-dino.gif"
            className="dino"
            data-jumping="false"
            alt="dino"
          />
        )}
      </div>
    </div>
  );
}
