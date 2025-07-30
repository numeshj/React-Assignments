import BackToHome from "../component/BackToHome";
import "../assignments/ASG_41.css";
import { useEffect, useRef, useState } from "react";

const NUM_SECTIONS = 30;

export default function ASG_41() {
  const videoRef = useRef(null);
  const scrollRef = useRef(null);
  const [videoDuration, setVideoDuration] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const onLoaded = () => setVideoDuration(video.duration || 0);
      video.addEventListener("loadedmetadata", onLoaded);
      return () => video.removeEventListener("loadedmetadata", onLoaded);
    }
  }, []);

  // Sync video with scroll
  const handleScroll = () => {
    if (!videoRef.current || !scrollRef.current || videoDuration === 0) return;
    const scrollTop = scrollRef.current.scrollTop;
    const scrollHeight = scrollRef.current.scrollHeight - scrollRef.current.clientHeight;
    const percent = scrollTop / scrollHeight;
    videoRef.current.currentTime = percent * videoDuration;
  };

  // Mouse wheel scroll: one section per wheel "notch", attached directly to scroll area
  useEffect(() => {
    const scrollArea = scrollRef.current;
    if (!scrollArea) return;

    const handleWheel = (e) => {
      if (!videoRef.current || !scrollRef.current || videoDuration === 0) return;
      e.preventDefault();
      // Each wheel event moves one section (page)
      const sectionHeight = window.innerHeight;
      scrollArea.scrollBy({
        top: Math.sign(e.deltaY) * sectionHeight,
        behavior: "smooth"
      });
    };

    scrollArea.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      scrollArea.removeEventListener("wheel", handleWheel);
    };
  }, [videoDuration]);

  // When video time changes (by play, seek, etc), update scroll bar
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !scrollRef.current || videoDuration === 0) return;

    const onTimeUpdate = () => {
      const percent = video.currentTime / videoDuration;
      const scrollHeight = scrollRef.current.scrollHeight - scrollRef.current.clientHeight;
      scrollRef.current.scrollTop = percent * scrollHeight;
    };

    video.addEventListener("timeupdate", onTimeUpdate);
    return () => video.removeEventListener("timeupdate", onTimeUpdate);
  }, [videoDuration]);

  // Each page is 100vh, total scroll height = NUM_SECTIONS * 100vh
  const scrollContentHeight = `${NUM_SECTIONS * 100}vh`;

  // Render 30 transparent pages with section numbers
  const pages = [];
  for (let i = 1; i <= NUM_SECTIONS; i++) {
    pages.push(
      <div className="section-page" key={i}>
        <span className="section-page-label">{`Section #${i}`}</span>
      </div>
    );
  }

  return (
    <div className="asg41">
      <BackToHome />
      <video
        className="video-bg"
        ref={videoRef}
        src="/scrollable-video.mp4"
        muted
      />
      <div className="scroll-pages-wrapper">
        <div
          className="scroll-pages"
          ref={scrollRef}
          onScroll={handleScroll}
        >
          <div
            className="scroll-pages-content"
            style={{ height: scrollContentHeight }}
          >
            {pages}
          </div>
        </div>
      </div>
    </div>
  );
}

