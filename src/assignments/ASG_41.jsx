import BackToHome from "../component/BackToHome";
import "../assignments/ASG_41.css";
import { useEffect, useRef } from "react";

export default function ASG_41() {
  const videoRef = useRef(null);

  useEffect(() => {
    const handleWheel = (e) => {
      if (!videoRef.current) return;
      e.preventDefault();
      const video = videoRef.current;
      const seekAmount = 1;
      let newTime = video.currentTime + (e.deltaY > 0 ? seekAmount : -seekAmount);
      newTime = Math.max(0, Math.min(video.duration || 0, newTime));
      video.currentTime = newTime;
    };

    const videoElem = videoRef.current;
    if (videoElem) {
      videoElem.addEventListener("wheel", handleWheel, { passive: false });
    }
    return () => {
      if (videoElem) {
        videoElem.removeEventListener("wheel", handleWheel);
      }
    };
  }, []);

  return (
    <div className="asg41">
      <BackToHome />
      <div className="video-container">
        <video
          className="video"
          id="video"
          ref={videoRef}
          src="scrollable-video.mp4"
          style={{ width: "100%" }}
        />
      </div>
    </div>
  );
}
