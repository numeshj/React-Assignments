import BackToHome from "../component/BackToHome";
import "../assignments/ASG_48.css";
import { useState, useEffect, useRef } from "react";



export default function ASG_48() {

  const ROWS = 13;
  const COLS = 13;

  const grid = [];
  for (let y = 0; y < ROWS; y++) {
    const row = [];
    for (let x = 0; x < COLS; x++) {
      row.push(
        <div
          key={x}
          className="board-asg48-cell"
          data-x={x}
          data-y={y}
        />
      );
    }
    grid.push(
      <div className="board-asg48-row"
        key={y}>{row}</div>
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
