import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import About from '../pages/About';
import Dashboard from '../pages/Dashboard';
import Resume from '../pages/Resume';
import Interview from '../pages/Interview';
import Jobs from '../pages/Jobs';
import Roadmap from '../pages/Roadmap';
import Layout from '../components/Layout';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="career" element={<Dashboard />} />
        <Route path="resume" element={<Resume />} />
        <Route path="interview" element={<Interview />} />
        <Route path="jobs" element={<Jobs />} />
        <Route path="roadmap" element={<Roadmap />} />
        <Route path="about" element={<About />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
