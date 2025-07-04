
import React, { useState } from "react";
import { createWorker } from "tesseract.js";
import BackToHome from "../component/BackToHome";
import "./ASG_23.css";

export default function ASG_23() {
  const [image, setImage] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleClear = () => {
    setImage(null);
    setText("");
    setProgress(0);
    setLoading(false);
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageURL = URL.createObjectURL(file);
    setImage(imageURL);
    setLoading(true);
    setProgress(0);
    setText("");

    
    const logger = (m) => {
      if (m.status && m.progress != null) {
        setProgress(Math.round(m.progress * 100));
      }
    };

    try {
      const worker = await createWorker("eng", 1, {
        logger, 
      });

      const {
        data: { text: resultText },
      } = await worker.recognize(file);
      setText(resultText);
      await worker.terminate();
    } catch (err) {
      console.error(err);
      setText("OCR failed: " + err.message);
    }

    setLoading(false);
  };

  return (
    <>
      <BackToHome />
      <h1 className="assignment-title">Assignment-23</h1>
      <hr />
      <br />
      <div className="ocr-container">
        <h2 className="ocr-title">OCR Reader</h2>
        <div className="ocr-controls">
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="ocr-upload"
            disabled={loading}
          />
          {image && (
            <button className="ocr-clear-btn" onClick={handleClear} disabled={loading}>
              Clear
            </button>
          )}
        </div>
        {image && (
          <img
            src={image}
            alt="Uploaded"
            className="ocr-image-preview"
          />
        )}

        {loading && (
          <div className="ocr-progress-section">
            <p className="ocr-progress-text">Reading text from image... {progress}%</p>
            <div className="ocr-progress-bar-bg">
              <div
                className="ocr-progress-bar"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        <div className="ocr-result-section">
          <h3 className="ocr-result-title">Extracted Text</h3>
          <textarea
            rows="10"
            cols="50"
            value={text}
            readOnly
            className="ocr-result-textarea"
          />
        </div>
      </div>
    </>
  );
}
