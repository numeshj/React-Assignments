import BackToHome from "../component/BackToHome";
import "../assignments/ASG_29.css";
import { useState, useEffect } from "react";
import * as faceapi from "face-api.js";

export default function ASG_29() {
  const [image, setImage] = useState(null);
  const [faceImages, setFaceImages] = useState([]);
  const [webCamVideo, setWebCamVideo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stream, setStream] = useState(null);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const imageURL = URL.createObjectURL(file);
    setImage(imageURL);
    getFaces(file);
    setLoading(false);
  };

  const getFaces = async (file) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = async () => {
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d");

  ctx.drawImage(img, 0, 0);

  const detections = await faceapi.detectAllFaces(canvas);

  console.log("Detection : ", detections);

  detections.forEach((detection) => {
    const { x, y, width, height } = detection.box;

    ctx.strokeStyle = 'red';
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, width, height);
  });

  const boxedImageURL = canvas.toDataURL();
  setImage(boxedImageURL);

  const faces = [];
  detections.forEach((detection) => {
    const { x, y, width, height } = detection.box;

    const faceCanvas = document.createElement("canvas");
    faceCanvas.width = width;
    faceCanvas.height = height;

    const faceCtx = faceCanvas.getContext("2d");
    faceCtx.drawImage(canvas, x, y, width, height, 0, 0, width, height);

    const faceImageURL = faceCanvas.toDataURL();
    faces.push(faceImageURL);
  });

  setFaceImages(faces);
};

  };
  const startVideo = async () => {
    try {
      setLoading(true);
      const videoStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      setStream(videoStream);
      setWebCamVideo(true);
      setLoading(false);
    } catch (err) {
      console.error("Error accessing webcam:", err);
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFaceImages([]);
    setImage(null);
    setWebCamVideo(false);
    setStream(null);
    setLoading(false);
  };

  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
        await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
        console.log("Models loaded successfully");
      } catch (error) {
        console.error("Error loading models:", error);
      }
    };
    loadModels();
  }, []);

  useEffect(() => {
    if (stream && webCamVideo) {
      const video = document.getElementById("video");
      if (video) {
        video.srcObject = stream;
      }
    }
  }, [stream, webCamVideo]);

  return (
    <>
      <BackToHome />
      <h1 className="assignment-title">Assignment-29</h1>
      <hr />
      <br />
      <div className="asg29-container">
        <div className="asg29-upload">
          <input
            type="file"
            accept="image/*"
            className="asg29-button"
            onChange={handleUpload}
            disabled={loading}
          />
          <button
            className="asg29-button"
            onClick={startVideo}
            disabled={loading}
          >
            {loading ? "Loading..." : "Use Webcam"}
          </button>
        </div>
        {image && (
          <div className="asg29-canvas">
            <img src={image} alt="Uploaded" className="canvas-image" />
          </div>
        )}
        {webCamVideo && (
          <div className="asg29-canvas">
            <video
              id="video"
              autoPlay
              className="canvas-image"
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        )}
        {faceImages.length > 0 && (
          <div className="asg29-canvas-2">
            {faceImages.map((face, index) => (
              <img
                key={index}
                className="canvas-image-2"
                src={face}
                alt={`Detected Face ${index + 1}`}
              />
            ))}
          </div>
        )}

        {(image || webCamVideo) && (
          <div className="asg29-reset-button">
            <button className="asg29-reset" onClick={handleReset}>
              Reset
            </button>
          </div>
        )}
      </div>
    </>
  );
}
