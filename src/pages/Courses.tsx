import React, { useState, useMemo } from 'react';
import { mockCourses } from '@/constants/courses';
import '@/styles/courses.css';
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination";

// Exemplo de trilhas (agrupamentos de cursos)
const trilhas = [
  { value: '', label: 'Todas as Trilhas' },
  { value: 'terraform_basico', label: 'Terraform Básico', courses: [1, 6, 14, 18, 22, 26, 30, 34, 38] },
  { value: 'cloudformation_completo', label: 'CloudFormation Completo', courses: [2, 7, 11, 15, 19, 23, 27, 31, 35, 39] },
  { value: 'ansible_essencial', label: 'Ansible Essencial', courses: [4, 8, 12, 16, 20, 24, 28, 32, 36, 40] },
  { value: 'cli_devops', label: 'CLI para DevOps', courses: [5, 9, 13, 17, 21, 25, 29, 33, 37] },
];

const tools = [
  { value: '', label: 'Todas as Ferramentas' },
  { value: 'Terraform', label: 'Terraform' },
  { value: 'CloudFormation', label: 'CloudFormation' },
  { value: 'Ansible', label: 'Ansible' },
  { value: 'CLI', label: 'CLI' },
];

const levels = [
  { value: '', label: 'Todos os Níveis' },
  { value: 'iniciante', label: 'Iniciante' },
  { value: 'intermediario', label: 'Intermediário' },
  { value: 'avancado', label: 'Avançado' },
];

const COURSES_PER_PAGE = 9;

const Courses: React.FC = () => {
  const [tool, setTool] = useState('');
  const [level, setLevel] = useState('');
  const [trilha, setTrilha] = useState('');
  const [page, setPage] = useState(1);

  const filteredCourses = useMemo(() => {
    let courses = mockCourses;

    // Filtra por trilha se selecionada
    if (trilha) {
      const trilhaObj = trilhas.find(t => t.value === trilha);
      if (trilhaObj && trilhaObj.courses) {
        courses = courses.filter(course => trilhaObj.courses.includes(course.id));
      }
    }

    // Filtra por ferramenta
    if (tool) {
      courses = courses.filter(course => course.tool === tool);
    }

    // Filtra por nível
    if (level) {
      courses = courses.filter(course => course.level === level);
    }

    return courses;
  }, [tool, level, trilha]);

  const pageCount = Math.ceil(filteredCourses.length / COURSES_PER_PAGE);

  const paginatedCourses = useMemo(() => {
    const start = (page - 1) * COURSES_PER_PAGE;
    return filteredCourses.slice(start, start + COURSES_PER_PAGE);
  }, [filteredCourses, page]);

  // Reset para página 1 ao filtrar
  React.useEffect(() => {
    setPage(1);
  }, [tool, level, trilha]);

  return (
    <div className="courses-page">
      <h1>Cursos</h1>
      <div className="courses-controls">
        <select value={trilha} onChange={e => setTrilha(e.target.value)}>
          {trilhas.map(t => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
        <select value={tool} onChange={e => setTool(e.target.value)}>
          {tools.map(t => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
        <select value={level} onChange={e => setLevel(e.target.value)}>
          {levels.map(l => (
            <option key={l.value} value={l.value}>{l.label}</option>
          ))}
        </select>
      </div>
      <div className="courses-grid">
        {paginatedCourses.map(course => (
          <div className="course-rect-card" key={course.id}>
            <div className="course-rect-title">{course.title}</div>
            <div className="course-rect-desc">{course.description}</div>
            <div className="course-rect-meta">
              <span className="course-rect-tool">{course.tool}</span>
              <span className="dot">•</span>
              <span className="course-rect-level">{course.level.charAt(0).toUpperCase() + course.level.slice(1)}</span>
            </div>
            <button className="course-rect-btn">Ir para o curso</button>
          </div>
        ))}
      </div>
      {filteredCourses.length === 0 && <p>Nenhum curso encontrado.</p>}

      {/* Paginação */}
      {pageCount > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            {Array.from({ length: pageCount }).map((_, idx) => (
              <PaginationItem key={idx}>
                <PaginationLink
                  isActive={page === idx + 1}
                  onClick={() => setPage(idx + 1)}
                >
                  {idx + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default Courses;