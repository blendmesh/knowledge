import React from 'react';

interface BlogPostProps {
    title: string;
    content: string;
    author: string;
    date: string;
}

const BlogPost: React.FC<BlogPostProps> = ({ title, content, author, date }) => {
    return (
        <div className="blog-post">
            <h2>{title}</h2>
            <p className="blog-post-meta">
                {date} by {author}
            </p>
            <div className="blog-post-content">
                <p>{content}</p>
            </div>
        </div>
    );
};

export default BlogPost;