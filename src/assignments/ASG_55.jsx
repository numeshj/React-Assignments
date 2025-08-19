import BackToHome from "../component/BackToHome";
import "../assignments/ASG_55.css";
import { useEffect } from "react";

export default function ASG_55() {
  useEffect(() => {
    const handleKeyDown = (event) => {
      const keyElement = document.querySelector(
        `.keyboard-key-asg55[data-key="${event.key}"]`
      );
      if (keyElement) {
        keyElement.classList.add("active");
      }
    };

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
        <textarea
          className="textarea-asg55"
          placeholder="Type your text here..."
          spellCheck="false"
        ></textarea>

        <div className="keyboard-asg55">
          {/* Row 1 */}
          <div className="keyboard-row-asg55">
            <div data-key="~" className="keyboard-key-asg55">~</div>
            <div data-key="!" className="keyboard-key-asg55">!</div>
            <div data-key="@" className="keyboard-key-asg55">@</div>
            <div data-key="#" className="keyboard-key-asg55">#</div>
            <div data-key="$" className="keyboard-key-asg55">$</div>
            <div data-key="%" className="keyboard-key-asg55">%</div>
            <div data-key="^" className="keyboard-key-asg55">^</div>
            <div data-key="&" className="keyboard-key-asg55">&</div>
            <div data-key="*" className="keyboard-key-asg55">*</div>
            <div data-key="(" className="keyboard-key-asg55">(</div>
            <div data-key=")" className="keyboard-key-asg55">)</div>
            <div data-key="-" className="keyboard-key-asg55">-</div>
            <div data-key="+" className="keyboard-key-asg55">+</div>
            <div data-key="Backspace" className="keyboard-key-asg55">Backspace</div>
          </div>

          {/* Row 2 */}
          <div className="keyboard-row-asg55">
            <div data-key="Tab" className="keyboard-key-asg55">Tab</div>
            <div data-key="q" className="keyboard-key-asg55">Q</div>
            <div data-key="w" className="keyboard-key-asg55">W</div>
            <div data-key="e" className="keyboard-key-asg55">E</div>
            <div data-key="r" className="keyboard-key-asg55">R</div>
            <div data-key="t" className="keyboard-key-asg55">T</div>
            <div data-key="y" className="keyboard-key-asg55">Y</div>
            <div data-key="u" className="keyboard-key-asg55">U</div>
            <div data-key="i" className="keyboard-key-asg55">I</div>
            <div data-key="o" className="keyboard-key-asg55">O</div>
            <div data-key="p" className="keyboard-key-asg55">P</div>
            <div data-key="{" className="keyboard-key-asg55">{`{`}</div>
            <div data-key="}" className="keyboard-key-asg55">{`}`}</div>
            <div data-key="|" className="keyboard-key-asg55">|</div>
          </div>

          {/* Row 3 */}
          <div className="keyboard-row-asg55">
            <div data-key="CapsLock" className="keyboard-key-asg55">CapsLock</div>
            <div data-key="a" className="keyboard-key-asg55">A</div>
            <div data-key="s" className="keyboard-key-asg55">S</div>
            <div data-key="d" className="keyboard-key-asg55">D</div>
            <div data-key="f" className="keyboard-key-asg55">F</div>
            <div data-key="g" className="keyboard-key-asg55">G</div>
            <div data-key="h" className="keyboard-key-asg55">H</div>
            <div data-key="j" className="keyboard-key-asg55">J</div>
            <div data-key="k" className="keyboard-key-asg55">K</div>
            <div data-key="l" className="keyboard-key-asg55">L</div>
            <div data-key=":" className="keyboard-key-asg55">:</div>
            <div data-key="&quot;" className="keyboard-key-asg55">"</div>
            <div data-key="Enter" className="keyboard-key-asg55">Enter</div>
          </div>

          {/* Row 4 */}
          <div className="keyboard-row-asg55">
            <div data-key="Shift" className="keyboard-key-asg55">Shift</div>
            <div data-key="z" className="keyboard-key-asg55">Z</div>
            <div data-key="x" className="keyboard-key-asg55">X</div>
            <div data-key="c" className="keyboard-key-asg55">C</div>
            <div data-key="v" className="keyboard-key-asg55">V</div>
            <div data-key="b" className="keyboard-key-asg55">B</div>
            <div data-key="n" className="keyboard-key-asg55">N</div>
            <div data-key="m" className="keyboard-key-asg55">M</div>
            <div data-key="<" className="keyboard-key-asg55">&lt;</div>
            <div data-key=">" className="keyboard-key-asg55">&gt;</div>
            <div data-key="?" className="keyboard-key-asg55">?</div>
            <div data-key="Shift" className="keyboard-key-asg55">Shift</div>
          </div>

          {/* Row 5 */}
          <div className="keyboard-row-asg55">
            <div data-key="Control" className="keyboard-key-asg55">Ctrl</div>
            <div data-key="Alt" className="keyboard-key-asg55">Alt</div>
            <div data-key=" " className="keyboard-key-asg55 space">Space</div>
            <div data-key="Alt" className="keyboard-key-asg55">Alt</div>
            <div data-key="Control" className="keyboard-key-asg55">Ctrl</div>
          </div>
        </div>
      </div>
    </div>
  );
}
