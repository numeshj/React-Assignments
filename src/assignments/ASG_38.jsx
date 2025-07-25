import BackToHome from "../component/BackToHome";
import "../assignments/ASG_38.css";
import { useState, useEffect, useRef } from "react";

export default function ASG_38() {
  const frame = useRef(null)
  const position = useRef({x:100, y:80})
  

  const animate = () => {
    requestAnimationFrame(animate)

    // console.log(animate)
  }

  useEffect(() => {
    animate()

    return() => {
      cancelAnimationFrame(frame.current)
    }

  }, [])
  

  return (
    <div className="asg38">
      <BackToHome />
      <h1 className="assignment-title">Assignment-38</h1>
      <hr />
      <br />
      <div className="box" >
        <div className="ball" style={{left:position.left+"px", top:position.top+"px"}}/>

      </div>

    </div>
  );
}
