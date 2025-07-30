import BackToHome from "../component/BackToHome";
import "../assignments/ASG_40.css";
import { useState, useEffect, useRef } from "react";

export default function ASG_40() {
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
  });
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });
  const menuRef = useRef(null);

  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
      setContextMenu({
        visible: true,
        x: e.clientX,
        y: e.clientY,
      });
    };

    const handleClick = () => {
      setContextMenu({ visible: false, x: 0, y: 0 });
    };

    const div = document.getElementById("myDiv");
    if (div) {
      div.addEventListener("contextmenu", handleContextMenu);
      document.addEventListener("click", handleClick);
    }

    return () => {
      if (div) {
        div.removeEventListener("contextmenu", handleContextMenu);
        document.removeEventListener("click", handleClick);
      }
    };
  }, []);

  // Adjust menu position to stay within viewport
  useEffect(() => {
    if (contextMenu.visible && menuRef.current) {
      const menu = menuRef.current;
      const { innerWidth, innerHeight } = window;
      const rect = menu.getBoundingClientRect();
      let x = contextMenu.x;
      let y = contextMenu.y;

      if (x + rect.width > innerWidth) {
        x = innerWidth - rect.width - 4;
      }
      if (y + rect.height > innerHeight) {
        y = innerHeight - rect.height - 4;
      }
      x = Math.max(0, x);
      y = Math.max(0, y);
      setMenuPos({ x, y });
    }
  }, [contextMenu]);

  const handleMenuClick = (option) => {
    setContextMenu({ visible: false, x: 0, y: 0 });
    if (option === "Red") {
      document.querySelector(".asg40").style.background = "red";
    } else if (option === "Green") {
      document.querySelector(".asg40").style.background = "green";
    } else if (option === "Blue") {
      document.querySelector(".asg40").style.background = "blue";
    } else {
      document.querySelector(".asg40").style.background = "";
    }
  };

  return (
    <div className="asg40">
      <BackToHome />
      <h1 className="assignment-title">Assignment-40</h1>
      <hr />
      <br />
      <div className="container" id="myDiv" style={{ position: "relative" }}>
        <div>
          <h2 className="wording">Right Click to Open Context Menu</h2>
        </div>
        {contextMenu.visible && (
          <div
            ref={menuRef}
            className="context-menu"
            style={{
              position: "fixed",
              top: menuPos.y,
              left: menuPos.x,
              zIndex: 1000,
            }}
          >
            <div className="menu-item" onClick={() => handleMenuClick("Default")}>
              Default
            </div>
            <div className="menu-item" onClick={() => handleMenuClick("Red")}>
              Red
            </div>
            <div className="menu-item" onClick={() => handleMenuClick("Green")}>
              Green
            </div>
            <div className="menu-item" onClick={() => handleMenuClick("Blue")}>
              Blue
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
