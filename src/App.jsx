import "./App.css";
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();

  const buttons = Array.from({ length: 33 }, (_, i) => ({
    label: `ASG_${i + 1}`,
    path: `/asg-${i + 1}`,
  }));

  return (
    <div className="asg-btn-container">
      <h1>React Assignments</h1>
      <div className="asg-btn-grid">
        {buttons.map((btn) => (
          <button
            key={btn.label}
            className="asg-btn"
            onClick={() => navigate(btn.path)}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default App;
