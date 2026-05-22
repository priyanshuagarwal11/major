export type ResumeAnalysis = {
  fileName: string;
  atsScore: number;
  formattingScore: number;
  impactScore: number;
  completenessScore: number;
  extractedSkills: string[];
  missingSkills: string[];
  strengths: string[];
  improvements: string[];
};

export async function analyzeResume(file: File): Promise<ResumeAnalysis> {
  await new Promise((resolve) => setTimeout(resolve, 1200));

  const fileName = file.name.toLowerCase();

  const isPdf = fileName.endsWith('.pdf');
  const hasProjectKeyword = fileName.includes('project') || fileName.includes('portfolio');

  return {
    fileName: file.name,
    atsScore: hasProjectKeyword ? 88 : 82,
    formattingScore: isPdf ? 92 : 84,
    impactScore: hasProjectKeyword ? 78 : 70,
    completenessScore: 86,
    extractedSkills: ['React', 'JavaScript', 'Node.js', 'MongoDB', 'Git'],
    missingSkills: ['System Design', 'Redis', 'Docker', 'Testing'],
    strengths: [
      'Strong full-stack developer positioning with relevant MERN keywords.',
      'Projects section can become a strong recruiter signal.',
      'Technical skills are readable and ATS-friendly.'
    ],
    improvements: [
      'Add measurable impact numbers to project bullet points.',
      'Mention deployment, database optimization, and testing.',
      'Add GitHub, LinkedIn, and portfolio links clearly at the top.'
    ]
  };
}