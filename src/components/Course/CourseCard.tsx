// import React from 'react';
// import '@/styles/coursecard.css';

// interface CourseCardProps {
//     title: string;
//     description: string;
//     difficulty: 'iniciante' | 'intermediário' | 'avançado';
//     onClick: () => void;
// }

// const CourseCard: React.FC<CourseCardProps> = ({ title, description, difficulty, onClick }) => {
//     return (
//         <div className="course-card" onClick={onClick}>
//             <h3 className="course-title">{title}</h3>
//             <p className="course-description">{description}</p>
//             <span className="course-difficulty">{difficulty}</span>
//         </div>
//     );
// };

// export default CourseCard;

////////////////////////////////////////////

// import React from 'react';

// type Course = {
//   id: number;
//   title: string;
//   description: string;
//   tool: string;
//   level: string;
// };

// type CourseCardProps = {
//   course: Course;
// };

// const CourseCard: React.FC<CourseCardProps> = ({ course }) => (
//   <div className="course-card">
//     <h3>{course.title}</h3>
//     <p>{course.description}</p>
//     <span>{course.tool} - {course.level}</span>
//   </div>
// );

// export default CourseCard;

import React from 'react';
import '@/styles/coursecard.css';

type Course = {
  id: number;
  title: string;
  description: string;
  tool: string;
  level: string;
};

type Props = {
  course: Course;
};

const CourseCard: React.FC<Props> = ({ course }) => (
  <div className="course-card">
    <h3>{course.title}</h3>
    <p>{course.description}</p>
    <div className="course-meta">
      <span>{course.tool}</span>
      <span className="dot">•</span>
      <span>{course.level.charAt(0).toUpperCase() + course.level.slice(1)}</span>
    </div>
  </div>
);

export default CourseCard;