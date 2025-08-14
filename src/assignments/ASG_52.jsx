import BackToHome from "../component/BackToHome";
import "../assignments/ASG_52.css";
import { useState, useEffect } from "react";

export default function ASG_52() {
  const ITEM_H = 120; // must match CSS .digit-asg52/.digit-asg52-item height

  // Get formatted time string "hh : mm : ss"
  const getTimeString = () => {
    const raw = new Date().toLocaleTimeString("en-GB", { hour12: false });
    const [h, m, s] = raw.split(":");
    return `${h.padStart(2, "0")} : ${m.padStart(2, "0")} : ${s.padStart(2, "0")}`;
  };

  const [timeStr, setTimeStr] = useState(getTimeString());
  useEffect(() => {
    const id = setInterval(() => setTimeStr(getTimeString()), 1000);
    return () => clearInterval(id);
  }, []);

  // Extract digits: [h1,h2,m1,m2,s1,s2]
  const digits = timeStr.replace(/\D/g, "").split("").map(Number);

  // Render drum column: show current digit and 2 above/below for smoothness
  const renderDrumColumn = (activeDigit, key, maxDigit) => (
    <div className="digit-asg52" key={key}>
      {Array.from({ length: maxDigit }, (_, d) => {
        const diff = d - activeDigit;
        // Only show current digit and 2 above/below
        if (Math.abs(diff) > 2 && Math.abs(diff - maxDigit) > 2 && Math.abs(diff + maxDigit) > 2) return null;
        // Wrap for negative/overflow
        let offset = diff;
        if (offset > maxDigit / 2) offset -= maxDigit;
        if (offset < -maxDigit / 2) offset += maxDigit;
        return (
          <div
            key={d}
            className="digit-asg52-item"
            style={{
              top: `${offset * ITEM_H}px`,
              opacity: Math.abs(offset) <= 2 ? 1 : 0,
              transition: "top 0.5s cubic-bezier(.5,1.5,.5,1), opacity 0.5s"
            }}
          >
            {d}
          </div>
        );
      })}
    </div>
  );

  const h1 = digits[0];
  const h2Max = h1 === 2 ? 4 : 10;

  return (
    <div className="asg52">
      <BackToHome />
      <h1 className="assignment-title">Assignment-52</h1>
      <hr />
      <br />
      <div className="container-asg52">
        {renderDrumColumn(h1, "h1", 3)}
        {renderDrumColumn(digits[1] % h2Max, `h2-${h2Max}`, h2Max)}
        <div className="colon-asg52">:</div>
        {renderDrumColumn(digits[2], "m1", 6)}
        {renderDrumColumn(digits[3], "m2", 10)}
        <div className="colon-asg52">:</div>
        {renderDrumColumn(digits[4], "s1", 6)}
        {renderDrumColumn(digits[5], "s2", 10)}
      </div>
    </div>
  );
}
 