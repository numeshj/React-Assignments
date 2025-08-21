import { useState, useEffect } from "react";
import BackToHome from "../component/BackToHome";
import "../assignments/ASG_56.css";

export default function ASG_56() {

  const size = 3;
  const boardSize = 400;
  const tileSize = boardSize / size;

  const [grid, setGrid] = useState([]);
  const [solved, setSolved] = useState(false)

  useEffect(() => {
    const initial = [];
    let n = 1;
    for (let r = 0; r < size; r++) {
      const row = [];
      for (let c = 0; c < size; c++) {
        row.push(n < size * size ? n : 0);
        n++;
      }
      initial.push(row)
    }
    setGrid(initial)
  }, []);



  return (
    <div className="asg56">
      <BackToHome />
      <h1 className="assignment-title">Assignment-56</h1>
      <hr />
      <br />

      <div className="container-asg56">
        {/* NOTE: fixed the typo: use hint-asg56 (not hint-asg55) */}
        <div className="hint-asg56">Use Arrow Keys or W, A, S, D to move puzzle tiles</div>

        <div className="puzzle-asg56" data-solved={solved}>
          {grid.map((row, r) => (
            <div className="row-asg56" key={`row${r}`}>
              {row.map((val, c) => {
                // tile numbers (1..8) which slice of the image to display
                const colIndex = val === 0 ? 0 : (val - 1) % size;
                const rowIndex = val === 0 ? 0 : Math.floor((val - 1) / size);

                // negative offsets shift the background so only the correct slice is available
                const bgPos =
                  val === 0
                    ? "none" : `-${colIndex * tileSize}px -${rowIndex * tileSize}px`;

                return (
                  <div
                    key={`tile-${r}-${c}`}
                    className="tile-asg56"
                    style={{
                      backgroundImage: val === 0 ? "none" : "url(./asg56/sliding-puzzle.jpg)",
                      backgroundSize: `${boardSize}px`,
                      backgroundPosition: bgPos,
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
