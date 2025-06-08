import React from 'react';
import { mockCourses } from '@/constants/courses';
import { mockPosts } from '@/constants/blog';
import '@/styles/home.css';
import '@/styles/blog.css';
import { CarouselDemo } from '@/components/Home/CarouselDemo';

const Home: React.FC = () => {
  // Últimos 5 cursos e artigos (ordem decrescente por id)
  const latestCourses = [...mockCourses].sort((a, b) => b.id - a.id).slice(0, 5);
  const latestPosts = [...mockPosts].sort((a, b) => b.id - a.id).slice(0, 5);

  return (
    <div className="home-page">
      <section className="home-section">
        <h2>Últimos Cursos</h2>
        <CarouselDemo items={latestCourses} className="carousel-courses" />
      </section>
      
      <section className="home-section">
        <h2>Últimos Artigos</h2>
        <div className="blog-list-vertical">
          {latestPosts.map(post => (
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
      </section>
    </div>
  );
};

export default Home;