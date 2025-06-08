import React from 'react';
import TutorialMenu from '../components/Tutorial/TutorialMenu';
import TutorialProgress from '../components/Tutorial/TutorialProgress';
import TutorialContent from '../components/Tutorial/TutorialContent';
import '../styles/tutorial.css';
import { mockTutorials } from '@/constants/tutorials';

const Tutorials: React.FC = () => {
    return (
        <div className="tutorials-container">
            <TutorialMenu tutorials={mockTutorials} />
            <div className="tutorial-content">
                <TutorialProgress />
                <TutorialContent />
            </div>
        </div>
    );
};

export default Tutorials;