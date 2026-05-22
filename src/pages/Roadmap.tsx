import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import type { RoadmapStep } from '../types';

export default function Roadmap() {
  const { roadmap, setRoadmap } = useAppContext();
  
  // Track selected node to display study guides and quiz
  const [activeStepId, setActiveStepId] = useState<string | null>('roadmap-2');
  
  // Quiz active choice states
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<Record<string, boolean>>({});

  const handleStepClick = (stepId: string) => {
    setActiveStepId(stepId);
  };

  const handleOptionClick = (stepId: string, optionIdx: number) => {
    if (quizSubmitted[stepId]) return; // Block selecting after submission
    setSelectedOptionIndex((prev) => ({ ...prev, [stepId]: optionIdx }));
  };

  const handleQuizSubmit = (stepId: string) => {
    if (selectedOptionIndex[stepId] === undefined) return;
    setQuizSubmitted((prev) => ({ ...prev, [stepId]: true }));
    
    // If the quiz is solved correctly, mark next roadmap node active or current node complete!
    setRoadmap((prev) =>
      prev.map((step, index) => {
        if (step.id === stepId) {
          return { ...step, status: 'completed' };
        }
        // Unlock next node
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

  const activeStep = roadmap.find((s) => s.id === activeStepId) || roadmap[0];

  return (
    <section style={{ animation: 'fadeIn 0.4s ease-out' }}>
      {/* Page Header */}
      <div className="page-intro">
        <span className="status-badge primary" style={{ marginBottom: '12px' }}>Personalized Curriculums</span>
        <h1>Learning Milestones</h1>
        <p>
          Follow customized study tracks built by AI to target your detected skill gaps. Complete lessons and ace quick quizzes to unlock advanced challenges.
        </p>
      </div>

      <div className="dashboard-grid">
        {/* Connected Roadmap Timeline */}
        <div className="dashboard-card col-5" style={{ background: 'rgba(16, 23, 38, 0.2)' }}>
          <div className="card-title">
            <span>🗺️ Core Syllabus Roadmap</span>
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
                    {step.status === 'completed' ? '✓' : 
                     step.status === 'active' ? '⚡' : '🔒'}
                  </div>
                  
                  <div 
                    className="roadmap-card-inner" 
                    style={{ 
                      borderLeft: isSelected ? '4px solid var(--primary)' : '1px solid var(--border)',
                      background: isSelected ? 'var(--surface-alt)' : 'var(--surface)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span className={`status-badge ${
                        step.status === 'completed' ? 'success' : 
                        step.status === 'active' ? 'primary' : ''
                      }`}>
                        {step.status}
                      </span>
                      <small style={{ color: 'var(--text-secondary)' }}>Due: {step.due}</small>
                    </div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: isSelected ? '#fff' : 'var(--text)' }}>
                      {step.title}
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: '1.4' }}>
                      {step.focus}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Study Portal & Interactive Quiz details */}
        <div className="col-7" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {activeStep && (
            <>
              {/* Lecture Guide Card */}
              <div className="dashboard-card" style={{ borderLeft: '4px solid var(--primary)' }}>
                <div className="card-title" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>📖 AI Study Lecture</span>
                  <span className="status-badge primary" style={{ textTransform: 'capitalize' }}>Milestone Lesson</span>
                </div>
                
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '12px 0 8px' }}>
                  {activeStep.title}
                </h3>
                <p style={{ fontSize: '0.95rem', color: 'var(--text)', lineHeight: '1.7', whiteSpace: 'pre-wrap', background: 'var(--surface-alt)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border)' }}>
                  {activeStep.lessonContent}
                </p>
              </div>

              {/* Quiz Card */}
              <div className="dashboard-card" style={{ borderLeft: '4px solid var(--secondary)' }}>
                <div className="card-title">
                  <span>⚡ Quick Skill Check Quiz</span>
                </div>

                <div style={{ marginTop: '12px' }}>
                  <p style={{ fontSize: '0.95rem', fontWeight: 700, lineHeight: '1.5', color: 'var(--text)', marginBottom: '16px' }}>
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
                          key={idx}
                          className={`quiz-option ${optionClass}`}
                          onClick={() => handleOptionClick(activeStep.id, idx)}
                          disabled={isSubmitted}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
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
                            
                            {isSubmitted && isCorrect && <span style={{ color: 'var(--accent)' }}>✓ Correct</span>}
                            {isSubmitted && isSelected && !isCorrect && <span style={{ color: 'var(--danger)' }}>✗ Incorrect</span>}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Submission and Explanatory feedback logs */}
                  <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {!quizSubmitted[activeStep.id] ? (
                      <button 
                        type="button" 
                        className="btn-primary" 
                        style={{ alignSelf: 'flex-start' }}
                        disabled={selectedOptionIndex[activeStep.id] === undefined}
                        onClick={() => handleQuizSubmit(activeStep.id)}
                      >
                        Submit Answer 📤
                      </button>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div 
                          style={{ 
                            background: selectedOptionIndex[activeStep.id] === activeStep.quiz.correctIndex 
                              ? 'rgba(16, 185, 129, 0.04)' 
                              : 'rgba(239, 68, 68, 0.04)',
                            border: selectedOptionIndex[activeStep.id] === activeStep.quiz.correctIndex
                              ? '1px solid rgba(16, 185, 129, 0.2)'
                              : '1px solid rgba(239, 68, 68, 0.2)',
                            padding: '16px',
                            borderRadius: '10px'
                          }}
                        >
                          <h5 style={{ 
                            fontSize: '0.9rem', 
                            fontWeight: 700, 
                            color: selectedOptionIndex[activeStep.id] === activeStep.quiz.correctIndex ? 'var(--accent-light)' : 'var(--danger)',
                            marginBottom: '6px' 
                          }}>
                            {selectedOptionIndex[activeStep.id] === activeStep.quiz.correctIndex 
                              ? '🎉 Excellent Job! That is Correct.' 
                              : '⚠️ That was incorrect. Let\'s learn why:'}
                          </h5>
                          <p style={{ fontSize: '0.85rem', lineHeight: '1.5', margin: 0, color: 'var(--text)' }}>
                            {activeStep.quiz.explanation}
                          </p>
                        </div>

                        <button 
                          type="button" 
                          className="btn-secondary" 
                          style={{ alignSelf: 'flex-start', fontSize: '0.8rem' }}
                          onClick={() => handleQuizReset(activeStep.id)}
                        >
                          🔄 Retry Question
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
