import BackToHome from "../component/BackToHome";
import "../assignments/ASG_57.css";
import { useState, useEffect } from "react";

export default function ASG_57() {
  const [size, setSize] = useState(3);
  const [boardSize, setBoardSize] = useState(400);
  const [tileSize, setTileSize] = useState(boardSize / size);
  const [grid, setGrid] = useState([]);
  const [empty, setEmpty] = useState([size - 1, size - 1]);
  const [solved, setSolved] = useState(false);
  const [image, setImage] = useState("./asg57/sliding-puzzle.jpg");

  useEffect(() => {
    setTileSize(boardSize / size);
  }, [size]);

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

  function initialize() {
    const initial = createGrid();
    setGrid(initial);
    setEmpty([size - 1, size - 1]);
    setSolved(false);

    setTimeout(() => {
      shuffle(initial, [size - 1, size - 1]);
    }, 100);
  }

  function shuffle(startGrid, startEmpty) {
    let moves = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
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

  useEffect(() => {
    initialize();
  }, [size]);

  useEffect(() => {
    function handleKey(e) {
      if (solved) return;
      moveTile(e.key.toLowerCase());
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [grid, empty, solved]);

  function handleImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImage(url);
      initialize();
    }
  }

  return (
    <div className="asg57">
      <BackToHome />
      <h1 className="asg57-title">Assignment-57</h1>
      <hr />

      <div className="asg57-controls">
        <label>
          Puzzle Size:
          <select
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
          >
            <option value={3}>3 x 3</option>
            <option value={4}>4 x 4</option>
            <option value={5}>5 x 5</option>
          </select>
        </label>

        <label className="asg57-upload">
          Upload Image:
          <input type="file" accept="image/*" onChange={handleImageUpload} />
        </label>
      </div>

      <p className="asg57-hint">
        Use <b>Arrow Keys / WASD</b> or <b>Click</b> tiles to move
      </p>

      <div className="asg57-puzzle" data-solved={solved}>
        {solved ? (
          <div
            style={{
              width: `${boardSize}px`,
              height: `${boardSize}px`,
              backgroundImage: `url(${image})`,
              backgroundSize: `${boardSize}px`,
              borderRadius: "8px",
            }}
          />
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

                return (
                  <div
                    key={`tile-${r}-${c}`}
                    className="asg57-tile"
                    style={{
                      width: `${tileSize}px`,
                      height: `${tileSize}px`,
                      backgroundImage: val === 0 ? "none" : `url(${image})`,
                      backgroundSize: `${boardSize}px`,
                      backgroundPosition: bgPos,
                      cursor: val === 0 ? "default" : "pointer",
                    }}
                    onClick={() => {
                      if (val !== 0) {
                        const [er, ec] = empty;
                        if (
                          (r === er && Math.abs(c - ec) === 1) ||
                          (c === ec && Math.abs(r - er) === 1)
                        ) {
                          const newGrid = grid.map(row => [...row]);
                          [newGrid[er][ec], newGrid[r][c]] = [
                            newGrid[r][c],
                            newGrid[er][ec],
                          ];
                          setGrid(newGrid);
                          setEmpty([r, c]);
                          checkSolved(newGrid);
                        }
                      }
                    }}
                  />
                );
              })}
            </div>
          ))
        )}
      </div>

      <div className="asg57-preview">
        <h3>Preview Image</h3>
        <img src={image} alt="Puzzle preview" />
      </div>

      {solved && (
        <button
          className="asg57-restart"
          onClick={initialize}
        >
          Restart
        </button>
      )}
    </div>
  );
}
