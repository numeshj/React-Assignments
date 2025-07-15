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
      <button className="asg-btn" onClick={() => navigate("/asg-14")}>
        ASG_14
      </button>
      <button className="asg-btn" onClick={() => navigate("/asg-15")}>
        ASG_15
      </button>
      <button className="asg-btn" onClick={() => navigate("/asg-16")}>
        ASG_16
      </button>
      <button className="asg-btn" onClick={() => navigate("/asg-17")}>
        ASG_17
      </button>
      <button className="asg-btn" onClick={() => navigate("/asg-18")}>
        ASG_18
      </button>
      <button className="asg-btn" onClick={() => navigate("/asg-19")}>
        ASG_19
      </button>
      <button className="asg-btn" onClick={() => navigate("/asg-20")}>
        ASG_20
      </button>
      <button className="asg-btn" onClick={() => navigate("/asg-21")}>
        ASG_21
      </button>
      <button className="asg-btn" onClick={() => navigate("/asg-22")}>
        ASG_22
      </button>
      <button className="asg-btn" onClick={() => navigate("/asg-23")}>
        ASG_23
      </button>
      <button className="asg-btn" onClick={() => navigate("/asg-24")}>
        ASG_24
      </button>
      <button className="asg-btn" onClick={() => navigate("/asg-25")}>
        ASG_25
      </button>
      <button className="asg-btn" onClick={() => navigate("/asg-26")}>
        ASG_26
      </button>
      <button className="asg-btn" onClick={() => navigate("/asg-27")}>
        ASG_27
      </button>
      <button className="asg-btn" onClick={() => navigate("/asg-28")}>
        ASG_28
      </button>
      <button className="asg-btn" onClick={() => navigate("/asg-29")}>
        ASG_29
      </button>
      <button className="asg-btn" onClick={() => navigate("/asg-30")}>
        ASG_30
      </button>
    </div>
  );
}

export default App;
