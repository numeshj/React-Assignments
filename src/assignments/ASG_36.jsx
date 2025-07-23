import BackToHome from "../component/BackToHome";
import "../assignments/ASG_36.css";
import { useState, useEffect, useRef } from "react";

export default function ASG_36() {

const [frame, setFrame] = useState({})
const [rangeValue, setRangeValue] = useState(80)
const [selectedArea, setSelectedArea] = useState(null)
const [capturedImage, setCapturedImage] = useState(null)
const [placedFrames, setPlacedFrames] = useState([])
const [isDragging, setIsDragging] = useState(false)
const imageRef = useRef(null)
const pictureBoxRef = useRef(null)

const onMouseMove = (event) => {
    const rect = pictureBoxRef.current.getBoundingClientRect();
    const newFrame = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      id: crypto.randomUUID(),
    };

    setFrame(newFrame);
  };

  const captureImageSection = (x, y, size) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = imageRef.current;
    const pictureBox = pictureBoxRef.current;
    
    if (!img || !pictureBox) return null;
    
    canvas.width = size;
    canvas.height = size;
    
    // Get the actual image position within the picture-box
    const imgRect = img.getBoundingClientRect();
    const boxRect = pictureBox.getBoundingClientRect();
    
    // Calculate relative position within the image
    const relativeX = x - (imgRect.left - boxRect.left);
    const relativeY = y - (imgRect.top - boxRect.top);
    
    // Calculate scale factors
    const scaleX = img.naturalWidth / imgRect.width;
    const scaleY = img.naturalHeight / imgRect.height;
    
    // Calculate source coordinates on the original image
    const sourceX = (relativeX - size/2) * scaleX;
    const sourceY = (relativeY - size/2) * scaleY;
    const sourceWidth = size * scaleX;
    const sourceHeight = size * scaleY;
    
    ctx.drawImage(
      img,
      sourceX, sourceY, sourceWidth, sourceHeight,
      0, 0, size, size
    );
    
    return canvas.toDataURL();
  };

  const onMouseDown = (e) => {
    if (frame.x && frame.y) {
      if (selectedArea && capturedImage) {
        const newPlacedFrame = {
          x: frame.x,
          y: frame.y,
          size: rangeValue,
          image: capturedImage,
          id: crypto.randomUUID()
        };
        setPlacedFrames(prev => [...prev, newPlacedFrame]);
      } else {
        // First selection - capture the area
        const captured = captureImageSection(frame.x, frame.y, rangeValue);
        setSelectedArea({
          x: frame.x,
          y: frame.y,
          size: rangeValue,
          originalImage: captured
        });
        setCapturedImage(captured);
        setIsDragging(true);
      }
    }
  }

  const resetOrigin = () => {
    setSelectedArea(null);
    setCapturedImage(null);
    setIsDragging(false);
    setFrame({});
  };

  return (
    <div className="asg36">
      <BackToHome />
      <h1 className="assignment-title">Assignment-36</h1>
      <hr />
      <br />
      <div>
        <input 
          className="range-selection" 
          type="range" 
          max="120" 
          min="40" 
          value={rangeValue}
          disabled={isDragging}
          onChange={(e) => setRangeValue(e.target.value)}
        />
        <button className="range-button" onClick={resetOrigin}>Reset Origin</button>
      </div>
      <div 
        ref={pictureBoxRef}
        className="picture-box" 
        onMouseMove={onMouseMove} 
        onMouseDown={onMouseDown}
      >
        <img ref={imageRef} src="./asg36.png" alt="asg36" />
        
        {/* Current hover frame */}
        {frame.x && !isDragging && (
          <div 
            className="picture-frame hover-frame"
            style={{
              left: frame.x + "px",
              top: frame.y + "px",
              width: rangeValue + "px",
              height: rangeValue + "px",
            }}
          />
        )}
        
        {/* Original selected area with red border - always visible once selected */}
        {selectedArea && (
          <div 
            className="picture-frame selected-area"
            style={{
              left: selectedArea.x + "px",
              top: selectedArea.y + "px",
              width: selectedArea.size + "px",
              height: selectedArea.size + "px",
              backgroundImage: `url(${selectedArea.originalImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        )}
        
        {/* All placed frames - remain until reset */}
        {placedFrames.map((placedFrame) => (
          <div 
            key={placedFrame.id}
            className="picture-frame placed-frame"
            style={{
              left: placedFrame.x + "px",
              top: placedFrame.y + "px",
              width: placedFrame.size + "px",
              height: placedFrame.size + "px",
              backgroundImage: `url(${placedFrame.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        ))}
        
        {/* Moving captured frame */}
        {capturedImage && frame.x && (
          <div 
            className="picture-frame captured-frame"
            style={{
              left: frame.x + "px",
              top: frame.y + "px",
              width: rangeValue + "px",
              height: rangeValue + "px",
              backgroundImage: `url(${capturedImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        )}
      </div>
    </div>
  );
}
