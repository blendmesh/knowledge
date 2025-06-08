import React from 'react';

interface TutorialProgressProps {
    currentStep: number;
    totalSteps: number;
}

const TutorialProgress: React.FC<TutorialProgressProps> = ({ currentStep, totalSteps }) => {
    const progressPercentage = (currentStep / totalSteps) * 100;

    return (
        <div className="tutorial-progress">
            <div className="progress-bar" style={{ width: `${progressPercentage}%` }} />
            <div className="progress-text">
                {`Progresso: ${currentStep} de ${totalSteps} etapas`}
            </div>
        </div>
    );
};

export default TutorialProgress;