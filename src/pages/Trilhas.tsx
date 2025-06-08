import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockTrilhas } from "@/constants/trilhas";
import { mockCourses } from "@/constants/courses";
import { mockTutorials } from "@/constants/tutorials";
import { mockPosts } from "@/constants/blog";
import { mockVideos } from "@/constants/videos";
import { Button } from "@/components/ui/button";

function getItemTitle(item: any) {
  if (item.type === "curso") {
    const c = mockCourses.find(c => c.id === item.id);
    return c ? `[Curso] ${c.title}` : `[Curso]`;
  }
  if (item.type === "tutorial") {
    const t = mockTutorials.find(t => t.id === item.id);
    return t ? `[Tutorial] ${t.title}` : `[Tutorial]`;
  }
  if (item.type === "artigo") {
    const p = mockPosts.find(p => p.id === item.id);
    return p ? `[Artigo] ${p.title}` : `[Artigo]`;
  }
  if (item.type === "video") {
    const v = mockVideos.find(v => String(v.id) === String(item.id));
    return v ? `[Vídeo] ${v.title}` : `[Vídeo]`;
  }
  return "";
}

export default function Trilhas() {
  const [selectedId, setSelectedId] = useState(mockTrilhas.length > 0 ? mockTrilhas[0].id : "");
  const trilha = mockTrilhas.find(t => t.id === selectedId);
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Trilhas de Aprendizagem</h1>
      <div className="mb-6">
        <label htmlFor="trilha-select" className="font-semibold mr-2">Escolha uma trilha:</label>
        <select
          id="trilha-select"
          className="border rounded px-2 py-1"
          value={selectedId}
          onChange={e => setSelectedId(e.target.value)}
        >
          {mockTrilhas.map(trilha => (
            <option key={trilha.id} value={trilha.id}>
              {trilha.title}
            </option>
          ))}
        </select>
      </div>
      {trilha ? (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-2">{trilha.title}</h2>
          <div className="mb-4 text-gray-700">{trilha.description}</div>
          <Button
            className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => navigate(`/trilhas-progress/${trilha.id}`)}
          >
            Iniciar trilha
          </Button>
          <h3 className="text-lg font-semibold mb-2">Itens da Trilha</h3>
          <ol className="list-decimal ml-6 space-y-2">
            {trilha.items.map((item: any, idx: number) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="font-mono text-xs text-gray-500">#{idx + 1}</span>
                <span>{getItemTitle(item)}</span>
              </li>
            ))}
          </ol>
        </div>
      ) : (
        <div className="text-gray-500">Nenhuma trilha selecionada.</div>
      )}
    </div>
  );
}