import React, { useState, useEffect } from 'react';
import { useLanguage } from './LanguageContext';

export default function Walkthrough() {
  const { t, speak, isReading } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = t.steps;
  const step = steps[currentStep];

  // Auto-read when step changes if reading is active
  useEffect(() => {
    if (isReading) {
      speak(`${step.title}. ${step.description}`);
    }
  }, [currentStep, t]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>{step.title}</h2>
        <span className="icon" role="img" aria-label="step icon">{step.icon}</span>
      </div>
      <p>{step.description}</p>
      
      <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
        <button 
          className="btn btn-secondary" 
          onClick={handlePrev} 
          disabled={currentStep === 0}
          style={{ opacity: currentStep === 0 ? 0.5 : 1 }}
        >
          {t.back}
        </button>
        <button 
          className="btn" 
          onClick={handleNext}
          disabled={currentStep === steps.length - 1}
          style={{ opacity: currentStep === steps.length - 1 ? 0.5 : 1 }}
        >
          {currentStep === steps.length - 1 ? t.finish : t.next}
        </button>
      </div>
      
      <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.9rem', color: '#666' }}>
        {t.stepOf.replace('{current}', currentStep + 1).replace('{total}', steps.length)}
      </div>
    </div>
  );
}
