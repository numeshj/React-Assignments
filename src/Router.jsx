import { Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import ASG_31 from './assignments/ASG_31.jsx';
import ASG_32 from './assignments/ASG_32.jsx';
import ASG_33 from './assignments/ASG_33.jsx';

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/asg-31" element={<ASG_31 />} />
      <Route path="/asg-32" element={<ASG_32 />} />
      <Route path="/asg-33" element={<ASG_33 />} />
      {/* Add more routes as needed */}
    </Routes>
  );
}
