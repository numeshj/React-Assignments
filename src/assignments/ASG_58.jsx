import { useState, useEffect, useCallback } from "react";
import BackToHome from "../component/BackToHome";
import "../assignments/ASG_58.css";

export default function ASG_58() {
  const initialSlides = [
    { id: 1, text: "THIS IS",        background: "rgb(51, 102, 204)", animation: "Up" },
    { id: 2, text: "A SLIDE SHOW",   background: "rgb(204, 0, 68)",   animation: "Fade" },
    { id: 3, text: "ONLINE EDITOR",  background: "rgb(45, 134, 89)",  animation: "Down" },
    { id: 4, text: "CREATED FROM",   background: "rgb(219, 94, 10)",  animation: "Rotate" },
    { id: 5, text: "REACR JS",       background: "rgb(138, 0, 230)",  animation: "Instant" },
  ];

  const [slides, setSlides] = useState(initialSlides);
  const [activeIndex, setActiveIndex] = useState(0);

  // Slideshow play mode
  const [isPlaying, setIsPlaying] = useState(false);
  const [playIndex, setPlayIndex] = useState(0);

  const activeSlide = slides[activeIndex];
  const playingSlide = slides[playIndex];

  // Add new slide
  const addSlide = () => {
    const newSlide = {
      id: Date.now(),
      text: "New Slide",
      background: "rgb(45, 134, 89)",
      animation: "Instant",
    };
    setSlides([...slides, newSlide]);
    setActiveIndex(slides.length); // jump to new slide
  };

  // Delete current slide
  const deleteSlide = () => {
    if (slides.length > 1) {
      const updated = slides.filter((_, i) => i !== activeIndex);
      setSlides(updated);
      setActiveIndex(Math.max(0, activeIndex - 1));
    }
  };

  // Update text
  const updateText = (e) => {
    const updated = [...slides];
    updated[activeIndex].text = e.target.value;
    setSlides(updated);
  };

  // Change background
  const changeBackground = (color) => {
    const updated = [...slides];
    updated[activeIndex].background = color;
    setSlides(updated);
  };

  // Change animation
  const changeAnimation = (anim) => {
    const updated = [...slides];
    updated[activeIndex].animation = anim;
    setSlides(updated);
  };

  const startShow = () => {
    setPlayIndex(activeIndex);
    setIsPlaying(true);
  };
  const exitShow = () => setIsPlaying(false);
  const nextShow = useCallback(() => {
    setPlayIndex((p) => (p + 1) % slides.length);
  }, [slides.length]);
  const prevShow = useCallback(() => {
    setPlayIndex((p) => (p - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (!isPlaying) return;
    const handler = (e) => {
      if (e.key === "ArrowRight") nextShow();
      else if (e.key === "ArrowLeft") prevShow();
      else if (e.key === "Escape") exitShow();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isPlaying, nextShow, prevShow]);

  return (
    <div className="asg58">
      <BackToHome />

      <div className="container-asg58">
        <div className="editor-asg58">
          {/* Listing */}
          <div className="listing-asg58">
            {slides.map((slide, i) => (
              <div
                key={slide.id}
                className="listing-asg58-item"
                data-active={i === activeIndex}
                style={{ background: slide.background }}
                onClick={() => setActiveIndex(i)}
              >
                {slide.text[0] /* first letter */}
              </div>
            ))}
            <div
              className="listing-asg58-item listing-asg58-item-add"
              onClick={addSlide}
            ></div>
          </div>

          {/* Slide */}
          <div className="slide-asg58">
            <div
              key={activeSlide.id}
              className={`slide-card-asg58 anim-${activeSlide.animation.toLowerCase()}`}
              style={{ background: activeSlide.background }}
            >
              <input
                className="slide-asg58-input"
                spellCheck="false"
                value={activeSlide.text}
                onChange={updateText}
              />
            </div>
            {/* Background choices */}
            <div className="background-asg58">
              {[
                "rgb(51, 102, 204)",
                "rgb(204, 0, 68)",
                "rgb(45, 134, 89)",
                "rgb(219, 94, 10)",
                "rgb(138, 0, 230)",
              ].map((color) => (
                <div
                  key={color}
                  className="background-item-asg58"
                  data-active={color === activeSlide.background}
                  style={{ background: color }}
                  onClick={() => changeBackground(color)}
                ></div>
              ))}
            </div>

            {/* Animations */}
            <div className="animations-asg58">
              {["Instant", "Fade", "Up", "Down", "Blur", "Rotate"].map(
                (anim) => (
                  <div
                    key={anim}
                    className="animation-item-asg58"
                    data-active={anim === activeSlide.animation}
                    onClick={() => changeAnimation(anim)}
                  >
                    {anim}
                  </div>
                )
              )}
            </div>

            <div className="start-asg58" onClick={startShow}></div>
            <div className="delete-asg58" onClick={deleteSlide}></div>
          </div>
        </div>
      </div>

      {/* Fullscreen show overlay */}
      {isPlaying && (
        <div
          className="show-asg58"
          data-open="true"
        >
          <div className="show-slide-asg58">
            <div
              key={playingSlide.id}
              className={`show-card-asg58 play-anim-${playingSlide.animation.toLowerCase()}`}
              style={{ background: playingSlide.background }}
            >
              <div className="show-text-asg58">{playingSlide.text}</div>
            </div>
            <div className="show-exit-asg58" onClick={exitShow}></div>
            <div className="show-prev-asg58" onClick={prevShow}></div>
            <div className="show-next-asg58" onClick={nextShow}></div>
          </div>
        </div>
      )}
    </div>
  );
}
