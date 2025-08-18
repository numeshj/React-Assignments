import BackToHome from "../component/BackToHome";
import "../assignments/ASG_54.css";
import { useState, useEffect, useRef } from "react";

export default function ASG_54() {
  const [command, setCommand] = useState("");
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const outputRef = useRef(null);

  useRef(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.scrollHeight;
    }
  }, [history]);


  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      runCommand(command)
    } else if (e.key === "ArrowUp") {
      if (historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCommand(history[history.length - 1 - newIndex].cmd);
      }
    } else if (e.key === "ArrowDown") {
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCommand(history[history.length - 1 - newIndex].cmd);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCommand("")
      }
    }
  };

  const runCommand = (cmd) => {
    if (!cmd.trim()) return;

    try {
      const result = new Function("return" + cmd());
      let type = typeof result;
      let display = result;

      if (type === "object") {
        displayValue = JSON.stringify(result);
      }

      setHistory([...history, { cmd, output: displayValue, type, isError: false }]);
    } catch (err) {
      setHistory([...history, { cmd, output: err.message, type: "error", isError: true }])
    }

    setCommand("")
    setHistoryIndex(-1)
  }


  return (
    <div className="asg54">
      <BackToHome />
      <h1 className="assignment-title">Assignment-54</h1>
      <hr />
      <br />
    </div>
  );
}
