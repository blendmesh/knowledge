import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { mockCourses } from "@/constants/courses";
import { mockTutorials } from "@/constants/tutorials";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import Quiz from "@/components/Quiz/Quiz";
import { mockQuizzes } from "@/constants/quizzes";

function getProgressKey(courseId: string) {
  return `course-progress-${courseId}`;
}

export default function Classroom() {
  const { id, tutorialId } = useParams<{ id: string; tutorialId?: string }>();
  const navigate = useNavigate();
  const course = mockCourses.find(c => String(c.id) === id);

  // Lista de tutoriais do curso na ordem
  const tutorials = course
    ? course.tutorials
      .map((tid: string) => mockTutorials.find(t => t.id === tid))
      .filter(Boolean)
    : [];

  // Tutorial atual
  const currentIdx = tutorials.findIndex(t => t?.id === tutorialId) || 0;
  const tutorial = tutorials[currentIdx] || tutorials[0];

  // Progresso salvo no localStorage
  const [progress, setProgress] = useState<string[]>([]);

  useEffect(() => {
    if (course) {
      const saved = localStorage.getItem(getProgressKey(course.id));
      setProgress(saved ? JSON.parse(saved) : []);
    }
  }, [course?.id]);

  // Marcar tutorial como concluído
  const handleCheck = (tid: string) => {
    if (!progress.includes(tid)) {
      const updated = [...progress, tid];
      setProgress(updated);
      if (course) {
        localStorage.setItem(getProgressKey(course.id), JSON.stringify(updated));
      }
    }
  };

  // Ir para o próximo tutorial
  const handleNext = () => {
    if (currentIdx < tutorials.length - 1) {
      navigate(`/classroom/${course.id}/${tutorials[currentIdx + 1]?.id}`);
    }
  };

  // Ir para tutorial selecionado na barra lateral
  const handleSelectTutorial = (tid: string) => {
    navigate(`/classroom/${course.id}/${tid}`);
  };

  if (!course || !tutorial) {
    return <div className="p-8 text-center text-red-500">Curso ou tutorial não encontrado.</div>;
  }

  // Impede acesso a tutoriais posteriores sem concluir os anteriores
  const canAccessTutorial = (idx: number) => {
    if (idx === 0) return true;
    // Só pode acessar se todos os anteriores estiverem no progresso
    return tutorials.slice(0, idx).every(t => progress.includes(t.id));
  };

  // Redireciona para página de conclusão do curso
  const handleFinishCourse = () => {
    navigate(`/classroom/${course.id}/concluido`);
  };

  const quiz = mockQuizzes.find(q => q.courseId === course?.id);

  // Estado para saber se o quiz foi concluído
  const [quizFinished, setQuizFinished] = useState(false);
  const [quizResult, setQuizResult] = useState<any>(null);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f7f7fa" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: 300,
          background: "#fff",
          borderRight: "1px solid #eee",
          padding: 24,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 18 }}>{course.title}</div>
        <div style={{ fontSize: 15, color: "#666", marginBottom: 24 }}>{course.description}</div>
        <div style={{ fontWeight: 600, marginBottom: 8 }}>Progresso</div>
        <div style={{ marginBottom: 24 }}>
          <progress
            value={progress.length}
            max={tutorials.length}
            style={{ width: "100%", height: 12, borderRadius: 8 }}
          />
          <div style={{ fontSize: 13, color: "#888", marginTop: 4 }}>
            {progress.length} de {tutorials.length} tutoriais concluídos
          </div>
        </div>
        <div style={{ fontWeight: 600, marginBottom: 8 }}>Tutoriais</div>
        <ol style={{ listStyle: "decimal", paddingLeft: 18, fontSize: 15, flex: 1, overflowY: "auto" }}>
          {tutorials.map((tut, idx) => (
            <li
              key={tut.id}
              style={{
                marginBottom: 10,
                cursor: canAccessTutorial(idx) ? "pointer" : "not-allowed",
                color: tut.id === tutorial.id ? "#2563eb" : progress.includes(tut.id) ? "#22c55e" : "#222",
                fontWeight: tut.id === tutorial.id ? 700 : 400,
                background: tut.id === tutorial.id ? "#e0e7ff" : "transparent",
                borderRadius: 6,
                padding: "4px 8px",
                display: "flex",
                alignItems: "center",
                opacity: canAccessTutorial(idx) ? 1 : 0.5,
                pointerEvents: canAccessTutorial(idx) ? "auto" : "none",
              }}
              onClick={() => canAccessTutorial(idx) && handleSelectTutorial(tut.id)}
            >
              <span style={{ flex: 1 }}>{tut.title}</span>
              {progress.includes(tut.id) && (
                <span title="Concluído" style={{ marginLeft: 8, color: "#22c55e", fontSize: 18 }}>✔</span>
              )}
            </li>
          ))}
        </ol>
      </aside>

      {/* Conteúdo do tutorial */}
      <main style={{ flex: 1, padding: "40px 0", display: "flex", justifyContent: "center" }}>
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 2px 12px #0001",
            padding: 32,
            maxWidth: 700,
            width: "100%",
            overflowWrap: "break-word",
            wordBreak: "break-word",
          }}
        >
          <h1 className="text-3xl font-bold mb-2">{tutorial.title}</h1>
          <div className="mb-6 text-gray-700">{tutorial.description}</div>
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
      />
    ),
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(props.className || '');
      if (!inline) {
        // Bloco de código (```), mostra linguagem no canto superior direito
        return (
          <div style={{ position: "relative", margin: "16px 0" }}>
            {match && (
              <span
                style={{
                  position: "absolute",
                  top: 8,
                  right: 18,
                  fontSize: 13,
                  color: "#bbb",
                  fontFamily: "monospace",
                  zIndex: 2,
                  background: "#222",
                  padding: "2px 8px",
                  borderRadius: 6,
                }}
              >
                {match[1]}
              </span>
            )}
            <SyntaxHighlighter
              style={vscDarkPlus}
              language={match ? match[1] : 'bash'}
              PreTag="div"
              customStyle={{
                borderRadius: 8,
                margin: 0,
                fontSize: 15,
                maxWidth: 650,
                overflowX: "auto",
                paddingTop: match ? 32 : 16,
              }}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          </div>
        );
      }
      // Code inline (`code`): exibe como negrito
      return (
        <strong
          style={{
            fontWeight: 700,
            background: "transparent",
            fontFamily: "inherit",
            fontSize: "inherit",
            color: "inherit",
            padding: 0,
            margin: 0,
            display: "inline",
          }}
          {...props}
        >
          {children}
        </strong>
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
  {tutorial.markdown}
</ReactMarkdown>

          {/* Quiz e mensagens finais */}
          {currentIdx === tutorials.length - 1 && progress.includes(tutorial.id) && quiz && !quizFinished && (
            <div style={{ marginTop: 32 }}>
              <h2 className="text-2xl font-bold mb-4">Quiz Final do Curso</h2>
              <Quiz
                questions={quiz.questions}
                onFinish={result => {
                  setQuizFinished(true);
                  setQuizResult(result);
                }}
              />
            </div>
          )}
          {currentIdx === tutorials.length - 1 && progress.includes(tutorial.id) && (!quiz || (quiz && quizFinished && quizResult?.approved)) && (
            <div style={{ marginTop: 32, color: "#22c55e", fontWeight: 600, fontSize: 18 }}>
              Parabéns! Você concluiu o curso 🎉
              <div style={{ marginTop: 24 }}>
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded"
                  onClick={handleFinishCourse}
                >
                  Finalizar curso
                </button>
              </div>
            </div>
          )}
          {currentIdx === tutorials.length - 1 && progress.includes(tutorial.id) && quiz && quizFinished && !quizResult?.approved && (
            <div style={{ marginTop: 32, color: "#dc2626", fontWeight: 600, fontSize: 18 }}>
              Você não atingiu a pontuação mínima no quiz. Tente novamente para concluir o curso.
            </div>
          )}

          {/* Botão de próximo tutorial (não exibe no último tutorial aprovado) */}
          {!(currentIdx === tutorials.length - 1 && progress.includes(tutorial.id) && (!quiz || (quiz && quizFinished && quizResult?.approved))) && (
            <div style={{ marginTop: 32, display: "flex", alignItems: "center", gap: 16 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  type="checkbox"
                  checked={progress.includes(tutorial.id)}
                  onChange={() => handleCheck(tutorial.id)}
                  disabled={progress.includes(tutorial.id)}
                />
                Marcar como concluído
              </label>
              <button
                style={{
                  background: "#2563eb",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  padding: "8px 18px",
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: progress.includes(tutorial.id) && currentIdx < tutorials.length - 1 ? "pointer" : "not-allowed",
                  opacity: progress.includes(tutorial.id) && currentIdx < tutorials.length - 1 ? 1 : 0.6,
                }}
                disabled={
                  !progress.includes(tutorial.id) ||
                  currentIdx === tutorials.length - 1
                }
                onClick={handleNext}
              >
                Próximo tutorial
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}