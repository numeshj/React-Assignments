import BackToHome from "../component/BackToHome";
import "../assignments/ASG_48.css";
import { useState, useEffect, useRef } from "react";

const ROWS = 13;
const COLS = 13;
const INIT_SNAKE = Array.from({ length: 8 }, (_, i) => ({ x: i, y: 6 }));

const DIRS = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
  w: { x: 0, y: -1 },
  s: { x: 0, y: 1 },
  a: { x: -1, y: 0 },
  d: { x: 1, y: 0 },
};

export default function ASG_48() {
  const [snake, setSnake] = useState(INIT_SNAKE);
  const [dir, setDir] = useState({ x: 1, y: 0 }); 
  const intervalRef = useRef();

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSnake((prev) => {
        const head = prev[prev.length - 1];
        const newHead = {
          x: (head.x + dir.x + COLS) % COLS,
          y: (head.y + dir.y + ROWS) % ROWS,
        };
        const next = [...prev.slice(1), newHead];
        return next;
      });
    }, 200);
    return () => clearInterval(intervalRef.current);
  }, [dir]);

  // Handle keyboard
  useEffect(() => {
    const handleKey = (e) => {
      const key = e.key;
      if (DIRS[key]) {
        const nextDir = DIRS[key];
        // Prevent reversing
        if (
          snake.length > 1 &&
          snake[snake.length - 1].x + nextDir.x === snake[snake.length - 2].x &&
          snake[snake.length - 1].y + nextDir.y === snake[snake.length - 2].y
        ) {
          return;
        }
        setDir(nextDir);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [snake]);

  // Render grid
  const grid = [];
  for (let y = 0; y < ROWS; y++) {
    const row = [];
    for (let x = 0; x < COLS; x++) {
      const isSnake = snake.some((s) => s.x === x && s.y === y);
      row.push(
        <div
          key={x}
          className="board-asg48-cell"
          data-snake={isSnake ? "1" : "0"}
        ></div>
      );
    }
    grid.push(
      <div className="board-asg48-row" key={y}>
        {row}
      </div>
    );
  }

  return (
    <div className="asg48">
      <BackToHome />
      <h1 className="assignment-title">Assignment-48</h1>
      <hr />
      <br />
      <div className="container-asg48">
        <div className="board-asg48">{grid}</div>
        <div className="hint-asg48">Use W, A, S, D, or Arrow Keys</div>
      </div>
    </div>
  );
}
