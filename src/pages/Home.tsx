import { Link } from 'react-router-dom';
import FeatureCard from '../components/FeatureCard';
import { useAppContext } from '../context/AppContext';

export default function Home() {
  const { features, resumeScore, interviewConfidence, jobs, roadmap } = useAppContext();

  return (
    <section className="page-home">
      <div className="hero-panel">
        <div>
          <span className="eyebrow">AI Career Copilot</span>
          <h1>Accelerate your career with AI-driven guidance.</h1>
          <p>
            Resume analysis, mock interviews, skill gap detection, coding practice support, and job tracking — all in one career assistant.
          </p>
          <div className="hero-actions">
            <Link to="/career" className="primary-cta">
              Explore Career Hub
            </Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="card-hero">
            <h2>Career outcomes</h2>
            <p>Track your progress from resume polish to job offer readiness.</p>
            <ul>
              <li>Resume score: {resumeScore}%</li>
              <li>Interview confidence: {interviewConfidence}</li>
              <li>Saved jobs: {jobs.length}</li>
              <li>Roadmap steps: {roadmap.length}</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="feature-grid">
        {features.map((feature) => (
          <FeatureCard key={feature.id} {...feature} />
        ))}
      </div>
    </section>
  );
}
