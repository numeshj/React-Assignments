import BackToHome from "../component/BackToHome";
import "../assignments/ASG_37.css";
import { useState, useEffect, useRef } from "react";

export default function ASG_37() {
  
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
    <div className="asg37">
      <BackToHome />
      <h1 className="assignment-title">Assignment-37</h1>
      <hr />
      <br />
      

    </div>
  );
}
