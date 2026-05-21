export interface FeatureItem {
  id: string;
  title: string;
  description: string;
}

export interface JobItem {
  id: number;
  title: string;
  company: string;
  location: string;
  status: string;
}

export interface RoadmapStep {
  id: string;
  title: string;
  focus: string;
  due: string;
}

export interface AppContextValue {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  features: FeatureItem[];
  resumeScore: number;
  interviewConfidence: string;
  nextAction: string;
  jobs: JobItem[];
  roadmap: RoadmapStep[];
  skillGaps: string[];
  isLoading: boolean;
  error: string | null;
  refreshCareerOverview: () => Promise<void>;
}
