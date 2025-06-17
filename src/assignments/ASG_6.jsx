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
      <label className="label">CSS Property : </label>
      <input
        placeholder="enter the css property (e.g. color)"
        value={property}
        onChange={(e) => setProperty(e.target.value)}
      ></input>
      <br />
      <label className="label">CSS Value :</label>
      <input
        placeholder="enter the css value (e.g. red)"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      ></input>
      <br />
      <br />
      <button className="btn-add" onClick={addStyle}>
        Add
      </button>
      <br />
      <br />

      {/* List rules */}
      <div>
        <h2>CSS Rules :</h2>
        <ul>
          {style.map((item, index) => (
            <li key={index}>
              <span>
                {item.name} : {item.value}
              </span>
              <button className="btn-delete" onClick={() => deleteStyle(index)}>
                Delete
              </button>
            </li>
          ))}
        </ul>

        {/*Apply style*/}
        <h3>Style Preview :</h3>
        <div style={{ ...cssObj, padding: "10px", border: "1px solid #ccc" }}>
          Sample Text
        </div>
      </div>
    </>
  );
}
