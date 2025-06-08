import React from 'react';
import { useParams } from 'react-router-dom';
import { mockTutorials } from '@/constants/tutorials';
import ReactMarkdown from 'react-markdown';
import '../styles/tutorial.css';

// Importa o pacote para destacar código (opcional, mas recomendado)
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const TutorialDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const tutorial = mockTutorials.find(t => String(t.id) === id);

  if (!tutorial) return <div className="w-full max-w-4xl mx-auto">Tutorial não encontrado.</div>;

  return (
    <div className="tutorial-detail w-full max-w-4xl mx-auto">
      <h1>{tutorial.title}</h1>
      <div className="tutorial-meta" style={{ marginBottom: 16 }}>
        <span className="tutorial-tool">{tutorial.tool}</span>
        <span className="dot">•</span>
        <span className="tutorial-level">{tutorial.level}</span>
        <span className="dot">•</span>
        <span className="tutorial-date">{new Date(tutorial.date).toLocaleDateString()}</span>
      </div>
      <div className="tutorial-tags" style={{ marginBottom: 16 }}>
        {tutorial.tags && tutorial.tags.map(tag => (
          <span className="tutorial-tag" key={tag}>{tag}</span>
        ))}
      </div>
      <div className="tutorial-markdown">
        <ReactMarkdown
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
              />
            ),
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline ? (
                <SyntaxHighlighter
                  style={vscDarkPlus}
                  language={match ? match[1] : 'bash'}
                  PreTag="div"
                  customStyle={{ borderRadius: 8, margin: '16px 0', fontSize: 15 }}
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
          }}
        >
          {tutorial.markdown}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default TutorialDetail;