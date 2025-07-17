import BackToHome from "../component/BackToHome";
import "../assignments/ASG_32.css";
import { useState } from "react";

export default function ASG_32() {
  const [item, setItem] = useState([
    { text: "Item #1", color: "#FF6F61" },
    { text: "Item #2", color: "#6B5B95" },
    { text: "Item #3", color: "#88B04B" },
    { text: "Item #4", color: "#F7CAC9" },
    { text: "Item #5", color: "#92A8D1" },
  ]);
  const [dropPosition, setDropPosition] = useState({
    index: null,
    position: null,
  });

  const handleDragStart = (event, index) => {
    console.log("Draggin : ", index);
    event.dataTransfer.setData("text/plain", index);
  };

  const handleDragOver = (event) => {
    event.preventDefault();

    const boundingReact = event.currentTarget.getBoundingReact();
    const mouseY = event.clientY;

    const elementTop = boundingReact.top;
    const elementHeight = boundingReact.height;

    const midlePoint = elementHeight + elementTop / 2;

    if (mouseY < midlePoint) {
      setDropPosition({ index: index, position: "top" });
    } else {
      setDropPosition({ index: index, position: "bottom" });
    }
  };

  const handleDrop = (event, targetIndex) => {
    event.preventDefault();

    const draggedIndex = event.dataTransfer.getData("text/plain");

    console.log("Dragged Item Index : ", draggedIndex);
    console.log("Dropped on Item Index : ", targetIndex);

    const updatedItems = [...item];

    const draggedItem = updatedItems.splice(draggedIndex, 1)[0];

    updatedItems.splice(targetIndex, 0, draggedItem);

    setItem(updatedItems);
  };

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
              <div
                className="asg32-items"
                draggable="true"
                key={index}
                style={{ backgroundColor: item.color }}
                onDragStart={(event) => handleDragStart(event, index)}
                onDragOver={handleDragOver}
                onDrop={(event) => handleDrop(event, index)}
              >
                {item.text}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
