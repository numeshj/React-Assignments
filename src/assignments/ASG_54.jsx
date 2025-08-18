import BackToHome from "../component/BackToHome";
import "../assignments/ASG_54.css";
import { useState, useEffect, useRef } from "react";

export default function ASG_54() {
  const [command, setCommand] = useState("");
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1); // -1 means no history selected
  const outputRef = useRef(null);

  // scroll to bottom when history changes (newest at bottom)
  useEffect(() => {
    if (!outputRef.current) return;
    // ensure DOM updated first
    requestAnimationFrame(() => {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    });
  }, [history]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      runCommand(command);
    } else if (e.key === "ArrowUp") {
      // navigate older commands
      if (history.length === 0) return;
      const nextIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setCommand(history[nextIndex].cmd);
    } else if (e.key === "ArrowDown") {
      // navigate newer commands or clear when beyond newest
      if (history.length === 0) return;
      if (historyIndex === -1) return;
      if (historyIndex < history.length - 1) {
        const nextIndex = historyIndex + 1;
        setHistoryIndex(nextIndex);
        setCommand(history[nextIndex].cmd);
      } else {
        // was at newest, go to empty input
        setHistoryIndex(-1);
        setCommand("");
      }
    }
  };

  const runCommand = (cmd) => {
    if (!cmd || !cmd.trim()) return;

    let outputValue;
    let type;
    let isError = false;

    try {
      // Use Function constructor to evaluate expression and get result
      const fn = new Function("return (" + cmd + ")");
      const result = fn();

      if (result === null) {
        type = "null";
        outputValue = "null";
      } else if (typeof result === "undefined") {
        type = "undefined";
        outputValue = "undefined";
      } else {
        type = typeof result;
        if (type === "object") {
          try {
            outputValue = JSON.stringify(result);
          } catch (e) {
            outputValue = String(result);
          }
        } else {
          outputValue = String(result);
        }
      }
    } catch (err) {
      isError = true;
      type = "error";
      outputValue = err && err.message ? err.message : String(err);
    }

    // push to history (use functional update)
    setHistory((prev) => [...prev, { cmd, output: outputValue, type, isError }]);
    setCommand("");
    setHistoryIndex(-1);
  };

  // return background only for errors
  const getBgColor = (item) => {
    if (item.isError) return "#d0434333";
    return undefined;
  };

  // return text color for non-error types
  const getTextColor = (item) => {
    if (item.isError) return "#ffffffcc";
    switch (item.type) {
      case "string":
        return "#fe8d59";
      case "number":
      case "boolean":
        return "#9980ff";
      case "object":
      case "null":
        return "#5cd5fb";
      case "undefined":
        return "#888888";
      default:
        return "#ffffff";
    }
  };

  return (
    <div className="asg54">
      <BackToHome />
      <h1 className="assignment-title">Assignment-54</h1>
      <hr />
      <br />

      <div className="container-asg54">
        <div className="outputs-asg54">
          <div className="listen-asg54" ref={outputRef}>
            {history.length === 0 ? (
              <div className="center-asg54">Outputs will be displayed here</div>
            ) : (
              history.map((item, index) => (
                <div className="item-asg54" key={index}>
                  <div className="item-command-asg54">
                    <span>&gt; {item.cmd}</span>
                  </div>
                  {/* error -> colored background, success -> colored text */}
                  <div
                    className="item-command-asg54"
                    style={{
                      backgroundColor: getBgColor(item),
                      color: getTextColor(item),
                      borderColor: item.isError ? "#8b2f2f" : "#00000022",
                    }}
                  >
                    {String(item.output)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <input
          type="text"
          className="input-asg54"
          spellCheck="false"
          placeholder="Input your JavaScript command and hit enter"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
}
