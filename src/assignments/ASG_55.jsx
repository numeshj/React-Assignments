import BackToHome from "../component/BackToHome";
import "../assignments/ASG_55.css";
import { useEffect, useState } from "react";

export default function ASG_55() {
  const [isShift, setIsShift] = useState(false);

  // map shifted symbols / uppercase to base data-key values
  const normalizeKey = (k) => {
    if (!k) return k;
    // letters -> lowercase
    if (/^[A-Z]$/.test(k)) return k.toLowerCase();
    // common shifted symbol map -> base key
    const map = {
      '~': '`', '!': '1', '@': '2', '#': '3', '$': '4', '%': '5', '^': '6',
      '&': '7', '*': '8', '(': '9', ')': '0', '_': '-', '+': '=', '{': '[',
      '}': ']', '|': '\\', ':': ';', '"': "'", '<': ',', '>': '.', '?': '/'
    };
    if (map[k]) return map[k];
    // keep space
    if (k === ' ') return ' ';
    // some browsers report "Backspace", "Tab", etc. keep as-is
    return k;
  };

  // find element by comparing data-key attribute (avoids selector escaping issues)
  const findKeyEl = (rawKey) => {
    const key = normalizeKey(rawKey);
    const els = Array.from(document.querySelectorAll(".keyboard-key-asg55"));
    return els.find((el) => el.getAttribute("data-key") === key) || null;
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      const keyName = normalizeKey(event.key);
      const keyElement = findKeyEl(keyName);

      if (keyElement) keyElement.classList.add("active");

      // Handle Shift (both keys)
      if (event.key === "Shift") {
        document.querySelectorAll('[data-key="Shift"]').forEach(shiftKey => {
          shiftKey.classList.add("active");
        });
        setIsShift(true);
      }
    };

    const handleKeyUp = (event) => {
      const keyName = normalizeKey(event.key);
      const keyElement = findKeyEl(keyName);

      if (keyElement) keyElement.classList.remove("active");

      // Handle Shift release
      if (event.key === "Shift") {
        document.querySelectorAll('[data-key="Shift"]').forEach(shiftKey => {
          shiftKey.classList.remove("active");
        });
        setIsShift(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // add/remove active by normalized key
  const addActive = (k) => {
    const el = findKeyEl(k);
    if (el) el.classList.add("active");
  };
  const removeActive = (k) => {
    const el = findKeyEl(k);
    if (el) el.classList.remove("active");
  };

  // virtual (mouse) key down/up handlers
  const virtualKeyDown = (k) => {
    if (k === "Shift") {
      const next = !isShift;
      setIsShift(next);
      document.querySelectorAll('[data-key="Shift"]').forEach(shiftKey => {
        if (next) shiftKey.classList.add("active");
        else shiftKey.classList.remove("active");
      });
      return;
    }
    addActive(k);
  };
  const virtualKeyUp = (k) => {
    if (k === "Shift") return;
    removeActive(k);
  };

  // Helper: render a key with Shift behavior and mouse handlers
  const renderKey = (normal, shifted = null) => {
    const display = isShift ? (shifted || normal.toUpperCase()) : normal.toLowerCase();
    return (
      <div
        data-key={normal}
        className="keyboard-key-asg55"
        onMouseDown={() => virtualKeyDown(normal)}
        onMouseUp={() => virtualKeyUp(normal)}
        onMouseLeave={() => virtualKeyUp(normal)}
      >
        {display}
      </div>
    );
  };

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
            {renderKey("`", "~")} {/* backtick */}
            {renderKey("1", "!")}
            {renderKey("2", "@")}
            {renderKey("3", "#")}
            {renderKey("4", "$")}
            {renderKey("5", "%")}
            {renderKey("6", "^")}
            {renderKey("7", "&")}
            {renderKey("8", "*")}
            {renderKey("9", "(")}
            {renderKey("0", ")")}
            {renderKey("-", "_")}
            {renderKey("=", "+")}
            <div
              data-key="Backspace"
              className="keyboard-key-asg55"
              onMouseDown={() => virtualKeyDown("Backspace")}
              onMouseUp={() => virtualKeyUp("Backspace")}
              onMouseLeave={() => virtualKeyUp("Backspace")}
            >
              Backspace
            </div>
          </div>

          {/* Row 2 */}
          <div className="keyboard-row-asg55">
            <div
              data-key="Tab"
              className="keyboard-key-asg55"
              onMouseDown={() => virtualKeyDown("Tab")}
              onMouseUp={() => virtualKeyUp("Tab")}
              onMouseLeave={() => virtualKeyUp("Tab")}
            >
              Tab
            </div>
            {renderKey("q")}
            {renderKey("w")}
            {renderKey("e")}
            {renderKey("r")}
            {renderKey("t")}
            {renderKey("y")}
            {renderKey("u")}
            {renderKey("i")}
            {renderKey("o")}
            {renderKey("p")}
            {renderKey("[", "{")}
            {renderKey("]", "}")}
            {renderKey("\\", "|")}
          </div>

          {/* Row 3 */}
          <div className="keyboard-row-asg55">
            <div
              data-key="CapsLock"
              className="keyboard-key-asg55"
              onMouseDown={() => virtualKeyDown("CapsLock")}
              onMouseUp={() => virtualKeyUp("CapsLock")}
              onMouseLeave={() => virtualKeyUp("CapsLock")}
            >
              CapsLock
            </div>
            {renderKey("a")}
            {renderKey("s")}
            {renderKey("d")}
            {renderKey("f")}
            {renderKey("g")}
            {renderKey("h")}
            {renderKey("j")}
            {renderKey("k")}
            {renderKey("l")}
            {renderKey(";", ":")}
            {renderKey("'", '"')}
            <div
              data-key="Enter"
              className="keyboard-key-asg55"
              onMouseDown={() => virtualKeyDown("Enter")}
              onMouseUp={() => virtualKeyUp("Enter")}
              onMouseLeave={() => virtualKeyUp("Enter")}
            >
              Enter
            </div>
          </div>

          {/* Row 4 */}
          <div className="keyboard-row-asg55">
            <div
              data-key="Shift"
              className="keyboard-key-asg55"
              onMouseDown={() => virtualKeyDown("Shift")}
            >
              Shift
            </div>
            {renderKey("z")}
            {renderKey("x")}
            {renderKey("c")}
            {renderKey("v")}
            {renderKey("b")}
            {renderKey("n")}
            {renderKey("m")}
            {renderKey(",", "<")}
            {renderKey(".", ">")}
            {renderKey("/", "?")}
            <div
              data-key="Shift"
              className="keyboard-key-asg55"
              onMouseDown={() => virtualKeyDown("Shift")}
            >
              Shift
            </div>
          </div>

          {/* Row 5 */}
          <div className="keyboard-row-asg55">
            <div
              data-key="Control"
              className="keyboard-key-asg55"
              onMouseDown={() => virtualKeyDown("Control")}
              onMouseUp={() => virtualKeyUp("Control")}
              onMouseLeave={() => virtualKeyUp("Control")}
            >
              Ctrl
            </div>
            <div
              data-key="Alt"
              className="keyboard-key-asg55"
              onMouseDown={() => virtualKeyDown("Alt")}
              onMouseUp={() => virtualKeyUp("Alt")}
              onMouseLeave={() => virtualKeyUp("Alt")}
            >
              Alt
            </div>
            <div
              data-key=" "
              className="keyboard-key-asg55 space"
              onMouseDown={() => virtualKeyDown(" ")}
              onMouseUp={() => virtualKeyUp(" ")}
              onMouseLeave={() => virtualKeyUp(" ")}
            >
              Space
            </div>
            <div
              data-key="Alt"
              className="keyboard-key-asg55"
              onMouseDown={() => virtualKeyDown("Alt")}
              onMouseUp={() => virtualKeyUp("Alt")}
              onMouseLeave={() => virtualKeyUp("Alt")}
            >
              Alt
            </div>
            <div
              data-key="Control"
              className="keyboard-key-asg55"
              onMouseDown={() => virtualKeyDown("Control")}
              onMouseUp={() => virtualKeyUp("Control")}
              onMouseLeave={() => virtualKeyUp("Control")}
            >
              Ctrl
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
