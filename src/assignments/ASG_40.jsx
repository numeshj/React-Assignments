import BackToHome from "../component/BackToHome";
import "../assignments/ASG_40.css";
import { useState, useEffect } from "react";

export default function ASG_40() {
  const [message, setMessage] = useState("");
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0
  });

  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
      setContextMenu({
        visible: true,
        x: e.clientX,
        y: e.clientY
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

  const handleMenuClick = (option) => {
    setMessage(`${option} selected!`);
    setContextMenu({ visible: false, x: 0, y: 0 });
  };

  return (
    <div className="asg40">
      <BackToHome />
      <h1 className="assignment-title">Assignment-40</h1>
      <hr />
      <br />
      <div className="container" id="myDiv">
        <div>
          <h2 className="wording">Right Click to Open Context Menu</h2>
          {message && <p style={{ color: "red" }}>{message}</p>}
        </div>
      </div>
      
      {contextMenu.visible && (
        <div 
          className="context-menu"
          style={{
            position: 'fixed',
            top: contextMenu.y,
            left: contextMenu.x,
            zIndex: 1000
          }}
        >
          <div className="menu-item" onClick={() => handleMenuClick('Default')}>Default</div>
          <div className="menu-item" onClick={() => handleMenuClick('Red')}>Red</div>
          <div className="menu-item" onClick={() => handleMenuClick('Green')}>Green</div>
          <div className="menu-item" onClick={() => handleMenuClick('Blue')}>Blue</div>
        </div>
      )}
    </div>
  );
}
