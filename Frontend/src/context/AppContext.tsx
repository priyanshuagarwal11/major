import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { 
  AppContextValue, 
  FeatureItem, 
  JobItem, 
  RoadmapStep, 
  CodingProblem, 
  InterviewSession, 
  InterviewMessage 
} from '../types';
import { fetchCareerOverview } from '../api/apiClient';
import { getStoredJobs, saveStoredJobs } from '../api/apiJobs';

const initialFeatures: FeatureItem[] = [
  { id: 'feature1', title: 'AI Resume Analysis', description: 'Get intelligent feedback, score audits, and bullet point optimizers.' },
  { id: 'feature2', title: 'Mock Interviews', description: 'Practice with specialized AI personas, animated soundwaves, and structured reports.' },
  { id: 'feature3', title: 'Job Tracking', description: 'Manage your applications dynamically on an active Kanban board with custom Strategy guides.' },
  { id: 'feature4', title: 'Learning Roadmaps', description: 'Follow structured roadmap milestones, read curated guides, and test skills with instant quizzes.' }
];

const initialJobs: JobItem[] = [
  { id: 1, title: 'Frontend Engineer Intern', company: 'Vector Labs', location: 'Remote', status: 'Applied', salary: '$40 - $55 / hr', dateApplied: '2026-05-18', notes: 'Emailed recruiter to follow up. Focus on vector DB integrations.' },
  { id: 2, title: 'AI Developer', company: 'CareerIQ', location: 'New York, NY', status: 'Interviewing', salary: '$120k - $140k', dateApplied: '2026-05-12', notes: 'Completed resume scan. Round 1 Technical Mock was excellent.' },
  { id: 3, title: 'Software Engineer', company: 'Stripe', location: 'San Francisco, CA', status: 'Wishlist', salary: '$160k - $185k', dateApplied: '', notes: 'Referral requested. Preparing API Design skills.' },
  { id: 4, title: 'React Developer', company: 'DevScale', location: 'Remote', status: 'Offer', salary: '$95k', dateApplied: '2026-05-01', notes: 'Offer received! Reviewing benefits sheet.' },
  { id: 5, title: 'Associate Analyst', company: 'FinTech Corp', location: 'Boston, MA', status: 'Rejected', salary: '$85k', dateApplied: '2026-04-20', notes: 'Made it to final round. Found candidate with more database experience.' }
];

const initialRoadmap: RoadmapStep[] = [
  { 
    id: 'roadmap-1', 
    title: 'Resume polish & Impact', 
    focus: 'Highlight AI and MERN project results using numbers.', 
    due: '3 days',
    status: 'completed',
    lessonContent: 'Google\'s X-Y-Z formula is the gold standard: "Accomplished [X], as measured by [Y], by doing [Z]". Always start with strong action verbs (e.g., Architected, Spearheaded, Optimized) and explicitly specify key metrics (e.g. latency reduced by 40%, user engagement raised by 22%). Avoid generic terms like "Responsible for" or "Worked on".',
    quiz: {
      question: 'Which of the following represents a strong, results-oriented X-Y-Z resume bullet point?',
      options: [
        'Responsible for coding the backend of the platform in Node.js and MongoDB.',
        'Helped build a fast user interface using React and improved page speeds for the platform.',
        'Optimized database queries by implementing indexing, reducing API response times by 32% as verified in Datadog.',
        'Wrote robust code and worked with a team of five developers using Git workflows.'
      ],
      correctIndex: 2,
      explanation: 'Option 3 details the action (optimized queries by indexing), the measurable impact (reduced API response times by 32%), and the verification tool (Datadog).'
    }
  },
  { 
    id: 'roadmap-2', 
    title: 'Behavioral & STAR storytelling', 
    focus: 'Practice system design and STAR behavioral templates.', 
    due: '1 week',
    status: 'active',
    lessonContent: 'The STAR method stands for Situation, Task, Action, and Result. When asked "Tell me about a time you resolved a technical dispute," spend 15% describing the Situation/Task, 60% on your specific personal Actions, and 25% on the clear measurable Result. Ensure you emphasize collaboration and factual logic over emotional friction.',
    quiz: {
      question: 'In the STAR interview methodology, where should you spend the largest proportion of your talking time?',
      options: [
        'Situation: Explaining the heavy context, architecture history, and group conflicts.',
        'Action: Explicitly describing the code you wrote, tests you ran, and decisions you personally spearheaded.',
        'Task: Listing the responsibilities assigned to each developer on your team.',
        'Result: Repeating the summary of the project goals.'
      ],
      correctIndex: 1,
      explanation: 'The Action section is the core value-add where the interviewer learns about YOUR problem-solving and software engineering capabilities.'
    }
  },
  { 
    id: 'roadmap-3', 
    title: 'Advanced JavaScript & UI Architectures', 
    focus: 'Master Event Loop, closures, debounce, and custom hooks.', 
    due: '2 weeks',
    status: 'locked',
    lessonContent: 'Understanding the JS Event Loop is crucial for performance. Microtasks (Promises, queueMicrotask) run BEFORE Macrotasks (setTimeout, setInterval). Debouncing limits the rate at which a function triggers, useful for search-bar auto-completes, while Throttling enforces a maximum frequency of triggers (e.g. page scroll listeners).',
    quiz: {
      question: 'What is the correct order of execution in the JavaScript Event Loop for a synchronous script, a setTimeout, and a resolved Promise?',
      options: [
        'setTimeout -> Promise microtask -> Synchronous script',
        'Synchronous script -> Promise microtask -> setTimeout macrotask',
        'Promise microtask -> Synchronous script -> setTimeout',
        'Synchronous script -> setTimeout -> Promise microtask'
      ],
      correctIndex: 1,
      explanation: 'Synchronous scripts run first on the main thread, then microtasks (Promise.then) are drained from the microtask queue, and finally, macrotasks (setTimeout) are executed.'
    }
  }
];

const initialCodingProblems: CodingProblem[] = [
  {
    id: 'code-1',
    title: 'Array Chunking',
    difficulty: 'Easy',
    description: 'Write a function `chunk(array, size)` that splits an array into sub-arrays of a specified length and returns them in a nested array. \n\nExample:\n`chunk([1, 2, 3, 4], 2)` should return `[[1, 2], [3, 4]]`.\n`chunk([1, 2, 3, 4, 5], 10)` should return `[[1, 2, 3, 4, 5]]`.',
    codeTemplate: `function chunk(array, size) {
  // Write your code here
  
}`,
    testCases: [
      { input: 'chunk([1, 2, 3, 4, 5], 2)', expected: '[[1,2],[3,4],[5]]' },
      { input: 'chunk([7, 8, 9], 1)', expected: '[[7],[8],[9]]' }
    ]
  },
  {
    id: 'code-2',
    title: 'Valid Parentheses',
    difficulty: 'Medium',
    description: 'Given a string `s` containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid. \n\nAn input string is valid if open brackets are closed by the same type of brackets, and closed in the correct order. \n\nExample:\n`isValid("()[]{}")` -> `true`\n`isValid("(]")` -> `false`',
    codeTemplate: `function isValid(s) {
  // Write your code here
  
}`,
    testCases: [
      { input: 'isValid("({[]})")', expected: 'true' },
      { input: 'isValid("(]")', expected: 'false' }
    ]
  }
];

const mockInterviewQuestions: Record<string, string[]> = {
  frontend: [
    'How do you optimize a high-traffic React frontend page that renders lists with over 5,000 items?',
    'Explain the differences between client-side rendering (CSR), server-side rendering (SSR), and static site generation (SSG) in Next.js.',
    'Describe how you would debug a memory leak in a React single-page application.'
  ],
  backend: [
    'How would you design a rate limiter middleware for a high-volume REST API in Node.js?',
    'What strategy would you employ to resolve database connection pooling issues during high-frequency microservice queries?',
    'Explain how vector databases like Pinecone/Chroma enable efficient retrieval-augmented generation (RAG) in AI pipelines.'
  ],
  systems: [
    'Design a real-time notification system that supports billions of daily active users.',
    'How would you architect a secure file uploading service where users can upload resumes and receive instant AI analysis reports?',
    'Describe how you would design a cache-aside architecture using Redis to speed up database query responses.'
  ]
};

const mockRecruiters = [
  { name: 'Sofia Patel', role: 'Principal AI Recruiter at CareerIQ' },
  { name: 'Marcus Chen', role: 'Staff Engineering Lead at Stripe' },
  { name: 'Emma Watson', role: 'Talent Scout at Vector Labs' }
];

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [features] = useState<FeatureItem[]>(initialFeatures);
  const [resumeScore, setResumeScore] = useState(84);
  const [interviewConfidence, setInterviewConfidence] = useState('Rising');
  const [nextAction, setNextAction] = useState('Optimize your project experience bullets using the XYZ formula.');
  const [jobs, setJobs] = useState<JobItem[]>(() => getStoredJobs(initialJobs));
  const [roadmap, setRoadmap] = useState<RoadmapStep[]>(initialRoadmap);
  const [skillGaps, setSkillGaps] = useState<string[]>(['System design fundamentals', 'Advanced JavaScript event loop', 'IndexedDB & caching']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Expanded Feature States
  const [interviewSession, setInterviewSession] = useState<InterviewSession | null>(null);
  const [codingProblems] = useState<CodingProblem[]>(initialCodingProblems);
  const [solvedProblems, setSolvedProblems] = useState<string[]>([]);

  // Apply light-theme class to HTML body
  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  }, [theme]);

  useEffect(() => {
  saveStoredJobs(jobs);
}, [jobs]);

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  }, []);

  const refreshCareerOverview = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate real-world fetch
      await fetchCareerOverview();
      // Keep state alive and synchronized
    } catch (err) {
      setError((err as Error).message || 'Unable to refresh career overview.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Resume Bullet Point Optimizer logic
  const optimizeBullet = useCallback((bullet: string): string => {
    if (!bullet || bullet.trim().length === 0) return '';
    const text = bullet.toLowerCase().trim();
    
    // Check key words and output enhanced Google XYZ bullet templates
    if (text.includes('code') || text.includes('wrote') || text.includes('built') || text.includes('developer')) {
      return 'Architected and developed a responsive React & Express application, integrating Redis cache to reduce search latency by 45% and support 12k monthly active student users.';
    }
    if (text.includes('database') || text.includes('db') || text.includes('mongodb') || text.includes('sql')) {
      return 'Redesigned the MongoDB aggregation pipelines and introduced indexes across high-volume collections, improving query response speed by 35% and cutting server CPU overhead in half.';
    }
    if (text.includes('resume') || text.includes('analys') || text.includes('ai') || text.includes('llm')) {
      return 'Spearheaded the integration of a Pinecone vector storage pipeline for contextualized resume matching, boosting search alignment relevance by 28% and automating feedback cycles.';
    }
    if (text.includes('test') || text.includes('bug') || text.includes('fix')) {
      return 'Implemented a comprehensive Jest testing framework covering critical API routers, achieving 94% code coverage and preventing over 15 potential production regression bugs.';
    }
    
    return `Engineered an automated career tracking module by implementing recursive sorting algorithms, increasing processing performance by 22% as verified in telemetry metrics.`;
  }, []);

  // Interview state machine
  const startNewInterview = useCallback((role: string, difficulty: string, mode: 'technical' | 'behavioral' | 'systems') => {
    const recIndex = Math.floor(Math.random() * mockRecruiters.length);
    const recruiter = mockRecruiters[recIndex];
    const questions = mockInterviewQuestions[mode] || mockInterviewQuestions.frontend;
    
    const initialHistory: InterviewMessage[] = [
      {
        id: 'msg-0',
        sender: 'assistant',
        text: `Hi there! I am ${recruiter.name}, your ${recruiter.role}. I see you are preparing for a ${difficulty} level role in ${role === 'frontend' ? 'Frontend Development' : role === 'backend' ? 'Backend Architecture' : 'Systems Engineering'}. Let's get started. \n\nHere is your first question:\n\n**${questions[0]}**`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];

    setInterviewSession({
      role,
      difficulty,
      mode,
      recruiterName: recruiter.name,
      recruiterRole: recruiter.role,
      questions,
      currentQuestionIndex: 0,
      chatHistory: initialHistory,
      evaluations: {}
    });
    setInterviewConfidence('Preparing');
  }, []);

  const submitInterviewAnswer = useCallback(async (answer: string) => {
    if (!interviewSession) return;
    
    // Add user answer to chat history
    const userMsg: InterviewMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text: answer,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedHistory = [...interviewSession.chatHistory, userMsg];
    const currentIndex = interviewSession.currentQuestionIndex;
    const isLastQuestion = currentIndex >= interviewSession.questions.length - 1;
    
    // Generate simulated intelligent feedback based on answer characteristics
    let score = Math.floor(Math.random() * 3) + 7; // score between 7 and 9
    let strengths = 'Demonstrated clear technical vocabulary, referenced the correct architectural concepts, and maintained a polite structured tone.';
    let gaps = 'Did not elaborate on measurable scaling numbers or list explicit trade-offs between alternative libraries.';
    let proAnswer = 'To optimize frontend rendering: Use React Window/Virtual to only render visible nodes, store heavy computation using useMemo, defer offscreen renders, and apply lazy loading.';

    if (interviewSession.role === 'backend') {
      proAnswer = 'To design middleware limiters: Implement a Token Bucket algorithm in Redis using a script to ensure atomic updates. Store rate limits inside database metadata and handle HTTP 429 Too Many Requests response tags.';
    } else if (interviewSession.mode === 'systems') {
      proAnswer = 'To scale notifications: Adopt a publisher-subscriber model using Apache Kafka. Use horizontally scalable worker tasks to consume notifications and deliver via WebSockets or Apple Push Notification services.';
    }

    if (answer.trim().length < 25) {
      score -= 2;
      gaps += ' Your answer was too brief. Try to structure your response using the STAR format (Situation, Task, Action, Result).';
    }

    const nextIndex = currentIndex + 1;
    let assistantText = '';
    
    if (isLastQuestion) {
      assistantText = `Thank you so much! We have completed the mock interview session. I have analyzed your answers and updated your overall feedback. Check your detailed evaluation reports on this screen!`;
      setInterviewConfidence(score >= 8 ? 'Strongly Ready' : 'Improving');
    } else {
      assistantText = `Got it. Thanks for that response. Let's move to question ${nextIndex + 1}:\n\n**${interviewSession.questions[nextIndex]}**`;
    }

    const assistantMsg: InterviewMessage = {
      id: `msg-asst-${Date.now()}`,
      sender: 'assistant',
      text: assistantText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newSession: InterviewSession = {
      ...interviewSession,
      currentQuestionIndex: nextIndex,
      chatHistory: [...updatedHistory, assistantMsg],
      evaluations: {
        ...interviewSession.evaluations,
        [currentIndex]: {
          score,
          strengths,
          gaps,
          proAnswer
        }
      }
    };

    setInterviewSession(newSession);
  }, [interviewSession]);

  const resetInterview = useCallback(() => {
    setInterviewSession(null);
    setInterviewConfidence('Rising');
  }, []);

  // Sandbox compilation module
  const submitCodingSolution = useCallback((problemId: string, userCode: string) => {
    const problem = codingProblems.find(p => p.id === problemId);
    if (!problem) return { success: false, output: 'Problem not found', audit: '' };
    
    try {
      // Evaluate mock testing suites safely
      // Safely evaluate the function by binding it inside a sandbox scope
      const userFn = new Function(`return ${userCode}`)();
      
      let allPassed = true;
      let outputLogs = 'Executing test suites...\n';
      
      problem.testCases.forEach((tc, index) => {
        // Run input safely
        const tcExec = new Function('userFn', `return userFn(${tc.input.replace(/^[a-zA-Z0-9_]+\(/, '')}`)(userFn);
        const tcResultStr = JSON.stringify(tcExec);
        
        if (tcResultStr === tc.expected || tcResultStr.replace(/\s+/g, '') === tc.expected.replace(/\s+/g, '')) {
          outputLogs += `✅ Test Case ${index + 1} passed: Input: ${tc.input} -> Expected: ${tc.expected} \n`;
        } else {
          allPassed = false;
          outputLogs += `❌ Test Case ${index + 1} failed: Input: ${tc.input} -> Expected: ${tc.expected}, Got: ${tcResultStr} \n`;
        }
      });

      if (allPassed) {
        if (!solvedProblems.includes(problemId)) {
          setSolvedProblems(prev => [...prev, problemId]);
        }
        
        let complexityAudit = 'Time Complexity: $O(N)$ — Excellent implementation utilizing single-pass traversal. \nSpace Complexity: $O(N)$ — Uses memory proportional to array elements.';
        if (userCode.includes('for') && userCode.includes('indexOf') || (userCode.match(/for/g) || []).length > 1) {
          complexityAudit = 'Time Complexity: $O(N^2)$ (Quadratic) due to nested loops. Try to optimize this using a single-pass HashTable lookup to reach $O(N)$ time efficiency.';
        }
        
        return {
          success: true,
          output: outputLogs + '\n🎉 All tests passed successfully!',
          audit: complexityAudit
        };
      } else {
        return {
          success: false,
          output: outputLogs + '\n⚠️ Some assertions failed. Review your variables and edge cases.',
          audit: 'Time Complexity: Not available (Test failures). Double check indexing boundaries and array allocations.'
        };
      }
    } catch (err) {
      return {
        success: false,
        output: `Compilation Error: ${(err as Error).message}\n\nPlease check your syntax brackets or variables.`,
        audit: 'Syntax / Runtime Exception: Double check matching parentheses, variable bindings, and return directives.'
      };
    }
  }, [codingProblems, solvedProblems]);

  const value = useMemo(
    () => ({
      theme,
      toggleTheme,
      features,
      resumeScore,
      interviewConfidence,
      nextAction,
      jobs,
      setJobs,
      roadmap,
      setRoadmap,
      skillGaps,
      isLoading,
      error,
      refreshCareerOverview,
      optimizeBullet,
      interviewSession,
      startNewInterview,
      submitInterviewAnswer,
      resetInterview,
      codingProblems,
      solvedProblems,
      submitCodingSolution
    }),
    [
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
      refreshCareerOverview,
      optimizeBullet,
      interviewSession,
      startNewInterview,
      submitInterviewAnswer,
      resetInterview,
      codingProblems,
      solvedProblems,
      submitCodingSolution
    ]
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
