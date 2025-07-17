import BackToHome from "../component/BackToHome";
import "../assignments/ASG_31.css";
import { useState, useEffect, useRef } from "react";

export default function ASG_31() {
  const [play, setPlay] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef(null);

  const handlePlayPause = () => {
    const myVideo = videoRef.current;
    if (!myVideo) return;
    if (myVideo.paused) {
      myVideo.play();
      setPlay(true);
    } else {
      myVideo.pause();
      setPlay(false);
    }
  };

  const handleTimeUpdate = () => {
    const myVideo = videoRef.current;
    if (myVideo) {
      setCurrentTime(myVideo.currentTime);
      setDuration(myVideo.duration || 0);
    }
  };

  const handleProgressClick = (e) => {
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const myVideo = videoRef.current;

    if (myVideo && duration) {
      const newTime = (clickX / width) * duration;
      myVideo.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  useEffect(() => {
    const myVideo = videoRef.current;
    if (myVideo) {
      myVideo.addEventListener("timeupdate", handleTimeUpdate);
      myVideo.addEventListener("loadedmetadata", handleTimeUpdate);

      const handleEnded = () => {
        setPlay(false);
        setCurrentTime(duration);
      };
      myVideo.addEventListener("ended", handleEnded);

      const interval = setInterval(() => {
        if (myVideo && !myVideo.paused) {
          handleTimeUpdate();
        }
      }, 50);

      return () => {
        myVideo.removeEventListener("timeupdate", handleTimeUpdate);
        myVideo.removeEventListener("loadedmetadata", handleTimeUpdate);
        myVideo.removeEventListener("ended", handleEnded);
        clearInterval(interval);
      };
    }
  }, [duration]);

  return (
    <>
      <BackToHome />
      <h1 className="assignment-title">Assignment-31</h1>
      <hr />
      <br />
      <div className="asg31-container">
        <video
          className="asg31-video"
          ref={videoRef}
          loop
          autoPlay
          onTimeUpdate={handleTimeUpdate}
          muted
          id="asg31-video"
          onPlay={() => setPlay(true)}
          onPause={() => setPlay(false)}
        >
          <source src="/custom-video-player.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div className="asg31-controls">
          <button
            className={`asg31-play-btn ${play ? "pause" : "play"}`}
            onClick={handlePlayPause}
          ></button>

          <div
            className="asg31-progress-container"
            onClick={handleProgressClick}
          >
            <div className="asg31-progress-bar">
              <div
                className="asg31-progress-fill"
                style={{
                  width: `${
                    duration ? (currentTime / duration) * 100 : 0
                  }%`,
                }}
              ></div>
            </div>
          </div>

          <div className="asg31-time-display">
            <span className="asg31-current-time">
              {currentTime.toFixed(2)}
            </span>
            <span>/</span>
            <span className="asg31-total-time">{duration.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </>
  );
}
