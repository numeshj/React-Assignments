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

  const [dragOverInfo, setDragOverInfo] = useState({
    index: null,
    position: null,
  });

  const handleDragStart = (event, index) => {
    console.log("Dragging : ", index);
    event.dataTransfer.setData("text/plain", index);
  };

  const handleDragOver = (event, index) => {
    event.preventDefault();

    const rect = event.currentTarget.getBoundingClientRect();
    const mouseY = event.clientY;
    const itemHeight = rect.height;
    const itemTop = rect.top;
    const itemMiddle = itemTop + itemHeight / 2;

    if (mouseY < itemMiddle) {
      setDragOverInfo({ index, position: "top" });
    } else {
      setDragOverInfo({ index, position: "bottom" });
    }
  };

  const handleDragLeave = () => {
    setDragOverInfo({ index: null, position: null });
  };

  const handleDrop = (event, targetIndex) => {
    event.preventDefault();

    const draggedIndex = parseInt(event.dataTransfer.getData("text/plain"));

    if (draggedIndex === targetIndex) {
      setDragOverInfo({ index: null, position: null });
      return;
    }

    let insertIndex = targetIndex;

    if (dragOverInfo.position === "bottom") {
      insertIndex = targetIndex + 1;
    }

    if (draggedIndex < insertIndex) {
      insertIndex -= 1;
    }

    const updatedItems = [...item];
    const draggedItem = updatedItems.splice(draggedIndex, 1)[0];
    updatedItems.splice(insertIndex, 0, draggedItem);

    setItem(updatedItems);
    setDragOverInfo({ index: null, position: null });
  };

  return (
    <>
      <BackToHome />
      <h1 className="assignment-title">Assignment-32</h1>
      <hr />
      <br />
      <div className="asg32-container">
        <h3 className="asg32-title">Drag and Drop Element to Reorder Them</h3>
        <div className="asg32-items-list">
          {item.map((singleItem, index) => {
            return (
              <div key={index} className="asg32-item-wrapper">
                {/* Top drop indicator */}
                <div
                  className={`drop-indicator ${
                    dragOverInfo.index === index &&
                    dragOverInfo.position === "top"
                      ? "active"
                      : ""
                  }`}
                />

                <div
                  className="asg32-items"
                  draggable="true"
                  style={{ backgroundColor: singleItem.color }}
                  onDragStart={(event) => handleDragStart(event, index)}
                  onDragOver={(event) => handleDragOver(event, index)}
                  onDragLeave={handleDragLeave}
                  onDrop={(event) => handleDrop(event, index)}
                >
                  {singleItem.text}
                </div>

                {/* Bottom drop indicator */}
                <div
                  className={`drop-indicator ${
                    dragOverInfo.index === index &&
                    dragOverInfo.position === "bottom"
                      ? "active"
                      : ""
                  }`}
                />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
