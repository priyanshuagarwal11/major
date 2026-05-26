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
  status: 'Wishlist' | 'Applied' | 'Interviewing' | 'Offer' | 'Rejected';
  salary?: string;
  dateApplied?: string;
  notes?: string;
}

export interface QuizItem {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface RoadmapStep {
  id: string;
  title: string;
  focus: string;
  due: string;
  status: 'completed' | 'active' | 'locked';
  lessonContent: string;
  quiz: QuizItem;
}

export interface CodingProblem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  codeTemplate: string;
  testCases: { input: string; expected: string }[];
}

export interface InterviewMessage {
  id: string;
  sender: 'assistant' | 'user';
  text: string;
  timestamp: string;
}

export interface InterviewSession {
  role: string;
  difficulty: string;
  mode: 'technical' | 'behavioral' | 'systems';
  recruiterName: string;
  recruiterRole: string;
  questions: string[];
  currentQuestionIndex: number;
  chatHistory: InterviewMessage[];
  evaluations: Record<number, {
    score: number;
    strengths: string;
    gaps: string;
    proAnswer: string;
  }>;
}

export interface AppContextValue {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  features: FeatureItem[];
  resumeScore: number;
  interviewConfidence: string;
  nextAction: string;
  jobs: JobItem[];
  setJobs: React.Dispatch<React.SetStateAction<JobItem[]>>;
  roadmap: RoadmapStep[];
  setRoadmap: React.Dispatch<React.SetStateAction<RoadmapStep[]>>;
  skillGaps: string[];
  isLoading: boolean;
  error: string | null;
  refreshCareerOverview: () => Promise<void>;
  
  // Resume specific operations
  optimizeBullet: (bullet: string) => string;
  
  // Interview specific operations
  interviewSession: InterviewSession | null;
  startNewInterview: (role: string, difficulty: string, mode: 'technical' | 'behavioral' | 'systems') => void;
  submitInterviewAnswer: (answer: string) => Promise<void>;
  resetInterview: () => void;
  
  // Coding specific operations
  codingProblems: CodingProblem[];
  solvedProblems: string[];
  submitCodingSolution: (problemId: string, userCode: string) => { success: boolean; output: string; audit: string };
}
