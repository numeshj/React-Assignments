import BackToHome from "../component/BackToHome";
import "../assignments/ASG_30.css";
import { useState, useEffect } from "react";
import * as faceapi from "face-api.js";

export default function ASG_30() {
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [videoActive, setVideoActive] = useState(false);
  const [stream, setStream] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    e.target.value = null;

    const fileURL = URL.createObjectURL(file);

    if (file.type.startsWith("image/")) {
      setVideo(null);
      setImage(fileURL);
      detectImageFaces(fileURL);
      setLoading(true);
    } else if (file.type.startsWith("video/")) {
      setImage(null);
      setVideo(fileURL);
      setLoading(true);
    } else {
      alert("Unsupported file type. Please upload an image or video");
    }
  };

  const detectImageFaces = async (imageURL) => {
    const img = new Image();
    img.src = imageURL;

    img.onload = async () => {
      const canvas = document.getElementById("face-canvas");
      const landmarkCanvas = document.getElementById("landmark-canvas");

      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      ctx.drawImage(img, 0, 0);

      const detections = await faceapi
        .detectAllFaces(canvas, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks();

      setTimeout(() => {
        const displayedWidth = canvas.offsetWidth;
        const displayedHeight = canvas.offsetHeight;

        landmarkCanvas.width = displayedWidth;
        landmarkCanvas.height = displayedHeight;

        const scaleX = displayedWidth / img.width;
        const scaleY = displayedHeight / img.height;

        const landmarkCtx = landmarkCanvas.getContext("2d");
        landmarkCtx.clearRect(
          0,
          0,
          landmarkCanvas.width,
          landmarkCanvas.height
        );

        detections.forEach((det) => {
          drawSunglasses(det.landmarks, landmarkCtx, scaleX, scaleY);
        });

        setLoading(false);
      }, 100);
    };
  };

  const startVideo = async () => {
    try {
      setLoading(true);
      const videoStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      setStream(videoStream);
      setVideoActive(true);
      setLoading(false);
    } catch (err) {
      console.error("Error accessing webcam:", err);
      setLoading(false);
    }
  };

  const detectVideoFaces = async () => {
    const video = document.getElementById("video");
    const landmarkCanvas = document.getElementById("video-landmark-canvas");

    if (video && video.readyState === 4 && landmarkCanvas) {
      try {
        const detections = await faceapi
          .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks();

        const videoRect = video.getBoundingClientRect();
        const scaleX = videoRect.width / video.videoWidth;
        const scaleY = videoRect.height / video.videoHeight;

        landmarkCanvas.width = videoRect.width;
        landmarkCanvas.height = videoRect.height;
        landmarkCanvas.style.width = videoRect.width + "px";
        landmarkCanvas.style.height = videoRect.height + "px";

        const landmarkCtx = landmarkCanvas.getContext("2d", {
          willReadFrequently: true,
        });
        landmarkCtx.clearRect(
          0,
          0,
          landmarkCanvas.width,
          landmarkCanvas.height
        );

        detections.forEach((det) => {
          drawSunglasses(det.landmarks, landmarkCtx, scaleX, scaleY);
        });
      } catch (error) {
        console.error("Error in video face detection:", error);
      }
    }

    if (videoActive) {
      requestAnimationFrame(detectVideoFaces);
    }
  };

  const detectVideoFileFaces = async () => {
    const videoElement = document.getElementById("uploaded-video");
    const landmarkCanvas = document.getElementById(
      "video-file-landmark-canvas"
    );

    if (videoElement && videoElement.readyState >= 2 && landmarkCanvas) {
      try {
        const detections = await faceapi
          .detectAllFaces(videoElement, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks();

        const videoRect = videoElement.getBoundingClientRect();
        const scaleX = videoRect.width / videoElement.videoWidth;
        const scaleY = videoRect.height / videoElement.videoHeight;

        landmarkCanvas.width = videoRect.width;
        landmarkCanvas.height = videoRect.height;
        landmarkCanvas.style.width = videoRect.width + "px";
        landmarkCanvas.style.height = videoRect.height + "px";

        const landmarkCtx = landmarkCanvas.getContext("2d", {
          willReadFrequently: true,
        });
        landmarkCtx.clearRect(
          0,
          0,
          landmarkCanvas.width,
          landmarkCanvas.height
        );

        detections.forEach((det) => {
          drawSunglasses(det.landmarks, landmarkCtx, scaleX, scaleY);
        });
      } catch (error) {
        console.error("Error in video file face detection:", error);
      }
    }

    if (video && !videoElement?.paused) {
      requestAnimationFrame(detectVideoFileFaces);
    }
  };

  function drawSunglasses(landmarks, ctx, scaleX = 1, scaleY = 1) {
    if (!landmarks) return;

    const leftEye = landmarks.getLeftEye();
    const rightEye = landmarks.getRightEye();
    const jawOutline = landmarks.getJawOutline();

    if (leftEye.length === 0 || rightEye.length === 0) return;

    const leftEyeCenter = getCenter(leftEye, scaleX, scaleY);
    const rightEyeCenter = getCenter(rightEye, scaleX, scaleY);

    const centerX = (leftEyeCenter.x + rightEyeCenter.x) / 2;
    const centerY = (leftEyeCenter.y + rightEyeCenter.y) / 2;

    const dx = rightEyeCenter.x - leftEyeCenter.x;
    const dy = rightEyeCenter.y - leftEyeCenter.y;
    const eyeDistance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);

    const lensWidth = eyeDistance * 0.45;
    const lensHeight = eyeDistance * 0.35;
    const bridgeWidth = eyeDistance * 0.12;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(angle);

    // Draw left lens
    drawLens(ctx, -eyeDistance / 2, 0, lensWidth, lensHeight);

    // Draw right lens
    drawLens(ctx, eyeDistance / 2, 0, lensWidth, lensHeight);

    // Draw bridge
    ctx.fillStyle = "#2a2a2a";
    ctx.fillRect(
      -bridgeWidth / 2,
      -lensHeight * 0.15,
      bridgeWidth,
      lensHeight * 0.3
    );

    ctx.restore();

    // Draw realistic temples (arms)
    drawRealisticTemples(
      ctx,
      leftEyeCenter,
      rightEyeCenter,
      jawOutline,
      scaleX,
      scaleY,
      eyeDistance,
      angle
    );
  }

  function drawRealisticTemples(
    ctx,
    leftEyeCenter,
    rightEyeCenter,
    jawOutline,
    scaleX,
    scaleY,
    eyeDistance,
    angle
  ) {
    // Get better ear positions from jaw outline
    const jawLength = jawOutline.length;
    const leftEarApprox = jawOutline[Math.floor(jawLength * 0.05)]; // 5% from left (closer to actual ear)
    const rightEarApprox = jawOutline[Math.floor(jawLength * 0.95)]; // 95% from left (closer to actual ear)

    const leftEarX = leftEarApprox.x * scaleX;
    const leftEarY = leftEarApprox.y * scaleY;
    const rightEarX = rightEarApprox.x * scaleX;
    const rightEarY = rightEarApprox.y * scaleY;

    // Calculate temple start points (from outer edges of lenses)
    const templeOffset = eyeDistance * 0.25;
    const leftTempleStartX = leftEyeCenter.x - Math.cos(angle) * templeOffset;
    const leftTempleStartY = leftEyeCenter.y - Math.sin(angle) * templeOffset;
    const rightTempleStartX = rightEyeCenter.x + Math.cos(angle) * templeOffset;
    const rightTempleStartY = rightEyeCenter.y + Math.sin(angle) * templeOffset;

    ctx.strokeStyle = "#1a1a1a";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";

    // Left temple - straight line to ear
    ctx.beginPath();
    ctx.moveTo(leftTempleStartX, leftTempleStartY);
    ctx.lineTo(leftEarX, leftEarY);
    ctx.stroke();

    // Right temple - straight line to ear
    ctx.beginPath();
    ctx.moveTo(rightTempleStartX, rightTempleStartY);
    ctx.lineTo(rightEarX, rightEarY);
    ctx.stroke();
  }

  function drawLens(ctx, x, y, width, height) {
    ctx.beginPath();

    // Dark tinted lens
    ctx.fillStyle = "rgba(15, 15, 15, 0.95)";
    const radius = Math.min(width, height) / 6;
    ctx.roundRect(x - width / 2, y - height / 2, width, height, radius);
    ctx.fill();

    // Lens frame
    ctx.strokeStyle = "#2a2a2a";
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Add subtle reflection
    ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
    ctx.fillRect(
      x - width / 2 + width * 0.1,
      y - height / 2 + height * 0.1,
      width * 0.3,
      height * 0.2
    );
  }

  function getCenter(points, scaleX, scaleY) {
    const xs = points.map((pt) => pt.x * scaleX);
    const ys = points.map((pt) => pt.y * scaleY);

    const avgX = xs.reduce((a, b) => a + b, 0) / xs.length;
    const avgY = ys.reduce((a, b) => a + b, 0) / ys.length;

    return { x: avgX, y: avgY };
  }
  const handleVideoLoad = () => {
    setLoading(false);
    detectVideoFileFaces();
  };

  const handleReset = () => {
    setImage(null);
    setVideo(null);
    setVideoActive(false);
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setStream(null);
    setLoading(false);
  };

  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
        await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
        console.log(
          "TinyFaceDetector and FaceLandmark models loaded successfully"
        );
      } catch (error) {
        console.error("Error loading models:", error);
      }
    };
    loadModels();
  }, []);

  useEffect(() => {
    if (videoActive && stream) {
      const video = document.getElementById("video");
      video.srcObject = stream;
      video.onloadedmetadata = () => {
        detectVideoFaces();
      };
    }
  }, [videoActive, stream]);

  return (
    <>
      <BackToHome />
      <h1 className="assignment-title">Assignment-30</h1>
      <hr />
      <div className="asg30-container">
        <input
          type="file"
          accept="image/*, video/*"
          disabled={loading || videoActive || image || video}
          onChange={handleUpload}
        />

        <button
          onClick={startVideo}
          disabled={loading || videoActive || image || video}
        >
          {loading ? "Loading..." : "Start Webcam"}
        </button>

        {(image || video || videoActive) && (
          <button onClick={handleReset}>Reset</button>
        )}

        {(image || video || videoActive) && (
          <>
            {image && !videoActive && !video && (
              <div className="face-container">
                <canvas id="face-canvas" className="canvas-image" />
                <canvas id="landmark-canvas" className="landmark-overlay" />
              </div>
            )}

            {video && !videoActive && (
              <div className="face-container">
                <video
                  id="uploaded-video"
                  src={video}
                  autoPlay
                  muted
                  loop
                  controls
                  className="canvas-image"
                  style={{ width: "100%" }}
                  onLoadedData={handleVideoLoad}
                  onPlay={detectVideoFileFaces}
                />
                <canvas
                  id="video-file-landmark-canvas"
                  className="landmark-overlay"
                />
              </div>
            )}

            {videoActive && (
              <div className="face-container">
                <video
                  id="video"
                  autoPlay
                  muted
                  className="canvas-image"
                  style={{ width: "100%" }}
                />
                <canvas
                  id="video-landmark-canvas"
                  className="landmark-overlay"
                />
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
