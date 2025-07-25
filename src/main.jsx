import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Routes, Route, HashRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store.js";
import "./index.css";
import App from "./App.jsx";
import ASG_1 from "./assignments/ASG_1.jsx";
import ASG_2 from "./assignments/ASG_2.jsx";
import ASG_3 from "./assignments/ASG_3.jsx";
import ASG_4 from "./assignments/ASG_4.jsx";
import ASG_5 from "./assignments/ASG_5.jsx";
import ASG_6 from "./assignments/ASG_6.jsx";
import ASG_7 from "./assignments/ASG_7.jsx";
import ASG_8 from "./assignments/ASG_8.jsx";
import ASG_9 from "./assignments/ASG_9.jsx";
import ASG_10 from "./assignments/ASG_10.jsx";
import ASG_11 from "./assignments/ASG_11.jsx";
import ASG_12 from "./assignments/ASG_12.jsx";
import ASG_13 from "./assignments/ASG_13.jsx";
import ASG_14 from "./assignments/ASG_14.jsx";
import ASG_15 from "./assignments/ASG_15.jsx";
import ASG_16 from "./assignments/ASG_16.jsx";
import ASG_17 from "./assignments/ASG_17.jsx";
import ASG_18 from "./assignments/ASG_18.jsx";
import ASG_19 from "./assignments/ASG_19.jsx";
import ASG_20 from "./assignments/ASG_20.jsx";
import ASG_21 from "./assignments/ASG_21.jsx";
import ASG_22 from "./assignments/ASG_22.jsx";
import ASG_23 from "./assignments/ASG_23.jsx";
import ASG_24 from "./assignments/ASG_24.jsx";
import ASG_25 from "./assignments/ASG_25.jsx";
import ASG_26 from "./assignments/ASG_26.jsx";
import ASG_27 from "./assignments/ASG_27.jsx";
import ASG_28 from "./assignments/ASG_28.jsx";
import ASG_29 from "./assignments/ASG_29.jsx";
import ASG_30 from "./assignments/ASG_30.jsx";
import ASG_31 from "./assignments/ASG_31.jsx";
import ASG_32 from "./assignments/ASG_32.jsx";
import ASG_33 from "./assignments/ASG_33.jsx";
import ASG_34 from "./assignments/ASG_34.jsx";
import ASG_35 from "./assignments/ASG_35.jsx";
import ASG_36 from "./assignments/ASG_36.jsx";
import ASG_37 from "./assignments/ASG_37.jsx";
import ASG_38 from "./assignments/ASG_38.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <HashRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/asg-1" element={<ASG_1 />} />
          <Route path="/asg-2" element={<ASG_2 />} />
          <Route path="/asg-3" element={<ASG_3 />} />
          <Route path="/asg-4" element={<ASG_4 />} />
          <Route path="/asg-5" element={<ASG_5 />} />
          <Route path="/asg-6" element={<ASG_6 />} />
          <Route path="/asg-7" element={<ASG_7 />} />
          <Route path="/asg-8" element={<ASG_8 />} />
          <Route path="/asg-9" element={<ASG_9 />} />
          <Route path="/asg-10" element={<ASG_10 />} />
          <Route path="/asg-11" element={<ASG_11 />} />
          <Route path="/asg-12" element={<ASG_12 />} />
          <Route path="/asg-13" element={<ASG_13 />} />
          <Route path="/asg-14" element={<ASG_14 />} />
          <Route path="/asg-15" element={<ASG_15 />} />
          <Route path="/asg-16" element={<ASG_16 />} />
          <Route path="/asg-17" element={<ASG_17 />} />
          <Route path="/asg-18" element={<ASG_18 />} />
          <Route path="/asg-19" element={<ASG_19 />} />
          <Route path="/asg-20" element={<ASG_20 />} />
          <Route path="/asg-21" element={<ASG_21 />} />
          <Route path="/asg-22" element={<ASG_22 />} />
          <Route path="/asg-23" element={<ASG_23 />} />
          <Route path="/asg-24" element={<ASG_24 />} />
          <Route path="/asg-25" element={<ASG_25 />} />
          <Route path="/asg-26" element={<ASG_26 />} />
          <Route path="/asg-27" element={<ASG_27 />} />
          <Route path="/asg-28" element={<ASG_28 />} />
          <Route path="/asg-29" element={<ASG_29 />} />
          <Route path="/asg-30" element={<ASG_30 />} />
          <Route path="/asg-31" element={<ASG_31 />} />
          <Route path="/asg-32" element={<ASG_32 />} />
          <Route path="/asg-33" element={<ASG_33 />} />
          <Route path="/asg-34" element={<ASG_34 />} />
          <Route path="/asg-35" element={<ASG_35 />} />
          <Route path="/asg-36" element={<ASG_36 />} />
          <Route path="/asg-37" element={<ASG_37 />} />
          <Route path="/asg-38" element={<ASG_38 />} />
        </Routes>
      </HashRouter>
    </Provider>
  </StrictMode>
);
