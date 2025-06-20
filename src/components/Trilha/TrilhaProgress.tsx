import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { mockTrilhas } from "@/constants/trilhas";
import { mockCourses } from "@/constants/courses";
import { mockTutorials } from "@/constants/tutorials";
import { mockPosts } from "@/constants/blog";
import { mockVideos } from "@/constants/videos";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
const PLACEHOLDER_IMAGE = "https://placehold.co/600x300?text=Conteúdo";

function getProgressKey(trilhaId: string) {
  return `trilha-progress-${trilhaId}`;
}

// Expande a estrutura da trilha para incluir tutorias dos cursos como subitens
function expandTrilhaItems(items: any[]) {
  const expanded: any[] = [];
  items.forEach((item) => {
    if (item.type === "curso") {
      const course = mockCourses.find((c) => c.id === item.id);
      if (course) {
        expanded.push({
          ...item,
          isCourse: true,
          courseTitle: course.title,
          tutorials: course.tutorials || [],
        });
        // Adiciona cada tutorial do curso como subitem
        (course.tutorials || []).forEach((tutorialId: string) => {
          expanded.push({
            type: "tutorial",
            id: tutorialId,
            parentCourseId: course.id,
            isTutorialOfCourse: true,
          });
        });
      } else {
        expanded.push(item);
      }
    } else {
      expanded.push(item);
    }
  });
  return expanded;
}

function getItemData(item: any) {
  if (item.type === "curso") {
    const c = mockCourses.find(c => c.id === item.id);
    return c
      ? { title: c.title, description: c.description, type: "curso", tutorials: c.tutorials }
      : { title: "[Curso]", description: "", type: "curso", tutorials: [] };
  }
  if (item.type === "tutorial") {
    const t = mockTutorials.find(t => t.id === item.id);
    return t
      ? { title: t.title, description: t.description, markdown: t.markdown, type: "tutorial" }
      : { title: "[Tutorial]", description: "", markdown: "", type: "tutorial" };
  }
  if (item.type === "artigo") {
    const p = mockPosts.find(p => p.id === item.id);
    return p
      ? { title: p.title, description: p.description, markdown: p.content, type: "artigo" }
      : { title: "[Artigo]", description: "", markdown: "", type: "artigo" };
  }
  if (item.type === "video") {
    const v = mockVideos.find(v => String(v.id) === String(item.id));
    return v
      ? { title: v.title, description: "", videoUrl: v.url, youtubeId: v.youtubeId, type: "video" }
      : { title: "[Vídeo]", description: "", videoUrl: "", youtubeId: "", type: "video" };
  }
  return { title: "", description: "" };
}

export default function TrilhaProgress() {
  const { id, itemIdx } = useParams<{ id: string; itemIdx?: string }>();
  const navigate = useNavigate();
  const trilha = mockTrilhas.find(t => t.id === id);

  // Expande os itens da trilha para incluir tutorias dos cursos
  const expandedItems = trilha ? expandTrilhaItems(trilha.items) : [];
  const currentIdx = itemIdx ? Number(itemIdx) : 0;
  const currentItem = expandedItems[currentIdx];
  const itemData = currentItem ? getItemData(currentItem) : null;

  // Progresso salvo no localStorage
  const [progress, setProgress] = useState<number[]>([]);

  useEffect(() => {
    if (trilha) {
      const saved = localStorage.getItem(getProgressKey(trilha.id));
      setProgress(saved ? JSON.parse(saved) : []);
    }
  }, [trilha?.id]);

  // Marcar item como concluído
  const handleCheck = (idx: number) => {
    if (!progress.includes(idx)) {
      const updated = [...progress, idx];
      setProgress(updated);
      if (trilha) {
        localStorage.setItem(getProgressKey(trilha.id), JSON.stringify(updated));
      }
    }
  };

  // Ir para o próximo item
  const handleNext = () => {
    if (currentIdx < expandedItems.length - 1) {
      navigate(`/trilhas-progress/${trilha.id}/${currentIdx + 1}`);
    }
  };

  // Selecionar item na barra lateral (só permite se anterior e atual estiverem completos)
  const handleSelectItem = (idx: number) => {
    if (
      idx === currentIdx ||
      idx > currentIdx + 1 ||
      (idx > 0 && !progress.includes(idx - 1))
    ) {
      return;
    }
    navigate(`/trilhas-progress/${trilha.id}/${idx}`);
  };

  if (!trilha || !currentItem || !itemData) {
    return <div className="p-8 text-center text-red-500">Trilha ou item não encontrado.</div>;
  }

  // Para mostrar tutorias do curso no menu lateral
  function renderSidebarItems() {
    let idxCount = 0;
    return trilha.items.map((item, i) => {
      if (item.type === "curso") {
        const course = mockCourses.find(c => c.id === item.id);
        const isCurrentCourse = expandedItems[currentIdx]?.type === "curso" && expandedItems[currentIdx]?.id === item.id;
        const courseIdx = idxCount;
        idxCount++;
        return (
          <li key={`curso-${item.id}`}>
            <div
              style={{
                fontWeight: isCurrentCourse ? 700 : 600,
                color: isCurrentCourse ? "#2563eb" : "#222",
                background: isCurrentCourse ? "#e0e7ff" : "transparent",
                borderRadius: 6,
                padding: "4px 8px",
                cursor: progress.includes(courseIdx) || courseIdx === currentIdx ? "pointer" : "not-allowed",
                opacity: progress.includes(courseIdx) || courseIdx === currentIdx ? 1 : 0.6,
                marginBottom: 2,
              }}
              onClick={() => {
                if (courseIdx > currentIdx + 1 || (courseIdx > 0 && !progress.includes(courseIdx - 1))) return;
                navigate(`/trilhas-progress/${trilha.id}/${courseIdx}`);
              }}
            >
              {course ? `[Curso] ${course.title}` : "[Curso]"}
            </div>
            {/* Lista de tutorias do curso */}
            {course && course.tutorials && course.tutorials.length > 0 && (
              <ol style={{ listStyle: "decimal", paddingLeft: 18, fontSize: 15 }}>
                {course.tutorials.map((tutorialId: string, tIdx: number) => {
                  const tutorialIdx = idxCount;
                  const tutorial = mockTutorials.find(t => t.id === tutorialId);
                  const isCurrentTutorial =
                    expandedItems[currentIdx]?.type === "tutorial" &&
                    expandedItems[currentIdx]?.id === tutorialId &&
                    expandedItems[currentIdx]?.parentCourseId === course.id;
                  idxCount++;
                  return (
                    <li
                      key={`tutorial-${tutorialId}`}
                      style={{
                        marginBottom: 6,
                        cursor:
                          (progress.includes(tutorialIdx - 1) || tutorialIdx === 0) &&
                          (progress.includes(tutorialIdx) || tutorialIdx === currentIdx)
                            ? "pointer"
                            : "not-allowed",
                        color: isCurrentTutorial
                          ? "#2563eb"
                          : progress.includes(tutorialIdx)
                          ? "#22c55e"
                          : "#222",
                        fontWeight: isCurrentTutorial ? 700 : 400,
                        background: isCurrentTutorial ? "#e0e7ff" : "transparent",
                        borderRadius: 6,
                        padding: "4px 8px",
                        opacity:
                          progress.includes(tutorialIdx - 1) || tutorialIdx === 0
                            ? 1
                            : 0.6,
                      }}
                      onClick={() => {
                        if (
                          tutorialIdx > currentIdx + 1 ||
                          (tutorialIdx > 0 && !progress.includes(tutorialIdx - 1))
                        )
                          return;
                        navigate(`/trilhas-progress/${trilha.id}/${tutorialIdx}`);
                      }}
                    >
                      {tutorial ? `[Tutorial] ${tutorial.title}` : "[Tutorial]"}
                      {progress.includes(tutorialIdx) && (
                        <span title="Concluído" style={{ marginLeft: 8, color: "#22c55e", fontSize: 18 }}>✔</span>
                      )}
                    </li>
                  );
                })}
              </ol>
            )}
          </li>
        );
      } else {
        const label =
          item.type === "artigo"
            ? (() => {
                const p = mockPosts.find(p => p.id === item.id);
                return p ? `[Artigo] ${p.title}` : "[Artigo]";
              })()
            : item.type === "video"
            ? (() => {
                const v = mockVideos.find(v => String(v.id) === String(item.id));
                return v ? `[Vídeo] ${v.title}` : "[Vídeo]";
              })()
            : "";
        const isCurrent =
          expandedItems[currentIdx]?.type === item.type &&
          expandedItems[currentIdx]?.id === item.id;
        const thisIdx = idxCount;
        idxCount++;
        return (
          <li
            key={`${item.type}-${item.id}`}
            style={{
              marginBottom: 10,
              cursor: progress.includes(thisIdx - 1) || thisIdx === 0
                ? "pointer"
                : "not-allowed",
              color: isCurrent
                ? "#2563eb"
                : progress.includes(thisIdx)
                ? "#22c55e"
                : "#222",
              fontWeight: isCurrent ? 700 : 400,
              background: isCurrent ? "#e0e7ff" : "transparent",
              borderRadius: 6,
              padding: "4px 8px",
              opacity: progress.includes(thisIdx - 1) || thisIdx === 0 ? 1 : 0.6,
              display: "flex",
              alignItems: "center",
            }}
            onClick={() => {
              if (
                thisIdx > currentIdx + 1 ||
                (thisIdx > 0 && !progress.includes(thisIdx - 1))
              )
                return;
              navigate(`/trilhas-progress/${trilha.id}/${thisIdx}`);
            }}
          >
            <span style={{ flex: 1 }}>{label}</span>
            {progress.includes(thisIdx) && (
              <span title="Concluído" style={{ marginLeft: 8, color: "#22c55e", fontSize: 18 }}>✔</span>
            )}
          </li>
        );
      }
    });
  }

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
        <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 18 }}>{trilha.title}</div>
        <div style={{ fontSize: 15, color: "#666", marginBottom: 24 }}>{trilha.description}</div>
        <div style={{ fontWeight: 600, marginBottom: 8 }}>Progresso</div>
        <div style={{ marginBottom: 24 }}>
          <progress
            value={progress.length}
            max={expandedItems.length}
            style={{ width: "100%", height: 12, borderRadius: 8 }}
          />
          <div style={{ fontSize: 13, color: "#888", marginTop: 4 }}>
            {progress.length} de {expandedItems.length} itens concluídos
          </div>
        </div>
        <div style={{ fontWeight: 600, marginBottom: 8 }}>Itens da Trilha</div>
        <ol style={{ listStyle: "decimal", paddingLeft: 18, fontSize: 15, flex: 1, overflowY: "auto" }}>
          {renderSidebarItems()}
        </ol>
      </aside>

      {/* Conteúdo do item */}
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
          <h1 className="text-3xl font-bold mb-2">{itemData.title}</h1>
          {itemData.description && (
            <div className="mb-6 text-gray-700">{itemData.description}</div>
          )}
          {/* Renderização condicional do conteúdo */}
          {currentItem.type === "tutorial" ? (
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
              {itemData.markdown}
            </ReactMarkdown>
          ) : currentItem.type === "artigo" ? (
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
              {itemData.markdown}
            </ReactMarkdown>
          ) : currentItem.type === "video" && itemData.youtubeId ? (
            <div className="mb-6">
              <iframe
                width="100%"
                height="360"
                src={`https://www.youtube.com/embed/${itemData.youtubeId}`}
                title={itemData.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ borderRadius: 8, maxWidth: 650, margin: "0 auto", display: "block" }}
              />
            </div>
          ) : currentItem.type === "curso" ? (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Estrutura do Curso</h2>
              <ul className="list-disc ml-6">
                {itemData.tutorials && itemData.tutorials.length > 0 ? (
                  itemData.tutorials.map((tid: string, idx: number) => {
                    const tut = mockTutorials.find(t => t.id === tid);
                    return (
                      <li key={tid}>
                        {tut ? tut.title : "Tutorial"}
                      </li>
                    );
                  })
                ) : (
                  <li>Nenhum tutorial cadastrado para este curso.</li>
                )}
              </ul>
            </div>
          ) : null}

          <div style={{ marginTop: 32, display: "flex", alignItems: "center", gap: 16 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                type="checkbox"
                checked={progress.includes(currentIdx)}
                onChange={() => handleCheck(currentIdx)}
                disabled={progress.includes(currentIdx)}
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
                cursor: progress.includes(currentIdx) && currentIdx < expandedItems.length - 1 ? "pointer" : "not-allowed",
                opacity: progress.includes(currentIdx) && currentIdx < expandedItems.length - 1 ? 1 : 0.6,
              }}
              disabled={!progress.includes(currentIdx) || currentIdx === expandedItems.length - 1}
              onClick={handleNext}
            >
              Próximo item
            </button>
          </div>
          {currentIdx === expandedItems.length - 1 && progress.includes(currentIdx) && (
            <div style={{ marginTop: 32, color: "#22c55e", fontWeight: 600, fontSize: 18 }}>
              Parabéns! Você concluiu a trilha 🎉
            </div>
          )}
        </div>
      </main>
    </div>
  );
}