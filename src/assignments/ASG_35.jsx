import BackToHome from "../component/BackToHome";
import "../assignments/ASG_35.css";
import { useState, useEffect } from "react";

export default function ASG_35() {
  const [image, setImage] = useState(null);

  const handleUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImage(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handlePaste = (event) => {
    const items = event.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const blob = items[i].getAsFile();
        const reader = new FileReader();
        reader.onload = (e) => {
          setImage(e.target.result);
        };
        reader.readAsDataURL(blob);
        break;
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === "v") {
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("paste", handlePaste);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("paste", handlePaste);
    };
  }, []);

  return (
    <>
      <BackToHome />
      <h1 className="assignment-title">Assignment-35</h1>
      <hr />
      <br />
      <div className="asg35-container">
        {!image ? (
          <div
            className="asg35-drop-area"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={handleUpload}
          >
            <h2 className="asg35-heading">
              Drag and Drop or Paste Image here...
            </h2>
            <div>
              <button className="asg35-button" onClick={handleUpload}>
                Upload an Image
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="asg35-image-preview">
              <img
                src={image}
                alt="Uploaded"
                className="asg35-uploaded-image"
              />
            </div>
            <div>
              <button className="asg35-button" onClick={handleUpload}>
                Upload Another Image
              </button>
              <button
                className="asg35-button asg35-button-spacing"
                onClick={() => setImage(null)}
              >
                Clear Image
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
