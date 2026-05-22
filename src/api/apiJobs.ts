import type { JobItem } from '../types';

const JOBS_STORAGE_KEY = 'ai-career-jobs';

export function getStoredJobs(fallbackJobs: JobItem[]) {
  try {
    const savedJobs = localStorage.getItem(JOBS_STORAGE_KEY);

    if (!savedJobs) {
      return fallbackJobs;
    }

    const parsedJobs = JSON.parse(savedJobs);

    if (!Array.isArray(parsedJobs)) {
      return fallbackJobs;
    }

    return parsedJobs as JobItem[];
  } catch {
    return fallbackJobs;
  }
}

export function saveStoredJobs(jobs: JobItem[]) {
  localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(jobs));
}