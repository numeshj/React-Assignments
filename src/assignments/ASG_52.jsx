import BackToHome from "../component/BackToHome";
import "../assignments/ASG_52.css";
import { useState, useEffect } from "react";

export default function ASG_52() {
  // Predefined vertical positions (kept from original static markup order)
  const POSITIONS = [
    145.623,   // far below
    55.6231,   // below
    -55.6231,  // center (visually)
    -145.623,  // above
    -180,      // far above
    -145.623,  // mirror path (repeat for smooth loop)
    -55.6231,
    55.6231,
    145.623,
    180
  ];

  // Return digits array [h1,h2,m1,m2,s1,s2]
  const getTimeDigits = () => {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, "0");
    const m = String(now.getMinutes()).padStart(2, "0");
    const s = String(now.getSeconds()).padStart(2, "0");
    return [...h, ...m, ...s].map(d => parseInt(d, 10));
  };

  const [digits, setDigits] = useState(getTimeDigits());

  useEffect(() => {
    const id = setInterval(() => setDigits(getTimeDigits()), 1000);
    return () => clearInterval(id);
  }, []);

  // Compute style for each item in a digit column relative to active digit
  const styleFor = (itemDigit, activeDigit) => {
    // distance in circular list (0..9)
    const diff = (itemDigit - activeDigit + 10) % 10;
    // Map diff (0..9) onto POSITIONS cyclically
    const top = POSITIONS[diff];
    // Keep opacity pattern similar to original: show a window of 5 forward digits + the wrapped previous (diff 9)
    const visible = diff <= 4 || diff === 9;
    return {
      top: `${top}px`,
      opacity: visible ? 1 : 0,
      transitionProperty: "top"
    };
  };

  const renderDigitColumn = (activeDigit, key) => (
    <div className="digit-asg52" key={key}>
      {Array.from({ length: 10 }, (_, d) => (
        <div
          key={d}
            className="digit-asg52-item"
            style={styleFor(d, activeDigit)}
        >
          {d}
        </div>
      ))}
    </div>
  );

  return (
    <div className="asg52">
      <BackToHome />
      <h1 className="assignment-title">Assignment-52</h1>
      <hr />
      <br />
      <div className="container-asg52">
        {renderDigitColumn(digits[0], "h1")}
        {renderDigitColumn(digits[1], "h2")}
        <div className="colon-asg52">:</div>
        {renderDigitColumn(digits[2], "m1")}
        {renderDigitColumn(digits[3], "m2")}
        <div className="colon-asg52">:</div>
        {renderDigitColumn(digits[4], "s1")}
        {renderDigitColumn(digits[5], "s2")}
      </div>
    </div>
  );
}
          
