import React, { useState, useMemo } from 'react';
import { mockCourses } from '@/constants/courses';
import { tools, levels, trilhas } from '@/constants/fields'; // use os filtros do arquivo fields
import '@/styles/courses.css';
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination";
import { useNavigate } from "react-router-dom";

const COURSES_PER_PAGE = 9;

const Courses: React.FC = () => {
  const [tool, setTool] = useState('');
  const [level, setLevel] = useState('');
  const [trilha, setTrilha] = useState('');
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const filteredCourses = useMemo(() => {
    let courses = mockCourses;

    // Filtra por trilha se selecionada
    if (trilha) {
      courses = courses.filter(course => course.trilha === trilha);
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
          <option value="">Todas as Trilhas</option>
          {trilhas.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <select value={tool} onChange={e => setTool(e.target.value)}>
          <option value="">Todas as Ferramentas</option>
          {tools.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <select value={level} onChange={e => setLevel(e.target.value)}>
          <option value="">Todos os Níveis</option>
          {levels.map(l => (
            <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>
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
            <button
              className="course-rect-btn"
              onClick={() => navigate(`/courses/${course.id}`)}
            >
              Ir para o curso
            </button>
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