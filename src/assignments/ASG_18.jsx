import BackToHome from "../component/BackToHome";
import "../assignments/AGS_18.css";
import { useEffect, useState, useRef } from "react";

export default function ASG_18() {
  const [colors, setColors] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!started || gameOver) return;
    intervalRef.current = setInterval(() => {
      setColors((prevColors) => {
        const random = Math.random();
        const newColor = random < 0.5 ? "blue" : "red";
        const updatedColors = [...prevColors];
        updatedColors.unshift(newColor); 
        if (updatedColors.length > 6) {
          setGameOver(true);
          setShowGameOver(true);
          clearInterval(intervalRef.current);
        }
        return updatedColors;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [started, gameOver]);

  useEffect(() => {
    if (gameOver && showGameOver) {
      const timer = setTimeout(() => {
        setShowGameOver(false);
        setStarted(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [gameOver, showGameOver]);

  function handleColorClick(color) {
    if (!started || gameOver) return;
    setColors((prevColors) => {
      if (prevColors.length === 0) return prevColors;
      const lastColor = prevColors[prevColors.length - 1];
      if (lastColor === color) {
        setScore((prevScore) => prevScore + 1);
        return prevColors.slice(0, -1);
      } else {
        setGameOver(true);
        setShowGameOver(true);
        clearInterval(intervalRef.current);
        return prevColors;
      }
    });
  }

  function handleRestart() {
    setColors([]);
    setScore(0);
    setGameOver(false);
    setShowGameOver(false);
    setStarted(false);
    clearInterval(intervalRef.current);
  }

  function handleStart() {
    setColors([]);
    setScore(0);
    setGameOver(false);
    setStarted(true);
  }

  return (
    <div className="color-clicker-container">
      <BackToHome />
      <h1 className="assignment-title">
        {showGameOver ? "Game Over!" : "Color Clicker Game"}
      </h1>
      <div className="score-panel">
        <span className="score-label">Score:</span>{" "}
        <span className="score-value">{score}</span>
        <span
          className="score-icon"
          data-gameover={gameOver}
        ></span>
      </div>
      {!started && (
        <div className="start-panel">
          <button className="start-btn" onClick={handleStart}>
            Start Game
          </button>
        </div>
      )}
      {started && (
        <>
          <div className="game-board">
            <div className="color-stack">
              {colors.map((color, index) => (
                <div
                  key={index}
                  className={`color-block color-block-${color}`}
                ></div>
              ))}
            </div>
          </div>
          <div className="button-panel">
            <button
              className="color-btn color-btn-red"
              disabled={gameOver}
              onClick={() => handleColorClick("red")}
            >
              Red
            </button>
            <button
              className="color-btn color-btn-blue"
              disabled={gameOver}
              onClick={() => handleColorClick("blue")}
            >
              Blue
            </button>
          </div>
        </>
      )}
      {showGameOver && (
        <div className="game-over-modal">
          <div className="game-over-content" style={{ boxShadow: "none", background: "none", padding: 0, textAlign: "center" }}>
            {/* Empty div to keep modal overlay, but content is now in the main title area */}
            <p style={{marginTop: 0}}>
              Your final score: <span className="final-score">{score}</span>
            </p>
            <button className="restart-btn" onClick={handleRestart}>
              Restart
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
