// import React from 'react';

// type BlogPost = {
//     id: number;
//     title: string;
//     summary: string;
//     date: string;
// };

// type BlogListProps = {
//     posts?: BlogPost[];
// };

// const BlogList: React.FC<BlogListProps> = ({ posts = [] }) => {
//     if (posts.length === 0) {
//         return <p>Nenhum artigo encontrado.</p>;
//     }

//     return (
//         <ul>
//             {posts.map((post) => (
//                 <li key={post.id}>
//                     <h3>{post.title}</h3>
//                     <p>{post.summary}</p>
//                     <small>{post.date}</small>
//                 </li>
//             ))}
//         </ul>
//     );
// };

// export default BlogList;

import React from 'react';

type BlogPost = {
  id: number;
  title: string;
  summary: string;
  date: string;
};

type BlogListProps = {
  posts?: BlogPost[];
};

const BlogList: React.FC<BlogListProps> = ({ posts = [] }) => (
  <div className="blog-list">
    {posts.length === 0 ? (
      <p>Nenhum artigo encontrado.</p>
    ) : (
      posts.map(post => (
        <div className="blog-card" key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.summary}</p>
          <span className="blog-date">{post.date}</span>
        </div>
      ))
    )}
  </div>
);

export default BlogList;