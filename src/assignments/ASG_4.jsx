import BackToHome from "../component/BackToHome";
import "../assignments/AGS_4.css";
import { useState, useRef } from "react";

export default function ASG_4() {
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
    console.log("Deleted Index :",indexToRemove)
  };

  return (
    <>
      <BackToHome />
      <h1 className="assignment-title">Assignment-4</h1>
      <hr />
      <br />
      <ul className="number-list">
        {numbers.map((num, index) => (
          <li className="number-item" key={index}>
            <span>{num}</span>
            <button
              className="delete-button"
              onClick={() => deleteNumber(index)}>
              Delete
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
