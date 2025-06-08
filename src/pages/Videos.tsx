import React, { useState, useMemo } from 'react';
import { mockVideos } from '@/constants/videos';
import '@/styles/videos.css';
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination";

const VIDEOS_PER_PAGE = 10;

const tools = [
  { value: '', label: 'Todas' },
  { value: 'Terraform', label: 'Terraform' },
  { value: 'CloudFormation', label: 'CloudFormation' },
  { value: 'Ansible', label: 'Ansible' },
  { value: 'CLI', label: 'CLI' },
];

const sortOptions = [
  { value: 'desc', label: 'Mais recentes' },
  { value: 'asc', label: 'Mais antigos' },
];

const Videos: React.FC = () => {
  const [tool, setTool] = useState('');
  const [sort, setSort] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);

  // Filtragem e ordenação
  const filteredVideos = useMemo(() => {
    let videos = mockVideos;
    if (tool) {
      videos = videos.filter(v => (v.tool || '').toLowerCase() === tool.toLowerCase());
    }
    videos = videos
      .slice()
      .sort((a, b) => {
        if (!a.date || !b.date) return 0;
        return sort === 'desc'
          ? new Date(b.date).getTime() - new Date(a.date).getTime()
          : new Date(a.date).getTime() - new Date(b.date).getTime();
      });
    return videos;
  }, [tool, sort]);

  // Paginação
  const pageCount = Math.ceil(filteredVideos.length / VIDEOS_PER_PAGE);

  const paginatedVideos = useMemo(() => {
    const start = (page - 1) * VIDEOS_PER_PAGE;
    return filteredVideos.slice(start, start + VIDEOS_PER_PAGE);
  }, [filteredVideos, page]);

  // Resetar para página 1 ao filtrar/ordenar
  React.useEffect(() => {
    setPage(1);
  }, [tool, sort]);

  return (
    <div className="videos-page">
      <h1>Vídeos de Aprendizado</h1>
      <p>Aqui você encontrará uma seleção de vídeos relacionados às ferramentas Terraform, CloudFormation, Ansible, CLI, etc.</p>
      <div className="videos-controls">
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
      <div className="videos-grid-multi">
        {paginatedVideos.map(video => (
          <div className="video-card" key={video.id}>
            <a href={video.url} target="_blank" rel="noopener noreferrer">
              <div className="video-thumb">
                <img
                  src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                  alt={video.title}
                />
              </div>
              <div className="video-title">{video.title}</div>
              <div className="video-meta">
                <span>{video.tool || 'Outro'}</span>
                {video.date && (
                  <>
                    <span className="dot">•</span>
                    <span>{new Date(video.date).toLocaleDateString()}</span>
                  </>
                )}
              </div>
            </a>
          </div>
        ))}
      </div>
      {filteredVideos.length === 0 && <p>Nenhum vídeo encontrado.</p>}

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

export default Videos;