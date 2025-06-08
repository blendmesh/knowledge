import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/tutorial.css';
import { mockTutorials } from '@/constants/tutorials';
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination";

const TUTORIALS_PER_PAGE = 9;

const tools = [
  { value: '', label: 'Todas as Ferramentas' },
  ...Array.from(new Set(mockTutorials.map(t => t.tool)))
    .filter(Boolean)
    .map(tool => ({ value: tool, label: tool })),
];

const sortOptions = [
  { value: 'desc', label: 'Mais recentes' },
  { value: 'asc', label: 'Mais antigos' },
];

const Tutorials: React.FC = () => {
  const [tool, setTool] = useState('');
  const [sort, setSort] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  // Filtragem e ordenação
  const filteredTutorials = useMemo(() => {
    let tutorials = mockTutorials;
    if (tool) {
      tutorials = tutorials.filter(t => (t.tool || '').toLowerCase() === tool.toLowerCase());
    }
    tutorials = tutorials
      .slice()
      .sort((a, b) => {
        if (!a.date || !b.date) return 0;
        return sort === 'desc'
          ? new Date(b.date).getTime() - new Date(a.date).getTime()
          : new Date(a.date).getTime() - new Date(b.date).getTime();
      });
    return tutorials;
  }, [tool, sort]);

  // Paginação
  const pageCount = Math.ceil(filteredTutorials.length / TUTORIALS_PER_PAGE);

  const paginatedTutorials = useMemo(() => {
    const start = (page - 1) * TUTORIALS_PER_PAGE;
    return filteredTutorials.slice(start, start + TUTORIALS_PER_PAGE);
  }, [filteredTutorials, page]);

  // Resetar para página 1 ao filtrar/ordenar
  React.useEffect(() => {
    setPage(1);
  }, [tool, sort]);

  return (
    <div className="tutorials-container w-full max-w-4xl mx-auto">
      <h1>Tutoriais</h1>
      <div className="tutorials-controls" style={{ marginBottom: 24, display: 'flex', gap: 16 }}>
        <select value={tool} onChange={e => setTool(e.target.value)}>
          {tools.map(t => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
        <select value={sort} onChange={e => setSort(e.target.value as 'asc' | 'desc')}>
          {sortOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      <div className="tutorials-grid">
        {paginatedTutorials.map(tutorial => (
          <div className="tutorial-card" key={tutorial.id}>
            <div className="tutorial-title">{tutorial.title}</div>
            <div className="tutorial-desc">{tutorial.description}</div>
            <div className="tutorial-tags" style={{ margin: '8px 0' }}>
              {tutorial.tags && tutorial.tags.map((tag: string) => (
                <span className="tutorial-tag" key={tag}>{tag}</span>
              ))}
            </div>
            <div className="tutorial-meta">
              <span className="tutorial-tool">{tutorial.tool}</span>
              {tutorial.level && (
                <>
                  <span className="dot">•</span>
                  <span className="tutorial-level">{tutorial.level.charAt(0).toUpperCase() + tutorial.level.slice(1)}</span>
                </>
              )}
              {tutorial.date && (
                <>
                  <span className="dot">•</span>
                  <span className="tutorial-date">{new Date(tutorial.date).toLocaleDateString()}</span>
                </>
              )}
            </div>
            <button
              className="tutorial-link"
              onClick={() => navigate(`/tutorials/${tutorial.id}`)}
            >
              Ver tutorial
            </button>
          </div>
        ))}
      </div>
      {filteredTutorials.length === 0 && <p>Nenhum tutorial encontrado.</p>}

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

export default Tutorials;