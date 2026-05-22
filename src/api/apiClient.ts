import axios from 'axios';
import type { JobItem, RoadmapStep } from '../types';

const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error.response?.data?.message ?? error.message);
  }
);

type ApiPost = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

export async function fetchCareerOverview() {
  const response = await api.get<ApiPost[]>('/posts?_limit=3');
  
  const jobs: JobItem[] = response.data.map((item) => ({
    id: item.id,
    title: item.title.substring(0, 24),
    company: `Tech ${item.userId}`,
    location: 'Remote',
    status: item.userId % 2 === 0 ? 'Applied' : 'Interviewing',
    salary: '$110k - $125k',
    dateApplied: '2026-05-15',
    notes: item.body.substring(0, 100)
  }));

  const roadmap: RoadmapStep[] = [
    { 
      id: 'roadmap-1', 
      title: 'Resume polish & Impact', 
      focus: 'Highlight AI and MERN project results using numbers.', 
      due: '3 days',
      status: 'completed',
      lessonContent: 'Google\'s X-Y-Z formula is the gold standard: "Accomplished [X], as measured by [Y], by doing [Z]". Always start with strong action verbs and specify key metrics.',
      quiz: {
        question: 'Which of the following represents a strong, results-oriented X-Y-Z resume bullet point?',
        options: [
          'Responsible for coding the backend in Node.js.',
          'Helped build a fast user interface using React and improved speeds.',
          'Optimized database queries by implementing indexing, reducing API response times by 32% as verified in Datadog.',
          'Wrote robust code and worked with a team.'
        ],
        correctIndex: 2,
        explanation: 'Option 3 details the action, the measurable impact (32%), and the verification tool (Datadog).'
      }
    },
    { 
      id: 'roadmap-2', 
      title: 'Behavioral & STAR storytelling', 
      focus: 'Practice system design and STAR behavioral templates.', 
      due: '1 week',
      status: 'active',
      lessonContent: 'The STAR method stands for Situation, Task, Action, and Result. Make sure to allocate enough time to your personal Action.',
      quiz: {
        question: 'In the STAR interview methodology, where should you spend the largest proportion of your talking time?',
        options: [
          'Situation: Explaining the context.',
          'Action: Explicitly describing the code you wrote and decisions you personally spearheaded.',
          'Task: Listing the responsibilities.',
          'Result: Repeating the summary.'
        ],
        correctIndex: 1,
        explanation: 'The Action section is the core value where you demonstrate your engineering ability.'
      }
    },
    { 
      id: 'roadmap-3', 
      title: 'Advanced JavaScript & UI Architectures', 
      focus: 'Master Event Loop, closures, debounce, and custom hooks.', 
      due: '2 weeks',
      status: 'locked',
      lessonContent: 'Microtasks run before macrotasks in the event loop. Debouncing delays invocation until quiet time is reached.',
      quiz: {
        question: 'What is the correct order of execution in the JavaScript Event Loop?',
        options: [
          'setTimeout -> Promise microtask -> Synchronous script',
          'Synchronous script -> Promise microtask -> setTimeout macrotask',
          'Promise microtask -> Synchronous script -> setTimeout',
          'Synchronous script -> setTimeout -> Promise microtask'
        ],
        correctIndex: 1,
        explanation: 'Synchronous script -> microtasks queue -> macrotasks queue (setTimeout).'
      }
    }
  ];

  return {
    resumeScore: 86,
    interviewConfidence: 'Rising',
    nextAction: 'Add measurable impact statements to your resume using the X-Y-Z formula',
    jobs,
    roadmap,
    skillGaps: ['System design fundamentals', 'Advanced JavaScript event loop', 'SQL query tuning']
  };
}
