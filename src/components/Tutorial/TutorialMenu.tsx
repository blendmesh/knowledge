import React from 'react';

type Tutorial = {
  id: number;
  title: string;
  description: string;
};

type TutorialMenuProps = {
  tutorials?: Tutorial[];
};

const TutorialMenu: React.FC<TutorialMenuProps> = ({ tutorials = [] }) => {
  if (tutorials.length === 0) {
    return <p>Nenhum tutorial disponível.</p>;
  }

  return (
    <ul>
      {tutorials.map((tutorial) => (
        <li key={tutorial.id}>
          <h4>{tutorial.title}</h4>
          <p>{tutorial.description}</p>
        </li>
      ))}
    </ul>
  );
};

export default TutorialMenu;