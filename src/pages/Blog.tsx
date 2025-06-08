import React, { useState, useMemo } from 'react';
import { mockPosts } from '@/constants/blog';
import '@/styles/blog.css';
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination";

const POSTS_PER_PAGE = 10;

const Blog: React.FC = () => {
  const [page, setPage] = useState(1);

  const pageCount = Math.ceil(mockPosts.length / POSTS_PER_PAGE);

  const paginatedPosts = useMemo(() => {
    const start = (page - 1) * POSTS_PER_PAGE;
    return mockPosts.slice(start, start + POSTS_PER_PAGE);
  }, [page]);

  return (
    <div className="blog-page">
      <h1>Artigos</h1>
      <div className="blog-list-vertical">
        {paginatedPosts.map(post => (
          <div className="blog-article-row" key={post.id}>
            <div className="blog-article-img">
              <img src={post.image} alt={post.title} />
            </div>
            <div className="blog-article-content">
              <h2 className="blog-article-title">{post.title}</h2>
              <div className="blog-article-summary">{post.content.slice(0, 180)}...</div>
              <div className="blog-article-tags-date">
                <div className="blog-article-tags">
                  {post.tags.slice(0, 5).map(tag => (
                    <span className="blog-tag" key={tag}>{tag}</span>
                  ))}
                </div>
                <span className="blog-article-date">{new Date(post.date).toLocaleDateString()}</span>
              </div>
              <a className="blog-article-link" href={post.url}>Ler artigo completo</a>
            </div>
          </div>
        ))}
      </div>

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

export default Blog;