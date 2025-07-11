import BackToHome from "../component/BackToHome";
import "../assignments/AGS_6.css";
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
      console.log("Added Style Property : ", property);
      console.log("Added Style Value : ", value);
    }
  };

  const deleteStyle = (indexToDelete) => {
    const updated = style.filter((_, index) => index !== indexToDelete);
    setStyle(updated);
    console.log("Deleted Style :", indexToDelete);
  };

  const cssObj = style.reduce((Object, item) => {
    return { ...Object, [item.name]: item.value };
  }, {});

  return (
    <>
      <BackToHome />
      <h1 className="assignment-title">Assignment-6</h1>
      <hr />
      <br />
      <label className="asg6-label">CSS Property : </label>
      <input
        className="asg6-input"
        placeholder="enter the css property (e.g. color)"
        value={property}
        onChange={(e) => setProperty(e.target.value)}
      ></input>
      <br />
      <label className="asg6-label">CSS Value :</label>
      <input
        className="asg6-input"
        placeholder="enter the css value (e.g. red)"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      ></input>
      <br />
      <br />
      <button className="asg6-btn-add" onClick={addStyle}>
        Add
      </button>
      <br />
      <br />

      {/* List rules */}
      <div>
        <h2>CSS Rules :</h2>
        <ul className="asg6-list">
          {style.map((item, index) => (
            <li className="asg6-list-item" key={index}>
              <span>
                {item.name} : {item.value}
              </span>
              <button
                className="asg6-btn-delete"
                onClick={() => deleteStyle(index)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>

        {/*Apply style*/}
        <h3>Style Preview :</h3>
        <div
          className="asg6-preview"
          style={{ ...cssObj, padding: "10px", border: "1px solid #ccc" }}
        >
          Sample Text
        </div>
      </div>
    </>
  );
}
