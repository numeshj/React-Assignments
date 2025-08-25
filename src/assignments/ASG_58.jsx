import { useState, useEffect, useCallback, useMemo } from "react";
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
  { id: 1, text: "THIS IS", background: "rgb(51, 102, 204)", animation: "Up" },
  { id: 2, text: "A SLIDE SHOW", background: "rgb(204, 0, 68)", animation: "Fade" },
  { id: 3, text: "ONLINE EDITOR", background: "rgb(45, 134, 89)", animation: "Down" },
  { id: 4, text: "CREATED FROM", background: "rgb(219, 94, 10)", animation: "Rotate" },
  { id: 5, text: "REACT JS", background: "rgb(138, 0, 230)", animation: "Instant" },
];

export default function ASG_58() {
  const [slides, setSlides] = useState(initialSlides);
  const [activeIndex, setActiveIndex] = useState(0);

  // Fullscreen playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [playIndex, setPlayIndex] = useState(0);
  const [prevPlayIndex, setPrevPlayIndex] = useState(null);

  // Two-phase control
  const twoPhaseAnimations = useMemo(
    () => new Set(["Up", "Down", "Rotate", "Fade", "Blur"]),
    []
  );
  const [isTransitioning, setIsTransitioning] = useState(false); // outgoing phase
  const [enteringPhase, setEnteringPhase] = useState(false);     // incoming phase

  const [staticSlideId, setStaticSlideId] = useState(null); // NEW: prevent re-animation after two-phase

  const isBusy = isTransitioning || enteringPhase; // prevent mid-flight changes

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
    setSlides((s) => [...s, newSlide]);
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

  // Update text/background/animation
  const updateText = (e) => {
    setSlides((s) => {
      const next = s.slice();
      next[activeIndex] = { ...next[activeIndex], text: e.target.value };
      return next;
    });
  };
  const changeBackground = (color) => {
    setSlides((s) => {
      const next = s.slice();
      next[activeIndex] = { ...next[activeIndex], background: color };
      return next;
    });
  };
  const changeAnimation = (anim) => {
    setSlides((s) => {
      const next = s.slice();
      next[activeIndex] = { ...next[activeIndex], animation: anim };
      return next;
    });
  };

  // Safe navigation: use prevPlayIndex + playIndex as requested
  const goToPlayIndex = (target) => {
    if (isBusy || target === playIndex) return;

    const incomingAnim = slides[target].animation;
    const twoPhase = twoPhaseAnimations.has(incomingAnim);

    // put current slide into "previous" so it stays on screen
    setPrevPlayIndex(playIndex);
    setStaticSlideId(null); // reset static marker (we are navigating)

    // set the new current
    setPlayIndex(target);

    // enable transition flags only for two-phase animations
    if (twoPhase) {
      setIsTransitioning(true);
      setEnteringPhase(true);
    } else {
      // single-phase: ensure no two-phase flags set
      setIsTransitioning(false);
      setEnteringPhase(false);
    }
  };

  const startShow = () => {
    setPrevPlayIndex(null);
    setIsTransitioning(false);
    setEnteringPhase(false);
    setStaticSlideId(null);
    setPlayIndex(activeIndex);
    setIsPlaying(true);
  };

  const exitShow = () => {
    setIsPlaying(false);
    setPrevPlayIndex(null);
    setIsTransitioning(false);
    setEnteringPhase(false);
    setStaticSlideId(null);
  };

  const nextShow = useCallback(() => {
    if (isBusy) return;
    goToPlayIndex((playIndex + 1) % slides.length);
  }, [playIndex, slides.length, isBusy]);

  const prevShow = useCallback(() => {
    if (isBusy) return;
    goToPlayIndex((playIndex - 1 + slides.length) % slides.length);
  }, [playIndex, slides.length, isBusy]);

  // Incoming phase finished -> clear previous and mark static to avoid replays
  const handleInEnd = () => {
    setPrevPlayIndex(null);
    setIsTransitioning(false);
    setEnteringPhase(false);
    setStaticSlideId(playIndex);
  };

  // Single-phase finished -> mark static
  const handleSingleEnd = () => {
    setPrevPlayIndex(null);
    setStaticSlideId(playIndex);
  };

  // Keyboard
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

  const shouldRenderStaticTwoPhase =
    isPlaying &&
    !isTransitioning &&
    !enteringPhase &&
    twoPhaseAnimations.has(playingSlide.animation) &&
    staticSlideId !== playingSlide.id;

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
                {slide.text[0]}
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
            />
          </div>

          {/* Slide editor preview */}
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
                />
              ))}
            </div>

            {/* Animations */}
            <div className="animations-asg58">
              {["Instant", "Fade", "Up", "Down", "Blur", "Rotate"].map((anim) => (
                <div
                  key={anim}
                  className="animation-item-asg58"
                  data-active={anim === activeSlide.animation}
                  onClick={() => changeAnimation(anim)}
                >
                  {anim}
                </div>
              ))}
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
            />
            <div
              className="delete-asg58"
              style={{
                backgroundImage: `url(${icon.delete})`,
                backgroundSize: "16px auto",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
              onClick={deleteSlide}
            />
          </div>
        </div>
      </div>

      {/* Fullscreen show */}
      {isPlaying && (
        <div className="show-asg58" data-open="true">
          <div className="show-slide-asg58">
            {/* If we have a previous slide (previous/current pair) render both simultaneously */}
            {prevPlayIndex != null && (
              <>
                {/* outgoing (previous) uses its own animation out-phase */}
                <div
                  key={`out-${slides[prevPlayIndex].id}`}
                  className={`show-card-asg58 play-anim-${slides[prevPlayIndex].animation.toLowerCase()}-out-phase`}
                  style={{ background: slides[prevPlayIndex].background }}
                >
                  <div className="show-text-asg58">{slides[prevPlayIndex].text}</div>
                </div>

                {/* incoming (current) uses its in-phase animation and clears prev on end */}
                <div
                  key={`in-${playingSlide.id}`}
                  className={`show-card-asg58 play-anim-${playingSlide.animation.toLowerCase()}-in-phase`}
                  style={{ background: playingSlide.background }}
                  onAnimationEnd={handleInEnd}
                >
                  <div className="show-text-asg58">{playingSlide.text}</div>
                </div>
              </>
            )}

            {/* No prev slide active: either render static two-phase initial, single-phase anim, or static post animation */}
            {prevPlayIndex == null && (
              <>
                {/* static for two-phase slides when not transitioning yet */}
                {shouldRenderStaticTwoPhase && (
                  <div
                    key={`static-initial-${playingSlide.id}`}
                    className="show-card-asg58"
                    style={{ background: playingSlide.background }}
                  >
                    <div className="show-text-asg58">{playingSlide.text}</div>
                  </div>
                )}

                {/* single-phase animations (non two-phase) */}
                {!shouldRenderStaticTwoPhase && !twoPhaseAnimations.has(playingSlide.animation) && (
                  <div
                    key={`single-${playingSlide.id}`}
                    className={`show-card-asg58 play-anim-${playingSlide.animation.toLowerCase()}`}
                    style={{ background: playingSlide.background }}
                    onAnimationEnd={handleSingleEnd}
                  >
                    <div className="show-text-asg58">{playingSlide.text}</div>
                  </div>
                )}

                {/* static after finished */}
                {staticSlideId === playingSlide.id && (
                  <div
                    key={`static-${playingSlide.id}`}
                    className="show-card-asg58"
                    style={{ background: playingSlide.background }}
                  >
                    <div className="show-text-asg58">{playingSlide.text}</div>
                  </div>
                )}
              </>
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
            />
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
            />
            <div
              className="show-next-asg58"
              style={{
                backgroundImage: `url(${icon.next})`,
                backgroundSize: "26px auto",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
              onClick={nextShow}
            />
          </div>
        </div>
      )}
    </div>
  );
}
                