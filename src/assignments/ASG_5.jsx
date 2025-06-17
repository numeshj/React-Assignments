import BackToHome from "../component/BackToHome";
import "../assignments/AGS_4.css";
import { useState, useRef } from "react";

export default function ASG_5() {
  const [numbers, setNumbers] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);

  const addNumbers = () => {
    const newNumber = parseFloat(inputValue);
    if (!isNaN(newNumber)) {
      const updateNnumbers = [...numbers, newNumber];
      setNumbers(updateNnumbers);
      console.log(updateNnumbers);
      setInputValue("");
      inputRef.current.focus();
    }
  };

  const deleteNumber = (indexToRemove) => {
    const updatedList = numbers.filter((_, index) => index !== indexToRemove);
    setNumbers(updatedList);
    console.log("updated List :", updatedList);
    console.log("Deleted Index :", indexToRemove);
  };

  const sortAscending = () => {
    const sortedList = [...numbers].sort((a, b) => a - b);
    setNumbers(sortedList);
  };

  const sortDescending = () => {
    const sortedList = [...numbers].sort((a, b) => b - a);
    setNumbers(sortedList);
  };

  const moveUp = (index) => {
    if (index === 0) return;
    const newList = [...numbers];
    [newList[index - 1], newList[index]] = [newList[index], newList[index - 1]];
    setNumbers(newList);
  };
  const moveDown = (index) => {
    if (index === numbers.length - 1) return;
    const newList = [...numbers];
    [newList[index + 1], newList[index]] = [newList[index], newList[index + 1]];
    setNumbers(newList);
  };

  return (
    <>
      <BackToHome />
      <h1 className="assignment-title">Assignment-5</h1>
      <hr />
      <br />
      <button
        className="btn-top"
        onClick={sortAscending}
        hidden={numbers.length === 0}
      >
        Sort Ascending
      </button>
      <button
        className="btn-top"
        onClick={sortDescending}
        hidden={numbers.length === 0}
      >
        Sort Descending
      </button>

      <ul className="number-list">
        {numbers.map((num, index) => (
          <li className="number-item" key={index}>
            <span>{num}</span>
            <button
              className="delete-button"
              onClick={() => deleteNumber(index)}
            >
              Delete
            </button>
            <button
              className="btn-move"
              onClick={() => moveUp(index)}
              disabled={index === 0}
            >
              Move Up ⬆️{" "}
            </button>
            <button
              className="btn-move"
              onClick={() => moveDown(index)}
              disabled={index === numbers.length - 1}
            >
              {" "}
              Move Down ⬇️{" "}
            </button>
          </li>
        ))}
      </ul>
      <br />
      <br />
      <input
        id="numInput"
        type="number"
        ref={inputRef}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      ></input>
      <button
        className="add-button"
        onClick={addNumbers}
        disabled={inputValue.trim() === ""}
      >
        Add
      </button>
      <label></label>
      <br />
      <br />
    </>
  );
}
