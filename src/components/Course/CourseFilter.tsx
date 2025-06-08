import React from 'react';

type CourseFilterProps = {
    tool: string;
    level: string;
    onFilterChange: (filter: { tool: string; level: string }) => void;
};

const CourseFilter: React.FC<CourseFilterProps> = ({ tool, level, onFilterChange }) => {
    const handleToolChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        onFilterChange({ tool: event.target.value, level });
    };

    const handleLevelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        onFilterChange({ tool, level: event.target.value });
    };

    return (
        <div className="course-filter">
            <label htmlFor="tool-select">Tipo de Ferramenta:</label>
            <select id="tool-select" value={tool} onChange={handleToolChange}>
                <option value="">Todas</option>
                <option value="Terraform">Terraform</option>
                <option value="CloudFormation">CloudFormation</option>
            </select>

            <label htmlFor="level-select">Nível de Dificuldade:</label>
            <select id="level-select" value={level} onChange={handleLevelChange}>
                <option value="">Todos</option>
                <option value="iniciante">Iniciante</option>
                <option value="intermediario">Intermediário</option>
                <option value="avancado">Avançado</option>
            </select>
        </div>
    );
};

export default CourseFilter;