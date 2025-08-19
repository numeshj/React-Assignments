import BackToHome from "../component/BackToHome";
import "../assignments/ASG_55.css";
import { useEffect } from "react";

export default function ASG_55() {
  useEffect(() => {
    // Highlight key on keydown
    const handleKeyDown = (event) => {
      const keyElement = document.querySelector(
        `.keyboard-key-asg55[data-key="${event.key}"]`
      );
      if (keyElement) {
        keyElement.classList.add("active");
      }
    };

    // Remove highlight on keyup
    const handleKeyUp = (event) => {
      const keyElement = document.querySelector(
        `.keyboard-key-asg55[data-key="${event.key}"]`
      );
      if (keyElement) {
        keyElement.classList.remove("active");
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    // Cleanup event listeners on unmount
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <div className="asg55">
      <BackToHome />
      <h1 className="assignment-title">Assignment-55</h1>
      <hr />
      <br />

      <div className="container-asg55">
        {/* ✅ Use textarea instead of div */}
        <textarea
          className="textarea-asg55"
          placeholder="Type your text here..."
          spellCheck="false"
        ></textarea>

        <div className="keyboard-asg55">
          <div className="keyboard-row-asg55">
            <div className="keyboard-key-asg55" data-key="`">`</div>
            <div className="keyboard-key-asg55" data-key="1">1</div>
            <div className="keyboard-key-asg55" data-key="2">2</div>
            <div className="keyboard-key-asg55" data-key="3">3</div>
            <div className="keyboard-key-asg55" data-key="a">A</div>
            <div className="keyboard-key-asg55" data-key="b">B</div>
            <div className="keyboard-key-asg55" data-key="c">C</div>
          </div>
        </div>
      </div>
    </div>
  );
}
