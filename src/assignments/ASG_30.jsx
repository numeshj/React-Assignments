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

  // Head pose estimation functions
  const getDistance = (...points) => {
    let d = 0;
    for (let i = 0; i < points.length - 1; i++) {
      const a = points[i];
      const b = points[i + 1];
      d += Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
    }
    return d;
  };

  const getOrientation = (positions, box) => {
    // Landmark indices for face pose estimation
    const eyesMiddle = 28;
    const eyesMiddleTop = 28;
    const eyesMiddleBottom = 30;
    const lipsBottom = 58;
    const faceBottom = 9;
    const rightEyeInner = 40;
    const rightEyeOuter = 37;
    const leftEyeInner = 43;
    const leftEyeOuter = 46;

    // Fix position calculation - box has x, y, width, height properties
    const pos_x = box.x + box.width / 2;
    const pos_y = box.y + box.height / 2;
    const pos_z = 0;

    // Check if required landmark positions exist
    if (
      !positions[eyesMiddleBottom] ||
      !positions[eyesMiddleTop] ||
      !positions[lipsBottom] ||
      !positions[faceBottom] ||
      !positions[rightEyeOuter] ||
      !positions[rightEyeInner] ||
      !positions[leftEyeInner] ||
      !positions[leftEyeOuter]
    ) {
      return null;
    }

    // rotation : x
    const rot_x_a = getDistance(
      positions[eyesMiddleBottom],
      positions[eyesMiddleTop]
    );
    const rot_x_b = getDistance(positions[lipsBottom], positions[faceBottom]);
    const rot_x =
      rot_x_a + rot_x_b > 0
        ? Math.asin((0.5 - rot_x_b / (rot_x_a + rot_x_b)) * 2)
        : 0;

    // rotation : y
    const rot_y_a = getDistance(
      positions[rightEyeOuter],
      positions[rightEyeInner]
    );
    const rot_y_b = getDistance(
      positions[leftEyeInner],
      positions[leftEyeOuter]
    );
    const rot_y =
      rot_y_a + rot_y_b > 0
        ? Math.asin((0.5 - rot_y_b / (rot_y_a + rot_y_b)) * 2) * 2.5
        : 0;

    // rotation : z
    const rot_z_y = positions[rightEyeOuter].y - positions[leftEyeOuter].y;
    const rot_z_d = getDistance(
      positions[rightEyeOuter],
      positions[leftEyeOuter]
    );
    const rot_z =
      rot_z_d > 0
        ? positions[rightEyeOuter].x < positions[leftEyeOuter].x
          ? Math.asin(rot_z_y / rot_z_d)
          : 1 - Math.asin(rot_z_y / rot_z_d) + Math.PI * 0.68
        : 0;

    // scale
    const scale =
      getDistance(positions[rightEyeOuter], positions[leftEyeOuter]) * 0.7;

    // limit y rotation
    if (Math.abs(rot_y) > 0.7) {
      return null;
    }

    return {
      position: { x: pos_x, y: pos_y, z: pos_z },
      rotation: { x: rot_x, y: rot_y, z: rot_z },
      scale: { x: scale, y: scale, z: scale },
    };
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
        landmarkCanvas.style.width = displayedWidth + "px";
        landmarkCanvas.style.height = displayedHeight + "px";

        const scaleX = displayedWidth / img.width;
        const scaleY = displayedHeight / img.height;

        const landmarkCtx = landmarkCanvas.getContext("2d");
        landmarkCtx.clearRect(
          0,
          0,
          landmarkCanvas.width,
          landmarkCanvas.height
        );

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
      } catch (error) {
        console.error("Error in video file face detection:", error);
      }
    }

    if (video && !videoElement?.paused) {
      requestAnimationFrame(detectVideoFileFaces);
    }
  };

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
                {boxes.map((box, index) => (
                  <div
                    key={index}
                    className="face-box"
                    style={{
                      top: `${box.y}px`,
                      left: `${box.x}px`,
                      width: `${box.width}px`,
                      height: `${box.height}px`,
                    }}
                  />
                ))}
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
                {boxes.map((box, index) => (
                  <div
                    key={index}
                    className="face-box"
                    style={{
                      top: `${box.y}px`,
                      left: `${box.x}px`,
                      width: `${box.width}px`,
                      height: `${box.height}px`,
                    }}
                  />
                ))}
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
