import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { AppContextValue, FeatureItem, JobItem, RoadmapStep } from '../types';
import { fetchCareerOverview } from '../api/apiClient';

const initialFeatures: FeatureItem[] = [
  { id: 'feature1', title: 'AI Resume Analysis', description: 'Get intelligent feedback and resume score insights.' },
  { id: 'feature2', title: 'Mock Interviews', description: 'Prepare with guided interview scenarios and confidence tracking.' },
  { id: 'feature3', title: 'Job Tracking', description: 'Manage applications, stages, and follow-ups in one place.' },
  { id: 'feature4', title: 'Learning Roadmaps', description: 'Follow a personalized path to close your skill gaps.' }
];

const initialJobs: JobItem[] = [
  { id: 1, title: 'Frontend Engineer Intern', company: 'Vector Labs', location: 'Remote', status: 'Applied' },
  { id: 2, title: 'AI Product Analyst', company: 'CareerIQ', location: 'New York, NY', status: 'In review' },
  { id: 3, title: 'Software Developer', company: 'NextGen Tech', location: 'San Francisco, CA', status: 'Interviewing' }
];

const initialRoadmap: RoadmapStep[] = [
  { id: 'roadmap-1', title: 'Resume polish', focus: 'Highlight AI and MERN project results', due: '3 days' },
  { id: 'roadmap-2', title: 'Interview prep', focus: 'Practice system design and behavioral questions', due: '1 week' },
  { id: 'roadmap-3', title: 'Job filter', focus: 'Add roles matching your skills', due: '2 weeks' }
];

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [features] = useState<FeatureItem[]>(initialFeatures);
  const [resumeScore, setResumeScore] = useState(84);
  const [interviewConfidence, setInterviewConfidence] = useState('Rising');
  const [nextAction, setNextAction] = useState('Refresh your resume with measurable achievements.');
  const [jobs, setJobs] = useState<JobItem[]>(initialJobs);
  const [roadmap, setRoadmap] = useState<RoadmapStep[]>(initialRoadmap);
  const [skillGaps, setSkillGaps] = useState<string[]>(['Advanced JavaScript', 'System design', 'Data visualization']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  }, []);

  const refreshCareerOverview = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const overview = await fetchCareerOverview();
      setResumeScore(overview.resumeScore);
      setInterviewConfidence(overview.interviewConfidence);
      setNextAction(overview.nextAction);
      setJobs(overview.jobs);
      setRoadmap(overview.roadmap);
      setSkillGaps(overview.skillGaps);
    } catch (err) {
      setError((err as Error).message || 'Unable to refresh career overview.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCareerOverview();
  }, [refreshCareerOverview]);

  const value = useMemo(
    () => ({
      theme,
      toggleTheme,
      features,
      resumeScore,
      interviewConfidence,
      nextAction,
      jobs,
      roadmap,
      skillGaps,
      isLoading,
      error,
      refreshCareerOverview
    }),
    [theme, toggleTheme, features, resumeScore, interviewConfidence, nextAction, jobs, roadmap, skillGaps, isLoading, error, refreshCareerOverview]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used inside AppProvider');
  }
  return context;
}
