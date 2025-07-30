import BackToHome from "../component/BackToHome";
import "../assignments/ASG_42.css";
import { useRef, useEffect } from "react";

const NUM_PAGES = 10;

export default function ASG_42() {
  const videoRef = useRef(null);
  const scrollRef = useRef(null);

  // Sync video time with scroll position
  const onScroll = () => {
    const video = videoRef.current;
    const scroll = scrollRef.current;
    if (video && scroll) {
      const maxScroll = scroll.scrollHeight - scroll.clientHeight;
      const percent = scroll.scrollTop / maxScroll;
      video.currentTime = percent * video.duration;
    }
  };

  // Sync scroll position with video time when using mouse wheel
  const onWheel = (e) => {
    const video = videoRef.current;
    const scroll = scrollRef.current;
    if (video && scroll && video.duration > 0) {
      const pageDuration = video.duration / NUM_PAGES;
      let currentPage = Math.floor(video.currentTime / pageDuration);
      if (e.deltaY > 0) {
        currentPage = Math.min(NUM_PAGES - 1, currentPage + 1);
      } else {
        currentPage = Math.max(0, currentPage - 1);
      }
      video.currentTime = currentPage * pageDuration;
      // Update scroll position to match video time
      const maxScroll = scroll.scrollHeight - scroll.clientHeight;
      scroll.scrollTop = (video.currentTime / video.duration) * maxScroll;
      e.preventDefault();
    }
  };

  // Ensure scroll position matches video time when video loads
  useEffect(() => {
    const video = videoRef.current;
    const scroll = scrollRef.current;
    if (video && scroll) {
      const syncScroll = () => {
        if (video.duration > 0) {
          const maxScroll = scroll.scrollHeight - scroll.clientHeight;
          scroll.scrollTop = (video.currentTime / video.duration) * maxScroll;
        }
      };
      video.addEventListener("loadedmetadata", syncScroll);
      return () => video.removeEventListener("loadedmetadata", syncScroll);
    }
  }, []);

  return (
    <div className="asg42">
      <div
        className="video-scroll-container"
        ref={scrollRef}
        onScroll={onScroll}
      >
        <div style={{ height: `${NUM_PAGES * 100}vh`, position: "relative" }}>
          <video
            className="video"
            src="scrollable-video.mp4"
            ref={videoRef}
            onWheel={onWheel}
          />
          {[...Array(NUM_PAGES)].map((_, i) => (
            <div
              key={i}
              className="section-label"
              style={{
                top: `${(i + 0.5) * 100}vh`,
              }}
            >
              Section #{i + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
