import BackToHome from "../component/BackToHome";
import "../assignments/ASG_45.css";
import { useState, useRef, useEffect } from "react";

export default function ASG_45() {
  const [image, setImage] = useState("./image-crop-tool.jpg");
  const [imgSize, setImgSize] = useState({ width: 0, height: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [cropRect, setCropRect] = useState(null);
  const [startPoint, setStartPoint] = useState(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      setImgSize({ width: img.width, height: img.height });
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };

    img.src = image;
  }, [image]);

  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);
    setIsDragging(true);
    setStartPoint({ x, y });
    setCropRect({ x, y, w: 0, h: 0 });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !startPoint) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);
    const cropX = Math.min(startPoint.x, x);
    const cropY = Math.min(startPoint.y, y);
    const cropW = Math.abs(x - startPoint.x);
    const cropH = Math.abs(y - startPoint.y);
    setCropRect({ x: cropX, y: cropY, w: cropW, h: cropH });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setStartPoint(null);
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImage(ev.target.result); // base64
      setCropRect(null);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleDownload = () => {
    if (!cropRect || !canvasRef.current) return;

    const { x, y, w, h } = cropRect;
    const canvas = canvasRef.current;
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = w;
    tempCanvas.height = h;

    const tempCtx = tempCanvas.getContext("2d");
    tempCtx.drawImage(canvas, x, y, w, h, 0, 0, w, h);

    const croppedImage = tempCanvas.toDataURL("image/png");

    const a = document.createElement("a");
    a.href = croppedImage;
    a.download = "cropped.png";
    a.click();
  };

  const overlays = [];
  if (cropRect && cropRect.w > 0 && cropRect.h > 0) {
    overlays.push(
      <div key="top" className="darken" style={{
        top: 0, left: 0,
        width: imgSize.width,
        height: cropRect.y,
                backgroundImage: "url(./image-crop-tool.svg)"
      }} />
    );
    overlays.push(
      <div key="bottom" className="darken" style={{
        top: cropRect.y + cropRect.h,
        left: 0,
        width: imgSize.width,
        height: imgSize.height - cropRect.y - cropRect.h,
                backgroundImage: "url(./image-crop-tool.svg)"
      }} />
    );
    overlays.push(
      <div key="left" className="darken" style={{
        top: cropRect.y,
        left: 0,
        width: cropRect.x,
        height: cropRect.h,
        backgroundImage: "url(./image-crop-tool.svg)"
      }} />
    );
    overlays.push(
      <div key="right" className="darken" style={{
        top: cropRect.y,
        left: cropRect.x + cropRect.w,
        width: imgSize.width - cropRect.x - cropRect.w,
        height: cropRect.h,
                backgroundImage: "url(./image-crop-tool.svg)"
      }} />
    );
  }

  return (
    <div className="asg45">
      <BackToHome />
      <div className="container-work" style={{
        width: imgSize.width + 60,
        height: imgSize.height + 160
      }}>
        <div className="description">Drag and draw on the image to set a cropping area</div>
        <div className="workspace" style={{
          width: imgSize.width,
          height: imgSize.height,
          position: "relative"
        }}>
          <canvas
            className="canvas"
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{
              width: imgSize.width,
              height: imgSize.height,
              position: "absolute",
              left: 0,
              top: 0,
            }}
          />
          {cropRect && cropRect.w > 0 && cropRect.h > 0 && (
            <>
              {overlays}
              <div
                className="crop"
                style={{
                  left: cropRect.x,
                  top: cropRect.y,
                  width: cropRect.w,
                  height: cropRect.h,
                }}
              />
            </>
          )}
        </div>
        <div className="options">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleUpload}
          />
          <button onClick={handleUploadButtonClick}>Upload an Image</button>
          <button onClick={handleDownload}>Crop and Download</button>
        </div>
      </div>
    </div>
  );
}
