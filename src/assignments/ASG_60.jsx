import BackToHome from "../component/BackToHome";
import "../assignments/ASG_60.css";

export default function ASG_60() {
  const colors = [
    "rgb(251, 44, 54)",
    "rgb(255, 105, 42)",
    "rgb(254, 154, 55)",
    "rgb(240, 177, 59)",
    "rgb(124, 207, 53)",
    "rgb(49, 201, 80)",
    "rgb(55, 188, 125)",
    "rgb(54, 187, 167)",
    "rgb(59, 184, 219)",
    "rgb(52, 166, 244)",
    "rgb(43, 127, 255)",
    "rgb(97, 95, 255)",
    "rgb(142, 81, 255)",
    "rgb(173, 70, 255)",
    "rgb(225, 42, 251)",
    "rgb(246, 51, 154)",
    "rgb(255, 32, 86)",
  ];
  return (
    <div className="asg60">
      <BackToHome />
      <h1 className="assignment-title">Assignment-60</h1>
      <hr />
      <br />

      <div className="container">
        <canvas className="canvas" width="560" height="500"></canvas>
        <div className="options">
          <div className="style">
            <div className="colors">
              {colors.map((c, i) => (
                <div
                  key={c}
                  className="color"
                  data-active={i === 0 ? "true" : "false"}
                  style={{ background: c }}
                />
              ))}
            </div>
            <input
              type="range"
              className="size"
              step="0.1"
              min="4"
              max="10"
              defaultValue="5"
            />
          </div>
          <button className="record" data-active="false"></button>
          <button className="reset"></button>
        </div>
      </div>
    </div>
  );
}
