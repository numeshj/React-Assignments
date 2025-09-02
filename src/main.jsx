import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { Routes, Route, HashRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store.js";
import "./index.css";
import App from "./App.jsx";

// Auto-discover all assignment components (ASG_*.jsx)
const assignmentModules = import.meta.glob("./assignments/ASG_*.jsx"); // returns { path: () => import(...) }
const assignmentEntries = Object.entries(assignmentModules)
  .map(([path, loader]) => {
    const match = path.match(/ASG_(\d+)\.jsx$/);
    if (!match) return null;
    const num = parseInt(match[1], 10);
    return { num, Component: lazy(() => loader()) };
  })
  .filter(Boolean)
  .sort((a, b) => a.num - b.num);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <HashRouter>
      <Suspense fallback={<div style={{ color: "#fff", padding: 20 }}>Loading...</div>}>
        <Routes>
          <Route path="/" element={<App />} />
          {assignmentEntries.map(({ num, Component }) => (
            <Route key={num} path={`/asg-${num}`} element={<Component />} />
          ))}
          <Route path="*" element={<div style={{ padding: 40, color: "#fff" }}>Not Found</div>} />
        </Routes>
      </Suspense>
    </HashRouter>
  </Provider>
);
      