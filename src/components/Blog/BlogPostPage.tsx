import React from "react";
import { useParams } from "react-router-dom";
import { mockPosts } from "@/constants/blog";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

const PLACEHOLDER_IMAGE = "https://placehold.co/600x300?text=Blog+Post";

export default function BlogPostPage() {
  const { id } = useParams<{ id: string }>();
  const post = mockPosts.find(p => String(p.id) === id);

  if (!post) {
    return <div className="p-8 text-center text-red-500">Artigo não encontrado.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-2">
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <div className="mb-4 flex flex-wrap gap-2 items-center">
        {post.tags && post.tags.map((tag: string) => (
          <span key={tag} className="px-2 py-1 bg-gray-200 rounded text-xs">{tag}</span>
        ))}
        <span className="text-xs text-gray-400">{post.date}</span>
      </div>
      <div className="mb-6">
        <img
          src={post.image?.trim() ? post.image : PLACEHOLDER_IMAGE}
          alt="Imagem do post"
          style={{ maxWidth: 600, maxHeight: 300, borderRadius: 8, border: "1px solid #eee", width: "100%", objectFit: "cover" }}
          onError={e => (e.currentTarget.src = PLACEHOLDER_IMAGE)}
        />
      </div>
      <article className="prose max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mt-8 mb-4" {...props} />,
            h2: ({ node, ...props }) => <h2 className="text-2xl font-semibold mt-6 mb-3" {...props} />,
            h3: ({ node, ...props }) => <h3 className="text-xl font-semibold mt-4 mb-2" {...props} />,
            ul: ({ node, ...props }) => <ul className="list-disc ml-6 mb-3" {...props} />,
            ol: ({ node, ...props }) => <ol className="list-decimal ml-6 mb-3" {...props} />,
            li: ({ node, ...props }) => <li className="mb-1" {...props} />,
            img: ({ node, ...props }) => (
              <img
                {...props}
                className="my-4 rounded shadow max-w-full"
                style={{ maxHeight: 350 }}
                alt={props.alt || ''}
                onError={e => (e.currentTarget.src = PLACEHOLDER_IMAGE)}
              />
            ),
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(props.className || '');
              return !inline ? (
                <SyntaxHighlighter
                  style={vscDarkPlus}
                  language={match ? match[1] : 'bash'}
                  PreTag="div"
                  customStyle={{ borderRadius: 8, margin: '16px 0', fontSize: 15, maxWidth: 650, overflowX: "auto" }}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className="bg-gray-200 px-1 rounded text-sm" {...props}>
                  {children}
                </code>
              );
            },
            blockquote: ({ node, ...props }) => (
              <blockquote className="border-l-4 border-blue-400 pl-4 italic text-gray-600 my-4" {...props} />
            ),
            p: ({ node, ...props }) => <p className="mb-3" {...props} />,
            a: ({ node, ...props }) => (
              <a className="text-blue-600 underline hover:text-blue-800" target="_blank" rel="noopener noreferrer" {...props} />
            ),
            table: ({ node, ...props }) => (
              <table className="border border-collapse my-4 w-full" {...props} />
            ),
            th: ({ node, ...props }) => (
              <th className="border px-2 py-1 bg-gray-100" {...props} />
            ),
            td: ({ node, ...props }) => (
              <td className="border px-2 py-1" {...props} />
            ),
          }}
        >
          {post.content}
        </ReactMarkdown>
      </article>
    </div>
  );
}