import BackToHome from "../component/BackToHome";
import "../assignments/AGS_3.css";
import { useState } from "react";

export default function ASG_6() {
  const [style, setStyle] = useState([]);
  const [property, setProperty] = useState("");
  const [value, setValue] = useState("");

  const addStyle = () => {
    if (property.trim() !== "" && value.trim() !== "") {
      const newRule = { name: property.trim(), value: value.trim() };
      setStyle([...style, newRule]);
      setProperty("");
      setValue("");
    }
  };

  const deleteStyle = (indexToDelete) => {
    const updated = style.filter((_, index) => index !== indexToDelete)
    setStyle(updated)
  }

  const cssObj = style.reduce((Object, item) => {
    return {...Object, [item.name] : item.value}
  }, {})

  return (
    <>
      <BackToHome />
      <h1 className="assignment-title">Assignment-6</h1>
      <hr />
      <br />
      <label>CSS Property : </label>
      <input placeholder="enter the css property"></input>
      <br />
      <label>CSS Value :</label>
      <input></input>
      <br />
      <br />
      <button onClick={addStyle}>Add</button>
      <br />
      <br />
      <div>Sample Text</div>
    </>
  );
}
