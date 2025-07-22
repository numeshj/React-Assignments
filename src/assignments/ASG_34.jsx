import BackToHome from "../component/BackToHome";
import "../assignments/ASG_34.css";
import { useRef, useState, useEffect } from "react";

export default function ASG_34() {
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const audioRef = useRef(null);
  const sourceRef = useRef(null);
  const animationRef = useRef(null);

  const [frequencyData, setFrequencyData] = useState(new Array(64).fill(0));

  const initializeAudioContext = () => {
    if (!audioCtxRef.current || audioCtxRef.current.state === "closed") {
      audioCtxRef.current = new (window.AudioContext ||
        window.webkitAudioContext)();
      analyserRef.current = audioCtxRef.current.createAnalyser();
      analyserRef.current.fftSize = 128;
      analyserRef.current.smoothingTimeConstant = 0.3;
      analyserRef.current.minDecibels = -90;
      analyserRef.current.maxDecibels = -10;
      analyserRef.current.connect(audioCtxRef.current.destination);
    }
  };

  const handleAudioPlay = () => {
    initializeAudioContext();

    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }

    if (!sourceRef.current && audioRef.current) {
      sourceRef.current = audioCtxRef.current.createMediaElementSource(
        audioRef.current
      );
      sourceRef.current.connect(analyserRef.current);
    }

    startVisualization();
  };

  const startVisualization = () => {
    const dataArray = new Uint8Array(64);

    const animate = () => {
      if (analyserRef.current) {
        analyserRef.current.getByteFrequencyData(dataArray);
        setFrequencyData([...dataArray]);
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (audioRef.current) {
        audioRef.current
          .play()
          .catch((error) => {
            console.log("Autoplay prevented:", error);
          });
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
        audioCtxRef.current.close();
      }
    };
  }, []);

  return (
    <>
      <BackToHome />
      <h1 className="assignment-title">Assignment-34</h1>
      <hr />
      <br />
      <div>
        <h2>AudioContext - Music Visualizer</h2>
        <div className="asg34-container">
          <div className="wave-container">
            {frequencyData.map((value, index) => {
              const heightMultiplier = 1.5;
              const exponentialValue = Math.pow(value / 255, 0.7);
              const height = Math.max(exponentialValue * 150 * heightMultiplier, 3);
              
              return (
                <div
                  key={index}
                  className="wave-bar"
                  style={{
                    height: `${height}px`,
                    backgroundColor: `hsl(${(value / 255) * 360}, 70%, 50%)`,
                  }}
                />
              );
            })}
          </div>
          <audio
            ref={audioRef}
            className="asg34-audio"
            src="https://www.soundjay.com/misc/sounds-mp3/beep-07a.mp3"
            controls
            autoPlay
            loop
            onPlay={handleAudioPlay}
            onError={(e) => console.log("Audio load error:", e)}
            crossOrigin="anonymous"
          />
        </div>
      </div>
    </>
  );
}
