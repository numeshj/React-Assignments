import BackToHome from "../component/BackToHome";
import "../assignments/ASG_32.css";
import { useState } from "react";

export default function ASG_32() {
  const [item, setItem] = useState([
    "Item #1",
    "Item #2",
    "Item #3",
    "Item #4",
    "Item #5",
  ]);

  return (
    <>
      <BackToHome />
      <h1 className="assignment-title">Assignment-32</h1>
      <hr />
      <br />
      <div className="asg32-container">
        <h3 className="asg31-title">Drag and Drop Element to Reorder Them </h3>
        <div className="asg32-items-list" draggable="true">
          {item.map((item, index) => {
            return (
              <div className="asg32-items" draggable="true" key={index}>
                {item}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
