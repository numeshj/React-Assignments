import { useState } from "react";
import "./App.css";
import { Navigate, useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();

  return (
    <div className="asg-btn-container">
      <button className="asg-btn" onClick={() => navigate("/asg-1")}>
        ASG_1
      </button>
      <button className="asg-btn" onClick={() => navigate("/asg-2")}>
        ASG_2
      </button>
      <button className="asg-btn" onClick={() => navigate("/asg-3")}>
        ASG_3
      </button>
      <button className="asg-btn" onClick={() => navigate("/asg-4")}>
        ASG_4
      </button>
      <button className="asg-btn" onClick={() => navigate("/asg-5")}>
        ASG_5
      </button>
      <button className="asg-btn" onClick={() => navigate("/asg-6")}>
        ASG_6
      </button>
      <button className="asg-btn" onClick={() => navigate("/asg-7")}>
        ASG_7
      </button>
      <button className="asg-btn" onClick={() => navigate("/asg-8")}>
        ASG_8
      </button>
      <button className="asg-btn" onClick={() => navigate("/asg-9")}>
        ASG_9
      </button>
      <button className="asg-btn" onClick={() => navigate("/asg-10")}>
        ASG_10
      </button>
      <button className="asg-btn" onClick={() => navigate("/asg-11")}>
        ASG_11
      </button>
      <button className="asg-btn" onClick={() => navigate("/asg-12")}>
        ASG_12
      </button>
      <button className="asg-btn" onClick={() => navigate("/asg-13")}>
        ASG_13
      </button>
    </div>
  );
}

export default App;
