import BackToHome from "../component/BackToHome";
import "../assignments/ASG_29.css";
import { useState, useEffect } from "react";

export default function ASG_29() {
  const [image, setImage] = useState(null);
  const [faceImage, setFaceImage] = useState(null)
  const [webCamVideo, setWebCamVideo] = useState(false)
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

  const getFaces = (file) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const faceImageURL = URL.createObjectURL(file);
    setFaceImage(faceImageURL);
  }
  const startVideo = async () => {
    try {
      setLoading(true);
      const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(videoStream);
      setWebCamVideo(true);
      setLoading(true);
    } catch (err) {
      console.error('Error accessing webcam:', err);
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFaceImage(null)
    setImage(null);
    setWebCamVideo(false);
    setStream(null);
    setLoading(false)
  }

  useEffect(() => {
    if (stream && webCamVideo) {
      const video = document.getElementById('video');
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
          <button className="asg29-button" onClick={startVideo} disabled={loading}>
            {loading ? 'Loading...' : 'Use Webcam'}
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
        {image && (
          <div className="asg29-canvas-2">
            <img className="canvas-image-2" src={faceImage} alt="" />
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
