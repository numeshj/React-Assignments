import BackToHome from "../component/BackToHome";
import "../assignments/ASG_58.css";

export default function ASG_58() {
  return (
    <div className="asg58">
      <BackToHome />

      <div className="container-asg58">
        <div className="editor-asg58">
          {/* Listing items */}
          <div className="listing-asg58">
            <div
              className="listing-asg58-item"
              data-active="true"
              style={{ background: "rgb(51, 102, 204)" }}
            >
              T
            </div>
            <div
              className="listing-asg58-item"
              data-active="false"
              style={{ background: "rgb(204, 0, 68)" }}
            >
              A
            </div>
            <div
              className="listing-asg58-item"
              data-active="false"
              style={{ background: "rgb(45, 134, 89)" }}
            >
              O
            </div>
            <div
              className="listing-asg58-item"
              data-active="false"
              style={{ background: "rgb(219, 94, 10)" }}
            >
              C
            </div>
            <div
              className="listing-asg58-item"
              data-active="false"
              style={{ background: "rgb(138, 0, 230)" }}
            >
              R
            </div>
            <div className="listing-asg58-item listing-asg58-item-add"></div>
          </div>

          {/* Slide */}
          <div className="slide-asg58" style={{ background: "rgb(51, 102, 204)" }}>
            <input
              className="slide-asg58-input"
              spellCheck="false"
              value="THIS IS"
              readOnly
            />
            <div className="background-asg58">
              <div
                className="background-item-asg58"
                data-active="true"
                style={{ background: "rgb(51, 102, 204)" }}
              ></div>
              <div
                className="background-item-asg58"
                data-active="false"
                style={{ background: "rgb(204, 0, 68)" }}
              ></div>
              <div
                className="background-item-asg58"
                data-active="false"
                style={{ background: "rgb(45, 134, 89)" }}
              ></div>
              <div
                className="background-item-asg58"
                data-active="false"
                style={{ background: "rgb(219, 94, 10)" }}
              ></div>
              <div
                className="background-item-asg58"
                data-active="false"
                style={{ background: "rgb(138, 0, 230)" }}
              ></div>
            </div>

            {/* Animations */}
            <div className="animations-asg58">
              <div className="animation-item-asg58" data-active="false">
                Instant
              </div>
              <div className="animation-item-asg58" data-active="false">
                Fade
              </div>
              <div className="animation-item-asg58" data-active="true">
                Up
              </div>
              <div className="animation-item-asg58" data-active="false">
                Down
              </div>
              <div className="animation-item-asg58" data-active="false">
                Blur
              </div>
              <div className="animation-item-asg58" data-active="false">
                Rotate
              </div>
            </div>

            <div className="start-asg58"></div>
            <div className="delete-asg58"></div>
          </div>
        </div>
      </div>

      <hr />
    </div>
  );
}
