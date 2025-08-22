import BackToHome from "../component/BackToHome";
import "../assignments/ASG_56.css";
import { useState, useEffect } from "react";

export default function ASG_56() {
  const size = 3;
  const boardSize = 400;
  const tileSize = boardSize / size;

  const [grid, setGrid] = useState([]);
  const [empty, setEmpty] = useState([size - 1, size - 1]);
  const [solved, setSolved] = useState(false);

  // Initialize solved grid, then shuffle
  useEffect(() => {
    const initial = [];
    let n = 1;
    for (let r = 0; r < size; r++) {
      const row = [];
      for (let c = 0; c < size; c++) {
        row.push(n < size * size ? n : 0);
        n++;
      }
      initial.push(row);
    }
    setGrid(initial);
    setEmpty([size - 1, size - 1]);

    setTimeout(() => {
      shuffle(initial, [size - 1, size - 1]);
    }, 100);
  }, []);

  // Shuffle by random valid moves
  function shuffle(startGrid, startEmpty) {
    let moves = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
    let g = startGrid.map(row => [...row]);
    let e = [...startEmpty];

    for (let i = 0; i < 100; i++) {
      const move = moves[Math.floor(Math.random() * moves.length)];
      let [er, ec] = e;
      let nr = er, nc = ec;

      if (move === "ArrowUp") nr++;
      if (move === "ArrowDown") nr--;
      if (move === "ArrowLeft") nc++;
      if (move === "ArrowRight") nc--;

      if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
        [g[er][ec], g[nr][nc]] = [g[nr][nc], g[er][ec]];
        e = [nr, nc];
      }
    }

    setGrid(g);
    setEmpty(e);
  }

  function initialize() {
    const initial = [];
    let n = 1;
    for (let r = 0; r < size; r++) {
      const row = [];
      for (let c = 0; c < size; c++) {
        row.push(n < size * size ? n : 0);
        n++;
      }
      initial.push(row);
    }
    setGrid(initial);
    setEmpty([size - 1, size - 1]);
    setSolved(false);

    setTimeout(() => {
      shuffle(initial, [size - 1, size - 1]);
    }, 100);
  }

  // useEffect on mount → call initialize once
  useEffect(() => {
    initialize();
  }, []);
  
  // Listen for keyboard input
  useEffect(() => {
    function handleKey(e) {
      if (solved) return;
      const key = e.key.toLowerCase();
      moveTile(key);
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [grid, empty, solved]);

  // Move the empty tile
  function moveTile(key) {
    let [er, ec] = empty;
    let nr = er, nc = ec;

    if (key === "arrowup" || key === "w") nr++;
    if (key === "arrowdown" || key === "s") nr--;
    if (key === "arrowleft" || key === "a") nc++;
    if (key === "arrowright" || key === "d") nc--;

    if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
      const newGrid = grid.map(r => [...r]);
      [newGrid[er][ec], newGrid[nr][nc]] = [newGrid[nr][nc], newGrid[er][ec]];
      setGrid(newGrid);
      setEmpty([nr, nc]);
      checkSolved(newGrid);
    }
  }

  // --- NEW: Check if puzzle is solved ---
  function checkSolved(g) {
    let count = 1;
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (r === size - 1 && c === size - 1) {
          if (g[r][c] !== 0) return; // last must be empty
        } else if (g[r][c] !== count) {
          return; // not in order
        }
        count++;
      }
    }
    setSolved(true);
  }

  // Restart button
  function restart() {
    initialize();
  }

  return (
    <div className="asg56">
      <BackToHome />
      <h1 className="assignment-title">Assignment-56</h1>
      <hr />
      <br />

      <div className="container-asg56">
        <div className="hint-asg56">Use Arrow Keys or W, A, S, D to move puzzle tiles</div>

        <div className="puzzle-asg56" data-solved={solved}>
          {solved ? (
            // Show full image when solved
            <div
              style={{
                width: `${boardSize}px`,
                height: `${boardSize}px`,
                backgroundImage: "url(./asg56/sliding-puzzle.jpg)",
                backgroundSize: `${boardSize}px`,
                borderRadius: "8px",
              }}
            />
          ) : (
            grid.map((row, r) => (
              <div className="row-asg56" key={`row-${r}`}>
                {row.map((val, c) => {
                  const colIndex = val === 0 ? 0 : (val - 1) % size;
                  const rowIndex = val === 0 ? 0 : Math.floor((val - 1) / size);
                  const bgPos =
                    val === 0
                      ? "none"
                      : `-${colIndex * tileSize}px -${rowIndex * tileSize}px`;

                  return (
                    <div
                      key={`tile-${r}-${c}`}
                      className="tile-asg56"
                      style={{
                        backgroundImage:
                          val === 0
                            ? "none"
                            : "url(./asg56/sliding-puzzle.jpg)",
                        backgroundSize: `${boardSize}px`,
                        backgroundPosition: bgPos,
                      }}
                    />
                  );
                })}
              </div>
            ))
          )}
        </div>

        {solved && (
          <button
            onClick={restart}
            style={{
              marginTop: "20px",
              padding: "10px",
              fontSize: "16px",
              borderRadius: "6px",
            }}
          >
            Restart
          </button>
        )}
      </div>
    </div>
  );
}
