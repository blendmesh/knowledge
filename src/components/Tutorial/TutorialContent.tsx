import React from 'react';

interface TutorialContentProps {
    title: string;
    content: string;
}

const TutorialContent: React.FC<TutorialContentProps> = ({ title, content }) => {
    return (
        <div className="tutorial-content">
            <h1>{title}</h1>
            <div className="content" dangerouslySetInnerHTML={{ __html: content }} />
        </div>
    );
};

export default TutorialContent;