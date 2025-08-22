import BackToHome from "../component/BackToHome";
import "../assignments/ASG_57.css";
import { useState, useEffect } from "react";

export default function ASG_57() {
  const boardSize = 400;

  const [size, setSize] = useState(3);                 // 3x3, 4x4, ...
  const [image, setImage] = useState(""); // start with no image
  const [grid, setGrid] = useState([]);
  const [empty, setEmpty] = useState([size - 1, size - 1]);
  const [solved, setSolved] = useState(false);

  const tileSize = boardSize / size;

  // Build solved grid
  function createGrid() {
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
    return initial;
  }

  // Initialize + shuffle
  function initialize() {
    const initial = createGrid();
    setGrid(initial);
    setEmpty([size - 1, size - 1]);
    setSolved(false);

    setTimeout(() => {
      shuffle(initial, [size - 1, size - 1]);
    }, 50);
  }

  // Shuffle via valid random moves (keeps puzzle solvable)
  function shuffle(startGrid, startEmpty) {
    const moves = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
    let g = startGrid.map(row => [...row]);
    let e = [...startEmpty];

    for (let i = 0; i < 200; i++) {
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

  // Check solved
  function checkSolved(g) {
    let count = 1;
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (r === size - 1 && c === size - 1) {
          if (g[r][c] !== 0) return;
        } else if (g[r][c] !== count) {
          return;
        }
        count++;
      }
    }
    setSolved(true);
  }

  // Keyboard movement (Arrow / WASD)
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

  // Listeners + init on size/image changes
  useEffect(() => {
    initialize();
  }, [size, image]);

  useEffect(() => {
    function handleKey(e) {
      if (solved) return;
      moveTile(e.key.toLowerCase());
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [grid, empty, solved]);

  // File upload
  function handleImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImage(url);           // initialize will rerun via dependency
    }
  }

  return (
    <div className="asg57">
      <BackToHome />
      <h1 className="asg57-title">Assignment-57</h1>

      <div className="asg57-controls">
        <label>
          Puzzle Size
          <select value={size} onChange={(e) => setSize(Number(e.target.value))}>
            <option value={3}>3 × 3</option>
            <option value={4}>4 × 4</option>
            <option value={5}>5 × 5</option>
            <option value={6}>6 × 6</option>
          </select>
        </label>

        <label className="asg57-upload">
          <input type="file" accept="image/*" onChange={handleImageUpload} />
        </label>
      </div>

      <p className="asg57-hint">
        Use <b>Arrow Keys / WASD</b> or <b>Click</b> tiles to move
      </p>

      <div className="asg57-puzzle" data-solved={solved} style={{ width: boardSize, height: boardSize }}>
        {solved ? (
          image ? (
            <div
              style={{
                width: `${boardSize}px`,
                height: `${boardSize}px`,
                backgroundImage: `url(${image})`,
                backgroundSize: `${boardSize}px ${boardSize}px`,
                borderRadius: "10px",
              }}
            />
          ) : null
        ) : (
          grid.map((row, r) => (
            <div className="asg57-row" key={`row-${r}`}>
              {row.map((val, c) => {
                const colIndex = val === 0 ? 0 : (val - 1) % size;
                const rowIndex = val === 0 ? 0 : Math.floor((val - 1) / size);
                const bgPos =
                  val === 0
                    ? "none"
                    : `-${colIndex * tileSize}px -${rowIndex * tileSize}px`;

                const isEmpty = val === 0;

                return (
                  <div
                    key={`tile-${r}-${c}`}
                    className={`asg57-tile${isEmpty ? " empty" : ""}`}
                    style={{
                      width: tileSize,
                      height: tileSize,
                      backgroundImage: isEmpty || !image ? "none" : `url(${image})`,
                      backgroundSize: image ? `${boardSize}px ${boardSize}px` : "initial",
                      backgroundPosition: bgPos,
                      cursor: isEmpty ? "default" : "pointer",
                    }}
                    onClick={() => {
                      if (isEmpty) return;
                      const [er, ec] = empty;
                      const adjacent =
                        (r === er && Math.abs(c - ec) === 1) ||
                        (c === ec && Math.abs(r - er) === 1);
                      if (adjacent) {
                        const newGrid = grid.map(row => [...row]);
                        [newGrid[er][ec], newGrid[r][c]] = [
                          newGrid[r][c],
                          newGrid[er][ec],
                        ];
                        setGrid(newGrid);
                        setEmpty([r, c]);
                        checkSolved(newGrid);
                      }
                    }}
                  />
                );
              })}
            </div>
          ))
        )}
      </div>

      {image && (
        <div className="asg57-preview">
          <h3>Preview Image</h3>
          <img src={image} alt="Puzzle preview" />
        </div>
      )}

      {solved && (
        <button className="asg57-restart" onClick={initialize}>
          Restart
        </button>
      )}
    </div>
  );
}
