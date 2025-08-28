import BackToHome from "../component/BackToHome";
import "../assignments/ASG_59.css";
import { useState, useRef, useEffect } from "react";

export default function ASG_59() {
  const itemCount = 64;
  // colors loaded from public/asg59/zoom-in-list.json (hex strings)
  const [colors, setColors] = useState([]);
  const fallback = [
    "#FB2C36","#FF692A","#FE9A37","#F0B13B","#7CCF35","#31C950","#37BC7D","#36BBA7"
  ];

  useEffect(() => {
    fetch("./asg59/zoom-in-list.json")
      .then(res => {
        if (!res.ok) throw new Error("failed to load colors");
        return res.json();
      })
      .then(data => {
        if (!Array.isArray(data) || data.length === 0) {
          setColors(Array.from({ length: itemCount }, (_, i) => fallback[i % fallback.length]));
          return;
        }
        // ensure result has itemCount entries by repeating if necessary
        setColors(Array.from({ length: itemCount }, (_, i) => data[i % data.length]));
      })
      .catch(() => {
        setColors(Array.from({ length: itemCount }, (_, i) => fallback[i % fallback.length]));
      });
  }, []);

  const itemsRef = useRef([]);
  const containerRef = useRef(null); // added ref for container
  const overlayRef = useRef(null);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const [overlayStyle, setOverlayStyle] = useState({});
  const [isFull, setIsFull] = useState(false);

  function openItem(e, index) {
    const rect = e.currentTarget.getBoundingClientRect();
    const initial = {
      position: "fixed",
      top: `${rect.top}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      background: colors[index] || fallback[index % fallback.length],
      borderRadius: "10px",
      zIndex: 1200,
      boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
      transition: "all 360ms cubic-bezier(0.2,0.8,0.2,1)"
    };
    setActiveIndex(index);
    setOverlayStyle(initial);
    setOverlayVisible(true);

    // animate to container size (not fullscreen)
    requestAnimationFrame(() => {
      const containerRect = containerRef.current?.getBoundingClientRect();
      if (containerRect) {
        setOverlayStyle(prev => ({
          ...prev,
          top: `${containerRect.top}px`,
          left: `${containerRect.left}px`,
          width: `${containerRect.width}px`,
          height: `${containerRect.height}px`,
          borderRadius: "8px"
        }));
      } else {
        // fallback to fullscreen if container not found
        setOverlayStyle(prev => ({
          ...prev,
          top: "0px",
          left: "0px",
          width: "100vw",
          height: "100vh",
          borderRadius: "0px"
        }));
      }
      setIsFull(true);
    });
  }

  function closeOverlay() {
    if (activeIndex == null) return;
    const target = itemsRef.current[activeIndex];
    if (!target) {
      setOverlayVisible(false);
      setActiveIndex(null);
      setIsFull(false);
      return;
    }
    const rect = target.getBoundingClientRect();
    setIsFull(false);
    setOverlayStyle(prev => ({
      ...prev,
      top: `${rect.top}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      borderRadius: "10px"
    }));
  }

  function onOverlayTransitionEnd() {
    if (!isFull) {
      setOverlayVisible(false);
      setActiveIndex(null);
    }
  }

  return (
    <div className="asg59">
      <BackToHome />
      <h1 className="assignment-title">Assignment-59</h1>
      <hr />
      <br />

      <div className="container-asg59" ref={containerRef}>
        <div className="list-asg59">
          {Array.from({ length: itemCount }).map((_, i) => (
            <div
              key={i}
              ref={el => (itemsRef.current[i] = el)}
              className="item-asg59"
              style={{ background: colors[i] || fallback[i % fallback.length] }}
              onClick={(e) => openItem(e, i)}
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>

      {overlayVisible && (
        <div
          ref={overlayRef}
          className={`overlay-asg59 ${isFull ? "overlay-open-asg59" : ""}`}
          style={overlayStyle}
          onTransitionEnd={onOverlayTransitionEnd}
        >
          <div className="overlay-inner-asg59">
            {/* background-image removed from CSS; using text "✕" as close icon */}
            <button
              className="overlay-close-asg59"
              onClick={closeOverlay}
              aria-label="close"
              disabled={!isFull} /* disable until fully opened */
            >
              ✕
            </button>
            <div className="overlay-number-asg59">{activeIndex != null ? activeIndex + 1 : ""}</div>
          </div>
        </div>
      )}
    </div>
  );
}
