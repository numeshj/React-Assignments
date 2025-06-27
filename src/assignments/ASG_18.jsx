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
      <h1 className="assignment-title">Color Clicker Game</h1>
      <div className="score-panel">
        <span className="score-label">Score:</span>{" "}
        <span className="score-value">{score}</span>
        <span
          className="score-icon"
          style={{
            display: 'inline-block',
            width: 32,
            height: 32,
            marginLeft: 10,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            verticalAlign: 'middle',
            backgroundImage: !gameOver
              ? `url('data:image/svg+xml,<svg version="1.1" viewBox="0 0 16 16" width="200" height="200" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="fill: rgb(240, 234, 66); opacity: 1; transform: rotate(0deg) scale(1, 1);"><g>    <g style="transform-origin: center center;" class="glyph_animate" index="1">                    <path d="M4.968 9.75a.5.5 0 1 0-.866.5A4.498 4.498 0 0 0 8 12.5a4.5 4.5 0 0 0 3.898-2.25.5.5 0 1 0-.866-.5A3.498 3.498 0 0 1 8 11.5a3.498 3.498 0 0 1-3.032-1.75zM7 5.116V5a1 1 0 0 0-1-1H3.28a1 1 0 0 0-.97 1.243l.311 1.242A2 2 0 0 0 4.561 8H5a2 2 0 0 0 1.994-1.839A2.99 2.99 0 0 1 8 6c.393 0 .74.064 1.006.161A2 2 0 0 0 11 8h.438a2 2 0 0 0 1.94-1.515l.311-1.242A1 1 0 0 0 12.72 4H10a1 1 0 0 0-1 1v.116A4.22 4.22 0 0 0 8 5c-.35 0-.69.04-1 .116z"></path><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-1 0A7 7 0 1 0 1 8a7 7 0 0 0 14 0z"></path>                                                                                        <animateTransform id="glyph_animate_element_1" attributeName="transform" type="scale" dur="1s" values="1;0.7;1" repeatCount="indefinite"></animateTransform>    </g>    </g></svg>')`
              : `url('data:image/svg+xml,<svg version="1.1" viewBox="0 0 16 16" width="200" height="200" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="fill: rgb(240, 66, 66); opacity: 1; transform: rotate(0deg) scale(1, 1);"><g>    <g style="transform-origin: center center;" class="glyph_animate" index="1">                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"></path><path d="M4 10.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5zm5 0a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z"></path>                                                                                                                                        <animateTransform id="glyph_animate_element_1" attributeName="transform" type="scale" dur="1s" values="1;0.7;1" repeatCount="indefinite"></animateTransform>    </g>    </g></svg>')`,
          }}
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
          <div className="game-over-content">
            <h2>Game Over!</h2>
            <p>
              Your final score: <span className="final-score">{score}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
