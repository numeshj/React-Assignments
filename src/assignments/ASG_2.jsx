import BackToHome from "../component/BackToHome";
import "../assignments/Pages.css";
import { useState } from "react";

export default function ASG_2() {
  const [num1, setNum1] = useState("");
  const [num2, setNum2] = useState("");
  const [selectedOption, setSelectOption] = useState("");
  const [result, setResult] = useState("");

  const handleChange = (event) => {
    setSelectOption(event.target.value);
  };

  const handleCalculate = () => {
    const number1 = parseFloat(num1);
    const number2 = parseFloat(num2);

    if (isNaN(number1) || isNaN(number2) || !selectedOption) {
      setResult("Invalid input");
      return;
    }

    let res;
    switch (selectedOption) {
      case "+":
        res = number1 + number2;
        break;
      case "-":
        res = number1 - number2;
        break;
      case "*":
        res = number1 * number2;
        break;
      case "/":
        res = number2 !== 0 ? number1 / number2 : "Cannot divide by zero";
        break;
      default:
        res = "Invalid operation";
    }

    setResult(res);
  };

  return (
    <>
      <BackToHome />
      <h1 className="assignment-title">Assignment-2</h1>
      <hr />
      <br />

      <input
        type="number"
        value={num1}
        onChange={(e) => setNum1(e.target.value)}
        placeholder="Enter first number"
      />

      <select value={selectedOption} onChange={handleChange}>
        <option value="">--Please choose--</option>
        <option value="+">Addition</option>
        <option value="-">Subtraction</option>
        <option value="*">Multiplication</option>
        <option value="/">Division</option>
      </select>

      <input
        type="number"
        value={num2}
        onChange={(e) => setNum2(e.target.value)}
        placeholder="Enter second number"
      />

      {num1 && num2 && selectedOption && (
        <>
          <button onClick={handleCalculate}>Calculate</button>
          <label>Result: {result}</label>
        </>
      )}
    </>
  );
}
