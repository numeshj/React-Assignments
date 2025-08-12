import BackToHome from "../component/BackToHome";
import "../assignments/ASG_49.css";
import { useState, useEffect, useRef } from "react";

const ROWS = 13;
const COLS = 13;
const INIT_SNAKE = Array.from({ length: 2 }, (_, i) => ({ x: i, y: 6 }));

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

export default function ASG_49() {
  const [snake, setSnake] = useState(INIT_SNAKE);
  const [dir, setDir] = useState({ x: 1, y: 0 });
  const [blinkingCell, setBlinkingCell] = useState(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const intervalRef = useRef();
  const blinkingCellRef = useRef(blinkingCell);
  const snakeRef = useRef(snake);

  function getRandomEmptyCell(snakeArr) {
    const emptyCells = [];
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        if (!snakeArr.some((s) => s.x === x && s.y === y)) {
          emptyCells.push({ x, y });
        }
      }
    }
    if (emptyCells.length === 0) return null;
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
  }

  // Place initial blinking cell (food)
  useEffect(() => {
    setBlinkingCell(getRandomEmptyCell(INIT_SNAKE));
    setScore(0);
    setGameOver(false);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    blinkingCellRef.current = blinkingCell;
  }, [blinkingCell]);
  useEffect(() => {
    snakeRef.current = snake;
  }, [snake]);

  useEffect(() => {
    if (gameOver) return;
    intervalRef.current = setInterval(() => {
      setSnake((prev) => {
        const head = prev[prev.length - 1];
        const newHead = {
          x: (head.x + dir.x + COLS) % COLS,
          y: (head.y + dir.y + ROWS) % ROWS,
        };

        if (prev.some((s) => s.x === newHead.x && s.y === newHead.y)) {
          setGameOver(true);
          return prev;
        }

        let newSnake = [...prev.slice(1), newHead];

        if (
          blinkingCellRef.current &&
          newHead.x === blinkingCellRef.current.x &&
          newHead.y === blinkingCellRef.current.y
        ) {
          newSnake = [...prev, newHead];

          setScore((s) => s + 1);

          setBlinkingCell(getRandomEmptyCell(newSnake));
        }

        return newSnake;
      });
    }, 200);
    return () => clearInterval(intervalRef.current);
  }, [dir, gameOver]);

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

  useEffect(() => {
    if (!gameOver) return;
    const timeout = setTimeout(() => {
      setSnake(INIT_SNAKE);
      setDir({ x: 1, y: 0 });
      setBlinkingCell(getRandomEmptyCell(INIT_SNAKE));
      setScore(0);
      setGameOver(false);
    }, 2000);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line
  }, [gameOver]);

  // Render grid
  const grid = [];
  for (let y = 0; y < ROWS; y++) {
    const row = [];
    for (let x = 0; x < COLS; x++) {
      const isSnake = snake.some((s) => s.x === x && s.y === y);
      const isBlink = blinkingCell && blinkingCell.x === x && blinkingCell.y === y;
      let cellClass = "board-asg49-cell";
      if (isSnake) cellClass += " board-asg49-snake";
      if (isBlink) cellClass += " board-asg49-blink";
      row.push(
        <div
          key={x}
          className={cellClass}
          data-snake={isSnake ? "1" : "0"}
        ></div>
      );
    }
    grid.push(
      <div className="board-asg49-row" key={y}>
        {row}
      </div>
    );
  }

  return (
    <div className="asg49">
      <BackToHome />
      <h1 className="assignment-title">Assignment-49</h1>
      <hr />
      <div className="asg49-hud">
        <span className="asg49-score-label">
          <span className="asg49-score-icon">★</span> Score: <span className="asg49-score">{score}</span>
        </span>
      </div>
      <br />
      <div className="container-asg49">
        <div className="board-asg49">{grid}</div>
        <div className="hint-asg49">
          Use W, A, S, D, or Arrow Keys<br />
          <span style={{ color: "#2196f3" }}>Blinking cell is food!</span>
        </div>
      </div>
      {gameOver && (
        <div className="asg49-gameover-overlay">
          <div className="asg49-gameover-popup">
            <div className="asg49-gameover-text">Game Over</div>
            <div className="asg49-restart-text">Restarting...</div>
            <div className="asg49-final-score">Score: <span>{score}</span></div>
          </div>
        </div>
      )}
    </div>
  );
}
