import { useState, useEffect, useCallback } from "react";
import BackToHome from "../component/BackToHome";
import "../assignments/ASG_58.css";

const asset = (name) => `${import.meta.env.BASE_URL}asg58/${name}`;

const icon = {
  start: asset("./slide-show-editor-start.svg"),
  delete: asset("./slide-show-editor-delete.svg"),
  exit: asset("./slide-show-editor-exit.svg"),
  next: asset("./slide-show-editor-next.svg"),
  add: asset("./slide-show-editor-add.svg"),
};

const initialSlides = [
  { id: 1, text: "THIS IS",       background: "rgb(51, 102, 204)", animation: "Up" },
  { id: 2, text: "A SLIDE SHOW",  background: "rgb(204, 0, 68)",   animation: "Fade" },
  { id: 3, text: "ONLINE EDITOR", background: "rgb(45, 134, 89)",  animation: "Down" },
  { id: 4, text: "CREATED FROM",  background: "rgb(219, 94, 10)",  animation: "Rotate" },
  { id: 5, text: "REACT JS",      background: "rgb(138, 0, 230)",  animation: "Instant" },
];

export default function ASG_58() {
  const [slides, setSlides] = useState(initialSlides);
  const [activeIndex, setActiveIndex] = useState(0);

  // playIndex = current slide being shown
  // prevPlayIndex = previous slide that should remain visible until incoming finishes
  const [playIndex, setPlayIndex] = useState(0);
  const [prevPlayIndex, setPrevPlayIndex] = useState(null);

  // incoming animation flag (used when the incoming slide should run its in-phase animation)
  const [enteringUp, setEnteringUp] = useState(false);

  // NEW: mark when incoming finished so we don't replay fallback animation
  const [incomingCompleted, setIncomingCompleted] = useState(false);

  const twoPhaseAnimations = new Set(["Up","Down","Rotate","Fade","Blur"]);

  const activeSlide = slides[activeIndex];
  const playingSlide = slides[playIndex];
  const prevPlayingSlide = prevPlayIndex != null ? slides[prevPlayIndex] : null;

  // Add new slide
  const addSlide = () => {
    const newSlide = {
      id: Date.now(),
      text: "New Slide",
      background: "rgb(45, 134, 89)",
      animation: "Instant",
    };
    setSlides([...slides, newSlide]);
    setActiveIndex(slides.length); 
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

  // Navigate to a slide: make the current slide the previous, set new current,
  // and if incoming animation is two-phase, mark enteringUp to run incoming animation.
  const goToPlayIndex = (target) => {
    // preserve the current on screen as "previous"
    setPrevPlayIndex(playIndex);
    const incomingAnim = slides[target].animation;
    const isTwoPhase = twoPhaseAnimations.has(incomingAnim);

    // reset incomingCompleted when starting a new navigation
    setIncomingCompleted(false);
    setPlayIndex(target);
    setEnteringUp(isTwoPhase);
    // For single-phase fallback, prevPlayIndex will be cleared on animation end handler
  };

  const startShow = () => {
    // initial fullscreen: previous is null so incoming loads on black screen
    setPrevPlayIndex(null);
    const incomingAnim = slides[activeIndex].animation;
    setPlayIndex(activeIndex);
    setEnteringUp(twoPhaseAnimations.has(incomingAnim));
    setIncomingCompleted(false); // NEW: reset
    setIsPlaying(true);
  };

  const exitShow = () => {
    setIsPlaying(false);
    setPrevPlayIndex(null);
    setEnteringUp(false);
    setIncomingCompleted(false); // NEW: reset
  };

  // Hooked up to keyboard when playing
  const nextShow = useCallback(() => {
    goToPlayIndex((playIndex + 1) % slides.length);
  }, [playIndex, slides.length]);

  const prevShow = useCallback(() => {
    goToPlayIndex((playIndex - 1 + slides.length) % slides.length);
  }, [playIndex, slides.length]);

  // Incoming finished: clear previous and mark incoming complete
  const handleUpInEnd = () => {
    setPrevPlayIndex(null);
    setEnteringUp(false);
    setIncomingCompleted(true); // NEW: avoid rendering fallback animation
  };

  // Generic animation end (single-phase fallback): clear previous and mark complete
  const handleGenericAnimEnd = () => {
    setPrevPlayIndex(null);
    setIncomingCompleted(true); // NEW: so element becomes static after its run
  };

  // keyboard nav
  const [isPlaying, setIsPlaying] = useState(false);
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
              style={{
                backgroundImage: `url(${icon.add})`,
                backgroundSize: "40px auto",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
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

            <div
              className="start-asg58"
              style={{
                backgroundImage: `url(${icon.start})`,
                backgroundSize: "22px auto",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
              onClick={startShow}
            ></div>
            <div
              className="delete-asg58"
              style={{
                backgroundImage: `url(${icon.delete})`,
                backgroundSize: "16px auto",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
              onClick={deleteSlide}
            ></div>
          </div>
        </div>
      </div>

      {/* Fullscreen show overlay */}
      {isPlaying && (
        <div className="show-asg58" data-open="true">
          <div className="show-slide-asg58">
            {/* Previous slide remains visible underneath while current (playingSlide) animates in */}
            {prevPlayingSlide && (
              <div
                key={`prev-${prevPlayingSlide.id}`}
                className="show-card-asg58 show-card-prev"
                style={{ background: prevPlayingSlide.background }}
              >
                <div className="show-text-asg58">{prevPlayingSlide.text}</div>
              </div>
            )}

            {/* Incoming two-phase (in-phase animation) */}
            {enteringUp && twoPhaseAnimations.has(playingSlide.animation) && (
              <div
                key={`in-${playingSlide.id}`}
                className={`show-card-asg58 play-anim-${playingSlide.animation.toLowerCase()}-in-phase`}
                style={{ background: playingSlide.background }}
                onAnimationEnd={handleUpInEnd}
              >
                <div className="show-text-asg58">{playingSlide.text}</div>
              </div>
            )}

            {/* Single-phase or settled incoming: play once if not completed, otherwise render static */}
            {!enteringUp && (
              <div
                key={`single-${playingSlide.id}`}
                className={`show-card-asg58 ${incomingCompleted ? "" : `play-anim-${playingSlide.animation.toLowerCase()}`}`}
                style={{ background: playingSlide.background }}
                onAnimationEnd={incomingCompleted ? undefined : handleGenericAnimEnd}
              >
                <div className="show-text-asg58">{playingSlide.text}</div>
              </div>
            )}

            {/* Controls */}
            <div
              className="show-exit-asg58"
              style={{
                backgroundImage: `url(${icon.exit})`,
                backgroundSize: "26px auto",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
              onClick={exitShow}
            ></div>
            <div
              className="show-prev-asg58"
              style={{
                backgroundImage: `url(${icon.next})`,
                backgroundSize: "26px auto",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                transform: "scaleX(-1)",
              }}
              onClick={prevShow}
            ></div>
            <div
              className="show-next-asg58"
              style={{
                backgroundImage: `url(${icon.next})`,
                backgroundSize: "26px auto",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
              onClick={nextShow}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}
