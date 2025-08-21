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

      
    </div>
  );
}
