import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Routes, Route, HashRouter } from "react-router-dom"; // <-- Add Routes and Route
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

createRoot(document.getElementById("root")).render(
  <StrictMode>
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
        {/* <Route path="/asg-10" element={<ASG_10 />} />
        <Route path="/asg-11" element={<ASG_11 />} />
        <Route path="/asg-12" element={<ASG_12 />} /> */}
      </Routes>
    </HashRouter>
  </StrictMode>
);
