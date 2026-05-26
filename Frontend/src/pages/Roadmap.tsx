import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import type { RoadmapStep } from '../types';

const targetLevels = ['Beginner', 'Intermediate', 'Job-ready', 'Advanced'];

export default function Roadmap() {
  const { roadmap, setRoadmap } = useAppContext();

  const [activeStepId, setActiveStepId] = useState<string | null>('roadmap-2');

  const [goal, setGoal] = useState('');
  const [duration, setDuration] = useState('6 months');
  const [currentSkills, setCurrentSkills] = useState('');
  const [targetLevel, setTargetLevel] = useState('Job-ready');
  const [isGenerating, setIsGenerating] = useState(false);

  const [selectedOptionIndex, setSelectedOptionIndex] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<Record<string, boolean>>({});

  const handleStepClick = (stepId: string) => {
    setActiveStepId(stepId);
  };

  const handleOptionClick = (stepId: string, optionIdx: number) => {
    if (quizSubmitted[stepId]) return;
    setSelectedOptionIndex((prev) => ({ ...prev, [stepId]: optionIdx }));
  };

  const handleQuizSubmit = (stepId: string) => {
    if (selectedOptionIndex[stepId] === undefined) return;

    setQuizSubmitted((prev) => ({ ...prev, [stepId]: true }));

    setRoadmap((prev) =>
      prev.map((step, index) => {
        if (step.id === stepId) {
          return { ...step, status: 'completed' };
        }

        if (index > 0 && prev[index - 1].id === stepId && step.status === 'locked') {
          return { ...step, status: 'active' };
        }

        return step;
      })
    );
  };

  const handleQuizReset = (stepId: string) => {
    setSelectedOptionIndex((prev) => {
      const copy = { ...prev };
      delete copy[stepId];
      return copy;
    });

    setQuizSubmitted((prev) => {
      const copy = { ...prev };
      delete copy[stepId];
      return copy;
    });
  };

  const buildGeneratedRoadmap = (): RoadmapStep[] => {
    const cleanGoal = goal.trim() || 'Full Stack Developer';
    const cleanDuration = duration.trim() || '6 months';
    const skills = currentSkills.trim() || 'HTML, CSS, JavaScript basics';

    return [
      {
        id: `custom-${Date.now()}-1`,
        title: `${cleanGoal} foundation sprint`,
        focus: `Strengthen fundamentals using your current skills: ${skills}.`,
        due: 'Week 1-2',
        status: 'active',
        lessonContent: `Start with the fundamentals required for ${cleanGoal}. Build a clear base in core concepts, tooling, and daily practice. Since your current skills are ${skills}, focus on filling the basics before moving into advanced projects. Target level: ${targetLevel}. Total timeline: ${cleanDuration}.`,
        quiz: {
          question: `What should be your first priority while starting a ${cleanGoal} roadmap?`,
          options: [
            'Jump directly into advanced projects without reviewing basics.',
            'Build strong fundamentals and identify missing concepts.',
            'Only watch videos without building anything.',
            'Apply to jobs before preparing a portfolio.'
          ],
          correctIndex: 1,
          explanation: 'A strong roadmap starts with fundamentals and gap detection before projects.'
        }
      },
      {
        id: `custom-${Date.now()}-2`,
        title: `${cleanGoal} project building phase`,
        focus: 'Create portfolio projects that prove practical skills.',
        due: 'Week 3-8',
        status: 'locked',
        lessonContent: `Build 2-3 portfolio projects related to ${cleanGoal}. Each project should include real-world data, clean UI, documentation, GitHub commits, and deployment. Add measurable outcomes to your resume, such as reduced loading time, automated workflow, or improved accuracy.`,
        quiz: {
          question: 'What makes a portfolio project stronger for placements?',
          options: [
            'Only a screenshot with no source code.',
            'A deployed project with GitHub code, README, and measurable features.',
            'A copied tutorial project with no changes.',
            'A project that cannot be explained in an interview.'
          ],
          correctIndex: 1,
          explanation: 'Recruiters value deployed, explainable projects with code and measurable product thinking.'
        }
      },
      {
        id: `custom-${Date.now()}-3`,
        title: `${cleanGoal} interview readiness`,
        focus: 'Prepare resume bullets, interview stories, and technical revision.',
        due: 'Final month',
        status: 'locked',
        lessonContent: `Convert your projects into resume bullets using the X-Y-Z formula. Practice technical questions, behavioral STAR answers, and project explanations. Prepare a 60-second pitch for why you are ready for ${cleanGoal} roles.`,
        quiz: {
          question: 'Which interview preparation habit is most effective?',
          options: [
            'Memorizing answers without understanding.',
            'Practicing project explanations with tradeoffs and metrics.',
            'Ignoring behavioral questions.',
            'Only reading theory without mock interviews.'
          ],
          correctIndex: 1,
          explanation: 'Strong candidates explain decisions, tradeoffs, metrics, and learning clearly.'
        }
      }
    ];
  };

  const handleGenerateRoadmap = (e: React.FormEvent) => {
    e.preventDefault();

    setIsGenerating(true);

    setTimeout(() => {
      const generatedRoadmap = buildGeneratedRoadmap();
      setRoadmap(generatedRoadmap);
      setActiveStepId(generatedRoadmap[0].id);
      setSelectedOptionIndex({});
      setQuizSubmitted({});
      setIsGenerating(false);
    }, 700);
  };

  const activeStep = roadmap.find((s) => s.id === activeStepId) || roadmap[0];

  return (
    <section style={{ animation: 'fadeIn 0.4s ease-out' }}>
      <div className="page-intro">
        <span className="status-badge primary" style={{ marginBottom: '12px' }}>
          Personalized Curriculums
        </span>
        <h1>Learning Milestones</h1>
        <p>
          Generate a custom career roadmap, follow AI-planned milestones, and complete quick
          quizzes to unlock your next preparation phase.
        </p>
      </div>

      <div className="dashboard-card col-12" style={{ marginBottom: '24px' }}>
        <div className="card-title">
          <span>AI Roadmap Generator</span>
        </div>

        <form onSubmit={handleGenerateRoadmap}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              gap: '16px'
            }}
          >
            <div className="form-group">
              <label>Career Goal</label>
              <input
                className="form-input"
                type="text"
                placeholder="e.g. Data Scientist, MERN Developer, AI Engineer"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Timeline</label>
              <input
                className="form-input"
                type="text"
                placeholder="e.g. 3 months, 6 months"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Current Skills</label>
              <input
                className="form-input"
                type="text"
                placeholder="e.g. HTML, CSS, JavaScript, React basics"
                value={currentSkills}
                onChange={(e) => setCurrentSkills(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Target Level</label>
              <select
                className="form-select"
                value={targetLevel}
                onChange={(e) => setTargetLevel(e.target.value)}
              >
                {targetLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={isGenerating}>
            {isGenerating ? 'Generating Roadmap...' : 'Generate Roadmap'}
          </button>
        </form>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card col-6" style={{ background: 'var(--surface)' }}>
          <div className="card-title">
            <span>Core Syllabus Roadmap</span>
          </div>

          <div className="roadmap-timeline" style={{ marginTop: '20px' }}>
            {roadmap.map((step) => {
              const isSelected = step.id === activeStepId;

              return (
                <div
                  key={step.id}
                  className={`roadmap-node ${step.status} ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleStepClick(step.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="roadmap-marker">
                    {step.status === 'completed' ? '✓' : step.status === 'active' ? '⚡' : '🔒'}
                  </div>

                  <div
                    className="roadmap-card-inner"
                    style={{
                      borderLeft: isSelected
                        ? '4px solid var(--primary)'
                        : '1px solid var(--border)',
                      background: isSelected ? 'var(--surface-alt)' : 'var(--surface)'
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '6px'
                      }}
                    >
                      <span
                        className={`status-badge ${
                          step.status === 'completed'
                            ? 'success'
                            : step.status === 'active'
                              ? 'primary'
                              : ''
                        }`}
                      >
                        {step.status}
                      </span>
                      <small style={{ color: 'var(--text-secondary)' }}>Due: {step.due}</small>
                    </div>

                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text)' }}>
                      {step.title}
                    </h4>

                    <p
                      style={{
                        fontSize: '0.8rem',
                        color: 'var(--text-secondary)',
                        marginTop: '4px',
                        lineHeight: '1.4'
                      }}
                    >
                      {step.focus}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="col-6" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {activeStep && (
            <>
              <div className="dashboard-card" style={{ borderLeft: '4px solid var(--primary)' }}>
                <div
                  className="card-title"
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <span>AI Study Lecture</span>
                  <span className="status-badge primary" style={{ textTransform: 'capitalize' }}>
                    Milestone Lesson
                  </span>
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '12px 0 8px' }}>
                  {activeStep.title}
                </h3>

                <p
                  style={{
                    fontSize: '0.95rem',
                    color: 'var(--text)',
                    lineHeight: '1.7',
                    whiteSpace: 'pre-wrap',
                    background: 'var(--surface-alt)',
                    padding: '16px',
                    borderRadius: '10px',
                    border: '1px solid var(--border)'
                  }}
                >
                  {activeStep.lessonContent}
                </p>
              </div>

              <div className="dashboard-card" style={{ borderLeft: '4px solid var(--secondary)' }}>
                <div className="card-title">
                  <span>Quick Skill Check Quiz</span>
                </div>

                <div style={{ marginTop: '12px' }}>
                  <p
                    style={{
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      lineHeight: '1.5',
                      color: 'var(--text)',
                      marginBottom: '16px'
                    }}
                  >
                    {activeStep.quiz.question}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {activeStep.quiz.options.map((option, idx) => {
                      const isSelected = selectedOptionIndex[activeStep.id] === idx;
                      const isSubmitted = quizSubmitted[activeStep.id];
                      const isCorrect = idx === activeStep.quiz.correctIndex;

                      let optionClass = '';
                      if (isSubmitted) {
                        if (isCorrect) optionClass = 'correct';
                        else if (isSelected) optionClass = 'incorrect';
                        else optionClass = 'disabled';
                      } else if (isSelected) {
                        optionClass = 'selected';
                      }

                      return (
                        <button
                          type="button"
                          key={option}
                          className={`quiz-option ${optionClass}`}
                          onClick={() => handleOptionClick(activeStep.id, idx)}
                          disabled={isSubmitted}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              width: '100%'
                            }}
                          >
                            <div
                              style={{
                                width: '22px',
                                height: '22px',
                                borderRadius: '50%',
                                border: '2px solid currentColor',
                                display: 'grid',
                                placeItems: 'center',
                                fontSize: '0.75rem',
                                fontWeight: 700
                              }}
                            >
                              {String.fromCharCode(65 + idx)}
                            </div>

                            <span style={{ fontSize: '0.88rem', flex: 1 }}>{option}</span>

                            {isSubmitted && isCorrect && (
                              <span style={{ color: 'var(--accent)' }}>✓ Correct</span>
                            )}
                            {isSubmitted && isSelected && !isCorrect && (
                              <span style={{ color: 'var(--danger)' }}>✗ Incorrect</span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div
                    style={{
                      marginTop: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px'
                    }}
                  >
                    {!quizSubmitted[activeStep.id] ? (
                      <button
                        type="button"
                        className="btn-primary"
                        style={{ alignSelf: 'flex-start' }}
                        disabled={selectedOptionIndex[activeStep.id] === undefined}
                        onClick={() => handleQuizSubmit(activeStep.id)}
                      >
                        Submit Answer
                      </button>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div
                          style={{
                            background:
                              selectedOptionIndex[activeStep.id] === activeStep.quiz.correctIndex
                                ? 'rgba(16, 185, 129, 0.04)'
                                : 'rgba(239, 68, 68, 0.04)',
                            border:
                              selectedOptionIndex[activeStep.id] === activeStep.quiz.correctIndex
                                ? '1px solid rgba(16, 185, 129, 0.2)'
                                : '1px solid rgba(239, 68, 68, 0.2)',
                            padding: '16px',
                            borderRadius: '10px'
                          }}
                        >
                          <h5
                            style={{
                              fontSize: '0.9rem',
                              fontWeight: 700,
                              color:
                                selectedOptionIndex[activeStep.id] === activeStep.quiz.correctIndex
                                  ? 'var(--accent-light)'
                                  : 'var(--danger)',
                              marginBottom: '6px'
                            }}
                          >
                            {selectedOptionIndex[activeStep.id] === activeStep.quiz.correctIndex
                              ? 'Excellent. That is correct.'
                              : 'That was incorrect. Learn why:'}
                          </h5>

                          <p
                            style={{
                              fontSize: '0.85rem',
                              lineHeight: '1.5',
                              margin: 0,
                              color: 'var(--text)'
                            }}
                          >
                            {activeStep.quiz.explanation}
                          </p>
                        </div>

                        <button
                          type="button"
                          className="btn-secondary"
                          style={{ alignSelf: 'flex-start', fontSize: '0.8rem' }}
                          onClick={() => handleQuizReset(activeStep.id)}
                        >
                          Retry Question
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}