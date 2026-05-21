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
    title: item.title,
    company: `Tech ${item.userId}`,
    location: 'Remote',
    status: item.userId % 2 === 0 ? 'Applied' : 'In review'
  }));

  const roadmap: RoadmapStep[] = [
    { id: 'roadmap-1', title: 'AI Resume Review', focus: 'Polish experience bullets', due: '3 days' },
    { id: 'roadmap-2', title: 'Behavioral Prep', focus: 'Practice STAR responses', due: '1 week' },
    { id: 'roadmap-3', title: 'Technical Practice', focus: 'Solve a coding challenge daily', due: '2 weeks' }
  ];

  return {
    resumeScore: 86,
    interviewConfidence: 'Rising',
    nextAction: 'Add measurable impact statements to your resume',
    jobs,
    roadmap,
    skillGaps: ['System design fundamentals', 'Advanced JavaScript', 'SQL query tuning']
  };
}
